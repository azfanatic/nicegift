"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  encodeSharedProfile,
  favoriteGameOptions,
  gifts,
  parseSharedProfile,
  platformOptions,
  type Gift,
  type SharedProfile,
} from "../lib/gifts";

function ProfileHeader() {
  return (
    <header className="shared-profile-header">
      <a aria-label="NiceGift, inicio" className="brand" href="/">
        <span className="brand-mark"><span>n</span></span>
        <span>nicegift<span className="brand-period">.</span></span>
      </a>
      <nav aria-label="Navegación" className="profile-page-nav">
        <a href="/">Inicio</a>
        <a href="/carta">Crear una carta</a>
      </nav>
    </header>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [favoriteGames, setFavoriteGames] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [sharedProfile, setSharedProfile] = useState<SharedProfile | null>(null);
  const [isPublicView, setIsPublicView] = useState(false);
  const [invalidProfileLink, setInvalidProfileLink] = useState(false);

  useEffect(() => {
    const fragmentPrefix = "#perfil/";
    function readProfileLink() {
      if (!window.location.hash.startsWith(fragmentPrefix)) {
        setIsPublicView(false);
        setSharedProfile(null);
        setInvalidProfileLink(false);
        return;
      }

      setIsPublicView(true);
      try {
        const profile = parseSharedProfile(
          window.location.hash.slice(fragmentPrefix.length),
        );
        setSharedProfile(profile);
        setInvalidProfileLink(!profile);
      } catch {
        setSharedProfile(null);
        setInvalidProfileLink(true);
      }
    }

    readProfileLink();
    window.addEventListener("hashchange", readProfileLink);
    return () => window.removeEventListener("hashchange", readProfileLink);
  }, []);

  function updateChoice(value: string, selected: string[], update: (items: string[]) => void) {
    update(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
    setShareUrl("");
    setProfileNotice("");
  }

  function createShareLink() {
    const name = profileName.trim();
    if (!name) {
      setProfileNotice("Escribe un nombre para crear el enlace del perfil.");
      return;
    }

    const profile: SharedProfile = {
      name,
      bio: profileBio.trim(),
      favoriteGames,
      platforms,
      wishlistIds,
    };
    setShareUrl(
      `${window.location.origin}/perfil#perfil/${encodeSharedProfile(profile)}`,
    );
    setProfileNotice("Enlace listo. Cualquier persona que lo tenga podrá ver este perfil.");
  }

  async function copyShareLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setProfileNotice("Enlace copiado. Ya puedes compartirlo.");
    } catch (error) {
      console.error("No se pudo copiar el enlace del perfil.", error);
      setProfileNotice("No se pudo copiar automáticamente. Selecciona el enlace para copiarlo.");
    }
  }

  function prepareGift(gift: Gift, profile: SharedProfile) {
    const params = new URLSearchParams({
      gift: gift.id,
      recipient: profile.name,
    });
    router.push(`/carta?${params.toString()}`);
  }

  if (isPublicView) {
    const profileGifts = sharedProfile
      ? gifts.filter((gift) => sharedProfile.wishlistIds.includes(gift.id))
      : [];

    return (
      <main className="shared-profile-page">
        <ProfileHeader />
        {sharedProfile ? (
          <section aria-labelledby="shared-profile-name" className="shared-profile-card">
            <div className="profile-avatar" aria-hidden="true">
              {sharedProfile.name.slice(0, 1).toUpperCase()}
            </div>
            <span className="eyebrow"><span className="eyebrow-dot" /> ESTE ES SU MUNDO</span>
            <h1 id="shared-profile-name">{sharedProfile.name}</h1>
            {sharedProfile.bio && <p className="profile-bio">{sharedProfile.bio}</p>}

            {sharedProfile.favoriteGames.length > 0 && (
              <section aria-labelledby="profile-games-title" className="shared-profile-interests">
                <h2 id="profile-games-title">Le gusta jugar a</h2>
                <ul className="profile-chips">
                  {sharedProfile.favoriteGames.map((game) => <li key={game}>{game}</li>)}
                </ul>
              </section>
            )}
            {sharedProfile.platforms.length > 0 && (
              <section aria-labelledby="profile-platforms-title" className="shared-profile-interests">
                <h2 id="profile-platforms-title">Juega en</h2>
                <ul className="profile-chips">
                  {sharedProfile.platforms.map((platform) => <li key={platform}>{platform}</li>)}
                </ul>
              </section>
            )}
            <section aria-labelledby="profile-wishlist-title" className="shared-profile-wishlist">
              <h2 id="profile-wishlist-title">Su lista de deseos</h2>
              {profileGifts.length ? (
                <div className="profile-gift-list">
                  {profileGifts.map((gift) => (
                    <article className="profile-gift" key={gift.id}>
                      <span className={`chosen-gift-mark mark-${gift.art}`} aria-hidden="true">{gift.mark}</span>
                      <div><small>{gift.category}</small><strong>{gift.name}</strong></div>
                      <button className="button button-primary" onClick={() => prepareGift(gift, sharedProfile)} type="button">
                        Preparar regalo <span aria-hidden="true">↗</span>
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="profile-empty">Todavía no agregó regalos a su lista.</p>
              )}
            </section>
            <p className="profile-demo-note">Perfil de demostración. El envío y el pago de regalos todavía no están habilitados.</p>
          </section>
        ) : (
          <section aria-live="polite" className="invalid-profile">
            <span className="eyebrow"><span className="eyebrow-dot" /> ENLACE NO DISPONIBLE</span>
            <h1>{invalidProfileLink ? "Este perfil no se pudo abrir." : "Cargando perfil..."}</h1>
            <p>El enlace puede estar incompleto o tener datos que NiceGift no reconoce.</p>
            <a className="button button-primary" href="/">Ir a NiceGift <span aria-hidden="true">↗</span></a>
          </section>
        )}
      </main>
    );
  }

  return (
    <main className="profile-page">
      <ProfileHeader />
      <section aria-labelledby="profile-title" className="profile-section section-wrap">
        <div className="profile-heading">
          <span className="eyebrow"><span className="eyebrow-dot" /> UN PERFIL PARA ACERTAR</span>
          <h1 id="profile-title">Que sepan qué te gusta.<br /><em>Sin tener que agregarte.</em></h1>
          <p>Crea un perfil compartible con tus juegos favoritos y tu lista de deseos. Cualquiera con tu enlace podrá elegirte un regalo.</p>
        </div>
        <div className="profile-builder">
          <div className="profile-editor">
            <label htmlFor="profile-name">¿Cómo te llamas?</label>
            <input id="profile-name" maxLength={40} onChange={(event) => {
              setProfileName(event.target.value);
              setShareUrl("");
              setProfileNotice("");
            }} placeholder="Tu nombre o apodo" value={profileName} />
            <label htmlFor="profile-bio">Cuéntales un poco de ti <span>(opcional)</span></label>
            <textarea id="profile-bio" maxLength={160} onChange={(event) => {
              setProfileBio(event.target.value);
              setShareUrl("");
              setProfileNotice("");
            }} placeholder="Ej. Me gustan las aventuras y descubrir mundos nuevos." rows={3} value={profileBio} />
            <fieldset className="profile-fieldset">
              <legend>¿Qué juegos te gustan?</legend>
              <div className="profile-options">
                {favoriteGameOptions.map((game) => (
                  <label className="profile-option" key={game}>
                    <input checked={favoriteGames.includes(game)} onChange={() => updateChoice(game, favoriteGames, setFavoriteGames)} type="checkbox" />
                    <span>{game}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="profile-fieldset">
              <legend>¿En qué plataformas juegas?</legend>
              <div className="profile-options">
                {platformOptions.map((platform) => (
                  <label className="profile-option" key={platform}>
                    <input checked={platforms.includes(platform)} onChange={() => updateChoice(platform, platforms, setPlatforms)} type="checkbox" />
                    <span>{platform}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="profile-fieldset">
              <legend>¿Qué te gustaría recibir?</legend>
              <div className="profile-options wishlist-options">
                {gifts.map((gift) => (
                  <label className="profile-option" key={gift.id}>
                    <input checked={wishlistIds.includes(gift.id)} onChange={() => updateChoice(gift.id, wishlistIds, setWishlistIds)} type="checkbox" />
                    <span>{gift.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button className="button button-primary profile-share-button" onClick={createShareLink} type="button">
              Crear mi enlace <span aria-hidden="true">↗</span>
            </button>
            {shareUrl && (
              <div className="profile-share-link">
                <label htmlFor="profile-share-url">Tu enlace para compartir</label>
                <div>
                  <input id="profile-share-url" onFocus={(event) => event.currentTarget.select()} readOnly value={shareUrl} />
                  <button className="button button-light" onClick={copyShareLink} type="button">Copiar</button>
                </div>
              </div>
            )}
            <p aria-live="polite" className="profile-notice">{profileNotice}</p>
            <p className="profile-privacy-note">Lo que selecciones aparecerá en el perfil. El enlace contiene esos datos y cualquiera que lo reciba podrá verlos. Esta demo no guarda perfiles ni procesa regalos.</p>
          </div>
          <aside aria-label="Vista previa de tu perfil compartido" className="profile-preview">
            <span className="profile-preview-label">VISTA PREVIA · LO QUE VERÁN</span>
            <div className="profile-avatar" aria-hidden="true">{profileName.trim().slice(0, 1).toUpperCase() || "♡"}</div>
            <h3>{profileName.trim() || "Tu nombre"}</h3>
            <p>{profileBio.trim() || "Una frase para contar un poco de ti."}</p>
            <div className="profile-preview-group">
              <strong>Le gusta jugar a</strong>
              <div className="profile-chips">{favoriteGames.length ? favoriteGames.map((game) => <span key={game}>{game}</span>) : <small>Aún no agregas juegos favoritos.</small>}</div>
            </div>
            <div className="profile-preview-group">
              <strong>Juega en</strong>
              <div className="profile-chips">{platforms.length ? platforms.map((platform) => <span key={platform}>{platform}</span>) : <small>Aún no agregas plataformas.</small>}</div>
            </div>
            <div className="profile-preview-group">
              <strong>Su lista de deseos</strong>
              <ul>{wishlistIds.length ? wishlistIds.map((id) => {
                const gift = gifts.find((item) => item.id === id);
                return gift ? <li key={gift.id}>{gift.name}</li> : null;
              }) : <li>Aún no agregas regalos.</li>}</ul>
            </div>
          </aside>
        </div>
      </section>
      <footer className="site-footer">
        <a className="brand footer-brand" href="/"><span className="brand-mark"><span>n</span></span><span>nicegift<span className="brand-period">.</span></span></a>
        <span>Un regalo que se siente. <span className="footer-heart">♡</span></span>
      </footer>
    </main>
  );
}
