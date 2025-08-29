import React, { lazy, Suspense } from 'react';


export const createLazyComponent = (importFn: () => Promise<unknown>) => {
  const LazyComponent = lazy(importFn);
  return (props: unknown) => (
    <Suspense fallback={null}>
      <LazyComponent {...props} />
    </Suspense>
  );
};