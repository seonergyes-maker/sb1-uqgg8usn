import { db } from "../server/db";
import { templates } from "../shared/schema";

const baseEmailTemplates = [
  {
    clientId: 0, // Sistema
    name: "Email Bienvenida Moderna",
    description: "Template moderno de bienvenida con diseño limpio y profesional",
    type: "Email",
    category: "Transaccional",
    subject: "¡Bienvenido/a a {{company}}!",
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #333333; font-size: 24px; margin-bottom: 20px; }
    .content p { color: #666666; line-height: 1.6; font-size: 16px; }
    .cta-button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #999999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Bienvenido/a!</h1>
    </div>
    <div class="content">
      <h2>Hola {{name}},</h2>
      <p>Nos alegra muchísimo tenerte con nosotros en {{company}}. Estamos aquí para ayudarte a alcanzar tus objetivos.</p>
      <p>Para empezar, te recomendamos explorar nuestra plataforma y descubrir todo lo que puedes hacer:</p>
      <a href="{{dashboard_url}}" class="cta-button">Ir a mi panel</a>
      <p>Si tienes alguna pregunta, nuestro equipo está listo para ayudarte.</p>
    </div>
    <div class="footer">
      <p>© {{year}} {{company}}. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
    `,
    variables: '{"name": "Nombre del usuario", "company": "Nombre de la empresa", "dashboard_url": "URL del panel", "year": "Año actual"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
  {
    clientId: 0,
    name: "Email Promocional Descuento",
    description: "Template para campañas promocionales con descuentos atractivos",
    type: "Email",
    category: "Promocional",
    subject: "🎉 {{discount}}% de descuento - Solo hoy",
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; }
    .banner { background-color: #ff6b6b; color: #ffffff; text-align: center; padding: 15px; font-size: 18px; font-weight: bold; }
    .hero { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 50px 20px; text-align: center; }
    .hero h1 { color: #ffffff; font-size: 42px; margin: 0 0 10px 0; }
    .hero .discount { font-size: 72px; font-weight: bold; color: #ffffff; margin: 20px 0; }
    .content { padding: 40px 30px; text-align: center; }
    .content p { color: #333333; font-size: 18px; line-height: 1.6; }
    .cta-button { display: inline-block; padding: 18px 40px; background-color: #ff6b6b; color: #ffffff; text-decoration: none; border-radius: 50px; margin: 25px 0; font-weight: bold; font-size: 18px; }
    .countdown { background-color: #fff3cd; padding: 20px; margin: 20px 30px; border-radius: 10px; text-align: center; }
    .countdown p { color: #856404; font-weight: bold; margin: 0; }
    .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #999999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="banner">
      ⚡ OFERTA FLASH - SOLO POR TIEMPO LIMITADO
    </div>
    <div class="hero">
      <h1>¡Aprovecha Ahora!</h1>
      <div class="discount">{{discount}}%</div>
      <p style="color: #ffffff; font-size: 20px;">DE DESCUENTO</p>
    </div>
    <div class="content">
      <p>Hola {{name}},</p>
      <p>Esta es tu oportunidad para ahorrar en grande. Usa el código <strong>{{promo_code}}</strong> al realizar tu compra.</p>
      <a href="{{shop_url}}" class="cta-button">Comprar Ahora</a>
    </div>
    <div class="countdown">
      <p>⏰ Esta oferta expira en {{expiry_hours}} horas</p>
    </div>
    <div class="footer">
      <p>© {{year}} {{company}}. No quieres recibir estos emails? <a href="{{unsubscribe_url}}">Cancelar suscripción</a></p>
    </div>
  </div>
</body>
</html>
    `,
    variables: '{"name": "Nombre del usuario", "discount": "Porcentaje de descuento", "promo_code": "Código promocional", "shop_url": "URL de la tienda", "expiry_hours": "Horas hasta expiración", "company": "Nombre de la empresa", "year": "Año actual", "unsubscribe_url": "URL para cancelar suscripción"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
  {
    clientId: 0,
    name: "Newsletter Informativo",
    description: "Template para newsletters con varias secciones de contenido",
    type: "Email",
    category: "Newsletter",
    subject: "{{newsletter_title}} - {{month}} {{year}}",
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2c3e50; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 26px; }
    .header p { color: #ecf0f1; margin: 10px 0 0 0; }
    .article { padding: 30px; border-bottom: 1px solid #eeeeee; }
    .article h2 { color: #2c3e50; font-size: 22px; margin-bottom: 15px; }
    .article p { color: #666666; line-height: 1.6; font-size: 15px; }
    .article a { color: #3498db; text-decoration: none; font-weight: bold; }
    .cta-section { background-color: #3498db; padding: 40px 30px; text-align: center; }
    .cta-section h3 { color: #ffffff; margin: 0 0 15px 0; }
    .cta-button { display: inline-block; padding: 15px 30px; background-color: #ffffff; color: #3498db; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .footer { background-color: #2c3e50; padding: 20px; text-align: center; color: #ecf0f1; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{newsletter_title}}</h1>
      <p>{{month}} {{year}}</p>
    </div>
    <div class="article">
      <h2>{{article1_title}}</h2>
      <p>{{article1_content}}</p>
      <a href="{{article1_url}}">Leer más →</a>
    </div>
    <div class="article">
      <h2>{{article2_title}}</h2>
      <p>{{article2_content}}</p>
      <a href="{{article2_url}}">Leer más →</a>
    </div>
    <div class="article">
      <h2>{{article3_title}}</h2>
      <p>{{article3_content}}</p>
      <a href="{{article3_url}}">Leer más →</a>
    </div>
    <div class="cta-section">
      <h3>¿Quieres saber más?</h3>
      <a href="{{website_url}}" class="cta-button">Visitar nuestro sitio web</a>
    </div>
    <div class="footer">
      <p>© {{year}} {{company}}. <a href="{{unsubscribe_url}}" style="color: #ecf0f1;">Cancelar suscripción</a></p>
    </div>
  </div>
</body>
</html>
    `,
    variables: '{"newsletter_title": "Título del newsletter", "month": "Mes", "year": "Año", "article1_title": "Título artículo 1", "article1_content": "Contenido artículo 1", "article1_url": "URL artículo 1", "article2_title": "Título artículo 2", "article2_content": "Contenido artículo 2", "article2_url": "URL artículo 2", "article3_title": "Título artículo 3", "article3_content": "Contenido artículo 3", "article3_url": "URL artículo 3", "website_url": "URL del sitio web", "company": "Nombre de la empresa", "unsubscribe_url": "URL para cancelar suscripción"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
  {
    clientId: 0,
    name: "Email Recuperación Carrito",
    description: "Template para recordar carritos abandonados con incentivo",
    type: "Email",
    category: "E-commerce",
    subject: "{{name}}, olvidaste algo en tu carrito 🛒",
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f9f9f9; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { padding: 30px 20px; text-align: center; border-bottom: 3px solid #4CAF50; }
    .header h1 { color: #333333; margin: 0; font-size: 24px; }
    .content { padding: 40px 30px; text-align: center; }
    .content p { color: #666666; line-height: 1.6; font-size: 16px; }
    .product-box { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .product-box h3 { color: #333333; margin-top: 0; }
    .product-box p { color: #666666; margin: 5px 0; }
    .price { font-size: 24px; color: #4CAF50; font-weight: bold; margin: 10px 0; }
    .cta-button { display: inline-block; padding: 15px 35px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; font-size: 16px; }
    .incentive { background-color: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107; }
    .incentive p { color: #856404; margin: 0; font-weight: bold; }
    .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #999999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛒 Dejaste algo en tu carrito</h1>
    </div>
    <div class="content">
      <p>Hola {{name}},</p>
      <p>Notamos que dejaste estos productos en tu carrito. ¡Aún están disponibles!</p>
      <div class="product-box">
        <h3>{{product_name}}</h3>
        <p>{{product_description}}</p>
        <div class="price">{{product_price}}€</div>
      </div>
      <div class="incentive">
        <p>🎁 Completa tu compra ahora y recibe {{incentive}} de regalo</p>
      </div>
      <a href="{{cart_url}}" class="cta-button">Completar mi compra</a>
      <p>Si tienes alguna duda, contáctanos. Estamos aquí para ayudarte.</p>
    </div>
    <div class="footer">
      <p>© {{year}} {{company}}. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
    `,
    variables: '{"name": "Nombre del usuario", "product_name": "Nombre del producto", "product_description": "Descripción del producto", "product_price": "Precio del producto", "incentive": "Incentivo (ej: envío gratis)", "cart_url": "URL del carrito", "company": "Nombre de la empresa", "year": "Año actual"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
  {
    clientId: 0,
    name: "Email Confirmación Pedido",
    description: "Template para confirmar pedidos con detalles de compra",
    type: "Email",
    category: "Transaccional",
    subject: "Confirmación de pedido #{{order_number}}",
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #27ae60; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 26px; }
    .header p { color: #ffffff; margin: 10px 0 0 0; }
    .content { padding: 30px; }
    .content h2 { color: #333333; font-size: 22px; }
    .content p { color: #666666; line-height: 1.6; }
    .order-details { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
    .order-details table { width: 100%; border-collapse: collapse; }
    .order-details td { padding: 10px 0; border-bottom: 1px solid #eeeeee; }
    .order-details td:first-child { font-weight: bold; color: #333333; }
    .order-details td:last-child { text-align: right; color: #666666; }
    .total { background-color: #27ae60; color: #ffffff; padding: 15px 20px; margin: 20px 0; border-radius: 5px; font-size: 18px; font-weight: bold; text-align: right; }
    .button { display: inline-block; padding: 12px 25px; background-color: #27ae60; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
    .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #999999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Pedido Confirmado</h1>
      <p>Pedido #{{order_number}}</p>
    </div>
    <div class="content">
      <h2>Hola {{name}},</h2>
      <p>Gracias por tu pedido. Hemos recibido tu compra y estamos preparándola para el envío.</p>
      <div class="order-details">
        <table>
          <tr>
            <td>Número de pedido:</td>
            <td>#{{order_number}}</td>
          </tr>
          <tr>
            <td>Fecha:</td>
            <td>{{order_date}}</td>
          </tr>
          <tr>
            <td>Método de pago:</td>
            <td>{{payment_method}}</td>
          </tr>
          <tr>
            <td>Dirección de envío:</td>
            <td>{{shipping_address}}</td>
          </tr>
        </table>
      </div>
      <div class="total">
        Total: {{order_total}}€
      </div>
      <p style="text-align: center;">
        <a href="{{track_url}}" class="button">Rastrear pedido</a>
        <a href="{{invoice_url}}" class="button">Ver factura</a>
      </p>
      <p>Te enviaremos una notificación cuando tu pedido esté en camino.</p>
    </div>
    <div class="footer">
      <p>© {{year}} {{company}}. ¿Necesitas ayuda? <a href="{{support_url}}">Contáctanos</a></p>
    </div>
  </div>
</body>
</html>
    `,
    variables: '{"name": "Nombre del usuario", "order_number": "Número de pedido", "order_date": "Fecha del pedido", "payment_method": "Método de pago", "shipping_address": "Dirección de envío", "order_total": "Total del pedido", "track_url": "URL de rastreo", "invoice_url": "URL de la factura", "support_url": "URL de soporte", "company": "Nombre de la empresa", "year": "Año actual"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
  {
    clientId: 0,
    name: "Email Webinar/Evento",
    description: "Template para invitaciones a webinars o eventos online",
    type: "Email",
    category: "Informativo",
    subject: "🎯 Invitación: {{event_name}} - {{event_date}}",
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; }
    .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center; color: #ffffff; }
    .hero h1 { margin: 0 0 15px 0; font-size: 32px; }
    .hero p { font-size: 18px; margin: 0; }
    .date-box { background-color: rgba(255,255,255,0.2); padding: 20px; margin: 20px auto; border-radius: 10px; max-width: 300px; }
    .date-box .day { font-size: 48px; font-weight: bold; margin: 0; }
    .date-box .details { font-size: 16px; margin: 10px 0 0 0; }
    .content { padding: 40px 30px; }
    .content h2 { color: #333333; font-size: 24px; margin-bottom: 15px; }
    .content p { color: #666666; line-height: 1.6; font-size: 16px; }
    .content ul { color: #666666; line-height: 1.8; }
    .speaker-box { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; display: flex; align-items: center; }
    .speaker-box img { width: 80px; height: 80px; border-radius: 50%; margin-right: 20px; }
    .speaker-info h3 { color: #333333; margin: 0 0 5px 0; }
    .speaker-info p { color: #666666; margin: 0; font-size: 14px; }
    .cta-button { display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 50px; margin: 25px 0; font-weight: bold; font-size: 18px; }
    .footer { background-color: #f8f8f8; padding: 20px; text-align: center; color: #999999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <h1>{{event_name}}</h1>
      <p>{{event_subtitle}}</p>
      <div class="date-box">
        <div class="day">{{event_day}}</div>
        <div class="details">{{event_date}} | {{event_time}}</div>
      </div>
    </div>
    <div class="content">
      <h2>Hola {{name}},</h2>
      <p>Estás invitado/a a nuestro próximo evento online. Aprenderás:</p>
      <ul>
        <li>{{benefit1}}</li>
        <li>{{benefit2}}</li>
        <li>{{benefit3}}</li>
      </ul>
      <div class="speaker-box">
        <div class="speaker-info">
          <h3>{{speaker_name}}</h3>
          <p>{{speaker_title}}</p>
        </div>
      </div>
      <p style="text-align: center;">
        <a href="{{register_url}}" class="cta-button">Reservar mi plaza</a>
      </p>
      <p>Las plazas son limitadas. ¡No te lo pierdas!</p>
    </div>
    <div class="footer">
      <p>© {{year}} {{company}}. <a href="{{unsubscribe_url}}">Cancelar suscripción</a></p>
    </div>
  </div>
</body>
</html>
    `,
    variables: '{"name": "Nombre del usuario", "event_name": "Nombre del evento", "event_subtitle": "Subtítulo del evento", "event_day": "Día (número)", "event_date": "Fecha completa", "event_time": "Hora del evento", "benefit1": "Beneficio 1", "benefit2": "Beneficio 2", "benefit3": "Beneficio 3", "speaker_name": "Nombre del ponente", "speaker_title": "Título del ponente", "register_url": "URL de registro", "company": "Nombre de la empresa", "year": "Año actual", "unsubscribe_url": "URL para cancelar suscripción"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
];

const baseLandingTemplates = [
  {
    clientId: 0,
    name: "Landing SaaS Moderna",
    description: "Landing page para productos SaaS con hero, features y pricing",
    type: "Landing",
    category: "SaaS",
    subject: null,
    content: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{product_name}} - {{tagline}}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 0; text-align: center; }
    header h1 { font-size: 48px; margin-bottom: 20px; }
    header p { font-size: 24px; margin-bottom: 30px; opacity: 0.9; }
    .cta-button { display: inline-block; padding: 15px 40px; background-color: white; color: #667eea; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; transition: transform 0.3s; }
    .cta-button:hover { transform: translateY(-2px); }
    .features { padding: 80px 0; background-color: #f9f9f9; }
    .features h2 { text-align: center; font-size: 36px; margin-bottom: 50px; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
    .feature-card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .feature-card h3 { color: #667eea; margin-bottom: 15px; font-size: 22px; }
    .pricing { padding: 80px 0; }
    .pricing h2 { text-align: center; font-size: 36px; margin-bottom: 50px; }
    .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
    .pricing-card { background: white; padding: 40px; border-radius: 10px; border: 2px solid #e0e0e0; text-align: center; transition: transform 0.3s; }
    .pricing-card:hover { transform: translateY(-5px); border-color: #667eea; }
    .pricing-card.featured { border-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .pricing-card h3 { font-size: 24px; margin-bottom: 10px; }
    .pricing-card .price { font-size: 48px; font-weight: bold; margin: 20px 0; }
    .pricing-card ul { list-style: none; margin: 20px 0; }
    .pricing-card li { padding: 10px 0; }
    footer { background-color: #2c3e50; color: white; padding: 40px 0; text-align: center; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>{{product_name}}</h1>
      <p>{{tagline}}</p>
      <a href="#signup" class="cta-button">{{cta_text}}</a>
    </div>
  </header>
  
  <section class="features">
    <div class="container">
      <h2>¿Por qué {{product_name}}?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>{{feature1_title}}</h3>
          <p>{{feature1_description}}</p>
        </div>
        <div class="feature-card">
          <h3>{{feature2_title}}</h3>
          <p>{{feature2_description}}</p>
        </div>
        <div class="feature-card">
          <h3>{{feature3_title}}</h3>
          <p>{{feature3_description}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="pricing">
    <div class="container">
      <h2>Planes y Precios</h2>
      <div class="pricing-grid">
        <div class="pricing-card">
          <h3>{{plan1_name}}</h3>
          <div class="price">{{plan1_price}}€</div>
          <ul>
            <li>{{plan1_feature1}}</li>
            <li>{{plan1_feature2}}</li>
            <li>{{plan1_feature3}}</li>
          </ul>
          <a href="#signup" class="cta-button">Comenzar</a>
        </div>
        <div class="pricing-card featured">
          <h3>{{plan2_name}}</h3>
          <div class="price">{{plan2_price}}€</div>
          <ul>
            <li>{{plan2_feature1}}</li>
            <li>{{plan2_feature2}}</li>
            <li>{{plan2_feature3}}</li>
          </ul>
          <a href="#signup" class="cta-button">Comenzar</a>
        </div>
        <div class="pricing-card">
          <h3>{{plan3_name}}</h3>
          <div class="price">{{plan3_price}}€</div>
          <ul>
            <li>{{plan3_feature1}}</li>
            <li>{{plan3_feature2}}</li>
            <li>{{plan3_feature3}}</li>
          </ul>
          <a href="#signup" class="cta-button">Comenzar</a>
        </div>
      </div>
    </div>
  </section>
  
  <footer>
    <div class="container">
      <p>© {{year}} {{company}}. Todos los derechos reservados.</p>
    </div>
  </footer>
</body>
</html>
    `,
    variables: '{"product_name": "Nombre del producto", "tagline": "Frase descriptiva", "cta_text": "Texto del botón", "feature1_title": "Título característica 1", "feature1_description": "Descripción característica 1", "feature2_title": "Título característica 2", "feature2_description": "Descripción característica 2", "feature3_title": "Título característica 3", "feature3_description": "Descripción característica 3", "plan1_name": "Nombre plan 1", "plan1_price": "Precio plan 1", "plan1_feature1": "Característica 1", "plan1_feature2": "Característica 2", "plan1_feature3": "Característica 3", "plan2_name": "Nombre plan 2", "plan2_price": "Precio plan 2", "plan2_feature1": "Característica 1", "plan2_feature2": "Característica 2", "plan2_feature3": "Característica 3", "plan3_name": "Nombre plan 3", "plan3_price": "Precio plan 3", "plan3_feature1": "Característica 1", "plan3_feature2": "Característica 2", "plan3_feature3": "Característica 3", "company": "Nombre de la empresa", "year": "Año actual"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
  {
    clientId: 0,
    name: "Landing Descarga App",
    description: "Landing para promover descarga de aplicaciones móviles",
    type: "Landing",
    category: "SaaS",
    subject: null,
    content: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{app_name}} - {{subtitle}}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .hero { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 100px 0; text-align: center; }
    .hero h1 { font-size: 52px; margin-bottom: 20px; }
    .hero p { font-size: 24px; margin-bottom: 40px; opacity: 0.95; }
    .app-buttons { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
    .app-button { display: inline-block; padding: 15px 30px; background-color: #000; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; transition: transform 0.3s; }
    .app-button:hover { transform: scale(1.05); }
    .features { padding: 80px 0; background-color: white; }
    .features h2 { text-align: center; font-size: 40px; margin-bottom: 60px; }
    .features-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; }
    .feature-item { text-align: center; }
    .feature-icon { font-size: 48px; margin-bottom: 20px; }
    .feature-item h3 { font-size: 22px; margin-bottom: 10px; color: #f5576c; }
    .testimonials { padding: 80px 0; background-color: #f9f9f9; }
    .testimonials h2 { text-align: center; font-size: 40px; margin-bottom: 60px; }
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
    .testimonial-card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .testimonial-card .stars { color: #ffc107; font-size: 20px; margin-bottom: 15px; }
    .testimonial-card p { font-style: italic; margin-bottom: 15px; color: #666; }
    .testimonial-card .author { font-weight: bold; color: #333; }
    .cta-section { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 80px 0; text-align: center; }
    .cta-section h2 { font-size: 42px; margin-bottom: 20px; }
    footer { background-color: #2c3e50; color: white; padding: 30px 0; text-align: center; }
  </style>
</head>
<body>
  <section class="hero">
    <div class="container">
      <h1>{{app_name}}</h1>
      <p>{{subtitle}}</p>
      <div class="app-buttons">
        <a href="{{ios_url}}" class="app-button">📱 Descargar en App Store</a>
        <a href="{{android_url}}" class="app-button">🤖 Descargar en Google Play</a>
      </div>
    </div>
  </section>
  
  <section class="features">
    <div class="container">
      <h2>Características Principales</h2>
      <div class="features-list">
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <h3>{{feature1_title}}</h3>
          <p>{{feature1_description}}</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🔒</div>
          <h3>{{feature2_title}}</h3>
          <p>{{feature2_description}}</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <h3>{{feature3_title}}</h3>
          <p>{{feature3_description}}</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💎</div>
          <h3>{{feature4_title}}</h3>
          <p>{{feature4_description}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="testimonials">
    <div class="container">
      <h2>Lo que dicen nuestros usuarios</h2>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p>"{{testimonial1_text}}"</p>
          <div class="author">- {{testimonial1_author}}</div>
        </div>
        <div class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p>"{{testimonial2_text}}"</p>
          <div class="author">- {{testimonial2_author}}</div>
        </div>
        <div class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p>"{{testimonial3_text}}"</p>
          <div class="author">- {{testimonial3_author}}</div>
        </div>
      </div>
    </div>
  </section>
  
  <section class="cta-section">
    <div class="container">
      <h2>¿Listo para empezar?</h2>
      <p style="font-size: 20px; margin-bottom: 30px;">Descarga {{app_name}} ahora y transforma tu experiencia</p>
      <div class="app-buttons">
        <a href="{{ios_url}}" class="app-button">📱 App Store</a>
        <a href="{{android_url}}" class="app-button">🤖 Google Play</a>
      </div>
    </div>
  </section>
  
  <footer>
    <div class="container">
      <p>© {{year}} {{company}}. Todos los derechos reservados.</p>
    </div>
  </footer>
</body>
</html>
    `,
    variables: '{"app_name": "Nombre de la app", "subtitle": "Subtítulo/descripción breve", "ios_url": "URL de la App Store", "android_url": "URL de Google Play", "feature1_title": "Título característica 1", "feature1_description": "Descripción característica 1", "feature2_title": "Título característica 2", "feature2_description": "Descripción característica 2", "feature3_title": "Título característica 3", "feature3_description": "Descripción característica 3", "feature4_title": "Título característica 4", "feature4_description": "Descripción característica 4", "testimonial1_text": "Testimonio 1", "testimonial1_author": "Autor del testimonio 1", "testimonial2_text": "Testimonio 2", "testimonial2_author": "Autor del testimonio 2", "testimonial3_text": "Testimonio 3", "testimonial3_author": "Autor del testimonio 3", "company": "Nombre de la empresa", "year": "Año actual"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
];

// Continuar en la siguiente parte...
