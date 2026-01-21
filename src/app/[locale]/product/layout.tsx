"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Fragment } from "react/jsx-runtime";

function ProductLayout({ children }: { children: React.ReactNode }) {
    return (
        <Fragment>
            <Header />
            <main className="flex w-full flex-1 flex-col">{children}</main>
            <Footer />
        </Fragment>
    );
}

export default ProductLayout;
