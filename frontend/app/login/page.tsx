/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * LoginPage
 *
 */
"use client";
import { useContext, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { AuthType, ErrorMessages, ErrorType } from "@/utils/types";
import { request } from "@/utils/request";
import { navigate } from "@/utils/actions";
import TextField from "@/components/TextField";
import { SnackbarContext } from "@/contexts/SnackbarContext";
import Image from "next/image";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Trường này không được để trống !"),
  password: Yup.string().required("Trường này không được để trống !"),
});

export default function LoginPage() {
  const Snackbar = useContext(SnackbarContext);
  //====================================== Effect ======================================
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //====================================== Callback ======================================
  const onShowPassword = () => setShowPassword(!showPassword);
  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await request({
        url: "/auth/login",
        method: "POST",
        data: {
          username: values.username,
          password: values.password,
        },
      });
      if (response) {
        const auth: AuthType = {
          token: response?.token,
          username: response?.user?.username,
          name: response?.user?.name,
          role: response?.user?.role,
          id: response?.user?.id,
        };
        localStorage.setItem("auth", JSON.stringify(auth));
        navigate("/");
      } else {
        Snackbar?.open("Đăng nhập thất bại", "error");
      }
    } catch (error: any) {
      if (error.response?.data?.error === ErrorType.USER_NOT_FOUND) {
        return Snackbar?.open(ErrorMessages.USER_NOT_FOUND, "error");
      }
      if (error.response?.data?.error === ErrorType.USERNAME_OR_PASSWORD_INCORRECT) {
        return Snackbar?.open(ErrorMessages.USERNAME_OR_PASSWORD_INCORRECT, "error");
      }
      if (error.response?.data?.error === ErrorType.USER_NOT_ACTIVE) {
        return Snackbar?.open(ErrorMessages.USER_NOT_ACTIVE, "error");
      }
      Snackbar?.open("Đăng nhập thất bại", "error");
    } finally {
      setLoading(false);
    }
  };
  //====================================== Render ======================================
  return (
    <div className="relative grow flex flex-col justify-center items-center">
      <Image src="/flag.png" width={1000} height={1000} alt="logo" className="absolute z-[0] top-0 right-0" />
      <div className="p-6 w-[400px] z-[1]">
        <Formik initialValues={{ username: "", password: "" }} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isValid }) => (
            <Form autoComplete="off">
              <div className="flex justify-center mb-4">
                <Image src="/phu_hieu.png" width={50} height={50} alt="logo" className="w-[100px]" />
              </div>
              <h1 className="font-semibold text-3xl text-center mb-4">ĐĂNG NHẬP</h1>
              <div className="mb-2">
                <TextField name="username" type="text" label="Tên Đăng Nhập" />
              </div>
              <div className="mb-2">
                <TextField name="password" type={showPassword ? "text" : "password"} label="Mật Khẩu" />
              </div>
              <div className="flex items-center gap-2 mb-5" onClick={onShowPassword}>
                <button className="btn btn-square btn-ghost btn-xs" type="button">
                  {showPassword ? (
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
                <p className="text-sm font-semibold">{showPassword ? "Ẩn" : "Hiện"} mật khẩu</p>
              </div>
              <button className={`btn btn-primary btn-block ${loading ? "loading" : ""}`} type="submit" disabled={loading || !isValid}>
                ĐĂNG NHẬP
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
