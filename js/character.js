/* ============================================================
   character.js
   URLの ?id=CHA0001 を見て characters/{id}.json を取得し、
   character.html の中身をその場で組み立てる。
   ------------------------------------------------------------
   キャラを増やすときはこのファイルもcharacter.htmlも触らず、
   characters/ に新しいJSONを置くだけでよい。
   ============================================================ */

const ROLE_LABELS = {
  ATTACKER: "アタッカー",
  BUFFER: "バッファー",
  DEBUFFER: "デバッファー",
  BREAKER: "ブレイカー",
  HEALER: "ヒーラー",
  DEFENDER: "ディフェンダー",
};

const ATTRIBUTE_LABELS = {
  FLAME: "火",
  WATER: "水",
  WOOD: "木",
  LIGHT: "光",
  DARKNESS: "闇",
  NONE: "無",
};

// ステータスバーの表示用スケール(現状わかっている数値感からの目安)。
// 実際の最大値が判明したら調整してください。
const STAT_DEFS = [
  { key: "max_hp", label: "HP", scaleMax: 10000 },
  { key: "max_atk", label: "攻撃", scaleMax: 8000 },
  { key: "max_def", label: "防御", scaleMax: 1000 },
  { key: "speed", label: "速度", scaleMax: 200 },
];

const SKILL_SECTIONS = [
  { key: "normal_attack", label: "通常攻撃" },
  { key: "battle_skill", label: "バトルスキル" },
  { key: "magia", label: "マギア" },
  { key: "ability", label: "アビリティ" },
  { key: "support_ability", label: "サポートアビリティ" },
];

const root = document.getElementById("char-root");
const id = new URLSearchParams(location.search).get("id");

if (!id) {
  showError("キャラクターIDが指定されていません。URLに <code>?id=CHA0001</code> のように付けてアクセスしてください。");
} else {
  fetch(`characters/${encodeURIComponent(id)}.json`)
    .then((res) => {
      if (!res.ok) throw new Error("not found");
      return res.json();
    })
    .then(renderCharacter)
    .catch(() => {
      showError(`「${escapeHtml(id)}」というキャラクターは見つかりませんでした。`);
    });
}

function renderCharacter(data) {
  const info = data.info || {};
  const stats = data.stats || {};

  document.title = `${info.name ?? "???"} | まどドラDB`;
  document.body.dataset.attribute = info.attribute ?? "";

  const visualHtml = renderVisual(data.id);
  const hiddenBannerHtml = data.hidden
    ? `<p class="char-hidden-banner">封印を破って辿り着いてしまったようだ……<br>
        <a href="https://scapetomoe.github.io/-tomoe-sisters/" class="char-hidden-link">巴姉妹 | TOMOE SISTERS</a></p>`
    : "";

  const statsHtml = STAT_DEFS.map(({ key, label, scaleMax }) => {
    const value = stats[key];
    const pct = value != null ? Math.min(100, Math.round((value / scaleMax) * 100)) : 0;
    return `
      <div class="char-stat">
        <span class="char-stat-label">${label}</span>
        <div class="char-stat-bar"><div class="char-stat-fill" style="width:${pct}%"></div></div>
        <span class="char-stat-value">${value != null ? value : "?"}</span>
      </div>`;
  }).join("");

  const skillsHtml = SKILL_SECTIONS.map(({ key, label }) =>
    renderSkillSection(label, data[key])
  ).join("");

  root.innerHTML = `
    ${hiddenBannerHtml}
    ${visualHtml}
    <p class="char-kioku">${escapeHtml(info.kioku_name ?? "")}</p>
    <h1 class="char-name">${escapeHtml(info.name ?? "???")}</h1>
    <div class="char-badges">
      <span class="char-badge">${escapeHtml(ROLE_LABELS[info.role] ?? info.role ?? "?")}</span>
      <span class="char-badge char-badge-attribute">${escapeHtml(ATTRIBUTE_LABELS[info.attribute] ?? info.attribute ?? "?")}属性</span>
    </div>

    <section class="char-stats">${statsHtml}</section>
    <p class="char-rarity">${renderRarityStars(info.rarity)}</p>

    ${skillsHtml}
  `;
}

// n個の★の後に(5-n)個の☆を続けた文字列を作る
// n が null/未定義/範囲外のときは「不明」表示にする
function renderRarityStars(n) {
  if (n == null || n < 0 || n > 5) return "レアリティ不明";
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function renderVisual(id) {
  // id が確定していないキャラ(provisional_idのみ)は画像がまだ無いので表示しない
  if (!id) return "";

  const imageNumber = id.replace(/^CHA/, "");
  const src = `images/${imageNumber}.png`;

  return `
    <div class="char-visual">
      <img src="${src}" alt="" onerror="this.closest('.char-visual').remove()">
    </div>`;
}

function renderSkillSection(label, skill) {
  const hasContent = skill && Object.keys(skill).length > 0;
  const body = hasContent
    ? `
      ${skill.name ? `<p class="char-skill-name">${escapeHtml(skill.name)}</p>` : ""}
      ${skill.description ? `<p class="char-skill-desc">${escapeHtml(skill.description)}</p>` : ""}
    `
    : `<p class="char-skill-pending">情報準備中</p>`;

  return `
    <section class="char-skill">
      <h2 class="char-skill-title">${label}</h2>
      ${body}
    </section>`;
}

function showError(message) {
  root.innerHTML = `<p class="char-error">${message}</p>`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}
