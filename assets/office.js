const buttons = document.querySelectorAll(".accordions button");
for (const button of buttons) {
    button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        const content = button.nextElementSibling;
        if (content) {
            content.hidden = expanded;
        }
    });
}