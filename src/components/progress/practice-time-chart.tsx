"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { PracticeTime } from "@/hooks/useProgress";

interface PracticeTimeChartProps {
  data: PracticeTime[];
}

const chartConfig = {
  minutes: {
    label: "Minutes",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export const PracticeTimeChart = ({ data }: PracticeTimeChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold">
            Overall practice time
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aggregated amount of your practice time.
          </p>

          {/* Time Filter Buttons */}
          <div className="flex space-x-1 mt-4">
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
            >
              7 days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-3 py-1 h-auto"
            >
              28 days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-3 py-1 h-auto"
            >
              All time
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ChartContainer config={chartConfig}>
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="practiceTimeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
              />
              <YAxis hide />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `${value} ago`}
                cursor={{ stroke: "#8B5CF6", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#8B5CF6"
                fill="url(#practiceTimeGradient)"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 0, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "#8B5CF6",
                  strokeWidth: 2,
                  fill: "#fff",
                }}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Last 7 days info */}
        <div className="mt-4 text-xs text-muted-foreground">
          Last 7 days: 22 Jun - 28 Jun
        </div>
      </CardContent>
    </Card>
  );
};
