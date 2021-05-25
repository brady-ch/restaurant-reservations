import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewReservation() {
  const history = useHistory();
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });

  function handleSubmit(event) {
    event.preventDefault();
    createReservation(formData)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch((error) => {
        setErrors(error);
      });
  }

  function handleChange({ target }) {
    if (target.name === "people") {
      setFormData({ ...formData, people: Number(target.value) });
    } else {
      setFormData({ ...formData, [target.name]: target.value });
    }
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
            value={formData.first_name}
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
            value={formData.last_name}
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
            value={formData.mobile_number}
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
            value={formData.reservation_date}
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
            value={formData.reservation_time}
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
            value={formData.people}
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
      <ErrorAlert error={errors} />
    </div>
  );
}
