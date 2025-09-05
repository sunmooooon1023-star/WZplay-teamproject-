

const tap = document.querySelectorAll('.tabMenu > li');
const panel = document.querySelectorAll('.tabOpen > .productList')

function itemView(index) {
  const len = Math.min(tabs.length, panels.length);

  for (let i = 0; i < len; i++) {
    tabs[i].classList.remove('on');
    panel[i].classList.remove('on');
  }

  if (index >= 0 && index < len) {
    tabs[index].classList.add('on');
    panel[index].classList.add('on');
  }
}
const tabLinks = document.querySelectorAll('.tabMenu > li > a');
tabLinks.forEach((a, i) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    itemView(i);
  });
});


/* 이미지에 커서를 올리면 오퍼시티 0에서 위로 올라오며 나타나도록 함. */