import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";

// Example createServerFn. Server-side handler invoked from the client:
//   const result = await getGreeting({ data: { name: "Ada" } })
// The .handler body runs server-only — imports used only inside it (like
// .server.ts modules) are tree-shaken from the client bundle. Module-level
// code here still ships to the client; for truly server-only helpers, put
// them in a .server.ts file. Use this pattern instead of Supabase Edge
// Functions for server logic.

export const getGreeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1) }))
  .handler(async ({ data }) => {
    const config = getServerConfig();
    return {
      greeting: `Hello, ${data.name}!`,
      mode: config.nodeEnv ?? "unknown",
    };
  });

export const getBackendHealth = createServerFn({ method: "GET" })
  .handler(async () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const response = await fetch(`${backendUrl}/health`);
      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
      const data = (await response.json()) as { status: string; service: string; version: string };
      return {
        connected: true,
        data,
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });

export const getClientBalance = createServerFn({ method: "GET" })
  .handler(async () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "ck_demo_key_1234567890123456789012345678901234567890123456789012345678901234";

    try {
      const response = await fetch(`${backendUrl}/v1/balance`, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = (await response.json()) as {
        available_balance: number;
        blocked_balance: number;
        total_balance: number;
        currency: string;
        updated_at: string;
      };

      return {
        success: true,
        availableBalance: data.available_balance / 100,
        blockedBalance: data.blocked_balance / 100,
        totalBalance: data.total_balance / 100,
        currency: data.currency,
        updatedAt: data.updated_at
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  });
