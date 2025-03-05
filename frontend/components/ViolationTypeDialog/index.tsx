/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * ViolationTypeDialog
 *
 */
import { Formik, Form } from "formik";
import * as Yup from "yup";

import Dialog from "../Dialog";
import TextField from "../TextField";

import { Status, VehicleType, ViolationType } from "@/utils/types";
import Toggle from "../Toggle";
import Select from "../Select";
import { useEffect, useState } from "react";

interface Props {
  data?: ViolationType;
  open: boolean;
  setOpen: (v: boolean) => void;
  handleSubmit: (v: any) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Trường này không được để trống !"),
  amountFrom: Yup.string().required("Trường này không được để trống !"),
  amountTo: Yup.string().required("Trường này không được để trống !"),
  vehicleType: Yup.string().required("Trường này không được để trống !"),
  status: Yup.boolean().required("Trường này không được để trống !"),
});

export default function ViolationTypeDialog({ open, setOpen, data, handleSubmit }: Props) {
  const [auth, setAuth] = useState<any>({});
  //====================================== Callback ======================================
  const onSubmit = async (values: any) => {
    handleSubmit({
      ...data,
      ...values,
      ...{ status: values.status === true ? Status.ACTIVE : Status.INACTIVE },
    });
    setOpen(false);
  };
  //====================================== Effect ======================================
  useEffect(() => {
    if (localStorage) {
      const a = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth") ?? "{}") : {};
      setAuth(a);
    }
  }, []);
  //====================================== Render ======================================
  return (
    <Dialog setOpen={setOpen} open={open}>
      <div>
        <Formik
          initialValues={{
            name: data ? data.name : "",
            amountFrom: data ? data.amountFrom : "",
            amountTo: data ? data.amountTo : "",
            vehicleType: data ? data.vehicleType : "",
            status: data ? data.status === Status.ACTIVE : true,
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form autoComplete="off">
              <div className="w-[700px]">
                <div>
                  <h4 className="text-3xl text-center font-bold">{data ? "Chỉnh sửa loại vi phạm" : "Thêm loại vi phạm"}</h4>
                  <div className="mt-2.5 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <TextField name="name" label="Tên Vi Phạm" type="text" />
                    </div>
                    <div>
                      <TextField name="amountFrom" label="Mức Phạt Từ" type="number" />
                    </div>
                    <div>
                      <TextField name="amountTo" label="Mức Phạt Đến" type="number" />
                    </div>
                    <div>
                      <Select name="vehicleType" label="Loại Xe">
                        <option value={VehicleType.CAR}>Xe Hơi</option>
                        <option value={VehicleType.MOTORBIKE}>Xe Máy</option>
                        <option value={VehicleType.TRICYCLE}>Xe Ba Bánh</option>
                      </Select>
                    </div>
                    <div>
                      <Toggle name="status" label="Trạng Thái" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-4 justify-end">
                  <button className="btn btn-ghost" type="button" onClick={() => setOpen(false)} disabled={auth?.role === "user"}>
                    Đóng
                  </button>
                  <button className="btn btn-primary" type="submit" color="primary" disabled={auth?.role === "user"}>
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
