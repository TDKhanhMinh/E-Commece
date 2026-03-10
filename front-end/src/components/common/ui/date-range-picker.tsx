"use client";

import * as React from "react";
import {
    endOfMonth,
    endOfWeek,
    format,
    startOfMonth,
    startOfWeek,
    subDays,
    subMonths,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    date?: DateRange;
    onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
    className,
    date,
    onDateChange,
}: DateRangePickerProps) {
    const [internalDate, setInternalDate] = React.useState<
        DateRange | undefined
    >({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    const selectedDate = date !== undefined ? date : internalDate;
    const setDate = onDateChange || setInternalDate;

    const presets = [
        {
            label: "Hôm nay",
            getValue: () => ({ from: new Date(), to: new Date() }),
        },
        {
            label: "Hôm qua",
            getValue: () => ({
                from: subDays(new Date(), 1),
                to: subDays(new Date(), 1),
            }),
        },
        {
            label: "Tuần này",
            getValue: () => ({
                from: startOfWeek(new Date(), { weekStartsOn: 1 }),
                to: endOfWeek(new Date(), { weekStartsOn: 1 }),
            }),
        },
        {
            label: "Tháng này",
            getValue: () => ({
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date()),
            }),
        },
        {
            label: "Tháng trước",
            getValue: () => ({
                from: startOfMonth(subMonths(new Date(), 1)),
                to: endOfMonth(subMonths(new Date(), 1)),
            }),
        },
        {
            label: "7 ngày qua",
            getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }),
        },
    ];

    const getDisplayText = () => {
        if (selectedDate?.from) {
            if (selectedDate.to) {
                return `${format(selectedDate.from, "dd/MM/yyyy")} - ${format(selectedDate.to, "dd/MM/yyyy")}`;
            }
            return format(selectedDate.from, "dd/MM/yyyy");
        }
        return "Chọn thời gian";
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "border-border/50 w-full flex-1 justify-between gap-2 bg-transparent text-left font-medium md:w-[260px] md:flex-none",
                            !selectedDate && "text-muted-foreground"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="text-muted-foreground h-4 w-4" />
                            <span className="truncate">{getDisplayText()}</span>
                        </div>
                        <ChevronDown className="text-muted-foreground h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="end">
                    <div className="flex flex-col md:flex-row">
                        {/* Cột trái: Các tùy chọn chọn nhanh */}
                        <div className="border-border/50 flex flex-col gap-1 border-b p-3 md:w-40 md:border-r md:border-b-0">
                            <div className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-wider uppercase">
                                Tùy chọn nhanh
                            </div>
                            {presets.map((preset) => (
                                <Button
                                    key={preset.label}
                                    variant="ghost"
                                    className="h-8 justify-start px-2 text-sm font-normal"
                                    onClick={() => setDate(preset.getValue())}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>

                        {/* Cột phải: Lịch */}
                        <div className="p-3">
                            <Calendar
                                mode="range"
                                defaultMonth={selectedDate?.from}
                                selected={selectedDate}
                                onSelect={setDate}
                                numberOfMonths={2}
                                className="border-0"
                                disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                }
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
