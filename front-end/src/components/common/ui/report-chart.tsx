"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format-price";

interface RevenueChartProps {
    data: { date: string; revenue: number }[];
}

export function RevenueAreaChart({ data }: RevenueChartProps) {
    // @ts-ignore
    return (
        <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id="colorRevenue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#000"
                                stopOpacity={0.1}
                            />
                            <stop
                                offset="95%"
                                stopColor="#000"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        dy={10}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickFormatter={(value) => `${value / 1000000}M`}
                        width={40}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value: number) => [
                            formatCurrency(value),
                            "Doanh thu",
                        ]}
                    />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#000"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
