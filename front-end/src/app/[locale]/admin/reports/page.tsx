"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Loader2 } from "lucide-react";
import { DateRangePicker } from "@/components/common/ui/date-range-picker";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useReportsAndAnalytics } from "@/hooks/use-reports";
import { formatCurrency } from "@/lib/format-price";
import { RevenueAreaChart } from "@/components/common/ui/report-chart";
import { useTranslations } from "next-intl";

export default function ReportsAnalyticsPage() {
    const t = useTranslations("reports");
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    // Chuyển đổi Date sang định dạng yyyy-MM-dd cho Request
    const reportParams = {
        startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
        endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    };

    const {
        data: reportData,
        isLoading,
        isError,
    } = useReportsAndAnalytics(reportParams);

    const kpiStats = useMemo(() => {
        //@ts-ignore
        if (!reportData?.kpis) return [];
        //@ts-ignore
        const { kpis } = reportData;
        return [
            {
                title: t("totalRevenue"),
                value: formatCurrency(kpis.totalRevenue),
                isPositive: true,
            },
            {
                title: t("successfulOrders"),
                value: kpis.successfulOrders.toLocaleString(),
                isPositive: true,
            },
            {
                title: t("conversionRate"),
                value: `${Math.round(kpis.conversionRate)}%`,
                isPositive: false,
            },
            {
                title: t("averageOrderValue"),
                value: formatCurrency(kpis.averageOrderValue),
                isPositive: true,
            },
        ];
    }, [reportData, t]);

    return (
        <div className="mx-auto w-full space-y-12 p-6 md:p-10">
            {/* Header Area */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-foreground text-3xl font-semibold tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        {t("description")}
                    </p>
                </div>

                <div className="flex w-full items-center gap-3 md:w-auto">
                    <DateRangePicker
                        date={dateRange}
                        onDateChange={setDateRange}
                    />
                </div>
            </div>

            {/* Trạng thái Loading / Error */}
            {isLoading ? (
                <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
                    <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground animate-pulse text-sm">
                        {t("loading")}
                    </p>
                </div>
            ) : isError ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400">
                    {t("error")}
                </div>
            ) : (
                <>
                    {/* KPI Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {kpiStats.map((stat, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-card/50 hover:bg-card shadow-sm transition-colors"
                            >
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-muted-foreground text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-semibold tracking-tight">
                                        {stat.value}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Biểu đồ doanh thu */}
                        <Card className="border-border/50 bg-card/50 col-span-1 shadow-sm lg:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-light">
                                        {t("revenueChart.titlePrefix")}{" "}
                                        <span
                                            className={
                                                "text-base font-semibold"
                                            }
                                        >
                                            {reportParams.startDate}
                                        </span>{" "}
                                        {t("revenueChart.titleMiddle")}{" "}
                                        <span
                                            className={
                                                "text-base font-semibold"
                                            }
                                        >
                                            {reportParams.endDate}
                                        </span>
                                    </CardTitle>
                                </div>
                                <BarChart3 className="text-muted-foreground h-5 w-5" />
                            </CardHeader>
                            <CardContent>
                                {
                                    //@ts-ignore
                                    reportData?.revenueChart?.length > 0 ? (
                                        <RevenueAreaChart
                                            //@ts-ignore
                                            data={reportData?.revenueChart}
                                        />
                                    ) : (
                                        <div className="text-muted-foreground flex h-64 w-full items-center justify-center">
                                            {t("revenueChart.noData")}
                                        </div>
                                    )
                                }
                            </CardContent>
                        </Card>

                        {/* Top Products */}
                        <Card className="border-border/50 bg-card/50 col-span-1 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">
                                    {t("topProducts.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {
                                    //@ts-ignore
                                    reportData?.topProducts?.length > 0 ? (
                                        //@ts-ignore
                                        reportData?.topProducts?.map(
                                            (product: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="max-w-37.5 truncate font-medium">
                                                            {
                                                                product.productName
                                                            }
                                                        </span>
                                                        <span className="text-muted-foreground font-semibold">
                                                            {formatCurrency(
                                                                product.totalRevenue
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="bg-muted dark:bg-slate-800 h-2 w-full overflow-hidden rounded-full">
                                                        <div
                                                            className="bg-foreground dark:bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
                                                            style={{
                                                                width: `${product.percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="text-muted-foreground text-[10px] tracking-wider uppercase">
                                                        {product.totalSales}{" "}
                                                        {t("topProducts.salesCount")}
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="text-muted-foreground flex h-64 w-full items-center justify-center">
                                            {t("topProducts.noData")}
                                        </div>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
