'use server';

import { type OAuthResponse } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NotificationType } from '../enums/NotificationType';
import { createClient } from './server';

const supabase = createClient();
const origin = headers().get('origin');

const successLoginNext = `/dashboard?${NotificationType.LoginSuccess}=true`;

const handleRedirect = ({ data, error }: OAuthResponse) => {
  if (error) {
    console.log(error);
  } else {
    return redirect(data.url);
  }
};

const emailLogin = async (formData: FormData) => {
  console.log('here');
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  console.log(error);

  if (error) {
    redirect(`/?${NotificationType.LoginFailed}=true`);
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
};

export async function emailSignup(formData: FormData) {
  console.log('here2');
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  redirect('/dashboard');
}

const googleLogin = async () => {
  const response = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${successLoginNext}`
    }
  });

  handleRedirect(response);
};

export { emailLogin, googleLogin };
