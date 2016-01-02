defmodule Githubber.Project do
  use Githubber.Web, :model
  use Timex

  alias Githubber.Repo
  alias Githubber.Project
  alias Githubber.Issue
  alias Githubber.Commit

  @update_after_hours 1

  schema "projects" do
    field :owner, :string
    field :name, :string

    field :full_name, :string
    field :owner_login, :string
    field :owner_type, :string
    field :owner_avatar_url, :string
    field :description, :string
    field :created_at, Ecto.DateTime
    field :pushed_at, Ecto.DateTime
    field :homepage, :string
    field :size, :integer
    field :star_count, :integer
    field :language, :string
    field :forks_count, :integer
    field :subscriber_count, :integer

    embeds_many :commits, Commit, on_replace: :delete
    embeds_many :issues, Issue, on_replace: :delete
    # embeds_many :stars, Issue, on_replace: :delete

    timestamps
  end

  @required_fields ~w(
    owner
    name
  )

  @optional_fields ~w(
      full_name
      homepage
      owner_avatar_url
      owner_login
      owner_type
      description
      created_at
      pushed_at
      size
      star_count
      language
      forks_count
      subscriber_count

      issues
      commits
  )

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def find(%{owner: owner, name: name}) do
    Project
      |> Repo.get_by(owner: owner, name: name)
  end

  def find(:recent) do
    Repo.all(
      from p in Project,
      order_by: [desc: p.updated_at],
      select: %{owner: p.owner, name: p.name, updated_at: p.updated_at},
      limit: 7
    )
  end

  def find_or_create(%{owner: owner, name: name}) do
    project = find(%{owner: owner, name: name})

    if !project do
      changeset = Project.changeset(%Project{}, %{owner: owner, name: name})
      {:ok, project} = Repo.insert(changeset)
    end

    project
  end

  def should?(project, :fetch) do
    now = Date.now
    {:ok, updated} = project.updated_at |> Ecto.DateTime.to_iso8601 |> DateFormat.parse "{ISO}"

    Date.diff(updated, now, :hours) > @update_after_hours
  end

end
