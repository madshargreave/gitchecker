defmodule Githubber.Issues do
  import Githubber.Github, only: [headers: 0, host: 0, fetch_size: 5]
  use Timex

  alias Githubber.Repo
  alias Githubber.Issue
  alias Githubber.Project

 @excluded_labels ~w( enhancement feature task refactoring duplicate tests refactoring suggestion wip rfc )

  def start_link do
    Agent.start_link(fn -> [] end)
  end

  def concat(pid, data) do
    Agent.update(pid, fn state -> Enum.concat(state, data) end)
  end

  def get(pid, :state) do
    Agent.get(pid, fn state -> state end)
  end

  def get(:metrics, pid, project, owner, repository) do
    total_issues = fetch_size(pid, owner, repository, :issues, :size)
    IO.puts "Fetching #{total_issues} issue pages..."

    1..total_issues
      |> Enum.map(&Task.async(fn -> fetch(pid, owner, repository, &1) end))
      |> Enum.map(&Task.await(&1, 60000))

    result = get(pid, :state)
    six_month_ago = Date.now |> Date.shift(months: -6)

    grouping = 0..26
      |> Enum.map(fn i ->
          start_date = six_month_ago |> Date.add(Time.to_timestamp(i * 7, :days))
          end_date = six_month_ago |> Date.add(Time.to_timestamp((i * 7) + 7, :days))

          issues_in_interval = Enum.filter(result, fn entry ->
            {:ok, test_date} = entry[:created_at] |> DateFormat.parse("{ISO}")

            is?(:between, start_date, end_date, test_date)
          end)

          {:ok, start_date} = start_date |> DateFormat.format("{ISOz}")
          start_date = start_date |> Ecto.DateTime.cast!
          %{first_day_of_week: start_date, issues: issues_in_interval}
      end)

    data = %{issues: grouping}

    project
      |> Project.changeset(data)
      |> Repo.insert_or_update!
  end

  def fetch(pid, owner, repository, page) do
    {:ok, since} = Date.now
      |> Date.shift(months: -6)
      |> DateFormat.format("{ISOz}")

    url = host <> "/repos/#{owner}/#{repository}/issues?&state=all&since=#{since}&per_page=100&page=#{page}"

    case HTTPoison.get(url, headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        data = body
          |> Poison.decode!
          |> format

        concat(pid, data)

      {:ok, %HTTPoison.Response{status_code: 404}} ->
        IO.puts "ISSUES: Repository Not Found"

      {:ok, %HTTPoison.Response{status_code: 404}} ->
        IO.puts "ISSUES: Repository Not Found"

      {:error, %HTTPoison.Error{reason: reason}} ->
        IO.inspect reason
    end
  end

  defp format(data) do
    Enum.map(data, fn data ->
      %{
        state: data["state"],
        created_at: data["created_at"],
        closed_at: data["closed_at"],
      }
    end)
  end

  defp is?(:between, start_date, end_date, test_date) do
    is_after = Date.compare(test_date, start_date, :days) == 1
    is_before = Date.compare(test_date, end_date, :days) == -1

    is_after && is_before
  end

end
