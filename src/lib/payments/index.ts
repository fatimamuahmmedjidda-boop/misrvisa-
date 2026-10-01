import { PaystackProvider } from "./paystack";
import type { PaymentProvider } from "./types";

export * from "./types";

const providers: Record<string, PaymentProvider> = {
  PAYSTACK: new PaystackProvider(),
  // FLUTTERWAVE: new FlutterwaveProvider(),  ← add here; no business code changes
};

export function getPaymentProvider(name = process.env.PAYMENT_PROVIDER ?? "PAYSTACK"): PaymentProvider | null {
  return providers[name.toUpperCase()] ?? null;
}

export function getConfiguredProvider(): PaymentProvider | null {
  const provider = getPaymentProvider();
  return provider?.isConfigured() ? provider : null;
}

export function listProviders() {
  return Object.values(providers).map((p) => ({
    name: p.name,
    configured: p.isConfigured(),
    currencies: p.supportedCurrencies,
  }));
}
