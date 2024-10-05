import { createBrowserClient } from '@supabase/ssr';

export const getUser = async () => {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  return user;
};

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
