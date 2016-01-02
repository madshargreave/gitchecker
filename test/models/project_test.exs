defmodule Githubber.ProjectTest do
  use Githubber.ModelCase

  alias Githubber.Project

  @valid_attrs %{issues_closed_total: 42, issues_mean_resolution_time_in_hours: 42, issues_open_to_closed_rate: "120.5", issues_open_total: 42, name: "some content", owner: "some content", url: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Project.changeset(%Project{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Project.changeset(%Project{}, @invalid_attrs)
    refute changeset.valid?
  end
end
