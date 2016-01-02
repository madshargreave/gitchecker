defmodule Githubber.IssueControllerTest do
  use Githubber.ConnCase

  alias Githubber.Issue
  @valid_attrs %{closed_at: "2010-04-17 14:00:00", created_at: "2010-04-17 14:00:00", state: "some content"}
  @invalid_attrs %{}

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, issue_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    issue = Repo.insert! %Issue{}
    conn = get conn, issue_path(conn, :show, issue)
    assert json_response(conn, 200)["data"] == %{"id" => issue.id,
      "state" => issue.state,
      "created_at" => issue.created_at,
      "closed_at" => issue.closed_at}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_raise Ecto.NoResultsError, fn ->
      get conn, issue_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, issue_path(conn, :create), issue: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Issue, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, issue_path(conn, :create), issue: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    issue = Repo.insert! %Issue{}
    conn = put conn, issue_path(conn, :update, issue), issue: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Issue, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    issue = Repo.insert! %Issue{}
    conn = put conn, issue_path(conn, :update, issue), issue: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    issue = Repo.insert! %Issue{}
    conn = delete conn, issue_path(conn, :delete, issue)
    assert response(conn, 204)
    refute Repo.get(Issue, issue.id)
  end
end
