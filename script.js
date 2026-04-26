/* ==========================================================================
   Portfolio interactions
   - Scroll reveal for sections
   - Active-link highlight in the top nav
   - Small, no-dependency: vanilla JS + IntersectionObserver
   ========================================================================== */

(() => {
  const onReady = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn);

  onReady(() => {
    // ----- Scroll reveal -----
    const revealTargets = document.querySelectorAll(
      "section > .section-label, .now__card, .work__item, .wall__card, .client, .build-card, .toolkit__tags, .contact__headline, .contact__lede, .contact__links, .made__copy, .made__panel, .stack__card, .stack__intro, .goods__card, .goods__intro, .goods__hero, .rodeo-dive__col, .rodeo-dive__intro"
    );
    revealTargets.forEach((el) => el.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));

    // ----- Active nav link on scroll -----
    const navLinks = document.querySelectorAll(".nav__links a");
    const sectionMap = new Map();
    navLinks.forEach((link) => {
      const id = link.getAttribute("href").replace("#", "");
      const section = document.getElementById(id);
      if (section) sectionMap.set(section, link);
    });

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = sectionMap.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.style.opacity = "");
            link.style.opacity = "1";
            link.style.color = "var(--cream-bright)";
          } else {
            link.style.color = "";
          }
        });
      },
      { threshold: 0.35 }
    );
    sectionMap.forEach((_link, section) => activeObserver.observe(section));

    // ----- Smooth hover tilt on now cards (very subtle) -----
    const tiltCards = document.querySelectorAll(".now__card, .build-card");
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${(-y * 2).toFixed(2)}deg) rotateY(${(x * 2).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });

    // ----- Hero duo: click to swap which card is on top.
    //       Only the top card's platform-name link is clickable.
    //       Clicking anywhere on the card image area just swaps. -----
    document.querySelectorAll(".deck").forEach((deck) => {
      const cards = deck.querySelectorAll(".deck__card");
      // IRL card starts on top
      cards.forEach((card) => {
        if (card.classList.contains("deck__card--irl")) {
          card.classList.add("deck__card--top");
        }
      });

      // Intercept ALL link clicks — only allow on the top card's link
      deck.addEventListener("click", (e) => {
        const link = e.target.closest(".deck__card-link");
        const card = e.target.closest(".deck__card");
        if (!card) return;

        // If clicking the link text on the TOP card, let it navigate
        if (link && card.classList.contains("deck__card--top")) {
          return; // allow default navigation
        }

        // Block link navigation in all other cases
        if (link) {
          e.preventDefault();
          e.stopPropagation();
        }

        // If this card is already on top, do nothing (no accidental swap)
        if (card.classList.contains("deck__card--top")) {
          e.preventDefault();
          return;
        }

        // Swap: bring the clicked (non-top) card to top
        e.preventDefault();
        cards.forEach((c) => c.classList.remove("deck__card--top"));
        card.classList.add("deck__card--top");
        cards.forEach((c) => {
          c.style.zIndex = c.classList.contains("deck__card--top") ? "5" : "1";
        });
      });
    });

    // ----- Goods carousels (prev/next/dots/swipe) -----
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const slides = carousel.querySelectorAll(".goods__carousel-slide");
      const dotsContainer = carousel.querySelector(".goods__carousel-dots");
      const prevBtn = carousel.querySelector(".goods__carousel-btn--prev");
      const nextBtn = carousel.querySelector(".goods__carousel-btn--next");
      let current = 0;
      let autoTimer = null;

      // Build dots
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "goods__carousel-dot" + (i === 0 ? " goods__carousel-dot--active" : "");
        dot.setAttribute("aria-label", `Image ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
      });
      const dots = dotsContainer.querySelectorAll(".goods__carousel-dot");

      function goTo(i) {
        slides[current].classList.remove("goods__carousel-slide--active");
        dots[current].classList.remove("goods__carousel-dot--active");
        current = ((i % slides.length) + slides.length) % slides.length;
        slides[current].classList.add("goods__carousel-slide--active");
        dots[current].classList.add("goods__carousel-dot--active");
        resetAuto();
      }

      prevBtn.addEventListener("click", (e) => { e.stopPropagation(); goTo(current - 1); });
      nextBtn.addEventListener("click", (e) => { e.stopPropagation(); goTo(current + 1); });

      // Swipe support
      let startX = 0;
      carousel.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
      carousel.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
      });

      // Auto-advance every 4s, pause on hover
      function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 4000);
      }
      carousel.addEventListener("mouseenter", () => clearInterval(autoTimer));
      carousel.addEventListener("mouseleave", resetAuto);
      resetAuto();
    });

    // ----- Console easter egg -----
    const styles = [
      "background: #3D6B4F",
      "color: #F7F1E1",
      "padding: 8px 12px",
      "border-radius: 4px",
      "font-family: 'JetBrains Mono', monospace",
      "font-size: 13px",
    ].join(";");
    // eslint-disable-next-line no-console
    console.log("%cgm — @AtownBrown on X, @atown on Farcaster. say hi.", styles);

    /* ── Emerge lightbox ── */
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    if (lightbox && lightboxImg) {
      const triggers = document.querySelectorAll(".emerge-dive__lightbox-trigger");

      function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || "";
        // Force layout before adding class so the transition plays
        void lightbox.offsetWidth;
        lightbox.classList.add("lightbox--open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }

      function closeLightbox() {
        lightbox.classList.remove("lightbox--open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }

      triggers.forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          var src = trigger.getAttribute("data-full") || trigger.querySelector("img").src;
          var alt = trigger.querySelector("img").alt;
          openLightbox(src, alt);
        });
      });

      lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);

      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && lightbox.classList.contains("lightbox--open")) {
          closeLightbox();
        }
      });
    }
  });
})();
