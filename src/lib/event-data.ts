import 'server-only';
import {createClient as anonymousClient} from '@supabase/supabase-js';
import {configured} from './supabase/server';
import {type EventRecord,type EventImage,today} from './events';
// Never inherit admin cookies for public queries, even during an admin's visit.
export function publicClient() {return anonymousClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});}
export async function covers(events:EventRecord[],client=publicClient()) {
 return Promise.all(events.map(async e=> {if(!e.cover_storage_path)return e; const {data}=await client.storage.from('event-images').createSignedUrl(e.cover_storage_path,3600); return {...e,cover_image_url:data?.signedUrl||null};}));
}
export async function publicEvents(kind:'upcoming'|'past',page=1,limit=12) {
 if(!configured())return {events:[] as EventRecord[],more:false};
 const client=publicClient(); let query=client.from('events').select('*').eq('status','published');
 query=kind==='upcoming'?query.or(`end_date.gte.${today()},and(end_date.is.null,start_date.gte.${today()})`):query.or(`end_date.lt.${today()},and(end_date.is.null,start_date.lt.${today()})`);
 const {data,error}=await query.order('start_date',{ascending:kind==='upcoming'}).range((page-1)*limit,page*limit);
 if(error)throw new Error('Events could not be loaded. Please try again.');
 return {events:await covers((data||[]).slice(0,limit)),more:(data?.length||0)>limit};
}
export async function publicEvent(slug:string) {
 if(!configured())return null;
 const client=publicClient(); const {data,error}=await client.from('events').select('*').eq('slug',slug).eq('status','published').maybeSingle();
 if(error)throw new Error('This event could not be loaded.'); if(!data)return null;
 const {data:images,error:imageError}=await client.from('event_images').select('*').eq('event_id',data.id).order('sort_order').order('created_at');
 if(imageError)throw new Error('The gallery could not be loaded.');
 const gallery=await Promise.all((images as EventImage[]).map(async i=>{const {data:signed}=await client.storage.from('event-images').createSignedUrl(i.storage_path,3600);return {...i,image_url:signed?.signedUrl||''};}));
 return {event:(await covers([data]))[0],images:gallery.filter(i=>i.image_url)};
}
