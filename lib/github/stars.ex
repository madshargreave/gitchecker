defmodule Githubber.Stars do
  import Githubber.Github, only: [headers: 0, host: 0, fetch_size: 5]
  use Timex

  def start_link do
    Agent.start_link(fn -> [] end)
  end

  def concat(pid, data) do
    Agent.update(pid, fn state -> Enum.concat(state, data) end)
  end

  def get(pid, :state) do
    Agent.get(pid, fn state -> state end)
  end

  def get(:metrics, pid, owner, repository) do
    fetch(pid, owner, repository) |> analyze
  end

  def fetch(pid, owner, repository) do
    total_pages = fetch_size(pid, owner, repository, :stars, :size)
    IO.puts "Fetching #{total_pages} starring pages..."

    1..total_pages
      |> Enum.map(&Task.async(fn -> fetch(pid, owner, repository, &1) end))
      |> Enum.map(&Task.await(&1, 30000))

    get(pid, :state)
  end

  def fetch(pid, owner, repository, page) do
    url = host <> "/repos/#{owner}/#{repository}/stargazers?per_page=100&page=#{page}"

    case HTTPoison.get(url, headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        data = body
          |> Poison.decode!
          |> format

        concat(pid, data)

      {:error, %HTTPoison.Error{reason: reason}} ->
        IO.inspect reason
    end
  end

  def analyze(data) do
    stars_count = analyze(:count, data)
    hours_since_last_starring = analyze(:last, data)

    %{stars_total_star_count: stars_count, stars_hours_since_last_starring: hours_since_last_starring}
  end

  def analyze(:count, data) do
    Enum.count(data)
  end

  def analyze(:last, data) do
    entry = List.last(data)
    {:ok, date} = entry[:starred_at]
      |> DateFormat.parse("{ISO}")

    date |> Date.diff(Date.now, :hours) |> round
  end

  defp format(data) do
    Enum.map(data, fn data -> %{starred_at: data["starred_at"]} end)
  end

end


