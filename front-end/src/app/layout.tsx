import Providers from "@/app/provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            <Toaster richColors position="top-right" />
            {children}
        </Providers>
    );
}
