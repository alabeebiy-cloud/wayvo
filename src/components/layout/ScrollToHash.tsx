import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to #section links (React Router does not do this on its own) and to the top on page changes. */
export const ScrollToHash: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};