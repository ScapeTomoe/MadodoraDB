# まどドラDB (MadodoraDB)

魔法少女まどか☆マギカ Magia Record: Exedra の非公式ファンデータベース＆簡易APIです。

公開URL: https://scapetomoe.github.io/MadodoraDB/

## これは何？

- キャラクターのステータス・スキル情報をJSONで管理し、GitHub Pages上で静的APIとして公開しています
- キャラ詳細ページは1枚のテンプレート（`character.html`）で全キャラ分をまかなっており、キャラを追加するときはJSONを置くだけで済む構成になっています

## サイト構成

```
root/
├── index.html          トップページ
├── terms.html          利用規約
├── character.html      キャラクター詳細(テンプレート、?id=CHA0001 のように使う)
├── kioku.html           IDを入力してキャラページに飛ぶ検索ページ
├── api.html             データ取得(API的な使い方)の説明ページ
├── css/
│   └── style.css        全ページ共通スタイル
├── js/
│   ├── character.js     character.html の描画ロジック
│   └── kioku.js          kioku.html の検索ロジック
├── characters/
│   ├── CHA0001.json 〜   キャラクターごとのデータ
│   └── index.json        ファイル名⇔キャラ名の対応表
├── schema/
│   └── character.schema.json  キャラクターJSONのスキーマ定義
└── images/
    └── (id).png          各キャラのビジュアル(180px)
```

## データの取得方法（簡易API）

各キャラクターのデータは `characters/{ID}.json` に直接HTTPアクセスするだけで取得できます。

```bash
curl -o CHA0001.json https://scapetomoe.github.io/MadodoraDB/characters/CHA0001.json
```

詳しい取得方法（curlが無い場合の代替手段など）は [`api.html`](https://scapetomoe.github.io/MadodoraDB/api.html) を参照してください。
過度なアクセスやAPIの利用条件については [`terms.html`](https://scapetomoe.github.io/MadodoraDB/terms.html) に利用規約を掲載しています。

## キャラクターJSONのデータ形式

```json
{
  "id": "CHA0001",
  "info": {
    "kioku_name": "ギガトンハンマー",
    "name": "巴和葉",
    "role": "ATTACKER",
    "attribute": "FLAME",
    "rarity": null
  },
  "stats": {
    "max_hp": 7500,
    "max_atk": 6000,
    "max_def": 300,
    "speed": 121
  },
  "normal_attack": { "...": "..." },
  "battle_skill": {},
  "magia": {},
  "ability": {},
  "support_ability": {}
}
```

### ロール (role)
`ATTACKER` / `BUFFER` / `DEBUFFER` / `BREAKER` / `HEALER` / `DEFENDER`

### 属性 (attribute)
`FLAME`(火) / `WATER`(水) / `WOOD`(木) / `LIGHT`(光) / `DARKNESS`(闇) / `NONE`(無)

### レアリティ (rarity)
`1`〜`5`の整数。不明な場合は`null`。

未確定のフィールドは`null`または空オブジェクトのままにしています。判明次第、該当キャラのJSONを更新してください。

## データ検証

```bash
pip install jsonschema
python scripts/validate.py
```

## 権利について

本サイトにおけるデータ・画像は全て原作および元データの著作者に帰属します。サイト管理者は著作権を一切有していません。
予告なくサイトが閉鎖される可能性があります。

## Contributing

各キャラクターのステータス・スキル情報が判明次第、該当する `characters/*.json` を更新してPRしてください。
