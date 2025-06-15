import { getCookie, setCookie } from "hono/cookie"
import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";

export interface AuthUser {
  id: string;
  email: string;
}

export const checkauth = async (c: Context): Promise<{ isAuthenticated: boolean; user?: AuthUser }> => {
    const supabase = createClient(
        c.env.PROJECT_URL,
        c.env.API_KEY
    );
    
    const token = getCookie(c, 'supabase_token');
    const refreshToken = getCookie(c, 'supabase_refresh_token');
    
    if (!token) {
        return { isAuthenticated: false };
    }

    // トークンでユーザー情報を取得
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
        // アクセストークンが無効な場合、リフレッシュトークンで更新を試行
        if (refreshToken) {
            try {
                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
                    refresh_token: refreshToken
                });
                
                if (refreshData.session && refreshData.user && !refreshError) {
                    // 新しいトークンをCookieに設定
                    setCookie(c, 'supabase_token', refreshData.session.access_token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'Strict',
                        maxAge: 60 * 60 * 24 * 7 // 1週間
                    });
                    setCookie(c, 'supabase_refresh_token', refreshData.session.refresh_token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'Strict',
                        maxAge: 60 * 60 * 24 * 30 // 30日
                    });
                    
                    return {
                        isAuthenticated: true,
                        user: {
                            id: refreshData.user.id,
                            email: refreshData.user.email || ''
                        }
                    };
                }
            } catch (refreshErr) {
                console.error('Token refresh failed:', refreshErr);
            }
        }
        return { isAuthenticated: false };
    }

    return {
        isAuthenticated: true,
        user: {
            id: data.user.id,
            email: data.user.email || ''
        }
    };
}

