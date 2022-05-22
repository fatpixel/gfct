defmodule GoFetch.AppointmentTest do
  use ExUnit.Case
  alias GoFetch.Appointment
  alias GoFetch.Doctor

  import GoFetch.Factory

  setup do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(GoFetch.Repo)
  end

  describe "get_appointments_by_date/1" do
    test "only returns appointments from within the given timeframe" do
      two_days_in_seconds = 172_800
      thirty_days_in_seconds = 2_592_000

      # Search start & end points
      start_search_today = DateTime.utc_now()
      end_search_in_two_days = DateTime.add(start_search_today, two_days_in_seconds)

      # Add appointments outside of search range
      _past_appointment = insert(:appointment, %{date: Faker.DateTime.backward(30)})
      future_appt_earliest = DateTime.add(end_search_in_two_days, 1, :second)
      future_appt_latest = DateTime.add(start_search_today, thirty_days_in_seconds, :second)
      _future_appointment = insert(:appointment, %{date: Faker.DateTime.between(future_appt_earliest, future_appt_latest)})
      # Add appointment within range
      valid_appointment = insert(:appointment, %{date: Faker.DateTime.between(start_search_today, end_search_in_two_days)})

      appointments =
        Appointment.get_appointments_by_date(%{
          start_date: DateTime.to_string(start_search_today),
          end_date: DateTime.to_string(end_search_in_two_days)
        })

      assert length(appointments) == 1
      [appointment] = appointments
      assert appointment.date == valid_appointment.date
    end
  end

  describe "get_appointments_by_date_for_doctor/1" do
    test "only returns appointments for a given doctor within the given timeframe" do
      two_days_in_seconds = 172_800
      thirty_days_in_seconds = 2_592_000

      # Search start & end points
      start_search_today = DateTime.utc_now()
      end_search_in_two_days = DateTime.add(start_search_today, two_days_in_seconds)

      # Add a doctor
      doctor = insert(:doctor, %{first_name: "David", last_name: "Moseley"})

      # Add appointments outside of search range
      _past_appointment = insert(:appointment, %{date: Faker.DateTime.backward(30), doctor: doctor})
      future_appt_earliest = DateTime.add(end_search_in_two_days, 1, :second)
      future_appt_latest = DateTime.add(start_search_today, thirty_days_in_seconds, :second)
      _future_appointment = insert(:appointment, %{date: Faker.DateTime.between(future_appt_earliest, future_appt_latest), doctor: doctor})
      # Add appointment within range
      valid_appointment = insert(:appointment, %{date: Faker.DateTime.between(start_search_today, end_search_in_two_days), doctor: doctor})

      appointments =
        Appointment.get_appointments_by_date(%{
          start_date: DateTime.to_string(start_search_today),
          end_date: DateTime.to_string(end_search_in_two_days),
          doctor_id: doctor.id
        })

      assert length(appointments) == 1
      [appointment] = appointments
      assert appointment.date == valid_appointment.date
      assert appointment.doctor_id == valid_appointment.doctor_id
    end
  end
end
