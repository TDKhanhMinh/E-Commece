import { httpClient } from '@api/httpClient';
import type { ApiResponse, PaginatedResponse } from '@shared/types/common.types';
import type {
  Shipment,
  CreateShipmentData,
  ShipmentFilters,
  TrackingEvent,
} from '../types/shipping.types';

interface ShippingFeeEstimate {
  baseFee: number;
  weightFee: number;
  distanceFee: number;
  insuranceFee: number;
  totalFee: number;
  estimatedDays: number;
}

class ShippingService {
  private readonly endpoints = {
    shipments: '/shipments',
    tracking: '/shipments/tracking',
    estimate: '/shipments/estimate',
    all: '/delivery/status'
  };
  async getAllShipments(status: string): Promise<ApiResponse<PaginatedResponse<any>>> {
    return httpClient.get<PaginatedResponse<any>>(this.endpoints.all, {
      params: { status },
    });
  }
  //--------------------------------------------
  async getShipments(
    filters?: ShipmentFilters,
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<Shipment>>> {
    const params: Record<string, string | number> = { page, limit };

    if (filters?.status) params.status = filters.status;
    if (filters?.search) params.search = filters.search;
    if (filters?.dateFrom) params.dateFrom = filters.dateFrom.toISOString();
    if (filters?.dateTo) params.dateTo = filters.dateTo.toISOString();

    return httpClient.get<PaginatedResponse<Shipment>>(this.endpoints.shipments, {
      params,
    });
  }



  async getShipmentById(id: string): Promise<ApiResponse<Shipment>> {
    return httpClient.get<Shipment>(`${this.endpoints.shipments}/${id}`);
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<ApiResponse<Shipment>> {
    return httpClient.get<Shipment>(`${this.endpoints.tracking}/${trackingNumber}`);
  }

  async createShipment(data: CreateShipmentData): Promise<ApiResponse<Shipment>> {
    return httpClient.post<Shipment>(this.endpoints.shipments, data);
  }

  async cancelShipment(id: string, reason?: string): Promise<ApiResponse<Shipment>> {
    return httpClient.post<Shipment>(`${this.endpoints.shipments}/${id}/cancel`, {
      reason,
    });
  }

  async getTrackingHistory(shipmentId: string): Promise<ApiResponse<TrackingEvent[]>> {
    return httpClient.get<TrackingEvent[]>(
      `${this.endpoints.shipments}/${shipmentId}/tracking`,
    );
  }

  async estimateShippingFee(
    senderAddress: { city: string; district: string },
    receiverAddress: { city: string; district: string },
    totalWeight: number,
    insuranceRequired: boolean = false,
    declaredValue: number = 0,
  ): Promise<ApiResponse<ShippingFeeEstimate>> {
    return httpClient.post<ShippingFeeEstimate>(this.endpoints.estimate, {
      senderAddress,
      receiverAddress,
      totalWeight,
      insuranceRequired,
      declaredValue,
    });
  }

  async updateShipmentNotes(id: string, notes: string): Promise<ApiResponse<Shipment>> {
    return httpClient.patch<Shipment>(`${this.endpoints.shipments}/${id}`, {
      notes,
    });
  }
}

export const shippingService = new ShippingService();
