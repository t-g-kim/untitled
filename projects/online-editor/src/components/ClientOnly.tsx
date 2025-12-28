'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Use a small delay to ensure all browser extensions have loaded
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Prevent any server-side rendering
  if (typeof window === 'undefined') {
    return <>{fallback}</>;
  }

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}