import {LoginForm} from './login-form';
export const metadata={title:'Admin sign-in',robots:{index:false,follow:false}};
export default async function Login({searchParams}:{searchParams:Promise<{denied?:string}>}){return <section className="admin-login admin-shell dark"><span className="eyebrow">SUPER CAR SOCIETY / PRIVATE ACCESS</span><h1>ADMIN SIGN IN.</h1><p>Manage the events. Build the experiences.</p>{(await searchParams).denied&&<p role="alert">This account does not have administrator access.</p>}<LoginForm/></section>}
