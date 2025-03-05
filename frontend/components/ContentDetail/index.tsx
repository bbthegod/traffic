/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * ContentDetail
 *
 */

import { DataSet } from "@/utils/types";
import { detailMaker } from "@/utils/detailMaker";

interface Props {
  children: any;
  title: string;
  dataset: DataSet[];
  data: any;
}

export default function ContentDetail({ children, title, dataset, data }: Props) {
  return (
    <div className="flex justify-center">
      <div className="min-w-[300px] bg-base-100 shadow-md p-4">
        <h1 className="text-lg mb-4 text-center font-bold">{title}</h1>
        <hr />
        <div className="p-0">
          <table className="table w-full">
            <tbody>
              {detailMaker(dataset, data).map((v: any, i: any) => (
                <tr key={i}>
                  <th className="!static">{v[0]}</th>
                  <td>{v[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr />
        <div className="flex flex-col items-start gap-2 mt-4">{children}</div>
      </div>
    </div>
  );
}
