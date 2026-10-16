import type { Metadata } from 'next';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import './globals.css';
import './events/events.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = { title: { default: 'Super Car Society | Automotive Culture, Events & Apparel', template: '%s | Super Car Society' }, description: 'Super Car Society brings extraordinary machines and people together through automotive culture, events, brand experiences, and apparel.', openGraph: { title: 'Super Car Society', description: 'More than cars. A society.', images: [{url:'/images/scs/hero-night.webp'}] } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className={cn("font-sans", geist.variable)}><body><a href="#main-content" className="skip-link">Skip to content</a><Navbar /><main id="main-content">{children}</main><Footer /></body></html>; }
