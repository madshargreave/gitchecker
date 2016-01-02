defmodule Githubber.StatisticControllerTest do
  use Githubber.ConnCase

  alias Githubber.Statistic
  @valid_attrs %{}
  @invalid_attrs %{}

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, statistic_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    statistic = Repo.insert! %Statistic{}
    conn = get conn, statistic_path(conn, :show, statistic)
    assert json_response(conn, 200)["data"] == %{"id" => statistic.id}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_raise Ecto.NoResultsError, fn ->
      get conn, statistic_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, statistic_path(conn, :create), statistic: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Statistic, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, statistic_path(conn, :create), statistic: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    statistic = Repo.insert! %Statistic{}
    conn = put conn, statistic_path(conn, :update, statistic), statistic: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Statistic, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    statistic = Repo.insert! %Statistic{}
    conn = put conn, statistic_path(conn, :update, statistic), statistic: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    statistic = Repo.insert! %Statistic{}
    conn = delete conn, statistic_path(conn, :delete, statistic)
    assert response(conn, 204)
    refute Repo.get(Statistic, statistic.id)
  end
end
