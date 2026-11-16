/**
 * Media and URL utilities
 */

export function getVimeoEmbedUrl(url: string, autoplay: boolean = true): string {
  if (!url) return '';
  // Extract digits from vimeo url
  // vimeo.com/ID, vimeo.com/ID/HASH or player.vimeo.com/video/ID?h=HASH (unlisted videos need the hash)
  const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)(?:\/([0-9a-f]+))?/);
  const id = match ? match[1] : url.replace(/\D/g, '');
  if (!id) return url;
  const hash = (match && match[2]) || (url.match(/[?&]h=([0-9a-f]+)/) || [])[1];
  const autoplayParam = autoplay ? '1' : '0';
  return `https://player.vimeo.com/video/${id}?${hash ? `h=${hash}&` : ''}autoplay=${autoplayParam}&badge=0&autopause=0&player_id=0&app_id=58479`;
}

export function formatSocialUrl(network: string, handleOrUrl: string): string {
  if (!handleOrUrl) return '#';
  if (handleOrUrl.startsWith('http://') || handleOrUrl.startsWith('https://')) {
    return handleOrUrl;
  }
  if (handleOrUrl.startsWith('mailto:')) {
    return handleOrUrl;
  }
  if (handleOrUrl.startsWith('tel:')) {
    return handleOrUrl;
  }

  const clean = handleOrUrl.replace(/^@/, '');

  switch (network.toLowerCase()) {
    case 'instagram':
      return `https://instagram.com/${clean}`;
    case 'x':
    case 'twitter':
      return `https://x.com/${clean}`;
    case 'linkedin':
      return clean.includes('/') ? `https://linkedin.com/${clean}` : `https://linkedin.com/in/${clean}`;
    case 'behance':
      return `https://behance.net/${clean}`;
    case 'tiktok':
      return `https://tiktok.com/@${clean}`;
    case 'youtube':
      return clean.startsWith('@') ? `https://youtube.com/${clean}` : `https://youtube.com/@${clean}`;
    case 'whatsapp':
      return `https://wa.me/${clean.replace(/\+/g, '')}`;
    case 'email':
      return `mailto:${clean}`;
    case 'website':
      return `https://${clean}`;
    default:
      return `https://${clean}`;
  }
}
