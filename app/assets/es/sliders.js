;
(function() {
  const projectsSwiper = new Swiper('.main-block .swiper-container', {
    speed: 400,
    slidesPerColumnFill: 'row',
    navContainer: {
      el: '.slider__arrows',
    },
    navigation: {
      nextEl: '.next-slide',
      prevEl: '.prev-slide',
    },
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
    }
  });
})();