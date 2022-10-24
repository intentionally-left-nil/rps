FROM elixir:1.14-alpine

RUN mix local.hex --force
RUN mix archive.install --force hex phx_new
RUN mix local.rebar --force

COPY ./mix.exs /app/mix.exs
COPY ./mix.lock /app/mix.lock

WORKDIR /app

RUN mix deps.get
RUN mix deps.compile

COPY . /app
RUN mix compile

CMD mix phx.server
