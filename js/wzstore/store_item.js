const fetchData = async () => {
    const res = await fetch('./source/store_item.json');
    const data = await res.json();
    return Object.values(data);
};

document.addEventListener("DOMContentLoaded", async () => {
  const getUrl = window.location.search;
  const getId = getUrl.split("=")[1];

  const data = await fetchData();
  const targetItem = data.find(item => item.id === getId);
  document.querySelector("title").textContent = `${targetItem.title} | WZ 스토어`;

  /* ---------------- 상품 데이터 렌더링 ---------------- */

  // 태그 리스트 변환
  const tagList = targetItem.tags.map(tag => {
    return `<span class="tag">${tag}</span>`;
  }).join("");

  // 메인 아이템 영역
  document.getElementById("mainItem").innerHTML = `
    <div class="item" >
      <div class="colorPack">
        <figure style="background-color: ${targetItem.colorSwatches[0]}" class="on"></figure>
        <figure style="background-color: ${targetItem.colorSwatches[1]}"></figure>
        <figure style="background-color: ${targetItem.colorSwatches[2]}"></figure>
        <figure style="background-color: ${targetItem.colorSwatches[3]}"></figure>
      </div>
      <div class="imageBox">
        <img src="${targetItem.images[0].src}" alt="">
        <img src="${targetItem.images[1].src}" alt="">
        <img src="${targetItem.images[2].src}" alt="">
        <img src="${targetItem.images[3].src}" alt="">
      </div>
      <div class="itemSummary">
        ${targetItem.summary}
      </div>
      <div class="itemFixed">
        <div class="itemTitle">
          <h2>${targetItem.title}</h2>
          <div class="tagArea">${tagList}</div>
          <p class="price" style="color: #d33a3c;">${targetItem.discountPercent}%</p>
          <p class="price price2"><span>${targetItem.price.toLocaleString()}</span>원</p>
        </div>
        
        <div class="buyOpt">
          <div class="buyOptionBox">
            <div class="number">
              <span>-</span>
              <span class="quantity">1</span>
              <span>+</span>
            </div>  
            <div class="optChoice">
              <div class="optWrap">
                <div>
                  <p>Metalic Black</p>
                  <p>pure white</p>
                  <p>burgundy red</p>
                  <p>melo orange</p>
                </div>
                <a href="#"><span class="selectedOption"> 옵션선택</span><i class="fa-solid fa-angle-up"></i></a>
              </div>
            </div> 
          </div>
          <button class="buy"><span>구매하기</span></button>
        </div>
      </div>
    </div>
  `;

  // 상세 텍스트 영역
  document.querySelector(".infoTextBox").innerHTML = `
    <article class="itemTxt1">
      <img src="${targetItem.itemTexts[0].img}" alt="${targetItem.id}">
      <p>${targetItem.itemTexts[0].p[0]}</p>
      <p>${targetItem.itemTexts[0].p[1]}</p>
    </article>
    <article class="itemTxt2">
      <img src="${targetItem.itemTexts[1].img}" alt="${targetItem.id}">
      <p>${targetItem.itemTexts[1].p[0]}</p>
      <p>${targetItem.itemTexts[1].p[1]}</p>
    </article>
    <article class="itemTxt3">
      <img src="${targetItem.itemTexts[2].img}" alt="${targetItem.id}">
      <p>${targetItem.itemTexts[2].p[0]}</p>
      <p>${targetItem.itemTexts[2].p[1]}</p>
    </article>
  `;

  if(getId !== "AVIOTxWZ"){
    document.querySelector(".itemPoint").style.display = "none";
    document.querySelector(".pint").style.display = "none";
  }

  const adArea = document.querySelector(".adArea");
  adArea.style.backgroundImage = `url(${targetItem.ad[2].bgImage})`;
  adArea.innerHTML = `
    <h2>${targetItem.ad[0].label}</h2>
    <span><a href="${targetItem.ad[1].href}">원작 보러가기🏃‍♀️</a></span>

  `
/* 한줄리뷰 가로 스와이프 */
  var swiper = new Swiper('#oneSentense', {
        slidesPerView: 3,
        spaceBetween: 15,
        direction: getDirection(),
        on: {
          resize: function () {
            this.changeDirection(getDirection());
          },
        },
  });

  function getDirection() {
    return window.innerWidth <= 760 ? 'vertical' : 'horizontal';
  }

  /* ---------------- 스크롤 애니메이션 ---------------- */
  const targets = document.querySelectorAll(".itemTxt1, .itemTxt2, .itemTxt3");

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("itemTxt--show");
        obs.unobserve(entry.target); // 한번만 실행
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px"
  });

  targets.forEach(el => io.observe(el));

  /* ---------------- 구매 버튼 이벤트 ---------------- */
  orderBtn(targetItem);
  initColorPack();
});

const orderBtn = (targetItem) => {  
  document.querySelector(".buyOpt button.buy").addEventListener("click", () => {
    const quantity = document.querySelector(".quantity").textContent;
    const totalPrice = targetItem.price * quantity;
    const selectedOption = document.querySelector(".selectedOption").textContent.trim();
    const isLogined = sessionStorage.getItem("member");

    if (!isLogined) {
      alert("로그인 후 이용가능합니다.");
      window.location.href = "login.html";
      return;
    } 

    if(selectedOption === "옵션선택") {
      alert("옵션을 선택해주세요.");
      return;
    }

    const order = {
      itemId: targetItem.id,
      itemImage:targetItem.images[0].src,
      quantity : quantity,
      totalPrice: totalPrice,
      selectedOption:selectedOption,
      discountPercent:targetItem.discountPercent,
      payMethod:"",
      address:"",
      msgInfo:""
    }

    const orderId = `${targetItem.id}_${Date.now()}`;

    sessionStorage.setItem(orderId, JSON.stringify(order));
    window.location.href = `store_buy.html?id=${orderId}`;
  });
}


/* 서브 헤더 창열기 */
$(function () {
    $('.nav-list').on('click', function (e) {
        e.preventDefault();
        let subHeader = $('.subHeader');
        $(subHeader).stop().animate({
            left: 0
        }, 1500, 'easeOutExpo')
    })

    $('.headerClose').on('click', function () {
        let subHeader = $('.subHeader');
        $(subHeader).stop().animate({
            left: '-100%'
        }, 1500, 'easeOutExpo')
    })
})


$(function () {
  $('.optWrap > div > p').attr('tabindex', '0');
});

// [추가] 옵션 클릭/포커스 시 선택값 저장
$(document).on('click focusin', '.optWrap > div > p', function () {
  const val = $(this).text().trim();
  localStorage.setItem('selectedOption', val);
});

// [기존 수량 초기화 직후에 덧붙이기] 초기 수량을 저장
$(function () {
  $('.number').each(function () {
    const $qty = $(this).find('span').eq(1);
    if (!$qty.text().trim()) $qty.text('1');
    localStorage.setItem('selectedQuantity', $qty.text().trim());
  });
});

// [증감 핸들러의 마지막 줄에 덧붙이기] 변경된 수량을 저장
$(document).on('click', '.number span:first-child, .number span:last-child', function () {
  const $qty = $(this).closest('.number').find('span').eq(1);
  // (기존 증감 로직 바로 뒤에)
  localStorage.setItem('selectedQuantity', $qty.text().trim());
});


// [증감 핸들러의 마지막 줄에 덧붙이기] 변경된 수량을 저장
$(document).on('click', '.number span:first-child, .number span:last-child', function () {
  const $qty = $(this).closest('.number').find('span').eq(1);
  // (기존 증감 로직 바로 뒤에)
  localStorage.setItem('selectedQuantity', $qty.text().trim());
});



$(function () {
  // 열고 닫기 (아이콘/전체 a 둘 다 허용)
  $(document).on('click', '.optWrap a, .optWrap a i', function (e) {
    e.preventDefault();
    const $wrap = $(this).closest('.optWrap');
    $('.optWrap').not($wrap).removeClass('open'); // 다른 패널 닫기
    $wrap.toggleClass('open');
  });

  // 옵션 클릭 시 선택 반영 + 닫기
  $(document).on('click', '.optWrap > div > p', function () {
    const $wrap = $(this).closest('.optWrap');
    $wrap.find('a span').text($(this).text().trim());
    opttext = $(this).text().trim();
    $wrap.removeClass('open');
  });


  // 바깥 클릭 시 닫기
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.optWrap').length) $('.optWrap').removeClass('open');
  });
});



/* 수량 값 선택 */
// 수량 초기화(비어 있으면 1로)
$(function () {
  $('.number').each(function () {
    const $qty = $(this).find('span').eq(1);
    if (!$qty.text().trim()) $qty.text('1');
  });
});

// 감소(첫 번째 span)
$(document).on('click', '.number span:first-child', function () {
  const $qty = $(this).closest('.number').find('span').eq(1);
  let v = parseInt($qty.text(), 10) || 1;
  $qty.text(Math.max(1, v - 1)); // 최소 1
});

// 증가(세 번째 span)
$(document).on('click', '.number span:last-child', function () {
  const $qty = $(this).closest('.number').find('span').eq(1);
  let v = parseInt($qty.text(), 10) || 1;
  $qty.text(v + 1);
});


/* 컬러선택 */
function initColorPack() {
  const $pack  = $('.colorPack');
  const $imgs = $('.imageBox').find('img').slice(0, 4);

  const $stage = $pack.closest('.item'); 
  const $texts = $('.itemSummary, .itemTitle .price2, .itemTitle .tagArea'); 
  const baseCol = $texts.css('color');

  const gradients = [
    'radial-gradient(#fff 20%, #7ad3d1 80%)',
    'radial-gradient(#fff 20%, #ffa9b5 80%)',
    'radial-gradient(#fff 10%, #d8ebac 50%)',
    'radial-gradient(#fff 10%, #2a2a2a 50%)'
  ];

  // 초기 셋업
  $stage.css({ position: 'relative', overflow: 'hidden', background: gradients[0] });

  $imgs.css({
    position: 'absolute', top: '50%', left: '50%', width: '60%', height: '80%',
    objectFit: 'contain', objectPosition: 'center', zIndex: 1, display: 'none'
  }).eq(0).show();

  // 색상 클릭 핸들러
  $pack.on('click', 'figure', function () {
    const idx = $(this).index();
    $(this).addClass('on').siblings().removeClass('on');

    const $cur = $imgs.filter(':visible');
    const $next = $imgs.eq(idx);
    if ($cur[0] === $next[0]) return;

    // 배경 전환
    fadeStageBG($stage, gradients[idx]);

    // 텍스트 색상 변경
    $texts.css('color', idx === 3 ? '#fefefe' : baseCol);

    // 이미지 전환 애니메이션
    $cur.stop(true, true).animate({ opacity: 0, marginRight: '10px' }, 100, 'linear', function () {
      $(this).hide().css({ marginRight: 0, opacity: 1 });
    });
    $next.stop(true, true).css({ opacity: 0, marginLeft: '-10px', display: 'block' })
         .animate({ opacity: 1, marginLeft: 0 }, 220, 'swing');
  });
}

// 배경 그라디언트 페이드 함수 따로 분리
function fadeStageBG($stage, gradient) {
  $stage.find('.bgFade').remove();
  const $ov = $('<div class="bgFade">').css({
    position: 'absolute', inset: 0, pointerEvents: 'none',
    zIndex: 0, opacity: 0, transition: 'opacity .25s ease',
    background: gradient
  });
  $stage.append($ov);
  requestAnimationFrame(() => $ov.css('opacity', 1));
  $ov.on('transitionend', function () {
    $stage.css('background', gradient);
    $ov.remove();
  });
}

    /* 스크롤하면 아이템설명이 나오도록 함 */

/* 광고 플레이아이콘 */
$(document).on('click', '.playBtn', function(){
  const $btn = $(this);
  const on  = $btn.data('on');
  const off = $btn.data('off') || $btn.attr('src');

  // 이동 토글
  $btn.toggleClass('moved');

  // 이미지 스왑 토글
  $btn.attr('src', $btn.attr('src') === on ? off : on);

  // (원클릭만 원하면) 다음 줄 주석 해제:
  // $(this).off('click');
});