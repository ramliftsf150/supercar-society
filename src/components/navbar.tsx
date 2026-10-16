'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
export function Navbar() {
 const pathname=usePathname(); const [open,setOpen]=useState(false); const toggle=useRef<HTMLButtonElement>(null);
 const links=[['HOME','/'],['SHOP','/shop'],['CONTACT','/contact']];
 return <header className="navbar" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus();}}}><Link href="/" aria-label="Super Car Society home" onClick={()=>setOpen(false)}><Image className="brand-logo" src="/images/scs/logo.png" alt="Super Car Society" width={120} height={82} priority /></Link><span className="nav-tag">AUTOMOTIVE CULTURE. REDEFINED.</span><nav aria-label="Main navigation" className="desktop-nav">{links.map(([name,url])=><Link key={url} href={url} aria-current={pathname===url?'page':undefined}>{name}</Link>)}<Link className="nav-quote" href="/contact">GET A QUOTE <span aria-hidden="true">↗</span></Link></nav><button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(!open)}>{open?'CLOSE ×':'MENU ☰'}</button><nav id="mobile-menu" aria-label="Mobile navigation" className="mobile-nav" hidden={!open}>{links.map(([name,url])=><Link key={url} href={url} aria-current={pathname===url?'page':undefined} onClick={()=>setOpen(false)}>{name}<span aria-hidden="true">↗</span></Link>)}<p>MORE THAN CARS. A SOCIETY.</p></nav></header>;
}
