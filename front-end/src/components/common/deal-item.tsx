"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import { Card } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
interface DealItemProps {
    name: string;
    description: string;
    imgUrl: string;
    hoverImgUrl: string;
    productLink: string;
}
function DealItem({
    name,
    description,
    imgUrl,
    hoverImgUrl,
    productLink,
}: DealItemProps) {
    return (
        <>
            <Card className="group relative flex h-[450px] w-80 w-full cursor-pointer flex-col justify-between p-6 shadow-lg transition-transform hover:-translate-y-1">
                <div className="flex flex-col items-start gap-4 px-2 text-start">
                    <Label className="rounded-md bg-gradient-to-r from-purple-700 via-pink-500 to-orange-300 px-3 py-0.5 text-sm font-semibold text-white uppercase">
                        Hot Deals
                    </Label>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h1 className="w-full cursor-pointer truncate text-base">
                                {name}
                            </h1>
                        </TooltipTrigger>
                        <TooltipContent side="left">{name}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-muted-foreground w-full truncate text-sm">
                                {description}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            {description}
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="relative h-80 w-full overflow-hidden">
                    <Image
                        src={imgUrl}
                        alt={name}
                        fill
                        className="object-contain transition-opacity duration-300 group-hover:opacity-0"
                    />
                    <Image
                        src={hoverImgUrl}
                        alt={name}
                        fill
                        className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                </div>

                <div className="mx-1.5 mb-4 flex w-full items-start">
                    <Link
                        className="w-full text-start font-bold text-yellow-900 underline underline-offset-4 hover:text-yellow-500"
                        href={productLink}
                    >
                        Shop Now &rarr;
                    </Link>
                </div>
            </Card>
        </>
    );
}

export default DealItem;
