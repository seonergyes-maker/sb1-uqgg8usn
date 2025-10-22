// Parte 2: 4 templates de landing restantes

export const baseLandingTemplatesPart2 = [
  {
    clientId: 0,
    name: "Landing Webinar/Evento",
    description: "Landing para promocionar y registrar asistentes a webinars o eventos",
    type: "Landing",
    category: "E-commerce",
    subject: null,
    content: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{event_name}} - Registrate Ahora</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 0 80px; text-align: center; position: relative; }
    .hero::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z'%3E%3C/path%3E%3C/svg%3E"); background-size: cover; }
    .hero h1 { font-size: 48px; margin-bottom: 20px; }
    .hero p { font-size: 22px; margin-bottom: 30px; opacity: 0.95; }
    .event-date { background-color: rgba(255,255,255,0.2); display: inline-block; padding: 15px 30px; border-radius: 50px; font-size: 20px; font-weight: bold; margin: 20px 0; }
    .content-section { padding: 80px 0; }
    .content-section h2 { text-align: center; font-size: 36px; margin-bottom: 50px; }
    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; }
    .benefit-item { text-align: center; padding: 30px; }
    .benefit-item .icon { font-size: 48px; margin-bottom: 20px; }
    .benefit-item h3 { font-size: 22px; margin-bottom: 15px; color: #667eea; }
    .speaker-section { background-color: #f9f9f9; padding: 80px 0; }
    .speaker-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
    .speaker-card { background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .speaker-card .speaker-photo { width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 20px; background-color: #ddd; }
    .speaker-card h3 { font-size: 24px; margin-bottom: 10px; }
    .speaker-card p { color: #666; }
    .registration-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 0; text-align: center; }
    .registration-form { max-width: 500px; margin: 40px auto 0; background: white; padding: 40px; border-radius: 15px; }
    .registration-form input { width: 100%; padding: 15px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; }
    .submit-button { width: 100%; padding: 18px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 50px; font-size: 18px; font-weight: bold; cursor: pointer; }
    footer { background-color: #2c3e50; color: white; padding: 30px 0; text-align: center; }
  </style>
</head>
<body>
  <section class="hero">
    <div class="container">
      <h1>{{event_name}}</h1>
      <p>{{event_subtitle}}</p>
      <div class="event-date">📅 {{event_date}} | ⏰ {{event_time}}</div>
    </div>
  </section>
  
  <section class="content-section">
    <div class="container">
      <h2>¿Qué aprenderás?</h2>
      <div class="benefits-grid">
        <div class="benefit-item">
          <div class="icon">🎯</div>
          <h3>{{benefit1_title}}</h3>
          <p>{{benefit1_description}}</p>
        </div>
        <div class="benefit-item">
          <div class="icon">💡</div>
          <h3>{{benefit2_title}}</h3>
          <p>{{benefit2_description}}</p>
        </div>
        <div class="benefit-item">
          <div class="icon">🚀</div>
          <h3>{{benefit3_title}}</h3>
          <p>{{benefit3_description}}</p>
        </div>
        <div class="benefit-item">
          <div class="icon">✨</div>
          <h3>{{benefit4_title}}</h3>
          <p>{{benefit4_description}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="speaker-section">
    <div class="container">
      <h2>Ponentes Expertos</h2>
      <div class="speaker-grid">
        <div class="speaker-card">
          <div class="speaker-photo"></div>
          <h3>{{speaker1_name}}</h3>
          <p>{{speaker1_title}}</p>
          <p style="margin-top: 15px; color: #333;">{{speaker1_bio}}</p>
        </div>
        <div class="speaker-card">
          <div class="speaker-photo"></div>
          <h3>{{speaker2_name}}</h3>
          <p>{{speaker2_title}}</p>
          <p style="margin-top: 15px; color: #333;">{{speaker2_bio}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="registration-section">
    <div class="container">
      <h2 style="font-size: 42px; margin-bottom: 20px;">Reserva tu Plaza Gratis</h2>
      <p style="font-size: 20px; opacity: 0.95;">Las plazas son limitadas. Regístrate ahora y no te lo pierdas.</p>
      <div class="registration-form">
        <form action="{{form_action}}" method="POST">
          <input type="text" name="name" placeholder="Tu nombre completo" required>
          <input type="email" name="email" placeholder="Tu email" required>
          <input type="tel" name="phone" placeholder="Tu teléfono (opcional)">
          <button type="submit" class="submit-button">Reservar Mi Plaza</button>
        </form>
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
    variables: '{"event_name": "Nombre del evento", "event_subtitle": "Subtítulo del evento", "event_date": "Fecha del evento", "event_time": "Hora del evento", "benefit1_title": "Título beneficio 1", "benefit1_description": "Descripción beneficio 1", "benefit2_title": "Título beneficio 2", "benefit2_description": "Descripción beneficio 2", "benefit3_title": "Título beneficio 3", "benefit3_description": "Descripción beneficio 3", "benefit4_title": "Título beneficio 4", "benefit4_description": "Descripción beneficio 4", "speaker1_name": "Nombre ponente 1", "speaker1_title": "Título ponente 1", "speaker1_bio": "Biografía ponente 1", "speaker2_name": "Nombre ponente 2", "speaker2_title": "Título ponente 2", "speaker2_bio": "Biografía ponente 2", "form_action": "URL de acción del formulario", "company": "Nombre de la empresa", "year": "Año actual"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
  {
    clientId: 0,
    name: "Landing E-commerce Producto",
    description: "Landing para vender un producto específico con imágenes y testimonios",
    type: "Landing",
    category: "E-commerce",
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
    .announcement-bar { background-color: #ff6b6b; color: white; text-align: center; padding: 12px; font-weight: bold; }
    .hero { padding: 80px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .hero-content h1 { font-size: 48px; margin-bottom: 20px; }
    .hero-content p { font-size: 20px; color: #666; margin-bottom: 30px; }
    .price { font-size: 48px; font-weight: bold; color: #27ae60; margin: 20px 0; }
    .price-old { text-decoration: line-through; color: #999; font-size: 32px; margin-right: 15px; }
    .cta-button { display: inline-block; padding: 20px 50px; background-color: #ff6b6b; color: white; text-decoration: none; border-radius: 50px; font-size: 20px; font-weight: bold; transition: transform 0.3s; }
    .cta-button:hover { transform: translateY(-3px); }
    .hero-image { background-color: #f0f0f0; aspect-ratio: 1; border-radius: 20px; }
    .features { background-color: #f9f9f9; padding: 80px 0; }
    .features h2 { text-align: center; font-size: 36px; margin-bottom: 50px; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; }
    .feature-item { text-align: center; }
    .feature-item .icon { font-size: 64px; margin-bottom: 20px; }
    .feature-item h3 { font-size: 22px; margin-bottom: 10px; }
    .testimonials { padding: 80px 0; }
    .testimonials h2 { text-align: center; font-size: 36px; margin-bottom: 50px; }
    .testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
    .testimonial-card { background-color: #f9f9f9; padding: 30px; border-radius: 15px; }
    .testimonial-card .stars { color: #ffc107; font-size: 20px; margin-bottom: 15px; }
    .testimonial-card p { font-style: italic; color: #666; margin-bottom: 15px; }
    .testimonial-card .author { font-weight: bold; }
    .guarantee { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 0; text-align: center; }
    .guarantee h2 { font-size: 36px; margin-bottom: 20px; }
    .cta-final { background-color: #ff6b6b; color: white; padding: 80px 0; text-align: center; }
    .cta-final h2 { font-size: 42px; margin-bottom: 30px; }
    footer { background-color: #2c3e50; color: white; padding: 30px 0; text-align: center; }
  </style>
</head>
<body>
  <div class="announcement-bar">
    🔥 {{announcement_text}} 🔥
  </div>
  
  <section class="hero">
    <div class="container" style="display: contents;">
      <div class="hero-content">
        <h1>{{product_name}}</h1>
        <p>{{tagline}}</p>
        <div>
          <span class="price-old">{{old_price}}€</span>
          <span class="price">{{new_price}}€</span>
        </div>
        <p>{{discount_text}}</p>
        <a href="#order" class="cta-button">Comprar Ahora</a>
      </div>
      <div class="hero-image"></div>
    </div>
  </section>
  
  <section class="features">
    <div class="container">
      <h2>¿Por qué elegir {{product_name}}?</h2>
      <div class="features-grid">
        <div class="feature-item">
          <div class="icon">✨</div>
          <h3>{{feature1_title}}</h3>
          <p>{{feature1_description}}</p>
        </div>
        <div class="feature-item">
          <div class="icon">🎯</div>
          <h3>{{feature2_title}}</h3>
          <p>{{feature2_description}}</p>
        </div>
        <div class="feature-item">
          <div class="icon">💪</div>
          <h3>{{feature3_title}}</h3>
          <p>{{feature3_description}}</p>
        </div>
        <div class="feature-item">
          <div class="icon">🚀</div>
          <h3>{{feature4_title}}</h3>
          <p>{{feature4_description}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="testimonials">
    <div class="container">
      <h2>Lo que dicen nuestros clientes</h2>
      <div class="testimonial-grid">
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
  
  <section class="guarantee">
    <div class="container">
      <h2>✅ Garantía de 30 Días</h2>
      <p style="font-size: 20px; max-width: 700px; margin: 0 auto;">{{guarantee_text}}</p>
    </div>
  </section>
  
  <section class="cta-final" id="order">
    <div class="container">
      <h2>Consigue {{product_name}} Hoy</h2>
      <p style="font-size: 24px; margin-bottom: 30px;">Precio especial: <strong style="font-size: 36px;">{{new_price}}€</strong></p>
      <a href="{{checkout_url}}" class="cta-button" style="background-color: white; color: #ff6b6b;">Comprar Ahora</a>
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
    variables: '{"announcement_text": "Texto del anuncio superior", "product_name": "Nombre del producto", "tagline": "Frase de venta principal", "old_price": "Precio anterior", "new_price": "Precio actual", "discount_text": "Texto del descuento", "feature1_title": "Título característica 1", "feature1_description": "Descripción característica 1", "feature2_title": "Título característica 2", "feature2_description": "Descripción característica 2", "feature3_title": "Título característica 3", "feature3_description": "Descripción característica 3", "feature4_title": "Título característica 4", "feature4_description": "Descripción característica 4", "testimonial1_text": "Testimonio 1", "testimonial1_author": "Autor testimonio 1", "testimonial2_text": "Testimonio 2", "testimonial2_author": "Autor testimonio 2", "testimonial3_text": "Testimonio 3", "testimonial3_author": "Autor testimonio 3", "guarantee_text": "Texto de la garantía", "checkout_url": "URL del checkout", "company": "Nombre de la empresa", "year": "Año actual"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
  {
    clientId: 0,
    name: "Landing Ebook/Recurso Gratuito",
    description: "Landing para generar leads con ebook u otro recurso gratuito",
    type: "Landing",
    category: "SaaS",
    subject: null,
    content: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{resource_name}} - Descarga Gratuita</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .hero { background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); color: white; padding: 80px 0; }
    .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .hero h1 { font-size: 48px; margin-bottom: 20px; }
    .hero p { font-size: 22px; opacity: 0.95; margin-bottom: 30px; }
    .hero ul { font-size: 18px; margin-bottom: 30px; }
    .hero ul li { margin-bottom: 15px; padding-left: 30px; position: relative; }
    .hero ul li::before { content: '✓'; position: absolute; left: 0; color: #27ae60; font-weight: bold; font-size: 20px; }
    .download-form { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .download-form h3 { color: #2c3e50; text-align: center; margin-bottom: 25px; font-size: 24px; }
    .download-form input { width: 100%; padding: 15px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; }
    .submit-button { width: 100%; padding: 18px; background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; border: none; border-radius: 50px; font-size: 18px; font-weight: bold; cursor: pointer; }
    .trust-badge { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
    .preview { background: white; padding: 80px 0; }
    .preview h2 { text-align: center; font-size: 36px; margin-bottom: 50px; }
    .preview-content { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .preview-image { aspect-ratio: 3/4; background-color: #f0f0f0; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .chapters { background-color: #f9f9f9; padding: 80px 0; }
    .chapters h2 { text-align: center; font-size: 36px; margin-bottom: 50px; }
    .chapter-list { max-width: 800px; margin: 0 auto; }
    .chapter-item { background: white; padding: 25px; margin-bottom: 20px; border-radius: 10px; border-left: 4px solid #3498db; }
    .chapter-item h3 { color: #2c3e50; margin-bottom: 10px; }
    .chapter-item p { color: #666; }
    .author { background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); color: white; padding: 80px 0; }
    .author-content { display: grid; grid-template-columns: 200px 1fr; gap: 40px; align-items: center; max-width: 900px; margin: 0 auto; }
    .author-photo { width: 200px; height: 200px; border-radius: 50%; background-color: #f0f0f0; }
    .author-bio h2 { font-size: 32px; margin-bottom: 15px; }
    .author-bio p { font-size: 18px; opacity: 0.95; line-height: 1.8; }
    .cta-final { background-color: #27ae60; color: white; padding: 60px 0; text-align: center; }
    .cta-final h2 { font-size: 36px; margin-bottom: 30px; }
    footer { background-color: #2c3e50; color: white; padding: 30px 0; text-align: center; }
  </style>
</head>
<body>
  <section class="hero">
    <div class="container">
      <div class="hero-grid">
        <div>
          <h1>{{resource_name}}</h1>
          <p>{{resource_description}}</p>
          <ul>
            <li>{{benefit1}}</li>
            <li>{{benefit2}}</li>
            <li>{{benefit3}}</li>
            <li>{{benefit4}}</li>
          </ul>
        </div>
        <div class="download-form">
          <h3>📥 Descarga Gratuita</h3>
          <form action="{{form_action}}" method="POST">
            <input type="text" name="name" placeholder="Tu nombre" required>
            <input type="email" name="email" placeholder="Tu mejor email" required>
            <button type="submit" class="submit-button">Descargar Ahora</button>
          </form>
          <div class="trust-badge">
            🔒 100% Gratis. Sin tarjeta de crédito. Sin spam.
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section class="preview">
    <div class="container">
      <h2>Vista Previa</h2>
      <div class="preview-content">
        <div class="preview-image"></div>
        <div>
          <h3 style="font-size: 28px; margin-bottom: 20px; color: #2c3e50;">{{preview_title}}</h3>
          <p style="font-size: 18px; color: #666; line-height: 1.8;">{{preview_description}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="chapters">
    <div class="container">
      <h2>¿Qué Incluye?</h2>
      <div class="chapter-list">
        <div class="chapter-item">
          <h3>{{chapter1_title}}</h3>
          <p>{{chapter1_description}}</p>
        </div>
        <div class="chapter-item">
          <h3>{{chapter2_title}}</h3>
          <p>{{chapter2_description}}</p>
        </div>
        <div class="chapter-item">
          <h3>{{chapter3_title}}</h3>
          <p>{{chapter3_description}}</p>
        </div>
        <div class="chapter-item">
          <h3>{{chapter4_title}}</h3>
          <p>{{chapter4_description}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="author">
    <div class="container">
      <div class="author-content">
        <div class="author-photo"></div>
        <div class="author-bio">
          <h2>Sobre el Autor</h2>
          <p>{{author_name}}</p>
          <p style="margin-top: 15px;">{{author_bio}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="cta-final">
    <div class="container">
      <h2>Descarga {{resource_name}} Gratis</h2>
      <p style="font-size: 20px; margin-bottom: 30px;">Más de {{download_count}} personas ya lo han descargado</p>
      <a href="#hero" class="cta-button" style="background-color: white; color: #27ae60;">Descargar Ahora</a>
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
    variables: '{"resource_name": "Nombre del recurso (ebook/guía)", "resource_description": "Descripción del recurso", "benefit1": "Beneficio 1", "benefit2": "Beneficio 2", "benefit3": "Beneficio 3", "benefit4": "Beneficio 4", "form_action": "URL de acción del formulario", "preview_title": "Título de la vista previa", "preview_description": "Descripción de la vista previa", "chapter1_title": "Título capítulo 1", "chapter1_description": "Descripción capítulo 1", "chapter2_title": "Título capítulo 2", "chapter2_description": "Descripción capítulo 2", "chapter3_title": "Título capítulo 3", "chapter3_description": "Descripción capítulo 3", "chapter4_title": "Título capítulo 4", "chapter4_description": "Descripción capítulo 4", "author_name": "Nombre del autor", "author_bio": "Biografía del autor", "download_count": "Número de descargas", "company": "Nombre de la empresa", "year": "Año actual"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
  {
    clientId: 0,
    name: "Landing Curso Online",
    description: "Landing para promocionar y vender cursos online con programa detallado",
    type: "Landing",
    category: "SaaS",
    subject: null,
    content: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{course_name}} - Aprende desde Cero</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .announcement { background-color: #ffc107; text-align: center; padding: 15px; font-weight: bold; font-size: 16px; }
    .hero { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 100px 0; text-align: center; }
    .hero h1 { font-size: 52px; margin-bottom: 20px; }
    .hero p { font-size: 24px; margin-bottom: 40px; opacity: 0.95; }
    .video-container { max-width: 800px; margin: 0 auto 40px; aspect-ratio: 16/9; background-color: rgba(0,0,0,0.2); border-radius: 15px; }
    .price-box { background: white; color: #333; display: inline-block; padding: 30px 50px; border-radius: 15px; margin-bottom: 30px; }
    .price-box .old-price { text-decoration: line-through; color: #999; font-size: 28px; }
    .price-box .new-price { font-size: 48px; font-weight: bold; color: #ff6b6b; }
    .cta-button { display: inline-block; padding: 20px 50px; background-color: white; color: #ff6b6b; text-decoration: none; border-radius: 50px; font-size: 20px; font-weight: bold; transition: transform 0.3s; }
    .cta-button:hover { transform: scale(1.05); }
    .what-you-learn { background-color: white; padding: 80px 0; }
    .what-you-learn h2 { text-align: center; font-size: 36px; margin-bottom: 50px; }
    .learning-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
    .learning-item { background-color: #f9f9f9; padding: 25px; border-radius: 10px; border-left: 4px solid #ff6b6b; }
    .learning-item h3 { color: #ff6b6b; margin-bottom: 10px; }
    .curriculum { background-color: #f9f9f9; padding: 80px 0; }
    .curriculum h2 { text-align: center; font-size: 36px; margin-bottom: 50px; }
    .module-list { max-width: 900px; margin: 0 auto; }
    .module { background: white; padding: 25px; margin-bottom: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .module-header { display: flex; justify-between; align-items: center; }
    .module-header h3 { font-size: 22px; color: #2c3e50; }
    .module-header span { color: #666; font-size: 14px; }
    .module p { color: #666; margin-top: 10px; }
    .instructor { background: white; padding: 80px 0; }
    .instructor-content { display: grid; grid-template-columns: 250px 1fr; gap: 40px; align-items: center; max-width: 900px; margin: 0 auto; }
    .instructor-photo { width: 250px; height: 250px; border-radius: 50%; background-color: #f0f0f0; }
    .instructor-bio h2 { font-size: 32px; margin-bottom: 15px; }
    .instructor-bio p { font-size: 18px; color: #666; line-height: 1.8; }
    .testimonials { background-color: #f9f9f9; padding: 80px 0; }
    .testimonials h2 { text-align: center; font-size: 36px; margin-bottom: 50px; }
    .testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
    .testimonial-card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .testimonial-card .stars { color: #ffc107; font-size: 20px; margin-bottom: 15px; }
    .testimonial-card p { color: #666; font-style: italic; margin-bottom: 15px; }
    .testimonial-card .author { font-weight: bold; color: #333; }
    .cta-final { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 80px 0; text-align: center; }
    .cta-final h2 { font-size: 42px; margin-bottom: 30px; }
    .bonus { background-color: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 10px; max-width: 600px; margin: 30px auto; }
    .bonus h3 { color: #856404; margin-bottom: 10px; }
    .bonus p { color: #856404; margin: 0; }
    footer { background-color: #2c3e50; color: white; padding: 30px 0; text-align: center; }
  </style>
</head>
<body>
  <div class="announcement">
    ⏰ {{announcement_text}} ⏰
  </div>
  
  <section class="hero">
    <div class="container">
      <h1>{{course_name}}</h1>
      <p>{{course_subtitle}}</p>
      <div class="video-container"></div>
      <div class="price-box">
        <div><span class="old-price">{{old_price}}€</span> <span class="new-price">{{new_price}}€</span></div>
        <div style="margin-top: 10px; color: #666;">{{discount_text}}</div>
      </div>
      <a href="#enroll" class="cta-button">Inscribirme Ahora</a>
    </div>
  </section>
  
  <section class="what-you-learn">
    <div class="container">
      <h2>¿Qué Aprenderás?</h2>
      <div class="learning-grid">
        <div class="learning-item">
          <h3>✓ {{skill1}}</h3>
          <p>{{skill1_description}}</p>
        </div>
        <div class="learning-item">
          <h3>✓ {{skill2}}</h3>
          <p>{{skill2_description}}</p>
        </div>
        <div class="learning-item">
          <h3>✓ {{skill3}}</h3>
          <p>{{skill3_description}}</p>
        </div>
        <div class="learning-item">
          <h3>✓ {{skill4}}</h3>
          <p>{{skill4_description}}</p>
        </div>
        <div class="learning-item">
          <h3>✓ {{skill5}}</h3>
          <p>{{skill5_description}}</p>
        </div>
        <div class="learning-item">
          <h3>✓ {{skill6}}</h3>
          <p>{{skill6_description}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="curriculum">
    <div class="container">
      <h2>Programa del Curso</h2>
      <div class="module-list">
        <div class="module">
          <div class="module-header">
            <h3>{{module1_title}}</h3>
            <span>{{module1_duration}}</span>
          </div>
          <p>{{module1_description}}</p>
        </div>
        <div class="module">
          <div class="module-header">
            <h3>{{module2_title}}</h3>
            <span>{{module2_duration}}</span>
          </div>
          <p>{{module2_description}}</p>
        </div>
        <div class="module">
          <div class="module-header">
            <h3>{{module3_title}}</h3>
            <span>{{module3_duration}}</span>
          </div>
          <p>{{module3_description}}</p>
        </div>
        <div class="module">
          <div class="module-header">
            <h3>{{module4_title}}</h3>
            <span>{{module4_duration}}</span>
          </div>
          <p>{{module4_description}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="instructor">
    <div class="container">
      <div class="instructor-content">
        <div class="instructor-photo"></div>
        <div class="instructor-bio">
          <h2>Tu Instructor</h2>
          <h3 style="color: #ff6b6b; font-size: 24px; margin-bottom: 10px;">{{instructor_name}}</h3>
          <p>{{instructor_bio}}</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="testimonials">
    <div class="container">
      <h2>Testimonios de Estudiantes</h2>
      <div class="testimonial-grid">
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
  
  <section class="cta-final" id="enroll">
    <div class="container">
      <h2>Comienza Tu Transformación Hoy</h2>
      <div class="bonus">
        <h3>🎁 BONUS EXCLUSIVO</h3>
        <p>{{bonus_text}}</p>
      </div>
      <p style="font-size: 24px; margin-bottom: 30px;">Precio especial: <strong style="font-size: 42px;">{{new_price}}€</strong></p>
      <a href="{{enroll_url}}" class="cta-button">Inscribirme Ahora</a>
      <p style="margin-top: 20px; font-size: 16px; opacity: 0.9;">✓ Acceso de por vida | ✓ Certificado incluido | ✓ Garantía de 30 días</p>
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
    variables: '{"announcement_text": "Texto del anuncio temporal", "course_name": "Nombre del curso", "course_subtitle": "Subtítulo del curso", "old_price": "Precio anterior", "new_price": "Precio actual", "discount_text": "Texto del descuento", "skill1": "Habilidad 1", "skill1_description": "Descripción habilidad 1", "skill2": "Habilidad 2", "skill2_description": "Descripción habilidad 2", "skill3": "Habilidad 3", "skill3_description": "Descripción habilidad 3", "skill4": "Habilidad 4", "skill4_description": "Descripción habilidad 4", "skill5": "Habilidad 5", "skill5_description": "Descripción habilidad 5", "skill6": "Habilidad 6", "skill6_description": "Descripción habilidad 6", "module1_title": "Título módulo 1", "module1_duration": "Duración módulo 1", "module1_description": "Descripción módulo 1", "module2_title": "Título módulo 2", "module2_duration": "Duración módulo 2", "module2_description": "Descripción módulo 2", "module3_title": "Título módulo 3", "module3_duration": "Duración módulo 3", "module3_description": "Descripción módulo 3", "module4_title": "Título módulo 4", "module4_duration": "Duración módulo 4", "module4_description": "Descripción módulo 4", "instructor_name": "Nombre del instructor", "instructor_bio": "Biografía del instructor", "testimonial1_text": "Testimonio 1", "testimonial1_author": "Autor del testimonio 1", "testimonial2_text": "Testimonio 2", "testimonial2_author": "Autor del testimonio 2", "testimonial3_text": "Testimonio 3", "testimonial3_author": "Autor del testimonio 3", "bonus_text": "Descripción del bonus", "enroll_url": "URL de inscripción", "company": "Nombre de la empresa", "year": "Año actual"}',
    thumbnail: null,
    isBaseTemplate: 1,
    status: "Activa",
    timesUsed: 0,
  },
];
