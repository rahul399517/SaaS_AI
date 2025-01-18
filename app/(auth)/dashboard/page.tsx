import { Metadata } from "next"
import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { Truck, UsersRound, LayoutGrid, IndianRupee } from "lucide-react"
import { Overview } from "./overview"
import { RecentSales } from "./recent"


export const metadata: Metadata = {
    title: "Dashboard",
    description: "Example dashboard app built using the components.",
}

export default function Dashboard() {
    return (
        <>
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-r from-[#0a77ff] to-[#014dab] text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <IndianRupee className="h-8 w-8 text-white" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-white">
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-r from-[#b82c87] to-[#a6056d] text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Vehicle
                            </CardTitle>
                            <Truck className="h-8 w-8 text-white"/>
                            
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2350</div>
                            <p className="text-xs text-white">
                                +180.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-r from-[#02a295] to-[#007947] text-white">                    
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Customer</CardTitle>
                            <UsersRound className="h-8 w-8 text-white" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12,234</div>
                            <p className="text-xs text-white">
                                +19% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-r from-[#ec6719] to-[#d24e00] text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Customer Brand
                            </CardTitle>
                            <LayoutGrid className="h-8 w-8 text-white" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+573</div>
                            <p className="text-xs text-white">
                                +201 from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Overview />
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Sales</CardTitle>
                            <CardDescription>
                                You made 265 sales this month.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentSales />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}