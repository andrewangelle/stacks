import { createClient } from '@supabase/supabase-js';

export default (token?:string) =>
 createClient(
    process.env.SUPABASE_URL!, 
    process.env.SUPABASE_API_KEY!, 
    token 
      ? ({
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }) 
      : {}
  );
