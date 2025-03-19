/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * ViolationTypeDialog
 *
 */
import * as Yup from "yup";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";

import { SnackbarContext } from "@/contexts/SnackbarContext";
import { query } from "@/utils/services";
import { User } from "@/utils/types";

import { AutocompleteUser } from "../ViolationDialog";
import RangeDatePicker from "../RangeDatePicker";
import Select from "../Select";

interface Props {
  filter: any;
  open: boolean;
  setOpen: (v: boolean) => void;
  handleSubmit: (v: any) => void;
}

const validationSchema = Yup.object().shape({
  location: Yup.string(),
  time: Yup.object(),
});

export default function ViolationTypeDialog({ filter, open, setOpen, handleSubmit }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Snackbar = useContext(SnackbarContext);
  const [location, setLocation] = useState([]);
  const [users, setUsers] = useState<User[]>([]);
  //====================================== Callback ======================================
  const getViolations = useCallback(() => {
    query("/violation/report")
      .then((data: any) => {
        if (data) {
          setLocation(data.data.location);
        }
      })
      .catch((e: any) => {
        console.log(e);
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

  const onSubmit = async (values: any) => {
    handleSubmit({
      policeId: values.policeId,
      location: values.location,
      timeStart: values.time.startDate ? new Date(values.time.startDate).toISOString() : null,
      timeEnd: values.time.endDate ? new Date(values.time.endDate).toISOString() : null,
    });
    setOpen(false);
  };

  const reset = () => {
    handleSubmit({
      location: "",
      timeStart: "",
      timeEnd: "",
    });
    setOpen(false);
  };
  const onClick = (e: any) => {
    if (ref.current) {
      if (!ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
  };
  //====================================== Effect ======================================
  useEffect(() => {
    getViolations();
    getUsers();
  }, [getViolations, getUsers]);

  //====================================== Render ======================================
  return open ? (
    <div className="bg-[#11182740] fixed top-0 right-0 left-0 bottom-0 z-[998] flex justify-center items-center" onClick={onClick}>
      <div ref={ref} className="absolute flex flex-col bg-base-100 right-0 shadow-md p-6 h-screen z-[999] overflow-y-auto">
        <Formik
          initialValues={{
            policeId: filter?.policeId ? filter.policeId : "",
            location: filter?.location ? filter.location : "",
            time: filter?.timeStart
              ? {
                  startDate: new Date(filter.timeStart),
                  endDate: new Date(filter.timeEnd),
                }
              : {},
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form autoComplete="off" className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col w-[800px]">
                <div className="flex-1">
                  <h4 className="text-3xl text-center font-bold">Phân Loại</h4>
                  <div className="flex w-full justify-end">
                    <button className="btn btn-primary btn-sm" type="button" onClick={reset}>
                      Đặt Lại
                    </button>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <AutocompleteUser name="policeId" label="Tên Cán Bộ" data={users} />
                    </div>
                    <div className="col-span-2">
                      <RangeDatePicker name="time" label="Thời Gian Vi Phạm" />
                    </div>
                    <div className="col-span-2">
                      <Select name="location" label="Khu Vực">
                        <option key="" value="">
                          All
                        </option>
                        {location.map((item: any) => (
                          <option key={item._id.locationDistrict} value={item._id.locationDistrict}>
                            {item._id.locationDistrict}
                          </option>
                        ))}
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
    </div>
  ) : null;
}
