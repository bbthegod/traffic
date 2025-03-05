export interface Table {
  id: string;
  data: string[];
}

export interface DataSet {
  title: string;
  value: string;
  type: "string" | "status" | "money";
  format?: (value: string) => string;
}

export interface AuthType {
  token: string;
  username: string;
  name: string;
  role: string;
  id: string;
}

export interface User {
  _id: string;
  policeId: string;
  username: string;
  name: string;
  position: string;
  role?: string;
  status?: Status;
}

export interface ViolationType {
  _id: string;
  name: string;
  amountFrom: string;
  amountTo: number;
  vehicleType: VehicleType;
  status?: Status;
}

export interface Violation {
  _id: string;
  officerId: string;
  driverName: string;
  driverDob: string;
  driverNationality: string;
  driverAddress: string;
  driverJob: string;
  driverId: string;
  driverIdDate: string;
  driverIdAddress: string;
  vehicleName: string;
  violationDate: string;
  violationType: string;
  locationStreet: string;
  locationDistrict: string;
  locationCity: string;
  officerComment: string;
  driverComment: string;
  itemsKepp: string;
  penalty: number;
  status?: ViolationStatus;
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum VehicleType {
  CAR = "CAR",
  MOTORBIKE = "MOTORBIKE",
  TRICYCLE = "TRICYCLE",
}

export enum ViolationStatus {
  CREATED = "CREATED",
  INPROGRESS = "INPROGRESS",
  COMPLETED = "COMPLETED",
}
