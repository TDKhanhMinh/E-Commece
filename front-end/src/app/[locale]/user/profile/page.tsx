import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
    return (
        <div className="flex min-h-screen justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-7xl border-none shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-green-800">
                        Thông tin cá nhân
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="fullname"
                                    className="text-gray-600"
                                >
                                    Họ & tên
                                </Label>
                                <Input
                                    id="fullname"
                                    placeholder="tran minh"
                                    className="focus-visible:ring-green-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="text-gray-600"
                                >
                                    Số điện thoại
                                </Label>
                                <Input
                                    id="phone"
                                    placeholder="0345738250"
                                    className="focus-visible:ring-green-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="gender"
                                    className="text-gray-600"
                                >
                                    Giới tính
                                </Label>
                                <Input
                                    id="gender"
                                    className="focus-visible:ring-green-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dob" className="text-gray-600">
                                    Ngày sinh
                                </Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    className="focus-visible:ring-green-600"
                                />
                            </div>
                        </div>

                        <div className="max-w-md space-y-2">
                            <Label htmlFor="email" className="text-gray-600">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="minh130204@gmail.com"
                                className="focus-visible:ring-green-600"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="h-auto bg-green-700 px-10 py-2 text-base font-semibold text-white hover:bg-green-800"
                        >
                            Cập nhật
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
