;
(function() {
  const burger = document.querySelector('.nav__burger');
  const hMenu = document.querySelector('.nav-list');

  burger.addEventListener('click', function() {
    this.classList.toggle('active');

    (this.classList.contains('active'))
      ? hMenu.style.left = '0'
      : hMenu.style.left = '-100%';
  });
})();