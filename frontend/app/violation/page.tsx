/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * ViolationPage
 *
 */
"use client";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { files_record, formatViolationStatus } from "@/utils/common";
import { SnackbarContext } from "@/contexts/SnackbarContext";
import ViolationDialog from "@/components/ViolationDialog";
import { ImageGallery } from "@/components/ImageGallery";
import ExportToExcel from "@/components/ExportToExcel";
import FilterDialog from "@/components/FilterDialog";
import { mutation, query } from "@/utils/services";
import MainLayout from "@/components/MainLayout";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import { User, DataSet } from "@/utils/types";
import Header from "@/components/Header";

const dataset: DataSet[] = [
  {
    title: "Tên Người Vi Phạm",
    value: "driverName",
    type: "string",
  },
  {
    title: "Biển Số",
    value: "plate",
    type: "string",
  },
  {
    title: "Tên Phương Tiện",
    value: "vehicleName",
    type: "string",
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
    title: "Ngày Xử Phạt",
    value: "violationDate",
    type: "string",
    format: (value) => {
      const date = new Date(value);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}`;
    },
  },
  {
    title: "Trạng Thái",
    value: "status",
    type: "status",
    format: formatViolationStatus,
  },
];

function removeEmpty(obj: any) {
  return Object.keys(obj)
    .filter(function (k) {
      if (obj[k] !== "") return obj[k];
    })
    .reduce((acc: any, k: any) => {
      acc[k] = typeof obj[k] === "object" ? removeEmpty(obj[k]) : obj[k];
      return acc;
    }, {});
}

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
  const [openGallery, setOpenGallery] = useState(false);
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
    query("/violation", removeEmpty(filterAll))
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

  const downloadDocument = () => {
    files_record.forEach((item) => {
      const link = document.createElement("a");
      link.href = `/${item}.docx`;
      link.download = item;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
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
      <Header setOpen={setOpen} title="Vi phạm" subtitle="Quản lý">
        <ExportToExcel data={data} />
        <button className="ml-2 btn btn-primary" type="button" onClick={() => setOpenGallery(true)}>
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
        <button className="ml-2 btn btn-primary" onClick={downloadDocument}>
          Tải biên bản mẫu
        </button>
      </Header>
      <SearchBar placeholder="Biển số" search={search} setSearch={setSearch} />
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
      <ImageGallery open={openGallery} setOpen={setOpenGallery} />
      <FilterDialog filter={filter} open={openFilter} setOpen={setOpenFilter} handleSubmit={handleFilter} />
    </MainLayout>
  );
}
