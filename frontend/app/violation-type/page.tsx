/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * ViolationTypePage
 *
 */
"use client";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { User, DataSet } from "@/utils/types";
import { SnackbarContext } from "@/contexts/SnackbarContext";
// import { BASE_URL, DataSet, SnackbarContext, User } from '@its/common';

import { mutation, query } from "@/utils/services";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import Header from "@/components/Header";
import MainLayout from "@/components/MainLayout";
import ViolationTypeDialog from "@/components/ViolationTypeDialog";
import { formatCurrency, formatStatus, formatVehicleType } from "@/utils/common";

const dataset: DataSet[] = [
  {
    title: "Tên Vi Phạm",
    value: "name",
    type: "string",
  },
  {
    title: "Loại Xe",
    value: "vehicleType",
    type: "string",
    format: formatVehicleType,
  },
  {
    title: "Mức Phạt Từ",
    value: "amountFrom",
    type: "money",
    format: formatCurrency,
  },
  {
    title: "Mức Phạt Đến",
    value: "amountTo",
    type: "money",
    format: formatCurrency,
  },
  {
    title: "Trạng Thái",
    value: "status",
    type: "status",
    format: formatStatus,
  },
];

export default function ViolationTypePage() {
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  //====================================== Constant ======================================
  const filter = useMemo(() => {
    return search
      ? {
          limit: rowsPerPage,
          skip: page * rowsPerPage,
          search,
        }
      : {
          limit: rowsPerPage,
          skip: page * rowsPerPage,
        };
  }, [page, rowsPerPage, search]);
  //====================================== Callback ======================================
  const getViolations = useCallback(() => {
    query("/violation-type", filter)
      .then((data: any) => {
        if (data) {
          if (data.data) {
            setData(data.data);
          } else {
            setData([]);
          }
          setCount(data.count);
        }
      })
      .catch((e: any) => {
        console.log(e);
        Snackbar?.open("Lấy dữ liệu thất bại", "error");
      });
  }, [Snackbar, filter]);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreate = (data: User) => {
    mutation("/violation-type", data)
      .then(() => {
        Snackbar?.open("Tạo loại vi phạm thành công", "success");
        getViolations();
        setOpen(false);
      })
      .catch(() => {
        Snackbar?.open("Tạo loại vi phạm thất bại", "error");
        setOpen(false);
      });
  };
  //====================================== Effect ======================================
  useEffect(() => {
    getViolations();
  }, [filter, getViolations]);
  //====================================== Render ======================================
  return (
    <MainLayout>
      <Header setOpen={setOpen} title="Loại vi phạm" subtitle="Quản lý" />
      <SearchBar placeholder="Tên vi phạm" search={search} setSearch={setSearch} />
      <DataTable
        title="violation-type"
        dataset={dataset}
        loading={!data}
        data={data}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
      />
      <ViolationTypeDialog setOpen={setOpen} open={open} handleSubmit={handleCreate} />
    </MainLayout>
  );
}
