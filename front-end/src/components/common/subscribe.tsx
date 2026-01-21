import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function Subscribe() {
    return (
        <>
            <section className="mb-8 flex w-full items-center justify-center">
                <div className="container grid grid-cols-2 rounded-3xl bg-linear-to-r from-[#F2D65C] via-[#A9C97D] to-[#5BC5A7] p-10">
                    <div className="container mx-auto flex flex-col px-6 text-start">
                        <h2 className="mb-4 text-3xl font-bold">
                            Subscribe to keep up with our great deals.
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Stay ahead of the curve with exclusive offers, the
                            latest product updates, and special discounts
                            delivered straight to your inbox.
                        </p>
                        <Input
                            placeholder="Email của bạn..."
                            className="mb-4 h-12 rounded-3xl bg-white dark:bg-black"
                        />
                        <Button className="bg-success-darker hover:bg-success text-secondary-light max-w-36 cursor-pointer rounded-lg">
                            Đăng ký
                        </Button>
                    </div>
                    <div className="relative left-[50%] hidden w-64 md:block">
                        <Image
                            src="https://www.plug.tech/cdn/shop/files/Graphics_for_Bento_Grids_af74e2b3-20b7-45d1-ae40-cfad822ee80e.webp?v=1749093914&width=1200"
                            alt="Subscribe Image"
                            width={400}
                            height={400}
                            className="rounded-3xl object-cover"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

export default Subscribe;
