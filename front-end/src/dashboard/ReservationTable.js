import React from "react";

export default function ReservationTable({ reservations }) {
  return (
    <table className="table table-striped">
      <thead className="thead-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Mobile Number</th>
          <th scope="col">Date</th>
          <th scope="col">Time</th>
          <th scope="col">Status</th>
          <th scope="col">People</th>
          <th scope="col">Seat</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((element, index) => {
          const { reservation_id } = element;
          return (
            <tr key={index}>
              <th scope="row">{element.reservation_id}</th>
              <td>{element.first_name}</td>
              <td>{element.last_name}</td>
              <td>{element.mobile_number}</td>
              <td>{element.reservation_date}</td>
              <td>{element.reservation_time}</td>
              <th data-reservation-id-status={element.reservation_id}>
                {element.status}
              </th>
              <td>{element.people}</td>
              {element.status === "booked" ? (
                <td>
                  <a
                    className="btn btn-primary"
                    href={`/reservations/${reservation_id}/seat`}
                  >
                    Seat
                  </a>
                </td>
              ) : null}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
