import { createRoute } from 'honox/factory'
import { checkauth } from '../../../checkauth'

export default createRoute(async (c) => {
  const authResult = await checkauth(c);

  // 認証されていない場合は401エラー
  if (!authResult.isAuthenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // 全アーティストを取得（名前順）
    const artists = await c.env.DB.prepare(`
      SELECT id, name, name_kana 
      FROM artists 
      ORDER BY name
    `).all();

    return c.json(artists.results || []);
  } catch (error) {
    console.error('Artists fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
})