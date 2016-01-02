defmodule Githubber.IssueTest do
  use Githubber.ModelCase

  alias Githubber.Issue

  @valid_attrs %{closed_at: "2010-04-17 14:00:00", created_at: "2010-04-17 14:00:00", state: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Issue.changeset(%Issue{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Issue.changeset(%Issue{}, @invalid_attrs)
    refute changeset.valid?
  end
end
