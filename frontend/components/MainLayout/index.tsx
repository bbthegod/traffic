/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * MainLayout
 *
 */
"use client";
import * as React from "react";

import SideBar from "../SideBar";
import { navigate } from "@/utils/actions";

interface Props {
  children?: React.ReactNode;
}

export default function MainLayout(props: Props) {
  React.useEffect(() => {
    if (localStorage) {
      const auth = localStorage.getItem("auth");
      try {
        if (!auth) {
          navigate("/login");
          window.location.href = "login";
        }
      } catch (err: any) {
        localStorage.removeItem("auth");
        navigate("/login");
        window.location.href = "login";
      }
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex">
      <SideBar />
      <main className="w-full min-h-screen pt-24 md:pt-6 md:pl-24 p-6">{props.children}</main>
    </div>
  );
}
