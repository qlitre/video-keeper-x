import { createRoute } from 'honox/factory'
import { createClient } from "@supabase/supabase-js";
import { deleteCookie, getCookie } from 'hono/cookie';

export default createRoute(async (c) => {
    try {
        const token = getCookie(c, 'supabase_token');
        
        if (token) {
            const supabase = createClient(c.env.PROJECT_URL, c.env.API_KEY);
            await supabase.auth.signOut();
        }
        
        // Cookieを削除
        deleteCookie(c, 'supabase_token');
        deleteCookie(c, 'supabase_refresh_token');
        
        return c.redirect('/login', 303);
    } catch (error) {
        console.error('Logout error:', error);
        // エラーが発生してもCookieは削除する
        deleteCookie(c, 'supabase_token');
        deleteCookie(c, 'supabase_refresh_token');
        return c.redirect('/login', 303);
    }
})