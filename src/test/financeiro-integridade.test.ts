import { describe, expect, it, vi } from 'vitest';
import { onRequestDelete as excluirCliente } from '../../functions/api/crm/clientes/[id].js';
import { onRequestPost as criarContrato } from '../../functions/api/crm/contratos.js';
import { onRequestPost as criarFatura } from '../../functions/api/crm/faturas.js';

const request = (body?: unknown) => new Request('https://local.test/api/crm?key=teste', {
  method: body ? 'POST' : 'DELETE', headers: { 'Content-Type': 'application/json' },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

describe('integridade do financeiro', () => {
  it('bloqueia exclusão de cliente com contrato ou fatura', async () => {
    const prepare = vi.fn((sql: string) => ({ bind: (...args: unknown[]) => ({
      run: vi.fn().mockResolvedValue({ meta: { changes: 0 } }),
      first: vi.fn().mockResolvedValue({ id: 'cliente' }), sql, args,
    }) }));
    const response = await excluirCliente({ request: request(), env: { DASH_KEY: 'teste', DB: { prepare } }, params: { id: 'cliente' } });
    expect(response.status).toBe(409);
    expect(prepare.mock.calls[0][0]).toContain('NOT EXISTS (SELECT 1 FROM crm_faturas');
    expect(prepare.mock.calls[0][0]).toContain('NOT EXISTS (SELECT 1 FROM crm_contratos');
  });

  it('recusa contrato para cliente inexistente', async () => {
    const batch = vi.fn();
    const prepare = vi.fn(() => ({ bind: () => ({ first: vi.fn().mockResolvedValue(null) }) }));
    const response = await criarContrato({ request: request({ cliente_id:'ausente', valor:25000 }), env:{ DASH_KEY:'teste', DB:{ prepare, batch } } });
    expect(response.status).toBe(400);
    expect(batch).not.toHaveBeenCalled();
  });

  it('recusa fatura com contrato que não pertence ao cliente', async () => {
    const run = vi.fn();
    const prepare = vi.fn(() => ({ bind: () => ({ first: vi.fn().mockResolvedValue(null), run }) }));
    const response = await criarFatura({ request: request({ cliente_id:'cliente', contrato_id:'outro', valor:25000, vencimento:'2026-10-26' }), env:{ DASH_KEY:'teste', DB:{ prepare } } });
    expect(response.status).toBe(400);
    expect(run).not.toHaveBeenCalled();
  });
});
