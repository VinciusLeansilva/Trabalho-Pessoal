import { LucideIcon, UploadCloud, FileText, CheckCircle2, PlaySquare } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityType = 'file_upload' | 'grade_submitted' | 'activity_created' | 'lesson_completed';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  timeAgo: string;
  icon?: LucideIcon;
}

const typeConfig = {
  file_upload: { icon: UploadCloud, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  grade_submitted: { icon: CheckCircle2, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  activity_created: { icon: FileText, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  lesson_completed: { icon: PlaySquare, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
};

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {activities.map((activity) => {
        const config = typeConfig[activity.type];
        const Icon = activity.icon || config.icon;
        
        return (
          <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10", config.color)}>
              <Icon className="w-4 h-4" />
            </div>
            
            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{activity.message}</span>
              </div>
              <time className="text-xs text-muted-foreground">{activity.timeAgo}</time>
            </div>
          </div>
        );
      })}
    </div>
  );
}
