defmodule NotifWeb.Router do
  use NotifWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", NotifWeb do
    pipe_through :api
  end
end
