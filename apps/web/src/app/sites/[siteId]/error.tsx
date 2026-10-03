"use client";
export default function PublicSiteError({reset}:{reset:()=>void}) {return <main style={{padding:40}}><h1>Website temporarily unavailable</h1><p>Please try again. The website could not be loaded.</p><button type="button" onClick={reset}>Try again</button></main>;}
