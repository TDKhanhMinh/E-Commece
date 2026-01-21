import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { USER_MEMBERSHIPS_TABS } from "../../../../../mock";

export default function Membership() {
    return (
        <div className="min-h-screen space-y-6 p-6">
            <div className="relative h-32 overflow-visible rounded-xl bg-linear-to-r from-green-800 to-green-600">
                <Card className="absolute -bottom-[65%] left-1/2 w-[90%] max-w-2xl -translate-x-1/2 border-none shadow-xl">
                    <CardContent className="space-y-2 py-4 text-center">
                        <h2 className="text-2xl font-bold italic">
                            Hạng thành viên:{" "}
                            <span className="text-green-600">Member</span>
                        </h2>

                        <p className="font-medium text-gray-600">
                            Điểm tích lũy hiện tại{" "}
                            <span className="text-green-600">NaN điểm</span>
                        </p>

                        <p className="text-sm text-gray-500">
                            Tích thêm{" "}
                            <span className="font-bold text-green-600">
                                NaN điểm
                            </span>{" "}
                            nữa để lên hạng{" "}
                            <span className="font-bold text-green-600">
                                Bạc
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="h-12"></div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="border-none shadow-sm">
                    <CardContent className="space-y-4 p-6">
                        <h3 className="text-lg font-bold">Điểm đổi quà</h3>
                        <p className="text-sm">
                            Bạn có{" "}
                            <span className="font-bold text-green-600">
                                NaN
                            </span>{" "}
                            điểm
                        </p>
                        <Button className="w-full rounded-xl bg-blue-600 py-6 text-lg hover:bg-blue-700">
                            Mua hàng ngay
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="space-y-4 p-6">
                        <h3 className="text-lg font-bold">
                            Tiến trình lên hạng
                        </h3>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Hạng hiện tại:{" "}
                                <span className="font-medium text-green-600">
                                    Thành viên
                                </span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Cần thêm <span className="font-bold">NaN</span>{" "}
                                điểm để lên{" "}
                                <span className="font-bold text-gray-500">
                                    Bạc
                                </span>
                            </p>
                        </div>
                        <Progress value={10} className="h-3 bg-gray-200" />
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm">
                <CardContent className="space-y-6 p-6">
                    <h3 className="text-lg font-bold text-green-800">
                        Ưu đãi thành viên
                    </h3>

                    <Tabs defaultValue="member" className="w-full">
                        <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
                            {USER_MEMBERSHIPS_TABS.map((tab) => (
                                <TabsTrigger
                                    value={tab.value}
                                    key={tab.value}
                                    className="cursor-pointer rounded-none border-0 border-b-2 bg-transparent px-0 py-2 font-bold text-gray-400 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {USER_MEMBERSHIPS_TABS.map((tab) => (
                            <TabsContent
                                value={tab.value}
                                key={tab.value}
                                className="space-y-3 pt-6 text-sm text-gray-700"
                            >
                                {tab.content.map((item, index) => (
                                    <p key={index}>{item}</p>
                                ))}
                                <a
                                    href="#"
                                    className="block pt-2 text-xs text-green-600"
                                >
                                    Điều khoản & Điều kiện
                                </a>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
