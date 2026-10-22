import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Confidencialidad — NiceGift",
  description:
    "Conoce qué información utiliza la demo de NiceGift y cómo se comparte tu perfil.",
};

export default function ConfidentialityPage() {
  return (
    <main className="shared-profile-page confidentiality-page">
      <header className="shared-profile-header">
        <a aria-label="NiceGift, inicio" className="brand" href="/">
          <span className="brand-mark"><span>n</span></span>
          <span>nicegift<span className="brand-period">.</span></span>
        </a>
        <nav aria-label="Navegación" className="profile-page-nav">
          <a href="/">Inicio</a>
          <a href="/perfil">Mi perfil</a>
          <a href="/carta">Crear una carta</a>
        </nav>
      </header>

      <article aria-labelledby="confidentiality-title" className="confidentiality-content">
        <span className="eyebrow"><span className="eyebrow-dot" /> TU INFORMACIÓN, EN TUS MANOS</span>
        <h1 id="confidentiality-title">Aviso de <em>Confidencialidad</em></h1>
        <p className="confidentiality-intro">
          Este aviso describe cómo funciona la versión actual de NiceGift, una
          demo para crear perfiles compartibles y personalizar cartas digitales.
        </p>

        <section>
          <h2>Información que escribes</h2>
          <p>
            Al crear un perfil puedes añadir tu nombre, una biografía, juegos
            favoritos, plataformas y regalos a tu lista de deseos. En el
            personalizador de cartas puedes escribir nombres y un mensaje, y
            elegir el diseño y el regalo que aparecen en la vista previa.
          </p>
        </section>

        <section>
          <h2>Perfiles y enlaces compartidos</h2>
          <p>
            Cuando creas un enlace de perfil, esos datos se codifican dentro
            del propio enlace. Cualquier persona que tenga el enlace puede
            abrirlo y ver el perfil. Compártelo solo con quien quieras y no
            incluyas información sensible o que no quieras hacer pública.
          </p>
        </section>

        <section>
          <h2>Almacenamiento y funcionamiento</h2>
          <p>
            La demo no tiene cuentas ni una base de datos para guardar perfiles.
            La información que escribes se utiliza en el navegador para mostrar
            la vista previa; el perfil compartido se conserva en el enlace que
            decides copiar. Si cierras o recargas la página, los datos que no
            estén en ese enlace pueden perderse.
          </p>
        </section>

        <section>
          <h2>Regalos y pagos</h2>
          <p>
            Los regalos y proveedores que aparecen son ejemplos de esta demo.
            NiceGift no vende ni procesa regalos, códigos, pagos o pedidos desde
            estas pantallas.
          </p>
        </section>

        <section>
          <h2>Cómo proteger tu información</h2>
          <p>
            Puedes decidir qué datos añadir y con quién compartir tu enlace.
            Evita información privada, no compartas el enlace si ya no quieres
            que otras personas vean el perfil y ten presente que cualquier
            persona que lo haya recibido podría haberlo guardado.
          </p>
        </section>
      </article>

      <footer className="site-footer confidentiality-footer">
        <a className="brand footer-brand" href="/">
          <span className="brand-mark"><span>n</span></span>
          <span>nicegift<span className="brand-period">.</span></span>
        </a>
        <span>Un regalo que se siente. <span className="footer-heart">♡</span></span>
        <a className="letter-back-link" href="/">Volver al inicio</a>
      </footer>
    </main>
  );
}
