export type EventRecord = {
 id:string; title:string; slug:string; short_description:string; description:string; start_date:string; end_date:string|null; start_time:string|null; end_time:string|null; venue_name:string; address:string; city:string; state:string; event_type:string; cover_image_url:string|null; cover_storage_path:string|null; registration_url:string|null; featured:boolean; status:'draft'|'published'|'cancelled'; published_at:string|null; created_at:string; updated_at:string;
};
export type EventImage = {id:string;event_id:string;image_url:string;storage_path:string;alt_text:string;caption:string;sort_order:number;created_at:string};
export function today() { return new Intl.DateTimeFormat('en-CA',{timeZone:process.env.EVENTS_TIME_ZONE || 'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
export function dateLabel(date:string) { return new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`)); }
export function timeLabel(time:string|null) { if(!time) return ''; const [h,m]=time.split(':'); return `${Number(h)%12||12}:${m} ${Number(h)<12?'AM':'PM'}`; }
export function isPast(e:Pick<EventRecord,'start_date'|'end_date'>,now=today()) {return (e.end_date||e.start_date)<now;}
