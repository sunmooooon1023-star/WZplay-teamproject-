/* json */

const fetchData = async () => {
  const res = await fetch('./source/data.json');
  const data = await res.json();
  const dataArray = Object.values(data);  // 객체를 배열로 변환 (필요에 따라)
  return dataArray;  // 데이터를 함수가 반환
}

/* scroll 함수 */
function scroll() {
  setTimeout(() => {
    const target = document.querySelector('.swiper-bottom');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn("'.swiper-bottom' 요소를 찾을 수 없습니다.");
    }
  }, 0);
}

/* 랜덤 스와이퍼 */
window.addEventListener('DOMContentLoaded', async () => {

  const data = await fetchData();

  const Random = data.sort(() => Math.random() - 0.5)
    .slice(0, 16);


  const slideShow = Random.map(item =>
    `<div class="swiper-slide">
        <a href="content-detail.html?query=${item.id}"><img src="${item.image_poster}"/></a>
        </div>`).join('');

  document.getElementById('swiper-wrapper').innerHTML = slideShow;


  new Swiper(".mySwiper", {
    slidesPerView: 'auto',
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    loopAdditionalSlides: 5,
    preloadImages: true,
    autoplay:true
  });

  scroll();

})



/* 인기 순위 */

const TargetTitle = ["단다단", "폭싹 속았수다", "귀멸의 칼날: 도공마을 편", "악마가 이사왔다", "발레리나", "F1 더 무비", "장송의 프리렌", "탑건 매버릭", "극한직업", "브레이킹 배드"]
window.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchData();
  const FilterItems = data.filter(item => TargetTitle.includes(item.title));
  popularRender(FilterItems);
})

function popularRender(FilterItems) {
  const popularleft = document.getElementById('popular-list-left');
  const popularright = document.getElementById('popular-list-right');

  popularleft.innerHTML = '';
  popularright.innerHTML = '';

  FilterItems.forEach((item, index) => {
    const populardiv = document.createElement('div');
    populardiv.classList.add('popular-item');

    populardiv.innerHTML = `<img src="${item.image_poster}" alt="${item.title}">
                                <a href="content-detail.html?query=${item.id}">
                                    <p><span>${index + 1}.</span>${item.title}</p>
                                </a>`


    if (index < 5) {
      popularleft.appendChild(populardiv);
    } else {
      popularright.appendChild(populardiv);
    }
  });

  scroll();

}



/* 2번 search click */

document.getElementById('search-button').addEventListener('click', async function (e) {
  e.preventDefault();

  const WORD = document.getElementById('search-input').value.trim();
  /* console.log(WORD); */

  if (WORD.length === 0) {
    alert("검색어를 입력해주세요");

    const Result = document.getElementById('content-result');
    Result.innerHTML = '';
    Result.classList.remove('active');

    document.getElementsByClassName('content-text')[0].style.display = "none";

    return;
  }

  document.getElementsByClassName('content-text')[0].style.display = "block";


  const data = await fetchData();

  const FilterItems = data.filter(item => item.title.toLowerCase().includes(WORD.toLowerCase()));
  renderResults(FilterItems);

  scroll();

})




/* render */

function renderResults(filteredItems) {
  const Result = document.getElementById('content-result');
  Result.innerHTML = '';

  if (filteredItems.length > 0) {
    filteredItems.forEach(item => {
      const NewDiv = document.createElement('div');
      NewDiv.classList.add('Result');

      NewDiv.innerHTML = `
        <a href="./content-detail.html?query=${item.id}"}><img src="${item.image_poster}" alt="${item.title}"></a>
        <a href="./content-detail.html?query=${item.id}"><h4>${item.title}</h4></a>
      `;

      Result.appendChild(NewDiv);

    });
    Result.classList.add('active');

  } else {
    Result.innerHTML = '<p>※ 검색 결과가 없습니다 ※</p>';
    Result.classList.remove('active');

  }
  scroll();

}


/* home-header-search */

document.addEventListener('DOMContentLoaded', async () => {

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query')?.toLowerCase() || '';

  if (!query) return;

  const data = await fetchData();

  const filteredItems = data.filter(item => item.title.toLowerCase().includes(query));


  const contentText = document.getElementsByClassName('content-text')[0];
  const Result = document.getElementById('content-result');

  if (filteredItems.length > 0) {
    contentText.style.display = "block";
  } else {
    Result.innerHTML = '<p>검색 결과가 없습니다.</p>';
    contentText.style.display = "block";
  }
  renderResults(filteredItems);

  scroll();

});