import { db } from '../server/db.js';
import { planLimits, usageTracking } from '../shared/schema.js';
import { sql } from 'drizzle-orm';

async function initPlanLimits() {
  console.log('Creating plan_limits table...');
  
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS plan_limits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plan_name VARCHAR(50) NOT NULL UNIQUE,
        max_contacts INT NOT NULL,
        max_emails_per_month INT NOT NULL,
        max_landing_pages INT NOT NULL,
        max_automations INT NOT NULL,
        custom_domain_allowed INT NOT NULL DEFAULT 0,
        priority_support INT NOT NULL DEFAULT 0
      )
    `);
    console.log('✓ plan_limits table created');
  } catch (error) {
    console.log('plan_limits table already exists or error:', error);
  }

  console.log('Creating usage_tracking table...');
  
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS usage_tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        month VARCHAR(7) NOT NULL,
        emails_sent INT NOT NULL DEFAULT 0,
        contacts_count INT NOT NULL DEFAULT 0,
        landings_count INT NOT NULL DEFAULT 0,
        automations_count INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ usage_tracking table created');
  } catch (error) {
    console.log('usage_tracking table already exists or error:', error);
  }

  console.log('Adding PayPal fields to subscriptions table...');
  
  try {
    await db.execute(sql`
      ALTER TABLE subscriptions 
      ADD COLUMN IF NOT EXISTS paypal_subscription_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS paypal_plan_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS billing_cycle_anchor DATE,
      ADD COLUMN IF NOT EXISTS last_billing_date DATE
    `);
    console.log('✓ PayPal fields added to subscriptions');
  } catch (error) {
    console.log('PayPal fields already exist or error:', error);
  }

  console.log('Inserting plan limits...');
  
  const plans = [
    {
      planName: 'Free',
      maxContacts: 100,
      maxEmailsPerMonth: 300,
      maxLandingPages: 1,
      maxAutomations: 1,
      customDomainAllowed: 0,
      prioritySupport: 0
    },
    {
      planName: 'Starter',
      maxContacts: 500,
      maxEmailsPerMonth: 1500,
      maxLandingPages: 3,
      maxAutomations: 3,
      customDomainAllowed: 0,
      prioritySupport: 0
    },
    {
      planName: 'Essential',
      maxContacts: 2500,
      maxEmailsPerMonth: 7500,
      maxLandingPages: 10,
      maxAutomations: 10,
      customDomainAllowed: 0,
      prioritySupport: 0
    },
    {
      planName: 'Professional',
      maxContacts: 10000,
      maxEmailsPerMonth: 25000,
      maxLandingPages: 25,
      maxAutomations: 25,
      customDomainAllowed: 0,
      prioritySupport: 1
    },
    {
      planName: 'Business',
      maxContacts: -1, // Unlimited
      maxEmailsPerMonth: 100000,
      maxLandingPages: -1, // Unlimited
      maxAutomations: -1, // Unlimited
      customDomainAllowed: 1,
      prioritySupport: 1
    }
  ];

  for (const plan of plans) {
    try {
      await db.insert(planLimits).values(plan).onDuplicateKeyUpdate({ set: plan });
      console.log(`✓ ${plan.planName} limits set`);
    } catch (error) {
      console.log(`${plan.planName} already exists or error:`, error);
    }
  }

  console.log('✅ Plan limits initialization complete!');
  process.exit(0);
}

initPlanLimits().catch((error) => {
  console.error('Error initializing plan limits:', error);
  process.exit(1);
});
