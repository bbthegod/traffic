/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * UserPage
 *
 */
"use client";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { User, DataSet } from "@/utils/types";
import { SnackbarContext } from "@/contexts/SnackbarContext";
// import { BASE_URL, DataSet, SnackbarContext, User } from '@its/common';

import { mutation, query } from "@/utils/services";
import UserDialog from "@/components/UserDialog";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import Header from "@/components/Header";
import MainLayout from "@/components/MainLayout";
import { formatStatus } from "@/utils/common";

const dataset: DataSet[] = [
  {
    title: "Tên Tài Khoản",
    value: "username",
    type: "string",
  },
  {
    title: "Số Hiệu Cán Bộ",
    value: "policeId",
    type: "string",
  },
  {
    title: "Tên Cán Bộ",
    value: "name",
    type: "string",
  },
  {
    title: "Vị Trí",
    value: "position",
    type: "string",
  },
  {
    title: "Trạng Thái",
    value: "status",
    type: "status",
    format: formatStatus,
  },
];

export default function UserPage() {
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
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
  const getUsers = useCallback(() => {
    query("/user", filter)
      .then((data: any) => {
        if (data) {
          if (data.data) {
            setUsers(data.data);
          } else {
            setUsers([]);
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
    mutation("/user", data)
      .then(() => {
        Snackbar?.open("Tạo cán bộ thành công", "success");
        getUsers();
        setOpen(false);
      })
      .catch(() => {
        Snackbar?.open("Tạo cán bộ thất bại", "error");
        setOpen(false);
      });
  };
  //====================================== Effect ======================================
  useEffect(() => {
    getUsers();
  }, [filter, getUsers]);
  //====================================== Render ======================================
  return (
    <MainLayout>
      <Header setOpen={setOpen} title="Cán Bộ" subtitle="Quản lý" />
      <SearchBar placeholder="Số hiệu cán bộ" search={search} setSearch={setSearch} />
      <DataTable
        title="user"
        dataset={dataset}
        loading={!users}
        data={users}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
      />
      <UserDialog setOpen={setOpen} open={open} handleSubmit={handleCreate} />
    </MainLayout>
  );
}
