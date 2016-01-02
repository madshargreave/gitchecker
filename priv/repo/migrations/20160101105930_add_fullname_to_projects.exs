defmodule Githubber.Repo.Migrations.AddFullnameToProjects do
  use Ecto.Migration

  def change do
    alter table(:projects) do
      add :full_name, :string
    end
  end
end
