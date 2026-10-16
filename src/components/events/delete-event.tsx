'use client';
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {deleteEvent} from '@/app/admin/actions';
export function DeleteEvent({id,title}:{id:string;title:string}){const [error,setError]=useState('');const [pending,start]=useTransition();const router=useRouter();return <div><button disabled={pending} onClick={()=>{if(window.confirm(`Permanently delete “${title}” and all its photographs? This cannot be undone.`))start(async()=>{try{const result=await deleteEvent(id);if(result.error)setError(result.error);else router.refresh();}catch{setError('Deletion failed. Please try again.');}});}}>{pending?'Deleting…':'Delete'}</button>{error&&<p role="alert">{error}</p>}</div>}
