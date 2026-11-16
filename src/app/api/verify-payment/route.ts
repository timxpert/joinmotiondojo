/**
 * Confirms a Paystack payment on the server before the visitor sees "Payment received".
 * Needs PAYSTACK_SECRET_KEY in the Vercel project's environment variables.
 * The secret key must never be committed or sent to the browser.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EXPECTED_AMOUNT = 4000000; // ₦40,000 in kobo
const EXPECTED_CURRENCY = 'NGN';

/** Records the enrolment in Connect and returns the student's sign-in ID (null until Supabase is set up). */
async function enrol(email: string | undefined, reference: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !email) return null;
  try {
    const res = await fetch(`${url}/rest/v1/rpc/mark_enrolled`, {
      method: 'POST',
      headers: {
        apikey: key,
        ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_email: email, payment_reference: reference }),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[connect] mark_enrolled failed', res.status, await res.text());
      return null;
    }
    const id = await res.json().catch(() => null);
    return typeof id === 'string' ? id : null;
  } catch (e) {
    console.error('[connect] mark_enrolled error', e);
    return null;
  }
}

async function verify(reference: string | null | undefined) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return Response.json({ verified: false, message: 'Payment verification is not set up yet.' }, { status: 500 });
  }
  const ref = typeof reference === 'string' ? reference.trim() : '';
  if (!ref || !/^[A-Za-z0-9_.=-]{4,100}$/.test(ref)) {
    return Response.json({ verified: false, message: 'A valid payment reference is required.' }, { status: 400 });
  }

  let payload: { status?: boolean; message?: string; data?: Record<string, unknown> } | null = null;
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: 'no-store',
    });
    payload = await res.json().catch(() => null);
    if (!res.ok || !payload?.status) {
      return Response.json(
        { verified: false, message: payload?.message || 'We couldn’t find that payment.' },
        { status: 400 },
      );
    }
  } catch {
    return Response.json({ verified: false, message: 'We couldn’t reach Paystack.' }, { status: 502 });
  }

  const data = payload.data || {};
  const ok = data.status === 'success' && data.amount === EXPECTED_AMOUNT && data.currency === EXPECTED_CURRENCY;
  if (!ok) {
    return Response.json(
      { verified: false, message: 'The payment wasn’t completed for the right amount.' },
      { status: 400 },
    );
  }

  const customer = (data.customer || {}) as { email?: string };
  const studentId = await enrol(customer.email, String(data.reference || ref));
  return Response.json({
    studentId,
    verified: true,
    reference: data.reference,
    amount: data.amount,
    currency: data.currency,
    email: customer.email,
    paidAt: data.paid_at,
  });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { reference?: string };
  return verify(body.reference);
}

export async function GET(req: Request) {
  return verify(new URL(req.url).searchParams.get('reference'));
}
