# Motion Dojo — Website & Paystack Integration

Motion Dojo website with interactive curriculum, student stories, project showcase, and Paystack payment enrolment with server-side verification.

---

## Hosting Platform

This project is configured and set up for **Vercel** (`vercel.json` in the root directory).

When deployed to Vercel:
- Static assets (`index.html`, `styles.css`, `script.js`, `assets/`, etc.) are served from the global edge network.
- Serverless functions located in the [`/api`](./api) folder (`api/verify-payment.js` and `api/paystack-webhook.js`) run automatically as Vercel Serverless Functions on Node.js.

---

## Serverless Payment Endpoints

### 1. Payment Verification Endpoint: `/api/verify-payment`
- **Method**: `POST` (or `GET`)
- **Payload**: `{ "reference": "MD-..." }`
- **Purpose**: Called automatically by the front-end when Paystack Inline returns a successful transaction.
- **Security & Integrity Checks**:
  - Securely queries `GET https://api.paystack.co/transaction/verify/:reference` using the server-side `PAYSTACK_SECRET_KEY`.
  - Confirms `status === "success"`.
  - Confirms `amount === 4000000` (4,000,000 kobo = ₦40,000).
  - Confirms `currency === "NGN"`.
  - Only when all checks pass does it return `{ "verified": true }`, allowing the client to transition to the success screen.

### 2. Paystack Webhook Handler: `/api/paystack-webhook`
- **Method**: `POST`
- **Headers**: `x-paystack-signature`
- **Purpose**: Receives asynchronous event notifications directly from Paystack (e.g. `charge.success`).
- **Security & Integrity Checks**:
  - Computes HMAC SHA512 of the raw request payload with `PAYSTACK_SECRET_KEY`.
  - Compares hash against the incoming `x-paystack-signature` header; rejects unauthenticated requests with `401 Unauthorized`.
  - Logs verified successful charges with transaction reference, customer details, amount, and timestamp.

---

## Environment Variables

Configure the following environment variable on your hosting platform:

| Variable | Description | Where to Set | Example (Test) | Example (Live) |
|---|---|---|---|---|
| `PAYSTACK_SECRET_KEY` | Secret key used for server-side transaction verification and webhook signature validation | **Vercel Project Settings > Environment Variables** (or local shell) | `sk_test_...` | `sk_live_...` |

> [!WARNING]
> **Never commit or expose your Secret Key (`PAYSTACK_SECRET_KEY`) on the client side or in git.** Only the Public Key belongs on the front end.

---

## Client Configuration (`config.js`)

Public settings are located in [`config.js`](./config.js):

```javascript
window.MOTION_DOJO_CONFIG = Object.freeze({
  PAYSTACK_PUBLIC_KEY: 'pk_test_REPLACE_ME', // Replace with your Paystack Public Key
  AMOUNT_KOBO: 4000000,                      // ₦40,000 in kobo
  COURSE_NAME: 'Black Belt in Motion Design',
  CURRENCY: 'NGN'
});
```

---

## How to Switch from Test Keys to Live Keys

Follow these steps when moving to production:

1. **Obtain Live Keys from Paystack**:
   - Log in to your [Paystack Dashboard](https://dashboard.paystack.com/).
   - Go to **Settings > API Keys & Webhooks**.
   - Copy your **Live Public Key** (`pk_live_...`) and **Live Secret Key** (`sk_live_...`).

2. **Update Client Public Key**:
   - Open [`config.js`](./config.js).
   - Replace `'pk_test_REPLACE_ME'` with your Live Public Key:
     ```javascript
     PAYSTACK_PUBLIC_KEY: 'pk_live_YOUR_LIVE_PUBLIC_KEY',
     ```

3. **Update Server Secret Key in Vercel**:
   - Go to your Vercel Dashboard and select the **Motion Dojo** project.
   - Navigate to **Settings > Environment Variables**.
   - Add or update `PAYSTACK_SECRET_KEY` with your Live Secret Key (`sk_live_YOUR_LIVE_SECRET_KEY`).
   - Ensure it is checked for **Production** (and **Preview** if desired).
   - Trigger a new deployment (or redeploy the latest commit) for the environment variable changes to take effect.

4. **Set Paystack Live Webhook URL**:
   - In your Paystack Dashboard (**Settings > API Keys & Webhooks**):
   - Set **Live Webhook URL** to:
     ```
     https://your-domain.com/api/paystack-webhook
     ```
   - Click **Save Changes**.

---

## Running Locally

To test locally:
```bash
# Set your Paystack secret key in your terminal session
# PowerShell:
$env:PAYSTACK_SECRET_KEY="sk_test_YOUR_TEST_SECRET_KEY"

# Or Bash:
export PAYSTACK_SECRET_KEY="sk_test_YOUR_TEST_SECRET_KEY"

# Start the local development server (supports both static files and /api endpoints)
node serve.js
```
The application will be accessible at `http://127.0.0.1:3000/`.
