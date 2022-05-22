defmodule GoFetch.Appointment do
  @moduledoc """
   the appointment schema
  """

  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias GoFetch.Doctor
  alias GoFetch.User
  alias GoFetch.Pet
  alias GoFetch.Repo

  @doc """
  Get all appointments between a start date and end date
  """
  def get_appointments_by_date(%{start_date: start_date, end_date: end_date}) do
    from(
      appointment in __MODULE__,
      where: appointment.date >= ^start_date and appointment.date <= ^end_date,
      order_by: [asc: :date]
    )
    |> Repo.all
  end

  @doc """
  Get all appointments for a doctor between a start date and end date
  """
  def get_appointments_by_date_for_doctor(%{doctor_id: doctor_id, start_date: start_date, end_date: end_date}) do
    from(
      appointment in __MODULE__,
      where: appointment.date >= ^start_date and appointment.date <= ^end_date and appointment.doctor_id == ^doctor_id,
      order_by: [asc: :date]
    )
    |> Repo.all
  end

  schema "appointments" do
    field :date, :utc_datetime
    field :reason, :string

    belongs_to :user, User
    belongs_to :pet, Pet
    belongs_to :doctor, Doctor

    timestamps()
  end

  @doc false
  def changeset(appointment, attrs) do
    appointment
    |> cast(attrs, [:date, :reason, :user_id, :pet_id], empty_values: [])
    |> validate_required([:date, :user_id, :pet_id])
  end
end
