'use client';
export default function AdminError({reset}:{reset:()=>void}){return <div className="admin-shell"><h1>PLEASE TRY AGAIN.</h1><p>The admin workspace could not be loaded.</p><button className="button" onClick={reset}>Retry</button></div>}
