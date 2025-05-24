"use client"

import React from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  edit: "Edit Project",
  new: "New",
  users: "Users",
  settings: "Settings",
}

function toTitleCase(str: string) {
  return str.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

export const DynamicBreadcrumb = () => {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbSegments = segments[0] === "dashboard" ? segments.slice(1) : segments

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbSegments.map((segment, index) => {
          const href = `/dashboard/${breadcrumbSegments.slice(0, index + 1).join("/")}`
          const isLast = index === breadcrumbSegments.length - 1
          const label = labels[segment] || toTitleCase(segment)

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
