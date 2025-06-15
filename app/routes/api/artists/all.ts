import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  // ミドルウェアで認証済み

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