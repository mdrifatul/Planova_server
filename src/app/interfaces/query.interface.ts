// =============== Prisma Delegate Types ===============

// Represents a Prisma model delegate (e.g., prisma.event, prisma.user)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PrismaModelDelegate {
  findMany: (args?: any) => Promise<any[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findFirst: (args?: any) => Promise<any | null>;
  count: (args?: any) => Promise<number>;
}

// =============== Prisma Query Argument Shapes ===============

export interface PrismaFindManyArgs {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, boolean | Record<string, unknown>>;
  orderBy?: Record<string, unknown>;
  skip?: number;
  take?: number;
}

export interface PrismaCountArgs {
  where?: Record<string, unknown>;
}

// =============== Prisma Filter Types ===============

export interface PrismaStringFilter {
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  equals?: string;
  not?: string;
  in?: string[];
  notIn?: string[];
  mode?: "default" | "insensitive";
}

export interface PrismaNumberFilter {
  equals?: number;
  not?: number;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  in?: number[];
  notIn?: number[];
}

export interface PrismaWhereConditions {
  AND?: Record<string, unknown>[];
  OR?: Record<string, unknown>[];
  NOT?: Record<string, unknown>[];
  [key: string]: unknown;
}

// =============== Query Builder Input Types ===============

export interface IQueryParams {
  searchTerm?: string;
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  fields?: string;
  include?: string;
  [key: string]: unknown;
}

export interface IQueryConfig {
  searchableFields?: string[];
  filterableFields?: string[];
}

// =============== Query Builder Output Types ===============

export interface IQueryMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IQueryResult<T> {
  data: T[];
  meta: IQueryMeta;
}
