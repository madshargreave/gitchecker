defmodule Githubber.ProjectsController do
  use Githubber.Web, :controller
  alias Githubber.Github
  alias Githubber.Project

  def show(conn, %{"owner" => owner, "repository" => repository}) do
    project = Project.find(%{owner: owner, name: repository})

    if !project || Project.should?(project, :fetch) do
      case Github.fetch(:all, owner, repository) do
        {:error, message} ->
          conn
            |> put_status(404)
            |> render "error.json", %{message: message}

        {:ok, project} ->
          render conn, "show.json", %{project: project}
      end
    else
      render conn, "show.json", %{project: project}
    end
  end

  def recent(conn, _params) do
    data = Project.find(:recent)
    render conn, "recent.json", %{data: data}
  end

end
