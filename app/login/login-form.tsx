"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UserAuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn("grid lg:gap-6 gap-3", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid lg:gap-6 gap-3">
            <div className="grid gap-2">
                <Label className="text-foreground" htmlFor="email">
                    Email
                </Label>
                <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                />
            </div>
            <div className="grid gap-2">
                <div className="flex justify-between items-end">
                    <Label className="text-foreground" htmlFor="password">
                        Password
                    </Label>
                    <Link
                        href="/"
                        className="underline text-sm underline-offset-4 text-muted-foreground hover:text-primaryColor"
                        >
                        Forgot your password?
                    </Link>
                </div>
                <Input
                id="password"
                placeholder="Password"
                type="password"
                />
            </div>
            <div>
                <Button disabled={isLoading} className="!bg-primaryColor w-full text-primary-foreground">
                {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin !bg-primaryColor" />
                )}
                Sign In
            </Button>
            </div>
          </div>
          
        </div>
      </form>
    </div>
  )
}
