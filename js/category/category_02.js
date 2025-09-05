const container = document.querySelector(".accordion-section-02");

if (container) {
    const wrapper = container.querySelector(".accordion-wrapper02");
    const contentBoxes = container.querySelectorAll(".accordion-content-box");
    const contentText = container.querySelector(".accordion-content-text02");

    contentBoxes.forEach(box => {
        box.addEventListener("click", () => {
            contentBoxes.forEach(b => b.classList.remove("active"));
            box.classList.add("active");
            wrapper.classList.add("expanded");

            if (contentText) {
                contentText.classList.add("fade-out");

                setTimeout(() => {
                    contentText.classList.add("hidden");
                }, 300);
            }
        });
    });

    wrapper.addEventListener("mouseleave", () => {
        wrapper.classList.remove("expanded");
        contentBoxes.forEach(b => b.classList.remove("active"));

        if (contentText) {
            contentText.classList.remove("hidden");
            void contentText.offsetWidth;
            contentText.classList.remove("fade-out");
        }
    });
}