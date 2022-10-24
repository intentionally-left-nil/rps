defmodule NotifWeb.GameRoomChannel do
  use NotifWeb, :channel

  @impl true
  def join("game_room:" <> room_id, _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end
end
