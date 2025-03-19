import { Status, VehicleType, ViolationStatus } from "./types";

export const files_record = ["giao_quyen", "bb_vphc", "qd_vphc", "qd_tam_giu"];

export const images_record = [
  "bb1_giao_quyen",
  "bb2_de_xuat_mu_bao_hiem",
  "bb3_qd_xphc",
  "bb4_tich_thu_tang_vat",
  "bb5_qd_tra_lai_tang_vat",
  "bb6_tra_lai_tang_vat",
];

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

export function formatViolationStatus(value: string) {
  if (value === ViolationStatus.CREATED) {
    return "Khởi Tạo";
  }
  if (value === ViolationStatus.INPROGRESS) {
    return "Đang Xử Lý";
  }
  if (value === ViolationStatus.COMPLETED) {
    return "Đã Xử Lý";
  }
  return "";
}
