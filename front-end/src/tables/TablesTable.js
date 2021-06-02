import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { clearTable } from "../utils/api";

export default function TablesTable({ tables, reRender, setReRender }) {
  const [error, setError] = useState(null);
  const handleClick = (table_id) => {
    setError(null);
    const abortController = new AbortController();
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      clearTable(table_id, abortController.signal)
        .catch((err) => setError(err))
        .then(() => setReRender(() => !reRender));
    }
  };
  return (
    <div>
      <ErrorAlert error={error} />
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {tables.map((element, index) => {
            return (
              <tr key={index}>
                <td>{element.table_name}</td>
                <td>{element.capacity}</td>
                <td data-table-id-status={element.table_id}>
                  {element.reservation_id ? "Occupied" : "Free"}
                </td>
                <td>
                  {element.reservation_id ? (
                    <button
                      data-table-id-finish={element.table_id}
                      className="btn btn-danger"
                      onClick={() => handleClick(element.table_id)}
                    >
                      Finish
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
