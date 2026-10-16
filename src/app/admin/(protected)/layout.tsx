import Link from 'next/link';
import {requireAdmin} from '@/lib/supabase/server';
import {logout} from '../actions';
export const dynamic='force-dynamic';
export const metadata={title:'Administration',robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireAdmin();return <div className="admin-shell dark"><div className="admin-bar"><Link href="/admin">SCS / ADMIN</Link><nav aria-label="Administration"><Link href="/admin">Dashboard</Link><Link href="/admin/events">Events</Link><Link href="/admin/events/new">Create event</Link></nav><form action={logout}><button>Sign out ↗</button></form></div>{children}</div>}
