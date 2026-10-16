'use client';
import {useActionState} from 'react';
import {login} from '../actions';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
export function LoginForm(){const [state,action,pending]=useActionState(login,{error:''});return <form action={action} className="admin-form"><label>Email<Input name="email" type="email" autoComplete="username" required maxLength={254}/></label><label>Password<Input name="password" type="password" autoComplete="current-password" required maxLength={1000}/></label><p role="alert">{state.error}</p><Button disabled={pending} type="submit">{pending?'SIGNING IN…':'SIGN IN'}</Button></form>}
