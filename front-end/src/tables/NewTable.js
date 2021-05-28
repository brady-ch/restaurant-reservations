import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function NewTable() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ table_name: "", capacity: null });

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    createTable(formData)
      .then(() => history.push(`/dashboard`))
      .catch((error) => {
        setError(error);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
        <div className="row mt-1">
          <label htmlFor="table_name" className="col-2">
            Table Name:&nbsp;
          </label>
          <input
            name="table_name"
            id="table_id"
            type="text"
            minLength="2"
            onChange={handleChange}
            value={formData.table_name}
            required
            className="col-10"
            placeholder="ex: #1, #2, #3, Bar #1"
          />
        </div>

        <div className="row mt-1">
          <label htmlFor="capacity" className="col-2">
            Capacity:&nbsp;
          </label>
          <input
            name="capacity"
            id="capacity"
            type="number"
            onChange={handleChange}
            value={formData.capacity}
            required
            className="col-10"
          />
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={history.goBack}>
          Cancel
        </button>
        <ErrorAlert error={error} />
      </div>
    </form>
  );
}
