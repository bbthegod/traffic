/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * Toggle
 *
 */
import { useField } from "formik";

export default function Toggle(props: any) {
  const [field, meta] = useField(props.name);
  return (
    <div className="form-control w-full">
      <label className="label p-0 m-0 text-sm mb-2">{props.label}</label>
      <input {...field} {...props} type="checkbox" className="toggle" checked={field.value === true} />
      {meta.error && meta.touched && <p className="mt-2 text-error text-xs font-semibold">{meta.error}</p>}
    </div>
  );
}
