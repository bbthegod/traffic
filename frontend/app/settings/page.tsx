/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * SettingsPage
 *
 */
"use client";
import * as Yup from "yup";

// import { BASE_URL, DataSet, SnackbarContext, User } from '@its/common';

import Header from "@/components/Header";
import MainLayout from "@/components/MainLayout";
import { useContext } from "react";
import { mutation } from "@/utils/services";
import { SnackbarContext } from "@/contexts/SnackbarContext";
import { Form, Formik } from "formik";
import TextField from "@/components/TextField";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Trường này không được để trống !"),
  newPassword: Yup.string().required("Trường này không được để trống !"),
  reNewPassword: Yup.string().required("Trường này không được để trống !"),
});

export default function SettingsPage() {
  const Snackbar = useContext(SnackbarContext);
  //====================================== State ======================================
  //====================================== Callback ======================================
  const onSubmit = async (values: any) => {
    mutation("/auth/change-password", values)
      .then(() => {
        Snackbar?.open("Đổi mật khẩu thành công", "success");
      })
      .catch(() => {
        Snackbar?.open("Đổi mật khẩu thất bại", "error");
      });
  };
  //====================================== Render ======================================
  return (
    <MainLayout>
      <Header title="Cài Đặt" subtitle="Trang" />
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          reNewPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form autoComplete="off">
            <div>
              <h4 className="text-3xl text-center font-bold"></h4>
              <div className="mt-2.5 grid grid-cols-2 gap-4">
                <div>
                  <TextField name="oldPassword" label="Mật Khẩu Cũ" type="text" />
                </div>
                <div>
                  <TextField name="newPassword" label="Mật Khẩu Mới" type="text" />
                </div>
                <div></div>
                <div>
                  <TextField name="reNewPassword" label="Nhập Lại Mật Khẩu Mới" type="text" />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-4 justify-end">
              <button className="btn btn-primary" type="submit" color="primary">
                Lưu
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </MainLayout>
  );
}
