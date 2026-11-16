'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getVimeoEmbedUrl } from '@/utils/media';
import { Close } from './Icons';

/** Full-screen Vimeo player. Escape, the close button or a tap outside closes it. */
export function VideoModal({
  url,
  title,
  portrait = false,
  onClose,
}: {
  url: string;
  title: string;
  portrait?: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={portrait ? 'modal-panel portrait' : 'modal-panel'}>
        <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Close video">
          <Close />
        </button>
        <div className="modal-video">
          {!loaded && <span>Loading video…</span>}
          <iframe
            src={getVimeoEmbedUrl(url)}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            onLoad={() => setLoaded(true)}
            style={loaded ? undefined : { position: 'absolute', opacity: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
