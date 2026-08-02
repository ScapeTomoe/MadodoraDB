/* ============================================================
   kioku.js
   入力されたIDで character.html?id=xxx に遷移するだけの
   シンプルなスクリプト。
   ============================================================ */

const form = document.getElementById("kioku-form");
const input = document.getElementById("kioku-input");
const errorEl = document.getElementById("kioku-error");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = input.value.trim();

  if (!id) {
    errorEl.hidden = false;
    errorEl.textContent = "IDを入力してください";
    input.focus();
    return;
  }

  errorEl.hidden = true;

  // hidden:true のキャラは遷移させず、封印メッセージを出す
  try {
    const res = await fetch(`characters/${encodeURIComponent(id)}.json`);
    if (res.ok) {
      const data = await res.json();
      if (data.hidden) {
        errorEl.hidden = false;
        errorEl.textContent = "この魔法少女は強い力で封じられているようだ....";
        return;
      }
    }
  } catch (e) {
    // 取得に失敗した場合は通常通り character.html 側のエラー表示に任せる
  }

  location.href = `character.html?id=${encodeURIComponent(id)}`;
});

// 入力し始めたらエラー表示を消す
input.addEventListener("input", () => {
  if (!errorEl.hidden) {
    errorEl.hidden = true;
  }
});

/* ============================================================
   キャラクター一覧の読み込み
   characters/index.json (ファイル名⇔名前の対応表) を元に、
   各キャラのJSONを取得して hidden:true のものだけ除外する。
   ============================================================ */
loadCharacterList();

async function loadCharacterList() {
  const listEl = document.getElementById("kioku-list");

  let index;
  try {
    const res = await fetch("characters/index.json");
    if (!res.ok) throw new Error("index.json not found");
    index = await res.json();
  } catch (e) {
    listEl.innerHTML = `<li class="kioku-list-empty">一覧の読み込みに失敗しました</li>`;
    return;
  }

  const entries = await Promise.all(
    index.map(async (entry) => {
      const id = entry.file.replace(/\.json$/, "");
      try {
        const res = await fetch(`characters/${id}.json`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.hidden) return null;

        const name = data.info?.name ?? entry.name ?? "???";
        return { id, name };
      } catch (e) {
        return null;
      }
    })
  );

  const visible = entries.filter(Boolean);

  if (visible.length === 0) {
    listEl.innerHTML = `<li class="kioku-list-empty">表示できるキャラクターがいません</li>`;
    return;
  }

  listEl.innerHTML = visible
    .map(
      ({ id, name }) => `
      <li><a href="character.html?id=${encodeURIComponent(id)}">${escapeHtml(name)}：${escapeHtml(id)}</a></li>`
    )
    .join("");
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
