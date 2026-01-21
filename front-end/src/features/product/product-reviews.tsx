"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    BadgeCheck,
    Filter,
    Heart,
    HeaterIcon,
    Star,
    User,
} from "lucide-react";
import Link from "next/link";

function ProductReviews() {
    return (
        <div className="mt-12 mb-12 flex w-full flex-col items-center gap-8 py-5">
            <section className="container px-4">
                <div className="mb-8 w-full text-center">
                    <h1 className="text-4xl font-bold">Reviews</h1>
                </div>
                <div className="mb-8 w-full text-left">
                    <h1 className="text-base font-bold">Customer reviews</h1>
                </div>
                <div className="flex w-full flex-row gap-4">
                    <div className="w-2/4">
                        <div className="flex flex-row items-center justify-center">
                            <div className="flex flex-col items-center justify-center px-4">
                                <span className="text-4xl font-semibold">
                                    4.88
                                </span>
                                <div className="my-2 flex flex-row items-center gap-1">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Star
                                                key={index}
                                                className="h-7 w-7 text-yellow-400"
                                            />
                                        )
                                    )}
                                </div>
                                <span>1234 reviews</span>
                            </div>
                            <div className="w-2/4">
                                <div className="flex flex-row items-center justify-center">
                                    <span className="mx-4 text-lg">5</span>
                                    <Progress value={50} />
                                </div>
                                <div className="flex flex-row items-center justify-center">
                                    <span className="mx-4 text-lg">4</span>
                                    <Progress value={50} />
                                </div>
                                <div className="flex flex-row items-center justify-center">
                                    <span className="mx-4 text-lg">3</span>
                                    <Progress value={50} />
                                </div>
                                <div className="flex flex-row items-center justify-center">
                                    <span className="mx-4 text-lg">2</span>
                                    <Progress value={50} />
                                </div>
                                <div className="flex flex-row items-center justify-center">
                                    <span className="mx-4 text-lg">1</span>
                                    <Progress value={50} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-2/4">
                        <div className="flex flex-row items-center justify-start gap-4">
                            <span>
                                Filter reviews{" "}
                                <Filter className="mr-2 inline-block h-5 w-5" />
                            </span>
                            <Select defaultValue="all">
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Sort by newest" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Time</SelectLabel>
                                        <SelectItem value="newest">
                                            Sort by newest
                                        </SelectItem>
                                        <SelectItem value="oldest">
                                            Sort by oldest
                                        </SelectItem>
                                        <SelectItem value="rating-highest">
                                            Sort by rating: highest to lowest
                                        </SelectItem>
                                        <SelectItem value="rating-lowest">
                                            Sort by rating: lowest to highest
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select defaultValue="all">
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Sort by rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Rating</SelectLabel>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="1">
                                            1{" "}
                                            <Star className="inline-block h-4 w-4 text-yellow-400" />
                                        </SelectItem>
                                        <SelectItem value="2">
                                            2{" "}
                                            <Star className="inline-block h-4 w-4 text-yellow-400" />
                                        </SelectItem>
                                        <SelectItem value="3">
                                            3{" "}
                                            <Star className="inline-block h-4 w-4 text-yellow-400" />
                                        </SelectItem>
                                        <SelectItem value="4">
                                            4{" "}
                                            <Star className="inline-block h-4 w-4 text-yellow-400" />
                                        </SelectItem>
                                        <SelectItem value="5">
                                            5{" "}
                                            <Star className="inline-block h-4 w-4 text-yellow-400" />
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <Separator className="my-8" />
                <div className="grid grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card className="m-2 gap-2 shadow-md">
                            <CardHeader className="">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center justify-start space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full"
                                        >
                                            <User />
                                        </Button>
                                        <span>Luis C</span>
                                        <BadgeCheck
                                            className="h-5 w-5"
                                            color="#259832"
                                        />
                                    </div>
                                    <span>7 hours ago</span>
                                </div>
                                <div className="flex flex-row items-center gap-1">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Star
                                                key={index}
                                                className="h-4 w-4 text-yellow-400"
                                            />
                                        )
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="mt-1 space-y-2">
                                <span className="font-semibold">
                                    Great Phone
                                </span>
                                <p className="text-muted-foreground line-clamp-3 w-fit text-sm">
                                    I bought the ‘good’ quality in October and
                                    it’s been excellent in regards to the long
                                    lasting batter. I bought the ‘good’ quality
                                    in October and it’s been excellent in
                                    regards to the long lasting batter...
                                </p>
                            </CardContent>
                            <CardFooter className="mt-2">
                                <div className="text-secondary-dark flex flex-row items-center gap-2 text-sm">
                                    <Heart
                                        fill="orange"
                                        color="orange"
                                        className="h-4 w-4"
                                    />{" "}
                                    Would recommend
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="container mx-auto mt-12 px-4 text-center">
                    <Link href="/products">
                        <Button className="cursor-pointer rounded-full bg-green-900 px-32 py-4 text-lg font-bold text-white transition-colors hover:bg-green-800/80">
                            View all reviews
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default ProductReviews;
