/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * Snackbar
 *
 */
"use client";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { SnackbarContext } from "@/contexts/SnackbarContext";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  children: any;
}

const ToastContainer = dynamic(() => import("react-toastify").then((module) => module.ToastContainer), {
  ssr: false,
});

export function Snackbar(props: Props) {
  //====================================== Callback ======================================
  const open = (message: string, variant: string) => {
    if (variant === "success") {
      toast.success(message);
    }

    if (variant === "error") {
      toast.error(message);
    }
  };
  //====================================== Render ======================================
  return (
    <SnackbarContext.Provider value={{ open }}>
      {props.children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </SnackbarContext.Provider>
  );
}
