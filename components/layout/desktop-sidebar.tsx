"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  FileText,
  Lightbulb,
  Users,
  Settings,
  Activity,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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

import { cn } from "@/lib/utils";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";

/**
 * Props for Sidebar
 */
export type SidebarProps = {
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
  active,
  className,
  primaryItems,
  secondaryItems,
  portal,
}: SidebarProps & {
  primaryItems: SidebarNavItem[];
  secondaryItems: SidebarNavItem[];
}) {
  const { t } = useTranslation();
  const pathname = usePathname() ?? "/";
  const current = active ?? pathname;

  const iconMap: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  > = {
    home: Home,
    dashboard: Home,
    chat: MessageCircle,
    complaint: FileText,
    suggestion: Lightbulb,
    audit: Activity,
    users: Users,
    configuration: Settings,
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

  const { user } = useUser();
  const { signOut } = useClerk();
  const [role, setRole] = React.useState("");

  React.useEffect(() => {
    fetch("/api/users/role")
      .then((res) => res.json())
      .then((data) => setRole(data.role || ""))
      .catch(console.error);
  }, []);

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
          <Link href="/" className="flex flex-row items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-semibold text-primary-foreground">
                AF
              </span>
            </div>
            <div>
              <div className="text-base font-semibold">
                {t("sidebar.appName")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("sidebar.portal", { portal })}
              </div>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-3 py-2">
          <SidebarMenu>
            <div className="mb-2 px-1 text-xs font-medium text-muted-foreground">
              {t("sidebar.main")}
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
                    <span className="truncate">{t(`nav.${it.icon}`)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <div className="my-3 mx-1 h-px bg-border/30" />

            <div className="mb-2 px-1 text-xs font-medium text-muted-foreground">
              {t("sidebar.explore")}
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
                    <span className="truncate">{t(`nav.${it.icon}`)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="mt-auto px-4 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    userButtonBox: "bg-surface",
                    userButtonPopoverCard:
                      "bg-surface border border-border text-text-primary",
                    userButtonActionButton:
                      "hover:bg-surface-muted text-text-primary hover:text-primary",
                  },
                }}
              />
              <div>
                <div className="text-sm font-medium">
                  {user
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      t("sidebar.guest")
                    : t("sidebar.guest")}
                </div>
                <div className="text-xs text-muted-foreground">{role}</div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-surface-muted cursor-pointer"
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
