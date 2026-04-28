import { Navigation } from 'lucide-react';

export default function NavigateButton({ latitude, longitude, className = '' }) {
  function handleNavigate() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const destination = `${latitude},${longitude}`;
    const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    if (isIOS || isAndroid) {
      window.open(mapsLink, '_blank', 'noopener,noreferrer');
      return;
    }

    window.open(mapsLink, '_blank', 'noopener,noreferrer');
  }

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className={`inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20 ${className}`}
    >
      <Navigation className="h-4 w-4" />
      Navigate
    </button>
  );
}
