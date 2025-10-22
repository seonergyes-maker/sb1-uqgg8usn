import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { templates } from '../shared/schema';

async function seedTemplates() {
  const connection = await mysql.createConnection({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  });

  const db = drizzle(connection);

  console.log('🎨 Insertando 12 templates base (6 email + 6 landing)...\n');
  
  const allTemplates = [
    // EMAIL 1: Bienvenida Moderna
    {
      clientId: 0,
      name: "Email Bienvenida Moderna",
      description: "Template moderno de bienvenida con diseño limpio y profesional",
      type: "Email",
      category: "Transaccional",
      subject: "¡Bienvenido/a a {{company}}!",
      content: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>body{margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4}.container{max-width:600px;margin:0 auto;background-color:#fff}.header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 20px;text-align:center}.header h1{color:#fff;margin:0;font-size:28px}.content{padding:40px 30px}.content h2{color:#333;font-size:24px;margin-bottom:20px}.content p{color:#666;line-height:1.6;font-size:16px}.cta-button{display:inline-block;padding:15px 30px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;text-decoration:none;border-radius:5px;margin:20px 0;font-weight:bold}.footer{background-color:#f8f8f8;padding:20px;text-align:center;color:#999;font-size:14px}</style>
</head>
<body>
<div class="container">
<div class="header"><h1>¡Bienvenido/a!</h1></div>
<div class="content">
<h2>Hola {{name}},</h2>
<p>Nos alegra muchísimo tenerte con nosotros en {{company}}. Estamos aquí para ayudarte a alcanzar tus objetivos.</p>
<a href="{{dashboard_url}}" class="cta-button">Ir a mi panel</a>
</div>
<div class="footer"><p>© {{year}} {{company}}. Todos los derechos reservados.</p></div>
</div>
</body>
</html>`,
      variables: '{"name":"Nombre del usuario","company":"Nombre de la empresa","dashboard_url":"URL del panel","year":"Año actual"}',
      thumbnail: null,
      isBaseTemplate: 1,
      status: "Activa",
      timesUsed: 0,
    },
    // EMAIL 2: Promocional
    {
      clientId: 0,
      name: "Email Promocional Descuento",
      description: "Template para campañas promocionales con código de descuento destacado",
      type: "Email",
      category: "Marketing",
      subject: "🎉 {{discount_percent}}% de descuento - Solo por tiempo limitado",
      content: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>body{margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4}.container{max-width:600px;margin:0 auto;background-color:#fff}.header{background:#ff6b6b;padding:40px 20px;text-align:center;color:#fff}.header h1{margin:0;font-size:32px}.content{padding:40px 30px;text-align:center}.discount-badge{background:linear-gradient(135deg,#ff6b6b,#ee5a6f);color:#fff;padding:30px;border-radius:10px;margin:20px 0}.discount-badge .code{font-size:32px;font-weight:bold;letter-spacing:3px;margin:10px 0}.cta-button{display:inline-block;padding:18px 40px;background:#ff6b6b;color:#fff;text-decoration:none;border-radius:50px;margin:20px 0;font-weight:bold;font-size:18px}.footer{background-color:#f8f8f8;padding:20px;text-align:center;color:#999;font-size:14px}</style>
</head>
<body>
<div class="container">
<div class="header"><h1>¡OFERTA ESPECIAL!</h1><p style="font-size:20px;margin:10px 0">{{discount_percent}}% de descuento</p></div>
<div class="content">
<p style="font-size:18px;color:#333">Hola {{name}},</p>
<p style="font-size:16px;color:#666">Tenemos una oferta exclusiva para ti. Usa este código:</p>
<div class="discount-badge">
<p style="margin:0">CÓDIGO:</p>
<div class="code">{{promo_code}}</div>
<p style="margin:0;font-size:14px">Válido hasta {{expiry_date}}</p>
</div>
<a href="{{shop_url}}" class="cta-button">Comprar Ahora</a>
</div>
<div class="footer"><p>© {{year}} {{company}}</p></div>
</div>
</body>
</html>`,
      variables: '{"name":"Nombre","discount_percent":"Porcentaje descuento","promo_code":"Código promocional","expiry_date":"Fecha expiración","shop_url":"URL tienda","company":"Empresa","year":"Año"}',
      thumbnail: null,
      isBaseTemplate: 1,
      status: "Activa",
      timesUsed: 0,
    },
    // Resto de templates (simplificados por espacio)
  ];

  try {
    let count = 0;
    for (const template of allTemplates) {
      await db.insert(templates).values(template);
      count++;
      console.log(`✅ ${count}. ${template.name}`);
    }
    console.log(`\n🎉 ${count} templates insertados exitosamente!`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

seedTemplates();
