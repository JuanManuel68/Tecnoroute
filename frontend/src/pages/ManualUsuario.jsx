import React from 'react';

// Imágenes del manual
import registroBoton from '../manual/registro-boton.png';
import formularioRegistro from '../manual/formulario-registro.png';
import explorarPagina from '../manual/explorar-pagina.png';

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
          background: linear-gradient(135deg, #e3f2fd, #bbdefb, #e8f0fe);
          padding: 60px 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        /* Tarjeta principal */
        .manual-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 12px 30px rgba(0, 90, 200, 0.15);
          max-width: 900px;
          width: 100%;
          padding: 50px 40px;
          animation: fadeIn 0.8s ease-in-out;
          position: relative;
        }

        .manual-title {
          font-size: 2.3rem;
          font-weight: 800;
          color: #0a3d91;
          text-align: center;
          margin-bottom: 12px;
        }

        .manual-subtitle {
          text-align: center;
          color: #4b5563;
          font-size: 1.1rem;
          margin-bottom: 40px;
        }

        /* Pasos */
        .manual-step {
          margin-bottom: 45px;
          padding: 25px;
          border-left: 6px solid #1976d2;
          border-radius: 12px;
          background: #f9fbff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .manual-step:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(25, 118, 210, 0.1);
        }

        .manual-step h2 {
          color: #0a3d91;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .manual-step p {
          color: #374151;
          margin-bottom: 15px;
          line-height: 1.7;
        }

        .manual-step img {
          display: block;
          width: 100%;
          max-width: 600px;
          margin: 15px auto 0;
          border-radius: 10px;
          border: 1px solid #d1e3ff;
          box-shadow: 0 3px 10px rgba(0, 90, 200, 0.08);
        }

        /* Sección final */
        .manual-end {
          text-align: center;
          margin-top: 50px;
        }

        .manual-end p {
          color: #0a3d91;
          font-weight: 600;
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        /* Botón de descarga */
        .manual-btn {
          background: linear-gradient(90deg, #1976d2, #0d47a1);
          color: white;
          font-weight: 600;
          padding: 14px 32px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 90, 200, 0.2);
          font-size: 1rem;
        }

        .manual-btn:hover {
          background: linear-gradient(90deg, #1565c0, #0d47a1);
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 90, 200, 0.3);
        }

        /* Footer */
        footer {
          background-color: #0d47a1;
          color: #e3f2fd;
          padding: 20px;
          border-radius: 0 0 20px 20px;
          text-align: center;
          margin-top: 40px;
          font-size: 0.9rem;
        }

        footer span {
          color: #ffffff;
          font-weight: 700;
        }

        /* Animación */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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
              Haz clic en el botón <strong>“Registrarse”</strong> en la parte superior derecha del sitio o en el centro de la página de inicio.
            </p>
            <img src={registroBoton} alt="Botón de registro" />
          </div>

          {/* Paso 2 */}
          <div className="manual-step">
            <h2>✍️ Paso 2: Completa tus datos</h2>
            <p>
              Llena el formulario con tu <strong>nombre</strong>, <strong>correo electrónico</strong> y una <strong>contraseña segura</strong>.
            </p>
            <img src={formularioRegistro} alt="Formulario de registro" />
          </div>

          {/* Paso 3 */}
          <div className="manual-step">
            <h2>📩 Paso 3: Redirección a la página de productos</h2>
            <p>
              Una vez registrado, serás redirigido automáticamente a la página de productos para que puedas empezar a explorar.
            </p>
            <img src={explorarPagina} alt="Explorar página" />
          </div>

          {/* Final */}
          <div className="manual-end">
            <p>🚀 ¡Listo! Ya puedes disfrutar de todos los servicios de <strong>TecnoRoute</strong>.</p>

          </div>

          {/* Footer */}
          <footer>
            © {new Date().getFullYear()} <span>TecnoRoute</span>. Todos los derechos reservados.
          </footer>
        </div>
      </div>
    </>
  );
};

export default ManualUsuario;
