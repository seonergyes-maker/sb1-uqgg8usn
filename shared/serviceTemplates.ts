// Templates para sector servicios con formularios de captura de leads integrados

export const CONSULTORIA_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultoría Profesional</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 1.5rem; text-align: center; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .hero-content { max-width: 600px; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; line-height: 1.2; }
    .hero p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.95; }
    .benefits { background: white; padding: 3rem 1.5rem; }
    .benefit-item { margin-bottom: 2rem; }
    .benefit-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .benefit-item h3 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #1a202c; }
    .benefit-item p { color: #718096; line-height: 1.6; }
    .cta-section { background: #f7fafc; padding: 3rem 1.5rem; }
    .form-container { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
    .form-container h2 { font-size: 1.75rem; margin-bottom: 1.5rem; text-align: center; color: #1a202c; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: #4a5568; font-weight: 500; }
    .form-group input, .form-group textarea { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem; transition: border-color 0.2s; }
    .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #667eea; }
    .submit-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; width: 100%; cursor: pointer; transition: transform 0.2s; }
    .submit-btn:hover { transform: translateY(-2px); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .success-message { background: #48bb78; color: white; padding: 1rem; border-radius: 0.5rem; text-align: center; margin-top: 1rem; display: none; }
    .error-message { background: #f56565; color: white; padding: 1rem; border-radius: 0.5rem; text-align: center; margin-top: 1rem; display: none; }
    @media (min-width: 768px) {
      .hero h1 { font-size: 3.5rem; }
      .hero p { font-size: 1.5rem; }
      .benefits { padding: 4rem 2rem; }
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <h1 contenteditable="false">Impulsa Tu Negocio al Siguiente Nivel</h1>
      <p contenteditable="false">Consultoría estratégica personalizada para empresas que quieren crecer. Más de 10 años transformando negocios.</p>
    </div>
  </div>
  
  <div class="benefits">
    <div class="benefit-item">
      <div class="benefit-icon" contenteditable="false">📊</div>
      <h3 contenteditable="false">Análisis Profundo</h3>
      <p contenteditable="false">Estudiamos tu negocio para identificar oportunidades de crecimiento y optimización.</p>
    </div>
    <div class="benefit-item">
      <div class="benefit-icon" contenteditable="false">🎯</div>
      <h3 contenteditable="false">Estrategia a Medida</h3>
      <p contenteditable="false">Creamos un plan personalizado que se adapta a tus objetivos y recursos.</p>
    </div>
    <div class="benefit-item">
      <div class="benefit-icon" contenteditable="false">📈</div>
      <h3 contenteditable="false">Resultados Medibles</h3>
      <p contenteditable="false">Seguimiento constante con KPIs claros para garantizar el éxito de tu inversión.</p>
    </div>
  </div>
  
  <div class="cta-section">
    <div class="form-container">
      <h2 contenteditable="false">Solicita tu Consulta Gratuita</h2>
      <form id="leadForm">
        <div class="form-group">
          <label contenteditable="false">Nombre completo *</label>
          <input type="text" name="name" required contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">Email *</label>
          <input type="email" name="email" required contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">Teléfono</label>
          <input type="tel" name="phone" contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">Empresa</label>
          <input type="text" name="company" contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">¿Cómo podemos ayudarte?</label>
          <textarea name="message" rows="4" contenteditable="false"></textarea>
        </div>
        <button type="submit" class="submit-btn" contenteditable="false">Solicitar Consulta Gratuita</button>
      </form>
      <div class="success-message" id="successMessage">¡Gracias! Te contactaremos pronto.</div>
      <div class="error-message" id="errorMessage">Hubo un error. Por favor, intenta de nuevo.</div>
    </div>
  </div>

  <script>
    document.getElementById('leadForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = this.querySelector('.submit-btn');
      const successMsg = document.getElementById('successMessage');
      const errorMsg = document.getElementById('errorMessage');
      
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
      
      const formData = {
        clientId: window.LANDING_CLIENT_ID,
        name: this.name.value,
        email: this.email.value,
        phone: this.phone.value,
        company: this.company.value,
        message: this.message.value,
        source: 'landing-' + window.LANDING_SLUG
      };
      
      try {
        const response = await fetch('/api/public/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          successMsg.style.display = 'block';
          this.reset();
        } else {
          errorMsg.style.display = 'block';
        }
      } catch (error) {
        errorMsg.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Solicitar Consulta Gratuita';
      }
    });
  </script>
</body>
</html>`;

export const AGENCIA_DIGITAL_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agencia Digital</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .hero { background: #1a202c; color: white; padding: 3rem 1.5rem; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .hero-content { max-width: 600px; text-align: center; }
    .hero h1 { font-size: 2.25rem; margin-bottom: 1rem; line-height: 1.2; }
    .hero .highlight { color: #4fd1c5; }
    .hero p { font-size: 1.125rem; margin-bottom: 2.5rem; color: #cbd5e0; line-height: 1.6; }
    .services { background: white; padding: 3rem 1.5rem; }
    .service-grid { display: grid; gap: 1.5rem; }
    .service-card { background: #f7fafc; padding: 1.5rem; border-radius: 0.75rem; border-left: 4px solid #4fd1c5; }
    .service-card h3 { font-size: 1.25rem; margin-bottom: 0.75rem; color: #1a202c; }
    .service-card p { color: #718096; line-height: 1.6; }
    .contact-section { background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%); color: white; padding: 3rem 1.5rem; }
    .form-wrapper { max-width: 500px; margin: 0 auto; }
    .form-wrapper h2 { font-size: 2rem; margin-bottom: 0.75rem; text-align: center; }
    .form-wrapper .subtitle { text-align: center; color: #cbd5e0; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500; }
    .form-group input, .form-group textarea { width: 100%; padding: 0.875rem; border: 2px solid #4a5568; background: #2d3748; color: white; border-radius: 0.5rem; font-size: 1rem; transition: border-color 0.2s; }
    .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #4fd1c5; }
    .submit-btn { background: #4fd1c5; color: #1a202c; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; width: 100%; cursor: pointer; transition: all 0.2s; }
    .submit-btn:hover { background: #38b2ac; transform: translateY(-2px); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .success-message { background: #48bb78; padding: 1rem; border-radius: 0.5rem; text-align: center; margin-top: 1rem; display: none; }
    .error-message { background: #f56565; padding: 1rem; border-radius: 0.5rem; text-align: center; margin-top: 1rem; display: none; }
    @media (min-width: 768px) {
      .hero h1 { font-size: 3.25rem; }
      .service-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <h1 contenteditable="false">Transformamos Ideas en <span class="highlight">Experiencias Digitales</span></h1>
      <p contenteditable="false">Diseño web, marketing digital y desarrollo de apps que convierten visitantes en clientes.</p>
    </div>
  </div>
  
  <div class="services">
    <div class="service-grid">
      <div class="service-card">
        <h3 contenteditable="false">🎨 Diseño Web</h3>
        <p contenteditable="false">Sitios web modernos, rápidos y optimizados para conversión en cualquier dispositivo.</p>
      </div>
      <div class="service-card">
        <h3 contenteditable="false">📱 Apps Móviles</h3>
        <p contenteditable="false">Aplicaciones nativas y multiplataforma que tus usuarios amarán usar.</p>
      </div>
      <div class="service-card">
        <h3 contenteditable="false">🚀 Marketing Digital</h3>
        <p contenteditable="false">Campañas de Google Ads, Meta Ads y SEO que generan resultados reales.</p>
      </div>
      <div class="service-card">
        <h3 contenteditable="false">📊 Analytics</h3>
        <p contenteditable="false">Medimos todo para optimizar tu inversión y maximizar el ROI.</p>
      </div>
    </div>
  </div>
  
  <div class="contact-section">
    <div class="form-wrapper">
      <h2 contenteditable="false">Hablemos de tu Proyecto</h2>
      <p class="subtitle" contenteditable="false">Respuesta en menos de 24 horas</p>
      <form id="leadForm">
        <div class="form-group">
          <label contenteditable="false">Tu nombre *</label>
          <input type="text" name="name" required contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">Email *</label>
          <input type="email" name="email" required contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">Teléfono</label>
          <input type="tel" name="phone" contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">Cuéntanos sobre tu proyecto</label>
          <textarea name="message" rows="4" contenteditable="false"></textarea>
        </div>
        <button type="submit" class="submit-btn" contenteditable="false">Solicitar Presupuesto</button>
      </form>
      <div class="success-message" id="successMessage">¡Mensaje enviado! Nos pondremos en contacto contigo pronto.</div>
      <div class="error-message" id="errorMessage">Error al enviar. Por favor, intenta nuevamente.</div>
    </div>
  </div>

  <script>
    document.getElementById('leadForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = this.querySelector('.submit-btn');
      const successMsg = document.getElementById('successMessage');
      const errorMsg = document.getElementById('errorMessage');
      
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
      
      const formData = {
        clientId: window.LANDING_CLIENT_ID,
        name: this.name.value,
        email: this.email.value,
        phone: this.phone.value,
        message: this.message.value,
        source: 'landing-' + window.LANDING_SLUG
      };
      
      try {
        const response = await fetch('/api/public/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          successMsg.style.display = 'block';
          this.reset();
        } else {
          errorMsg.style.display = 'block';
        }
      } catch (error) {
        errorMsg.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Solicitar Presupuesto';
      }
    });
  </script>
</body>
</html>`;

export const SERVICIOS_PROFESIONALES_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Servicios Profesionales</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fa; }
    .header { background: white; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .header-content { max-width: 1200px; margin: 0 auto; text-align: center; }
    .logo { font-size: 1.5rem; font-weight: 700; color: #2563eb; }
    .hero { background: linear-gradient(to bottom, white, #f8f9fa); padding: 3rem 1.5rem; text-align: center; }
    .hero h1 { font-size: 2.25rem; color: #1e293b; margin-bottom: 1rem; line-height: 1.2; }
    .hero p { font-size: 1.125rem; color: #64748b; margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto; }
    .features { background: white; padding: 3rem 1.5rem; }
    .feature-list { max-width: 800px; margin: 0 auto; }
    .feature-item { display: flex; align-items: flex-start; margin-bottom: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 0.75rem; }
    .feature-icon { font-size: 2rem; margin-right: 1rem; flex-shrink: 0; }
    .feature-content h3 { font-size: 1.125rem; color: #1e293b; margin-bottom: 0.5rem; }
    .feature-content p { color: #64748b; line-height: 1.6; }
    .cta { background: #2563eb; color: white; padding: 4rem 1.5rem; text-align: center; }
    .cta h2 { font-size: 2rem; margin-bottom: 1rem; }
    .cta .subtitle { font-size: 1.125rem; opacity: 0.9; margin-bottom: 2.5rem; }
    .form-card { background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; margin: 0 auto; }
    .form-group { margin-bottom: 1.25rem; text-align: left; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: #475569; font-weight: 500; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .form-group input, .form-group textarea { width: 100%; padding: 0.875rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem; transition: all 0.2s; }
    .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    .submit-btn { background: #1e293b; color: white; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; width: 100%; cursor: pointer; transition: all 0.2s; }
    .submit-btn:hover { background: #0f172a; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .success-message { background: #10b981; color: white; padding: 1rem; border-radius: 0.5rem; text-align: center; margin-top: 1rem; display: none; font-weight: 500; }
    .error-message { background: #ef4444; color: white; padding: 1rem; border-radius: 0.5rem; text-align: center; margin-top: 1rem; display: none; font-weight: 500; }
    @media (min-width: 768px) {
      .hero h1 { font-size: 3rem; }
      .cta h2 { font-size: 2.5rem; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-content">
      <div class="logo" contenteditable="false">TuMarca</div>
    </div>
  </div>
  
  <div class="hero">
    <h1 contenteditable="false">Servicios Profesionales que Marcan la Diferencia</h1>
    <p contenteditable="false">Soluciones expertas para empresas que buscan excelencia y resultados tangibles.</p>
  </div>
  
  <div class="features">
    <div class="feature-list">
      <div class="feature-item">
        <div class="feature-icon" contenteditable="false">✓</div>
        <div class="feature-content">
          <h3 contenteditable="false">Experiencia Comprobada</h3>
          <p contenteditable="false">Más de 500 proyectos exitosos con empresas de todos los tamaños.</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon" contenteditable="false">✓</div>
        <div class="feature-content">
          <h3 contenteditable="false">Enfoque Personalizado</h3>
          <p contenteditable="false">Cada solución se adapta a tus necesidades específicas y objetivos.</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon" contenteditable="false">✓</div>
        <div class="feature-content">
          <h3 contenteditable="false">Soporte Continuo</h3>
          <p contenteditable="false">Acompañamiento en cada etapa del proyecto y más allá.</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="cta">
    <h2 contenteditable="false">Comienza Hoy</h2>
    <p class="subtitle" contenteditable="false">Completa el formulario y recibe una propuesta personalizada</p>
    <div class="form-card">
      <form id="leadForm">
        <div class="form-group">
          <label contenteditable="false">Nombre *</label>
          <input type="text" name="name" required contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">Email *</label>
          <input type="email" name="email" required contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">Teléfono</label>
          <input type="tel" name="phone" contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">Empresa</label>
          <input type="text" name="company" contenteditable="false">
        </div>
        <div class="form-group">
          <label contenteditable="false">Mensaje</label>
          <textarea name="message" rows="3" contenteditable="false"></textarea>
        </div>
        <button type="submit" class="submit-btn" contenteditable="false">Enviar Solicitud</button>
      </form>
      <div class="success-message" id="successMessage">✓ Tu solicitud ha sido enviada correctamente</div>
      <div class="error-message" id="errorMessage">✗ Error al enviar. Inténtalo de nuevo</div>
    </div>
  </div>

  <script>
    document.getElementById('leadForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = this.querySelector('.submit-btn');
      const successMsg = document.getElementById('successMessage');
      const errorMsg = document.getElementById('errorMessage');
      
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
      
      const formData = {
        clientId: window.LANDING_CLIENT_ID,
        name: this.name.value,
        email: this.email.value,
        phone: this.phone.value,
        company: this.company.value,
        message: this.message.value,
        source: 'landing-' + window.LANDING_SLUG
      };
      
      try {
        const response = await fetch('/api/public/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          successMsg.style.display = 'block';
          this.reset();
        } else {
          errorMsg.style.display = 'block';
        }
      } catch (error) {
        errorMsg.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Enviar Solicitud';
      }
    });
  </script>
</body>
</html>`;
