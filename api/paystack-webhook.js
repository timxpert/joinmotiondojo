/**
 * /api/paystack-webhook
 * Paystack Webhook Handler
 * Validates x-paystack-signature using HMAC SHA512 with PAYSTACK_SECRET_KEY,
 * and logs successful charges (charge.success).
 */

const crypto = require('crypto');

async function getRawBody(req) {
  // If already parsed or buffered
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf8');
  }
  if (typeof req.body === 'string') {
    return req.body;
  }
  if (req.rawBody) {
    return typeof req.rawBody === 'string' ? req.rawBody : req.rawBody.toString('utf8');
  }

  // Read incoming stream
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error('[Webhook] Missing PAYSTACK_SECRET_KEY environment variable');
    return res.status(500).json({ message: 'Server configuration error: missing secret key.' });
  }

  const signature = req.headers['x-paystack-signature'];
  if (!signature) {
    console.warn('[Webhook] Missing x-paystack-signature header');
    return res.status(401).json({ message: 'Missing signature header' });
  }

  let rawBody = '';
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error('[Webhook] Error reading request body:', err);
    return res.status(400).json({ message: 'Could not read request body' });
  }

  // Validate HMAC SHA512 signature
  const expectedSignature = crypto
    .createHmac('sha512', secretKey.trim())
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    console.warn('[Webhook] Invalid signature received:', {
      received: signature,
      expected: expectedSignature
    });
    return res.status(401).json({ message: 'Invalid webhook signature' });
  }

  let eventPayload = null;
  try {
    eventPayload = JSON.parse(rawBody);
  } catch (e) {
    console.error('[Webhook] Failed to parse JSON body:', e);
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }

  const eventType = eventPayload.event;
  const eventData = eventPayload.data;

  // Log successful charges
  if (eventType === 'charge.success') {
    const logInfo = {
      event: eventType,
      reference: eventData?.reference,
      amount: eventData?.amount,
      currency: eventData?.currency,
      customerEmail: eventData?.customer?.email,
      customerName: eventData?.customer?.first_name || eventData?.metadata?.custom_fields?.find(f => f.variable_name === 'customer_name')?.value,
      whatsappNumber: eventData?.metadata?.custom_fields?.find(f => f.variable_name === 'whatsapp_number')?.value,
      courseName: eventData?.metadata?.custom_fields?.find(f => f.variable_name === 'course_name')?.value,
      paidAt: eventData?.paid_at,
      channel: eventData?.channel
    };

    console.log('[Paystack Webhook] Charge successful:', JSON.stringify(logInfo, null, 2));
  } else {
    console.log(`[Paystack Webhook] Received event: ${eventType} (reference: ${eventData?.reference || 'N/A'})`);
  }

  // Acknowledge receipt to Paystack
  return res.status(200).json({ received: true });
};

// Disable Vercel's default bodyParser to access raw body for HMAC SHA512 computation
module.exports.config = {
  api: {
    bodyParser: false
  }
};
