import { Status, VehicleType } from "./types";

export function formatVehicleType(value: string) {
  if (value === VehicleType.CAR) {
    return "Xe Hơi";
  }
  if (value === VehicleType.MOTORBIKE) {
    return "Xe Máy";
  }
  if (value === VehicleType.TRICYCLE) {
    return "Xe Ba Bánh";
  }
  return "";
}

export function formatCurrency(value: string) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(+value);
}

export function formatStatus(value: string) {
  if (value === Status.ACTIVE) {
    return "Hoạt Động";
  }
  if (value === Status.INACTIVE) {
    return "Khóa";
  }
  return "";
}
