/**
 * /api/verify-payment
 * Serverless function to verify Paystack transactions securely using the secret key.
 * Confirms status is "success", amount is 4000000 kobo (₦40,000), and currency is "NGN".
 */

module.exports = async function handler(req, res) {
  // Set CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      verified: false,
      message: 'Method not allowed. Use POST or GET.'
    });
  }

  // Retrieve reference from query or body
  let reference = '';
  if (req.method === 'GET') {
    reference = req.query?.reference || '';
  } else if (req.method === 'POST') {
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        reference = parsed.reference || parsed.ref || '';
      } catch (e) {
        reference = '';
      }
    } else if (req.body && typeof req.body === 'object') {
      reference = req.body.reference || req.body.ref || '';
    }

    if (!reference && req.query?.reference) {
      reference = req.query.reference;
    }
  }

  reference = (reference || '').trim();

  if (!reference) {
    return res.status(400).json({
      verified: false,
      message: 'Missing payment reference.'
    });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error('Missing PAYSTACK_SECRET_KEY environment variable');
    return res.status(500).json({
      verified: false,
      message: 'Server error: PAYSTACK_SECRET_KEY is not configured.'
    });
  }

  try {
    const paystackUrl = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    const response = await fetch(paystackUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey.trim()}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      return res.status(400).json({
        verified: false,
        message: result.message || 'Transaction verification failed on Paystack.'
      });
    }

    const data = result.data;

    // Strict validation rules:
    // 1. status === 'success'
    // 2. amount === 4000000 kobo (₦40,000)
    // 3. currency === 'NGN'
    const isSuccess = data && data.status === 'success';
    const isExpectedAmount = data && Number(data.amount) === 4000000;
    const isExpectedCurrency = data && data.currency === 'NGN';

    if (!isSuccess) {
      return res.status(400).json({
        verified: false,
        message: `Transaction status is not successful (status: ${data?.status || 'unknown'}).`
      });
    }

    if (!isExpectedAmount) {
      return res.status(400).json({
        verified: false,
        message: `Transaction amount mismatch (received: ${data?.amount}, expected: 4000000 kobo).`
      });
    }

    if (!isExpectedCurrency) {
      return res.status(400).json({
        verified: false,
        message: `Transaction currency mismatch (received: ${data?.currency}, expected: NGN).`
      });
    }

    // Successfully verified!
    return res.status(200).json({
      verified: true,
      reference: data.reference,
      amount: data.amount,
      currency: data.currency,
      customer: {
        email: data.customer?.email,
        name: data.customer?.first_name || data.metadata?.custom_fields?.find(f => f.variable_name === 'customer_name')?.value || ''
      },
      paidAt: data.paid_at
    });
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return res.status(500).json({
      verified: false,
      message: 'Internal server error during payment verification.'
    });
  }
};
