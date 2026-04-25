const buttons = document.querySelectorAll(".accordions button");
for (const button of buttons) {
    button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        const content = button.nextElementSibling;
        if (!expanded && content) {
            content.classList.add("expanded");
        } else if (expanded && content) {
            content.classList.remove("expanded");
        }
        // Codex チェック
        // 問題の説明: expanded クラスだけで開閉を制御しているため、閉じた状態でも content 要素自体は DOM 上に残り、aria-expanded="false" でもキーボード操作や支援技術から内容へ到達できてしまいます。
        // 修正アドバイス: class の付け外しに加えて hidden 属性も同期させるか、少なくとも初期状態と開閉時に aria-hidden や inert を併用して閉じた内容を操作不能にしてください。
    });
}
