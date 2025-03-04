Validator Docker images come with monitoring endpoints in Prometheus format.

This guide explains how to set up a monitoring infrastructure using Grafana.
By following these steps, you can create a dashboard similar to the one below:

![alt text](<スクリーンショット 2025-03-05 4.57.15.png>)

## requirements

- git
- docker
- docker compose

## setup

A template is available for installation at the following repository:  
https://github.com/wim-web/elixir-files/tree/grafana/monitor

```sh
git clone https://github.com/wim-web/elixir-files.git
cd elixir-files
git switch grafana
cd monitor
```

Next, follow the instructions in monitor/README.md to complete the setup.
