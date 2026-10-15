import assert from 'node:assert/strict';
import { test } from 'node:test';
import { RolUsuario } from '@prisma/client';
import { esRolDeEmpresa, getRolesByEmpresa } from './roles';

test('cada portal lista solo sus usuarios propios; los administradores son de Beck', () => {
  assert.deepEqual(getRolesByEmpresa('firemat'), [
    RolUsuario.vendedor_firemat,
    RolUsuario.bodeguero,
    RolUsuario.visualizador_firemat,
  ]);
  assert.deepEqual(getRolesByEmpresa('trager'), [
    RolUsuario.vendedor_trager,
    RolUsuario.bodeguero_trager,
    RolUsuario.visualizador_trager,
  ]);
  assert.ok(getRolesByEmpresa('beck').includes(RolUsuario.administrador));
  assert.ok(!getRolesByEmpresa('firemat').includes(RolUsuario.administrador));
  assert.ok(!getRolesByEmpresa('trager').includes(RolUsuario.administrador));
});

test('un usuario solo se administra desde su portal de origen', () => {
  assert.equal(esRolDeEmpresa(RolUsuario.bodeguero, 'firemat'), true);
  assert.equal(esRolDeEmpresa(RolUsuario.bodeguero, 'trager'), false);
  assert.equal(esRolDeEmpresa(RolUsuario.terreno, 'firemat'), false);
  assert.equal(esRolDeEmpresa(RolUsuario.vendedor_trager, 'beck'), false);
  assert.equal(esRolDeEmpresa(RolUsuario.administrador, 'firemat'), false);
  assert.equal(esRolDeEmpresa(RolUsuario.administrador, 'beck'), true);
});
