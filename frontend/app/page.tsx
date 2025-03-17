/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * UserPage
 *
 */
"use client";
// import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

// import { BASE_URL, DataSet, SnackbarContext, User } from '@its/common';

import Header from "@/components/Header";
import MainLayout from "@/components/MainLayout";
import { useCallback, useContext, useEffect, useState } from "react";
import { query } from "@/utils/services";
import { SnackbarContext } from "@/contexts/SnackbarContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Thống Kê Vi Phạm Theo Tháng",
    },
  },
};

const LocationOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Thống Kê Vi Phạm Theo Khu Vực",
    },
  },
};

const monthLabels = ["T.1", "T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "T.8", "T.9", "T.10", "T.11", "T.12"];

export default function UserPage() {
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [month, setMonth] = useState([]);
  const [location, setLocation] = useState([]);
  const [type, setType] = useState("MONTH");
  //====================================== Constant ======================================
  const getViolations = useCallback(() => {
    query("/violation/report")
      .then((data: any) => {
        if (data) {
          setMonth(data.data.month);
          setLocation(data.data.location);
        }
      })
      .catch((e: any) => {
        console.log(e);
        Snackbar?.open("Lấy dữ liệu thất bại", "error");
      });
  }, [Snackbar]);

  const monthData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Số Lượng Vi Phạm",
        data: month,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const locationData = {
    labels: location.map((item: any) => `${item._id.locationDistrict}, ${item._id.locationCity}`),
    datasets: [
      {
        label: "Số Lượng Vi Phạm",
        data: location.map((item: any) => item.count),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  //====================================== Callback ======================================
  //====================================== Effect ======================================
  useEffect(() => {
    getViolations();
  }, [getViolations]);
  //====================================== Render ======================================
  return (
    <MainLayout>
      <Header title="Thống Kê" subtitle="Bảng" />

      <div className="form-control w-[300px] my-8">
        <label className="label p-0 m-0 text-sm mb-2">Chọn Thống Kê</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className={`select select-bordered w-full`}>
          <option value="MONTH">Báo cáo theo tháng</option>
          <option value="LOCATION">Báo cáo theo khu vực</option>
        </select>
      </div>
      {type === "MONTH" && (
        <div className="bg-white p-4">
          <Bar options={monthOptions} data={monthData} />
        </div>
      )}
      {type === "LOCATION" && (
        <div className="bg-white p-4">
          <Bar options={LocationOptions} data={locationData} />
        </div>
      )}
    </MainLayout>
  );
}
