import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";
import "simplebar-react/dist/simplebar.min.css";
import ChatWidget from "@/components/common/ui/chat-widget";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <div
                    className={`${geistSans.variable} ${geistMono.variable} bg-background min-h-screen font-sans antialiased`}
                >
                    <main className="flex flex-1 flex-col">{children}</main>
                    <ChatWidget />
                </div>
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}
