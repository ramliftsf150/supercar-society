import {notFound} from 'next/navigation';
import {z} from 'zod';
import {requireAdmin} from '@/lib/supabase/server';
import {covers} from '@/lib/event-data';
import {type EventImage} from '@/lib/events';
import {EventForm} from '@/components/events/event-form';
import {GalleryManager} from '@/components/events/gallery-manager';
export default async function EditEvent({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!z.uuid().safeParse(id).success)notFound();const client=await requireAdmin();const {data:event,error}=await client.from('events').select('*').eq('id',id).maybeSingle();if(error)throw new Error('Could not load event.');if(!event)notFound();const {data,error:galleryError}=await client.from('event_images').select('*').eq('event_id',id).order('sort_order').order('created_at');if(galleryError)throw new Error('Could not load photographs.');const images=await Promise.all((data as EventImage[]).map(async image=>{const {data:signed}=await client.storage.from('event-images').createSignedUrl(image.storage_path,3600);return {...image,image_url:signed?.signedUrl||''};}));return <><h1>EDIT EVENT.</h1><EventForm event={(await covers([event],client))[0]}/><GalleryManager eventId={id} images={images}/></>}
