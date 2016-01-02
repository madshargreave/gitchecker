defmodule Githubber.Commits do
  import Githubber.Github, only: [headers: 0, host: 0, fetch_size: 5]
  use Timex

  alias Githubber.Repo
  alias Githubber.Project

  epoch = {{1970, 1, 1}, {0, 0, 0}}
  @epoch :calendar.datetime_to_gregorian_seconds(epoch)

  def start_link do
    Agent.start_link(fn -> [] end)
  end

  def get(:metrics, pid, project, owner, repository) do
    fetch(pid, project, owner, repository)
  end

  def fetch(pid, project, owner, repository) do
    url = host <> "/repos/#{owner}/#{repository}/stats/commit_activity"

    IO.puts "Fetching commit data..."
    case HTTPoison.get(url, headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        data = body
          |> Poison.decode!
          |> format
          |> (&(%{commits: &1})).()

        project
          |> Project.changeset(data)
          |> Repo.insert_or_update!

      {:ok, %HTTPoison.Response{status_code: 202}} ->
        :timer.sleep(1000)
        fetch(pid, project, owner, repository)

      {:ok, %HTTPoison.Response{status_code: 404}} ->
        IO.puts "COMMITS: Repository not found"

      {:error, %HTTPoison.Error{reason: reason}} ->
        IO.inspect reason
    end
  end

  defp format(data) do
    Enum.map(data, fn data ->
      first_day_of_week = data["week"] |> from_timestamp |> Ecto.DateTime.from_erl

      %{
        total: data["total"],
        first_day_of_week: first_day_of_week
      }
    end)
  end

  defp from_timestamp(timestamp) do
    timestamp
    |> +(@epoch)
    |> :calendar.gregorian_seconds_to_datetime
  end


end
