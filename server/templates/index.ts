import { readFileSync } from 'fs';
import { join } from 'path';

export interface BaseTemplate {
  id: string;
  name: string;
  description: string;
  type: 'Landing' | 'Email';
  category: string;
  filePath: string;
}

export const BASE_TEMPLATES: BaseTemplate[] = [
  {
    id: 'consultoria',
    name: 'Consultoría Profesional',
    description: 'Landing optimizada para móvil con formulario de captura de leads. Ideal para consultores y servicios B2B.',
    type: 'Landing',
    category: 'Servicios',
    filePath: 'landings/consultoria.html',
  },
  {
    id: 'agencia-digital',
    name: 'Agencia Digital',
    description: 'Diseño moderno y minimalista con formulario integrado. Perfecto para agencias de marketing y desarrollo web.',
    type: 'Landing',
    category: 'Servicios',
    filePath: 'landings/agencia-digital.html',
  },
  {
    id: 'servicios-profesionales',
    name: 'Servicios Profesionales',
    description: 'Landing elegante y profesional con formulario de contacto. Ideal para servicios B2B y consultorías.',
    type: 'Landing',
    category: 'Servicios',
    filePath: 'landings/servicios-profesionales.html',
  },
];

/**
 * Loads template content from filesystem
 */
export function loadTemplateContent(templateId: string): string {
  const template = BASE_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }
  
  const fullPath = join(__dirname, template.filePath);
  return readFileSync(fullPath, 'utf-8');
}

/**
 * Get all base templates with their metadata
 */
export function getBaseTemplates(filters?: { type?: string; category?: string; search?: string }) {
  let templates = [...BASE_TEMPLATES];
  
  if (filters?.type) {
    templates = templates.filter(t => t.type === filters.type);
  }
  
  if (filters?.category) {
    templates = templates.filter(t => t.category === filters.category);
  }
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    templates = templates.filter(t =>
      t.name.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower)
    );
  }
  
  return templates;
}
