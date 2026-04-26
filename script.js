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
      "section > .section-label, .now__card, .work__item, .wall__card, .client, .build-card, .toolkit__tags, .contact__headline, .contact__lede, .contact__links, .made__copy, .made__panel, .stack__card, .stack__intro, .goods__card, .goods__intro, .rodeo-dive__col, .rodeo-dive__intro"
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

    // ----- Hero duo: click between cards to swap which is on top.
    //       Only the top card's social link is clickable. -----
    document.querySelectorAll(".deck").forEach((deck) => {
      const cards = deck.querySelectorAll(".deck__card");
      // IRL card starts on top
      cards.forEach((card) => {
        if (card.classList.contains("deck__card--irl")) {
          card.classList.add("deck__card--top");
        }
      });
      cards.forEach((card) => {
        card.addEventListener("click", (e) => {
          // If clicking the link on the top card, let it navigate
          if (e.target.closest(".deck__card-link") && card.classList.contains("deck__card--top")) {
            return;
          }
          // Otherwise, swap: bring this card to top
          e.preventDefault();
          cards.forEach((c) => c.classList.remove("deck__card--top"));
          card.classList.add("deck__card--top");
          // Visually promote: top card gets higher z-index
          cards.forEach((c) => {
            c.style.zIndex = c.classList.contains("deck__card--top") ? "5" : "1";
          });
        });
      });
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
  });
})();
