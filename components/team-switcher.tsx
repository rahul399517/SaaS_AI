"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image";
import LogoIcon from "../public/images/logoSmall.svg";
import LogoText from "../public/images/logoText.svg";
export function TeamSwitcher({
  // teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  // const { isMobile } = useSidebar()
  // const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem className="sidebar-logo-h h-[38px]">
        <SidebarMenuButton
          size="lg"
          className="[collapsible=icon]:!size-[38px] data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground !w-full "
        >
          <div className="flex aspect-square size-[38px]">
            <Image
              loading="lazy"
              src={LogoIcon}
              width="38"
              height="38"
              className="duration-500"
              alt="logo"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              <Image
                loading="lazy"
                src={LogoText}
                width="110"
                alt="logo text"
                className="duration-500 w-28"
              />
            </span>
          </div>
        </SidebarMenuButton>
         
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
