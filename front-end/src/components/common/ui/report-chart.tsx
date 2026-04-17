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
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface RevenueChartProps {
    data: { date: string; revenue: number }[];
}

export function RevenueAreaChart({ data }: RevenueChartProps) {
    const { resolvedTheme } = useTheme();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setIsDarkMode(resolvedTheme === "dark");
    }, [resolvedTheme]);

    const chartColor = isDarkMode ? "#3b82f6" : "#000"; // blue-500 for dark, black for light
    const gridColor = isDarkMode ? "#1e293b" : "#e5e7eb"; // slate-800 for dark
    const textColor = isDarkMode ? "#94a3b8" : "#6b7280"; // slate-400 for dark
    const tooltipBg = isDarkMode ? "#0f172a" : "#fff"; // slate-900 for dark
    const tooltipBorder = isDarkMode ? "#1e293b" : "#e5e7eb";

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
                                stopColor={chartColor}
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor={chartColor}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={gridColor}
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: textColor }}
                        dy={10}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: textColor }}
                        tickFormatter={(value) => `${value / 1000000}M`}
                        width={40}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: tooltipBg,
                            borderRadius: "8px",
                            border: `1px solid ${tooltipBorder}`,
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            color: isDarkMode ? "#f8fafc" : "#0f172a",
                        }}
                        // @ts-ignore
                        formatter={(value: number) => [
                            formatCurrency(value),
                            "Doanh thu",
                        ]}
                    />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={chartColor}
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
