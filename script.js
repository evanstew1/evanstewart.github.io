//get modal and container
const modal = document.querySelector(".modal");
const modalImg = modal.querySelector(".modal-content");

//get images
const images = document.querySelectorAll(".modal-img");

images.forEach(img => {
  img.addEventListener("click", () => {
    modalImg.src = img.src;
    modal.style.display = "flex";
  });
});

//click
modal.addEventListener("click", () => {
  modal.style.display = "none";
});

(function initCarousel() {
  const container = document.querySelector(".carousel-container");
  if (!container) return;

  const slides = container.querySelectorAll(".carousel-img");
  const dots = container.querySelectorAll(".dot");
  const prevBtn = container.querySelector(".carousel-prev");
  const nextBtn = container.querySelector(".carousel-next");
  let slideIndex = 0;

  function showSlide(n) {
    const len = slides.length;
    if (!len) return;
    slideIndex = ((n % len) + len) % len;
    slides.forEach((img, i) => img.classList.toggle("active", i === slideIndex));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === slideIndex));
  }

  prevBtn?.addEventListener("click", () => showSlide(slideIndex - 1));
  nextBtn?.addEventListener("click", () => showSlide(slideIndex + 1));
  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => showSlide(i))
  );
})();

(function initSidebarScrollSpy() {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  const links = [...sidebar.querySelectorAll('a[href^="#"]')];
  if (!links.length) return;

  const sections = links
    .map((a) => {
      const id = decodeURIComponent(a.hash.slice(1));
      if (!id) return null;
      const el = document.getElementById(id);
      return el ? { id, el } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  let rafId = 0;

  function setActive(id) {
    links.forEach((a) => {
      const match = decodeURIComponent(a.hash.slice(1)) === id;
      a.classList.toggle("sidebar-link-active", match);
      if (match) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  function update() {
    rafId = 0;
    const docEl = document.documentElement;
    const docBottom = Math.max(docEl.scrollHeight, docEl.clientHeight);
    const scrollY = window.scrollY;
    const scrollBottom = scrollY + window.innerHeight;
    const vh = window.innerHeight;

    const topThreshold = 64;
    const bottomThreshold = 80;

    let activeId = sections[0].id;

    if (scrollY <= topThreshold) {
      activeId = sections[0].id;
    } else if (scrollBottom >= docBottom - bottomThreshold) {
      activeId = sections[sections.length - 1].id;
    } else {
      /* Middle sections: reading line 10% above viewport center (0.5 − 0.1 = 0.4) */
      const line = vh * 0.4;

      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].el.getBoundingClientRect().top <= line) idx = i;
      }

      /* Do not skip the 2nd nav target (e.g. Project Overview): if the 0.4 line
         still leaves us on the first item while the hero is mostly gone and the
         second section is on screen, promote to index 1 */
      if (idx === 0 && sections.length > 1) {
        const r0 = sections[0].el.getBoundingClientRect();
        const r1 = sections[1].el.getBoundingClientRect();
        const secondOnScreen = r1.bottom > 0 && r1.top < vh;
        const heroMostlyGone = r0.bottom <= vh * 0.12;
        const secondEnteredBand = r1.top <= vh * 0.52;
        if (
          scrollY > topThreshold &&
          secondOnScreen &&
          (heroMostlyGone || secondEnteredBand)
        ) {
          idx = 1;
        }
      }

      activeId = sections[idx].id;
    }

    setActive(activeId);
  }

  function onScrollOrResize() {
    if (!rafId) rafId = requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  update();
})();
