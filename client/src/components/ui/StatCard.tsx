import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
  trend,
  className
}: StatCardProps) {
  return (
    <div className={cn("bg-[#1e1e1e] p-6 rounded-lg border border-gray-800", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-semibold mt-1 text-white">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-md", iconBgColor)}>
          <i className={cn(`ri-${icon}`, iconColor, "text-xl")}></i>
        </div>
      </div>
      {trend && (
        <div className="mt-2 text-xs flex items-center">
          {trend.positive ? (
            <i className="ri-arrow-up-line mr-1 text-green-400"></i>
          ) : (
            trend.value ? <i className="ri-arrow-down-line mr-1 text-red-400"></i> : null
          )}
          <span className={cn(
            trend.positive ? "text-green-400" : 
            trend.value ? "text-red-400" : "text-gray-400"
          )}>
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}
