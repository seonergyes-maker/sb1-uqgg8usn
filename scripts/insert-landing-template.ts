import { db } from "../server/db";
import { templates } from "../shared/schema";

async function insertLandingTemplate() {
  try {
    console.log("🎨 Insertando template base de Landing...");
    
    const landingHTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{{product_name}}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;line-height:1.6;color:#333}.hero{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:100px 20px;text-align:center}.hero h1{font-size:3rem;margin-bottom:20px;font-weight:700}.hero p{font-size:1.3rem;margin-bottom:30px;opacity:.9}.cta-button{display:inline-block;padding:15px 40px;background:#fff;color:#667eea;text-decoration:none;border-radius:50px;font-weight:600;font-size:1.1rem;transition:all .3s;box-shadow:0 4px 15px rgba(0,0,0,.2)}.cta-button:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.3)}.features{max-width:1200px;margin:80px auto;padding:0 20px}.features h2{text-align:center;font-size:2.5rem;margin-bottom:60px;color:#333}.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:40px}.feature-card{text-align:center;padding:30px}.feature-icon{font-size:3rem;margin-bottom:20px}.feature-card h3{font-size:1.5rem;margin-bottom:15px;color:#667eea}.feature-card p{color:#666;line-height:1.8}.cta-section{background:#f8f9fa;padding:80px 20px;text-align:center}.cta-section h2{font-size:2.5rem;margin-bottom:20px;color:#333}.cta-section p{font-size:1.2rem;color:#666;margin-bottom:40px}.footer{background:#2d3748;color:#fff;padding:40px 20px;text-align:center}.footer p{opacity:.8}@media (max-width:768px){.hero h1{font-size:2rem}.hero p{font-size:1.1rem}.features h2,.cta-section h2{font-size:1.8rem}}</style></head><body><section class="hero"><h1>{{product_name}}</h1><p>{{headline}}</p><a href="#cta" class="cta-button">{{cta_text}}</a></section><section class="features"><h2>¿Por qué elegirnos?</h2><div class="feature-grid"><div class="feature-card"><div class="feature-icon">🚀</div><h3>{{feature1_title}}</h3><p>{{feature1_description}}</p></div><div class="feature-card"><div class="feature-icon">💎</div><h3>{{feature2_title}}</h3><p>{{feature2_description}}</p></div><div class="feature-card"><div class="feature-icon">⚡</div><h3>{{feature3_title}}</h3><p>{{feature3_description}}</p></div></div></section><section class="cta-section" id="cta"><h2>¿Listo para comenzar?</h2><p>{{cta_subtitle}}</p><a href="{{cta_link}}" class="cta-button">{{cta_text}}</a></section><footer class="footer"><p>© {{year}} {{company_name}}. Todos los derechos reservados.</p></footer></body></html>`;
    
    const result = await db.insert(templates).values({
      clientId: 0,
      name: "Landing Producto Moderno",
      description: "Landing page profesional con hero, features y CTA. Ideal para lanzamiento de productos.",
      type: "Landing",
      category: "Marketing",
      subject: null,
      content: landingHTML,
      variables: JSON.stringify({
        product_name: "Nombre del producto",
        headline: "Transforma tu negocio con nuestra solución innovadora",
        cta_text: "Comenzar ahora",
        feature1_title: "Rápido y Eficiente",
        feature1_description: "Optimiza tus procesos y ahorra tiempo valioso",
        feature2_title: "Calidad Premium",
        feature2_description: "La mejor experiencia para tus clientes",
        feature3_title: "Soporte 24/7",
        feature3_description: "Estamos aquí cuando nos necesites",
        cta_subtitle: "Únete a miles de clientes satisfechos",
        cta_link: "#contacto",
        company_name: "Tu Empresa",
        year: "2025"
      }),
      thumbnail: null,
      status: "Activa",
      timesUsed: 0
    });
    
    console.log("✅ Template base de Landing insertado exitosamente");
    console.log("ID:", result);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error insertando template:", error);
    process.exit(1);
  }
}

insertLandingTemplate();
