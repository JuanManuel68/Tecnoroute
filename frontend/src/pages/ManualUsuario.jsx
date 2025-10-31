import React from 'react';

const ManualUsuario = () => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/manual/manual-usuario.pdf';
    link.download = 'Manual-de-Usuario-TecnoRoute.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <style>{`
        /* Fondo general */
        .manual-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #eaf3ff 0%, #ffffff 100%);
          padding: 60px 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        /* Tarjeta central */
        .manual-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 90, 200, 0.1);
          max-width: 900px;
          width: 100%;
          padding: 40px 30px;
          animation: fadeIn 0.8s ease-in-out;
        }

        /* Títulos */
        .manual-title {
          font-size: 2rem;
          font-weight: 700;
          color: #0a3d91;
          text-align: center;
          margin-bottom: 10px;
        }

        .manual-subtitle {
          text-align: center;
          color: #4b5563;
          font-size: 1rem;
          margin-bottom: 30px;
        }

        /* Cada paso */
        .manual-step {
          margin-bottom: 40px;
          padding: 20px;
          border-left: 5px solid #0a3d91;
          border-radius: 10px;
          background: #f9fbff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .manual-step:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 90, 200, 0.1);
        }

        .manual-step h2 {
          color: #0a3d91;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .manual-step p {
          color: #374151;
          margin-bottom: 15px;
          line-height: 1.6;
        }

        .manual-step img {
          display: block;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          border-radius: 10px;
          border: 1px solid #d1e3ff;
          box-shadow: 0 3px 8px rgba(0, 90, 200, 0.08);
        }

        /* Sección final */
        .manual-end {
          text-align: center;
          margin-top: 40px;
        }

        .manual-end p {
          color: #0a3d91;
          font-weight: 500;
          margin-bottom: 20px;
        }

        /* Botón */
        .manual-btn {
          background: linear-gradient(90deg, #0077ff, #0052cc);
          color: white;
          font-weight: 600;
          padding: 12px 28px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 90, 200, 0.2);
        }

        .manual-btn:hover {
          background: linear-gradient(90deg, #0052cc, #003c99);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 90, 200, 0.3);
        }

        /* Animación de aparición */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="manual-container">
        <div className="manual-card">
          <h1 className="manual-title">📘 Manual de Usuario – TecnoRoute</h1>
          <p className="manual-subtitle">
            Aprende cómo registrarte y comenzar a usar la plataforma de forma sencilla y rápida.
          </p>

          {/* Paso 1 */}
          <div className="manual-step">
            <h2>🪪 Paso 1: Accede a la página de registro</h2>
            <p>
              Haz clic en el botón <strong>“Registrarse”</strong> en la parte superior derecha del sitio.
            </p>
            <img src="/manual/registro-boton.png" alt="Botón de registro" />
          </div>

          {/* Paso 2 */}
          <div className="manual-step">
            <h2>✍️ Paso 2: Completa tus datos</h2>
            <p>
              Llena el formulario con tu <strong>nombre, correo electrónico</strong> y una{' '}
              <strong>contraseña segura</strong>.
            </p>
            <img src="/manual/formulario-registro.png" alt="Formulario de registro" />
          </div>

          {/* Paso 3 */}
          <div className="manual-step">
            <h2>📩 Paso 3: Confirma tu registro</h2>
            <p>
              Revisa tu correo y haz clic en el enlace de confirmación para activar tu cuenta.
              Luego podrás iniciar sesión en TecnoRoute.
            </p>
            <img src="/manual/correo-confirmacion.png" alt="Correo de confirmación" />
          </div>

          {/* Paso 4 */}
          <div className="manual-step">
            <h2>🛒 Paso 4: Explora y compra productos</h2>
            <p>
              Una vez dentro, podrás navegar entre los productos, agregarlos al carrito y realizar tus
              compras con facilidad.
            </p>
            <img src="/manual/pagina-productos.png" alt="Página de productos" />
          </div>

          {/* Final */}
          <div className="manual-end">
            <p>🚀 ¡Listo! Ya puedes disfrutar de todos los servicios de TecnoRoute.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManualUsuario;
