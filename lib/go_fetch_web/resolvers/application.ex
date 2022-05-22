defmodule GoFetchWeb.Resolvers.Application do
  @moduledoc """
  GraphQL Resolvers
  """

  alias GoFetch.Appointment
  alias GoFetch.Doctor

  def list_doctors(_, _, _) do
    {:ok, Doctor.get_doctors()}
  end

  def list_appointments_by_date_for_doctor(_, args, _) do
    {:ok, Appointment.get_appointments_by_date_for_doctor(args)}
  end
end
