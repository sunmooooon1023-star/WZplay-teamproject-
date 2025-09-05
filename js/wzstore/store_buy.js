const getUrl = window.location.search;
const getId = getUrl.split("=")[1];
let order = JSON.parse(sessionStorage.getItem(getId));

function stripWonKeepComma(t) { return (t || '').toString().trim().replace(/[^\d,]/g, ''); }
function uncomma(s) { return parseInt(String(s || '').replace(/,/g, ''), 10) || 0; }

function updateOrder(updates) {
  order = { ...order, ...updates };       
  sessionStorage.setItem(getId, JSON.stringify(order)); 
}

//  저장 함수 (주소/결제수단/총액)S
function saveCheckoutPayload() {
  // 1) 배송지
  const addrInputs = document.querySelectorAll('#payBefore .sendinfo, #payBefore .address input[type="text"]');
  const address = Array.from(addrInputs).map(i => i.value.trim()).filter(Boolean).join(' ');
  if (address) updateOrder({address : address})

  // 2) 결제수단
  let payMethod = order.payMethod || '';

  if (!payMethod) {
    const activeBtn = document.querySelector('.carduse.btn.active, .carduse.btn.is-pressed, .carduse.btn.on');
    if (activeBtn) payMethod = activeBtn.textContent.trim();

    if (!payMethod) {
      const useBtn = document.querySelector('.use.btn');
      if (useBtn) payMethod = useBtn.textContent.trim();
    }

    if (payMethod) updateOrder({ payMethod:payMethod }); 
  }

  // 3) 총 결제금액 (우선 화면 최종합계 → 없으면 직접 계산)
  const pick = s => document.querySelector(s);
  const totalNode = pick('#payAfter .total p span')
    || pick('#payAfter .total span')
    || pick('#payBefore .right p.total span')
    || pick('.calculation .total > span');

  let totalNum = totalNode ? (totalNode.textContent.match(/\d+/g) || []).join('') : '';

  if (!totalNum) {
    const price = uncomma(pick('#payAfter .calculation .price')?.textContent);
    const discount = uncomma(pick('#payAfter .calculation .discount')?.textContent);
    const shipping = uncomma(pick('#payAfter .calculation > div:nth-of-type(4) span')?.textContent) || 3000;
    totalNum = String(Math.max(0, price - discount + shipping));

  }
  updateOrder({totalPrice:totalNum});
}

// DOM
$(function () {
  /* 서브 헤더 창열기 */
  $('.nav-list').on('click', function () {
    $('.subHeader').stop().animate({ left: 0 }, 1500, 'easeOutExpo');
  });
  $('.headerClose').on('click', function () {
    $('.subHeader').stop().animate({ left: '-100%' }, 1500, 'easeOutExpo');
  });

  /* 배송주소요소 순서바꿈 */
  (function () {
    const $area = $('#payBefore .addressArea');
    const $h3s = $area.find('h3');
    const $inputs = $area.find('.address input[type="text"]');
    if ($h3s.length >= 2 && $inputs.length >= 2) {
      $h3s.eq(0).after($inputs.eq(0));
      $h3s.eq(1).after($inputs.eq(1));
    }
  })();

  /* 체크박스 색상 토글 */
  $('.checkBox').on('click', function () { $(this).toggleClass('checked'); });

  /* 배송요청 100자 제한 (가드) */
  const msgInfo = document.getElementById('msgInfo');
  if (msgInfo) {
    msgInfo.addEventListener('input', function () {
      if (this.value.length > 100) {
        this.value = this.value.substring(0, 100);
        alert('100자 이내로 입력해주세요');
      }
      // 입력 로그 저장(다음 페이지 textarea에 주입)
      updateOrder({msgInfo : this.value});
    });
  }

  /* 입력 채움 표시 */
  function toggleFilled(el) { $(el).toggleClass('filled', $(el).val().trim().length > 0); }
  $('#payBefore .sendinfo, #payBefore textarea').each(function () { toggleFilled(this); });
  $(document).on('input blur', '#payBefore .sendinfo, #payBefore textarea', function () { toggleFilled(this); });
  $(document).find(".summer.sale").find('span').text(`${order.discountPercent}%`);

  /* 쿠폰 적용하기 */
  $(document).on('click', '.sale', function (e) {
    e.preventDefault();
    $('#payBefore .innerBox .sale').removeClass('is-active');
    $(this).addClass('is-active');

    let percent = 0;
    if ($(this).hasClass('summer')) {
        // summer 버튼
        percent = order.discountPercent;
        $(this).find('span').text(`${percent}%`);

    } else if ($(this).hasClass('first')) {
        // first 버튼
        percent = 20;
        $(this).find('span').text(`${percent}%`);
    }

    // 할인 계산
    const basePrice = order.totalPrice;
    const discount = Math.floor(basePrice * percent / 100);
    const finalPrice = basePrice - discount;

    const $right = $('#payBefore .right');
    $right.find('p strong').text(basePrice.toLocaleString());
    $right.find('del').text(discount.toLocaleString() + '원');
    $right.find('p.total span').text(finalPrice.toLocaleString());
  });

  /* 쿠폰 [사용하기] */
  $(document).off('click.use', '#payBefore .use.btn');
  $(document).on('click.use', '#payBefore .use.btn', function (e) {
    e.preventDefault(); e.stopImmediatePropagation();

    const $btn = $(this);
    const inCard = $btn.closest('.cardArea').length > 0;
    const inCoupon = $btn.closest('.cuponArea').length > 0;

    // 1) 결제수단 확정
    if (inCard) {
      const $wrap = $('#payBefore .cardArea .selectList');
      const $phone = $wrap.find('.phoneSelect');
      const $ul = $wrap.find('ul');
      if (!$phone.is(':visible')) {
        const hasSelected = $ul.find('a.is-on').length > 0;
        if (!hasSelected) { alert('결제수단을 먼저 선택해주세요'); return; }
      }
      alert('적용되었습니다.');
      $('#payBefore .cardArea').addClass('is-confirmed');
      return;
    }

    // 2) 쿠폰 사용
    if (inCoupon) {
      const $box = $('#payBefore .innerBox');
      const $cp = $('#payAfter .calculation .cpCheck');
      const $active = $box.find('.sale.is-active');

      if (!$active.length) { alert('쿠폰을 먼저 선택해주세요.'); $cp.removeClass('is-visible').text(''); return; }
      if ($active.is('.first.sale')) { alert('※사용기한이 지난 쿠폰입니다.'); $cp.removeClass('is-visible').text(''); return; }
      if ($active.is('.summer.sale')) {
        alert('적용되었습니다.');
        const label = $active.clone().children('span').remove().end().text().trim();
        const percent = parseInt($active.find('span').text(), 10) || 0;
        $cp.text(`${label} ${percent}%`).addClass('is-visible');
        return;
      }
    }
  });

  /* 카드선택 탭메뉴 */
  (function () {
    const $area = $('.cardArea');
    const $wrap = $area.find('.selectList');
    const $ul = $wrap.find('ul');
    const $phone = $wrap.find('.phoneSelect');

    function showMode(mode) {
      $wrap.show();
      if (mode === 'phone') { $ul.hide(); $phone.fadeIn(150); return; }
      $phone.hide(); $ul.show();
      $wrap.removeClass('mode-bank');
      if (mode === 'bank') $wrap.addClass('mode-bank');
    }

    $(document).on('click', '.cardArea .carduse.btn', function (e) {
      e.preventDefault();
      $('.cardArea .carduse.btn').removeClass('is-pressed');
      $(this).addClass('is-pressed');

      const label = $(this).text().trim();
      if (label.includes('신용카드')) showMode('card');
      else if (label.includes('휴대폰')) showMode('phone');
      else if (label.includes('계좌이체')) showMode('bank');

      // 결제수단 텍스트 저장
      sessionStorage.setItem('payMethod', label);
    });

    // 처음엔 카드 탭
    showMode('card');
    const $first = $('.cardArea .carduse.btn')
      .filter((_, b) => $(b).text().includes('신용카드'))
      .addClass('is-pressed')
      .first();
    if ($first.length) sessionStorage.setItem('payMethod', $first.text().trim());
  })();

  /* 카드 클릭 시 선택 표시 */
  $(document).on('click', '.cardArea ul li a', function (e) {
    e.preventDefault();
    const $li = $(this).closest('li');
    if ($li.find('p').length) { alert('본인인증 후 다시 시도하세요'); return; }
    $('.cardArea ul li a').removeClass('is-on');
    $(this).addClass('is-on');
  });

  /* payBefore 요약 → payAfter 계산 영역 동기 */
  function syncSummary() {
    const $right = $('#payBefore .right');
    const base = stripWonKeepComma($right.find('p strong').text());
    const discount = stripWonKeepComma($right.find('del').text());
    const $calc = $('#payAfter .calculation');
    $calc.find('.price').text(base);
    $calc.find('.discount').text(discount);
  }
  syncSummary();
  $(document).on('click', '#payBefore .innerBox .sale, #payBefore .cuponArea .use.btn', function () {
    setTimeout(syncSummary, 0);
  });
  const targetRight = document.querySelector('#payBefore .right');
  if (targetRight && 'MutationObserver' in window) {
    new MutationObserver(syncSummary).observe(targetRight, { subtree: true, childList: true, characterData: true });
  }

  /* 총합 업데이트: price - discount + 배송비 */
  function updateTotalFromCalc() {
    const price = uncomma($('#payAfter .calculation .price').text());
    const discount = uncomma($('#payAfter .calculation .discount').text());
    const shipping = uncomma($('#payAfter .calculation > div:nth-of-type(4) span').text()) || 3000;
    const total = Math.max(0, price - discount + shipping);
    $('#payAfter .total p span').text(total.toLocaleString());
  }
  updateTotalFromCalc();
  const calc = document.querySelector('#payAfter .calculation');
  if (calc && 'MutationObserver' in window) {
    new MutationObserver(updateTotalFromCalc).observe(calc, { subtree: true, childList: true, characterData: true });
  }

  /* .cpCheck 클릭 시 쿠폰 섹션으로 스크롤 */
  $(document).off('click.cpcheck', '#payAfter .cpCheck');
  $(document).on('click.cpcheck', '#payAfter .cpCheck', function (e) {
    e.preventDefault();
    const $area = $('#payBefore .cuponArea');
    if (!$area.length) return;
    const headerH = $('#mainHeader').outerHeight() || 0;
    const top = Math.max(0, $area.offset().top - headerH - 12);
    $('html, body').stop(true).animate({ scrollTop: top }, 700, 'easeOutExpo');
  });

  /* 결제하기 버튼: 검사 → 저장 → 이동 */
  $(document).off('click.pay', '.payBtn');
  $(document).on('click.pay', '.payBtn', function (e) {
    e.preventDefault();

    const headerH = $('#mainHeader').outerHeight() || 0;

    // 1) 주소 비었는지 검사
    const $inputs = $('#payBefore .sendinfo');
    let $firstEmpty = null;
    $inputs.each(function () { if (!$firstEmpty && !$(this).val().trim()) $firstEmpty = $(this); });
    if ($firstEmpty) {
      const top = Math.max(0, $('#payBefore').offset().top - headerH - 12);
      $('html, body').stop(true).animate({ scrollTop: top }, 700, 'easeOutExpo', () => $firstEmpty.focus());
      return;
    }

    // 2) 결제수단 확정 여부
    if (!$('#payBefore .cardArea').hasClass('is-confirmed')) {
      const top2 = Math.max(0, $('#payBefore .cardArea').offset().top - headerH - 12);
      $('html, body').stop(true).animate({ scrollTop: top2 }, 700, 'easeOutExpo');
      return;
    }

    // 3) 저장 → 이동
    saveCheckoutPayload();                 // ★ 반드시 이동 전에 호출
    window.location.href = `store_fin.html?id=${getId}`;  // 착륙
  });

  /* 초기 금액 세팅 */
  (function () {
    const basePrice = order.totalPrice;
    const $right = $('#payBefore .right');
    const $calc = $('#payAfter .calculation');

    // payBefore 요약
    $right.find('p strong').text(basePrice.toLocaleString());
    $right.find('del').text('0원');
    $right.find('p.total span').text(basePrice.toLocaleString());

    // payAfter 계산 영역
    $calc.find('.price').text(basePrice.toLocaleString());
    $calc.find('.discount').text('0');

    // 총합(배송비 포함)
    const shipping = parseInt($calc.find('> div:nth-of-type(4) span').text().replace(/,/g, ''), 10) || 3000;
    const total = basePrice + shipping;
    $('#payAfter .total p span').text(total.toLocaleString());
  })();
});

/* 카드수단 버튼 클릭 시 payMethod 저장 (가드) */
document.querySelectorAll('.carduse.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.carduse.btn.active').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const payText = btn.textContent.trim();
    sessionStorage.setItem('payMethod', payText);
  });
});

