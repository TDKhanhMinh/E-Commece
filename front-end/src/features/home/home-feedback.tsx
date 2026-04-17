"use client";
import SimpleBar from "simplebar-react";
import { ReviewCard } from "@/components/common/product/review-card";
import { useReviewsByProduct } from "@/hooks/use-review";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function HomeFeedBack() {
    const t = useTranslations("home.feedback");
    const randomSlug = "iphone-15-pro";
    const router = useRouter();
    const { data, isLoading, isError } = useReviewsByProduct(randomSlug, {
        page: 0,
        size: 10,
        sortBy: "reviewDate",
        sortDirection: "DESC",
    });

    // @ts-ignore
    const reviews = data?.content || [];
    const handlerMoreReviewsClick = (productSlug: string) => {
        router.push("/product/" + productSlug);
    };
    return (
        <div className="mt-24 flex flex-col gap-8 py-5">
            <section className="">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-12 max-w-5xl">
                        <span className="mb-12 bg-linear-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                            {t("badge")}
                        </span>
                        <h2 className="my-1 font-bold uppercase text-slate-900 md:text-4xl dark:text-slate-100">
                            {t("title")}
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <Loader2 className="text-primary h-8 w-8 animate-spin" />
                        </div>
                    ) : isError || reviews.length === 0 ? (
                        <div className="text-muted-foreground py-10">
                            {t("noReviews")}
                        </div>
                    ) : (
                        <SimpleBar autoHide={true} style={{ maxWidth: "100%" }}>
                            <div className="flex flex-nowrap gap-6 px-4 pb-6">
                                {reviews.map((item: any) => (
                                    <ReviewCard
                                        key={item.id}
                                        reviewerName={item.reviewerName}
                                        reviewDate={item.reviewDate}
                                        title={item.title}
                                        content={item.content}
                                        reviewerImage={
                                            item.reviewerImage ||
                                            "/placeholder-avatar.png"
                                        }
                                        productName={item.productName}
                                        productImage={item.productImage}
                                        rating={item.rating}
                                        isVerified={item.isVerified}
                                        onMoreReviewsClick={() =>
                                            handlerMoreReviewsClick(
                                                item.productSlug
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </SimpleBar>
                    )}
                </div>
            </section>
        </div>
    );
}

