import { bindCardHoverEvent } from "./home_event.js";
import { renderHomeSwiper } from "./home_swiper.js";

$(function () {
  $('.list-contain').on('click', function (e) {
    e.stopPropagation();

    const clickedLi = $(this).closest('li');
    const subMenu = clickedLi.find('.sub');

    $('.sub').not(subMenu).slideUp(300);
    $('.arrow-down').not($(this).find('.arrow-down')).removeClass('rotate-up');

    subMenu.stop().slideToggle(600);
    $(this).find('.arrow-down').toggleClass('rotate-up');
  });

  $(document).on('click', function () {
    $('.sub').slideUp(300);
    $('.arrow-down').removeClass('rotate-up');
  });

  $('.sub li').on('click', function (e) {
    const subMenu = $(this).closest('.sub');
    const listContainer = $(this).closest('.list');      
    const targetedSwiper = listContainer.find('.swiper-wrapper')[0];  
    const filterCondition = $(this).find('.category-btn').data('value'); 
    subMenu.slideUp(300);
    subMenu.siblings('.list-contain').find('.arrow-down').removeClass('rotate-up');

    listContainer.find(".filter-condition-display").text($(this).text());

    renderHomeSwiper(filterCondition, targetedSwiper, listContainer)
    .then(() => bindCardHoverEvent());
    ;
  });

  $('.sub').on('click', function (e) {
    e.stopPropagation();
  });

});