defmodule Githubber.StatisticsTest do
  use ExUnit.Case, async: true
  use Timex
  alias Githubber.Statistics

  test "grouping by dates" do
    {:ok, today} = Date.now |> DateFormat.format("{ISO}")
    issues = [%{created_at: today}, %{created_at: today}]

    grouping = Statistics.group(issues)
    length = Enum.count(grouping)

    assert length == 1

    {:ok, yesterday} = Date.now |> Date.shift(days: -2) |> DateFormat.format("{ISO}")
    issues = issues ++ [%{created_at: yesterday}]
    grouping = Statistics.group(issues)

    length = Enum.count(grouping)
    assert length == 2
  end

end
