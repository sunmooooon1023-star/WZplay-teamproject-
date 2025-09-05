import { fetchData } from "./home_init.js";

const swiperOptions = {
  slidesPerView: 5,
  slidesPerGroup: 4,
  speed: 700,
  spaceBetween: 15,
  loop: true,
};

function initSwiper(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const nextEl = el.querySelector('.swiper-button-next');
    const prevEl = el.querySelector('.swiper-button-prev');

    const options = {
      ...swiperOptions,
      navigation: nextEl && prevEl ? {
        nextEl,
        prevEl,
      } : undefined,
    };

    new Swiper(el, options);
  });
}

export const renderHomeSwiper = async (filterCondition, targetedSwiper, listContainer) => {
  const data = await fetchData();

  const swiper01 = document.getElementById('slide01');
  const swiper02 = document.getElementById('slide02');
  const swiper03 = document.getElementById('slide03');

  function renderSlides(container, items) {
    container.innerHTML = items.map(item => `
      <div class="swiper-slide common" id=${item.id}>
        <span style="cursor:pointer;">
          <img src="${item.image_default}" alt="${item.title}">
        </a>
      </div>
    `).join('');
  }

  [swiper01, swiper02, swiper03].forEach(swiper => {
    if (swiper && !listContainer) {
      const randomItems = [...data].sort(() => Math.random() - 0.5).slice(0, 16);
      renderSlides(swiper, randomItems);
    }
  });

  // 필터 적용
  if (targetedSwiper) {
    const filteredItems = filterCondition
      ? [...data].filter(item => item.category === filterCondition).slice(0, 16)
      : [...data].sort(() => Math.random() - 0.5).slice(0, 16); 
    renderSlides(targetedSwiper, filteredItems);
  }

  ['.favorite_slider', '.recommend_slider', '.popular_slider'].forEach(selector => {
    initSwiper(selector);
  });
};

export const initAutoplaySwiper = () => {
  const swiper = new Swiper(".main-Autoplay-Swiper", {
    effect: 'fade',
    loop: true,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    },
    pagination: {
      el: ".main-Autoplay-Swiper .swiper-pagination",
      clickable: true,
      type: "bullets"
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });
  const Texts = document.querySelectorAll('.slide-overlay-text');

  Texts.forEach(el => {
    el.addEventListener('mouseenter', () => {
      swiper.autoplay.stop();
    });
    el.addEventListener('mouseleave', () => {
      swiper.autoplay.start();
    });
  });
}

export const renderAutoplaySwiper = async () => {
  const data = await fetchData();

  const wrapper = document.querySelector(".main-Autoplay-Swiper .swiper-wrapper");
  if (!wrapper) return;

  const items = data.sort(() => Math.random() - 0.5).slice(0, 8);

  wrapper.innerHTML = items.map(item => `
    <div class="swiper-slide" style="background-image:url(${item.image_default}); background-size:cover;" id=${item.id}>
      <div class="swiper-slide-innerText">
        <div class="slide-overlay-text">
          <div class="slideText">
            <h3>${item.title}</h3>
            <ul class="inner-plus">
              <li>
                <a href="/content-detail.html?query=${item.id}">
                  더 보기
                  <div class="plus"></div>
                </a>
              </li>
            </ul>
          </div>
          <p>${item.summary || ""}</p>
        </div>
      </div>
    </div>
  `).join("");
};

