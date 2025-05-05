import { cn } from "@/lib/utils";
import { Activity } from "@/lib/types";
import { Link } from "wouter";

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  className?: string;
}

export function ActivityFeed({ activities, loading = false, className }: ActivityFeedProps) {
  // Format relative time
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  };

  // Get icon and color for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deployment':
        return {
          icon: 'git-commit-line',
          bg: 'bg-[#0070f3] bg-opacity-20',
          color: 'text-[#0070f3]'
        };
      case 'build':
        return {
          icon: 'building-line',
          bg: 'bg-yellow-500 bg-opacity-20',
          color: 'text-yellow-500'
        };
      case 'database':
        return {
          icon: 'database-2-line',
          bg: 'bg-purple-500 bg-opacity-20',
          color: 'text-purple-500'
        };
      case 'domain':
        return {
          icon: 'global-line',
          bg: 'bg-green-500 bg-opacity-20',
          color: 'text-green-500'
        };
      case 'project':
        return {
          icon: 'folder-line',
          bg: 'bg-blue-500 bg-opacity-20',
          color: 'text-blue-500'
        };
      default:
        return {
          icon: 'information-line',
          bg: 'bg-gray-500 bg-opacity-20',
          color: 'text-gray-500'
        };
    }
  };

  if (loading) {
    return (
      <div className={cn("p-5 space-y-5", className)}>
        {[1, 2, 3, 4].map((item) => (
          <div className="flex animate-pulse" key={item}>
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            </div>
            <div className="w-full">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className={cn("p-5", className)}>
        <div className="text-center py-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
            <i className="ri-inbox-line text-gray-400 text-xl"></i>
          </div>
          <p className="text-gray-400">No activity yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-5 space-y-5", className)}>
      {activities.map((activity) => {
        const { icon, bg, color } = getActivityIcon(activity.type);
        return (
          <div className="flex" key={activity.id}>
            <div className="flex-shrink-0 mr-4">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", bg)}>
                <i className={cn(`ri-${icon}`, color)}></i>
              </div>
            </div>
            <div>
              <p className="text-sm text-white">
                {activity.description.includes('-') ? (
                  <>
                    <span className="font-medium">{activity.description.split('-')[0].trim()}</span>
                    <span className="text-[#0070f3]"> {activity.description.split('-')[1].trim()}</span>
                  </>
                ) : (
                  <span>{activity.description}</span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">{getRelativeTime(activity.createdAt)}</p>
            </div>
          </div>
        );
      })}

      <div className="pt-2">
        <Link href="/logs" className="text-[#0070f3] text-sm hover:underline">
          View all activity
        </Link>
      </div>
    </div>
  );
}
