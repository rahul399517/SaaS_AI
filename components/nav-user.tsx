"use client"
import Link from "next/link"
import {
    BadgeCheck,
    ChevronsUpDown,
    LogOut,
    Settings,
    // Lock,
} from "lucide-react"
import Image from "next/image";
import {
    Avatar,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import userImg from "../public/images/userImg.png"
export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    const { isMobile } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-14 px-4 bg-[#FAFAFA]"
                        >
                            <Avatar className="h-10 w-10 rounded-full justify-center items-center">
                                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                                {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                                <Image
                                    loading="lazy"
                                    src={userImg}
                                    width="40"
                                    height="40"
                                    className="duration-500 userImg-sideBar"
                                    alt="user photo"
                                />
                                <Settings className="settingIcon duration-500 text-[#71717A] h-5 w-5" />
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold text-sidebar-foreground">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-10 w-10 rounded-full">
                                    {/* <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                                    <Image
                                        loading="lazy"
                                        src={userImg}
                                        width="40"
                                        height="40"
                                        className="duration-500 userImg-sideBar"
                                        alt="user photo"
                                    />
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight text-sidebar-foreground">
                                    <span className="truncate font-semibold">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />

                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href="/login" className="flex gap-2">
                                <LogOut />
                                Log out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
