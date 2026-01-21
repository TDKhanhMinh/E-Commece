"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ShieldCheck, HelpCircle } from "lucide-react";

export default function TermsAndConditions() {
    const lastUpdated = "21/01/2026";

    return (
        <div className="flex min-h-screen items-start justify-center bg-gray-50/30 p-4 pt-10">
            <Card className="w-full max-w-4xl border-none shadow-sm">
                <CardHeader className="sticky top-0 z-10 rounded-t-xl border-b bg-white">
                    <div className="text-secondary-dark mb-2 flex items-center gap-2">
                        <FileText className="text-secondary-dark size-6" />
                        <CardTitle className="text-2xl font-bold tracking-tight uppercase">
                            Điều khoản và Điều kiện
                        </CardTitle>
                    </div>
                    <p className="text-sm text-gray-500">
                        Cập nhật lần cuối:{" "}
                        <span className="text-secondary-dark font-medium">
                            {lastUpdated}
                        </span>
                    </p>
                </CardHeader>

                <CardContent className="pt-8">
                    <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-8 leading-relaxed text-gray-700">
                            {/* Mục 1 */}
                            <section className="space-y-3">
                                <h3 className="text-secondary-dark flex items-center gap-2 text-lg font-bold">
                                    <span className="bg-secondary-datext-secondary-dark text-secondary-dark flex size-6 items-center justify-center rounded-full text-xs">
                                        1
                                    </span>
                                    Chấp nhận điều khoản
                                </h3>
                                <p className="text-sm">
                                    Bằng cách truy cập và sử dụng dịch vụ của
                                    chúng tôi, bạn đồng ý tuân thủ các điều
                                    khoản này. Nếu bạn không đồng ý với bất kỳ
                                    phần nào, vui lòng ngừng sử dụng dịch vụ
                                    ngay lập tức.
                                </p>
                            </section>

                            {/* Mục 2 */}
                            <section className="space-y-3">
                                <h3 className="text-secondary-dark flex items-center gap-2 text-lg font-bold">
                                    <span className="bg-secondary-datext-secondary-dark text-secondary-dark flex size-6 items-center justify-center rounded-full text-xs">
                                        2
                                    </span>
                                    Tài khoản người dùng
                                </h3>
                                <p className="text-sm">
                                    Bạn có trách nhiệm bảo mật thông tin đăng
                                    nhập và mật khẩu của mình. Mọi hoạt động xảy
                                    ra dưới tài khoản của bạn sẽ do bạn chịu
                                    trách nhiệm hoàn toàn. Chúng tôi có quyền
                                    tạm khóa tài khoản nếu phát hiện dấu hiệu vi
                                    phạm bảo mật.
                                </p>
                            </section>

                            {/* Mục 3 */}
                            <section className="space-y-3">
                                <h3 className="text-secondary-dark flex items-center gap-2 text-lg font-bold">
                                    <span className="bg-secondary-datext-secondary-dark text-secondary-dark flex size-6 items-center justify-center rounded-full text-xs">
                                        3
                                    </span>
                                    Quy định về tích lũy điểm
                                </h3>
                                <p className="text-sm">
                                    Hệ thống tích điểm dựa trên giá trị đơn hàng
                                    thực tế sau khi đã trừ các khuyến mãi. Điểm
                                    thưởng không có giá trị quy đổi thành tiền
                                    mặt và có thời hạn sử dụng theo quy định của
                                    từng hạng thành viên.
                                </p>
                            </section>

                            {/* Mục 4 */}
                            <section className="space-y-3">
                                <h3 className="text-secondary-dark flex items-center gap-2 text-lg font-bold">
                                    <span className="bg-secondary-datext-secondary-dark text-secondary-dark flex size-6 items-center justify-center rounded-full text-xs">
                                        4
                                    </span>
                                    Chính sách bảo mật
                                </h3>
                                <div className="border-secondary-datext-secondary-dark bg-secondary-datext-secondary-dark50 rounded-lg border p-4">
                                    <p className="text-sm italic">
                                        Chúng tôi cam kết bảo vệ thông tin cá
                                        nhân của bạn. Thông tin địa chỉ và số
                                        điện thoại chỉ được sử dụng cho mục đích
                                        giao hàng và hỗ trợ khách hàng.
                                    </p>
                                </div>
                            </section>

                            {/* Mục 5 */}
                            <section className="space-y-3">
                                <h3 className="text-secondary-dark flex items-center gap-2 text-lg font-bold">
                                    <span className="bg-secondary-datext-secondary-dark text-secondary-dark flex size-6 items-center justify-center rounded-full text-xs">
                                        5
                                    </span>
                                    Thay đổi điều khoản
                                </h3>
                                <p className="text-sm">
                                    Chúng tôi có quyền cập nhật các điều khoản
                                    này bất cứ lúc nào mà không cần thông báo
                                    trước. Việc bạn tiếp tục sử dụng dịch vụ
                                    đồng nghĩa với việc chấp nhận các thay đổi
                                    đó.
                                </p>
                            </section>

                            <div className="flex flex-col items-center gap-4 border-t pt-6">
                                <p className="text-center text-xs text-gray-400">
                                    Nếu bạn có bất kỳ thắc mắc nào, vui lòng
                                    liên hệ với Trung tâm hỗ trợ.
                                </p>
                                <div className="flex gap-4">
                                    <ShieldCheck className="text-secondary-dark size-10 opacity-20" />
                                    <HelpCircle className="text-secondary-dark size-10 opacity-20" />
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
