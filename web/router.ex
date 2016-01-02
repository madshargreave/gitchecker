defmodule Githubber.Router do
  use Githubber.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Githubber do
    pipe_through :api

    get "/projects/:owner/:repository", ProjectsController, :show
    get "/projects/recent", ProjectsController, :recent
  end

  scope "/", Githubber do
    pipe_through :browser # Use the default browser stack

    get "/*path", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", Githubber do
  #   pipe_through :api
  # end
end
