import React from "react";

/**
 * Displays a dropdown containing a user-selectable list of doctors
 * @returns JSX.Element
 */
const DoctorSelect = ({ doctors = [], loading, onDoctorSelected, selectedDoctor }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (!doctors.length) {
    return <h2>No Doctors Available</h2>;
  }
  return (
    <select onChange={(event) => onDoctorSelected(event.target.value)} value={selectedDoctor?.id}>
      {doctors.map((doctor) => (
        <option key={doctor.id} value={doctor.id}>
          Dr. {doctor.firstName} {doctor.lastName}
        </option>
      ))}
    </select>
  );
};

export default DoctorSelect;
