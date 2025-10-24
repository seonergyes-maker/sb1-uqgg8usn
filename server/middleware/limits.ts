import { Request, Response, NextFunction } from "express";
import { storage } from "../storage.js";
import { AuthRequest } from "../auth.js";

export type LimitType = "contacts" | "emails" | "landings" | "automations";

interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  message?: string;
}

/**
 * Check if a user has reached their limit for a specific resource type
 */
export async function checkLimit(
  clientId: number,
  limitType: LimitType
): Promise<LimitCheckResult> {
  // Get user's plan
  const user = await storage.getClientById(clientId);
  if (!user) {
    return {
      allowed: false,
      current: 0,
      limit: 0,
      message: "Usuario no encontrado"
    };
  }

  // Get plan limits
  const planLimits = await storage.getPlanLimitByName(user.plan);
  if (!planLimits) {
    return {
      allowed: false,
      current: 0,
      limit: 0,
      message: "Límites del plan no encontrados"
    };
  }

  // Get current usage
  const usage = await storage.getCurrentUsage(clientId);

  let current = 0;
  let limit = 0;

  switch (limitType) {
    case "contacts":
      current = usage.contactsCount;
      limit = planLimits.maxContacts;
      break;
    case "emails":
      current = usage.emailsSent;
      limit = planLimits.maxEmailsPerMonth;
      break;
    case "landings":
      current = usage.landingsCount;
      limit = planLimits.maxLandingPages;
      break;
    case "automations":
      current = usage.automationsCount;
      limit = planLimits.maxAutomations;
      break;
  }

  // Unlimited (-1) means always allowed
  if (limit === -1) {
    return {
      allowed: true,
      current,
      limit: -1
    };
  }

  // Check if limit is exceeded
  const allowed = current < limit;

  return {
    allowed,
    current,
    limit,
    message: allowed ? undefined : `Has alcanzado el límite de ${limitType} para tu plan (${current}/${limit})`
  };
}

/**
 * Middleware to check limits before allowing an action
 */
export function requireLimit(limitType: LimitType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthRequest;
      const clientId = authReq.user?.id;

      if (!clientId) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const limitCheck = await checkLimit(clientId, limitType);

      if (!limitCheck.allowed) {
        return res.status(403).json({
          error: limitCheck.message || "Límite alcanzado",
          current: limitCheck.current,
          limit: limitCheck.limit,
          limitType
        });
      }

      // Attach limit info to request for logging/tracking
      (req as any).limitCheck = limitCheck;
      next();
    } catch (error) {
      console.error("Error checking limits:", error);
      return res.status(500).json({ error: "Error al verificar límites" });
    }
  };
}

/**
 * Update usage count after a successful action
 */
export async function incrementUsage(
  clientId: number,
  limitType: LimitType,
  amount: number = 1
): Promise<void> {
  const usage = await storage.getCurrentUsage(clientId);
  
  const updates: any = {};

  switch (limitType) {
    case "contacts":
      updates.contactsCount = usage.contactsCount + amount;
      break;
    case "emails":
      updates.emailsSent = usage.emailsSent + amount;
      break;
    case "landings":
      updates.landingsCount = usage.landingsCount + amount;
      break;
    case "automations":
      updates.automationsCount = usage.automationsCount + amount;
      break;
  }

  await storage.updateUsage(clientId, updates);
}
