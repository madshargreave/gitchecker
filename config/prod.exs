use Mix.Config

config :githubber, Githubber.Endpoint,
  http: [port: {:system, "PORT"}],
  url: [scheme: "http", host: "gitchecker.com", port: 80],
  # force_ssl: [rewrite_on: [:x_forwarded_proto]],
  cache_static_manifest: "priv/static/manifest.json",
  secret_key_base: System.get_env("SECRET_KEY_BASE")

config :githubber, Githubber.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: System.get_env("DATABASE_URL"),
  pool_size: 20

config :logger, level: :info

