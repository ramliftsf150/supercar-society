'use client';
import Image from 'next/image';
import { Icon, type IconNode } from 'lucide-react';
import './navbar.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
const instagramIcon: IconNode = [
 ['rect', {x: 2, y: 2, width: 20, height: 20, rx: 5, key: 'frame'}],
 ['circle', {cx: 12, cy: 12, r: 4, key: 'lens'}],
 ['circle', {cx: 18, cy: 6, r: 0.5, fill: 'currentColor', key: 'flash'}],
];
const instagramUrl = 'https://www.instagram.com/915_supercar_society?utm_source=ig_web_button_share_sheet&obrf=ZDNlZDc0MzIxNw==';
function InstagramLink({onClick}: {onClick?: () => void}) {
 return <a className="nav-instagram" href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Super Car Society on Instagram" onClick={onClick}><Icon iconNode={instagramIcon} size={16} aria-hidden="true"/><span>@915_supercar_society</span></a>;
}
export function Navbar() {
 const pathname=usePathname(); const [open,setOpen]=useState(false); const toggle=useRef<HTMLButtonElement>(null);
 const links=[['HOME','/'],['EVENTS','/events'],['SHOP','/shop'],['ABOUT','/about'],['CONTACT','/contact']];
 return <header className="navbar" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus();}}}><Link href="/" aria-label="Super Car Society home" onClick={()=>setOpen(false)}><Image className="brand-logo" src="/images/scs/logo.png" alt="Super Car Society" width={120} height={82} priority /></Link><span className="nav-tag">AUTOMOTIVE CULTURE. REDEFINED.</span><nav aria-label="Main navigation" className="desktop-nav">{links.map(([name,url])=><Link key={url} href={url} aria-current={(pathname===url||(url==='/events'&&pathname.startsWith('/events/')))?'page':undefined}>{name}</Link>)}<InstagramLink/><Link className="nav-quote" href="/contact">GET A QUOTE</Link></nav><button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(!open)}>{open?'CLOSE ×':'MENU ☰'}</button><nav id="mobile-menu" aria-label="Mobile navigation" className="mobile-nav" hidden={!open}>{links.map(([name,url])=><Link key={url} href={url} aria-current={(pathname===url||(url==='/events'&&pathname.startsWith('/events/')))?'page':undefined} onClick={()=>setOpen(false)}>{name}</Link>)}<InstagramLink onClick={()=>setOpen(false)}/><p>MORE THAN CARS. A SOCIETY.</p></nav></header>;
}
