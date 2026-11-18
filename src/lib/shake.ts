/* Marks a form field as wrong and gives it a quick side-to-side shake.
   Same motion as Motion's animate(field, { x: [0, -10, 10, -6, 6, -3, 0] },
   { duration: 0.36 }), done with the browser's own Web Animations API, so no
   extra package. The red clears as soon as the person types in it again. */
const STEPS = [0, -10, 10, -6, 6, -3, 0];

export function shakeField(el: Element | null | undefined) {
  const field = (el?.closest('.field') ?? el) as HTMLElement | null;
  if (!field) return;
  field.classList.add('error');
  const input = field.querySelector('input, textarea, select') ?? field;
  input.addEventListener('input', () => field.classList.remove('error'), { once: true });
  if (typeof field.animate !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  field.animate(
    STEPS.map((x) => ({ transform: `translateX(${x}px)` })),
    { duration: 360, easing: 'ease-out' },
  );
}
