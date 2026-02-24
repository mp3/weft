# Task List

## Short-term (v0.2)

- [ ] **エディタのシンタックスハイライト** — CodeMirror 6 のカスタム Language Support を作成し、タスクチェックボックス (`- [ ]` / `- [x]`)、タグ (`#tagname`)、期限 (`due:YYYY-MM-DD`) をそれぞれ異なる色でハイライト表示する。`@lezer/lr` でパーサーを定義するか、`StreamLanguage` で軽量に実装する。ダークモード時の配色も定義すること。エディタがプレーンテキストではなく「構造化されたフォーマット」であることを視覚的に伝え、編集体験を劇的に向上させる
- [x] **ボタンにキーボードショートカットヒント追加** — ヘッダーの各ボタン (Export, Help, Sidebar Toggle, Theme Toggle) にツールチップを追加し、対応するショートカットキーを表示する (例: `Export (⌘E)`)。`title` 属性または CSS ベースのカスタムツールチップで実装。ホバー時に表示、モバイルでは非表示。機能の発見可能性を最大限に改善する最もコスパの高い施策
- [ ] **サイドバーからエディタへのクリックスクロール** — サイドバーのタスク説明文をクリックしたとき、エディタ内の該当行にスクロールし一時的にハイライト (1-2 秒のフラッシュ) する。`EditorView.dispatch({ effects: EditorView.scrollIntoView(pos) })` と `Decoration.line` で実装。`parseDocument` の結果にある `lineIndex` を使ってエディタの行位置を特定する。サイドバーとエディタの双方向接続感を生む重要な UX 改善
- [ ] **.txt インポート機能** — エクスポート (`exportFile.ts`) と対になるインポート機能。`<input type="file" accept=".txt">` で .txt ファイルを読み込み、エディタのドキュメントを置き換える。既存テキストがある場合は確認ダイアログを表示。`src/storage/importFile.ts` に `importTextFile(): Promise<string | null>` を実装し、`page.tsx` のヘッダーに Import ボタンまたは Export ボタンのドロップダウンメニューとして配置。データの持ち込みを可能にし、エクスポートとの対称性を確保する
- [ ] **Vim モード状態インジケーター** — Vim モードが ON のとき、ヘッダーまたはエディタ下部のステータスバーに `VIM` バッジを表示する。`useWeftEditor` が返す `vimEnabled` を使い、条件付きレンダリングで表示。CodeMirror の Vim ステータスバー (Normal/Insert/Visual モード表示) も Compartment 経由で表示/非表示を切り替える。`Alt+Shift+V` でトグルした結果が視覚的にフィードバックされるようにする
- [ ] **モバイルタッチターゲット拡大** — サイドバー内のチェックボックスとドラッグハンドル (⁞) のタッチターゲットを Apple HIG / WCAG 基準の 44x44px 以上に拡大する。`SortableTaskItem.tsx` のチェックボックス領域に `min-w-[44px] min-h-[44px]` を適用し、ドラッグハンドルも同様に拡大。視覚的なサイズは変えずに `padding` でヒットエリアのみ拡大する手法も検討。モバイルでの誤タップを防ぎ、アクセシビリティ基準を満たす

## Mid-term (v1.0)

- [ ] **初回オンボーディング** — 初めてアプリを開いたユーザーに対し、3-4 ステップのツールチップツアーを表示する。(1) エディタ → 「ここにタスクを書きます」、(2) サイドバー → 「タスクがリアルタイムで解析されます」、(3) `?` ボタン → 「ショートカットと構文はここ」。`localStorage` に `weft-onboarding-done` フラグを保存し、一度表示したら再表示しない。ライブラリ不要で、絶対配置のポップオーバー + フォーカスリングで実装可能。新規ユーザーの離脱を防ぐ最も効果的な施策
- [ ] **Undo フィードバックトースト** — サイドバーからのタスクトグルやドラッグ&ドロップ並び替え後に「Task completed — ⌘Z to undo」のようなトーストを 3 秒間表示する。既存の保存トースト (`save-toast`) と同じパターンで実装。`toggleTask` と `moveTask` のコールバック内でトーストをトリガー。CodeMirror の undo が動作することをユーザーに教え、誤操作の不安を解消する
- [ ] **自動保存インジケーター** — ヘッダーまたはフッターに「All changes saved」テキストを常時表示し、debounce 保存完了時に更新する。編集中は「Saving...」、保存完了後は「Saved just now」→ 時間経過で「Saved X seconds ago」と遷移。`useWeftEditor` 内の `saveTimerRef` の状態を `saveStatus` として公開し、`page.tsx` で表示。ユーザーのデータ消失不安を根本的に解消する
- [ ] **繰り返しタスク** — `repeat:daily`、`repeat:weekly`、`repeat:monthly` 構文を `parseLine.ts` に追加。`ParsedTask` 型に `repeat?: 'daily' | 'weekly' | 'monthly'` フィールドを追加。タスクを完了 (`[x]`) にしたとき、`repeat` が設定されていれば次の発生日で新しい `- [ ]` 行を自動挿入する。`toggleTask.ts` にリピートロジックを追加。Due Soon パネルでリピートアイコン (🔄) を表示。タスク管理ツールとして基本的な期待値を満たす重要機能
- [ ] **期限切れタスクの視覚的警告** — Due Soon パネルで期限切れタスク (overdue) を赤/オレンジ色でハイライト、期限当日を黄色、1 週間以内をデフォルト色で表示する。`dueSoon.ts` に `isOverdue(task: ParsedTask): boolean` を追加し、`DueSoonPanel.tsx` で条件付きスタイリング。期限切れの件数をタブのバッジに表示する (例: `Due Soon (3⚠)`)。緊急度の視覚的フィードバックでタスクの見落としを防ぐ
- [ ] **差分パーシング** — 現在の全文リパース (`parseDocument` を毎回呼び出し) を、変更された行のみの差分パースに最適化する。CodeMirror の `update.changes` から変更範囲を取得し、影響を受ける行だけを再パースして既存の `ParsedDocument` にマージする。数千行規模のドキュメントでのパフォーマンスを確保。ベンチマークテストを追加し、1000 行・5000 行・10000 行での処理時間を計測する

## Long-term (v2.0+)

- [ ] **File System Access API 対応** — ブラウザの File System Access API (`showOpenFilePicker` / `showSaveFilePicker`) を使い、ローカルの .md / .txt ファイルを直接開いて編集・保存できるようにする。`src/storage/fileSystemAccess.ts` に API ラッパーを実装。ファイルハンドルを保持し、保存時にそのまま上書き。API 非対応ブラウザでは従来の localStorage フォールバック。これにより Dropbox / iCloud / Google Drive フォルダ内のファイルを直接編集でき、既存のファイル同期サービスを通じたマルチデバイス対応が実現する
- [ ] **git / GitHub Gist 同期** — GitHub Gist をバックエンドとして、ドキュメントの読み書きを同期する。GitHub OAuth でトークンを取得し、Gist API (`PATCH /gists/:id`) で保存。`src/storage/gistSync.ts` に実装。衝突検知は ETag ベースで、衝突時はマージまたはユーザー選択。開発者ターゲットに最適な、インフラ構築不要のマルチデバイス同期ソリューション。オプショナルな機能として、ローカルオンリーモードはデフォルトで維持する
- [ ] **複数ドキュメント / プロジェクト** — 複数のテキストドキュメントをプロジェクト単位で管理する機能。サイドバーにドキュメントリストパネルを追加し、新規作成・切り替え・削除をサポート。`src/storage/documentStore.ts` に IndexedDB ベースのストレージを実装 (localStorage の 5MB 制限を回避)。各ドキュメントのメタデータ (名前、最終更新日、タスク数) を管理。仕事とプライベートの分離や、プロジェクト別管理のニーズに対応する
- [ ] **todo.txt フォーマット互換** — todo.txt フォーマット (`(A) 2026-03-01 タスク +Project @Context`) のインポート / エクスポートに対応。`src/parser/todoTxtFormat.ts` に双方向変換器を実装: `parseTodoTxt(text: string): ParsedDocument` と `toTodoTxt(doc: ParsedDocument): string`。Weft 構文 → todo.txt、todo.txt → Weft 構文の変換ルールを定義。todo.txt エコシステム (Sleek, SimpleTask 等) のユーザーにリーチし、既存データの移行障壁を下げる
- [ ] **リアルタイムコラボレーション (CRDT)** — Yjs または Automerge ベースの CRDT を統合し、複数ユーザーが同じドキュメントを同時編集できるようにする。CodeMirror 6 の `@codemirror/collab` 拡張と Yjs の `y-codemirror.next` バインディングを使用。WebSocket サーバー (Cloudflare Durable Objects が最適) で接続を管理。カーソル位置の共有、ユーザーカラー表示、オフライン時の自動マージを実装。チーム利用への拡張を可能にする長期的な基盤投資
