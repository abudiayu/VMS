import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | VEMS` : 'VEMS - Vital Events Management System';
  }, [title]);
}
