"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { giftVendors, gifts } from "../lib/gifts";

const themes = [
  { id: "menta", name: "Menta", color: "#cfe1d6" },
  { id: "durazno", name: "Durazno", color: "#f3d4bf" },
  { id: "lavanda", name: "Lavanda", color: "#ddd5ea" },
  { id: "limon", name: "Limón", color: "#e8e3b7" },
];

const letterStyles = [
  { id: "serif", name: "Editorial" },
  { id: "handwritten", name: "Manuscrita" },
  { id: "sans", name: "Minimal" },
];

const animations = [
  { id: "slide", name: "Deslizar", description: "La nota sale del sobre." },
  { id: "pop", name: "Saltar", description: "La nota aparece con un rebote." },
  { id: "fade", name: "Desvanecer", description: "La nota aparece suavemente." },
  { id: "bounce", name: "Flotar", description: "La nota sube y queda flotando." },
];

export default function LetterPage() {
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("Ojalá esto te saque una sonrisa. ¡Te lo mereces!");
  const [selectedGiftId, setSelectedGiftId] = useState(gifts[0].id);
  const [selectedVendorId, setSelectedVendorId] = useState(giftVendors[gifts[0].id][0].id);
  const [theme, setTheme] = useState("menta");
  const [letterStyle, setLetterStyle] = useState("handwritten");
  const [animation, setAnimation] = useState("slide");
  const [isOpen, setIsOpen] = useState(false);

  const selectedGift = gifts.find((gift) => gift.id === selectedGiftId) ?? gifts[0];
  const vendors = giftVendors[selectedGift.id];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const giftId = params.get("gift");
    const initialRecipient = params.get("recipient");
    if (giftId && gifts.some((gift) => gift.id === giftId)) {
      setSelectedGiftId(giftId);
    }
    if (initialRecipient) {
      setRecipient(initialRecipient.slice(0, 32));
    }
  }, []);

  function updateDesign(update: () => void) {
    update();
    setIsOpen(false);
  }

  return (
    <main className="letter-page">
      <header className="shared-profile-header">
        <a aria-label="NiceGift, inicio" className="brand" href="/">
          <span className="brand-mark"><span>n</span></span>
          <span>nicegift<span className="brand-period">.</span></span>
        </a>
        <nav aria-label="Navegación" className="profile-page-nav">
          <a href="/">Explorar regalos</a>
          <a href="/perfil">Mi perfil</a>
        </nav>
      </header>

      <section aria-labelledby="letter-page-title" className="letter-page-section">
        <div className="letter-page-heading">
          <span className="eyebrow"><span className="eyebrow-dot" /> UN DETALLE HECHO A TU MANERA</span>
          <h1 id="letter-page-title">Una nota que se siente <em>tuya.</em></h1>
          <p>Escribe el mensaje, elige el papel y decide cómo quieres que aparezca la sorpresa.</p>
        </div>

        <div className="letter-studio">
          <section aria-label="Personaliza tu carta" className="letter-studio-controls">
            <div className="form-heading">
              <span className="form-step">PERSONALIZA · 01</span>
              <span className="form-heart">♡</span>
            </div>
            <label htmlFor="recipient">¿Para quién es?</label>
            <input id="recipient" maxLength={32} onChange={(event) => {
              setRecipient(event.target.value);
              setIsOpen(false);
            }} placeholder="Su nombre" value={recipient} />
            <label htmlFor="sender">¿De parte de quién? <span>(opcional)</span></label>
            <input id="sender" maxLength={32} onChange={(event) => {
              setSender(event.target.value);
              setIsOpen(false);
            }} placeholder="Tu nombre o apodo" value={sender} />
            <label htmlFor="message">Tu mensaje</label>
            <textarea id="message" maxLength={180} onChange={(event) => {
              setMessage(event.target.value);
              setIsOpen(false);
            }} rows={4} value={message} />
            <div className="message-count">{message.length}/180</div>

            <label htmlFor="letter-gift">El regalo</label>
            <select id="letter-gift" onChange={(event) => {
              const giftId = event.target.value;
              setSelectedGiftId(giftId);
              setSelectedVendorId(giftVendors[giftId][0].id);
              setIsOpen(false);
            }} value={selectedGiftId}>
              {gifts.map((gift) => <option key={gift.id} value={gift.id}>{gift.name}</option>)}
            </select>

            <fieldset aria-label="Vendedores disponibles para el regalo" className="vendor-options">
              <legend>Ofertas en Eneba</legend>
              {vendors.map((vendor) => (
                <label className="vendor-option" key={vendor.id}>
                  <input
                    checked={selectedVendorId === vendor.id}
                    name="gift-vendor"
                    onChange={() => setSelectedVendorId(vendor.id)}
                    type="radio"
                  />
                  <span className="vendor-option-details">
                    <strong>{vendor.seller}</strong>
                    <small>Proveedor independiente · Código digital</small>
                  </span>
                  <span className="vendor-price">{vendor.price}</span>
                </label>
              ))}
              <p className="vendor-demo-note">Eneba y sus ofertas no están conectados en vivo. Proveedores y precios mostrados como ejemplo; la compra no está habilitada.</p>
            </fieldset>

            <fieldset className="letter-choice-group">
              <legend>Elige el papel</legend>
              <div className="theme-swatches">
                {themes.map((item) => (
                  <button
                    aria-label={item.name}
                    aria-pressed={theme === item.id}
                    className={`theme-swatch ${theme === item.id ? "selected" : ""}`}
                    key={item.id}
                    onClick={() => updateDesign(() => setTheme(item.id))}
                    style={{ "--swatch-color": item.color } as CSSProperties}
                    type="button"
                  >
                    <span>{theme === item.id ? "✓" : ""}</span>
                    <small>{item.name}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="letter-choice-group">
              <legend>Estilo de letra</legend>
              <div className="letter-style-options">
                {letterStyles.map((item) => (
                  <button
                    aria-pressed={letterStyle === item.id}
                    className={`letter-style-option style-sample-${item.id} ${letterStyle === item.id ? "selected" : ""}`}
                    key={item.id}
                    onClick={() => updateDesign(() => setLetterStyle(item.id))}
                    type="button"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="letter-choice-group">
              <legend>Animación al abrir</legend>
              <div className="animation-options">
                {animations.map((item) => (
                  <button
                    aria-pressed={animation === item.id}
                    className={`animation-option ${animation === item.id ? "selected" : ""}`}
                    key={item.id}
                    onClick={() => updateDesign(() => setAnimation(item.id))}
                    type="button"
                  >
                    <strong>{item.name}</strong>
                    <span>{item.description}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <button className="button button-primary letter-submit" onClick={() => setIsOpen((current) => !current)} type="button">
              {isOpen ? "Cerrar la nota" : "Probar la animación"} <span aria-hidden="true">{isOpen ? "↻" : "↗"}</span>
            </button>
            <a className="letter-back-link" href="/#catalogo">← Volver al catálogo</a>
            <p className="demo-note">Vista previa · Los códigos de esta demo no son canjeables</p>
          </section>

          <section aria-label="Vista previa interactiva" className={`letter-preview theme-${theme}`}>
            <div aria-hidden="true" className="preview-confetti confetti-one">✳</div>
            <div aria-hidden="true" className="preview-confetti confetti-two">✦</div>
            <div aria-hidden="true" className="preview-confetti confetti-three">♡</div>
            <span className="preview-label">UNA PEQUEÑA SORPRESA PARA</span>
            <div className={`envelope animation-${animation} ${isOpen ? "is-open" : ""}`}>
              <div className={`envelope-letter letter-style-${letterStyle}`}>
                <span className="letter-kicker">HECHO CON CARIÑO</span>
                <span aria-hidden="true" className="letter-flower">✿</span>
                <strong className="letter-to">Para {recipient.trim() || "alguien especial"}</strong>
                <p className="letter-message">{message || "Tu mensaje aparecerá aquí..."}</p>
                <span className="letter-from">{sender.trim() ? `CON CARIÑO, ${sender.trim()}` : "CON CARIÑO, ALGUIEN QUE TE QUIERE ♡"}</span>
                <span className="letter-code-label">TU CÓDIGO DE REGALO</span>
                <span className="letter-code">XXXX · XXXX · XXXX</span>
                <span className="letter-gift-name">{selectedGift.name}</span>
              </div>
              <div aria-hidden="true" className="envelope-pocket" />
              <div aria-hidden="true" className="envelope-flap" />
              <span aria-hidden="true" className="envelope-seal">n<span>.</span></span>
            </div>
            <span className="preview-hint">{isOpen ? "UN MOMENTO HECHO PARA TI ♡" : "TU NOTA CAMBIA EN TIEMPO REAL"}</span>
          </section>
        </div>
      </section>
      <footer className="site-footer">
        <a className="brand footer-brand" href="/"><span className="brand-mark"><span>n</span></span><span>nicegift<span className="brand-period">.</span></span></a>
        <span>Un regalo que se siente. <span className="footer-heart">♡</span></span>
        <a className="letter-back-link" href="/perfil">Crear mi perfil</a>
      </footer>
    </main>
  );
}
