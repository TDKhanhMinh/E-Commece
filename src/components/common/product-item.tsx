"use client";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
interface ProductItemProps {
    id: number;
    label: string;
    brand: string;
    name: string;
    imgUrl: string;
    hoverImgUrl: string;
    price: {
        current: number;
        old: number;
        currency: string;
        discountPercent: number;
    };
    colors: string[];
    isFavorite: boolean;
}
function ProductItem({ item }: { item: ProductItemProps }) {
    const {
        id,
        label,
        brand,
        name,
        imgUrl,
        hoverImgUrl,
        price,
        colors,
        isFavorite,
    } = item;
    const navigate = useRouter();
    return (
        <>
            <Card
                onClick={() => navigate.push(`/product/${id}`)}
                key={label}
                className="group relative mb-5 flex max-w-xs shrink-0 cursor-pointer flex-col items-center gap-2 p-6 shadow-xl transition-transform hover:-translate-y-1"
            >
                <div className="flex w-full items-center justify-between">
                    <Label className="rounded-md bg-linear-to-tl from-[#fde68a] to-[#f59e0b] px-4 py-1.5 text-sm font-bold text-black uppercase">
                        Sales
                    </Label>
                    <Button
                        className="cursor-pointer rounded-full"
                        variant="outline"
                        size="icon"
                        aria-label="Submit"
                    >
                        <HeartIcon className="h-5 w-5" />
                    </Button>
                </div>
                <div className="relative h-[150px] w-[150px]">
                    <Image
                        src={imgUrl}
                        alt={label}
                        fill
                        className="object-contain transition-opacity duration-300 group-hover:opacity-0"
                    />

                    <Image
                        src={hoverImgUrl}
                        alt={label}
                        fill
                        className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                </div>
                <p className="text-secondary-dark w-full text-start">{brand}</p>
                <div className="text-md w-full truncate py-2 text-start font-bold">
                    {name}
                </div>
                <div className="flex w-full flex-row items-center justify-between gap-2 text-start">
                    <div className="flex flex-col text-start">
                        <span className="text-secondary-dark font-bold">
                            From ${price.current.toLocaleString()} VND
                        </span>
                        <span className="text-muted-foreground text-xs line-through">
                            ${price.old.toLocaleString()} VND
                        </span>
                    </div>
                    <Badge className="text-secondary-dark mx-2 h-8 bg-yellow-500 text-base font-semibold backdrop-blur-sm">
                        <span className="px-2">
                            Save {price.discountPercent}%
                        </span>
                    </Badge>
                </div>

                <div className="mt-4 flex w-full gap-2 text-start">
                    {colors.map((color) => (
                        <Button
                            key={color}
                            className={`h-8 w-8 rounded-full border-2 bg-white p-0 px-0 py-0 font-semibold hover:border-green-400 hover:bg-transparent hover:shadow-md`}
                        >
                            <div
                                className={`${color} h-4 rounded-full p-2 font-semibold text-white`}
                            ></div>
                        </Button>
                    ))}
                </div>
            </Card>
        </>
    );
}

export default ProductItem;
