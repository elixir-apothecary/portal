バリデーターのdockerイメージにはモニタリング用のエンドポイントが用意されています。（Prometheusフォーマット）

以下では[Grafana](https://grafana.com/)を使用してモニタリングの基盤を整える手順を紹介します。（以下のようなダッシュボードを作成できます）

![alt text](<スクリーンショット 2025-03-05 4.57.15.png>)

## requirements

- git
- docker
- docker compose

## setup

こちらにテンプレートを用意しているのでそれをインストールします。  
https://github.com/wim-web/elixir-files/tree/grafana/monitor

```sh
git clone https://github.com/wim-web/elixir-files.git
cd elixir-files
git switch grafana
cd monitor
```

以後は、monitor/README.mdの手順に従ってください。
