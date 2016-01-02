defmodule Githubber.Github do
  alias Githubber.Commits
  alias Githubber.Stars
  alias Githubber.Issues
  alias Githubber.Repository
  alias Githubber.Issue
  alias Githubber.Project
  # alias Githubber.Repo

  def fetch(:all, owner, name) do
    # Repo.transaction fn ->
    #

      url = host <> "/repos/#{owner}/#{name}"
      case Repository.fetch(url) do
        {:error, message} ->
          {:error, message}

        _ ->
          project = Project.find_or_create(%{owner: owner, name: name})

          [Repository, Issues, Commits]
            |> Enum.map(fn module -> {module, module.start_link} end)
            |> Enum.map(fn {module, {:ok, pid}} -> {module, pid} end)
            |> Enum.map(fn {module, pid} -> Task.async(fn -> module.get(:metrics, pid, project, owner, name) end) end)
            |> Enum.map(fn pid -> Task.await(pid, 60000) end)

          project = Project.find(%{owner: owner, name: name})
          {:ok, project}
      end
    # end
  end

  def headers do
    %{
      "Accept" => "application/vnd.github.v3.star+json",
      "Authorization" => "token #{System.get_env("GITHUB_ACCESS_TOKEN")}"
    }
  end

  def host do
    "https://api.github.com"
  end

  def fetch_size(pid, owner, repository, endpoint, :size) do
    url = construct(endpoint, owner, repository)

    case HTTPoison.get(url, headers) do
      {:ok, %HTTPoison.Response{status_code: 200, headers: headers}} ->
        link = headers
          |> Enum.find(fn {header, value} -> header == "Link" end)

        case link do
          nil -> 1
          link -> string = link
            |> Tuple.to_list
            |> List.last
            |> String.split(", ")
            |> Enum.find(fn string -> Regex.match?(~r/last/, string) end)

          {total, _} = Regex.run(~r/&page=(\d+)>/, string)
            |> List.last
            |> Integer.parse

          total
        end

      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        IO.inspect "GitHub: Unknown status code #{status_code}"
        IO.inspect body

      {:error, %HTTPoison.Error{reason: reason}} ->
        IO.inspect reason
    end
  end

  defp construct(:repository, owner, repository) do; host <> "/repos/#{owner}/#{repository}" end
  defp construct(:stars, owner, repository) do; host <> "/repos/#{owner}/#{repository}/stargazers?per_page=100" end
  defp construct(:issues, owner, repository) do; host <> "/repos/#{owner}/#{repository}/issues?state=all&per_page=100" end

end
