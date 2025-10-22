import { db } from "../server/db.js";
import { templates } from "../shared/schema.js";

async function seedTemplates() {
  console.log("🌱 Seeding templates...");

  const sampleTemplates = [
    {
      clientId: 1,
      name: "Newsletter Semanal",
      description: "Plantilla moderna y elegante para newsletters semanales con secciones destacadas",
      type: "Email",
      category: "Newsletter",
      subject: "{{empresa}} - Novedades de esta semana 📧",
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Hola {{nombre}}! 👋</h1>
          <p>Aquí tienes las novedades más importantes de esta semana:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937;">Destacado de la semana</h2>
            <p>Contenido destacado aquí...</p>
          </div>
          <p>Saludos,<br><strong>{{empresa}}</strong></p>
        </div>
      `,
      variables: JSON.stringify(["nombre", "empresa"]),
      thumbnail: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=400",
      status: "Activa",
      timesUsed: 1234,
    },
    {
      clientId: 1,
      name: "Promoción Flash",
      description: "Email promocional con diseño atractivo y llamada a la acción destacada",
      type: "Email",
      category: "Promocional",
      subject: "⚡ ¡Oferta Flash! Hasta 50% de descuento",
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; color: white;">
            <h1 style="margin: 0; font-size: 36px;">¡OFERTA FLASH!</h1>
            <p style="font-size: 24px; margin: 20px 0;">Hasta 50% OFF</p>
            <p>Solo por tiempo limitado</p>
          </div>
          <div style="padding: 40px;">
            <p>Hola {{nombre}},</p>
            <p>No te pierdas nuestras ofertas especiales. ¡Termina pronto!</p>
            <a href="#" style="display: inline-block; background: #6366f1; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Ver Ofertas
            </a>
          </div>
        </div>
      `,
      variables: JSON.stringify(["nombre"]),
      thumbnail: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400",
      status: "Activa",
      timesUsed: 982,
    },
    {
      clientId: 1,
      name: "Email de Bienvenida",
      description: "Mensaje cálido de bienvenida para nuevos suscriptores",
      type: "Email",
      category: "Transaccional",
      subject: "¡Bienvenido a {{empresa}}! 🎉",
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px;">
            <h1 style="color: #6366f1; font-size: 32px;">¡Bienvenido a {{empresa}}! 🎉</h1>
            <p style="font-size: 18px; color: #64748b;">Estamos muy contentos de tenerte con nosotros</p>
          </div>
          <div style="padding: 0 40px;">
            <p>Hola {{nombre}},</p>
            <p>¡Gracias por unirte a nuestra comunidad! Estamos emocionados de comenzar este viaje contigo.</p>
            <p>Aquí hay algunas cosas que puedes hacer para empezar:</p>
            <ul>
              <li>Completa tu perfil</li>
              <li>Explora nuestras características</li>
              <li>Únete a nuestra comunidad</li>
            </ul>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
        </div>
      `,
      variables: JSON.stringify(["nombre", "empresa"]),
      thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400",
      status: "Activa",
      timesUsed: 2156,
    },
    {
      clientId: 1,
      name: "Carrito Abandonado",
      description: "Recupera ventas de carritos abandonados con este email persuasivo",
      type: "Email",
      category: "Transaccional",
      subject: "¡Todavía tienes artículos en tu carrito! 🛒",
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Hola {{nombre}},</h2>
          <p>Notamos que dejaste algunos artículos en tu carrito...</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Tus artículos:</h3>
            <p>{{productos}}</p>
          </div>
          <p><strong>¡No te los pierdas!</strong> Completa tu compra ahora.</p>
          <a href="{{url_carrito}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Completar Compra
          </a>
          <p style="color: #6b7280; font-size: 14px;">*Oferta válida por tiempo limitado</p>
        </div>
      `,
      variables: JSON.stringify(["nombre", "productos", "url_carrito"]),
      thumbnail: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400",
      status: "Activa",
      timesUsed: 1543,
    },
    {
      clientId: 1,
      name: "Encuesta de Satisfacción",
      description: "Solicita feedback valioso de tus clientes",
      type: "Email",
      category: "Informativo",
      subject: "Tu opinión es importante para {{empresa}} 💬",
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">¡Tu opinión importa!</h2>
          <p>Hola {{nombre}},</p>
          <p>Nos encantaría conocer tu experiencia con nuestros servicios. Tu feedback nos ayuda a mejorar.</p>
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-weight: bold;">¿Cómo calificarías tu experiencia?</p>
            <a href="{{url_encuesta}}" style="display: inline-block; background: #6366f1; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
              Completar Encuesta
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">Solo te tomará 2 minutos</p>
        </div>
      `,
      variables: JSON.stringify(["nombre", "empresa", "url_encuesta"]),
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      status: "Activa",
      timesUsed: 654,
    },
    {
      clientId: 1,
      name: "Landing SaaS Moderno",
      description: "Landing page profesional para productos SaaS con diseño limpio y moderno",
      type: "Landing",
      category: "SaaS",
      subject: null,
      content: `
        <div style="font-family: Arial, sans-serif;">
          <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 40px; text-align: center;">
            <h1 style="font-size: 48px; margin: 0;">{{nombre_producto}}</h1>
            <p style="font-size: 24px; margin: 20px 0;">La solución que estabas buscando</p>
            <button style="background: white; color: #667eea; padding: 15px 40px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer;">
              Prueba Gratis
            </button>
          </header>
          <section style="padding: 60px 40px; max-width: 1200px; margin: 0 auto;">
            <h2 style="text-align: center; font-size: 36px; margin-bottom: 40px;">Características</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
              <div style="text-align: center;">
                <h3>Rápido</h3>
                <p>Optimizado para velocidad</p>
              </div>
              <div style="text-align: center;">
                <h3>Seguro</h3>
                <p>Protección de datos avanzada</p>
              </div>
              <div style="text-align: center;">
                <h3>Escalable</h3>
                <p>Crece con tu negocio</p>
              </div>
            </div>
          </section>
        </div>
      `,
      variables: JSON.stringify(["nombre_producto"]),
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      status: "Activa",
      timesUsed: 3421,
    },
    {
      clientId: 1,
      name: "Landing E-commerce",
      description: "Página de producto optimizada para conversiones en e-commerce",
      type: "Landing",
      category: "E-commerce",
      subject: null,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 40px;">
            <div>
              <img src="{{imagen_producto}}" alt="Producto" style="width: 100%; border-radius: 8px;">
            </div>
            <div>
              <h1 style="font-size: 36px; margin: 0;">{{nombre_producto}}</h1>
              <p style="font-size: 28px; color: #10b981; margin: 20px 0;">{{precio}}</p>
              <p style="color: #64748b; line-height: 1.6;">{{descripcion}}</p>
              <button style="background: #10b981; color: white; padding: 15px 60px; border: none; border-radius: 5px; font-size: 18px; width: 100%; margin-top: 30px; cursor: pointer;">
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      `,
      variables: JSON.stringify(["nombre_producto", "precio", "descripcion", "imagen_producto"]),
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      status: "Activa",
      timesUsed: 2198,
    },
    {
      clientId: 1,
      name: "Landing Captura de Leads",
      description: "Formulario de captación optimizado con alta conversión",
      type: "Landing",
      category: "SaaS",
      subject: null,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 100px auto; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px;">
          <h1 style="text-align: center; color: #1f2937; font-size: 32px;">{{titulo_oferta}}</h1>
          <p style="text-align: center; color: #64748b; font-size: 18px;">{{descripcion_oferta}}</p>
          <form style="margin-top: 30px;">
            <input type="text" placeholder="Tu nombre" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e5e7eb; border-radius: 5px; font-size: 16px;">
            <input type="email" placeholder="Tu email" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e5e7eb; border-radius: 5px; font-size: 16px;">
            <button type="submit" style="width: 100%; background: #6366f1; color: white; padding: 15px; border: none; border-radius: 5px; font-size: 18px; margin-top: 20px; cursor: pointer;">
              Descargar Gratis
            </button>
          </form>
          <p style="text-align: center; color: #9ca3af; font-size: 14px; margin-top: 20px;">
            🔒 Tus datos están seguros con nosotros
          </p>
        </div>
      `,
      variables: JSON.stringify(["titulo_oferta", "descripcion_oferta"]),
      thumbnail: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400",
      status: "Activa",
      timesUsed: 1876,
    },
  ];

  try {
    for (const template of sampleTemplates) {
      await db.insert(templates).values(template);
      console.log(`✅ Template creado: ${template.name}`);
    }
    console.log(`\n🎉 ${sampleTemplates.length} templates creados exitosamente!`);
    console.log("\n📊 Resumen:");
    console.log(`  - Templates Email: ${sampleTemplates.filter(t => t.type === "Email").length}`);
    console.log(`  - Templates Landing: ${sampleTemplates.filter(t => t.type === "Landing").length}`);
    console.log(`  - Total usos: ${sampleTemplates.reduce((sum, t) => sum + t.timesUsed, 0).toLocaleString()}`);
  } catch (error) {
    console.error("❌ Error al crear templates:", error);
    throw error;
  }

  process.exit(0);
}

seedTemplates();
