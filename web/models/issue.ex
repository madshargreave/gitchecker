defmodule Githubber.Issue do
  use Ecto.Model

  embedded_schema do
    field :first_day_of_week, Ecto.DateTime
    field :issues, {:array, :map}
    # field :created_at, Ecto.DateTime
    # field :closed_at, Ecto.DateTime
    # field :state, :string
  end

  @required_fields ~w( first_day_of_week issues )
  @optional_fields ~w( )

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

end
