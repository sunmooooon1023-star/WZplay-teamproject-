const getUrl = window.location.search;
const getId = getUrl.split("=")[1];
const order = JSON.parse(sessionStorage.getItem(getId));

const optionEl = document.querySelector('.itemArea .option');
const qtyEl    = document.querySelector('.itemArea .quantity');
const itemImgEl = document.querySelector(".itemSummary figure");

if (optionEl) optionEl.textContent = order.selectedOption;
if (qtyEl) qtyEl.textContent = (order.quantity && /^\d+$/.test(order.quantity)) ? order.quantity : '1';
if(itemImgEl){
  itemImgEl.style.backgroundImage = `url(${order.itemImage})`;
}


/* 주문취소 막아버리기 */
document.addEventListener("DOMContentLoaded", () => {
  const cancelBtn = document.querySelector(".cancel");
  if (!cancelBtn) return;

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault(); // a/link 대응, 버튼이면 없어도 OK
    cancelBtn.classList.add("is-locked");
    alert(`해당 상품은 주문 취소가 불가능합니다.
고객센터(1234-5678)로 문의해주세요.`);

  });
});

/* 구매후기 작성하기 누르면 스토어 메인으로 가기 */
document.addEventListener("DOMContentLoaded", () => {
  const reviewBtn = document.querySelector(".review");
  if (!reviewBtn) return;

  reviewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // 같은 폴더면 ↓
    window.location.href = "store_wz.html";
  });
});

// helpers
const pad2 = n => String(n).padStart(2, "0");
const formatYMD = d => `${d.getFullYear()}.${pad2(d.getMonth()+1)}.${pad2(d.getDate())}`;
function formatKRW(v) {
  const num = String(v ?? "").replace(/[^\d]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("ko-KR") + "원";
}
function getRandomNumber(len){
  return Array.from({length: len}, () => Math.floor(Math.random()*10)).join("");
}

// 1) 주문번호(16) / 운송장(8)
const orderNumSpan = document.querySelector(".orderCheck > p span");
if (orderNumSpan) orderNumSpan.textContent = getRandomNumber(16);

const deliveryNumSpan = document.querySelector(".sendSearch span");
if (deliveryNumSpan) deliveryNumSpan.textContent = getRandomNumber(8);

/* console.log(opttext);
document.querySelector(".itemArea .option").textContent= opttext; */


// 2) storeBuy의 배송요청 메모
const msgEl = document.querySelector(".sendmsgArea .msgInfo");
if (msgEl) msgEl.value = order.msgInfo;

// 3) 날짜: 주문일 = 오늘, 도착예정 = +3일
const orderDateEl = document.querySelector(".orderNumber");
const monthEl = document.querySelector(".schedule .month");
const dayEl = document.querySelector(".schedule .day");
const nthDayEl = document.querySelector(".schedule .nthDay");

const now = new Date();
const orderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
if (orderDateEl) orderDateEl.textContent = formatYMD(orderDate);

const arrival = new Date(orderDate); arrival.setDate(arrival.getDate() + 3);
const daysKo = ["일","월","화","수","목","금","토"];
if (monthEl)  monthEl.textContent  = String(arrival.getMonth() + 1);
if (dayEl)    dayEl.textContent    = String(arrival.getDate());
if (nthDayEl) nthDayEl.textContent = `(${daysKo[arrival.getDay()]})`;

// 4) storeBuy에서 보낸 값 주입 (주소/결제수단/결제금액)
const sendEl = document.querySelector(".sendMethod");
const payEl  = document.querySelector(".payMethod");
const amtEl  = document.querySelector(".payamount");

const address = order.address;
const payMethod  = order.payMethod;
let totalAmt     = order.totalPrice;

if (sendEl && address) sendEl.textContent = address;
if (payEl  && payMethod)  payEl.textContent  = payMethod;

// totalAmount가 비어있을 때의 백업 (URL ?total=12345 지원)
if (!totalAmt) {
  const q = new URLSearchParams(location.search).get("total");
  if (q) totalAmt = String(q).replace(/[^\d]/g, "");
}

if (amtEl) amtEl.textContent = totalAmt ? formatKRW(totalAmt) : "";

/* 아래 라인들은 콘솔에서만 써야 합니다. 파일에 넣지 마세요.
saveCheckoutPayload();
sessionStorage.getItem('sendMethod');
sessionStorage.getItem('totalAmount');
*/

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