"use client";

import NextTopLoader from 'nextjs-toploader';

export default function ProgressBarProvider({ children }) {
  return (
    <>
      <NextTopLoader
        color="#F87171"
        initialPosition={0.08}
        crawlSpeed={200}
        height={4}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #F87171,0 0 5px #F87171"
      />
      {children}
    </>
  );
}
