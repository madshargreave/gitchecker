defmodule Githubber.Repo.Migrations.AddCommitsToProjects do
  use Ecto.Migration

  def change do
    alter table(:projects) do
      add :commits, {:array, :map}, default: []
      add :issues, {:array, :map}, default: []
      add :stars, {:array, :map}, default: []
    end
  end
end
