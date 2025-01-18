"use client";

import * as React from "react";
import { ListFilter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function Filter() {
    const [showFilter, setShowFilter] = React.useState(false);

    return (
        <div>
            <Button variant="outline" onClick={() => setShowFilter(true)}>
                <ListFilter className="!w-6 !h-6" /> Filter
            </Button>

            {/* Filter Panel */}
            {showFilter && (
                <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 border-l">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 bg-foreground p-4">
                        <h2 className="text-lg font-semibold text-white">Filters</h2>
                        <Button variant="ghost" size="sm" onClick={() => setShowFilter(false)} className="text-white hover:text-foreground">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Filter Content */}
                    <div className="mt-4 space-y-6  p-4">
                        {/* Search Filter */}
                        {/* <div>
                            <Label htmlFor="search">Search</Label>
                            <Input id="search" placeholder="Type to search..." />
                        </div> */}

                        {/* Category Filter */}
                        <div>
                            <Label className="text-base">Customer Brand</Label>
                            <div className="space-y-2 mt-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="brand1" />
                                    <Label htmlFor="brand1">Brand 1</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="brand2" />
                                    <Label htmlFor="brand2">Brand 2</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="brand3" />
                                    <Label htmlFor="brand3">Brand 3</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="brand4" />
                                    <Label htmlFor="brand4">Brand 4</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="brand5" />
                                    <Label htmlFor="brand5">Brand 5</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="brand6" />
                                    <Label htmlFor="brand6">Brand 6</Label>
                                </div>
                                
                            </div>
                        </div>

                        
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                        <Button variant="outline" onClick={() => setShowFilter(false)}>
                            Cancel
                        </Button>
                        <Button>Apply</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
