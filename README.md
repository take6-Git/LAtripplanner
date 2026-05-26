# ロサンゼルス今日帖 — L.A. Daily

ロサンゼルスの1日旅程プランナー（編集マガジン風）

---

## 🚀 デプロイ手順（ブラウザだけで完結 / 約20分）

### ステップ 1：GitHub にコードをアップロード

1. ブラウザで [github.com](https://github.com) にログイン
2. 右上の「**+**」→「**New repository**」
3. 以下を入力：
   - **Repository name**: `la-trip-planner`（好きな名前でOK）
   - **Public** か **Private** を選ぶ（**Private** でも Vercel から接続できます）
   - 「Add a README file」「.gitignore」「license」のチェックは**全部オフ**
4. 「**Create repository**」ボタンを押す
5. 空のリポジトリが表示されたら、「**uploading an existing file**」のリンクをクリック
6. このフォルダの中身を**すべて選択**して、ブラウザのページにドラッグ＆ドロップ
   - `node_modules` と `dist` フォルダは入っていないので、フォルダ全部を選んでOK
7. 下にスクロールして「**Commit changes**」を押す

> **💡 ヒント**: `node_modules` と `dist` は `.gitignore` で除外されているので、もしフォルダがあっても誤ってアップしないようにご注意ください。

---

### ステップ 2：Vercel でデプロイ

1. [vercel.com/signup](https://vercel.com/signup) で「**Continue with GitHub**」を選んでサインアップ
2. ログイン後、ダッシュボードで「**Add New...**」→「**Project**」
3. 「Import Git Repository」のところで、先ほど作った `la-trip-planner` の右にある「**Import**」を押す
   - もし出てこなければ、「Adjust GitHub App Permissions」でこのリポジトリへのアクセスを許可
4. 設定画面が出ます。デフォルトのままでOK：
   - Framework Preset: **Vite**（自動検出されます）
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 「**Deploy**」を押す
6. 1〜2分待つと、`https://la-trip-planner-xxxx.vercel.app` のような URL が発行されます
7. その URL を仲間に共有すれば完了！🎉

---

### ステップ 3：あとから更新したいとき

GitHub のリポジトリ画面でファイルを編集 → Commit すれば、Vercel が自動で再デプロイします。
コードに変更があったら、私（Claude）に「これに置き換えて」と言って新しい App.jsx を貰い、GitHub 上の `src/App.jsx` を編集してください。

---

## 🔐 アクセス制限について

このまま公開すると URL を知っている人なら誰でも見られます。仲間内だけにしたい場合：

### 方法A：URLを「教えない」だけ
URL は推測されにくい（`xxxx`部分はランダム）ので、共有しなければ実質的に他人は来ません。

### 方法B：Vercel Password Protection（チームメンバーなら無料、Pro機能）
プロジェクト設定 →「Deployment Protection」→「Password Protection」を有効化。共有用URL＋パスワードでアクセス制限可能。Hobbyプランでは月$20相当の機能ですが、お試し期間あり。

### 方法C：簡易パスワード（無料・コードで実装）
「合言葉を入力しないと中身が見えない」ような実装を私（Claude）に追加させることもできます。必要なら言ってください。

---

## 🛠️ ローカル開発（任意・上級向け）

PCで動作確認したい場合のみ：

```bash
npm install
npm run dev
```

→ `http://localhost:5173` で開きます。

---

## 📁 ファイル構成

```
la-trip-planner/
├── index.html            # HTMLエントリ
├── package.json          # 依存関係
├── vite.config.js        # ビルド設定
├── tailwind.config.js    # Tailwind設定
├── postcss.config.js     # PostCSS設定
├── .gitignore
├── README.md             # このファイル
└── src/
    ├── main.jsx          # React起動
    ├── index.css         # Tailwind読み込み
    └── App.jsx           # アプリ本体（全コード）
```
