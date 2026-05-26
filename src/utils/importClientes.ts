import XLSX from 'xlsx';

export type RawFilaCliente = Record<string, string | null>;

export function parseFileToRows(buffer: Buffer, filename: string): RawFilaCliente[] {
  void filename;
  const workbook = XLSX.read(buffer, { type: 'buffer', raw: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
    raw: false,
  });

  return rows.map(row => {
    const out: RawFilaCliente = {};
    for (const [k, v] of Object.entries(row)) {
      const s = v != null ? String(v).trim() : null;
      out[k] = s || null;
    }
    return out;
  });
}
