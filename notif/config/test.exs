import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :notif, NotifWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "QW19n4f/dQu9ShYEaf7ULhCIaAmSmE16PVGmw0s9eEsYKOOuOyh4ZQJlUXVRsZsV",
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
