defmodule Githubber.Repo.Migrations.AddIndexToProjects do
  use Ecto.Migration

  def change do
    create unique_index(:projects, [:owner, :name])
  end
end
