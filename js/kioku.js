/* ============================================================
   kioku.js
   入力されたIDで character.html?id=xxx に遷移するだけの
   シンプルなスクリプト。
   ============================================================ */

const form = document.getElementById("kioku-form");
const input = document.getElementById("kioku-input");
const errorEl = document.getElementById("kioku-error");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = input.value.trim();

  if (!id) {
    errorEl.hidden = false;
    input.focus();
    return;
  }

  errorEl.hidden = true;
  location.href = `character.html?id=${encodeURIComponent(id)}`;
});

// 入力し始めたらエラー表示を消す
input.addEventListener("input", () => {
  if (!errorEl.hidden) {
    errorEl.hidden = true;
  }
});
