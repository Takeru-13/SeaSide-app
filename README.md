# 🌊 SeaSide  
## ふたりで寄り添う、感情記録カレンダー

<p align="center">
  <a href="https://seaside-app.netlify.app/">
    <img src="https://github.com/user-attachments/assets/cb8c3971-acd6-421d-a140-08971df54149" alt="SeaSide Banner" width="100%" />
  </a>
</p>
[🔗 SeaSide](https://seaside-app.netlify.app/)  

---

## 📌 アプリの概要
SeaSideは、日々の **感情・睡眠・食事・運動・体調** を  
シンプルに記録できるモバイルファーストカレンダーアプリです。  

特徴は「**ペアモード**」で、パートナーと共有しながら心地よく使える設計になっています。  

---

## 🎯 ターゲット
- 自分自身とパートナー
- 日々の気持ちや生活習慣を手軽に残したい人  
- カップルやパートナーと共有したい人  
- 自分の感情や体調を振り返りたい人


---

## ✨ 特徴
- 感情をクラゲアイコンで10段階可視化  
- ペアモードでふたりの記録を並べて確認  
- モバイルファースト & PWA対応  
- 星空と海のおちついたデザイン

---

## 🛠 制作経緯
日々を過ごす中で、気分の浮き沈みや生活リズムの乱れが  
知らず知らずのうちにパートナーとの関係に影響することがありました。  

自分自身も疲れているときには、相手の変化に気づけなかったり、  
些細なことで衝突してしまうことも。  

「もしお互いのコンディションを、もっとわかりやすく、穏やかに共有できたら」  
そんな思いから、このアプリを作り始めました。  

似たようなアプリはいくつか存在していましたが、  
**服薬の記録**、**感情レベルの細かさ**、**ペア同士で自然に連携できる仕組み**など、  
私たちが本当に欲しい機能のすべてを備えたものはありませんでした。  

そこで「欲しい要素をすべて一つにまとめる」ことを目指し、SeaSideを開発しました。  

SeaSideは、感情や習慣をふたりで心地よく記録し合い、  
相手の状態をさりげなく見守れる“海辺”のようなカレンダーを目指しています。  
~~機嫌の悪いときの彼女は本当に怖いのでいち早く察せるように、という思いもあります。~~  


---

## 📸 スクリーンショット

| Home（カレンダー） | 記録モーダル |
| --- | --- |
| <a href="https://github.com/user-attachments/assets/b90184b6-aec7-455f-9a22-cd9271110dd4"><img src="https://github.com/user-attachments/assets/b90184b6-aec7-455f-9a22-cd9271110dd4" alt="Record Modal" width="380" /></a> | <a href="https://github.com/user-attachments/assets/f48a3cca-4527-45e3-8c99-a896ce9063db"><img src="https://github.com/user-attachments/assets/f48a3cca-4527-45e3-8c99-a896ce9063db" alt="Home - Calendar" width="380" /></a> |
---

## 🔑 主な機能
- ✅ ユーザー登録 / ログイン（Cookie認証）  
- ✅ カレンダーで日々の記録  
- ✅ 感情を10段階で可視化（クラゲアイコン）  
- ✅ ペアモード（マジックリンクで48h有効）  
- ✅ グラフで月の振り返り  
- ✅ PWAインストール対応  

---

## ⚙ 技術スタック
- **Frontend:** React + Vite + TypeScript + React Router + CSS Modules  
- **Backend:** NestJS + Prisma + PostgreSQL (Neon)  
- **Infra:** Netlify (Frontend) + Render / Neon (API, DB)  
- **その他:** Chart.js, PWA Manifest, JWT  

---

## 💡 苦労した点
- モバイル環境での軽量化（背景アニメーションやアイコン最適化）  
- 認証のCookie運用（CORS, credentialsの扱い）  
- DBスキーマ設計（感情・生活習慣・ペア連携を扱う）  

---

## 🚀 今後の改善点
- AIによる月間記録の要約機能
- 常用薬ボタン 
- 通知機能（薬のリマインドなど）  
- ダークモード⇔ライトモード切り替え  
- UI/UXのさらなる最適化
- PC向けスタイルの改善
- スタイルをもっと軽量に、もっとモダンに  

---

## ーーーーーアップデート・バグ修正ーーーーーー
  ログイン認証方式の変更（Cookie → Authorization        
  ヘッダー）

  問題: NetlifyとRenderのクロスオリジン環境でCookieがブロ     
  ックされ、ログインできない

  解決策: JWT
  トークンをAuthorizationヘッダーで送信する方式に移行

  変更内容:
  - バックエンド:
    - ログイン時にCookie設定を削除し、トークンをレスポンス    
  で返すように変更
    - AuthGuardをシンプル化（Authorizationヘッダーのみサポ    
  ート）
    - スライディングトークン延長機能を削除
  - フロントエンド:
    - トークンをlocalStorageに保存
    - 全HTTPリクエストに自動的にAuthorization: Bearer
  <token>ヘッダーを付与
    - ログアウト時にlocalStorageをクリア

  ---
  2.  部分更新機能の実装（データ上書き問題の修正）

  問題:
  - 詳細記録後にクイック記録すると、運動・メモが空で上書き    
  されて消える
  - クイック記録後に詳細記録すると、常用薬リストが空で上書    
  きされて消える

  解決策: バックエンドで部分更新をサポート、フロントエンド    
  で送信フィールドを限定

  変更内容:
  - バックエンド (records.service.ts):
    - 送信されたフィールドのみ更新、未送信フィールドは既存    
  値を保持
  - フロントエンド:
    - クイック記録: meal, sleep, period, emotion,
  tookDailyMed のみ送信
    - クイック記録の薬リスト編集UIを非表示（showMedicineLi    
  st={false}）
    - 詳細記録: 全フィールドを送信（従来通り）


  ---
  3.  詳細記録から「常用薬」トグルを削除

  問題: 詳細記録に不要な「常用薬」トグルが表示されていた      

  解決策: MedicineSectionにshowTitle={false}を設定

  変更内容:
  - 詳細記録: 「服薬」タイトル + 薬リスト編集UIのみ表示       
  - クイック記録: 「💊服薬💊」タイトル +
  常用薬トグルのみ表示

  ---
  4. 🎨 クイックモーダルのスライダー色変更

  問題: スライダーの色が上下逆になっていた

  解決策: グラデーションを変更

  変更内容:
  - 上（値10）: 赤 #ef4444
  - 中央（値5）: 青紫 #6366f1
  - 下（値1）: 青 #3b82f6

  ---
  5.  深夜にモーダルが開かないバグ修正

  問題:
  深夜2時頃に当日の日付をタップしてもモーダルが開かない       

  原因: toISOString()がUTC時刻を返すため、日本時間との時差    
  で1日ずれる

  解決策:
  ローカル時刻を使用するformatDateLocal()関数を実装

  変更内容:
  - Calendar.tsx: todayStrの計算をローカル時刻に変更
  - HomeSection.tsx: 同上
  - useCalendar.ts:
  日付生成とtodayの計算をローカル時刻に変更
  ---


## 👤 作者
- 作者: **坂本 武龍 (Takeru)**  
- GitHub: [Takeru-13]([https://github.com/Takeru-13/SeaSide-app](https://github.com/Takeru-13/Takeru-13))  

---
