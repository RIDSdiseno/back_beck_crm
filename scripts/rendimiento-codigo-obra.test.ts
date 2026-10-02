import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prisma } from '../src/config/prisma';
import { adjuntarRendimientoRegistros } from '../src/services/rendimientoTrabajador.service';

// Catálogo vigente: 1-140 = Ø ≤ 110 mm (30 sellos/día) y 1-141 = Ø ≤ 160 mm (10 sellos/día).
// Sótero del Río usa el 1-140 vigente con su código antiguo 1-141.
const SOTERO = 'obra-sotero';
const OTRA = 'obra-nueva';
const catalogo = [
  { id: 'op-1-140', codigoBeck: '1-140', rendimientoSellosEsperadoDiario: 30, rendimientoReparacionEsperadoDiario: null },
  { id: 'op-1-141', codigoBeck: '1-141', rendimientoSellosEsperadoDiario: 10, rendimientoReparacionEsperadoDiario: null },
];
const configs = [{ obraId: SOTERO, itemizadoOpcionId: 'op-1-140', codigoPersonalizado: '1-141',
  rendimientoSellosEsperadoDiario: null, rendimientoReparacionEsperadoDiario: null }];

function simular(delegado: unknown, metodo: string, fn: (args: any) => unknown) {
  Object.defineProperty(delegado as object, metodo, { value: async (args: any) => fn(args), configurable: true, writable: true });
}
simular(prisma.itemizadoOpcion, 'findMany', ({ where }) => catalogo.filter((op) =>
  (where.OR ?? [where]).some((c: any) =>
    (c.codigoBeck?.in ?? []).includes(op.codigoBeck) || (c.id?.in ?? []).includes(op.id))));
simular(prisma.configuracionItemizadoOpcionObra, 'findMany', ({ where }) => configs.filter((c) =>
  where.obraId.in.includes(c.obraId) &&
  (where.codigoPersonalizado ? where.codigoPersonalizado.in.includes(c.codigoPersonalizado)
                             : where.itemizadoOpcionId.in.includes(c.itemizadoOpcionId))));

const esperadoDe = async (obraId: string, codigoBeck: string) => {
  const [r] = await adjuntarRendimientoRegistros([{ obraId, codigoBeck, tipoRegistro: 'sello_cortafuego', cantidadSellos: 5 }]);
  return (r as any).obra.rendimientoSellosEsperadoDiario;
};

test('en Sótero, el 1-141 antiguo usa el rendimiento del ítem que realmente es (1-140 vigente)', async () => {
  assert.equal(await esperadoDe(SOTERO, '1-141'), 30);
});

test('en una obra sin códigos propios, el 1-141 sigue siendo el 1-141 del catálogo', async () => {
  assert.equal(await esperadoDe(OTRA, '1-141'), 10);
});
