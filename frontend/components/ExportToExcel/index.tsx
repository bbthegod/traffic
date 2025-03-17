/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * ExportToExcel
 *
 */
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportToExcel({ data }: any) {
  const handleExport = () => {
    const rs: any = [];
    data.forEach((element: any, index: any) => {
      const temp: any = {};
      const vd = new Date(element?.violationDate);
      temp["STT"] = index + 1;
      temp["Ngày VP"] = vd.getDate() + "/" + (vd.getMonth() + 1) + "/" + vd.getFullYear();
      temp["Thời gian"] = vd.getHours() + "h" + vd.getMinutes() + "p";
      temp["Nơi VP"] = `${element.locationStreet}, ${element.locationDistrict}, ${element.locationCity}`;
      temp["Người VP"] = element?.driverName ?? "";
      temp["Ngày sinh"] = element?.driverDob ?? "";
      temp["Nghề nghiệp"] = element?.driverJob ?? "";
      temp["Nơi ở"] = element?.driverIdAddress ?? "";
      temp["CMT/CCCD"] = element?.driverId ?? "";
      temp["Ngày cấp"] = element?.driverIdDate ?? "";
      temp["Nơi cấp"] = element?.driverIdAddress ?? "";
      temp["BKS"] = element?.plate ?? "";
      temp["Tạm giữ"] = element?.itemsKeep ?? "";
      rs.push(temp);
    });

    const worksheet = XLSX.utils.json_to_sheet(rs);
    const headerCells = Object.keys(data[0]); // Get column names
    headerCells.forEach((key, index) => {
      const cellAddress = XLSX.utils.encode_col(index) + "1"; // Example: A1, B1, C1
      if (!worksheet[cellAddress]) return;
      worksheet[cellAddress].s = {
        font: { bold: true },
      };
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(dataBlob, `BaoCao${new Date().toISOString().slice(0, -8)}.xlsx`);
  };
  return (
    <button className="ml-2 btn btn-primary" onClick={handleExport}>
      Xuất Excel
    </button>
  );
}
