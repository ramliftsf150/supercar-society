import Link from 'next/link';
import {publicEvents} from '@/lib/event-data';
import {EventCard} from './event-card';
export async function NextEvent(){const result=await publicEvents('upcoming',1,1).catch(()=>null);const events=result?.events||[];return <section className="section-shell event-section"><div className="section-heading"><div><span className="eyebrow">NEXT UP / THE SOCIETY</span><h2>SEE YOU THERE.</h2></div><Link className="text-link" href="/events">ALL EVENTS</Link></div>{events[0]?<EventCard event={events[0]}/>:<div className="event-empty"><p>{result?'No upcoming events announced yet. Follow the Society for the next drop.':'Event announcements are temporarily unavailable. Please check back soon.'}</p></div>}</section>}
