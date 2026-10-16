import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {publicEvent} from '@/lib/event-data';
import {dateLabel,timeLabel,isPast} from '@/lib/events';
import {Gallery} from '@/components/events/gallery';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {const result=await publicEvent((await params).slug);if(!result)notFound();return {title:result.event.title};}
export default async function EventDetail({params}:{params:Promise<{slug:string}>}) {
 const result=await publicEvent((await params).slug);if(!result)notFound();const {event:e,images}=result;const past=isPast(e);
 return <><section className="events-hero event-detail-hero"><Image src={e.cover_image_url||'/images/scs/event-crowd.webp'} alt={e.title} fill priority sizes="100vw" unoptimized={Boolean(e.cover_storage_path)}/><div className="hero-shade"/><div className="section-shell events-hero-copy"><Link className="eyebrow" href="/events">← ALL EVENTS</Link><p className="eyebrow">{past?'FROM THE ARCHIVES':e.event_type||'UPCOMING EVENT'}</p><h1>{e.title}</h1><p>{e.short_description}</p></div></section><section className="section-shell event-section event-details"><div><span className="eyebrow">{past?'THE RECAP':'THE EXPERIENCE'}</span><h2>{past?'A MOMENT IN THE SOCIETY.':'BE PART OF IT.'}</h2><p className="event-description">{e.description}</p></div><aside className="event-facts"><h3>{dateLabel(e.start_date)}</h3>{e.end_date&&e.end_date!==e.start_date&&<p>Through {dateLabel(e.end_date)}</p>}<p>{timeLabel(e.start_time)}{e.end_time?` – ${timeLabel(e.end_time)}`:''}{e.start_time?' · Venue local time':''}</p><h3>{e.venue_name}</h3><p>{e.address}<br/>{[e.city,e.state].filter(Boolean).join(', ')}</p>{!past&&e.registration_url&&<a className="button" href={e.registration_url} target="_blank" rel="noopener noreferrer">REGISTER ↗</a>}</aside></section><Gallery images={images}/></>;
}
