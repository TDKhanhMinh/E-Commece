// src/lib/websocket-monitor.ts
// Utilities để monitor WebSocket state và debug issues

export class WebSocketMonitor {
    private messageCount = 0;
    private connectionTime: number | null = null;
    private lastMessageTime: number | null = null;

    recordMessageReceived() {
        this.messageCount++;
        this.lastMessageTime = Date.now();
    }

    recordConnectionTime() {
        this.connectionTime = Date.now();
    }

    getMetrics() {
        return {
            messageCount: this.messageCount,
            connectionTime: this.connectionTime,
            lastMessageTime: this.lastMessageTime,
            connectionDuration: this.connectionTime 
                ? Date.now() - this.connectionTime 
                : null,
            timeSinceLastMessage: this.lastMessageTime 
                ? Date.now() - this.lastMessageTime 
                : null,
        };
    }

    reset() {
        this.messageCount = 0;
        this.connectionTime = null;
        this.lastMessageTime = null;
    }

    printMetrics() {
        const metrics = this.getMetrics();
        console.log("📊 WebSocket Metrics:", {
            "Messages Received": metrics.messageCount,
            "Connected Duration": metrics.connectionDuration 
                ? `${(metrics.connectionDuration / 1000).toFixed(2)}s`
                : "Not connected",
            "Time Since Last Message": metrics.timeSinceLastMessage 
                ? `${(metrics.timeSinceLastMessage / 1000).toFixed(2)}s ago`
                : "No messages",
        });
    }
}

export const wsMonitor = new WebSocketMonitor();

// Export để dùng trong browser console
if (typeof window !== "undefined") {
    (window as any).wsMonitor = wsMonitor;
}

