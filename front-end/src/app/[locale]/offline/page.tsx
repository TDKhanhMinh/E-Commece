import React from "react";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <div className="mb-6 rounded-full bg-muted p-6">
                <WifiOff className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight">You're Offline</h1>
            <p className="mb-8 max-w-md text-muted-foreground">
                It looks like you're not connected to the internet. 
                Please check your connection and try again.
            </p>
            <Button 
                onClick={() => window.location.reload()}
                className="w-full max-w-[200px]"
            >
                Try Again
            </Button>
        </div>
    );
}
