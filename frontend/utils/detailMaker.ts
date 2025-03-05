/* eslint-disable @typescript-eslint/no-explicit-any */
import { getValue } from "./getValue";
import { DataSet } from "./types";

export function detailMaker(dataset: DataSet[], data: any) {
  const res: string[][] = [];
  for (const i in dataset) {
    let value = getValue(data, dataset[i].value);
    if (dataset[i].format) {
      value = dataset[i].format(value);
    }
    const t = [`${dataset[i].title}`, `${value}`];
    res.push(t);
  }
  return res;
}
