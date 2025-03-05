/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *
 * DataTable
 *
 */
"use client";
import { useEffect, useState } from "react";

import { DataSet, Table } from "@/utils/types";
import { tableMaker } from "@/utils/tableMaker";
// import Loading from '@/components/Loading';
import { navigate } from "@/utils/actions";

interface Props {
  data: any;
  loading: boolean;
  dataset: DataSet[];
  count?: number | undefined;
  title?: string | undefined;
  sort?: string | undefined;
  page?: number | undefined;
  rowsPerPage?: number | undefined;
  openFilter?: () => void | undefined;
  handleSort?: (sort: string) => void | undefined;
  handleChangePage?: (page: number) => void | undefined;
  handleChangeRowsPerPage?: (event: any) => void | undefined;
}

const getSortIcon = (sort: string | undefined, value: string) => {
  if (value === sort) return <ArrowDown />;
  if (`-${value}` === sort) return <ArrowUp />;
  return null;
};

export default function DataTable(props: Props) {
  const { count, page, loading, rowsPerPage, title, sort, data, dataset, openFilter, handleSort, handleChangePage, handleChangeRowsPerPage } = props;
  //====================================== State ======================================
  const [table, setTable] = useState<Table[] | undefined>(undefined);
  //====================================== State ======================================
  useEffect(() => {
    const temp = tableMaker(dataset, data);
    setTable(temp);
  }, [dataset, data]);
  //====================================== State ======================================
  return (
    <div className="mt-8">
      {!loading ? (
        <>
          <div className="flex items-center mb-3">
            {page !== undefined && count !== undefined && rowsPerPage !== undefined ? (
              <h3 className="flex-1 text-sm">{`${count} Bản ghi được tìm thấy. Trang ${page + 1} trên ${Math.ceil(count / rowsPerPage)}`}</h3>
            ) : (
              <div className="flex-1" />
            )}
            {openFilter && (
              <button className="btn btn-square btn-sm bg-white" onClick={openFilter}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="cursor-pointer w-6 h-6">
                  <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                </svg>
              </button>
            )}
          </div>
          <div className="bg-base-100 shadow-md p-4">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    {dataset &&
                      dataset.map((item: any, index: number) => (
                        <th
                          className="bg-base-100 !static cursor-pointer select-none"
                          key={index}
                          onClick={() => {
                            if (!sort) handleSort?.(item.value);
                            if (sort && !sort.includes("-")) handleSort?.(`-${item.value}`);
                            if (sort && sort.includes("-")) handleSort?.("");
                          }}
                        >
                          <div className={`flex gap-1 ${getSortIcon(sort, item.value) ? "text-bold" : ""}`}>
                            {item.title} {getSortIcon(sort, item.value)}
                          </div>
                        </th>
                      ))}
                    <th className="bg-base-100" align="right">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table &&
                    table.map((items: any) => (
                      <tr key={items.id}>
                        {items.data.map((item: any, index: number) => (
                          <td key={index}>{item.value}</td>
                        ))}
                        <th align="right" key={-1}>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              navigate(`/${title}/${items.id}`);
                            }}
                          >
                            XEM
                          </button>
                        </th>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              {page !== undefined && count !== undefined && rowsPerPage !== undefined && handleChangePage && handleChangeRowsPerPage && (
                <TablePagination
                  page={page}
                  count={count}
                  rowsPerPage={rowsPerPage}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        // <Loading />
        <h1>loading</h1>
      )}
    </div>
  );
}

interface TablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (page: number) => void;
  handleChangeRowsPerPage: (event: any) => void;
}

const TablePagination = (props: TablePaginationProps) => {
  const numberOfPage = Math.floor(props.count / props.rowsPerPage);
  return (
    <div className="flex justify-end gap-4">
      <select className="select select-primary focus:outline-0 h-8 min-h-0" value={props.rowsPerPage} onChange={props.handleChangeRowsPerPage}>
        <option>10</option>
        <option>25</option>
        <option>50</option>
      </select>
      <div className="ml-4 btn-group h-8 min-h-0">
        <button className="btn h-8 min-h-0" disabled={props.page === 0} onClick={() => props.handleChangePage(Math.max(props.page - 1, 0))}>
          «
        </button>
        <button className="btn h-8 min-h-0">{props.page}</button>
        <button
          className="btn h-8 min-h-0"
          disabled={props.page === numberOfPage}
          onClick={() => props.handleChangePage(Math.min(props.page + 1, numberOfPage))}
        >
          »
        </button>
      </div>
    </div>
  );
};

const ArrowUp = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.5} fill="currentColor" className="w-4 h-4">
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowDown = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.5} fill="currentColor" className="w-4 h-4">
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
      clipRule="evenodd"
    />
  </svg>
);
