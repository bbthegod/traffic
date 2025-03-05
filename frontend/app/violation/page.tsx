/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * ViolationPage
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
import ViolationDialog from "@/components/ViolationDialog";
import { formatStatus } from "@/utils/common";
import FilterDialog from "@/components/FilterDialog";

const dataset: DataSet[] = [
  {
    title: "Tên Người Vi Phạm",
    value: "driverName",
    type: "string",
  },
  {
    title: "Tên Phương Tiện",
    value: "vehicleName",
    type: "string",
  },
  {
    title: "Ngày Xử Phạt",
    value: "violationDate",
    type: "string",
    format: (value) => {
      const date = new Date(value);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}`;
    },
  },
  {
    title: "Loại Vi Phạm",
    value: "violationType",
    type: "string",
  },
  {
    title: "Trạng Thái",
    value: "status",
    type: "status",
    format: formatStatus,
  },
];

export default function ViolationPage() {
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState({});
  //====================================== Constant ======================================
  const filterAll = useMemo(() => {
    return search
      ? {
          limit: rowsPerPage,
          skip: page * rowsPerPage,
          sort,
          search,
          ...filter,
        }
      : {
          limit: rowsPerPage,
          skip: page * rowsPerPage,
          sort,
          ...filter,
        };
  }, [filter, page, rowsPerPage, search, sort]);
  //====================================== Callback ======================================
  const getViolations = useCallback(() => {
    query("/violation", filterAll)
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
  }, [Snackbar, filterAll]);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleFilter = (data: any) => {
    setFilter(data);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreate = (data: User) => {
    mutation("/violation", data)
      .then(() => {
        Snackbar?.open("Tạo vi phạm thành công", "success");
        getViolations();
        setOpen(false);
      })
      .catch(() => {
        Snackbar?.open("Tạo vi phạm thất bại", "error");
        setOpen(false);
      });
  };
  //====================================== Effect ======================================
  useEffect(() => {
    getViolations();
  }, [filterAll, getViolations]);
  //====================================== Render ======================================
  return (
    <MainLayout>
      <Header setOpen={setOpen} title="Loại vi phạm" subtitle="Quản lý" />
      <SearchBar search={search} setSearch={setSearch} />
      <DataTable
        title="violation"
        dataset={dataset}
        loading={!data}
        data={data}
        sort={sort}
        openFilter={() => setOpenFilter(true)}
        handleSort={setSort}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
      />
      <ViolationDialog setOpen={setOpen} open={open} handleSubmit={handleCreate} />
      <FilterDialog filter={filter} open={openFilter} setOpen={setOpenFilter} handleSubmit={handleFilter} />
    </MainLayout>
  );
}
