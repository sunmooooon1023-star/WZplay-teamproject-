const containers = document.querySelectorAll(".accordion-section-01");

containers.forEach(container => {
    const wrapper = container.querySelector(".accordion-wrapper");
    const contentBoxes = container.querySelectorAll(".accordion-content-box");
    const contentText = container.querySelector(".accordion-content-text");

    contentBoxes.forEach(box => {
        box.addEventListener("click", () => {
            contentBoxes.forEach(b => b.classList.remove("active"));
            box.classList.add("active");
            wrapper.classList.add("expanded");

            if (contentText) {
                contentText.classList.add("fade-out");

                // 애니메이션 후 완전히 숨김
                setTimeout(() => {
                    contentText.classList.add("hidden");
                }, 300); // CSS transition 시간과 맞춰야 함
            }
        });
    });

    wrapper.addEventListener("mouseleave", () => {
        wrapper.classList.remove("expanded");
        contentBoxes.forEach(b => b.classList.remove("active"));

        if (contentText) {
            // 다시 보이게
            contentText.classList.remove("hidden");

            // 강제로 리플로우 발생시켜 transition 되게 하기
            void contentText.offsetWidth;

            contentText.classList.remove("fade-out");
        }
    });
});