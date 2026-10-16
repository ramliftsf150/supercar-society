'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="section-shell event-section"><h2>WE’LL BE RIGHT BACK.</h2><p>Events are temporarily unavailable. Please try again.</p><button className="button" onClick={reset}>Try again</button></div>}
