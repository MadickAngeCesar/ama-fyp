import * as React from "react"
import { cn } from "@/lib/utils"
import StudentSettingsSheet from "@/components/layout/students/setting"
import StudentNotificationsSheet from "@/components/layout/students/notifications"

/**
 * Props for StudentHeader
 */
export type StudentHeaderProps = {
	/** Page title */
	title?: string
	/** Current user (optional) */
	user?: {
		name?: string
		image?: string
	}
	/** Optional className */
	className?: string
}

/**
 * StudentHeader
 *
 * Renders a top header bar for student pages with title, notification icon, and user avatar.
 */
export default function StudentHeader({ title = "Student Dashboard", className }: StudentHeaderProps) {
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
					<div className="text-xs text-muted-foreground">Student Portal</div>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<StudentNotificationsSheet />
				<StudentSettingsSheet />
			</div>
		</header>
	)
}
