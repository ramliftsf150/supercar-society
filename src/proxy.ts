import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
export async function proxy(request: NextRequest) {
 let response = NextResponse.next({request});
 const login = request.nextUrl.pathname === '/admin/login';
 const deny = () => { const out = NextResponse.redirect(new URL('/admin/login',request.url)); response.cookies.getAll().forEach(c => out.cookies.set(c)); out.headers.set('Cache-Control','private, no-store'); return out; };
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return login ? response : deny();
 const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{cookieOptions:{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax'},cookies:{
  getAll:()=>request.cookies.getAll(), setAll: entries => { entries.forEach(({name,value})=>request.cookies.set(name,value)); response=NextResponse.next({request}); entries.forEach(({name,value,options})=>response.cookies.set(name,value,options)); }
 }});
 const {data,error}=await client.auth.getUser();
 if(!login) { if(error || !data.user) return deny(); const {data:admin}=await client.rpc('is_admin'); if(!admin) return deny(); }
 response.headers.set('Cache-Control','private, no-store');
 return response;
}
export const config = {matcher:['/admin/:path*']};
