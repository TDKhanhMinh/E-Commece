export type NotificationType = 'OUTBOUND' | 'SYSTEM' | 'ORDER_UPDATE';

export type Notification = {
  notificationId: number | string;
  title: string;
  message: string;
  type: NotificationType | string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationPage {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}