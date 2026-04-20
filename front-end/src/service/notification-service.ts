import http from "./http";
import { requestForToken } from "@/lib/firebase";

export class NotificationService {
    static async subscribe(token: string) {
        return http.post("/notifications/subscribe", { token });
    }

    static async registerDevice() {
        const token = await requestForToken();
        if (token) {
            console.log("Device token:", token);
            await this.subscribe(token);
        }
        return token;
    }

    static async getNotifications(params?: { page?: number; size?: number; type?: string; sort?: string }) {
        return http.get("/notifications", { params });
    }

    static async markAllAsRead() {
        return http.post("/notifications/mark-all-read");
    }
}
