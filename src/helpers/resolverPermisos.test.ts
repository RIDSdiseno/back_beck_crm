import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolverPermisos } from './resolverPermisos';
import { PERMISOS_POR_ROL } from './permisosPorRol';

const permiso = (modulo: string, permitido: boolean) => ({
  modulo, puedeVer: permitido, puedeEditar: permitido,
});
const ver = (lista: ReturnType<typeof resolverPermisos>, modulo: string) =>
  lista.find(p => p.modulo === modulo)?.puedeVer;

test('Conserva plataformas nativas y no concede Trager por defecto', () => {
  assert.equal(ver(PERMISOS_POR_ROL.vendedor, 'beck_acceder_plataforma'), true);
  assert.equal(ver(PERMISOS_POR_ROL.vendedor_firemat, 'firemat_acceder_plataforma'), true);
  for (const [rol, lista] of Object.entries(PERMISOS_POR_ROL)) {
    assert.equal(ver(lista, 'trager_acceder_plataforma'), rol === 'administrador');
  }
});

test('Permiso anterior Firemat conserva su acceso pero no habilita Trager', () => {
  const result = resolverPermisos(PERMISOS_POR_ROL.vendedor, [
    permiso('firemat_cambiar_empresa', true),
  ]);
  assert.equal(ver(result, 'firemat_acceder_plataforma'), true);
  assert.equal(ver(result, 'trager_acceder_plataforma'), false);
});

test('Acceder a Trager no habilita editar clientes ni otros módulos', () => {
  const result = resolverPermisos(PERMISOS_POR_ROL.vendedor_firemat, [
    permiso('trager_acceder_plataforma', true),
    { modulo: 'trager_funnel', puedeVer: true, puedeEditar: false },
  ]);
  assert.equal(ver(result, 'trager_acceder_plataforma'), true);
  assert.equal(ver(result, 'trager_cambiar_empresa'), false);
  assert.equal(ver(result, 'trager_productos'), false);
  assert.equal(result.find(p => p.modulo === 'trager_funnel')?.puedeEditar, false);
});

test('Excepción individual prevalece sobre rol y acceso anterior', () => {
  const result = resolverPermisos(PERMISOS_POR_ROL.vendedor, [
    permiso('trager_acceder_plataforma', true),
    permiso('trager_cambiar_empresa', true),
  ], [permiso('trager_acceder_plataforma', false)]);
  assert.equal(ver(result, 'trager_acceder_plataforma'), false);
});

test('Revocar el nuevo permiso no se revierte por permisos heredados', () => {
  const result = resolverPermisos(PERMISOS_POR_ROL.vendedor, [
    permiso('firemat_cambiar_empresa', true),
    permiso('firemat_acceder_plataforma', false),
  ]);
  assert.equal(ver(result, 'firemat_acceder_plataforma'), false);
});
