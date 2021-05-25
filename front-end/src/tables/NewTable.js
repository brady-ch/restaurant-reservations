import React, { useState } from "react";
import { useHistory } from "react-router";

export default function NewTable() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ table_name: "", capacity: 1 });

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  function validateFields() {
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (validateFields()) {
    }
  }
  return (
    <form>
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
            min="1"
            onChange={handleChange}
            value={formData.capacity}
            required
            className="col-10"
          />
        </div>

        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <button type="button" onClick={history.goBack}>
          Cancel
        </button>
      </div>
    </form>
  );
}
