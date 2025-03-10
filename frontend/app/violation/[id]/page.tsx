/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * ViolationDetail
 *
 */
"use client";
import { useCallback, useContext, useEffect, useState, use } from "react";

import { DataSet, Violation } from "@/utils/types";
import { navigate } from "@/utils/actions";
import { SnackbarContext } from "@/contexts/SnackbarContext";
import { mutation, query } from "@/utils/services";

import ConfirmDialog from "@/components/ConfirmDialog";
import ContentDetail from "@/components/ContentDetail";
import Header from "@/components/Header";
import MainLayout from "@/components/MainLayout";
import ViolationDialog from "@/components/ViolationDialog";
import { formatCurrency } from "@/utils/common";

const dataset: DataSet[] = [
  {
    title: "Tên Cán Bộ",
    value: "officerId.name",
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
    format: (value: any) => {
      return value.map((element: any) => element.name)?.join(", ");
    },
  },
  {
    title: "Địa chỉ vi phạm (Đường)",
    value: "locationStreet",
    type: "string",
  },
  {
    title: "Địa chỉ vi phạm (Quận)",
    value: "locationDistrict",
    type: "string",
  },
  {
    title: "Địa chỉ vi phạm (Thành Phố)",
    value: "locationCity",
    type: "string",
  },
  {
    title: "Ý Kiến Cán Bộ",
    value: "officerComment",
    type: "string",
  },
  {
    title: "Ý Kiến Người Vi Phạm",
    value: "driverComment",
    type: "string",
  },
  {
    title: "Tang Vật/Giấy Tờ Bắt Giữ",
    value: "itemsKepp",
    type: "string",
  },
  {
    title: "Mức Phạt",
    value: "penalty",
    type: "string",
    format: formatCurrency,
  },
];

const datasetDriver: DataSet[] = [
  {
    title: "Họ Và Tên",
    value: "driverName",
    type: "string",
  },
  {
    title: "Ngày Sinh",
    value: "driverDob",
    type: "string",
  },
  {
    title: "Địa Chỉ",
    value: "driverAddress",
    type: "string",
  },
  {
    title: "Quốc Tịch",
    value: "driverNationality",
    type: "string",
  },
  {
    title: "Nghề Nghiệp",
    value: "driverJob",
    type: "string",
  },
  {
    title: "CMTND/CCCD",
    value: "driverId",
    type: "string",
  },
  {
    title: "Ngày Cấp",
    value: "driverIdDate",
    type: "string",
  },
  {
    title: "Cấp Tại",
    value: "driverIdAddress",
    type: "string",
  },
  {
    title: "Tên Phương Tiện",
    value: "vehicleName",
    type: "string",
  },
  {
    title: "Biển Số",
    value: "plate",
    type: "string",
  },
];

export default function ViolationDetail({ params }: any) {
  //====================================== Hook ======================================
  const { id }: any = use(params);
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  const [removeDialog, setRemoveDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [violaion, setViolation] = useState<Violation>();
  //====================================== Callback ======================================
  const getViolation = useCallback(() => {
    query(`/violation/${id}`)
      .then((data: any) => {
        const u = data.data;
        if (u) {
          setViolation(u);
        }
      })
      .catch(() => {
        Snackbar?.open("Lấy dữ liệu thất bại", "error");
      });
  }, [Snackbar, id]);

  const handleRemove = () => {
    mutation(`/violation/${id}`, null, "DELETE")
      .then(() => {
        Snackbar?.open("Xoá vi phạm thành công", "success");
        navigate("/violation");
      })
      .catch(() => {
        Snackbar?.open("Xoá vi phạm thất bại", "error");
      });
  };

  const handleSubmit = (data: any) => {
    mutation(`/violation/${id}`, data, "PUT")
      .then(() => {
        Snackbar?.open("Cập nhật vi phạm thành công", "success");
        navigate("/violation");
      })
      .catch(() => {
        Snackbar?.open("Cập nhật vi phạm thất bại", "error");
      });
  };
  //====================================== Effect ======================================
  useEffect(() => {
    if (id) {
      getViolation();
    }
  }, [Snackbar, getViolation, id]);
  //====================================== Render ======================================
  if (!violaion) return null;
  return (
    <MainLayout>
      <Header subtitle="Thông Tin Vi Phạm" title="" />
      <div className="mt-6 w-full flex flex-wrap flex-col-reverse md:flex-row gap-4 justify-center">
        <ContentDetail title="Thông tin vi phạm" dataset={dataset} data={violaion}>
          <button onClick={() => setEditDialog(true)} className="text-[#2196f3] btn btn-ghost btn-sm w-fit">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
            Sửa
          </button>
          <button onClick={() => setRemoveDialog(true)} className="text-[#f44336] btn btn-ghost btn-sm w-fit">
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
        <ContentDetail title="Thông tin người vi phạm" dataset={datasetDriver} data={violaion}>
          <div></div>
        </ContentDetail>
      </div>
      <ConfirmDialog open={removeDialog} setOpen={setRemoveDialog} message="Xoá vi phạm này ?" handleAction={handleRemove} />
      {violaion && <ViolationDialog data={violaion} setOpen={setEditDialog} open={editDialog} handleSubmit={handleSubmit} />}
    </MainLayout>
  );
}
