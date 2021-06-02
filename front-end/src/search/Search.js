import React, { useState } from "react";
import ReservationTable from "../reservations/ReservationTable";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservationsbyNumber } from "../utils/api";

export default function Search({ reRender, setReRender }) {
  const [mobileNumber, setMobileNumber] = useState();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const abortController = new AbortController();
  const loadReservations = async (mobileNumber) => {
    setError(null);
    listReservationsbyNumber({ mobileNumber }, abortController.signal)
      .then((res) => {
        setReservations(res);
        if (!res.length) {
          setError({ message: "No reservations found" });
        }
      })
      .catch(setError);
  };

  function handleSubmit(event) {
    event.preventDefault();
    loadReservations(mobileNumber);
    setReRender(!reRender);
  }

  function handleChange({ target }) {
    setMobileNumber(target.value);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile_number">Search by Phone Number</label>
        <input
          name="mobile_number"
          id="mobile_number"
          type="tel"
          value={mobileNumber}
          required
          onChange={handleChange}
          placeholder="555-555-5555"
        />
        <button type="submit">Find</button>
      </form>
      <ErrorAlert error={error} />
      <ReservationTable reservations={reservations} />
    </div>
  );
}
