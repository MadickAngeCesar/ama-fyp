"use client"

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
			<h1 className="text-lg font-semibold text-text-primary truncate">{title}</h1>
			<div className="flex items-center gap-4">
				<StudentNotificationsSheet />
				<StudentSettingsSheet />
			</div>
		</header>
	)
}
