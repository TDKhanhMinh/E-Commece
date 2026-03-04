/**
 * Hàm format thời gian linh hoạt
 * @param date - Giá trị ngày tháng (chuỗi, số, hoặc Date object)
 * @param formatStr - Định dạng mong muốn (Mặc định: 'dd/MM/yyyy HH:mm')
 * @returns Chuỗi ngày tháng đã được format
 */
export function fDateTime(
    date: Date | string | number | null | undefined,
    formatStr: string = "dd/MM/yyyy HH:mm"
): string {
    if (!date) return "";

    const d = new Date(date);

    // Kiểm tra nếu date không hợp lệ (Invalid Date)
    if (isNaN(d.getTime())) return "";

    const padZero = (num: number) => num.toString().padStart(2, "0");

    const tokens = {
        yyyy: d.getFullYear().toString(),
        yy: d.getFullYear().toString().slice(-2),
        MM: padZero(d.getMonth() + 1), // Tháng bắt đầu từ 0
        dd: padZero(d.getDate()),
        HH: padZero(d.getHours()), // Định dạng 24h
        hh: padZero(d.getHours() % 12 || 12), // Định dạng 12h
        mm: padZero(d.getMinutes()),
        ss: padZero(d.getSeconds()),
        a: d.getHours() >= 12 ? "PM" : "AM",
    };

    // Sắp xếp các token theo độ dài giảm dần để replace chính xác (ví dụ: yyyy trước yy)
    const sortedKeys = Object.keys(tokens).sort((a, b) => b.length - a.length);

    let result = formatStr;
    for (const key of sortedKeys) {
        result = result.replace(
            new RegExp(key, "g"),
            tokens[key as keyof typeof tokens]
        );
    }

    return result;
}
