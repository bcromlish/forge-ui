import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/** Navigation item in the sidebar. */
interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

/** Props for {@link DashboardLayout}. */
interface DashboardLayoutProps {
  navigation: NavItem[];
  user?: { email: string };
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Full dashboard layout with sidebar navigation + header + content area.
 * Pure component — no hooks, accepts navigation and user data as props.
 */
export function DashboardLayout({
  navigation,
  header,
  children,
  className,
}: DashboardLayoutProps) {
  return (
    <div className={cn("flex h-screen", className)}>
      <aside className="w-64 flex-shrink-0 border-r bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-4 font-semibold border-b border-sidebar-border">
          VidCruiter ATS
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-body transition-colors",
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              )}
            >
              {item.icon && (
                <span className="[&_svg]:size-4">{item.icon}</span>
              )}
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        {header}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
