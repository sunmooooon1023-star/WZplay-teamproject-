import { fetchData } from "./home_init.js";
import { hoverModal } from "./home_hover_modal.js";

export const bindCardHoverEvent = async () => {
    const cards = document.querySelectorAll(".swiper-slide.common");
    const data = await fetchData();
    const hoverModalWrapper = document.getElementById("homeHoverModalWrapper");
    const container = document.querySelector(".swiper-wrapper");

    let showModalTimer;
    let hideModalTimer;

    cards.forEach(each => {
        each.addEventListener("mouseenter", async () => {
            clearTimeout(hideModalTimer);

            const cardId = each.getAttribute("id");
            showModalTimer = setTimeout(async () => {
                await hoverModal(data, cardId, each);
            }, 500);
        });

        each.addEventListener("mouseleave", () => {
            clearTimeout(showModalTimer);

            hideModalTimer = setTimeout(() => {
                hoverModalWrapper.innerHTML = '';
                hoverModalWrapper.classList.remove("active");
            }, 500);
        });
    });

    hoverModalWrapper.addEventListener("mouseenter", () => {
        clearTimeout(hideModalTimer);
    });

    hoverModalWrapper.addEventListener("mouseleave", () => {
        hoverModalWrapper.innerHTML = '';
        hoverModalWrapper.classList.remove("active");
    });
};

export const bindCardClickEvent = () => {
    
}

export const bindHomeAnimation = () => {
    //h2 애니메이션
    const sectionTitles = document.querySelectorAll('h2');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 1.0 
    });

    sectionTitles.forEach(target => observer.observe(target));

    //benefit 섹션
    const benefitTargets = [document.querySelector('.overlay-benefit'), document.querySelector('.benefit-img')];

    benefitTargets.forEach(target => {
        if (!target) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 1.0 });
        observer.observe(target);
    });

    //community 섹션
    const communityTargets = document.querySelectorAll('.community-item');

    const communityObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                communityObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 1.0 });
    communityTargets.forEach(target => communityObserver.observe(target));

    //독점작 섹션
    const logo = document.querySelector('.logo-wrapper');
    if (logo) {
        const logoObserver = new IntersectionObserver(entries => {

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    logo.classList.add('show');
                    logoObserver.unobserve(logo);
                }
            });
        }, { threshold: 0.5 });
        logoObserver.observe(logo);
    }
}