import React from 'react';

// Imágenes del manual
import registroBoton from '../manual/registro-boton.png';
import formularioRegistro from '../manual/formulario-registro.png';
import explorarPagina from '../manual/explorar-pagina.png';

const ManualUsuario = () => {


  return (
    <>
      <style>{`
        /* Fondo general: Degradado de blanco a lavanda muy suave */
        .manual-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffff, #ede9fe);
          padding: 60px 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          font-family: 'Inter', sans-serif;
        }

        /* Tarjeta principal */
        .manual-card {
          background: #ffffff;
          border-radius: 20px;
          /* Sombra con toque de morado */
          box-shadow: 0 12px 30px rgba(91, 33, 182, 0.1); 
          max-width: 900px;
          width: 100%;
          padding: 50px 40px;
          animation: fadeIn 0.8s ease-in-out;
          position: relative;
        }

        .manual-title {
          font-size: 2.3rem;
          font-weight: 800;
          /* Título en Morado Oscuro */
          color: #5b21b6; 
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
          /* Borde en Morado Principal */
          border-left: 6px solid #7c3aed; 
          border-radius: 12px;
          background: #f9f8ff; /* Fondo muy ligero */
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .manual-step:hover {
          transform: translateY(-5px);
          /* Sombra sutil del morado principal */
          box-shadow: 0 5px 20px rgba(124, 58, 237, 0.1); 
        }

        .manual-step h2 {
          /* Subtítulos en Morado Oscuro */
          color: #5b21b6; 
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
          /* Borde sutil */
          border: 1px solid #c4b5fd; 
          box-shadow: 0 3px 10px rgba(91, 33, 182, 0.05);
        }

        /* Sección final */
        .manual-end {
          text-align: center;
          margin-top: 50px;
        }

        .manual-end p {
          /* Texto final en Morado Oscuro */
          color: #5b21b6; 
          font-weight: 600;
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        /* Botón de descarga */
        .manual-btn {
          /* Degradado de Morado Principal a Oscuro */
          background: linear-gradient(90deg, #7c3aed, #5b21b6);
          color: white;
          font-weight: 600;
          padding: 14px 32px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
          font-size: 1rem;
        }

        .manual-btn:hover {
          background: linear-gradient(90deg, #6d28d9, #5b21b6);
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
        }

        /* Footer */
        footer {
          /* Fondo en Morado Oscuro */
          background-color: #5b21b6; 
          color: #e0d7fe;
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
          <h1 className="manual-title">Manual de Usuario </h1>
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
