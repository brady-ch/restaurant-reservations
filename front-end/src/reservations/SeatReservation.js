import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, listTables, updateTable } from "../utils/api";

export default function SeatReservation() {
  const [reservation, setReservation] = useState(null);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState(null);
  const history = useHistory();
  const abortController = new AbortController();

  const { params } = useRouteMatch();
  const reservation_id = params.reservation_id;

  useEffect(() => {
    setError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(() => setError);
    listTables(abortController.signal)
      .then(setTables)
      .catch((error) => setError(error));
    return () => abortController.abort();
  }, [reservation_id]);

  const handleChange = (event) => {
    setSelected(() =>
      tables.find((el) => +el.table_id === +event.target.value)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    if (!selected) {
      const message = "Please select a table";
      setError({ message });
    } else {
      updateTable(selected.table_id, reservation_id, abortController.signal)
        .then(() =>
          history.push(
            `/dashboard?date=${date.getFullYear()}-${date.getMonth() + 1}-${
              date.getDate() + 1
            }`
          )
        )
        .catch((error) => setError(error));
    }
  };

  useEffect(() => {
    if (reservation) setDate(new Date(reservation.reservation_date));
  }, [reservation]);

  return (
    <div className="container">
      <h2 className="row">Seat Party</h2>
      <p>
        {JSON.stringify(
          date
            ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            : null
        )}
      </p>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_id">Table:</label>
        <select onChange={handleChange} name="table_id">
          <option value="" key="0">
            Select
          </option>
          {tables.map((el) => {
            return (
              <option value={el.table_id} key={el.table_id}>
                {el.table_name} - {el.capacity}
              </option>
            );
          })}
        </select>

        <div>
          <button type="submit">Sumbit</button>
          <button type="cancel" onClick={history.goBack}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
