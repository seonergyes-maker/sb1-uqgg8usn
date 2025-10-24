export interface EmailVariables {
  nombre?: string;
  email?: string;
  empresa?: string;
  unsubscribe_link?: string;
  [key: string]: string | undefined;
}

export function replaceEmailVariables(
  content: string,
  variables: EmailVariables
): string {
  let processedContent = content;

  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processedContent = processedContent.replace(regex, value);
    }
  });

  processedContent = processedContent.replace(/{{[^}]+}}/g, '');

  return processedContent;
}

export function generateUnsubscribeLink(
  leadEmail: string,
  clientId: number,
  baseUrl?: string
): string {
  const base = baseUrl || process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
  const encodedEmail = encodeURIComponent(leadEmail);
  return `https://${base}/api/public/unsubscribe?email=${encodedEmail}&clientId=${clientId}`;
}

export function extractVariablesFromContent(content: string): string[] {
  const regex = /{{([^}]+)}}/g;
  const variables = new Set<string>();
  let match;

  while ((match = regex.exec(content)) !== null) {
    variables.add(match[1].trim());
  }

  return Array.from(variables);
}
