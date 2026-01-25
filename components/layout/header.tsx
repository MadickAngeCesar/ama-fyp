import * as React from "react"
import { cn } from "@/lib/utils"
import SettingsSheet from "@/components/layout/setting"
import NotificationsSheet from "@/components/layout/notifications"

/**
 * Props for Header
 */
export type HeaderProps = {
	/** Page title */
	title?: string
	/** Current user (optional) */
	user?: {
		name?: string
		image?: string
	}
	/** Optional className */
	className?: string
	/** Portal name to display in mobile view */
	portal: string
}

/**
 * Header
 *
 * Renders a top header bar for student pages with title, notification icon, and user avatar.
 */
export default function Header({ title = "Student Dashboard", portal , className }: HeaderProps) {
	return (
		<header
			className={cn(
				"flex items-center justify-between border-b border-border bg-surface px-6 py-3",
				className
			)}
		>
			<h1 className="hidden md:block text-lg font-semibold text-text-primary truncate">{title}</h1>
			{/* Mobile: show app logo + name instead of page title */}
			<div className="items-center gap-3 flex md:hidden">
				<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
					<span className="text-sm font-semibold text-primary-foreground">AF</span>
				</div>
				<div>
					<div className="text-sm font-semibold">AMA FYP</div>
					<div className="text-xs text-muted-foreground">{portal} Portal</div>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<NotificationsSheet />
				<SettingsSheet />
			</div>
		</header>
	)
}
