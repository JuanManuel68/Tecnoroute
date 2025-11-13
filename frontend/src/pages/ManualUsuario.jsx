import React, { useState } from 'react';

// Imágenes del manual
import registroBoton from '../manual/registro-boton.png';
import formularioRegistro from '../manual/formulario-registro.png';
import explorarPagina from '../manual/explorar-pagina.png';

const ManualUsuario = () => {
  const [bgPos, setBgPos] = useState(50); // posición vertical del fondo

  const handleMouseMove = (e) => {
    const y = e.clientY / window.innerHeight; // 0 a 1 según posición del mouse
    setBgPos(20 + y * 60); // mueve el fondo entre 20% y 80%
  };

  return (
    <>
      <style>{`
        /* Fondo general */
        .manual-container {
          min-height: 100vh;
          padding: 60px 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          font-family: 'Inter', sans-serif;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          position: relative;
          overflow: hidden;
          transition: background-position 0.3s ease-out;
        }

        /* Degradado superpuesto */
        .manual-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 102, 255, 0.7), rgba(0, 68, 204, 0.7), rgba(0, 43, 128, 0.7));
          z-index: 0;
        }

        /* Tarjeta principal */
        .manual-card {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          max-width: 900px;
          width: 100%;
          padding: 50px 40px;
          animation: fadeIn 0.8s ease-in-out;
          position: relative;
          z-index: 1; /* para estar sobre el fondo */
        }

        .manual-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: #002b80;
          text-align: center;
          margin-bottom: 12px;
        }

        .manual-subtitle {
          text-align: center;
          color: #4b5563;
          font-size: 1.1rem;
          margin-bottom: 40px;
        }

        .manual-step {
          margin-bottom: 45px;
          padding: 25px;
          border-left: 6px solid #0066ff;
          border-radius: 12px;
          background: #f3f7ff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .manual-step:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0, 102, 255, 0.2);
        }

        .manual-step h2 {
          color: #002b80;
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
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .manual-end {
          text-align: center;
          margin-top: 50px;
        }

        .manual-end p {
          color: #002b80;
          font-weight: 600;
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        footer {
          background-color: #002b80;
          color: #c7d2fe;
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

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="manual-container"
        onMouseMove={handleMouseMove}
        style={{
          backgroundImage: `
            url('https://eldiariony.com/wp-content/uploads/sites/2/2024/12/16-electrodomesticos-de-tu-hogar-que-hacen-que-tu-factura-de-electricidad-sea-cara-shutterstock_2473408983.jpg?fit=1316,740&crop=0px,0px,1316px,740px')
          `,
          backgroundPosition: `center ${bgPos}%`,
        }}
      >
        <div className="manual-card">
          <h1 className="manual-title">Manual de Usuario</h1>
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

          <footer>
            © {new Date().getFullYear()} <span>TecnoRoute</span>. Todos los derechos reservados.
          </footer>
        </div>
      </div>
    </>
  );
};

export default ManualUsuario;