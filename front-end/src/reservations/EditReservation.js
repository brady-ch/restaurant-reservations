import React, { useEffect, useState } from "react";
import { readReservation, updateReservation } from "../utils/api";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

export default function EditReservation({ reRender, setReRender }) {
  const [reservation, setReservation] = useState();
  const [error, setError] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();

    readReservation(reservation_id, abortController.signal)
      .then((res) => {
        delete res.updated_at;
        delete res.created_at;
        setReservation(res);
      })
      .catch(setError);
  }, [reservation_id]);

  function handleChange({ target }) {
    setReservation({ ...reservation, [target.name]: target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    updateReservation(reservation)
      .then(() => setReRender(!reRender))
      .then(() =>
        history.push(`/dashboard?date=${reservation.reservation_date}`)
      )
      .catch(setError);
  }

  return (
    <div className="container">
      <form>
        <div className="row mt-1">
          <label htmlFor="first_name" className="col-2">
            First Name:&nbsp;{" "}
          </label>
          <input
            name="first_name"
            id="first_name"
            type="text"
            onChange={handleChange}
            value={reservation?.first_name}
            required
            className="col-10"
            placeholder="John"
          />
        </div>
        <div className="row mt-1">
          <label htmlFor="last_name" className="col-2">
            Last Name:&nbsp;{" "}
          </label>
          <input
            name="last_name"
            id="last_name"
            type="text"
            onChange={handleChange}
            value={reservation?.last_name}
            required
            className="col-10"
            placeholder="Doe"
          />
        </div>
        <div className="row mt-1">
          <label htmlFor="mobile_number" className="col-2">
            Mobile Number:&nbsp;{" "}
          </label>
          <input
            name="mobile_number"
            id="mobile_number"
            type="text"
            onChange={handleChange}
            value={reservation?.mobile_number}
            required
            placeholder="XXX-XXX-XXXX"
            className="col-10"
          />
        </div>
        <div className="row mt-1">
          <label htmlFor="reservation_date" className="col-2">
            Reservation Date:&nbsp;{" "}
          </label>
          <input
            name="reservation_date"
            id="reservation_date"
            type="date"
            onChange={handleChange}
            value={reservation?.reservation_date}
            required
            placeholder="mm/dd/yyyy"
            className="col-10"
          />
        </div>
        <div className="row mt-1">
          <label htmlFor="reservation_time" className="col-2">
            Reservation Time:&nbsp;{" "}
          </label>
          <input
            name="reservation_time"
            id="reservation_time"
            type="time"
            onChange={handleChange}
            value={reservation?.reservation_time}
            required
            placeholder="--:--:--"
            className="col-10"
          />
        </div>
        <div className="row mt-1">
          <label htmlFor="people" className="col-2">
            People:&nbsp;{" "}
          </label>
          <input
            name="people"
            id="people"
            type="number"
            onChange={handleChange}
            value={reservation?.people}
            required
            placeholder="0"
            min={1}
            className="col-10"
          />
        </div>

        <div className="row mt-1">
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
          <button type="button" onClick={history.goBack}>
            Cancel
          </button>
        </div>
      </form>
      <ErrorAlert error={error} />
    </div>
  );
}
