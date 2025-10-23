export const DEFAULT_LANDING_TEMPLATE = `
<div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <!-- Hero Section -->
  <div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem; text-align: center;">
    <div style="max-width: 800px;">
      <h1 style="font-size: 3.5rem; font-weight: bold; color: white; margin-bottom: 1.5rem; line-height: 1.2;" contenteditable="true">
        Tu Título Impactante Aquí
      </h1>
      <p style="font-size: 1.5rem; color: rgba(255,255,255,0.9); margin-bottom: 3rem; line-height: 1.6;" contenteditable="true">
        Describe tu producto o servicio de forma clara y convincente. Este texto es completamente editable.
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button style="background: white; color: #667eea; padding: 1rem 2rem; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.3s;" contenteditable="true">
          Comenzar Ahora
        </button>
        <button style="background: transparent; color: white; padding: 1rem 2rem; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; border: 2px solid white; cursor: pointer; transition: all 0.3s;" contenteditable="true">
          Saber Más
        </button>
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <div style="background: white; padding: 5rem 2rem;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 3rem; color: #1a202c;" contenteditable="true">
        Características Principales
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <div style="padding: 2rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
          <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #2d3748;" contenteditable="true">Rápido</h3>
          <p style="color: #718096; line-height: 1.6;" contenteditable="true">Implementación en minutos, no en días. Todo listo para usar.</p>
        </div>
        <div style="padding: 2rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">💡</div>
          <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #2d3748;" contenteditable="true">Intuitivo</h3>
          <p style="color: #718096; line-height: 1.6;" contenteditable="true">Interfaz diseñada para ser simple y fácil de usar.</p>
        </div>
        <div style="padding: 2rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
          <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #2d3748;" contenteditable="true">Potente</h3>
          <p style="color: #718096; line-height: 1.6;" contenteditable="true">Todas las funcionalidades que necesitas en un solo lugar.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 5rem 2rem; text-align: center;">
    <div style="max-width: 800px; margin: 0 auto;">
      <h2 style="font-size: 2.5rem; font-weight: bold; color: white; margin-bottom: 1.5rem;" contenteditable="true">
        ¿Listo para comenzar?
      </h2>
      <p style="font-size: 1.25rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem;" contenteditable="true">
        Únete a miles de usuarios satisfechos hoy mismo
      </p>
      <button style="background: white; color: #667eea; padding: 1rem 3rem; border-radius: 0.5rem; font-size: 1.25rem; font-weight: 600; border: none; cursor: pointer;" contenteditable="true">
        Empezar Gratis
      </button>
    </div>
  </div>

  <!-- Footer -->
  <div style="background: #1a202c; padding: 2rem; text-align: center; color: rgba(255,255,255,0.7);">
    <p contenteditable="true">© 2025 Tu Empresa. Todos los derechos reservados.</p>
  </div>
</div>
`.trim();
