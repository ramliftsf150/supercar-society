'use client';
import Image from 'next/image';
import {useRef,useState} from 'react';
import {type EventImage} from '@/lib/events';
export function Gallery({images}:{images:EventImage[]}) {
 const dialog=useRef<HTMLDialogElement>(null);const [index,setIndex]=useState(0);const selected=images[index];
 if(!images.length)return null;
 function move(n:number){setIndex(i=>(i+n+images.length)%images.length);}
 return <section className="section-shell event-section"><span className="eyebrow">THROUGH THE LENS</span><h2>THE GALLERY.</h2><div className="event-gallery">{images.map((im,i)=><figure key={im.id}><button aria-label={`Enlarge ${im.alt_text||`photograph ${i+1}`}`} onClick={()=>{setIndex(i);dialog.current?.showModal();}}><Image src={im.image_url} alt={im.alt_text} width={1200} height={900} unoptimized/></button>{im.caption&&<figcaption>{im.caption}</figcaption>}</figure>)}</div><dialog ref={dialog} className="gallery-lightbox" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} onKeyDown={e=>{if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);}} aria-label="Event photograph"><button className="lightbox-close" onClick={()=>dialog.current?.close()}>CLOSE ×</button><Image src={selected.image_url} alt={selected.alt_text} width={1600} height={1200} unoptimized/><p aria-live="polite">{selected.caption||selected.alt_text} · {index+1} / {images.length}</p><div className="button-row"><button onClick={()=>move(-1)}>← Previous</button><button onClick={()=>move(1)}>Next →</button></div></dialog></section>;
}
