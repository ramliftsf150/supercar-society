'use client';
import Link from 'next/link';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {type EventRecord,dateLabel} from '@/lib/events';
import {useState} from 'react';
export function EventCalendar({events,initialDate}:{events:EventRecord[];initialDate:string}) {
 const [month,setMonth]=useState(initialDate.slice(0,7)); const [year,m]=month.split('-').map(Number);
 const days=new Date(Date.UTC(year,m,0)).getUTCDate(); const offset=new Date(Date.UTC(year,m-1,1)).getUTCDay();
 const move=(delta:number)=>setMonth(new Date(Date.UTC(year,m-1+delta,1)).toISOString().slice(0,7));
 const onDay=(day:string)=>events.filter(e=>e.start_date<=day&&(e.end_date||e.start_date)>=day&&day>=initialDate);
 const visible=events.filter(e=>e.start_date<=`${month}-${String(days).padStart(2,'0')}`&&(e.end_date||e.start_date)>=`${month}-01`);
 return <section className="event-calendar" aria-label="Event calendar"><div className="calendar-heading"><div><span className="eyebrow">MARK YOUR CALENDAR</span><h3 aria-live="polite">{new Date(Date.UTC(year,m-1,1)).toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'})}</h3></div><div className="button-row"><button aria-label="Previous month" onClick={()=>move(-1)}><ChevronLeft/></button><button aria-label="Next month" onClick={()=>move(1)}><ChevronRight/></button></div></div><div className="calendar-grid">{['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d=><div className="calendar-weekday" key={d}>{d}</div>)}{Array.from({length:offset},(_,i)=><div key={`blank-${i}`} aria-hidden="true"/>)}{Array.from({length:days},(_,i)=>{const day=`${month}-${String(i+1).padStart(2,'0')}`;return <div key={day} className={day===initialDate?'calendar-day calendar-today':'calendar-day'}><time dateTime={day}>{i+1}</time>{onDay(day).map(e=><Link key={e.id} href={`/events/${e.slug}`}>{e.title}</Link>)}</div>})}</div><div className="calendar-agenda">{visible.map(e=><Link key={e.id} href={`/events/${e.slug}`}><span>{dateLabel(e.start_date)}</span><strong>{e.title}</strong></Link>)}</div>{!visible.length&&<p className="calendar-empty">No events announced for this month.</p>}</section>;
}
