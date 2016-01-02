defmodule Githubber.StatisticTest do
  use Githubber.ModelCase

  alias Githubber.Statistic

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Statistic.changeset(%Statistic{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Statistic.changeset(%Statistic{}, @invalid_attrs)
    refute changeset.valid?
  end
end
