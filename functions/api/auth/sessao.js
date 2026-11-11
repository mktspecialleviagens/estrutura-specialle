import { requireAuth } from '../_auth.js';
export async function onRequestGet({ request, env }) { const auth = await requireAuth(request, env); return auth.ok ? Response.json({ user: auth.user }, { headers: { 'Cache-Control': 'no-store' } }) : Response.json({ error: 'Unauthorized' }, { status: auth.status || 401 }); }
