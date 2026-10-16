'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';
import {configured,createClient,requireAdmin} from '@/lib/supabase/server';
import {eventSchema} from '@/lib/event-validation';
const validId=(id:string)=>z.uuid().safeParse(id).success;
function refresh(){revalidatePath('/','layout');}
export async function login(_: {error:string},form:FormData) {
 if(!configured())return {error:'Admin sign-in is not configured yet. Contact the site owner.'};
 const email=String(form.get('email')||'').trim(),password=String(form.get('password')||'');
 if(!z.email().safeParse(email).success||!password)return {error:'Enter your email and password.'};
 const client=await createClient();const {error}=await client.auth.signInWithPassword({email,password});
 if(error)return {error:'Sign-in failed. Check your details and try again.'};
 const {data:admin}=await client.rpc('is_admin');
 if(!admin){await client.auth.signOut();return {error:'This account is not authorized for administration.'};}
 redirect('/admin');
}
export async function logout(){const client=await createClient();await client.auth.signOut();redirect('/admin/login');}
export async function saveEvent(id:string|null,input:unknown) {
 const client=await requireAdmin();const parsed=eventSchema.safeParse(input);
 if(!parsed.success)return {error:parsed.error.issues.map(i=>i.message).join('. ')};
 if(id&&!validId(id))return {error:'Invalid event.'};
 const query=id?client.from('events').update(parsed.data).eq('id',id):client.from('events').insert(parsed.data);
 const {data,error}=await query.select('id').single();
 if(error)return {error:error.code==='23505'?'That slug is already in use. Choose another.':'The event could not be saved. Please try again.'};
 refresh();return {id:data.id as string};
}
export async function deleteEvent(id:string) {
 const client=await requireAdmin();if(!validId(id))return {error:'Invalid event.'};
 // List storage as well as records, so interrupted uploads are cleaned up too.
 for(const folder of ['cover','gallery']) {
  while(true){const prefix=`events/${id}/${folder}`;const {data,error}=await client.storage.from('event-images').list(prefix,{limit:100});
   if(error)return {error:'Could not list event photos. Nothing was deleted from the database.'};
   if(!data?.length)break;
   const {error:removeError}=await client.storage.from('event-images').remove(data.map(f=>`${prefix}/${f.name}`));
   if(removeError)return {error:'Photo cleanup failed. Retry deletion.'};
  }
 }
 const {error}=await client.from('events').delete().eq('id',id);if(error)return {error:'Could not delete event. Please retry.'};refresh();return {ok:true};
}
export async function uploadPhoto(form:FormData) {
 const client=await requireAdmin();const id=String(form.get('event_id'));const kind=String(form.get('kind'));const file=form.get('file');
 if(!validId(id)||!['cover','gallery'].includes(kind)||!(file instanceof File))return {error:'Invalid upload.'};
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024||!file.size)return {error:'Use a JPG, PNG, or WebP image under 10 MB.'};
 const {data:event}=await client.from('events').select('id,cover_storage_path').eq('id',id).single();if(!event)return {error:'Save the event before uploading photos.'};
 const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[file.type];const path=`events/${id}/${kind}/${crypto.randomUUID()}.${ext}`;
 const {error}=await client.storage.from('event-images').upload(path,file,{contentType:file.type,upsert:false});if(error)return {error:'Upload failed. Please try again.'};
 const result=kind==='cover'?await client.from('events').update({cover_storage_path:path,cover_image_url:null}).eq('id',id):await client.from('event_images').insert({event_id:id,storage_path:path,alt_text: '',sort_order:0});
 if(result.error){await client.storage.from('event-images').remove([path]);return {error:'Photo could not be attached to the event.'};}
 if(kind==='cover'&&event.cover_storage_path){const cleanup=await client.storage.from('event-images').remove([event.cover_storage_path]);if(cleanup.error){refresh();return {error:'Cover saved; old file cleanup failed. Deleting this event later will retry cleanup.'};}}
 refresh();return {ok:true};
}
export async function updatePhoto(id:string,input:{alt_text:string;caption:string;sort_order:number}) {
 const client=await requireAdmin();const parsed=z.object({alt_text:z.string().trim().max(500),caption:z.string().trim().max(1000),sort_order:z.number().int().min(0).max(100000)}).safeParse(input);
 if(!validId(id)||!parsed.success)return {error:'Check the photo text and sort order (0–100000).'};
 const {error}=await client.from('event_images').update(parsed.data).eq('id',id);if(error)return {error:'Could not save photo details.'};refresh();return {ok:true};
}
export async function deletePhoto(id:string) {
 const client=await requireAdmin();if(!validId(id))return {error:'Invalid photo.'};
 const {data}=await client.from('event_images').select('storage_path').eq('id',id).single();if(!data)return {error:'Photo not found.'};
 const {error:storageError}=await client.storage.from('event-images').remove([data.storage_path]);if(storageError)return {error:'Could not delete the photo. Try again.'};
 const {error}=await client.from('event_images').delete().eq('id',id);if(error)return {error:'Could not remove photo record. Retry deletion.'};refresh();return {ok:true};
}
