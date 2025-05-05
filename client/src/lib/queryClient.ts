import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper function to check if a port is available
async function checkPortAvailability(port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/api/health`, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    });
    return true;
  } catch (e) {
    return false;
  }
}

// Function to get the server URL, trying different ports if needed
export async function getServerUrl(): Promise<string> {
  // In Replit environments, we should be able to use port 5000 (thanks to our proxy)
  // or fall back to port 8080 (our actual server)
  const possiblePorts = [5000, 8080];
  
  // For development, try specific ports
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('.replit.dev')) {
    for (const port of possiblePorts) {
      if (await checkPortAvailability(port)) {
        return `http://${window.location.hostname}:${port}`;
      }
    }
  }
  
  // Default to using the current origin
  return window.location.origin;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Ensure URLs starting with /api use the correct server URL
  const baseUrl = url.startsWith('/api') ? await getServerUrl() : '';
  const fullUrl = `${baseUrl}${url}`;
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    // Ensure URLs starting with /api use the correct server URL
    const baseUrl = url.startsWith('/api') ? await getServerUrl() : '';
    const fullUrl = `${baseUrl}${url}`;
    
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
