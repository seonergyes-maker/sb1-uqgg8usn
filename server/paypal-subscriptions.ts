import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

function getPayPalCredentials() {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
  
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.");
  }
  
  return { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET };
}

export async function getPayPalAccessToken(): Promise<string> {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = getPayPalCredentials();
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await axios({
    method: 'POST',
    url: `${BASE_URL}/v1/oauth2/token`,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=client_credentials'
  });

  return response.data.access_token;
}

export interface ProductData {
  name: string;
  description: string;
}

export async function createProduct(data: ProductData): Promise<string> {
  const accessToken = await getPayPalAccessToken();

  const response = await axios({
    method: 'POST',
    url: `${BASE_URL}/v1/catalogs/products`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `PRODUCT-${Date.now()}`
    },
    data: {
      name: data.name,
      description: data.description,
      type: 'SERVICE',
      category: 'SOFTWARE'
    }
  });

  return response.data.id;
}

export interface PlanData {
  productId: string;
  name: string;
  description: string;
  price: string;
  currency: string;
}

export async function createBillingPlan(data: PlanData): Promise<string> {
  const accessToken = await getPayPalAccessToken();

  const response = await axios({
    method: 'POST',
    url: `${BASE_URL}/v1/billing/plans`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `PLAN-${Date.now()}`
    },
    data: {
      product_id: data.productId,
      name: data.name,
      description: data.description,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: data.price,
              currency_code: data.currency
            }
          }
        }
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: data.currency
        },
        payment_failure_threshold: 3
      }
    }
  });

  return response.data.id;
}

export async function getSubscriptionDetails(subscriptionId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await axios({
    method: 'GET',
    url: `${BASE_URL}/v1/billing/subscriptions/${subscriptionId}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  return response.data;
}

export async function cancelSubscription(subscriptionId: string, reason: string = 'User requested cancellation') {
  const accessToken = await getPayPalAccessToken();

  await axios({
    method: 'POST',
    url: `${BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    data: {
      reason
    }
  });

  return { success: true };
}

export async function verifyWebhookSignature(
  webhookId: string,
  headers: any,
  body: any
): Promise<boolean> {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/v1/notifications/verify-webhook-signature`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        transmission_id: headers['paypal-transmission-id'],
        transmission_time: headers['paypal-transmission-time'],
        cert_url: headers['paypal-cert-url'],
        auth_algo: headers['paypal-auth-algo'],
        transmission_sig: headers['paypal-transmission-sig'],
        webhook_id: webhookId,
        webhook_event: body
      }
    });

    return response.data.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

export const PLAN_CONFIGS = {
  'Starter': {
    name: 'Plan Starter',
    description: 'Plan básico para empezar',
    price: '0.00',
    currency: 'EUR'
  },
  'Essential': {
    name: 'Plan Essential',
    description: 'Plan esencial para crecer',
    price: '29.00',
    currency: 'EUR'
  },
  'Professional': {
    name: 'Plan Professional',
    description: 'Plan profesional completo',
    price: '79.00',
    currency: 'EUR'
  },
  'Business': {
    name: 'Plan Business',
    description: 'Plan empresarial avanzado',
    price: '199.00',
    currency: 'EUR'
  }
};
