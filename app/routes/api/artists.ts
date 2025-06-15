import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  // ミドルウェアで認証済み

  const query = c.req.query('q');
  
  if (!query || query.length < 1) {
    return c.json([]);
  }

  try {
    // アーティスト名または読み仮名で部分一致検索
    const artists = await c.env.DB.prepare(`
      SELECT id, name, name_kana 
      FROM artists 
      WHERE name LIKE ? OR name_kana LIKE ?
      ORDER BY name
      LIMIT 10
    `).bind(`%${query}%`, `%${query}%`).all();

    return c.json(artists.results || []);
  } catch (error) {
    console.error('Artist search error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
})