/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * ViolationDialog
 *
 */
"use client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

import Dialog from "../Dialog";
import TextField from "../TextField";

import { query } from "@/utils/services";
import { Status, User, Violation, ViolationStatus } from "@/utils/types";
import { SnackbarContext } from "@/contexts/SnackbarContext";
import Select from "../Select";
import { formatVehicleType } from "@/utils/common";

interface Props {
  data?: Violation;
  open: boolean;
  setOpen: (v: boolean) => void;
  handleSubmit: (v: any) => void;
}

const getCurrentTime = (date?: string) => {
  const now = date ? new Date(date) : new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const validationSchema = Yup.object().shape({
  officerId: Yup.mixed().required("Trường này không được để trống !"),
  plate: Yup.string().required("Trường này không được để trống !"),
  driverName: Yup.string().required("Trường này không được để trống !"),
  driverDob: Yup.string().required("Trường này không được để trống !"),
  driverNationality: Yup.string().required("Trường này không được để trống !"),
  driverAddress: Yup.string().required("Trường này không được để trống !"),
  driverJob: Yup.string().required("Trường này không được để trống !"),
  driverId: Yup.string().required("Trường này không được để trống !"),
  driverIdDate: Yup.string(),
  driverIdAddress: Yup.string(),
  vehicleName: Yup.string().required("Trường này không được để trống !"),
  violationDate: Yup.string().required("Trường này không được để trống !"),
  violationType: Yup.array().required("Trường này không được để trống !"),
  locationStreet: Yup.string().required("Trường này không được để trống !"),
  locationDistrict: Yup.string().required("Trường này không được để trống !"),
  locationCity: Yup.string().required("Trường này không được để trống !"),
  officerComment: Yup.string(),
  driverComment: Yup.string(),
  itemsKepp: Yup.string(),
  penalty: Yup.string().required("Trường này không được để trống !"),
  status: Yup.string().required("Trường này không được để trống !"),
});

export default function ViolationDialog({ open, setOpen, data, handleSubmit }: Props) {
  const Snackbar = useContext(SnackbarContext);
  const [violationType, setViolationType] = useState([]);
  const [users, setUsers] = useState<User[]>([]);
  //====================================== Const ======================================
  const getViolationType = useCallback(() => {
    query("/violation-type/all")
      .then((data: any) => {
        if (data) {
          setViolationType(data.data ?? []);
        }
      })
      .catch(() => {
        Snackbar?.open("Lấy dữ liệu thất bại", "error");
      });
  }, [Snackbar]);

  const getUsers = useCallback(() => {
    query("/user/all")
      .then((data: any) => {
        setUsers(data.data ?? []);
      })
      .catch(() => {
        Snackbar?.open("Lấy dữ liệu thất bại", "error");
      });
  }, [Snackbar]);

  //====================================== Callback ======================================
  const onSubmit = async (values: any) => {
    handleSubmit({
      ...data,
      ...values,
      ...{ status: values.status === true ? Status.ACTIVE : Status.INACTIVE },
      ...{ violationDate: new Date(values.violationDate) },
    });
    setOpen(false);
  };
  //====================================== Effect ======================================
  useEffect(() => {
    if (open) {
      getViolationType();
      getUsers();
    }
  }, [getViolationType, getUsers, open]);
  //====================================== Render ======================================
  return (
    <Dialog setOpen={setOpen} open={open}>
      <div>
        <Formik
          initialValues={{
            officerId: data ? data.officerId : "",
            plate: data ? data.plate : "",
            driverName: data ? data.driverName : "",
            driverDob: data ? data.driverDob : "",
            driverNationality: data ? data.driverNationality : "",
            driverAddress: data ? data.driverAddress : "",
            driverJob: data ? data.driverJob : "",
            driverId: data ? data.driverId : "",
            driverIdDate: data ? data.driverIdDate : "",
            driverIdAddress: data ? data.driverIdAddress : "",
            locationStreet: data ? data.locationStreet : "",
            locationDistrict: data ? data.locationDistrict : "",
            locationCity: data ? data.locationCity : "",
            officerComment: data ? data.officerComment : "",
            driverComment: data ? data.driverComment : "",
            itemsKepp: data ? data.itemsKepp : "",
            penalty: data ? data.penalty : "",
            vehicleName: data ? data.vehicleName : "",
            violationDate: data ? getCurrentTime(data.violationDate) : getCurrentTime(),
            violationType: data ? data.violationType : "",
            status: data ? data.status === ViolationStatus.CREATED : true,
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form autoComplete="off">
              <div className="w-[700px]">
                <div>
                  <h4 className="text-3xl text-center font-bold">{data ? "Chỉnh sửa vi phạm" : "Thêm vi phạm"}</h4>
                  <div className="mt-2.5 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <h3 className="p-0 m-0 text-xl font-bold mb-2">Cán Bộ</h3>
                      <div className="h-[1px] w-full bg-gray-300" />
                    </div>
                    <div>
                      <AutocompleteUser name="officerId" label="Tên Cán Bộ" data={users} />
                    </div>
                    <div className="col-span-2">
                      <h3 className="p-0 m-0 text-xl font-bold mb-2">Người Vi Phạm</h3>
                      <div className="h-[1px] w-full bg-gray-300" />
                    </div>
                    <div>
                      <TextField name="driverName" label="Họ Và Tên" type="text" />
                    </div>
                    <div>
                      <TextField name="driverDob" label="Ngày Sinh" type="date" />
                    </div>
                    <div className="col-span-2">
                      <TextField name="driverAddress" label="Địa Chỉ" type="text" />
                    </div>
                    <div>
                      <TextField name="driverNationality" label="Quốc Tịch" type="text" />
                    </div>
                    <div>
                      <TextField name="driverJob" label="Nghề Nghiệp" type="text" />
                    </div>
                    <div>
                      <TextField name="driverId" label="CMTND/CCCD" type="text" />
                    </div>
                    <div>
                      <TextField name="driverIdDate" label="Ngày Cấp" type="date" />
                    </div>
                    <div>
                      <TextField name="driverIdAddress" label="Cấp Tại" type="text" />
                    </div>
                    <div className="col-span-2">
                      <h3 className="p-0 m-0 text-xl font-bold mb-2">Nội Dung</h3>
                      <div className="h-[1px] w-full bg-gray-300" />
                    </div>
                    <div>
                      <TextField name="vehicleName" label="Tên Phương Tiện" type="text" />
                    </div>
                    <div>
                      <TextField name="plate" label="Biển Số" type="text" />
                    </div>
                    <div>
                      <TextField name="violationDate" label="Ngày Xử Phạt" type="datetime-local" />
                    </div>
                    <div>
                      <AutocompleteViolationType name="violationType" label="Loại Vi Phạm" data={violationType} />
                    </div>
                    <div>
                      <TextField name="locationStreet" label="Địa chỉ vi phạm (Đường)" type="text" />
                    </div>
                    <div>
                      <TextField name="locationDistrict" label="Địa chỉ vi phạm (Quận)" type="text" />
                    </div>
                    <div>
                      <TextField name="locationCity" label="Địa chỉ vi phạm (Thành Phố)" type="text" />
                    </div>
                    <div>
                      <TextField name="officerComment" label="Ý Kiến Cán Bộ" type="text" />
                    </div>
                    <div>
                      <TextField name="driverComment" label="Ý Kiến Người Vi Phạm" type="text" />
                    </div>
                    <div>
                      <TextField name="itemsKepp" label="Tang Vật/Giấy Tờ Bắt Giữ" type="text" />
                    </div>
                    <div>
                      <TextField name="penalty" label="Mức Phạt" type="number" />
                    </div>
                    <div>
                      <Select name="status" label="Trạng Thái">
                        <option value={ViolationStatus.CREATED}>Khởi Tạo</option>
                        <option value={ViolationStatus.INPROGRESS}>Đang Xử Lý</option>
                        <option value={ViolationStatus.COMPLETED}>Đã Xử Lý</option>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-4 justify-end">
                  <button className="btn btn-ghost" type="button" onClick={() => setOpen(false)}>
                    Đóng
                  </button>
                  <button className="btn btn-primary" type="submit" color="primary">
                    Lưu
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
}

interface AutocompleteProps {
  name: string;
  data: any[];
  label: string;
}

const AutocompleteViolationType = (props: AutocompleteProps) => {
  const [field, meta] = useField(props.name);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState("");
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const values = field.value.map((item: any) => {
      if (typeof item === "object") {
        return item._id;
      }
      return item;
    });
    const displayName = field.value
      .map((item: any) => {
        if (typeof item === "object") {
          return item.name;
        }
        if (typeof item === "string") {
          return props.data.find((i: any) => i._id === item)?.name;
        }
        return item;
      })
      .join(", ");
    const event = {
      target: {
        name: props.name,
        value: values,
      },
    };
    field.onChange(event);
    setResults(displayName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const update = (value: string) => {
    const index = field.value.indexOf(value);
    const list = [...field.value];
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }
    return list;
  };

  return (
    <div className="form-control w-full">
      <label className="label p-0 m-0 text-sm mb-2">{props.label}</label>
      <div className="relative flex flex-col items-center justify-center">
        <input
          type="text"
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => setSearch(e.target.value)}
          className={`input input-bordered ${meta.error ? "input-error" : ""} w-full z-[801]`}
        />
        {search && (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            onClick={() => {
              setSearch("");
              setOpen(false);
            }}
            className="absolute w-6 h-6 z-[801] top-3 right-2 cursor-pointer"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        )}
        {meta.error && meta.touched && <p className="mt-2 text-error text-xs font-semibold">{meta.error}</p>}
        {open && <div className="bg-[#11182740] fixed top-0 right-0 left-0 bottom-0 z-[800]" onClick={() => setOpen(false)} />}
        {open && (
          <ul className="absolute top-14 menu bg-base-100 w-full border border-[#000] z-[801]" ref={ref}>
            {props.data
              .filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase()))
              .map((item: any) => (
                <li
                  key={item._id}
                  onClick={() => {
                    const event = {
                      target: {
                        name: props.name,
                        value: update(item._id),
                      },
                    };
                    field.onChange(event);
                    setOpen(false);
                  }}
                >
                  <a className={`cursor-pointer ${field.value?.some((i: any) => i === item._id) ? "active" : ""}`}>{`${
                    item.name
                  } - ${formatVehicleType(item.vehicleType)}`}</a>
                </li>
              ))}
          </ul>
        )}
        <p className=" p-0 m-0 text-sm w-full mt-2">{results}</p>
      </div>
    </div>
  );
};

const AutocompleteUser = (props: AutocompleteProps) => {
  const [field, meta] = useField(props.name);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (typeof field.value === "object") {
      const event = {
        target: {
          name: props.name,
          value: field.value._id,
        },
      };
      field.onChange(event);
      setSearch(`${field.value.policeId} - ${field.value.name} - ${field.value.position}`);
    }
  }, [open, field, props.name]);

  return (
    <div className="form-control w-full">
      <label className="label p-0 m-0 text-sm mb-2">{props.label}</label>
      <div className="relative flex flex-col items-center justify-center">
        <input
          type="text"
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => setSearch(e.target.value)}
          className={`input input-bordered ${meta.error ? "input-error" : ""} w-full z-[801]`}
        />
        {search && (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            onClick={() => {
              const event = {
                target: {
                  name: props.name,
                  value: "",
                },
              };
              field.onChange(event);
              setSearch("");
              setOpen(false);
            }}
            className="absolute w-6 h-6 z-[801] top-3 right-2 cursor-pointer"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        )}
        {meta.error && meta.touched && <p className="mt-2 text-error text-xs font-semibold">{meta.error}</p>}
        {open && <div className="bg-[#11182740] fixed top-0 right-0 left-0 bottom-0 z-[800]" onClick={() => setOpen(false)} />}
        {open && (
          <ul className="absolute top-14 menu bg-base-100 w-full border border-[#000] z-[801]" ref={ref}>
            {props.data
              .filter((item: any) => `${item.policeId} - ${item.name} - ${item.position}`.toLowerCase().includes(search.toLowerCase()))
              .map((item: any) => (
                <li
                  key={item._id}
                  onClick={() => {
                    const event = {
                      target: {
                        name: props.name,
                        value: item._id,
                      },
                    };
                    field.onChange(event);
                    setSearch(`${item.policeId} - ${item.name} - ${item.position}`);
                    setOpen(false);
                  }}
                >
                  <a className={`${item._id === field.value ? "active" : ""}`}>{`${item.policeId} - ${item.name} - ${item.position}`}</a>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};
