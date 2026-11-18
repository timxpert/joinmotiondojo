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
const PayIcon = ({ name }: { name: 'card' | 'split' | 'bank' | 'arrow' }) => {
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
    case 'arrow':
      return (
        <svg {...common} width={18} height={18} strokeWidth={2}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      );
  }
};

const METHODS: { id: 'now' | 'parts' | 'bank'; icon: 'card' | 'split' | 'bank'; title: string; line: string }[] = [
  { id: 'now', icon: 'card', title: 'Pay now', line: 'Card, bank transfer or USSD' },
  { id: 'parts', icon: 'split', title: 'Pay in 2 parts', line: 'Half now, half later' },
  { id: 'bank', icon: 'bank', title: 'Bank transfer', line: 'We send our account number on WhatsApp' },
];

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
  // the selected way to pay on the first step
  const [method, setMethod] = useState<'now' | 'parts' | 'bank'>('now');
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

  /* The phone's back button works inside the window instead of leaving the page:
     opening adds a history entry, going to the details step adds another.
     Back from details returns to the first step; back from there closes. */
  const depth = useRef(0); // history entries this window has added
  const skipPop = useRef(0); // pops we caused ourselves while closing
  const busyRef = useRef(false);
  busyRef.current = busy;
  const stepRef = useRef<Step>('choose');
  stepRef.current = step;

  const close = useCallback(() => {
    setOpen(false);
    if (depth.current > 0) {
      skipPop.current += 1;
      history.go(-depth.current);
      depth.current = 0;
    }
    lastFocus.current?.focus();
  }, []);

  // keep Next.js's own data on every history entry we add, so its router
  // treats back/forward as staying on this page instead of reloading
  const mark = (enrol: Step) => ({ ...(history.state ?? {}), enrol });

  const goDetails = () => {
    history.pushState(mark('details'), '');
    depth.current = 2;
    setStep('details');
  };
  const goBack = () => history.back();

  useEffect(() => {
    if (!open) return;
    const onPop = (e: PopStateEvent) => {
      if (skipPop.current > 0) {
        skipPop.current -= 1;
        return;
      }
      // mid-payment: stay put
      if (busyRef.current) {
        history.pushState(mark(stepRef.current), '');
        return;
      }
      const to = (e.state as { enrol?: string } | null)?.enrol;
      if (to === 'choose' && stepRef.current === 'details') {
        depth.current = 1;
        setDir('back');
        setStepRaw('choose');
        return;
      }
      // anything else (first step, or after paying): close and stay on this page
      const left = to ? depth.current - 1 : 0;
      depth.current = 0;
      setOpen(false);
      if (left > 0) {
        skipPop.current += 1;
        history.go(-left);
      }
      lastFocus.current?.focus();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [open]);

  useEffect(() => {
    const onOpen = () => {
      lastFocus.current = document.activeElement as HTMLElement;
      setStep('choose');
      setStatus('');
      setShowFallback(false);
      skipPop.current = 0;
      history.pushState({ ...(history.state ?? {}), enrol: 'choose' }, '');
      depth.current = 1;
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
              history.replaceState({ ...(history.state ?? {}), enrol: 'success' }, '');
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
            <div className="pay-methods" role="radiogroup" aria-label="Ways to pay">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={method === m.id}
                  className={method === m.id ? 'pay-method is-on' : 'pay-method'}
                  onClick={() => setMethod(m.id)}
                >
                  <span className="pay-ico">
                    <PayIcon name={m.icon} />
                  </span>
                  <span className="pay-method-text">
                    <strong>{m.title}</strong>
                    <span>{m.line}</span>
                  </span>
                  <span className="pay-radio" aria-hidden="true" />
                </button>
              ))}
            </div>

            <p className="pay-today">
              <span>Today</span>
              <strong>{method === 'parts' ? ENROL.instalmentLabel : ENROL.priceLabel}</strong>
            </p>
            {method === 'parts' && <p className="pay-later">Then {ENROL.instalmentLabel} later. {ENROL.priceLabel} in all.</p>}

            {method === 'now' ? (
              <button type="button" className="btn pay-cta" onClick={goDetails}>
                Continue to pay {ENROL.priceLabel}
              </button>
            ) : (
              <a
                className="btn pay-cta"
                href={method === 'parts' ? ENROL.instalmentUrl : ENROL.accountNumberUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {method === 'parts' ? 'Start on WhatsApp' : 'Get our account number'}
              </a>
            )}
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={pay} noValidate className={`enrol-step step enter ${dir}`} key="details">
            <button type="button" className="enrol-back" onClick={goBack} disabled={busy}>
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
