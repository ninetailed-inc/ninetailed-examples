import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export const LyticsTracker: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter();
  const lastFiredPageRef = useRef('none');

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const isPageAlreadyTracked =
        lastFiredPageRef.current === url ||
        lastFiredPageRef.current === 'tracked';

      if (!isPageAlreadyTracked) {
        // eslint-disable-next-line
        // @ts-ignore
        // eslint-disable-next-line
        window.jstag.pageView();
      }

      lastFiredPageRef.current = url;
    };

    handleRouteChange(router.asPath);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return null;
};
