defmodule NotifWeb.GameRoomChannel do
  use NotifWeb, :channel
  require Logger

  @impl true
  def join("game_room:" <> game_id, _payload, socket) do
    Phoenix.PubSub.subscribe(Notif.PubSub, "redis:" <> game_id)
    |> case do
      :ok ->
        Logger.warn("subscribed to redis:#{game_id}")
        {:ok, socket}

      {:error, reason} ->
        Logger.warn("Could not subscribe to #{game_id} due to #{inspect(reason)}")
        {:error, :subscribe_failed}
    end
  end

  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  @impl true
  def handle_info("game_updated", socket) do
    broadcast!(socket, "game_updated", "")
    {:noreply, socket}
  end
end
