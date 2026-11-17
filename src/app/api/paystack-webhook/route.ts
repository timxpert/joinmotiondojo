import crypto from 'node:crypto';

/**
 * Paystack webhook. In the Paystack dashboard set the webhook URL to
 * https://<your domain>/api/paystack-webhook. Needs PAYSTACK_SECRET_KEY on the server.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Records the enrolment in Supabase (Motion Dojo Connect). Skipped until Supabase is set up. */
async function markEnrolled(email: string, reference: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    const res = await fetch(`${url}/rest/v1/rpc/mark_enrolled`, {
      method: 'POST',
      // New Supabase secret keys (sb_secret_…) go in the apikey header only;
      // legacy service_role keys are JWTs and also go in Authorization.
      headers: {
        apikey: key,
        ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_email: email, payment_reference: reference }),
    });
    if (!res.ok) console.error('[connect] mark_enrolled failed', res.status, await res.text());
  } catch (e) {
    console.error('[connect] mark_enrolled error', e);
  }
}

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return new Response('Not configured', { status: 500 });

  const raw = await req.text();
  const signature = req.headers.get('x-paystack-signature') || '';
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex');

  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return new Response('Invalid signature', { status: 401 });

  let event: { event?: string; data?: Record<string, unknown> } = {};
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response('Bad payload', { status: 400 });
  }

  if (event.event === 'charge.success') {
    const d = event.data || {};
    const customer = (d.customer || {}) as { email?: string };
    console.log('[paystack] charge.success', {
      reference: d.reference,
      amount: d.amount,
      currency: d.currency,
      email: customer.email,
      metadata: d.metadata,
    });
    // Course paid in full: the student's Connect account gets the Black Belt badge
    if (customer.email && d.amount === 4000000 && d.currency === 'NGN') {
      await markEnrolled(customer.email, String(d.reference || ''));
    }
  }

  return new Response('ok', { status: 200 });
}
