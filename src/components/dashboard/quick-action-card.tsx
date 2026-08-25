import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
}

export function QuickActionCard({ title, description, icon: Icon, href, color }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md hover:border-primary/50 transition-all duration-200 h-full group cursor-pointer">
        <CardContent className="p-5 flex flex-col items-start gap-3">
          <div className={cn("p-2.5 rounded-lg transition-colors duration-200 group-hover:scale-110", color)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
