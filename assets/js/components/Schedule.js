import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import DoctorSelect from "./DoctorSelect";
import AppointmentsTable from "./AppointmentsTable";


const LIST_APPOINTMENTS_FOR_DOCTOR = gql`
  query ListAppointments($startDate: String!, $endDate: String!, $doctorId: ID!) {
    appointments(startDate: $startDate, endDate: $endDate, doctorId: $doctorId) {
      id
      reason
      date

      doctor {
        id
        firstName
        lastName
      }

      user {
        id
        email
        name
      }

      pet {
        id
        name
      }
    }
  }
`;

const LIST_DOCTORS = gql`
  query ListDoctors {
    doctors {
      id
      firstName
      lastName
    }
  }
`;

const getStartOfWeek = (date) => {
  const start = date.setDate(date.getDate() - date.getDay());
  return new Date(start);
};

const getEndOfWeek = (date) => {
  const end = date.setDate(date.getDate() + (6 - date.getDay()));
  return new Date(end);
};

const startDate = getStartOfWeek(new Date());
const endDate = getEndOfWeek(new Date());

/**
 * Displays the appointments for the respectively-selected doctor
 * @returns JSX.Element
 */
const Schedule = () => {
  // Initialize `selectedDoctor` to represent which doctor is selected, and a function to update it.
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Leverage Apollo's `useQuery` react hook to execute the `LIST_DOCTORS` graphql query
  const listDoctorsResult = useQuery(LIST_DOCTORS, {
    onCompleted: ({ doctors }) => {
      if (doctors.length) {
        // If the query successfully returns a list of doctors, select the first one by default.
        setSelectedDoctor(doctors[0].id);
      }
    }
  });

  // Leverage Apollo's `useQuery` react hook to execute the `LIST_APPOINTMENTS_FOR_DOCTOR` graphql query
  const listAppointmentsForDoctorResult = useQuery(LIST_APPOINTMENTS_FOR_DOCTOR, {
    variables: {
      startDate,
      endDate,
      doctorId: selectedDoctor
    },
    skip: !selectedDoctor // Don't execute query if no doctor is selected.
  });

  return (
    <form className="app app--schedule grid-container">
      <div className="grid-x grid-padding-x">
        <div className="cell small-12">
          <h1>Schedule</h1>
        </div>
        <div className="cell large-4">
          <DoctorSelect
            doctors={listDoctorsResult?.data?.doctors} // The result from executing the `LIST_DOCTORS` query
            loading={listDoctorsResult.loading}        // Inform the component if the `LIST_DOCTORS` query is loading
            onDoctorSelected={setSelectedDoctor}       // Pass the function used to update `selectedDoctor` to handle the component's `onDoctorSelected` event
            selectedDoctor={selectedDoctor}            // Maintain state
          />
        </div>
        <div className="cell large-8">
          <AppointmentsTable
            appointments={listAppointmentsForDoctorResult?.data?.appointments}             // The result from executing the `LIST_APPOINTMENTS_FOR_DOCTOR` query
            loading={listAppointmentsForDoctorResult.loading || listDoctorsResult.loading} // Inform the component if any dependant query is loading
          />
        </div>
      </div>
    </form>
  );
};

export default Schedule;
