/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * RangeDatePicker
 *
 */
import { useField } from "formik";
import Datepicker from "react-tailwindcss-datepicker";

export default function RangeDatePicker(props: any) {
  const [field, meta] = useField(props.name);
  return (
    <div className="form-control w-full">
      <label className="label p-0 m-0 text-sm mb-2">{props.label}</label>
      <Datepicker
        {...field}
        {...props}
        value={field.value}
        showShortcuts={true}
        onChange={(newValue: any) => {
          const event = {
            target: {
              name: props.name,
              value: newValue,
            },
          };
          field.onChange(event);
        }}
        inputClassName={`input input-bordered ${meta.error ? "input-error" : ""} w-full`}
      />
      {meta.error && meta.touched && <p className="mt-2 text-error text-xs font-semibold">{meta.error}</p>}
    </div>
  );
}
