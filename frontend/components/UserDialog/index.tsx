/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * UserDialog
 *
 */
import { Formik, Form } from "formik";
import * as Yup from "yup";

import Dialog from "../Dialog";
import Select from "../Select";
import TextField from "../TextField";

import { User, Status } from "@/utils/types";
import { stringNormalize } from "@/utils/stringNormalize";
import Toggle from "../Toggle";
import { useEffect, useState } from "react";

interface Props {
  data?: User;
  open: boolean;
  setOpen: (v: boolean) => void;
  handleSubmit: (v: any) => void;
}

const validationSchema = Yup.object().shape({
  policeId: Yup.string().required("Trường này không được để trống !"),
  username: Yup.string().required("Trường này không được để trống !"),
  name: Yup.string().required("Trường này không được để trống !"),
  position: Yup.string().required("Trường này không được để trống !"),
  password: Yup.string().required("Trường này không được để trống !"),
  role: Yup.string().required("Trường này không được để trống !"),
  status: Yup.boolean().required("Trường này không được để trống !"),
});

export default function UserDialog({ open, setOpen, data, handleSubmit }: Props) {
  const [auth, setAuth] = useState<any>({});
  //====================================== Callback ======================================
  const onSubmit = async (values: any) => {
    values.name = stringNormalize(values.name);
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
            policeId: data ? data.policeId : "",
            username: data ? data.username : "",
            name: data ? data.name : "",
            position: data ? data.position : "",
            password: data ? "******" : "",
            role: data ? data.role : "user",
            status: data ? data.status === Status.ACTIVE : true,
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form autoComplete="off">
              <div className="w-[700px]">
                <div>
                  <h4 className="text-3xl text-center font-bold">{data ? "Chỉnh sửa cán bộ" : "Thêm cán bộ"}</h4>
                  <div className="mt-2.5 grid grid-cols-2 gap-4">
                    <div>
                      <TextField name="username" label="Tên Tài Khoản" type="text" />
                    </div>
                    <div>
                      <TextField name="policeId" label="Số Hiệu Cán Bộ" type="text" />
                    </div>
                    <div>
                      <TextField name="name" label="Tên Cán Bộ" type="text" />
                    </div>
                    <div>
                      <TextField name="position" label="Vị Trí" type="text" />
                    </div>
                    <div>
                      <Select name="role" label="Quyền Hệ Thống">
                        <option value="admin">Người Quản Trị</option>
                        <option value="user">Cán Bộ</option>
                      </Select>
                    </div>
                    <div>
                      <TextField name="password" label="Mật khẩu" type="text" disabled={!!data} />
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
