import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// We directly use port 5000 without checking port availability

// Function to get the server URL
export function getServerUrl(): string {
  // Always use port 5000 for our application
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('.replit.dev')) {
    return `http://${window.location.hostname}:5000`;
  }
  
  // Default to using the current origin for production
  return window.location.origin;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    // Ensure URLs starting with /api use the correct server URL
    const baseUrl = url.startsWith('/api') ? getServerUrl() : '';
    const fullUrl = `${baseUrl}${url}`;
    
    console.log(`Making ${method} request to: ${fullUrl}`);
    
    const res = await fetch(fullUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      mode: "cors"
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const url = queryKey[0] as string;
      // Ensure URLs starting with /api use the correct server URL
      const baseUrl = url.startsWith('/api') ? getServerUrl() : '';
      const fullUrl = `${baseUrl}${url}`;
      
      console.log(`Making GET request to: ${fullUrl}`);
      
      const res = await fetch(fullUrl, {
        credentials: "include",
        mode: "cors"
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error("Query failed:", error);
      throw error;
    }
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
