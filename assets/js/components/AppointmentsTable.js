import React from "react";

/**
 * Decomposes a date instance into it's respective date and time
 * @param {String | Date} date
 * @returns Object
 */
const fragmentizeDate = (date) => {
  const stringify = new Date(date);
  return {date: stringify.toLocaleDateString(), time: stringify.toLocaleTimeString()};
};

/**
 * Displays a table containing the details of each appointment in a list
 * @returns JSX.Element
 */
const AppointmentsTable = ({ appointments = [], loading = true }) => {
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (!appointments.length) {
    return <h1>No Appointments Found</h1>;
  }
  return (
    <table className="appointments hover">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Pet</th>
          <th>Reason</th>
          <th>Owner</th>
        </tr>
      </thead>
      <tbody>
      {appointments.map((appointment) => (
        <tr key={appointment.id} className="appointment">
          <td className="appointment__date">{fragmentizeDate(appointment.date).date}</td>
          <td className="appointment__time">{fragmentizeDate(appointment.date).time}</td>
          <td>{appointment.pet.name}</td>
          <td>{appointment.reason}</td>
          <td>{appointment.user.name} ({appointment.user.email})</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default AppointmentsTable;
