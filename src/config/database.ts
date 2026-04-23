import { prisma } from './prisma';

export type QueryResultRow = any;

export type QueryResult<T extends QueryResultRow = any> = {
  rows: T[];
  rowCount: number;
};

const returnsRows = (sql: string): boolean => {
  const normalized = sql.trim().toLowerCase();
  return normalized.startsWith('select')
    || normalized.startsWith('with')
    || normalized.includes(' returning ');
};

export const query = async <T extends QueryResultRow = any>(
  text: string,
  params: any[] = [],
): Promise<QueryResult<T>> => {
  if (returnsRows(text)) {
    const rows = await prisma.$queryRawUnsafe<T[]>(text, ...params);
    return {
      rows,
      rowCount: rows.length,
    };
  }

  const rowCount = await prisma.$executeRawUnsafe(text, ...params);
  return {
    rows: [],
    rowCount: Number(rowCount),
  };
};
