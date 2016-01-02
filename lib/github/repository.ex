defmodule Githubber.Repository  do
  import Githubber.Github, only: [headers: 0, host: 0, fetch_size: 5]
  use Timex

  alias Githubber.Repo
  alias Githubber.Project

  def start_link do
    Agent.start_link(fn -> [] end)
  end

  def get(:metrics, pid, project, owner, repository) do
    fetch(pid, project, owner, repository)
  end

  def fetch(pid, project, owner, repository) do
    url = host <> "/repos/#{owner}/#{repository}"

    IO.puts "Fetching repo data..."
    case HTTPoison.get(url, headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        data = body
          |> Poison.decode!
          |> format

        project
          |> Project.changeset(data)
          |> Repo.insert_or_update!

      {:error, %HTTPoison.Error{reason: reason}} ->
        IO.inspect reason
    end
  end

  def fetch(url) do
    case HTTPoison.get(url, headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        data = body
          |> Poison.decode!
          |> format

      {:ok, %HTTPoison.Response{status_code: 301}} ->
        {:error, "Repository has been moved"}

      {:ok, %HTTPoison.Response{status_code: 404}} ->
        {:error, "Repository not found"}

      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        IO.inspect "Unhandled status code #{status_code}"
        IO.inspect body

      {:error, %HTTPoison.Error{reason: reason}} ->
        IO.inspect reason
    end
  end

  defp format(data) do
    %{"owner" => owner} = data

    %{
      full_name: data["full_name"],
      owner_login: owner["login"],
      owner_type: owner["type"],
      owner_avatar_url: owner["avatar_url"],
      description: data["description"],
      created_at: data["created_at"],
      pushed_at: data["pushed_at"],
      homepage: data["homepage"],
      size: data["size"],
      star_count: data["stargazers_count"],
      language: data["language"],
      forks_count: data["forks_count"],
      subscriber_count: data["subscribers_count"]
    }
  end


end
