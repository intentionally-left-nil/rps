defmodule Notif.RedisSubscriber do
  use GenServer
  require Logger

  @impl true
  def init(_args) do
    Redix.PubSub.psubscribe(:redpubsub, ["__keyevent@0__:*"], self())
    {:ok, %{}}
  end

  @impl true
  def handle_info(
        {:redix_pubsub, _pid, _ref, _message_type, %{payload: "game:" <> game_id}},
        state
      ) do
    Phoenix.PubSub.broadcast_from!(Notif.PubSub, self(), "redis:" <> game_id, "game_updated")
    {:noreply, state}
  end

  @impl true
  def handle_info(_, state), do: {:noreply, state}

  def start_link(args) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end
end
