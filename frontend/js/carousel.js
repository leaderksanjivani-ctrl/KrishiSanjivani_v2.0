function initCarousel() {
  const carousel = document.querySelector('.ks-carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.ks-carousel-slide')];
  const dots = carousel.querySelector('.ks-carousel-dots');
  let current = 0;
  let timer;

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = index === 0 ? 'active' : '';
    dot.setAttribute('aria-label', `Show slide ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dots.appendChild(dot);
  });

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === current));
    dots.querySelectorAll('button').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === current));
    restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), 6000);
  }

  carousel.querySelector('.prev').addEventListener('click', () => showSlide(current - 1));
  carousel.querySelector('.next').addEventListener('click', () => showSlide(current + 1));
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', restart);
  restart();
}
