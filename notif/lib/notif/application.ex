defmodule Notif.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      NotifWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Notif.PubSub},
      # Start the Endpoint (http/https)
      NotifWeb.Endpoint,
      # Start a worker by calling: Notif.Worker.start_link(arg)
      # {Notif.Worker, arg}
      %{
        id: Redix.PubSub,
        start: {Redix.PubSub, :start_link, ["redis://redis:6379/0", [name: :redpubsub]]}
      },
      %{
        id: Notif.RedisSubscriber,
        start: {Notif.RedisSubscriber, :start_link, [[]]}
      }
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Notif.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    NotifWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
