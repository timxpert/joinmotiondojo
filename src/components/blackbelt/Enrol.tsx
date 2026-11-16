'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ENROL } from '@/data/blackbelt';
import { Close } from '../Icons';

/* ------------------------------------------------------------------
   Enrolment: any "Enrol now" button opens the dialog through a window
   event, so buttons anywhere on the page stay simple.
   Flow (same as joinmotiondojo): choose how to pay -> details -> Paystack
   -> server-side verification at /api/verify-payment -> success.
------------------------------------------------------------------- */

const OPEN_EVENT = 'md:enrol';
const PAYSTACK_SRC = 'https://js.paystack.co/v2/inline.js';

type PaystackPopLike = { newTransaction: (opts: Record<string, unknown>) => void };

export function EnrolButton({ className = 'btn btn-primary', children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      {children}
    </button>
  );
}

/** Loads Paystack's inline script once and resolves with a usable instance. */
function loadPaystack(): Promise<PaystackPopLike> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { PaystackPop?: unknown };
    const ready = () => {
      const P = w.PaystackPop as unknown;
      if (!P) return reject(new Error('Paystack did not load'));
      const inst =
        typeof (P as PaystackPopLike).newTransaction === 'function'
          ? (P as PaystackPopLike)
          : new (P as new () => PaystackPopLike)();
      resolve(inst);
    };
    if (w.PaystackPop) return ready();
    let tag = document.querySelector<HTMLScriptElement>(`script[src="${PAYSTACK_SRC}"]`);
    if (!tag) {
      tag = document.createElement('script');
      tag.src = PAYSTACK_SRC;
      tag.async = true;
      document.head.appendChild(tag);
    }
    tag.addEventListener('load', ready, { once: true });
    tag.addEventListener('error', () => reject(new Error('Paystack did not load')), { once: true });
    // A slow or blocked network can leave the script hanging: give up after 15 seconds
    window.setTimeout(() => reject(new Error('Paystack timed out')), 15000);
  });
}

type Step = 'choose' | 'details' | 'success';

export function EnrolModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('choose');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [reference, setReference] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus();
  }, []);

  useEffect(() => {
    const onOpen = () => {
      lastFocus.current = document.activeElement as HTMLElement;
      setStep('choose');
      setStatus('');
      setShowFallback(false);
      setOpen(true);
      loadPaystack().catch(() => {}); // warm up while the visitor reads
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && close();
    window.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('button, a, input')?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, step, busy, close]);

  const fail = (message: string) => {
    setBusy(false);
    setStatus(message);
    setShowFallback(true);
  };

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (!name || !email || !phone) {
      setStatus('Fill in your name, email address and WhatsApp number to continue.');
      return;
    }
    setBusy(true);
    setStatus('');
    setShowFallback(false);

    let paystack: PaystackPopLike;
    try {
      paystack = await loadPaystack();
    } catch {
      fail('The payment window could not load. Check your connection and try again, or get our account number on WhatsApp.');
      return;
    }

    const ref = 'MD-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    try {
      paystack.newTransaction({
        key: ENROL.paystackPublicKey,
        email,
        amount: ENROL.amountKobo,
        currency: ENROL.currency,
        ref,
        metadata: {
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
            { display_name: 'WhatsApp Number', variable_name: 'whatsapp_number', value: phone },
            { display_name: 'Course Name', variable_name: 'course_name', value: ENROL.courseName },
          ],
        },
        onSuccess: async (tx: { reference?: string; ref?: string }) => {
          const finalRef = tx?.reference || tx?.ref || ref;
          setStatus('Confirming your payment…');
          try {
            const res = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reference: finalRef }),
            });
            const data = await res.json().catch(() => null);
            if (res.ok && data?.verified === true) {
              setBusy(false);
              setReference(finalRef);
              setStep('success');
            } else {
              fail(
                `${data?.message || 'We couldn’t confirm the payment.'} If you were debited, message us on WhatsApp with your reference: ${finalRef}.`,
              );
            }
          } catch {
            fail(`We couldn’t confirm the payment because of a network error. Keep your reference, ${finalRef}, and message us on WhatsApp.`);
          }
        },
        onCancel: () => {
          setBusy(false);
          setStatus('Payment wasn’t completed. You can try again.');
        },
      });
    } catch {
      fail('The payment window could not open. Prefer a bank transfer? Get our account number on WhatsApp.');
    }
  };

  if (!open) return null;

  return (
    <div className="modal enrol" role="dialog" aria-modal="true" aria-labelledby="enrol-title" onClick={(e) => e.target === e.currentTarget && !busy && close()}>
      <div className="enrol-panel" ref={panelRef}>
        <button type="button" className="enrol-close" onClick={close} aria-label="Close" disabled={busy}>
          <Close />
        </button>

        {step === 'choose' && (
          <div className="enrol-step" key="choose">
            <h2 className="enrol-title" id="enrol-title">
              How would you like to pay?
            </h2>
            <p className="enrol-sub">
              {ENROL.courseName}: {ENROL.priceLabel}
            </p>
            <div className="enrol-options">
              <button type="button" className="enrol-option" onClick={() => setStep('details')}>
                <span className="enrol-option-title">Pay with Paystack</span>
                <span>Pay {ENROL.priceLabel} securely by card, bank transfer or USSD.</span>
              </button>
              <a className="enrol-option" href={ENROL.accountNumberUrl} target="_blank" rel="noopener noreferrer">
                <span className="enrol-option-title">Request our account number</span>
                <span>Prefer a direct bank transfer? Get our account number on WhatsApp.</span>
              </a>
            </div>
            <p className="enrol-note">
              Prefer two instalments? 2 × {ENROL.instalmentLabel} = {ENROL.priceLabel} total.{' '}
              <a href={ENROL.instalmentUrl} target="_blank" rel="noopener noreferrer">
                Start your instalment on WhatsApp
              </a>
            </p>
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={pay} noValidate className="enrol-step" key="details">
            <button type="button" className="enrol-back" onClick={() => setStep('choose')} disabled={busy}>
              Back
            </button>
            <h2 className="enrol-title" id="enrol-title">
              Your details
            </h2>
            <p className="enrol-sub">
              {ENROL.courseName}: {ENROL.priceLabel}
            </p>
            <label className="field">
              <span>Full name</span>
              <input
                id="enrol-name"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Email address</span>
              <input
                id="enrol-email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="field">
              <span>WhatsApp number</span>
              <input
                id="enrol-phone"
                type="tel"
                autoComplete="tel"
                required
                placeholder="+234"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <small>Include your country code, for example +234.</small>
            </label>

            {status && (
              <p className="enrol-status" role="status">
                {status}
              </p>
            )}
            {showFallback && (
              <a className="enrol-fallback" href={ENROL.accountNumberUrl} target="_blank" rel="noopener noreferrer">
                Request our account number on WhatsApp
              </a>
            )}

            <button type="submit" className="btn btn-primary enrol-submit" disabled={busy}>
              {busy ? 'Opening payment…' : `Pay ${ENROL.priceLabel}`}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="enrol-step" key="success">
            <svg className="enrol-check" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
              <circle cx="32" cy="32" r="29" />
              <path d="M20 33l8 8 16-17" />
            </svg>
            <h2 className="enrol-title" id="enrol-title">
              Payment received
            </h2>
            <p className="enrol-sub">
              Our community manager will reach out on WhatsApp shortly to give you access. Keep your reference:{' '}
              <strong>{reference}</strong>
            </p>
            <a className="btn btn-lime" href={ENROL.accountNumberUrl} target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
