import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export const configured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
export async function createClient() {
 const jar = await cookies();
 return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
  cookieOptions: {httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:'lax'},
  cookies: { getAll: () => jar.getAll(), setAll: entries => { try { entries.forEach(({name,value,options}) => jar.set(name,value,options)); } catch { /* Server Components: proxy persists refreshed cookies. */ } } }
 });
}
export async function requireAdmin() {
 if (!configured()) redirect('/admin/login');
 const client = await createClient();
 const {data, error} = await client.auth.getUser();
 if(error || !data.user) redirect('/admin/login');
 const {data: admin} = await client.rpc('is_admin');
 if(!admin) redirect('/admin/login?denied=1');
 return client;
}
