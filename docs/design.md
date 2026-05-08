# 設計

クリック代替入力とサンプル信号で遊べる状態を先に固定し、マイク入力は手動テスト対象として分離する。

UIは左に代表シナリオ、中央にcanvasと結果、右にrelease readinessを配置します。Chrome headless smokeで `data-smoke=ready`、ボタン、結果パネル、platform scope を確認します。
