"use client"

import { Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
const chartData = [
  { browser: "vehicle", visitors: 275, fill: "#3CC3DF" },
  { browser: "tripnumber", visitors: 200, fill: "#8979FF" },
  { browser: "customerbrand", visitors: 187, fill: "#FF928A" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  vehicle: {
    label: "Vehicle",
    color: "red",
  },
  tripnumber: {
    label: "Trip Number",
    color: "red",
  },
  customerbrand: {
    label: "Customer Brand",
    color: "red",
  },
} satisfies ChartConfig

export function ChartReport() {
  return (
    <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="visitors" />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
            
          </PieChart>
        </ChartContainer>
  )
}
