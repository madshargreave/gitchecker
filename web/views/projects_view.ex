defmodule Githubber.ProjectsView do
  use Githubber.Web, :view

  def render("show.json", %{project: project}) do
    %{commits: commits, issues: issues} = project

    commits = render_many(commits, __MODULE__, "commits.json")
    issues  = render_many(issues, __MODULE__, "issues.json")
    project = render_one(project, __MODULE__, "project.json")

    %{
      project: project,
      data: %{
        commits: commits,
        issues: issues
      }
    }
  end

  def render("project.json", project) do
    project = project.projects

    %{
      projectId: project.id,
      fullName: project.full_name,
      owner: project.owner,
      repository: project.name,
      updatedAt: project.updated_at,
      ownerLogin: project.owner_login,
      ownerType: project.owner_type,
      ownerAvatarUrl: project.owner_avatar_url,
      description: project.description,
      createdAt: project.created_at,
      pushedAt: project.pushed_at,
      homepage: project.homepage,
      size: project.size,
      starCount: project.star_count,
      language: project.language,
      forkCount: project.forks_count,
      subscriberCount: project.subscriber_count
    }
  end

  def render("commits.json", commit) do
    %{
      firstDayOfTheWeek: commit.projects.first_day_of_week,
      total: commit.projects.total
    }
  end

  def render("issues.json", issue) do
    issues = render_many(issue.projects.issues, __MODULE__, "issue.json")
    %{
      firstDayOfTheWeek: issue.projects.first_day_of_week,
      issues: issues,
    }
  end

  def render("issue.json", issue) do
    %{"closed_at" => closed_at, "created_at" => created_at, "state" => state} = issue.projects

    %{
      state: state,
      createdAt: created_at,
      closedAt: closed_at
    }
  end

  def render("recent.json", %{data: data}) do
    data |> Enum.map(fn data ->
      %{
        owner: data[:owner],
        name: data[:name],
        updatedAt: data[:updated_at]
      }
    end)
  end

  def render("error.json", %{message: message}) do
    %{message: message}
  end

end

