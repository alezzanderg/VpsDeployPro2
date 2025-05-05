import { cn } from "@/lib/utils";
import { SystemMetric } from "@/lib/types";

interface ResourceUsageProps {
  metrics?: SystemMetric;
  loading?: boolean;
  className?: string;
}

export function ResourceUsage({ metrics, loading = false, className }: ResourceUsageProps) {
  if (loading) {
    return (
      <div className={cn("p-5 space-y-5", className)}>
        {[1, 2, 3, 4].map((item) => (
          <div className="animate-pulse" key={item}>
            <div className="flex justify-between mb-2">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/6"></div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={cn("p-5", className)}>
        <div className="text-center py-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
            <i className="ri-error-warning-line text-gray-400 text-xl"></i>
          </div>
          <p className="text-gray-400">No metrics available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-5 space-y-5", className)}>
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">CPU Usage</span>
          <span className="text-sm font-medium text-white">{metrics.cpuUsage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-[#0070f3] h-2.5 rounded-full" 
            style={{ width: `${metrics.cpuUsage}%` }}
          ></div>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Memory Usage</span>
          <span className="text-sm font-medium text-white">{metrics.memoryUsage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-[#6366f1] h-2.5 rounded-full" 
            style={{ width: `${metrics.memoryUsage}%` }}
          ></div>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Disk Usage</span>
          <span className="text-sm font-medium text-white">{metrics.diskUsage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-[#10b981] h-2.5 rounded-full" 
            style={{ width: `${metrics.diskUsage}%` }}
          ></div>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Network (30d)</span>
          <span className="text-sm font-medium text-white">{metrics.networkUsage}GB</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-[#f59e0b] h-2.5 rounded-full" 
            style={{ width: `${metrics.networkUsage > 400 ? 100 : (metrics.networkUsage / 4)}%` }}
          ></div>
        </div>
      </div>

      <div className="pt-2">
        <a href="#" className="text-[#0070f3] text-sm hover:underline">View detailed metrics</a>
      </div>
    </div>
  );
}
