defmodule Githubber.Commit do
  use Ecto.Model

  embedded_schema do
    field :first_day_of_week, Ecto.DateTime
    field :total, :integer
  end

  @required_fields ~w( first_day_of_week total )
  @optional_fields ~w()

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

end
