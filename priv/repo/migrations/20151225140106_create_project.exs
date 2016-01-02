defmodule Githubber.Repo.Migrations.CreateProject do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add :owner, :string
      add :name, :string
      add :url, :string
      add :owner_login, :string
      add :owner_type, :string
      add :owner_avatar_url, :string
      add :description, :string
      add :created_at, :datetime
      add :pushed_at, :datetime
      add :homepage, :string
      add :size, :integer
      add :star_count, :integer
      add :language, :string
      add :forks_count, :integer
      add :subscriber_count, :integer

      timestamps
    end

  end
end
