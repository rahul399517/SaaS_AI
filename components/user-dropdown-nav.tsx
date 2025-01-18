"use client"

import {
  LogOut,
  User,
  Settings,
  ChevronDown,
  Lock,
  CircleHelp,
} from "lucide-react"
import Image from "next/image";
import { Button } from "@/components/ui/button"
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
import userImg from "../public/images/userImg.png"
export function UserMenuDropdown() {


  return (
     <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 gap-1.5">
              <Avatar className="h-11 w-11 rounded-full justify-center items-center">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                  <Image
                    loading="lazy"
                    src={userImg}
                    width="44"
                    height="44"
                    className="duration-500"
                    alt="user photo"
                  />
              </Avatar>
              <ChevronDown className="text-muted-foreground"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 p-0 border-[#E4E4E7]">
            <DropdownMenuLabel className="p-0 font-normal bg-muted border-b-[#E4E4E7] border-b border-solid">
              <div className="flex items-center gap-2 p-3 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  {/* <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                  <Image
                    loading="lazy"
                    src={userImg}
                    width="32"
                    height="32"
                    className="duration-500 userImg-sideBar"
                    alt="user photo"
                  />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight text-sidebar-foreground">
                  <span className="truncate font-semibold">ACME Powersports</span>
                  <span className="truncate text-xs">John Doe</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup className="p-3">
              <DropdownMenuItem>
                <User />
                <span>Profile</span>
                
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                <span>Account Settings</span>
                
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Lock />
                <span>Security</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CircleHelp />
                <span>Help Center</span>
              </DropdownMenuItem>
             
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-0"/>
            <DropdownMenuGroup className="px-3 py-1">
              <DropdownMenuItem className="text-[#FF0000]">
                <LogOut />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
          </DropdownMenuContent>
        </DropdownMenu>
  )
}
