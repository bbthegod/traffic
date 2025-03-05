/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSet, Table } from "./types";
import { getValue } from "./getValue";

export function tableMaker(dataset: DataSet[], data: any) {
  const t: Table[] = [];
  for (const row of data) {
    const b: any = {
      id: row._id,
      data: [],
    };
    for (const col of dataset) {
      let v = getValue(row, col.value);
      if (col.format) {
        v = col.format(v);
      }
      const c = {
        type: col.type,
        value: v,
      };
      b.data.push(c);
    }
    t.push(b);
  }
  return t;
}
