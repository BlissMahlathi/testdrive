
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface VendorStats {
  total_sales: number;
  total_orders: number;
  rating: number;
}

interface VendorPerformanceChartProps {
  stats: VendorStats;
}

const VendorPerformanceChart = ({ stats }: VendorPerformanceChartProps) => {
  const chartData = [
    {
      metric: "Sales",
      value: stats.total_sales || 0,
      fill: "hsl(var(--chart-1))",
    },
    {
      metric: "Orders",
      value: stats.total_orders || 0,
      fill: "hsl(var(--chart-2))",
    },
    {
      metric: "Rating",
      value: (stats.rating || 0) * 20, // Scale rating to 0-100 for better visualization
      fill: "hsl(var(--chart-3))",
    },
  ];

  const chartConfig = {
    value: {
      label: "Value",
    },
    Sales: {
      label: "Total Sales ($)",
      color: "hsl(var(--chart-1))",
    },
    Orders: {
      label: "Total Orders",
      color: "hsl(var(--chart-2))",
    },
    Rating: {
      label: "Rating (x20)",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="metric" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${stats.total_sales || 0}</p>
            <p className="text-sm text-muted-foreground">Total Sales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total_orders || 0}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.rating || 0}/5</p>
            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorPerformanceChart;
