"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, FileText, Lightbulb, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

/**
 * Props for Sidebar
 */
export type SidebarProps = {
  /** Current authenticated user (optional) */
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  /** Currently active path used to mark active nav item */
  active?: string;
  /** Additional className for outer container */
  className?: string;
  /** Portal name to display in sidebar header */
  portal: string;
};

/**
 * Sidebar
 *
 * Renders a three-section sidebar using the shadcn-style Sidebar primitives:
 * - Header: app logo/name
 * - Content: navigation menu
 * - Footer: user avatar and name
 */
export type SidebarNavItem = {
  label: string;
  href: string;
  icon?: string;
  portal?: string;
};

export default function DesktopSidebar({
  user,
  active,
  className,
  primaryItems: primaryItemsProp,
  secondaryItems: secondaryItemsProp,
  portal,
}: SidebarProps & {
  primaryItems?: SidebarNavItem[];
  secondaryItems?: SidebarNavItem[];
}) {
  const pathname = usePathname() ?? "/";
  const current = active ?? pathname;

  const primaryItems = React.useMemo(
    () =>
      primaryItemsProp ?? [
        { label: "Dashboard", href: "/students", icon: "home" },
        { label: "Chat", href: "/students/chat", icon: "chat" },
      ],
    [primaryItemsProp],
  );

  const secondaryItems = React.useMemo(
    () =>
      secondaryItemsProp ?? [
        { label: "Complaints", href: "/students/complaint", icon: "complaint" },
        {
          label: "Suggestions",
          href: "/students/suggestion",
          icon: "suggestion",
        },
      ],
    [secondaryItemsProp],
  );

  const iconMap: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  > = {
    home: Home,
    chat: MessageCircle,
    complaint: FileText,
    suggestion: Lightbulb,
  };

  const allItems = React.useMemo(
    () => [...primaryItems, ...secondaryItems],
    [primaryItems, secondaryItems],
  );

  const activeHref = React.useMemo(() => {
    // Find the most specific matching href
    let bestMatch = "";
    for (const item of allItems) {
      if (current === item.href || current.startsWith(item.href + "/")) {
        if (item.href.length > bestMatch.length) {
          bestMatch = item.href;
        }
      }
    }
    return bestMatch;
  }, [current, allItems]);

  const isActive = (href: string) => href === activeHref;

  const [, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const router = useRouter();

  // Do not return a placeholder; always render the sidebar tree for SSR/CSR consistency

  return (
    <SidebarProvider>
      <Sidebar
        aria-label={`${portal} navigation`}
        className={cn(
          "flex h-full w-72 flex-col bg-surface text-text-primary border-r border-border",
          className,
        )}
        data-role="student-sidebar"
      >
        <SidebarHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-semibold text-primary-foreground">
                AF
              </span>
            </div>
            <div>
              <div className="text-base font-semibold">AMA FYP</div>
              <div className="text-xs text-muted-foreground">
                {portal} Portal
              </div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-2">
          <SidebarMenu>
            <div className="mb-2 px-1 text-xs font-medium text-muted-foreground">
              Main
            </div>
            {primaryItems.map((it) => (
              <SidebarMenuItem key={it.href}>
                <SidebarMenuButton asChild isActive={isActive(it.href)}>
                  <Link
                    href={it.href}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm",
                      isActive(it.href)
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-surface-muted",
                    )}
                    aria-current={isActive(it.href) ? "page" : undefined}
                  >
                    {(() => {
                      const Icon = iconMap[it.icon ?? "home"] ?? Home;
                      return <Icon className="size-4" />;
                    })()}
                    <span className="truncate">{it.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <div className="my-3 mx-1 h-px bg-border/30" />

            <div className="mb-2 px-1 text-xs font-medium text-muted-foreground">
              Explore
            </div>
            {secondaryItems.map((it) => (
              <SidebarMenuItem key={it.href}>
                <SidebarMenuButton asChild isActive={isActive(it.href)}>
                  <Link
                    href={it.href}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm",
                      isActive(it.href)
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-surface-muted",
                    )}
                    aria-current={isActive(it.href) ? "page" : undefined}
                  >
                    {(() => {
                      const Icon = iconMap[it.icon ?? "home"] ?? Home;
                      return <Icon className="size-4" />;
                    })()}
                    <span className="truncate">{it.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="mt-auto px-4 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar>
              {user?.image ? (
                <AvatarImage src={user.image} alt={user.name ?? "User"} />
              ) : (
                <AvatarFallback>{(user?.name ?? "?")[0]}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium">{user?.name ?? "Guest"}</div>
              {user?.email ? (
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">Student</div>
              )}
            </div>

            <button
              onClick={() => router.push('/signin')}
              className="-mr-2 rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-surface-muted cursor-pointer"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
