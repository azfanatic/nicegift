"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { categories, gifts } from "./lib/gifts";
import type { Gift } from "./lib/gifts";

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 32 32"
    >
      <path
        d="M16 2.5 19.4 12.6 29.5 16l-10.1 3.4L16 29.5l-3.4-10.1L2.5 16l10.1-3.4L16 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const mainRef = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todo");

  const visibleGifts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return gifts.filter((gift) => {
      const matchesCategory =
        category === "Todo" || gift.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${gift.name} ${gift.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  useEffect(() => {
    if (window.location.hash.startsWith("#perfil/")) {
      window.location.replace(`/perfil${window.location.hash}`);
    }
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (
      !main ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    main.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );

    main.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      if (!element.classList.contains("is-visible")) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [visibleGifts]);

  function chooseGift(gift: Gift) {
    router.push(`/carta?gift=${encodeURIComponent(gift.id)}`);
  }

  return (
    <main ref={mainRef}>
      <div className="announcement">
        <span className="announcement-sparkle">✳</span>
        El detalle está en cómo lo regalas
        <a href="/carta">Personaliza una carta NiceGift <span aria-hidden="true">↗</span></a>
      </div>

      <header className="site-header">
        <a aria-label="NiceGift, inicio" className="brand" href="#">
          <span className="brand-mark">
            <span>n</span>
            <Sparkle className="brand-sparkle" />
          </span>
          <span>nicegift<span className="brand-period">.</span></span>
        </a>
        <nav aria-label="Navegación principal" className="main-nav">
          <a href="#catalogo">Explorar regalos</a>
          <a href="/perfil">Mi perfil</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="/carta">La carta</a>
        </nav>
        <a className="header-cta" href="#catalogo">
          Encuentra un regalo <span aria-hidden="true">↗</span>
        </a>
        <a aria-label="Crear mi perfil" className="mobile-profile-link" href="/perfil">
          Mi perfil
        </a>
        <a aria-label="Explorar regalos" className="mobile-search-link" href="#catalogo">
          <span aria-hidden="true">⌕</span>
        </a>
      </header>

      <section aria-labelledby="hero-title" className="hero">
        <div aria-hidden="true" className="hero-orbit orbit-one" />
        <div aria-hidden="true" className="hero-orbit orbit-two" />
        <div className="hero-copy" data-reveal>
          <span className="eyebrow"><span className="eyebrow-dot" /> REGALOS DIGITALES, CON MÁS CORAZÓN</span>
          <h1 id="hero-title">
            Un código.
            <br />
            <span>Una carta.</span>
            <br />
            Un recuerdo.
          </h1>
          <p>
            Elige eso que le va a encantar. Nosotros lo convertimos en una
            carta digital personalizada, lista para emocionar.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#catalogo">
              Encuentra su regalo <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="/carta">
              Personaliza la carta <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-proof">
            <div aria-hidden="true" className="avatar-stack">
              <span>🌼</span><span>🎧</span><span>🧸</span>
            </div>
            <span>Un pequeño detalle, <strong>un gran momento.</strong></span>
          </div>
        </div>

        <div aria-label="Vista previa de una carta NiceGift" className="hero-art" data-reveal>
          <div className="hero-note note-left"><span>para ti</span><span>✳</span></div>
          <div className="hero-note note-right">just because ♡</div>
          <div className="hero-card-back" />
          <div className="hero-card">
            <div className="hero-card-top">
              <span className="tiny-logo"><span>n</span>.</span>
              <span className="card-edition">A LITTLE SOMETHING</span>
            </div>
            <div className="hero-gift-art">
              <div className="gift-orb orb-pink" />
              <div className="gift-orb orb-yellow" />
              <div className="gift-box">
                <span className="gift-ribbon ribbon-vertical" />
                <span className="gift-ribbon ribbon-horizontal" />
                <span className="gift-bow bow-left" />
                <span className="gift-bow bow-right" />
              </div>
              <Sparkle className="art-sparkle sparkle-top" />
              <Sparkle className="art-sparkle sparkle-bottom" />
            </div>
            <div className="hero-card-bottom">
              <span>ABRE ALGO BONITO</span>
              <strong>Hecho para ti <span>♡</span></strong>
            </div>
          </div>
          <div className="floating-sticker sticker-top"><span>un regalo</span><strong>con intención ✳</strong></div>
          <div className="floating-sticker sticker-bottom"><span>REPRODUCE LA SORPRESA</span><strong>Tu código, en su interior <span>↗</span></strong></div>
          <span aria-hidden="true" className="art-doodle">✳</span>
        </div>
        <div className="hero-bottom-note"><span>SCROLL PARA DESCUBRIR</span><span className="scroll-line" /></div>
      </section>

      <section aria-label="Lo que hace especial a NiceGift" className="value-strip">
        <div data-reveal><span className="value-icon">✳</span><span>No es solo un código, <strong>es su momento.</strong></span></div>
        <div data-reveal><span className="value-icon">♡</span><span>Tu mensaje. Tu estilo. <strong>Tu sorpresa.</strong></span></div>
        <div data-reveal><span className="value-icon">↗</span><span>Digital, instantáneo <strong>y personal.</strong></span></div>
      </section>

      <section aria-labelledby="catalog-title" className="catalog section-wrap" id="catalogo">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" /> EL REGALO PERFECTO EMPIEZA AQUÍ</span>
            <h2 id="catalog-title">Para cada tipo de <em>“pensé en ti”.</em></h2>
          </div>
          <p>Juegos, música, suscripciones y más.<br />Elige lo que le hace feliz.</p>
        </div>
        <div className="catalog-controls" data-reveal>
          <div aria-label="Filtrar regalos por categoría" className="category-tabs">
            {categories.map((item) => (
              <button
                aria-pressed={category === item}
                className={category === item ? "category-tab active" : "category-tab"}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <span className="visually-hidden">Buscar regalos</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca su próximo favorito"
              type="search"
              value={query}
            />
            <kbd>⌘ K</kbd>
          </label>
        </div>
        <div className="product-grid">
          {visibleGifts.map((gift, index) => (
            <article
              className="product-card"
              data-reveal
              key={gift.id}
              style={{ transitionDelay: `${index * 55}ms` }}
            >
              <div className={`product-art art-${gift.art}`}>
                <span className="product-badge">{gift.badge}</span>
                <span aria-hidden="true" className="product-mark">{gift.mark}</span>
                <span aria-hidden="true" className="product-deco product-deco-one" />
                <span aria-hidden="true" className="product-deco product-deco-two" />
                <span aria-hidden="true" className="product-sparkle">✳</span>
                <span className="art-caption">{gift.category} · DIGITAL</span>
              </div>
              <div className="product-info">
                <div>
                  <span className="product-category">{gift.category}</span>
                  <h3>{gift.name}</h3>
                </div>
                <div className="product-price">
                  <strong>{gift.price}</strong>
                  {gift.oldPrice && <del>{gift.oldPrice}</del>}
                </div>
              </div>
              <button className="choose-gift" onClick={() => chooseGift(gift)} type="button">
                Elegir este regalo <span aria-hidden="true">↗</span>
              </button>
            </article>
          ))}
          {visibleGifts.length === 0 && (
            <p className="empty-state">No encontramos ese regalo. Prueba con otra búsqueda.</p>
          )}
        </div>
        <p className="catalog-footnote">* Productos de muestra para explorar la experiencia NiceGift.</p>
      </section>

      <section aria-labelledby="how-title" className="how-section" id="como-funciona">
        <div className="how-inner section-wrap">
          <div className="how-intro" data-reveal>
            <span className="eyebrow"><span className="eyebrow-dot" /> FÁCIL DE ENVIAR. BONITO DE RECIBIR.</span>
            <h2 id="how-title">Tres pasos.<br /><em>Una sonrisa.</em></h2>
            <p>El regalo llega en segundos. La emoción dura mucho más.</p>
            <a className="button button-light" href="#catalogo">Empezar a elegir <span aria-hidden="true">↗</span></a>
          </div>
          <div className="steps">
            <article className="step" data-reveal>
              <span className="step-number">01</span>
              <span aria-hidden="true" className="step-icon">✳</span>
              <h3>Elige su favorito</h3>
              <p>Encuentra una tarjeta digital o un código para eso que le encanta.</p>
            </article>
            <article className="step" data-reveal>
              <span className="step-number">02</span>
              <span aria-hidden="true" className="step-icon">✎</span>
              <h3>Escribe desde el corazón</h3>
              <p>Añade su nombre y un mensaje que haga que la sorpresa sea suya.</p>
            </article>
            <article className="step" data-reveal>
              <span className="step-number">03</span>
              <span aria-hidden="true" className="step-icon">♡</span>
              <h3>Envía algo memorable</h3>
              <p>Tu carta se abre con una animación. El código espera adentro.</p>
            </article>
          </div>
        </div>
      </section>

      <section aria-label="Invitación final" className="closing">
        <Sparkle className="closing-sparkle" />
        <span className="eyebrow" data-reveal><span className="eyebrow-dot" /> HAZ QUE SU DÍA SEA UN POQUITO MÁS BONITO</span>
        <h2 data-reveal>Algunas cosas<br />se sienten mejor <em>regaladas.</em></h2>
        <a className="button button-light" data-reveal href="#catalogo">Encuentra su regalo <span aria-hidden="true">↗</span></a>
        <span aria-hidden="true" className="closing-heart">♡</span>
      </section>

      <footer className="site-footer">
        <a aria-label="NiceGift, inicio" className="brand footer-brand" href="#">
          <span className="brand-mark"><span>n</span><Sparkle className="brand-sparkle" /></span>
          <span>nicegift<span className="brand-period">.</span></span>
        </a>
        <span>Un regalo que se siente. <span className="footer-heart">♡</span></span>
        <div className="footer-links"><a href="#catalogo">Regalos</a><a href="#como-funciona">Cómo funciona</a><a href="/perfil">Mi perfil</a><a href="/carta">Crear una carta</a></div>
        <span className="copyright">© 2026 NiceGift · Hecho con cariño</span>
      </footer>
    </main>
  );
}
