'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { shakeField } from '@/lib/shake';
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


/* Icons for the ways to pay (24px grid, 1.8px stroke, like the rest of the site) */
const PayIcon = ({ name }: { name: 'card' | 'split' | 'bank' | 'whatsapp' | 'lock' | 'arrow' }) => {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  switch (name) {
    case 'card':
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
          <path d="M3 10h18M7 15h3" />
        </svg>
      );
    case 'split':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 3.5v17" />
          <path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'bank':
      return (
        <svg {...common}>
          <path d="M3.5 9 12 4.5 20.5 9" />
          <path d="M5.5 10v7M10 10v7M14 10v7M18.5 10v7" />
          <path d="M3.5 19.5h17" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common} width={14} height={14}>
          <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...common} width={18} height={18} strokeWidth={2}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z" />
        </svg>
      );
  }
};

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
  const [step, setStepRaw] = useState<Step>('choose');
  // which way the steps slide: forward comes in from the right, back from the left
  const [dir, setDir] = useState<'next' | 'back'>('next');
  const ORDER: Step[] = ['choose', 'details', 'success'];
  const setStep = (to: Step) => {
    setDir(ORDER.indexOf(to) < ORDER.indexOf(step) ? 'back' : 'next');
    setStepRaw(to);
  };
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [reference, setReference] = useState('');
  const [studentId, setStudentId] = useState<string | null>(null);
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
      if (!name) shakeField(document.getElementById('enrol-name'));
      if (!email) shakeField(document.getElementById('enrol-email'));
      if (!phone) shakeField(document.getElementById('enrol-phone'));
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
              setStudentId(typeof data.studentId === 'string' ? data.studentId : null);
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
          <div className={`enrol-step step enter ${dir}`} key="choose">
            <h2 className="enrol-title" id="enrol-title">
              How would you like to pay?
            </h2>
            <div className="pay-course">
              <span className="pay-course-belt" aria-hidden="true" />
              <span className="pay-course-name">{ENROL.courseName}</span>
              <strong>{ENROL.priceLabel}</strong>
            </div>
            <div className="enrol-options">
              <button type="button" className="enrol-option" onClick={() => setStep('details')}>
                <span className="pay-ico pay-ico-violet">
                  <PayIcon name="card" />
                </span>
                <span className="enrol-option-text">
                  <span className="enrol-option-title">
                    Pay now
                    <span className="enrol-option-price">{ENROL.priceLabel}</span>
                  </span>
                  <span>Card, bank transfer or USSD</span>
                </span>
                <span className="pay-go">
                  <PayIcon name="arrow" />
                </span>
              </button>
              <a className="enrol-option" href={ENROL.instalmentUrl} target="_blank" rel="noopener noreferrer">
                <span className="pay-ico pay-ico-lavender">
                  <PayIcon name="split" />
                </span>
                <span className="enrol-option-text">
                  <span className="enrol-option-title">
                    Pay in 2 parts
                    <span className="enrol-option-price">2 × {ENROL.instalmentLabel}</span>
                  </span>
                  <span className="pay-via">
                    <PayIcon name="whatsapp" /> Half now, half later
                  </span>
                </span>
                <span className="pay-go">
                  <PayIcon name="arrow" />
                </span>
              </a>
              <a className="enrol-option" href={ENROL.accountNumberUrl} target="_blank" rel="noopener noreferrer">
                <span className="pay-ico pay-ico-lime">
                  <PayIcon name="bank" />
                </span>
                <span className="enrol-option-text">
                  <span className="enrol-option-title">
                    Bank transfer
                    <span className="enrol-option-price">{ENROL.priceLabel}</span>
                  </span>
                  <span className="pay-via">
                    <PayIcon name="whatsapp" /> Get our account number
                  </span>
                </span>
                <span className="pay-go">
                  <PayIcon name="arrow" />
                </span>
              </a>
            </div>
            <p className="pay-safe">
              <PayIcon name="lock" /> Card details go to Paystack, never to us.
            </p>
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={pay} noValidate className={`enrol-step step enter ${dir}`} key="details">
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
          <div className={`enrol-step step enter ${dir}`} key="success">
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
            {studentId && (
              <div className="enrol-id">
                <span>Your member ID</span>
                <strong>{studentId}</strong>
                <small>Use it with the email you paid with to sign in to Motion Dojo Connect. Take a screenshot of it.</small>
              </div>
            )}
            <a className="btn btn-lime" href={ENROL.accountNumberUrl} target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
