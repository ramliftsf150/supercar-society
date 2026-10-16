import {z} from 'zod';
const text=(max:number)=>z.string().trim().max(max);
const date=z.iso.date();
const time=z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/).nullable();
export const eventSchema=z.object({
 title:text(180).min(1,'Title is required'),slug:text(200).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/,'Use lowercase letters, numbers, and hyphens for the slug'),
 short_description:text(500),description:text(20000),start_date:date,end_date:date.nullable(),start_time:time,end_time:time,
 venue_name:text(200),address:text(500),city:text(100),state:text(100),event_type:text(100),
 registration_url:z.url().max(2000).refine(s=>/^https?:\/\//.test(s),'Use an http or https URL').nullable(),
 featured:z.boolean(),status:z.enum(['draft','published','cancelled'])
}).refine(e=>!e.end_date||e.end_date>=e.start_date,{message:'End date must be on or after the start date',path:['end_date']})
.refine(e=>!e.start_time||!e.end_time||(e.end_date&&e.end_date>e.start_date)||e.end_time>=e.start_time,{message:'End time must follow start time (or set a later end date)',path:['end_time']});
export function slugify(value:string){return value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,200);}
