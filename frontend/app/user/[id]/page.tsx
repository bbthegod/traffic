/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * UserDetail
 *
 */
"use client";
import { useCallback, useContext, useEffect, useState, use } from "react";

import { DataSet, User } from "@/utils/types";
import { navigate } from "@/utils/actions";
import { SnackbarContext } from "@/contexts/SnackbarContext";
import { mutation, query } from "@/utils/services";

import ConfirmDialog from "@/components/ConfirmDialog";
import ContentDetail from "@/components/ContentDetail";
import UserDialog from "@/components/UserDialog";
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
    title: "Quyền Hệ Thống",
    value: "role",
    type: "string",
  },
  {
    title: "Trạng Thái",
    value: "status",
    type: "status",
    format: formatStatus,
  },
];

export default function UserDetail({ params }: any) {
  //====================================== Hook ======================================
  const { id }: any = use(params);
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [auth, setAuth] = useState<any>({});
  const [removeDialog, setRemoveDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [user, setUser] = useState<User>();
  //====================================== Callback ======================================
  const getUser = useCallback(() => {
    query(`/user/${id}`)
      .then((data: any) => {
        const u = data.data;
        if (u) setUser(u);
      })
      .catch(() => {
        Snackbar?.open("Lấy dữ liệu thất bại", "error");
      });
  }, [Snackbar, id]);

  const handleRemove = () => {
    mutation(`/user/${id}`, null, "DELETE")
      .then(() => {
        Snackbar?.open("Xoá cán bộ thành công", "success");
        navigate("/user");
      })
      .catch(() => {
        Snackbar?.open("Xoá cán bộ thất bại", "error");
      });
  };

  const handleSubmit = (data: any) => {
    mutation(`/user/${id}`, data, "PUT")
      .then(() => {
        Snackbar?.open("Cập nhật cán bộ thành công", "success");
        navigate("/user");
      })
      .catch(() => {
        Snackbar?.open("Cập nhật cán bộ thất bại", "error");
      });
  };

  //====================================== Effect ======================================
  useEffect(() => {
    if (id) {
      getUser();
    }
  }, [Snackbar, getUser, id]);

  useEffect(() => {
    if (localStorage) {
      const a = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth") ?? "{}") : {};
      setAuth(a);
    }
  }, []);
  //====================================== Render ======================================
  if (!user) return null;
  return (
    <MainLayout>
      <Header subtitle="Cán Bộ" title={user ? user.username : ""} />
      <div className="mt-6 w-full flex flex-wrap flex-col-reverse md:flex-row gap-4 justify-center">
        <ContentDetail title="Thông tin cán bộ" dataset={dataset} data={user}>
          <button onClick={() => setEditDialog(true)} className="text-[#2196f3] btn btn-ghost btn-sm w-fit" disabled={auth?.role === "user"}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
            Sửa
          </button>
          <button onClick={() => setRemoveDialog(true)} className="text-[#f44336] btn btn-ghost btn-sm w-fit" disabled={auth?.role === "user"}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            Xoá
          </button>
        </ContentDetail>
      </div>
      <ConfirmDialog open={removeDialog} setOpen={setRemoveDialog} message="Xoá cán bộ này ?" handleAction={handleRemove} />
      {user && <UserDialog data={user} setOpen={setEditDialog} open={editDialog} handleSubmit={handleSubmit} />}
    </MainLayout>
  );
}
