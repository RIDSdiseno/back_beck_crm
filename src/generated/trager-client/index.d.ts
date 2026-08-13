
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Cliente
 * 
 */
export type Cliente = $Result.DefaultSelection<Prisma.$ClientePayload>
/**
 * Model FunnelTragerOpportunity
 * 
 */
export type FunnelTragerOpportunity = $Result.DefaultSelection<Prisma.$FunnelTragerOpportunityPayload>
/**
 * Model FunnelTragerArchivo
 * 
 */
export type FunnelTragerArchivo = $Result.DefaultSelection<Prisma.$FunnelTragerArchivoPayload>
/**
 * Model HistorialEtapaTrager
 * 
 */
export type HistorialEtapaTrager = $Result.DefaultSelection<Prisma.$HistorialEtapaTragerPayload>
/**
 * Model Categoria
 * 
 */
export type Categoria = $Result.DefaultSelection<Prisma.$CategoriaPayload>
/**
 * Model Producto
 * 
 */
export type Producto = $Result.DefaultSelection<Prisma.$ProductoPayload>
/**
 * Model CotizacionTrager
 * 
 */
export type CotizacionTrager = $Result.DefaultSelection<Prisma.$CotizacionTragerPayload>
/**
 * Model CotizacionTragerDetalle
 * 
 */
export type CotizacionTragerDetalle = $Result.DefaultSelection<Prisma.$CotizacionTragerDetallePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Clientes
 * const clientes = await prisma.cliente.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Clientes
   * const clientes = await prisma.cliente.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.cliente`: Exposes CRUD operations for the **Cliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clientes
    * const clientes = await prisma.cliente.findMany()
    * ```
    */
  get cliente(): Prisma.ClienteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.funnelTragerOpportunity`: Exposes CRUD operations for the **FunnelTragerOpportunity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FunnelTragerOpportunities
    * const funnelTragerOpportunities = await prisma.funnelTragerOpportunity.findMany()
    * ```
    */
  get funnelTragerOpportunity(): Prisma.FunnelTragerOpportunityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.funnelTragerArchivo`: Exposes CRUD operations for the **FunnelTragerArchivo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FunnelTragerArchivos
    * const funnelTragerArchivos = await prisma.funnelTragerArchivo.findMany()
    * ```
    */
  get funnelTragerArchivo(): Prisma.FunnelTragerArchivoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.historialEtapaTrager`: Exposes CRUD operations for the **HistorialEtapaTrager** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HistorialEtapaTragers
    * const historialEtapaTragers = await prisma.historialEtapaTrager.findMany()
    * ```
    */
  get historialEtapaTrager(): Prisma.HistorialEtapaTragerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.categoria`: Exposes CRUD operations for the **Categoria** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categorias
    * const categorias = await prisma.categoria.findMany()
    * ```
    */
  get categoria(): Prisma.CategoriaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.producto`: Exposes CRUD operations for the **Producto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Productos
    * const productos = await prisma.producto.findMany()
    * ```
    */
  get producto(): Prisma.ProductoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cotizacionTrager`: Exposes CRUD operations for the **CotizacionTrager** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CotizacionTragers
    * const cotizacionTragers = await prisma.cotizacionTrager.findMany()
    * ```
    */
  get cotizacionTrager(): Prisma.CotizacionTragerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cotizacionTragerDetalle`: Exposes CRUD operations for the **CotizacionTragerDetalle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CotizacionTragerDetalles
    * const cotizacionTragerDetalles = await prisma.cotizacionTragerDetalle.findMany()
    * ```
    */
  get cotizacionTragerDetalle(): Prisma.CotizacionTragerDetalleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Cliente: 'Cliente',
    FunnelTragerOpportunity: 'FunnelTragerOpportunity',
    FunnelTragerArchivo: 'FunnelTragerArchivo',
    HistorialEtapaTrager: 'HistorialEtapaTrager',
    Categoria: 'Categoria',
    Producto: 'Producto',
    CotizacionTrager: 'CotizacionTrager',
    CotizacionTragerDetalle: 'CotizacionTragerDetalle'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "cliente" | "funnelTragerOpportunity" | "funnelTragerArchivo" | "historialEtapaTrager" | "categoria" | "producto" | "cotizacionTrager" | "cotizacionTragerDetalle"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Cliente: {
        payload: Prisma.$ClientePayload<ExtArgs>
        fields: Prisma.ClienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          findFirst: {
            args: Prisma.ClienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          findMany: {
            args: Prisma.ClienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          create: {
            args: Prisma.ClienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          createMany: {
            args: Prisma.ClienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          delete: {
            args: Prisma.ClienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          update: {
            args: Prisma.ClienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          deleteMany: {
            args: Prisma.ClienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClienteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          upsert: {
            args: Prisma.ClienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          aggregate: {
            args: Prisma.ClienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCliente>
          }
          groupBy: {
            args: Prisma.ClienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClienteCountArgs<ExtArgs>
            result: $Utils.Optional<ClienteCountAggregateOutputType> | number
          }
        }
      }
      FunnelTragerOpportunity: {
        payload: Prisma.$FunnelTragerOpportunityPayload<ExtArgs>
        fields: Prisma.FunnelTragerOpportunityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FunnelTragerOpportunityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FunnelTragerOpportunityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload>
          }
          findFirst: {
            args: Prisma.FunnelTragerOpportunityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FunnelTragerOpportunityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload>
          }
          findMany: {
            args: Prisma.FunnelTragerOpportunityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload>[]
          }
          create: {
            args: Prisma.FunnelTragerOpportunityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload>
          }
          createMany: {
            args: Prisma.FunnelTragerOpportunityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FunnelTragerOpportunityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload>[]
          }
          delete: {
            args: Prisma.FunnelTragerOpportunityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload>
          }
          update: {
            args: Prisma.FunnelTragerOpportunityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload>
          }
          deleteMany: {
            args: Prisma.FunnelTragerOpportunityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FunnelTragerOpportunityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FunnelTragerOpportunityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload>[]
          }
          upsert: {
            args: Prisma.FunnelTragerOpportunityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerOpportunityPayload>
          }
          aggregate: {
            args: Prisma.FunnelTragerOpportunityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFunnelTragerOpportunity>
          }
          groupBy: {
            args: Prisma.FunnelTragerOpportunityGroupByArgs<ExtArgs>
            result: $Utils.Optional<FunnelTragerOpportunityGroupByOutputType>[]
          }
          count: {
            args: Prisma.FunnelTragerOpportunityCountArgs<ExtArgs>
            result: $Utils.Optional<FunnelTragerOpportunityCountAggregateOutputType> | number
          }
        }
      }
      FunnelTragerArchivo: {
        payload: Prisma.$FunnelTragerArchivoPayload<ExtArgs>
        fields: Prisma.FunnelTragerArchivoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FunnelTragerArchivoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FunnelTragerArchivoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload>
          }
          findFirst: {
            args: Prisma.FunnelTragerArchivoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FunnelTragerArchivoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload>
          }
          findMany: {
            args: Prisma.FunnelTragerArchivoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload>[]
          }
          create: {
            args: Prisma.FunnelTragerArchivoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload>
          }
          createMany: {
            args: Prisma.FunnelTragerArchivoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FunnelTragerArchivoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload>[]
          }
          delete: {
            args: Prisma.FunnelTragerArchivoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload>
          }
          update: {
            args: Prisma.FunnelTragerArchivoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload>
          }
          deleteMany: {
            args: Prisma.FunnelTragerArchivoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FunnelTragerArchivoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FunnelTragerArchivoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload>[]
          }
          upsert: {
            args: Prisma.FunnelTragerArchivoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FunnelTragerArchivoPayload>
          }
          aggregate: {
            args: Prisma.FunnelTragerArchivoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFunnelTragerArchivo>
          }
          groupBy: {
            args: Prisma.FunnelTragerArchivoGroupByArgs<ExtArgs>
            result: $Utils.Optional<FunnelTragerArchivoGroupByOutputType>[]
          }
          count: {
            args: Prisma.FunnelTragerArchivoCountArgs<ExtArgs>
            result: $Utils.Optional<FunnelTragerArchivoCountAggregateOutputType> | number
          }
        }
      }
      HistorialEtapaTrager: {
        payload: Prisma.$HistorialEtapaTragerPayload<ExtArgs>
        fields: Prisma.HistorialEtapaTragerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HistorialEtapaTragerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HistorialEtapaTragerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload>
          }
          findFirst: {
            args: Prisma.HistorialEtapaTragerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HistorialEtapaTragerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload>
          }
          findMany: {
            args: Prisma.HistorialEtapaTragerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload>[]
          }
          create: {
            args: Prisma.HistorialEtapaTragerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload>
          }
          createMany: {
            args: Prisma.HistorialEtapaTragerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HistorialEtapaTragerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload>[]
          }
          delete: {
            args: Prisma.HistorialEtapaTragerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload>
          }
          update: {
            args: Prisma.HistorialEtapaTragerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload>
          }
          deleteMany: {
            args: Prisma.HistorialEtapaTragerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HistorialEtapaTragerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HistorialEtapaTragerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload>[]
          }
          upsert: {
            args: Prisma.HistorialEtapaTragerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialEtapaTragerPayload>
          }
          aggregate: {
            args: Prisma.HistorialEtapaTragerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHistorialEtapaTrager>
          }
          groupBy: {
            args: Prisma.HistorialEtapaTragerGroupByArgs<ExtArgs>
            result: $Utils.Optional<HistorialEtapaTragerGroupByOutputType>[]
          }
          count: {
            args: Prisma.HistorialEtapaTragerCountArgs<ExtArgs>
            result: $Utils.Optional<HistorialEtapaTragerCountAggregateOutputType> | number
          }
        }
      }
      Categoria: {
        payload: Prisma.$CategoriaPayload<ExtArgs>
        fields: Prisma.CategoriaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoriaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoriaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          findFirst: {
            args: Prisma.CategoriaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoriaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          findMany: {
            args: Prisma.CategoriaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>[]
          }
          create: {
            args: Prisma.CategoriaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          createMany: {
            args: Prisma.CategoriaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoriaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>[]
          }
          delete: {
            args: Prisma.CategoriaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          update: {
            args: Prisma.CategoriaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          deleteMany: {
            args: Prisma.CategoriaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoriaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoriaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>[]
          }
          upsert: {
            args: Prisma.CategoriaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          aggregate: {
            args: Prisma.CategoriaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategoria>
          }
          groupBy: {
            args: Prisma.CategoriaGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoriaGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoriaCountArgs<ExtArgs>
            result: $Utils.Optional<CategoriaCountAggregateOutputType> | number
          }
        }
      }
      Producto: {
        payload: Prisma.$ProductoPayload<ExtArgs>
        fields: Prisma.ProductoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          findFirst: {
            args: Prisma.ProductoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          findMany: {
            args: Prisma.ProductoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>[]
          }
          create: {
            args: Prisma.ProductoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          createMany: {
            args: Prisma.ProductoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>[]
          }
          delete: {
            args: Prisma.ProductoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          update: {
            args: Prisma.ProductoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          deleteMany: {
            args: Prisma.ProductoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>[]
          }
          upsert: {
            args: Prisma.ProductoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          aggregate: {
            args: Prisma.ProductoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProducto>
          }
          groupBy: {
            args: Prisma.ProductoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductoCountArgs<ExtArgs>
            result: $Utils.Optional<ProductoCountAggregateOutputType> | number
          }
        }
      }
      CotizacionTrager: {
        payload: Prisma.$CotizacionTragerPayload<ExtArgs>
        fields: Prisma.CotizacionTragerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CotizacionTragerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CotizacionTragerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload>
          }
          findFirst: {
            args: Prisma.CotizacionTragerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CotizacionTragerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload>
          }
          findMany: {
            args: Prisma.CotizacionTragerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload>[]
          }
          create: {
            args: Prisma.CotizacionTragerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload>
          }
          createMany: {
            args: Prisma.CotizacionTragerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CotizacionTragerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload>[]
          }
          delete: {
            args: Prisma.CotizacionTragerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload>
          }
          update: {
            args: Prisma.CotizacionTragerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload>
          }
          deleteMany: {
            args: Prisma.CotizacionTragerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CotizacionTragerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CotizacionTragerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload>[]
          }
          upsert: {
            args: Prisma.CotizacionTragerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerPayload>
          }
          aggregate: {
            args: Prisma.CotizacionTragerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCotizacionTrager>
          }
          groupBy: {
            args: Prisma.CotizacionTragerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CotizacionTragerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CotizacionTragerCountArgs<ExtArgs>
            result: $Utils.Optional<CotizacionTragerCountAggregateOutputType> | number
          }
        }
      }
      CotizacionTragerDetalle: {
        payload: Prisma.$CotizacionTragerDetallePayload<ExtArgs>
        fields: Prisma.CotizacionTragerDetalleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CotizacionTragerDetalleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CotizacionTragerDetalleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload>
          }
          findFirst: {
            args: Prisma.CotizacionTragerDetalleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CotizacionTragerDetalleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload>
          }
          findMany: {
            args: Prisma.CotizacionTragerDetalleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload>[]
          }
          create: {
            args: Prisma.CotizacionTragerDetalleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload>
          }
          createMany: {
            args: Prisma.CotizacionTragerDetalleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CotizacionTragerDetalleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload>[]
          }
          delete: {
            args: Prisma.CotizacionTragerDetalleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload>
          }
          update: {
            args: Prisma.CotizacionTragerDetalleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload>
          }
          deleteMany: {
            args: Prisma.CotizacionTragerDetalleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CotizacionTragerDetalleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CotizacionTragerDetalleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload>[]
          }
          upsert: {
            args: Prisma.CotizacionTragerDetalleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CotizacionTragerDetallePayload>
          }
          aggregate: {
            args: Prisma.CotizacionTragerDetalleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCotizacionTragerDetalle>
          }
          groupBy: {
            args: Prisma.CotizacionTragerDetalleGroupByArgs<ExtArgs>
            result: $Utils.Optional<CotizacionTragerDetalleGroupByOutputType>[]
          }
          count: {
            args: Prisma.CotizacionTragerDetalleCountArgs<ExtArgs>
            result: $Utils.Optional<CotizacionTragerDetalleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    cliente?: ClienteOmit
    funnelTragerOpportunity?: FunnelTragerOpportunityOmit
    funnelTragerArchivo?: FunnelTragerArchivoOmit
    historialEtapaTrager?: HistorialEtapaTragerOmit
    categoria?: CategoriaOmit
    producto?: ProductoOmit
    cotizacionTrager?: CotizacionTragerOmit
    cotizacionTragerDetalle?: CotizacionTragerDetalleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type FunnelTragerOpportunityCountOutputType
   */

  export type FunnelTragerOpportunityCountOutputType = {
    archivos: number
    historialEtapas: number
  }

  export type FunnelTragerOpportunityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    archivos?: boolean | FunnelTragerOpportunityCountOutputTypeCountArchivosArgs
    historialEtapas?: boolean | FunnelTragerOpportunityCountOutputTypeCountHistorialEtapasArgs
  }

  // Custom InputTypes
  /**
   * FunnelTragerOpportunityCountOutputType without action
   */
  export type FunnelTragerOpportunityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunityCountOutputType
     */
    select?: FunnelTragerOpportunityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FunnelTragerOpportunityCountOutputType without action
   */
  export type FunnelTragerOpportunityCountOutputTypeCountArchivosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FunnelTragerArchivoWhereInput
  }

  /**
   * FunnelTragerOpportunityCountOutputType without action
   */
  export type FunnelTragerOpportunityCountOutputTypeCountHistorialEtapasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HistorialEtapaTragerWhereInput
  }


  /**
   * Count Type CategoriaCountOutputType
   */

  export type CategoriaCountOutputType = {
    Producto: number
  }

  export type CategoriaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | CategoriaCountOutputTypeCountProductoArgs
  }

  // Custom InputTypes
  /**
   * CategoriaCountOutputType without action
   */
  export type CategoriaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaCountOutputType
     */
    select?: CategoriaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoriaCountOutputType without action
   */
  export type CategoriaCountOutputTypeCountProductoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductoWhereInput
  }


  /**
   * Count Type ProductoCountOutputType
   */

  export type ProductoCountOutputType = {
    CotizacionTragerDetalle: number
  }

  export type ProductoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CotizacionTragerDetalle?: boolean | ProductoCountOutputTypeCountCotizacionTragerDetalleArgs
  }

  // Custom InputTypes
  /**
   * ProductoCountOutputType without action
   */
  export type ProductoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductoCountOutputType
     */
    select?: ProductoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductoCountOutputType without action
   */
  export type ProductoCountOutputTypeCountCotizacionTragerDetalleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CotizacionTragerDetalleWhereInput
  }


  /**
   * Count Type CotizacionTragerCountOutputType
   */

  export type CotizacionTragerCountOutputType = {
    detalles: number
  }

  export type CotizacionTragerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detalles?: boolean | CotizacionTragerCountOutputTypeCountDetallesArgs
  }

  // Custom InputTypes
  /**
   * CotizacionTragerCountOutputType without action
   */
  export type CotizacionTragerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerCountOutputType
     */
    select?: CotizacionTragerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CotizacionTragerCountOutputType without action
   */
  export type CotizacionTragerCountOutputTypeCountDetallesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CotizacionTragerDetalleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Cliente
   */

  export type AggregateCliente = {
    _count: ClienteCountAggregateOutputType | null
    _avg: ClienteAvgAggregateOutputType | null
    _sum: ClienteSumAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  export type ClienteAvgAggregateOutputType = {
    id: number | null
  }

  export type ClienteSumAggregateOutputType = {
    id: number | null
  }

  export type ClienteMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    rut: string | null
    contactoNombre: string | null
    contactoTelefono: string | null
    contactoCorreo: string | null
    activo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClienteMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    rut: string | null
    contactoNombre: string | null
    contactoTelefono: string | null
    contactoCorreo: string | null
    activo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClienteCountAggregateOutputType = {
    id: number
    nombre: number
    rut: number
    contactoNombre: number
    contactoTelefono: number
    contactoCorreo: number
    activo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClienteAvgAggregateInputType = {
    id?: true
  }

  export type ClienteSumAggregateInputType = {
    id?: true
  }

  export type ClienteMinAggregateInputType = {
    id?: true
    nombre?: true
    rut?: true
    contactoNombre?: true
    contactoTelefono?: true
    contactoCorreo?: true
    activo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClienteMaxAggregateInputType = {
    id?: true
    nombre?: true
    rut?: true
    contactoNombre?: true
    contactoTelefono?: true
    contactoCorreo?: true
    activo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClienteCountAggregateInputType = {
    id?: true
    nombre?: true
    rut?: true
    contactoNombre?: true
    contactoTelefono?: true
    contactoCorreo?: true
    activo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cliente to aggregate.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clientes
    **/
    _count?: true | ClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClienteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClienteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClienteMaxAggregateInputType
  }

  export type GetClienteAggregateType<T extends ClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCliente[P]>
      : GetScalarType<T[P], AggregateCliente[P]>
  }




  export type ClienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClienteWhereInput
    orderBy?: ClienteOrderByWithAggregationInput | ClienteOrderByWithAggregationInput[]
    by: ClienteScalarFieldEnum[] | ClienteScalarFieldEnum
    having?: ClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClienteCountAggregateInputType | true
    _avg?: ClienteAvgAggregateInputType
    _sum?: ClienteSumAggregateInputType
    _min?: ClienteMinAggregateInputType
    _max?: ClienteMaxAggregateInputType
  }

  export type ClienteGroupByOutputType = {
    id: number
    nombre: string
    rut: string | null
    contactoNombre: string | null
    contactoTelefono: string | null
    contactoCorreo: string | null
    activo: boolean
    createdAt: Date
    updatedAt: Date
    _count: ClienteCountAggregateOutputType | null
    _avg: ClienteAvgAggregateOutputType | null
    _sum: ClienteSumAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  type GetClienteGroupByPayload<T extends ClienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClienteGroupByOutputType[P]>
            : GetScalarType<T[P], ClienteGroupByOutputType[P]>
        }
      >
    >


  export type ClienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    rut?: boolean
    contactoNombre?: boolean
    contactoTelefono?: boolean
    contactoCorreo?: boolean
    activo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    rut?: boolean
    contactoNombre?: boolean
    contactoTelefono?: boolean
    contactoCorreo?: boolean
    activo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    rut?: boolean
    contactoNombre?: boolean
    contactoTelefono?: boolean
    contactoCorreo?: boolean
    activo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectScalar = {
    id?: boolean
    nombre?: boolean
    rut?: boolean
    contactoNombre?: boolean
    contactoTelefono?: boolean
    contactoCorreo?: boolean
    activo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClienteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "rut" | "contactoNombre" | "contactoTelefono" | "contactoCorreo" | "activo" | "createdAt" | "updatedAt", ExtArgs["result"]["cliente"]>

  export type $ClientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cliente"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      rut: string | null
      contactoNombre: string | null
      contactoTelefono: string | null
      contactoCorreo: string | null
      activo: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cliente"]>
    composites: {}
  }

  type ClienteGetPayload<S extends boolean | null | undefined | ClienteDefaultArgs> = $Result.GetResult<Prisma.$ClientePayload, S>

  type ClienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClienteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClienteCountAggregateInputType | true
    }

  export interface ClienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cliente'], meta: { name: 'Cliente' } }
    /**
     * Find zero or one Cliente that matches the filter.
     * @param {ClienteFindUniqueArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClienteFindUniqueArgs>(args: SelectSubset<T, ClienteFindUniqueArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cliente that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClienteFindUniqueOrThrowArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClienteFindUniqueOrThrowArgs>(args: SelectSubset<T, ClienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClienteFindFirstArgs>(args?: SelectSubset<T, ClienteFindFirstArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstOrThrowArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClienteFindFirstOrThrowArgs>(args?: SelectSubset<T, ClienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clientes
     * const clientes = await prisma.cliente.findMany()
     * 
     * // Get first 10 Clientes
     * const clientes = await prisma.cliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clienteWithIdOnly = await prisma.cliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClienteFindManyArgs>(args?: SelectSubset<T, ClienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cliente.
     * @param {ClienteCreateArgs} args - Arguments to create a Cliente.
     * @example
     * // Create one Cliente
     * const Cliente = await prisma.cliente.create({
     *   data: {
     *     // ... data to create a Cliente
     *   }
     * })
     * 
     */
    create<T extends ClienteCreateArgs>(args: SelectSubset<T, ClienteCreateArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clientes.
     * @param {ClienteCreateManyArgs} args - Arguments to create many Clientes.
     * @example
     * // Create many Clientes
     * const cliente = await prisma.cliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClienteCreateManyArgs>(args?: SelectSubset<T, ClienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clientes and returns the data saved in the database.
     * @param {ClienteCreateManyAndReturnArgs} args - Arguments to create many Clientes.
     * @example
     * // Create many Clientes
     * const cliente = await prisma.cliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clientes and only return the `id`
     * const clienteWithIdOnly = await prisma.cliente.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClienteCreateManyAndReturnArgs>(args?: SelectSubset<T, ClienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Cliente.
     * @param {ClienteDeleteArgs} args - Arguments to delete one Cliente.
     * @example
     * // Delete one Cliente
     * const Cliente = await prisma.cliente.delete({
     *   where: {
     *     // ... filter to delete one Cliente
     *   }
     * })
     * 
     */
    delete<T extends ClienteDeleteArgs>(args: SelectSubset<T, ClienteDeleteArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cliente.
     * @param {ClienteUpdateArgs} args - Arguments to update one Cliente.
     * @example
     * // Update one Cliente
     * const cliente = await prisma.cliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClienteUpdateArgs>(args: SelectSubset<T, ClienteUpdateArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clientes.
     * @param {ClienteDeleteManyArgs} args - Arguments to filter Clientes to delete.
     * @example
     * // Delete a few Clientes
     * const { count } = await prisma.cliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClienteDeleteManyArgs>(args?: SelectSubset<T, ClienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clientes
     * const cliente = await prisma.cliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClienteUpdateManyArgs>(args: SelectSubset<T, ClienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clientes and returns the data updated in the database.
     * @param {ClienteUpdateManyAndReturnArgs} args - Arguments to update many Clientes.
     * @example
     * // Update many Clientes
     * const cliente = await prisma.cliente.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clientes and only return the `id`
     * const clienteWithIdOnly = await prisma.cliente.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClienteUpdateManyAndReturnArgs>(args: SelectSubset<T, ClienteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Cliente.
     * @param {ClienteUpsertArgs} args - Arguments to update or create a Cliente.
     * @example
     * // Update or create a Cliente
     * const cliente = await prisma.cliente.upsert({
     *   create: {
     *     // ... data to create a Cliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cliente we want to update
     *   }
     * })
     */
    upsert<T extends ClienteUpsertArgs>(args: SelectSubset<T, ClienteUpsertArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteCountArgs} args - Arguments to filter Clientes to count.
     * @example
     * // Count the number of Clientes
     * const count = await prisma.cliente.count({
     *   where: {
     *     // ... the filter for the Clientes we want to count
     *   }
     * })
    **/
    count<T extends ClienteCountArgs>(
      args?: Subset<T, ClienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClienteAggregateArgs>(args: Subset<T, ClienteAggregateArgs>): Prisma.PrismaPromise<GetClienteAggregateType<T>>

    /**
     * Group by Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClienteGroupByArgs['orderBy'] }
        : { orderBy?: ClienteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cliente model
   */
  readonly fields: ClienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cliente model
   */
  interface ClienteFieldRefs {
    readonly id: FieldRef<"Cliente", 'Int'>
    readonly nombre: FieldRef<"Cliente", 'String'>
    readonly rut: FieldRef<"Cliente", 'String'>
    readonly contactoNombre: FieldRef<"Cliente", 'String'>
    readonly contactoTelefono: FieldRef<"Cliente", 'String'>
    readonly contactoCorreo: FieldRef<"Cliente", 'String'>
    readonly activo: FieldRef<"Cliente", 'Boolean'>
    readonly createdAt: FieldRef<"Cliente", 'DateTime'>
    readonly updatedAt: FieldRef<"Cliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cliente findUnique
   */
  export type ClienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente findUniqueOrThrow
   */
  export type ClienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente findFirst
   */
  export type ClienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente findFirstOrThrow
   */
  export type ClienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente findMany
   */
  export type ClienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Filter, which Clientes to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente create
   */
  export type ClienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * The data needed to create a Cliente.
     */
    data: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
  }

  /**
   * Cliente createMany
   */
  export type ClienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clientes.
     */
    data: ClienteCreateManyInput | ClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cliente createManyAndReturn
   */
  export type ClienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * The data used to create many Clientes.
     */
    data: ClienteCreateManyInput | ClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cliente update
   */
  export type ClienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * The data needed to update a Cliente.
     */
    data: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
    /**
     * Choose, which Cliente to update.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente updateMany
   */
  export type ClienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clientes.
     */
    data: XOR<ClienteUpdateManyMutationInput, ClienteUncheckedUpdateManyInput>
    /**
     * Filter which Clientes to update
     */
    where?: ClienteWhereInput
    /**
     * Limit how many Clientes to update.
     */
    limit?: number
  }

  /**
   * Cliente updateManyAndReturn
   */
  export type ClienteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * The data used to update Clientes.
     */
    data: XOR<ClienteUpdateManyMutationInput, ClienteUncheckedUpdateManyInput>
    /**
     * Filter which Clientes to update
     */
    where?: ClienteWhereInput
    /**
     * Limit how many Clientes to update.
     */
    limit?: number
  }

  /**
   * Cliente upsert
   */
  export type ClienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * The filter to search for the Cliente to update in case it exists.
     */
    where: ClienteWhereUniqueInput
    /**
     * In case the Cliente found by the `where` argument doesn't exist, create a new Cliente with this data.
     */
    create: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
    /**
     * In case the Cliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
  }

  /**
   * Cliente delete
   */
  export type ClienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Filter which Cliente to delete.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente deleteMany
   */
  export type ClienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clientes to delete
     */
    where?: ClienteWhereInput
    /**
     * Limit how many Clientes to delete.
     */
    limit?: number
  }

  /**
   * Cliente without action
   */
  export type ClienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
  }


  /**
   * Model FunnelTragerOpportunity
   */

  export type AggregateFunnelTragerOpportunity = {
    _count: FunnelTragerOpportunityCountAggregateOutputType | null
    _avg: FunnelTragerOpportunityAvgAggregateOutputType | null
    _sum: FunnelTragerOpportunitySumAggregateOutputType | null
    _min: FunnelTragerOpportunityMinAggregateOutputType | null
    _max: FunnelTragerOpportunityMaxAggregateOutputType | null
  }

  export type FunnelTragerOpportunityAvgAggregateOutputType = {
    id: number | null
    productoId: number | null
    cantidadEstimada: number | null
    comision: number | null
    margenEstimado: number | null
    montoEstimado: number | null
    probabilidadCierre: number | null
    cotizacionId: number | null
    probabilidad: number | null
    descuento: number | null
    reprogramacionesCount: number | null
  }

  export type FunnelTragerOpportunitySumAggregateOutputType = {
    id: number | null
    productoId: number | null
    cantidadEstimada: number | null
    comision: number | null
    margenEstimado: number | null
    montoEstimado: number | null
    probabilidadCierre: number | null
    cotizacionId: number | null
    probabilidad: number | null
    descuento: number | null
    reprogramacionesCount: number | null
  }

  export type FunnelTragerOpportunityMinAggregateOutputType = {
    id: number | null
    cliente: string | null
    contacto: string | null
    telefono: string | null
    correo: string | null
    tipoCliente: string | null
    rutEmpresa: string | null
    region: string | null
    comuna: string | null
    unidadNegocio: string | null
    productoId: number | null
    cantidadEstimada: number | null
    urgencia: string | null
    tipoUso: string | null
    necesidadSoporteTecnico: boolean | null
    alternativaProducto: string | null
    comision: number | null
    margenEstimado: number | null
    fechaComprometidaEnvio: Date | null
    versionCotizacion: string | null
    comentariosCliente: string | null
    objeciones: string | null
    ordenCompra: string | null
    correoAceptacion: string | null
    condicionesComerciales: string | null
    coordinacionAdministrativa: string | null
    estadoDocumentacion: string | null
    traspasoAdministracion: boolean | null
    traspasoERP: boolean | null
    coordinacionDespacho: string | null
    estadoComercialOrden: string | null
    estadoDocumentacionVenta: string | null
    responsable: string | null
    etapa: string | null
    montoEstimado: number | null
    probabilidadCierre: number | null
    proximaAccion: string | null
    fechaProximaAccion: Date | null
    observaciones: string | null
    origen: string | null
    estadoStock: string | null
    cotizacionId: number | null
    motivoPerdida: string | null
    motivoPostergacion: string | null
    fechaReactivacion: Date | null
    documentoRespaldo: string | null
    fechaCierre: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    probabilidad: number | null
    flujoPosterior: string | null
    motivoDescarte: string | null
    tipoBroker: string | null
    fechaEstimadaDespacho: Date | null
    fechaSeguimientoPostventa: Date | null
    nombreOportunidad: string | null
    cargoContacto: string | null
    direccionProyecto: string | null
    tipoOportunidad: string | null
    fechaProbableCierre: Date | null
    riesgoTecnico: string | null
    comentariosInternos: string | null
    observacionesTecnicas: string | null
    observacionCamposFaltantes: string | null
    lineaProducto: string | null
    descuento: number | null
    stockOportunidad: string | null
    reprogramacionesCount: number | null
    fechaUltimoCambioEtapa: Date | null
    esReactivacion: boolean | null
  }

  export type FunnelTragerOpportunityMaxAggregateOutputType = {
    id: number | null
    cliente: string | null
    contacto: string | null
    telefono: string | null
    correo: string | null
    tipoCliente: string | null
    rutEmpresa: string | null
    region: string | null
    comuna: string | null
    unidadNegocio: string | null
    productoId: number | null
    cantidadEstimada: number | null
    urgencia: string | null
    tipoUso: string | null
    necesidadSoporteTecnico: boolean | null
    alternativaProducto: string | null
    comision: number | null
    margenEstimado: number | null
    fechaComprometidaEnvio: Date | null
    versionCotizacion: string | null
    comentariosCliente: string | null
    objeciones: string | null
    ordenCompra: string | null
    correoAceptacion: string | null
    condicionesComerciales: string | null
    coordinacionAdministrativa: string | null
    estadoDocumentacion: string | null
    traspasoAdministracion: boolean | null
    traspasoERP: boolean | null
    coordinacionDespacho: string | null
    estadoComercialOrden: string | null
    estadoDocumentacionVenta: string | null
    responsable: string | null
    etapa: string | null
    montoEstimado: number | null
    probabilidadCierre: number | null
    proximaAccion: string | null
    fechaProximaAccion: Date | null
    observaciones: string | null
    origen: string | null
    estadoStock: string | null
    cotizacionId: number | null
    motivoPerdida: string | null
    motivoPostergacion: string | null
    fechaReactivacion: Date | null
    documentoRespaldo: string | null
    fechaCierre: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    probabilidad: number | null
    flujoPosterior: string | null
    motivoDescarte: string | null
    tipoBroker: string | null
    fechaEstimadaDespacho: Date | null
    fechaSeguimientoPostventa: Date | null
    nombreOportunidad: string | null
    cargoContacto: string | null
    direccionProyecto: string | null
    tipoOportunidad: string | null
    fechaProbableCierre: Date | null
    riesgoTecnico: string | null
    comentariosInternos: string | null
    observacionesTecnicas: string | null
    observacionCamposFaltantes: string | null
    lineaProducto: string | null
    descuento: number | null
    stockOportunidad: string | null
    reprogramacionesCount: number | null
    fechaUltimoCambioEtapa: Date | null
    esReactivacion: boolean | null
  }

  export type FunnelTragerOpportunityCountAggregateOutputType = {
    id: number
    cliente: number
    contacto: number
    telefono: number
    correo: number
    tipoCliente: number
    rutEmpresa: number
    region: number
    comuna: number
    unidadNegocio: number
    productoId: number
    cantidadEstimada: number
    urgencia: number
    tipoUso: number
    necesidadSoporteTecnico: number
    alternativaProducto: number
    comision: number
    margenEstimado: number
    fechaComprometidaEnvio: number
    versionCotizacion: number
    comentariosCliente: number
    objeciones: number
    ordenCompra: number
    correoAceptacion: number
    condicionesComerciales: number
    coordinacionAdministrativa: number
    estadoDocumentacion: number
    traspasoAdministracion: number
    traspasoERP: number
    coordinacionDespacho: number
    estadoComercialOrden: number
    estadoDocumentacionVenta: number
    responsable: number
    etapa: number
    montoEstimado: number
    probabilidadCierre: number
    proximaAccion: number
    fechaProximaAccion: number
    observaciones: number
    origen: number
    estadoStock: number
    cotizacionId: number
    motivoPerdida: number
    motivoPostergacion: number
    fechaReactivacion: number
    documentoRespaldo: number
    fechaCierre: number
    createdAt: number
    updatedAt: number
    probabilidad: number
    flujoPosterior: number
    motivoDescarte: number
    tipoBroker: number
    fechaEstimadaDespacho: number
    fechaSeguimientoPostventa: number
    nombreOportunidad: number
    cargoContacto: number
    direccionProyecto: number
    tipoOportunidad: number
    fechaProbableCierre: number
    riesgoTecnico: number
    comentariosInternos: number
    observacionesTecnicas: number
    observacionCamposFaltantes: number
    lineaProducto: number
    descuento: number
    stockOportunidad: number
    reprogramacionesCount: number
    fechaUltimoCambioEtapa: number
    esReactivacion: number
    _all: number
  }


  export type FunnelTragerOpportunityAvgAggregateInputType = {
    id?: true
    productoId?: true
    cantidadEstimada?: true
    comision?: true
    margenEstimado?: true
    montoEstimado?: true
    probabilidadCierre?: true
    cotizacionId?: true
    probabilidad?: true
    descuento?: true
    reprogramacionesCount?: true
  }

  export type FunnelTragerOpportunitySumAggregateInputType = {
    id?: true
    productoId?: true
    cantidadEstimada?: true
    comision?: true
    margenEstimado?: true
    montoEstimado?: true
    probabilidadCierre?: true
    cotizacionId?: true
    probabilidad?: true
    descuento?: true
    reprogramacionesCount?: true
  }

  export type FunnelTragerOpportunityMinAggregateInputType = {
    id?: true
    cliente?: true
    contacto?: true
    telefono?: true
    correo?: true
    tipoCliente?: true
    rutEmpresa?: true
    region?: true
    comuna?: true
    unidadNegocio?: true
    productoId?: true
    cantidadEstimada?: true
    urgencia?: true
    tipoUso?: true
    necesidadSoporteTecnico?: true
    alternativaProducto?: true
    comision?: true
    margenEstimado?: true
    fechaComprometidaEnvio?: true
    versionCotizacion?: true
    comentariosCliente?: true
    objeciones?: true
    ordenCompra?: true
    correoAceptacion?: true
    condicionesComerciales?: true
    coordinacionAdministrativa?: true
    estadoDocumentacion?: true
    traspasoAdministracion?: true
    traspasoERP?: true
    coordinacionDespacho?: true
    estadoComercialOrden?: true
    estadoDocumentacionVenta?: true
    responsable?: true
    etapa?: true
    montoEstimado?: true
    probabilidadCierre?: true
    proximaAccion?: true
    fechaProximaAccion?: true
    observaciones?: true
    origen?: true
    estadoStock?: true
    cotizacionId?: true
    motivoPerdida?: true
    motivoPostergacion?: true
    fechaReactivacion?: true
    documentoRespaldo?: true
    fechaCierre?: true
    createdAt?: true
    updatedAt?: true
    probabilidad?: true
    flujoPosterior?: true
    motivoDescarte?: true
    tipoBroker?: true
    fechaEstimadaDespacho?: true
    fechaSeguimientoPostventa?: true
    nombreOportunidad?: true
    cargoContacto?: true
    direccionProyecto?: true
    tipoOportunidad?: true
    fechaProbableCierre?: true
    riesgoTecnico?: true
    comentariosInternos?: true
    observacionesTecnicas?: true
    observacionCamposFaltantes?: true
    lineaProducto?: true
    descuento?: true
    stockOportunidad?: true
    reprogramacionesCount?: true
    fechaUltimoCambioEtapa?: true
    esReactivacion?: true
  }

  export type FunnelTragerOpportunityMaxAggregateInputType = {
    id?: true
    cliente?: true
    contacto?: true
    telefono?: true
    correo?: true
    tipoCliente?: true
    rutEmpresa?: true
    region?: true
    comuna?: true
    unidadNegocio?: true
    productoId?: true
    cantidadEstimada?: true
    urgencia?: true
    tipoUso?: true
    necesidadSoporteTecnico?: true
    alternativaProducto?: true
    comision?: true
    margenEstimado?: true
    fechaComprometidaEnvio?: true
    versionCotizacion?: true
    comentariosCliente?: true
    objeciones?: true
    ordenCompra?: true
    correoAceptacion?: true
    condicionesComerciales?: true
    coordinacionAdministrativa?: true
    estadoDocumentacion?: true
    traspasoAdministracion?: true
    traspasoERP?: true
    coordinacionDespacho?: true
    estadoComercialOrden?: true
    estadoDocumentacionVenta?: true
    responsable?: true
    etapa?: true
    montoEstimado?: true
    probabilidadCierre?: true
    proximaAccion?: true
    fechaProximaAccion?: true
    observaciones?: true
    origen?: true
    estadoStock?: true
    cotizacionId?: true
    motivoPerdida?: true
    motivoPostergacion?: true
    fechaReactivacion?: true
    documentoRespaldo?: true
    fechaCierre?: true
    createdAt?: true
    updatedAt?: true
    probabilidad?: true
    flujoPosterior?: true
    motivoDescarte?: true
    tipoBroker?: true
    fechaEstimadaDespacho?: true
    fechaSeguimientoPostventa?: true
    nombreOportunidad?: true
    cargoContacto?: true
    direccionProyecto?: true
    tipoOportunidad?: true
    fechaProbableCierre?: true
    riesgoTecnico?: true
    comentariosInternos?: true
    observacionesTecnicas?: true
    observacionCamposFaltantes?: true
    lineaProducto?: true
    descuento?: true
    stockOportunidad?: true
    reprogramacionesCount?: true
    fechaUltimoCambioEtapa?: true
    esReactivacion?: true
  }

  export type FunnelTragerOpportunityCountAggregateInputType = {
    id?: true
    cliente?: true
    contacto?: true
    telefono?: true
    correo?: true
    tipoCliente?: true
    rutEmpresa?: true
    region?: true
    comuna?: true
    unidadNegocio?: true
    productoId?: true
    cantidadEstimada?: true
    urgencia?: true
    tipoUso?: true
    necesidadSoporteTecnico?: true
    alternativaProducto?: true
    comision?: true
    margenEstimado?: true
    fechaComprometidaEnvio?: true
    versionCotizacion?: true
    comentariosCliente?: true
    objeciones?: true
    ordenCompra?: true
    correoAceptacion?: true
    condicionesComerciales?: true
    coordinacionAdministrativa?: true
    estadoDocumentacion?: true
    traspasoAdministracion?: true
    traspasoERP?: true
    coordinacionDespacho?: true
    estadoComercialOrden?: true
    estadoDocumentacionVenta?: true
    responsable?: true
    etapa?: true
    montoEstimado?: true
    probabilidadCierre?: true
    proximaAccion?: true
    fechaProximaAccion?: true
    observaciones?: true
    origen?: true
    estadoStock?: true
    cotizacionId?: true
    motivoPerdida?: true
    motivoPostergacion?: true
    fechaReactivacion?: true
    documentoRespaldo?: true
    fechaCierre?: true
    createdAt?: true
    updatedAt?: true
    probabilidad?: true
    flujoPosterior?: true
    motivoDescarte?: true
    tipoBroker?: true
    fechaEstimadaDespacho?: true
    fechaSeguimientoPostventa?: true
    nombreOportunidad?: true
    cargoContacto?: true
    direccionProyecto?: true
    tipoOportunidad?: true
    fechaProbableCierre?: true
    riesgoTecnico?: true
    comentariosInternos?: true
    observacionesTecnicas?: true
    observacionCamposFaltantes?: true
    lineaProducto?: true
    descuento?: true
    stockOportunidad?: true
    reprogramacionesCount?: true
    fechaUltimoCambioEtapa?: true
    esReactivacion?: true
    _all?: true
  }

  export type FunnelTragerOpportunityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FunnelTragerOpportunity to aggregate.
     */
    where?: FunnelTragerOpportunityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FunnelTragerOpportunities to fetch.
     */
    orderBy?: FunnelTragerOpportunityOrderByWithRelationInput | FunnelTragerOpportunityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FunnelTragerOpportunityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FunnelTragerOpportunities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FunnelTragerOpportunities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FunnelTragerOpportunities
    **/
    _count?: true | FunnelTragerOpportunityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FunnelTragerOpportunityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FunnelTragerOpportunitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FunnelTragerOpportunityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FunnelTragerOpportunityMaxAggregateInputType
  }

  export type GetFunnelTragerOpportunityAggregateType<T extends FunnelTragerOpportunityAggregateArgs> = {
        [P in keyof T & keyof AggregateFunnelTragerOpportunity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFunnelTragerOpportunity[P]>
      : GetScalarType<T[P], AggregateFunnelTragerOpportunity[P]>
  }




  export type FunnelTragerOpportunityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FunnelTragerOpportunityWhereInput
    orderBy?: FunnelTragerOpportunityOrderByWithAggregationInput | FunnelTragerOpportunityOrderByWithAggregationInput[]
    by: FunnelTragerOpportunityScalarFieldEnum[] | FunnelTragerOpportunityScalarFieldEnum
    having?: FunnelTragerOpportunityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FunnelTragerOpportunityCountAggregateInputType | true
    _avg?: FunnelTragerOpportunityAvgAggregateInputType
    _sum?: FunnelTragerOpportunitySumAggregateInputType
    _min?: FunnelTragerOpportunityMinAggregateInputType
    _max?: FunnelTragerOpportunityMaxAggregateInputType
  }

  export type FunnelTragerOpportunityGroupByOutputType = {
    id: number
    cliente: string
    contacto: string | null
    telefono: string | null
    correo: string | null
    tipoCliente: string | null
    rutEmpresa: string | null
    region: string | null
    comuna: string | null
    unidadNegocio: string | null
    productoId: number | null
    cantidadEstimada: number | null
    urgencia: string | null
    tipoUso: string | null
    necesidadSoporteTecnico: boolean | null
    alternativaProducto: string | null
    comision: number | null
    margenEstimado: number | null
    fechaComprometidaEnvio: Date | null
    versionCotizacion: string | null
    comentariosCliente: string | null
    objeciones: string | null
    ordenCompra: string | null
    correoAceptacion: string | null
    condicionesComerciales: string | null
    coordinacionAdministrativa: string | null
    estadoDocumentacion: string | null
    traspasoAdministracion: boolean | null
    traspasoERP: boolean | null
    coordinacionDespacho: string | null
    estadoComercialOrden: string | null
    estadoDocumentacionVenta: string | null
    responsable: string | null
    etapa: string
    montoEstimado: number
    probabilidadCierre: number | null
    proximaAccion: string | null
    fechaProximaAccion: Date | null
    observaciones: string | null
    origen: string | null
    estadoStock: string | null
    cotizacionId: number | null
    motivoPerdida: string | null
    motivoPostergacion: string | null
    fechaReactivacion: Date | null
    documentoRespaldo: string | null
    fechaCierre: Date | null
    createdAt: Date
    updatedAt: Date
    probabilidad: number | null
    flujoPosterior: string | null
    motivoDescarte: string | null
    tipoBroker: string | null
    fechaEstimadaDespacho: Date | null
    fechaSeguimientoPostventa: Date | null
    nombreOportunidad: string | null
    cargoContacto: string | null
    direccionProyecto: string | null
    tipoOportunidad: string | null
    fechaProbableCierre: Date | null
    riesgoTecnico: string | null
    comentariosInternos: string | null
    observacionesTecnicas: string | null
    observacionCamposFaltantes: string | null
    lineaProducto: string | null
    descuento: number | null
    stockOportunidad: string | null
    reprogramacionesCount: number
    fechaUltimoCambioEtapa: Date | null
    esReactivacion: boolean
    _count: FunnelTragerOpportunityCountAggregateOutputType | null
    _avg: FunnelTragerOpportunityAvgAggregateOutputType | null
    _sum: FunnelTragerOpportunitySumAggregateOutputType | null
    _min: FunnelTragerOpportunityMinAggregateOutputType | null
    _max: FunnelTragerOpportunityMaxAggregateOutputType | null
  }

  type GetFunnelTragerOpportunityGroupByPayload<T extends FunnelTragerOpportunityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FunnelTragerOpportunityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FunnelTragerOpportunityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FunnelTragerOpportunityGroupByOutputType[P]>
            : GetScalarType<T[P], FunnelTragerOpportunityGroupByOutputType[P]>
        }
      >
    >


  export type FunnelTragerOpportunitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cliente?: boolean
    contacto?: boolean
    telefono?: boolean
    correo?: boolean
    tipoCliente?: boolean
    rutEmpresa?: boolean
    region?: boolean
    comuna?: boolean
    unidadNegocio?: boolean
    productoId?: boolean
    cantidadEstimada?: boolean
    urgencia?: boolean
    tipoUso?: boolean
    necesidadSoporteTecnico?: boolean
    alternativaProducto?: boolean
    comision?: boolean
    margenEstimado?: boolean
    fechaComprometidaEnvio?: boolean
    versionCotizacion?: boolean
    comentariosCliente?: boolean
    objeciones?: boolean
    ordenCompra?: boolean
    correoAceptacion?: boolean
    condicionesComerciales?: boolean
    coordinacionAdministrativa?: boolean
    estadoDocumentacion?: boolean
    traspasoAdministracion?: boolean
    traspasoERP?: boolean
    coordinacionDespacho?: boolean
    estadoComercialOrden?: boolean
    estadoDocumentacionVenta?: boolean
    responsable?: boolean
    etapa?: boolean
    montoEstimado?: boolean
    probabilidadCierre?: boolean
    proximaAccion?: boolean
    fechaProximaAccion?: boolean
    observaciones?: boolean
    origen?: boolean
    estadoStock?: boolean
    cotizacionId?: boolean
    motivoPerdida?: boolean
    motivoPostergacion?: boolean
    fechaReactivacion?: boolean
    documentoRespaldo?: boolean
    fechaCierre?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    probabilidad?: boolean
    flujoPosterior?: boolean
    motivoDescarte?: boolean
    tipoBroker?: boolean
    fechaEstimadaDespacho?: boolean
    fechaSeguimientoPostventa?: boolean
    nombreOportunidad?: boolean
    cargoContacto?: boolean
    direccionProyecto?: boolean
    tipoOportunidad?: boolean
    fechaProbableCierre?: boolean
    riesgoTecnico?: boolean
    comentariosInternos?: boolean
    observacionesTecnicas?: boolean
    observacionCamposFaltantes?: boolean
    lineaProducto?: boolean
    descuento?: boolean
    stockOportunidad?: boolean
    reprogramacionesCount?: boolean
    fechaUltimoCambioEtapa?: boolean
    esReactivacion?: boolean
    archivos?: boolean | FunnelTragerOpportunity$archivosArgs<ExtArgs>
    historialEtapas?: boolean | FunnelTragerOpportunity$historialEtapasArgs<ExtArgs>
    _count?: boolean | FunnelTragerOpportunityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["funnelTragerOpportunity"]>

  export type FunnelTragerOpportunitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cliente?: boolean
    contacto?: boolean
    telefono?: boolean
    correo?: boolean
    tipoCliente?: boolean
    rutEmpresa?: boolean
    region?: boolean
    comuna?: boolean
    unidadNegocio?: boolean
    productoId?: boolean
    cantidadEstimada?: boolean
    urgencia?: boolean
    tipoUso?: boolean
    necesidadSoporteTecnico?: boolean
    alternativaProducto?: boolean
    comision?: boolean
    margenEstimado?: boolean
    fechaComprometidaEnvio?: boolean
    versionCotizacion?: boolean
    comentariosCliente?: boolean
    objeciones?: boolean
    ordenCompra?: boolean
    correoAceptacion?: boolean
    condicionesComerciales?: boolean
    coordinacionAdministrativa?: boolean
    estadoDocumentacion?: boolean
    traspasoAdministracion?: boolean
    traspasoERP?: boolean
    coordinacionDespacho?: boolean
    estadoComercialOrden?: boolean
    estadoDocumentacionVenta?: boolean
    responsable?: boolean
    etapa?: boolean
    montoEstimado?: boolean
    probabilidadCierre?: boolean
    proximaAccion?: boolean
    fechaProximaAccion?: boolean
    observaciones?: boolean
    origen?: boolean
    estadoStock?: boolean
    cotizacionId?: boolean
    motivoPerdida?: boolean
    motivoPostergacion?: boolean
    fechaReactivacion?: boolean
    documentoRespaldo?: boolean
    fechaCierre?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    probabilidad?: boolean
    flujoPosterior?: boolean
    motivoDescarte?: boolean
    tipoBroker?: boolean
    fechaEstimadaDespacho?: boolean
    fechaSeguimientoPostventa?: boolean
    nombreOportunidad?: boolean
    cargoContacto?: boolean
    direccionProyecto?: boolean
    tipoOportunidad?: boolean
    fechaProbableCierre?: boolean
    riesgoTecnico?: boolean
    comentariosInternos?: boolean
    observacionesTecnicas?: boolean
    observacionCamposFaltantes?: boolean
    lineaProducto?: boolean
    descuento?: boolean
    stockOportunidad?: boolean
    reprogramacionesCount?: boolean
    fechaUltimoCambioEtapa?: boolean
    esReactivacion?: boolean
  }, ExtArgs["result"]["funnelTragerOpportunity"]>

  export type FunnelTragerOpportunitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cliente?: boolean
    contacto?: boolean
    telefono?: boolean
    correo?: boolean
    tipoCliente?: boolean
    rutEmpresa?: boolean
    region?: boolean
    comuna?: boolean
    unidadNegocio?: boolean
    productoId?: boolean
    cantidadEstimada?: boolean
    urgencia?: boolean
    tipoUso?: boolean
    necesidadSoporteTecnico?: boolean
    alternativaProducto?: boolean
    comision?: boolean
    margenEstimado?: boolean
    fechaComprometidaEnvio?: boolean
    versionCotizacion?: boolean
    comentariosCliente?: boolean
    objeciones?: boolean
    ordenCompra?: boolean
    correoAceptacion?: boolean
    condicionesComerciales?: boolean
    coordinacionAdministrativa?: boolean
    estadoDocumentacion?: boolean
    traspasoAdministracion?: boolean
    traspasoERP?: boolean
    coordinacionDespacho?: boolean
    estadoComercialOrden?: boolean
    estadoDocumentacionVenta?: boolean
    responsable?: boolean
    etapa?: boolean
    montoEstimado?: boolean
    probabilidadCierre?: boolean
    proximaAccion?: boolean
    fechaProximaAccion?: boolean
    observaciones?: boolean
    origen?: boolean
    estadoStock?: boolean
    cotizacionId?: boolean
    motivoPerdida?: boolean
    motivoPostergacion?: boolean
    fechaReactivacion?: boolean
    documentoRespaldo?: boolean
    fechaCierre?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    probabilidad?: boolean
    flujoPosterior?: boolean
    motivoDescarte?: boolean
    tipoBroker?: boolean
    fechaEstimadaDespacho?: boolean
    fechaSeguimientoPostventa?: boolean
    nombreOportunidad?: boolean
    cargoContacto?: boolean
    direccionProyecto?: boolean
    tipoOportunidad?: boolean
    fechaProbableCierre?: boolean
    riesgoTecnico?: boolean
    comentariosInternos?: boolean
    observacionesTecnicas?: boolean
    observacionCamposFaltantes?: boolean
    lineaProducto?: boolean
    descuento?: boolean
    stockOportunidad?: boolean
    reprogramacionesCount?: boolean
    fechaUltimoCambioEtapa?: boolean
    esReactivacion?: boolean
  }, ExtArgs["result"]["funnelTragerOpportunity"]>

  export type FunnelTragerOpportunitySelectScalar = {
    id?: boolean
    cliente?: boolean
    contacto?: boolean
    telefono?: boolean
    correo?: boolean
    tipoCliente?: boolean
    rutEmpresa?: boolean
    region?: boolean
    comuna?: boolean
    unidadNegocio?: boolean
    productoId?: boolean
    cantidadEstimada?: boolean
    urgencia?: boolean
    tipoUso?: boolean
    necesidadSoporteTecnico?: boolean
    alternativaProducto?: boolean
    comision?: boolean
    margenEstimado?: boolean
    fechaComprometidaEnvio?: boolean
    versionCotizacion?: boolean
    comentariosCliente?: boolean
    objeciones?: boolean
    ordenCompra?: boolean
    correoAceptacion?: boolean
    condicionesComerciales?: boolean
    coordinacionAdministrativa?: boolean
    estadoDocumentacion?: boolean
    traspasoAdministracion?: boolean
    traspasoERP?: boolean
    coordinacionDespacho?: boolean
    estadoComercialOrden?: boolean
    estadoDocumentacionVenta?: boolean
    responsable?: boolean
    etapa?: boolean
    montoEstimado?: boolean
    probabilidadCierre?: boolean
    proximaAccion?: boolean
    fechaProximaAccion?: boolean
    observaciones?: boolean
    origen?: boolean
    estadoStock?: boolean
    cotizacionId?: boolean
    motivoPerdida?: boolean
    motivoPostergacion?: boolean
    fechaReactivacion?: boolean
    documentoRespaldo?: boolean
    fechaCierre?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    probabilidad?: boolean
    flujoPosterior?: boolean
    motivoDescarte?: boolean
    tipoBroker?: boolean
    fechaEstimadaDespacho?: boolean
    fechaSeguimientoPostventa?: boolean
    nombreOportunidad?: boolean
    cargoContacto?: boolean
    direccionProyecto?: boolean
    tipoOportunidad?: boolean
    fechaProbableCierre?: boolean
    riesgoTecnico?: boolean
    comentariosInternos?: boolean
    observacionesTecnicas?: boolean
    observacionCamposFaltantes?: boolean
    lineaProducto?: boolean
    descuento?: boolean
    stockOportunidad?: boolean
    reprogramacionesCount?: boolean
    fechaUltimoCambioEtapa?: boolean
    esReactivacion?: boolean
  }

  export type FunnelTragerOpportunityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cliente" | "contacto" | "telefono" | "correo" | "tipoCliente" | "rutEmpresa" | "region" | "comuna" | "unidadNegocio" | "productoId" | "cantidadEstimada" | "urgencia" | "tipoUso" | "necesidadSoporteTecnico" | "alternativaProducto" | "comision" | "margenEstimado" | "fechaComprometidaEnvio" | "versionCotizacion" | "comentariosCliente" | "objeciones" | "ordenCompra" | "correoAceptacion" | "condicionesComerciales" | "coordinacionAdministrativa" | "estadoDocumentacion" | "traspasoAdministracion" | "traspasoERP" | "coordinacionDespacho" | "estadoComercialOrden" | "estadoDocumentacionVenta" | "responsable" | "etapa" | "montoEstimado" | "probabilidadCierre" | "proximaAccion" | "fechaProximaAccion" | "observaciones" | "origen" | "estadoStock" | "cotizacionId" | "motivoPerdida" | "motivoPostergacion" | "fechaReactivacion" | "documentoRespaldo" | "fechaCierre" | "createdAt" | "updatedAt" | "probabilidad" | "flujoPosterior" | "motivoDescarte" | "tipoBroker" | "fechaEstimadaDespacho" | "fechaSeguimientoPostventa" | "nombreOportunidad" | "cargoContacto" | "direccionProyecto" | "tipoOportunidad" | "fechaProbableCierre" | "riesgoTecnico" | "comentariosInternos" | "observacionesTecnicas" | "observacionCamposFaltantes" | "lineaProducto" | "descuento" | "stockOportunidad" | "reprogramacionesCount" | "fechaUltimoCambioEtapa" | "esReactivacion", ExtArgs["result"]["funnelTragerOpportunity"]>
  export type FunnelTragerOpportunityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    archivos?: boolean | FunnelTragerOpportunity$archivosArgs<ExtArgs>
    historialEtapas?: boolean | FunnelTragerOpportunity$historialEtapasArgs<ExtArgs>
    _count?: boolean | FunnelTragerOpportunityCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FunnelTragerOpportunityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type FunnelTragerOpportunityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FunnelTragerOpportunityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FunnelTragerOpportunity"
    objects: {
      archivos: Prisma.$FunnelTragerArchivoPayload<ExtArgs>[]
      historialEtapas: Prisma.$HistorialEtapaTragerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cliente: string
      contacto: string | null
      telefono: string | null
      correo: string | null
      tipoCliente: string | null
      rutEmpresa: string | null
      region: string | null
      comuna: string | null
      unidadNegocio: string | null
      productoId: number | null
      cantidadEstimada: number | null
      urgencia: string | null
      tipoUso: string | null
      necesidadSoporteTecnico: boolean | null
      alternativaProducto: string | null
      comision: number | null
      margenEstimado: number | null
      fechaComprometidaEnvio: Date | null
      versionCotizacion: string | null
      comentariosCliente: string | null
      objeciones: string | null
      ordenCompra: string | null
      correoAceptacion: string | null
      condicionesComerciales: string | null
      coordinacionAdministrativa: string | null
      estadoDocumentacion: string | null
      traspasoAdministracion: boolean | null
      traspasoERP: boolean | null
      coordinacionDespacho: string | null
      estadoComercialOrden: string | null
      estadoDocumentacionVenta: string | null
      responsable: string | null
      etapa: string
      montoEstimado: number
      probabilidadCierre: number | null
      proximaAccion: string | null
      fechaProximaAccion: Date | null
      observaciones: string | null
      origen: string | null
      estadoStock: string | null
      cotizacionId: number | null
      motivoPerdida: string | null
      motivoPostergacion: string | null
      fechaReactivacion: Date | null
      documentoRespaldo: string | null
      fechaCierre: Date | null
      createdAt: Date
      updatedAt: Date
      probabilidad: number | null
      flujoPosterior: string | null
      motivoDescarte: string | null
      tipoBroker: string | null
      fechaEstimadaDespacho: Date | null
      fechaSeguimientoPostventa: Date | null
      nombreOportunidad: string | null
      cargoContacto: string | null
      direccionProyecto: string | null
      tipoOportunidad: string | null
      fechaProbableCierre: Date | null
      riesgoTecnico: string | null
      comentariosInternos: string | null
      observacionesTecnicas: string | null
      observacionCamposFaltantes: string | null
      lineaProducto: string | null
      descuento: number | null
      stockOportunidad: string | null
      reprogramacionesCount: number
      fechaUltimoCambioEtapa: Date | null
      esReactivacion: boolean
    }, ExtArgs["result"]["funnelTragerOpportunity"]>
    composites: {}
  }

  type FunnelTragerOpportunityGetPayload<S extends boolean | null | undefined | FunnelTragerOpportunityDefaultArgs> = $Result.GetResult<Prisma.$FunnelTragerOpportunityPayload, S>

  type FunnelTragerOpportunityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FunnelTragerOpportunityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FunnelTragerOpportunityCountAggregateInputType | true
    }

  export interface FunnelTragerOpportunityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FunnelTragerOpportunity'], meta: { name: 'FunnelTragerOpportunity' } }
    /**
     * Find zero or one FunnelTragerOpportunity that matches the filter.
     * @param {FunnelTragerOpportunityFindUniqueArgs} args - Arguments to find a FunnelTragerOpportunity
     * @example
     * // Get one FunnelTragerOpportunity
     * const funnelTragerOpportunity = await prisma.funnelTragerOpportunity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FunnelTragerOpportunityFindUniqueArgs>(args: SelectSubset<T, FunnelTragerOpportunityFindUniqueArgs<ExtArgs>>): Prisma__FunnelTragerOpportunityClient<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FunnelTragerOpportunity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FunnelTragerOpportunityFindUniqueOrThrowArgs} args - Arguments to find a FunnelTragerOpportunity
     * @example
     * // Get one FunnelTragerOpportunity
     * const funnelTragerOpportunity = await prisma.funnelTragerOpportunity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FunnelTragerOpportunityFindUniqueOrThrowArgs>(args: SelectSubset<T, FunnelTragerOpportunityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FunnelTragerOpportunityClient<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FunnelTragerOpportunity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerOpportunityFindFirstArgs} args - Arguments to find a FunnelTragerOpportunity
     * @example
     * // Get one FunnelTragerOpportunity
     * const funnelTragerOpportunity = await prisma.funnelTragerOpportunity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FunnelTragerOpportunityFindFirstArgs>(args?: SelectSubset<T, FunnelTragerOpportunityFindFirstArgs<ExtArgs>>): Prisma__FunnelTragerOpportunityClient<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FunnelTragerOpportunity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerOpportunityFindFirstOrThrowArgs} args - Arguments to find a FunnelTragerOpportunity
     * @example
     * // Get one FunnelTragerOpportunity
     * const funnelTragerOpportunity = await prisma.funnelTragerOpportunity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FunnelTragerOpportunityFindFirstOrThrowArgs>(args?: SelectSubset<T, FunnelTragerOpportunityFindFirstOrThrowArgs<ExtArgs>>): Prisma__FunnelTragerOpportunityClient<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FunnelTragerOpportunities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerOpportunityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FunnelTragerOpportunities
     * const funnelTragerOpportunities = await prisma.funnelTragerOpportunity.findMany()
     * 
     * // Get first 10 FunnelTragerOpportunities
     * const funnelTragerOpportunities = await prisma.funnelTragerOpportunity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const funnelTragerOpportunityWithIdOnly = await prisma.funnelTragerOpportunity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FunnelTragerOpportunityFindManyArgs>(args?: SelectSubset<T, FunnelTragerOpportunityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FunnelTragerOpportunity.
     * @param {FunnelTragerOpportunityCreateArgs} args - Arguments to create a FunnelTragerOpportunity.
     * @example
     * // Create one FunnelTragerOpportunity
     * const FunnelTragerOpportunity = await prisma.funnelTragerOpportunity.create({
     *   data: {
     *     // ... data to create a FunnelTragerOpportunity
     *   }
     * })
     * 
     */
    create<T extends FunnelTragerOpportunityCreateArgs>(args: SelectSubset<T, FunnelTragerOpportunityCreateArgs<ExtArgs>>): Prisma__FunnelTragerOpportunityClient<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FunnelTragerOpportunities.
     * @param {FunnelTragerOpportunityCreateManyArgs} args - Arguments to create many FunnelTragerOpportunities.
     * @example
     * // Create many FunnelTragerOpportunities
     * const funnelTragerOpportunity = await prisma.funnelTragerOpportunity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FunnelTragerOpportunityCreateManyArgs>(args?: SelectSubset<T, FunnelTragerOpportunityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FunnelTragerOpportunities and returns the data saved in the database.
     * @param {FunnelTragerOpportunityCreateManyAndReturnArgs} args - Arguments to create many FunnelTragerOpportunities.
     * @example
     * // Create many FunnelTragerOpportunities
     * const funnelTragerOpportunity = await prisma.funnelTragerOpportunity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FunnelTragerOpportunities and only return the `id`
     * const funnelTragerOpportunityWithIdOnly = await prisma.funnelTragerOpportunity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FunnelTragerOpportunityCreateManyAndReturnArgs>(args?: SelectSubset<T, FunnelTragerOpportunityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FunnelTragerOpportunity.
     * @param {FunnelTragerOpportunityDeleteArgs} args - Arguments to delete one FunnelTragerOpportunity.
     * @example
     * // Delete one FunnelTragerOpportunity
     * const FunnelTragerOpportunity = await prisma.funnelTragerOpportunity.delete({
     *   where: {
     *     // ... filter to delete one FunnelTragerOpportunity
     *   }
     * })
     * 
     */
    delete<T extends FunnelTragerOpportunityDeleteArgs>(args: SelectSubset<T, FunnelTragerOpportunityDeleteArgs<ExtArgs>>): Prisma__FunnelTragerOpportunityClient<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FunnelTragerOpportunity.
     * @param {FunnelTragerOpportunityUpdateArgs} args - Arguments to update one FunnelTragerOpportunity.
     * @example
     * // Update one FunnelTragerOpportunity
     * const funnelTragerOpportunity = await prisma.funnelTragerOpportunity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FunnelTragerOpportunityUpdateArgs>(args: SelectSubset<T, FunnelTragerOpportunityUpdateArgs<ExtArgs>>): Prisma__FunnelTragerOpportunityClient<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FunnelTragerOpportunities.
     * @param {FunnelTragerOpportunityDeleteManyArgs} args - Arguments to filter FunnelTragerOpportunities to delete.
     * @example
     * // Delete a few FunnelTragerOpportunities
     * const { count } = await prisma.funnelTragerOpportunity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FunnelTragerOpportunityDeleteManyArgs>(args?: SelectSubset<T, FunnelTragerOpportunityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FunnelTragerOpportunities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerOpportunityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FunnelTragerOpportunities
     * const funnelTragerOpportunity = await prisma.funnelTragerOpportunity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FunnelTragerOpportunityUpdateManyArgs>(args: SelectSubset<T, FunnelTragerOpportunityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FunnelTragerOpportunities and returns the data updated in the database.
     * @param {FunnelTragerOpportunityUpdateManyAndReturnArgs} args - Arguments to update many FunnelTragerOpportunities.
     * @example
     * // Update many FunnelTragerOpportunities
     * const funnelTragerOpportunity = await prisma.funnelTragerOpportunity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FunnelTragerOpportunities and only return the `id`
     * const funnelTragerOpportunityWithIdOnly = await prisma.funnelTragerOpportunity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FunnelTragerOpportunityUpdateManyAndReturnArgs>(args: SelectSubset<T, FunnelTragerOpportunityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FunnelTragerOpportunity.
     * @param {FunnelTragerOpportunityUpsertArgs} args - Arguments to update or create a FunnelTragerOpportunity.
     * @example
     * // Update or create a FunnelTragerOpportunity
     * const funnelTragerOpportunity = await prisma.funnelTragerOpportunity.upsert({
     *   create: {
     *     // ... data to create a FunnelTragerOpportunity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FunnelTragerOpportunity we want to update
     *   }
     * })
     */
    upsert<T extends FunnelTragerOpportunityUpsertArgs>(args: SelectSubset<T, FunnelTragerOpportunityUpsertArgs<ExtArgs>>): Prisma__FunnelTragerOpportunityClient<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FunnelTragerOpportunities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerOpportunityCountArgs} args - Arguments to filter FunnelTragerOpportunities to count.
     * @example
     * // Count the number of FunnelTragerOpportunities
     * const count = await prisma.funnelTragerOpportunity.count({
     *   where: {
     *     // ... the filter for the FunnelTragerOpportunities we want to count
     *   }
     * })
    **/
    count<T extends FunnelTragerOpportunityCountArgs>(
      args?: Subset<T, FunnelTragerOpportunityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FunnelTragerOpportunityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FunnelTragerOpportunity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerOpportunityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FunnelTragerOpportunityAggregateArgs>(args: Subset<T, FunnelTragerOpportunityAggregateArgs>): Prisma.PrismaPromise<GetFunnelTragerOpportunityAggregateType<T>>

    /**
     * Group by FunnelTragerOpportunity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerOpportunityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FunnelTragerOpportunityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FunnelTragerOpportunityGroupByArgs['orderBy'] }
        : { orderBy?: FunnelTragerOpportunityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FunnelTragerOpportunityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFunnelTragerOpportunityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FunnelTragerOpportunity model
   */
  readonly fields: FunnelTragerOpportunityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FunnelTragerOpportunity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FunnelTragerOpportunityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    archivos<T extends FunnelTragerOpportunity$archivosArgs<ExtArgs> = {}>(args?: Subset<T, FunnelTragerOpportunity$archivosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    historialEtapas<T extends FunnelTragerOpportunity$historialEtapasArgs<ExtArgs> = {}>(args?: Subset<T, FunnelTragerOpportunity$historialEtapasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FunnelTragerOpportunity model
   */
  interface FunnelTragerOpportunityFieldRefs {
    readonly id: FieldRef<"FunnelTragerOpportunity", 'Int'>
    readonly cliente: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly contacto: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly telefono: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly correo: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly tipoCliente: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly rutEmpresa: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly region: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly comuna: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly unidadNegocio: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly productoId: FieldRef<"FunnelTragerOpportunity", 'Int'>
    readonly cantidadEstimada: FieldRef<"FunnelTragerOpportunity", 'Int'>
    readonly urgencia: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly tipoUso: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly necesidadSoporteTecnico: FieldRef<"FunnelTragerOpportunity", 'Boolean'>
    readonly alternativaProducto: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly comision: FieldRef<"FunnelTragerOpportunity", 'Float'>
    readonly margenEstimado: FieldRef<"FunnelTragerOpportunity", 'Float'>
    readonly fechaComprometidaEnvio: FieldRef<"FunnelTragerOpportunity", 'DateTime'>
    readonly versionCotizacion: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly comentariosCliente: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly objeciones: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly ordenCompra: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly correoAceptacion: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly condicionesComerciales: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly coordinacionAdministrativa: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly estadoDocumentacion: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly traspasoAdministracion: FieldRef<"FunnelTragerOpportunity", 'Boolean'>
    readonly traspasoERP: FieldRef<"FunnelTragerOpportunity", 'Boolean'>
    readonly coordinacionDespacho: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly estadoComercialOrden: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly estadoDocumentacionVenta: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly responsable: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly etapa: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly montoEstimado: FieldRef<"FunnelTragerOpportunity", 'Float'>
    readonly probabilidadCierre: FieldRef<"FunnelTragerOpportunity", 'Int'>
    readonly proximaAccion: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly fechaProximaAccion: FieldRef<"FunnelTragerOpportunity", 'DateTime'>
    readonly observaciones: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly origen: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly estadoStock: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly cotizacionId: FieldRef<"FunnelTragerOpportunity", 'Int'>
    readonly motivoPerdida: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly motivoPostergacion: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly fechaReactivacion: FieldRef<"FunnelTragerOpportunity", 'DateTime'>
    readonly documentoRespaldo: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly fechaCierre: FieldRef<"FunnelTragerOpportunity", 'DateTime'>
    readonly createdAt: FieldRef<"FunnelTragerOpportunity", 'DateTime'>
    readonly updatedAt: FieldRef<"FunnelTragerOpportunity", 'DateTime'>
    readonly probabilidad: FieldRef<"FunnelTragerOpportunity", 'Int'>
    readonly flujoPosterior: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly motivoDescarte: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly tipoBroker: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly fechaEstimadaDespacho: FieldRef<"FunnelTragerOpportunity", 'DateTime'>
    readonly fechaSeguimientoPostventa: FieldRef<"FunnelTragerOpportunity", 'DateTime'>
    readonly nombreOportunidad: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly cargoContacto: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly direccionProyecto: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly tipoOportunidad: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly fechaProbableCierre: FieldRef<"FunnelTragerOpportunity", 'DateTime'>
    readonly riesgoTecnico: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly comentariosInternos: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly observacionesTecnicas: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly observacionCamposFaltantes: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly lineaProducto: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly descuento: FieldRef<"FunnelTragerOpportunity", 'Float'>
    readonly stockOportunidad: FieldRef<"FunnelTragerOpportunity", 'String'>
    readonly reprogramacionesCount: FieldRef<"FunnelTragerOpportunity", 'Int'>
    readonly fechaUltimoCambioEtapa: FieldRef<"FunnelTragerOpportunity", 'DateTime'>
    readonly esReactivacion: FieldRef<"FunnelTragerOpportunity", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * FunnelTragerOpportunity findUnique
   */
  export type FunnelTragerOpportunityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerOpportunityInclude<ExtArgs> | null
    /**
     * Filter, which FunnelTragerOpportunity to fetch.
     */
    where: FunnelTragerOpportunityWhereUniqueInput
  }

  /**
   * FunnelTragerOpportunity findUniqueOrThrow
   */
  export type FunnelTragerOpportunityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerOpportunityInclude<ExtArgs> | null
    /**
     * Filter, which FunnelTragerOpportunity to fetch.
     */
    where: FunnelTragerOpportunityWhereUniqueInput
  }

  /**
   * FunnelTragerOpportunity findFirst
   */
  export type FunnelTragerOpportunityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerOpportunityInclude<ExtArgs> | null
    /**
     * Filter, which FunnelTragerOpportunity to fetch.
     */
    where?: FunnelTragerOpportunityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FunnelTragerOpportunities to fetch.
     */
    orderBy?: FunnelTragerOpportunityOrderByWithRelationInput | FunnelTragerOpportunityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FunnelTragerOpportunities.
     */
    cursor?: FunnelTragerOpportunityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FunnelTragerOpportunities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FunnelTragerOpportunities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FunnelTragerOpportunities.
     */
    distinct?: FunnelTragerOpportunityScalarFieldEnum | FunnelTragerOpportunityScalarFieldEnum[]
  }

  /**
   * FunnelTragerOpportunity findFirstOrThrow
   */
  export type FunnelTragerOpportunityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerOpportunityInclude<ExtArgs> | null
    /**
     * Filter, which FunnelTragerOpportunity to fetch.
     */
    where?: FunnelTragerOpportunityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FunnelTragerOpportunities to fetch.
     */
    orderBy?: FunnelTragerOpportunityOrderByWithRelationInput | FunnelTragerOpportunityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FunnelTragerOpportunities.
     */
    cursor?: FunnelTragerOpportunityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FunnelTragerOpportunities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FunnelTragerOpportunities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FunnelTragerOpportunities.
     */
    distinct?: FunnelTragerOpportunityScalarFieldEnum | FunnelTragerOpportunityScalarFieldEnum[]
  }

  /**
   * FunnelTragerOpportunity findMany
   */
  export type FunnelTragerOpportunityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerOpportunityInclude<ExtArgs> | null
    /**
     * Filter, which FunnelTragerOpportunities to fetch.
     */
    where?: FunnelTragerOpportunityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FunnelTragerOpportunities to fetch.
     */
    orderBy?: FunnelTragerOpportunityOrderByWithRelationInput | FunnelTragerOpportunityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FunnelTragerOpportunities.
     */
    cursor?: FunnelTragerOpportunityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FunnelTragerOpportunities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FunnelTragerOpportunities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FunnelTragerOpportunities.
     */
    distinct?: FunnelTragerOpportunityScalarFieldEnum | FunnelTragerOpportunityScalarFieldEnum[]
  }

  /**
   * FunnelTragerOpportunity create
   */
  export type FunnelTragerOpportunityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerOpportunityInclude<ExtArgs> | null
    /**
     * The data needed to create a FunnelTragerOpportunity.
     */
    data: XOR<FunnelTragerOpportunityCreateInput, FunnelTragerOpportunityUncheckedCreateInput>
  }

  /**
   * FunnelTragerOpportunity createMany
   */
  export type FunnelTragerOpportunityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FunnelTragerOpportunities.
     */
    data: FunnelTragerOpportunityCreateManyInput | FunnelTragerOpportunityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FunnelTragerOpportunity createManyAndReturn
   */
  export type FunnelTragerOpportunityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * The data used to create many FunnelTragerOpportunities.
     */
    data: FunnelTragerOpportunityCreateManyInput | FunnelTragerOpportunityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FunnelTragerOpportunity update
   */
  export type FunnelTragerOpportunityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerOpportunityInclude<ExtArgs> | null
    /**
     * The data needed to update a FunnelTragerOpportunity.
     */
    data: XOR<FunnelTragerOpportunityUpdateInput, FunnelTragerOpportunityUncheckedUpdateInput>
    /**
     * Choose, which FunnelTragerOpportunity to update.
     */
    where: FunnelTragerOpportunityWhereUniqueInput
  }

  /**
   * FunnelTragerOpportunity updateMany
   */
  export type FunnelTragerOpportunityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FunnelTragerOpportunities.
     */
    data: XOR<FunnelTragerOpportunityUpdateManyMutationInput, FunnelTragerOpportunityUncheckedUpdateManyInput>
    /**
     * Filter which FunnelTragerOpportunities to update
     */
    where?: FunnelTragerOpportunityWhereInput
    /**
     * Limit how many FunnelTragerOpportunities to update.
     */
    limit?: number
  }

  /**
   * FunnelTragerOpportunity updateManyAndReturn
   */
  export type FunnelTragerOpportunityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * The data used to update FunnelTragerOpportunities.
     */
    data: XOR<FunnelTragerOpportunityUpdateManyMutationInput, FunnelTragerOpportunityUncheckedUpdateManyInput>
    /**
     * Filter which FunnelTragerOpportunities to update
     */
    where?: FunnelTragerOpportunityWhereInput
    /**
     * Limit how many FunnelTragerOpportunities to update.
     */
    limit?: number
  }

  /**
   * FunnelTragerOpportunity upsert
   */
  export type FunnelTragerOpportunityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerOpportunityInclude<ExtArgs> | null
    /**
     * The filter to search for the FunnelTragerOpportunity to update in case it exists.
     */
    where: FunnelTragerOpportunityWhereUniqueInput
    /**
     * In case the FunnelTragerOpportunity found by the `where` argument doesn't exist, create a new FunnelTragerOpportunity with this data.
     */
    create: XOR<FunnelTragerOpportunityCreateInput, FunnelTragerOpportunityUncheckedCreateInput>
    /**
     * In case the FunnelTragerOpportunity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FunnelTragerOpportunityUpdateInput, FunnelTragerOpportunityUncheckedUpdateInput>
  }

  /**
   * FunnelTragerOpportunity delete
   */
  export type FunnelTragerOpportunityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerOpportunityInclude<ExtArgs> | null
    /**
     * Filter which FunnelTragerOpportunity to delete.
     */
    where: FunnelTragerOpportunityWhereUniqueInput
  }

  /**
   * FunnelTragerOpportunity deleteMany
   */
  export type FunnelTragerOpportunityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FunnelTragerOpportunities to delete
     */
    where?: FunnelTragerOpportunityWhereInput
    /**
     * Limit how many FunnelTragerOpportunities to delete.
     */
    limit?: number
  }

  /**
   * FunnelTragerOpportunity.archivos
   */
  export type FunnelTragerOpportunity$archivosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
    where?: FunnelTragerArchivoWhereInput
    orderBy?: FunnelTragerArchivoOrderByWithRelationInput | FunnelTragerArchivoOrderByWithRelationInput[]
    cursor?: FunnelTragerArchivoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FunnelTragerArchivoScalarFieldEnum | FunnelTragerArchivoScalarFieldEnum[]
  }

  /**
   * FunnelTragerOpportunity.historialEtapas
   */
  export type FunnelTragerOpportunity$historialEtapasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
    where?: HistorialEtapaTragerWhereInput
    orderBy?: HistorialEtapaTragerOrderByWithRelationInput | HistorialEtapaTragerOrderByWithRelationInput[]
    cursor?: HistorialEtapaTragerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HistorialEtapaTragerScalarFieldEnum | HistorialEtapaTragerScalarFieldEnum[]
  }

  /**
   * FunnelTragerOpportunity without action
   */
  export type FunnelTragerOpportunityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerOpportunity
     */
    select?: FunnelTragerOpportunitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerOpportunity
     */
    omit?: FunnelTragerOpportunityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerOpportunityInclude<ExtArgs> | null
  }


  /**
   * Model FunnelTragerArchivo
   */

  export type AggregateFunnelTragerArchivo = {
    _count: FunnelTragerArchivoCountAggregateOutputType | null
    _avg: FunnelTragerArchivoAvgAggregateOutputType | null
    _sum: FunnelTragerArchivoSumAggregateOutputType | null
    _min: FunnelTragerArchivoMinAggregateOutputType | null
    _max: FunnelTragerArchivoMaxAggregateOutputType | null
  }

  export type FunnelTragerArchivoAvgAggregateOutputType = {
    id: number | null
    oportunidadId: number | null
    bytes: number | null
  }

  export type FunnelTragerArchivoSumAggregateOutputType = {
    id: number | null
    oportunidadId: number | null
    bytes: number | null
  }

  export type FunnelTragerArchivoMinAggregateOutputType = {
    id: number | null
    oportunidadId: number | null
    tipo: string | null
    url: string | null
    publicId: string | null
    nombreArchivo: string | null
    mimeType: string | null
    bytes: number | null
    etapa: string | null
    observaciones: string | null
    createdAt: Date | null
  }

  export type FunnelTragerArchivoMaxAggregateOutputType = {
    id: number | null
    oportunidadId: number | null
    tipo: string | null
    url: string | null
    publicId: string | null
    nombreArchivo: string | null
    mimeType: string | null
    bytes: number | null
    etapa: string | null
    observaciones: string | null
    createdAt: Date | null
  }

  export type FunnelTragerArchivoCountAggregateOutputType = {
    id: number
    oportunidadId: number
    tipo: number
    url: number
    publicId: number
    nombreArchivo: number
    mimeType: number
    bytes: number
    etapa: number
    observaciones: number
    createdAt: number
    _all: number
  }


  export type FunnelTragerArchivoAvgAggregateInputType = {
    id?: true
    oportunidadId?: true
    bytes?: true
  }

  export type FunnelTragerArchivoSumAggregateInputType = {
    id?: true
    oportunidadId?: true
    bytes?: true
  }

  export type FunnelTragerArchivoMinAggregateInputType = {
    id?: true
    oportunidadId?: true
    tipo?: true
    url?: true
    publicId?: true
    nombreArchivo?: true
    mimeType?: true
    bytes?: true
    etapa?: true
    observaciones?: true
    createdAt?: true
  }

  export type FunnelTragerArchivoMaxAggregateInputType = {
    id?: true
    oportunidadId?: true
    tipo?: true
    url?: true
    publicId?: true
    nombreArchivo?: true
    mimeType?: true
    bytes?: true
    etapa?: true
    observaciones?: true
    createdAt?: true
  }

  export type FunnelTragerArchivoCountAggregateInputType = {
    id?: true
    oportunidadId?: true
    tipo?: true
    url?: true
    publicId?: true
    nombreArchivo?: true
    mimeType?: true
    bytes?: true
    etapa?: true
    observaciones?: true
    createdAt?: true
    _all?: true
  }

  export type FunnelTragerArchivoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FunnelTragerArchivo to aggregate.
     */
    where?: FunnelTragerArchivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FunnelTragerArchivos to fetch.
     */
    orderBy?: FunnelTragerArchivoOrderByWithRelationInput | FunnelTragerArchivoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FunnelTragerArchivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FunnelTragerArchivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FunnelTragerArchivos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FunnelTragerArchivos
    **/
    _count?: true | FunnelTragerArchivoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FunnelTragerArchivoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FunnelTragerArchivoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FunnelTragerArchivoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FunnelTragerArchivoMaxAggregateInputType
  }

  export type GetFunnelTragerArchivoAggregateType<T extends FunnelTragerArchivoAggregateArgs> = {
        [P in keyof T & keyof AggregateFunnelTragerArchivo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFunnelTragerArchivo[P]>
      : GetScalarType<T[P], AggregateFunnelTragerArchivo[P]>
  }




  export type FunnelTragerArchivoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FunnelTragerArchivoWhereInput
    orderBy?: FunnelTragerArchivoOrderByWithAggregationInput | FunnelTragerArchivoOrderByWithAggregationInput[]
    by: FunnelTragerArchivoScalarFieldEnum[] | FunnelTragerArchivoScalarFieldEnum
    having?: FunnelTragerArchivoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FunnelTragerArchivoCountAggregateInputType | true
    _avg?: FunnelTragerArchivoAvgAggregateInputType
    _sum?: FunnelTragerArchivoSumAggregateInputType
    _min?: FunnelTragerArchivoMinAggregateInputType
    _max?: FunnelTragerArchivoMaxAggregateInputType
  }

  export type FunnelTragerArchivoGroupByOutputType = {
    id: number
    oportunidadId: number
    tipo: string
    url: string
    publicId: string
    nombreArchivo: string | null
    mimeType: string | null
    bytes: number | null
    etapa: string | null
    observaciones: string | null
    createdAt: Date
    _count: FunnelTragerArchivoCountAggregateOutputType | null
    _avg: FunnelTragerArchivoAvgAggregateOutputType | null
    _sum: FunnelTragerArchivoSumAggregateOutputType | null
    _min: FunnelTragerArchivoMinAggregateOutputType | null
    _max: FunnelTragerArchivoMaxAggregateOutputType | null
  }

  type GetFunnelTragerArchivoGroupByPayload<T extends FunnelTragerArchivoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FunnelTragerArchivoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FunnelTragerArchivoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FunnelTragerArchivoGroupByOutputType[P]>
            : GetScalarType<T[P], FunnelTragerArchivoGroupByOutputType[P]>
        }
      >
    >


  export type FunnelTragerArchivoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oportunidadId?: boolean
    tipo?: boolean
    url?: boolean
    publicId?: boolean
    nombreArchivo?: boolean
    mimeType?: boolean
    bytes?: boolean
    etapa?: boolean
    observaciones?: boolean
    createdAt?: boolean
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["funnelTragerArchivo"]>

  export type FunnelTragerArchivoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oportunidadId?: boolean
    tipo?: boolean
    url?: boolean
    publicId?: boolean
    nombreArchivo?: boolean
    mimeType?: boolean
    bytes?: boolean
    etapa?: boolean
    observaciones?: boolean
    createdAt?: boolean
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["funnelTragerArchivo"]>

  export type FunnelTragerArchivoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oportunidadId?: boolean
    tipo?: boolean
    url?: boolean
    publicId?: boolean
    nombreArchivo?: boolean
    mimeType?: boolean
    bytes?: boolean
    etapa?: boolean
    observaciones?: boolean
    createdAt?: boolean
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["funnelTragerArchivo"]>

  export type FunnelTragerArchivoSelectScalar = {
    id?: boolean
    oportunidadId?: boolean
    tipo?: boolean
    url?: boolean
    publicId?: boolean
    nombreArchivo?: boolean
    mimeType?: boolean
    bytes?: boolean
    etapa?: boolean
    observaciones?: boolean
    createdAt?: boolean
  }

  export type FunnelTragerArchivoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "oportunidadId" | "tipo" | "url" | "publicId" | "nombreArchivo" | "mimeType" | "bytes" | "etapa" | "observaciones" | "createdAt", ExtArgs["result"]["funnelTragerArchivo"]>
  export type FunnelTragerArchivoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }
  export type FunnelTragerArchivoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }
  export type FunnelTragerArchivoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }

  export type $FunnelTragerArchivoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FunnelTragerArchivo"
    objects: {
      oportunidad: Prisma.$FunnelTragerOpportunityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      oportunidadId: number
      tipo: string
      url: string
      publicId: string
      nombreArchivo: string | null
      mimeType: string | null
      bytes: number | null
      etapa: string | null
      observaciones: string | null
      createdAt: Date
    }, ExtArgs["result"]["funnelTragerArchivo"]>
    composites: {}
  }

  type FunnelTragerArchivoGetPayload<S extends boolean | null | undefined | FunnelTragerArchivoDefaultArgs> = $Result.GetResult<Prisma.$FunnelTragerArchivoPayload, S>

  type FunnelTragerArchivoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FunnelTragerArchivoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FunnelTragerArchivoCountAggregateInputType | true
    }

  export interface FunnelTragerArchivoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FunnelTragerArchivo'], meta: { name: 'FunnelTragerArchivo' } }
    /**
     * Find zero or one FunnelTragerArchivo that matches the filter.
     * @param {FunnelTragerArchivoFindUniqueArgs} args - Arguments to find a FunnelTragerArchivo
     * @example
     * // Get one FunnelTragerArchivo
     * const funnelTragerArchivo = await prisma.funnelTragerArchivo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FunnelTragerArchivoFindUniqueArgs>(args: SelectSubset<T, FunnelTragerArchivoFindUniqueArgs<ExtArgs>>): Prisma__FunnelTragerArchivoClient<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FunnelTragerArchivo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FunnelTragerArchivoFindUniqueOrThrowArgs} args - Arguments to find a FunnelTragerArchivo
     * @example
     * // Get one FunnelTragerArchivo
     * const funnelTragerArchivo = await prisma.funnelTragerArchivo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FunnelTragerArchivoFindUniqueOrThrowArgs>(args: SelectSubset<T, FunnelTragerArchivoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FunnelTragerArchivoClient<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FunnelTragerArchivo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerArchivoFindFirstArgs} args - Arguments to find a FunnelTragerArchivo
     * @example
     * // Get one FunnelTragerArchivo
     * const funnelTragerArchivo = await prisma.funnelTragerArchivo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FunnelTragerArchivoFindFirstArgs>(args?: SelectSubset<T, FunnelTragerArchivoFindFirstArgs<ExtArgs>>): Prisma__FunnelTragerArchivoClient<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FunnelTragerArchivo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerArchivoFindFirstOrThrowArgs} args - Arguments to find a FunnelTragerArchivo
     * @example
     * // Get one FunnelTragerArchivo
     * const funnelTragerArchivo = await prisma.funnelTragerArchivo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FunnelTragerArchivoFindFirstOrThrowArgs>(args?: SelectSubset<T, FunnelTragerArchivoFindFirstOrThrowArgs<ExtArgs>>): Prisma__FunnelTragerArchivoClient<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FunnelTragerArchivos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerArchivoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FunnelTragerArchivos
     * const funnelTragerArchivos = await prisma.funnelTragerArchivo.findMany()
     * 
     * // Get first 10 FunnelTragerArchivos
     * const funnelTragerArchivos = await prisma.funnelTragerArchivo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const funnelTragerArchivoWithIdOnly = await prisma.funnelTragerArchivo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FunnelTragerArchivoFindManyArgs>(args?: SelectSubset<T, FunnelTragerArchivoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FunnelTragerArchivo.
     * @param {FunnelTragerArchivoCreateArgs} args - Arguments to create a FunnelTragerArchivo.
     * @example
     * // Create one FunnelTragerArchivo
     * const FunnelTragerArchivo = await prisma.funnelTragerArchivo.create({
     *   data: {
     *     // ... data to create a FunnelTragerArchivo
     *   }
     * })
     * 
     */
    create<T extends FunnelTragerArchivoCreateArgs>(args: SelectSubset<T, FunnelTragerArchivoCreateArgs<ExtArgs>>): Prisma__FunnelTragerArchivoClient<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FunnelTragerArchivos.
     * @param {FunnelTragerArchivoCreateManyArgs} args - Arguments to create many FunnelTragerArchivos.
     * @example
     * // Create many FunnelTragerArchivos
     * const funnelTragerArchivo = await prisma.funnelTragerArchivo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FunnelTragerArchivoCreateManyArgs>(args?: SelectSubset<T, FunnelTragerArchivoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FunnelTragerArchivos and returns the data saved in the database.
     * @param {FunnelTragerArchivoCreateManyAndReturnArgs} args - Arguments to create many FunnelTragerArchivos.
     * @example
     * // Create many FunnelTragerArchivos
     * const funnelTragerArchivo = await prisma.funnelTragerArchivo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FunnelTragerArchivos and only return the `id`
     * const funnelTragerArchivoWithIdOnly = await prisma.funnelTragerArchivo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FunnelTragerArchivoCreateManyAndReturnArgs>(args?: SelectSubset<T, FunnelTragerArchivoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FunnelTragerArchivo.
     * @param {FunnelTragerArchivoDeleteArgs} args - Arguments to delete one FunnelTragerArchivo.
     * @example
     * // Delete one FunnelTragerArchivo
     * const FunnelTragerArchivo = await prisma.funnelTragerArchivo.delete({
     *   where: {
     *     // ... filter to delete one FunnelTragerArchivo
     *   }
     * })
     * 
     */
    delete<T extends FunnelTragerArchivoDeleteArgs>(args: SelectSubset<T, FunnelTragerArchivoDeleteArgs<ExtArgs>>): Prisma__FunnelTragerArchivoClient<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FunnelTragerArchivo.
     * @param {FunnelTragerArchivoUpdateArgs} args - Arguments to update one FunnelTragerArchivo.
     * @example
     * // Update one FunnelTragerArchivo
     * const funnelTragerArchivo = await prisma.funnelTragerArchivo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FunnelTragerArchivoUpdateArgs>(args: SelectSubset<T, FunnelTragerArchivoUpdateArgs<ExtArgs>>): Prisma__FunnelTragerArchivoClient<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FunnelTragerArchivos.
     * @param {FunnelTragerArchivoDeleteManyArgs} args - Arguments to filter FunnelTragerArchivos to delete.
     * @example
     * // Delete a few FunnelTragerArchivos
     * const { count } = await prisma.funnelTragerArchivo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FunnelTragerArchivoDeleteManyArgs>(args?: SelectSubset<T, FunnelTragerArchivoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FunnelTragerArchivos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerArchivoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FunnelTragerArchivos
     * const funnelTragerArchivo = await prisma.funnelTragerArchivo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FunnelTragerArchivoUpdateManyArgs>(args: SelectSubset<T, FunnelTragerArchivoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FunnelTragerArchivos and returns the data updated in the database.
     * @param {FunnelTragerArchivoUpdateManyAndReturnArgs} args - Arguments to update many FunnelTragerArchivos.
     * @example
     * // Update many FunnelTragerArchivos
     * const funnelTragerArchivo = await prisma.funnelTragerArchivo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FunnelTragerArchivos and only return the `id`
     * const funnelTragerArchivoWithIdOnly = await prisma.funnelTragerArchivo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FunnelTragerArchivoUpdateManyAndReturnArgs>(args: SelectSubset<T, FunnelTragerArchivoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FunnelTragerArchivo.
     * @param {FunnelTragerArchivoUpsertArgs} args - Arguments to update or create a FunnelTragerArchivo.
     * @example
     * // Update or create a FunnelTragerArchivo
     * const funnelTragerArchivo = await prisma.funnelTragerArchivo.upsert({
     *   create: {
     *     // ... data to create a FunnelTragerArchivo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FunnelTragerArchivo we want to update
     *   }
     * })
     */
    upsert<T extends FunnelTragerArchivoUpsertArgs>(args: SelectSubset<T, FunnelTragerArchivoUpsertArgs<ExtArgs>>): Prisma__FunnelTragerArchivoClient<$Result.GetResult<Prisma.$FunnelTragerArchivoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FunnelTragerArchivos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerArchivoCountArgs} args - Arguments to filter FunnelTragerArchivos to count.
     * @example
     * // Count the number of FunnelTragerArchivos
     * const count = await prisma.funnelTragerArchivo.count({
     *   where: {
     *     // ... the filter for the FunnelTragerArchivos we want to count
     *   }
     * })
    **/
    count<T extends FunnelTragerArchivoCountArgs>(
      args?: Subset<T, FunnelTragerArchivoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FunnelTragerArchivoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FunnelTragerArchivo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerArchivoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FunnelTragerArchivoAggregateArgs>(args: Subset<T, FunnelTragerArchivoAggregateArgs>): Prisma.PrismaPromise<GetFunnelTragerArchivoAggregateType<T>>

    /**
     * Group by FunnelTragerArchivo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FunnelTragerArchivoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FunnelTragerArchivoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FunnelTragerArchivoGroupByArgs['orderBy'] }
        : { orderBy?: FunnelTragerArchivoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FunnelTragerArchivoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFunnelTragerArchivoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FunnelTragerArchivo model
   */
  readonly fields: FunnelTragerArchivoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FunnelTragerArchivo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FunnelTragerArchivoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    oportunidad<T extends FunnelTragerOpportunityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FunnelTragerOpportunityDefaultArgs<ExtArgs>>): Prisma__FunnelTragerOpportunityClient<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FunnelTragerArchivo model
   */
  interface FunnelTragerArchivoFieldRefs {
    readonly id: FieldRef<"FunnelTragerArchivo", 'Int'>
    readonly oportunidadId: FieldRef<"FunnelTragerArchivo", 'Int'>
    readonly tipo: FieldRef<"FunnelTragerArchivo", 'String'>
    readonly url: FieldRef<"FunnelTragerArchivo", 'String'>
    readonly publicId: FieldRef<"FunnelTragerArchivo", 'String'>
    readonly nombreArchivo: FieldRef<"FunnelTragerArchivo", 'String'>
    readonly mimeType: FieldRef<"FunnelTragerArchivo", 'String'>
    readonly bytes: FieldRef<"FunnelTragerArchivo", 'Int'>
    readonly etapa: FieldRef<"FunnelTragerArchivo", 'String'>
    readonly observaciones: FieldRef<"FunnelTragerArchivo", 'String'>
    readonly createdAt: FieldRef<"FunnelTragerArchivo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FunnelTragerArchivo findUnique
   */
  export type FunnelTragerArchivoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
    /**
     * Filter, which FunnelTragerArchivo to fetch.
     */
    where: FunnelTragerArchivoWhereUniqueInput
  }

  /**
   * FunnelTragerArchivo findUniqueOrThrow
   */
  export type FunnelTragerArchivoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
    /**
     * Filter, which FunnelTragerArchivo to fetch.
     */
    where: FunnelTragerArchivoWhereUniqueInput
  }

  /**
   * FunnelTragerArchivo findFirst
   */
  export type FunnelTragerArchivoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
    /**
     * Filter, which FunnelTragerArchivo to fetch.
     */
    where?: FunnelTragerArchivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FunnelTragerArchivos to fetch.
     */
    orderBy?: FunnelTragerArchivoOrderByWithRelationInput | FunnelTragerArchivoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FunnelTragerArchivos.
     */
    cursor?: FunnelTragerArchivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FunnelTragerArchivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FunnelTragerArchivos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FunnelTragerArchivos.
     */
    distinct?: FunnelTragerArchivoScalarFieldEnum | FunnelTragerArchivoScalarFieldEnum[]
  }

  /**
   * FunnelTragerArchivo findFirstOrThrow
   */
  export type FunnelTragerArchivoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
    /**
     * Filter, which FunnelTragerArchivo to fetch.
     */
    where?: FunnelTragerArchivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FunnelTragerArchivos to fetch.
     */
    orderBy?: FunnelTragerArchivoOrderByWithRelationInput | FunnelTragerArchivoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FunnelTragerArchivos.
     */
    cursor?: FunnelTragerArchivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FunnelTragerArchivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FunnelTragerArchivos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FunnelTragerArchivos.
     */
    distinct?: FunnelTragerArchivoScalarFieldEnum | FunnelTragerArchivoScalarFieldEnum[]
  }

  /**
   * FunnelTragerArchivo findMany
   */
  export type FunnelTragerArchivoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
    /**
     * Filter, which FunnelTragerArchivos to fetch.
     */
    where?: FunnelTragerArchivoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FunnelTragerArchivos to fetch.
     */
    orderBy?: FunnelTragerArchivoOrderByWithRelationInput | FunnelTragerArchivoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FunnelTragerArchivos.
     */
    cursor?: FunnelTragerArchivoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FunnelTragerArchivos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FunnelTragerArchivos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FunnelTragerArchivos.
     */
    distinct?: FunnelTragerArchivoScalarFieldEnum | FunnelTragerArchivoScalarFieldEnum[]
  }

  /**
   * FunnelTragerArchivo create
   */
  export type FunnelTragerArchivoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
    /**
     * The data needed to create a FunnelTragerArchivo.
     */
    data: XOR<FunnelTragerArchivoCreateInput, FunnelTragerArchivoUncheckedCreateInput>
  }

  /**
   * FunnelTragerArchivo createMany
   */
  export type FunnelTragerArchivoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FunnelTragerArchivos.
     */
    data: FunnelTragerArchivoCreateManyInput | FunnelTragerArchivoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FunnelTragerArchivo createManyAndReturn
   */
  export type FunnelTragerArchivoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * The data used to create many FunnelTragerArchivos.
     */
    data: FunnelTragerArchivoCreateManyInput | FunnelTragerArchivoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FunnelTragerArchivo update
   */
  export type FunnelTragerArchivoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
    /**
     * The data needed to update a FunnelTragerArchivo.
     */
    data: XOR<FunnelTragerArchivoUpdateInput, FunnelTragerArchivoUncheckedUpdateInput>
    /**
     * Choose, which FunnelTragerArchivo to update.
     */
    where: FunnelTragerArchivoWhereUniqueInput
  }

  /**
   * FunnelTragerArchivo updateMany
   */
  export type FunnelTragerArchivoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FunnelTragerArchivos.
     */
    data: XOR<FunnelTragerArchivoUpdateManyMutationInput, FunnelTragerArchivoUncheckedUpdateManyInput>
    /**
     * Filter which FunnelTragerArchivos to update
     */
    where?: FunnelTragerArchivoWhereInput
    /**
     * Limit how many FunnelTragerArchivos to update.
     */
    limit?: number
  }

  /**
   * FunnelTragerArchivo updateManyAndReturn
   */
  export type FunnelTragerArchivoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * The data used to update FunnelTragerArchivos.
     */
    data: XOR<FunnelTragerArchivoUpdateManyMutationInput, FunnelTragerArchivoUncheckedUpdateManyInput>
    /**
     * Filter which FunnelTragerArchivos to update
     */
    where?: FunnelTragerArchivoWhereInput
    /**
     * Limit how many FunnelTragerArchivos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FunnelTragerArchivo upsert
   */
  export type FunnelTragerArchivoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
    /**
     * The filter to search for the FunnelTragerArchivo to update in case it exists.
     */
    where: FunnelTragerArchivoWhereUniqueInput
    /**
     * In case the FunnelTragerArchivo found by the `where` argument doesn't exist, create a new FunnelTragerArchivo with this data.
     */
    create: XOR<FunnelTragerArchivoCreateInput, FunnelTragerArchivoUncheckedCreateInput>
    /**
     * In case the FunnelTragerArchivo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FunnelTragerArchivoUpdateInput, FunnelTragerArchivoUncheckedUpdateInput>
  }

  /**
   * FunnelTragerArchivo delete
   */
  export type FunnelTragerArchivoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
    /**
     * Filter which FunnelTragerArchivo to delete.
     */
    where: FunnelTragerArchivoWhereUniqueInput
  }

  /**
   * FunnelTragerArchivo deleteMany
   */
  export type FunnelTragerArchivoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FunnelTragerArchivos to delete
     */
    where?: FunnelTragerArchivoWhereInput
    /**
     * Limit how many FunnelTragerArchivos to delete.
     */
    limit?: number
  }

  /**
   * FunnelTragerArchivo without action
   */
  export type FunnelTragerArchivoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FunnelTragerArchivo
     */
    select?: FunnelTragerArchivoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FunnelTragerArchivo
     */
    omit?: FunnelTragerArchivoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FunnelTragerArchivoInclude<ExtArgs> | null
  }


  /**
   * Model HistorialEtapaTrager
   */

  export type AggregateHistorialEtapaTrager = {
    _count: HistorialEtapaTragerCountAggregateOutputType | null
    _avg: HistorialEtapaTragerAvgAggregateOutputType | null
    _sum: HistorialEtapaTragerSumAggregateOutputType | null
    _min: HistorialEtapaTragerMinAggregateOutputType | null
    _max: HistorialEtapaTragerMaxAggregateOutputType | null
  }

  export type HistorialEtapaTragerAvgAggregateOutputType = {
    id: number | null
    oportunidadId: number | null
  }

  export type HistorialEtapaTragerSumAggregateOutputType = {
    id: number | null
    oportunidadId: number | null
  }

  export type HistorialEtapaTragerMinAggregateOutputType = {
    id: number | null
    oportunidadId: number | null
    etapaAnterior: string | null
    etapaNueva: string | null
    usuarioId: string | null
    createdAt: Date | null
  }

  export type HistorialEtapaTragerMaxAggregateOutputType = {
    id: number | null
    oportunidadId: number | null
    etapaAnterior: string | null
    etapaNueva: string | null
    usuarioId: string | null
    createdAt: Date | null
  }

  export type HistorialEtapaTragerCountAggregateOutputType = {
    id: number
    oportunidadId: number
    etapaAnterior: number
    etapaNueva: number
    usuarioId: number
    createdAt: number
    _all: number
  }


  export type HistorialEtapaTragerAvgAggregateInputType = {
    id?: true
    oportunidadId?: true
  }

  export type HistorialEtapaTragerSumAggregateInputType = {
    id?: true
    oportunidadId?: true
  }

  export type HistorialEtapaTragerMinAggregateInputType = {
    id?: true
    oportunidadId?: true
    etapaAnterior?: true
    etapaNueva?: true
    usuarioId?: true
    createdAt?: true
  }

  export type HistorialEtapaTragerMaxAggregateInputType = {
    id?: true
    oportunidadId?: true
    etapaAnterior?: true
    etapaNueva?: true
    usuarioId?: true
    createdAt?: true
  }

  export type HistorialEtapaTragerCountAggregateInputType = {
    id?: true
    oportunidadId?: true
    etapaAnterior?: true
    etapaNueva?: true
    usuarioId?: true
    createdAt?: true
    _all?: true
  }

  export type HistorialEtapaTragerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HistorialEtapaTrager to aggregate.
     */
    where?: HistorialEtapaTragerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistorialEtapaTragers to fetch.
     */
    orderBy?: HistorialEtapaTragerOrderByWithRelationInput | HistorialEtapaTragerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HistorialEtapaTragerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistorialEtapaTragers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistorialEtapaTragers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HistorialEtapaTragers
    **/
    _count?: true | HistorialEtapaTragerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HistorialEtapaTragerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HistorialEtapaTragerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HistorialEtapaTragerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HistorialEtapaTragerMaxAggregateInputType
  }

  export type GetHistorialEtapaTragerAggregateType<T extends HistorialEtapaTragerAggregateArgs> = {
        [P in keyof T & keyof AggregateHistorialEtapaTrager]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHistorialEtapaTrager[P]>
      : GetScalarType<T[P], AggregateHistorialEtapaTrager[P]>
  }




  export type HistorialEtapaTragerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HistorialEtapaTragerWhereInput
    orderBy?: HistorialEtapaTragerOrderByWithAggregationInput | HistorialEtapaTragerOrderByWithAggregationInput[]
    by: HistorialEtapaTragerScalarFieldEnum[] | HistorialEtapaTragerScalarFieldEnum
    having?: HistorialEtapaTragerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HistorialEtapaTragerCountAggregateInputType | true
    _avg?: HistorialEtapaTragerAvgAggregateInputType
    _sum?: HistorialEtapaTragerSumAggregateInputType
    _min?: HistorialEtapaTragerMinAggregateInputType
    _max?: HistorialEtapaTragerMaxAggregateInputType
  }

  export type HistorialEtapaTragerGroupByOutputType = {
    id: number
    oportunidadId: number
    etapaAnterior: string | null
    etapaNueva: string
    usuarioId: string | null
    createdAt: Date
    _count: HistorialEtapaTragerCountAggregateOutputType | null
    _avg: HistorialEtapaTragerAvgAggregateOutputType | null
    _sum: HistorialEtapaTragerSumAggregateOutputType | null
    _min: HistorialEtapaTragerMinAggregateOutputType | null
    _max: HistorialEtapaTragerMaxAggregateOutputType | null
  }

  type GetHistorialEtapaTragerGroupByPayload<T extends HistorialEtapaTragerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HistorialEtapaTragerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HistorialEtapaTragerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HistorialEtapaTragerGroupByOutputType[P]>
            : GetScalarType<T[P], HistorialEtapaTragerGroupByOutputType[P]>
        }
      >
    >


  export type HistorialEtapaTragerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oportunidadId?: boolean
    etapaAnterior?: boolean
    etapaNueva?: boolean
    usuarioId?: boolean
    createdAt?: boolean
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historialEtapaTrager"]>

  export type HistorialEtapaTragerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oportunidadId?: boolean
    etapaAnterior?: boolean
    etapaNueva?: boolean
    usuarioId?: boolean
    createdAt?: boolean
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historialEtapaTrager"]>

  export type HistorialEtapaTragerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oportunidadId?: boolean
    etapaAnterior?: boolean
    etapaNueva?: boolean
    usuarioId?: boolean
    createdAt?: boolean
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historialEtapaTrager"]>

  export type HistorialEtapaTragerSelectScalar = {
    id?: boolean
    oportunidadId?: boolean
    etapaAnterior?: boolean
    etapaNueva?: boolean
    usuarioId?: boolean
    createdAt?: boolean
  }

  export type HistorialEtapaTragerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "oportunidadId" | "etapaAnterior" | "etapaNueva" | "usuarioId" | "createdAt", ExtArgs["result"]["historialEtapaTrager"]>
  export type HistorialEtapaTragerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }
  export type HistorialEtapaTragerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }
  export type HistorialEtapaTragerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    oportunidad?: boolean | FunnelTragerOpportunityDefaultArgs<ExtArgs>
  }

  export type $HistorialEtapaTragerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HistorialEtapaTrager"
    objects: {
      oportunidad: Prisma.$FunnelTragerOpportunityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      oportunidadId: number
      etapaAnterior: string | null
      etapaNueva: string
      usuarioId: string | null
      createdAt: Date
    }, ExtArgs["result"]["historialEtapaTrager"]>
    composites: {}
  }

  type HistorialEtapaTragerGetPayload<S extends boolean | null | undefined | HistorialEtapaTragerDefaultArgs> = $Result.GetResult<Prisma.$HistorialEtapaTragerPayload, S>

  type HistorialEtapaTragerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HistorialEtapaTragerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HistorialEtapaTragerCountAggregateInputType | true
    }

  export interface HistorialEtapaTragerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HistorialEtapaTrager'], meta: { name: 'HistorialEtapaTrager' } }
    /**
     * Find zero or one HistorialEtapaTrager that matches the filter.
     * @param {HistorialEtapaTragerFindUniqueArgs} args - Arguments to find a HistorialEtapaTrager
     * @example
     * // Get one HistorialEtapaTrager
     * const historialEtapaTrager = await prisma.historialEtapaTrager.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HistorialEtapaTragerFindUniqueArgs>(args: SelectSubset<T, HistorialEtapaTragerFindUniqueArgs<ExtArgs>>): Prisma__HistorialEtapaTragerClient<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HistorialEtapaTrager that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HistorialEtapaTragerFindUniqueOrThrowArgs} args - Arguments to find a HistorialEtapaTrager
     * @example
     * // Get one HistorialEtapaTrager
     * const historialEtapaTrager = await prisma.historialEtapaTrager.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HistorialEtapaTragerFindUniqueOrThrowArgs>(args: SelectSubset<T, HistorialEtapaTragerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HistorialEtapaTragerClient<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HistorialEtapaTrager that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialEtapaTragerFindFirstArgs} args - Arguments to find a HistorialEtapaTrager
     * @example
     * // Get one HistorialEtapaTrager
     * const historialEtapaTrager = await prisma.historialEtapaTrager.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HistorialEtapaTragerFindFirstArgs>(args?: SelectSubset<T, HistorialEtapaTragerFindFirstArgs<ExtArgs>>): Prisma__HistorialEtapaTragerClient<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HistorialEtapaTrager that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialEtapaTragerFindFirstOrThrowArgs} args - Arguments to find a HistorialEtapaTrager
     * @example
     * // Get one HistorialEtapaTrager
     * const historialEtapaTrager = await prisma.historialEtapaTrager.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HistorialEtapaTragerFindFirstOrThrowArgs>(args?: SelectSubset<T, HistorialEtapaTragerFindFirstOrThrowArgs<ExtArgs>>): Prisma__HistorialEtapaTragerClient<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HistorialEtapaTragers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialEtapaTragerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HistorialEtapaTragers
     * const historialEtapaTragers = await prisma.historialEtapaTrager.findMany()
     * 
     * // Get first 10 HistorialEtapaTragers
     * const historialEtapaTragers = await prisma.historialEtapaTrager.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const historialEtapaTragerWithIdOnly = await prisma.historialEtapaTrager.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HistorialEtapaTragerFindManyArgs>(args?: SelectSubset<T, HistorialEtapaTragerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HistorialEtapaTrager.
     * @param {HistorialEtapaTragerCreateArgs} args - Arguments to create a HistorialEtapaTrager.
     * @example
     * // Create one HistorialEtapaTrager
     * const HistorialEtapaTrager = await prisma.historialEtapaTrager.create({
     *   data: {
     *     // ... data to create a HistorialEtapaTrager
     *   }
     * })
     * 
     */
    create<T extends HistorialEtapaTragerCreateArgs>(args: SelectSubset<T, HistorialEtapaTragerCreateArgs<ExtArgs>>): Prisma__HistorialEtapaTragerClient<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HistorialEtapaTragers.
     * @param {HistorialEtapaTragerCreateManyArgs} args - Arguments to create many HistorialEtapaTragers.
     * @example
     * // Create many HistorialEtapaTragers
     * const historialEtapaTrager = await prisma.historialEtapaTrager.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HistorialEtapaTragerCreateManyArgs>(args?: SelectSubset<T, HistorialEtapaTragerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HistorialEtapaTragers and returns the data saved in the database.
     * @param {HistorialEtapaTragerCreateManyAndReturnArgs} args - Arguments to create many HistorialEtapaTragers.
     * @example
     * // Create many HistorialEtapaTragers
     * const historialEtapaTrager = await prisma.historialEtapaTrager.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HistorialEtapaTragers and only return the `id`
     * const historialEtapaTragerWithIdOnly = await prisma.historialEtapaTrager.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HistorialEtapaTragerCreateManyAndReturnArgs>(args?: SelectSubset<T, HistorialEtapaTragerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HistorialEtapaTrager.
     * @param {HistorialEtapaTragerDeleteArgs} args - Arguments to delete one HistorialEtapaTrager.
     * @example
     * // Delete one HistorialEtapaTrager
     * const HistorialEtapaTrager = await prisma.historialEtapaTrager.delete({
     *   where: {
     *     // ... filter to delete one HistorialEtapaTrager
     *   }
     * })
     * 
     */
    delete<T extends HistorialEtapaTragerDeleteArgs>(args: SelectSubset<T, HistorialEtapaTragerDeleteArgs<ExtArgs>>): Prisma__HistorialEtapaTragerClient<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HistorialEtapaTrager.
     * @param {HistorialEtapaTragerUpdateArgs} args - Arguments to update one HistorialEtapaTrager.
     * @example
     * // Update one HistorialEtapaTrager
     * const historialEtapaTrager = await prisma.historialEtapaTrager.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HistorialEtapaTragerUpdateArgs>(args: SelectSubset<T, HistorialEtapaTragerUpdateArgs<ExtArgs>>): Prisma__HistorialEtapaTragerClient<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HistorialEtapaTragers.
     * @param {HistorialEtapaTragerDeleteManyArgs} args - Arguments to filter HistorialEtapaTragers to delete.
     * @example
     * // Delete a few HistorialEtapaTragers
     * const { count } = await prisma.historialEtapaTrager.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HistorialEtapaTragerDeleteManyArgs>(args?: SelectSubset<T, HistorialEtapaTragerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HistorialEtapaTragers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialEtapaTragerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HistorialEtapaTragers
     * const historialEtapaTrager = await prisma.historialEtapaTrager.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HistorialEtapaTragerUpdateManyArgs>(args: SelectSubset<T, HistorialEtapaTragerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HistorialEtapaTragers and returns the data updated in the database.
     * @param {HistorialEtapaTragerUpdateManyAndReturnArgs} args - Arguments to update many HistorialEtapaTragers.
     * @example
     * // Update many HistorialEtapaTragers
     * const historialEtapaTrager = await prisma.historialEtapaTrager.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HistorialEtapaTragers and only return the `id`
     * const historialEtapaTragerWithIdOnly = await prisma.historialEtapaTrager.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HistorialEtapaTragerUpdateManyAndReturnArgs>(args: SelectSubset<T, HistorialEtapaTragerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HistorialEtapaTrager.
     * @param {HistorialEtapaTragerUpsertArgs} args - Arguments to update or create a HistorialEtapaTrager.
     * @example
     * // Update or create a HistorialEtapaTrager
     * const historialEtapaTrager = await prisma.historialEtapaTrager.upsert({
     *   create: {
     *     // ... data to create a HistorialEtapaTrager
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HistorialEtapaTrager we want to update
     *   }
     * })
     */
    upsert<T extends HistorialEtapaTragerUpsertArgs>(args: SelectSubset<T, HistorialEtapaTragerUpsertArgs<ExtArgs>>): Prisma__HistorialEtapaTragerClient<$Result.GetResult<Prisma.$HistorialEtapaTragerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HistorialEtapaTragers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialEtapaTragerCountArgs} args - Arguments to filter HistorialEtapaTragers to count.
     * @example
     * // Count the number of HistorialEtapaTragers
     * const count = await prisma.historialEtapaTrager.count({
     *   where: {
     *     // ... the filter for the HistorialEtapaTragers we want to count
     *   }
     * })
    **/
    count<T extends HistorialEtapaTragerCountArgs>(
      args?: Subset<T, HistorialEtapaTragerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HistorialEtapaTragerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HistorialEtapaTrager.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialEtapaTragerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HistorialEtapaTragerAggregateArgs>(args: Subset<T, HistorialEtapaTragerAggregateArgs>): Prisma.PrismaPromise<GetHistorialEtapaTragerAggregateType<T>>

    /**
     * Group by HistorialEtapaTrager.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialEtapaTragerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HistorialEtapaTragerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HistorialEtapaTragerGroupByArgs['orderBy'] }
        : { orderBy?: HistorialEtapaTragerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HistorialEtapaTragerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHistorialEtapaTragerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HistorialEtapaTrager model
   */
  readonly fields: HistorialEtapaTragerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HistorialEtapaTrager.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HistorialEtapaTragerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    oportunidad<T extends FunnelTragerOpportunityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FunnelTragerOpportunityDefaultArgs<ExtArgs>>): Prisma__FunnelTragerOpportunityClient<$Result.GetResult<Prisma.$FunnelTragerOpportunityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HistorialEtapaTrager model
   */
  interface HistorialEtapaTragerFieldRefs {
    readonly id: FieldRef<"HistorialEtapaTrager", 'Int'>
    readonly oportunidadId: FieldRef<"HistorialEtapaTrager", 'Int'>
    readonly etapaAnterior: FieldRef<"HistorialEtapaTrager", 'String'>
    readonly etapaNueva: FieldRef<"HistorialEtapaTrager", 'String'>
    readonly usuarioId: FieldRef<"HistorialEtapaTrager", 'String'>
    readonly createdAt: FieldRef<"HistorialEtapaTrager", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HistorialEtapaTrager findUnique
   */
  export type HistorialEtapaTragerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
    /**
     * Filter, which HistorialEtapaTrager to fetch.
     */
    where: HistorialEtapaTragerWhereUniqueInput
  }

  /**
   * HistorialEtapaTrager findUniqueOrThrow
   */
  export type HistorialEtapaTragerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
    /**
     * Filter, which HistorialEtapaTrager to fetch.
     */
    where: HistorialEtapaTragerWhereUniqueInput
  }

  /**
   * HistorialEtapaTrager findFirst
   */
  export type HistorialEtapaTragerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
    /**
     * Filter, which HistorialEtapaTrager to fetch.
     */
    where?: HistorialEtapaTragerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistorialEtapaTragers to fetch.
     */
    orderBy?: HistorialEtapaTragerOrderByWithRelationInput | HistorialEtapaTragerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HistorialEtapaTragers.
     */
    cursor?: HistorialEtapaTragerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistorialEtapaTragers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistorialEtapaTragers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistorialEtapaTragers.
     */
    distinct?: HistorialEtapaTragerScalarFieldEnum | HistorialEtapaTragerScalarFieldEnum[]
  }

  /**
   * HistorialEtapaTrager findFirstOrThrow
   */
  export type HistorialEtapaTragerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
    /**
     * Filter, which HistorialEtapaTrager to fetch.
     */
    where?: HistorialEtapaTragerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistorialEtapaTragers to fetch.
     */
    orderBy?: HistorialEtapaTragerOrderByWithRelationInput | HistorialEtapaTragerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HistorialEtapaTragers.
     */
    cursor?: HistorialEtapaTragerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistorialEtapaTragers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistorialEtapaTragers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistorialEtapaTragers.
     */
    distinct?: HistorialEtapaTragerScalarFieldEnum | HistorialEtapaTragerScalarFieldEnum[]
  }

  /**
   * HistorialEtapaTrager findMany
   */
  export type HistorialEtapaTragerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
    /**
     * Filter, which HistorialEtapaTragers to fetch.
     */
    where?: HistorialEtapaTragerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistorialEtapaTragers to fetch.
     */
    orderBy?: HistorialEtapaTragerOrderByWithRelationInput | HistorialEtapaTragerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HistorialEtapaTragers.
     */
    cursor?: HistorialEtapaTragerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistorialEtapaTragers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistorialEtapaTragers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistorialEtapaTragers.
     */
    distinct?: HistorialEtapaTragerScalarFieldEnum | HistorialEtapaTragerScalarFieldEnum[]
  }

  /**
   * HistorialEtapaTrager create
   */
  export type HistorialEtapaTragerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
    /**
     * The data needed to create a HistorialEtapaTrager.
     */
    data: XOR<HistorialEtapaTragerCreateInput, HistorialEtapaTragerUncheckedCreateInput>
  }

  /**
   * HistorialEtapaTrager createMany
   */
  export type HistorialEtapaTragerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HistorialEtapaTragers.
     */
    data: HistorialEtapaTragerCreateManyInput | HistorialEtapaTragerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HistorialEtapaTrager createManyAndReturn
   */
  export type HistorialEtapaTragerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * The data used to create many HistorialEtapaTragers.
     */
    data: HistorialEtapaTragerCreateManyInput | HistorialEtapaTragerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HistorialEtapaTrager update
   */
  export type HistorialEtapaTragerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
    /**
     * The data needed to update a HistorialEtapaTrager.
     */
    data: XOR<HistorialEtapaTragerUpdateInput, HistorialEtapaTragerUncheckedUpdateInput>
    /**
     * Choose, which HistorialEtapaTrager to update.
     */
    where: HistorialEtapaTragerWhereUniqueInput
  }

  /**
   * HistorialEtapaTrager updateMany
   */
  export type HistorialEtapaTragerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HistorialEtapaTragers.
     */
    data: XOR<HistorialEtapaTragerUpdateManyMutationInput, HistorialEtapaTragerUncheckedUpdateManyInput>
    /**
     * Filter which HistorialEtapaTragers to update
     */
    where?: HistorialEtapaTragerWhereInput
    /**
     * Limit how many HistorialEtapaTragers to update.
     */
    limit?: number
  }

  /**
   * HistorialEtapaTrager updateManyAndReturn
   */
  export type HistorialEtapaTragerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * The data used to update HistorialEtapaTragers.
     */
    data: XOR<HistorialEtapaTragerUpdateManyMutationInput, HistorialEtapaTragerUncheckedUpdateManyInput>
    /**
     * Filter which HistorialEtapaTragers to update
     */
    where?: HistorialEtapaTragerWhereInput
    /**
     * Limit how many HistorialEtapaTragers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * HistorialEtapaTrager upsert
   */
  export type HistorialEtapaTragerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
    /**
     * The filter to search for the HistorialEtapaTrager to update in case it exists.
     */
    where: HistorialEtapaTragerWhereUniqueInput
    /**
     * In case the HistorialEtapaTrager found by the `where` argument doesn't exist, create a new HistorialEtapaTrager with this data.
     */
    create: XOR<HistorialEtapaTragerCreateInput, HistorialEtapaTragerUncheckedCreateInput>
    /**
     * In case the HistorialEtapaTrager was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HistorialEtapaTragerUpdateInput, HistorialEtapaTragerUncheckedUpdateInput>
  }

  /**
   * HistorialEtapaTrager delete
   */
  export type HistorialEtapaTragerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
    /**
     * Filter which HistorialEtapaTrager to delete.
     */
    where: HistorialEtapaTragerWhereUniqueInput
  }

  /**
   * HistorialEtapaTrager deleteMany
   */
  export type HistorialEtapaTragerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HistorialEtapaTragers to delete
     */
    where?: HistorialEtapaTragerWhereInput
    /**
     * Limit how many HistorialEtapaTragers to delete.
     */
    limit?: number
  }

  /**
   * HistorialEtapaTrager without action
   */
  export type HistorialEtapaTragerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialEtapaTrager
     */
    select?: HistorialEtapaTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistorialEtapaTrager
     */
    omit?: HistorialEtapaTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialEtapaTragerInclude<ExtArgs> | null
  }


  /**
   * Model Categoria
   */

  export type AggregateCategoria = {
    _count: CategoriaCountAggregateOutputType | null
    _avg: CategoriaAvgAggregateOutputType | null
    _sum: CategoriaSumAggregateOutputType | null
    _min: CategoriaMinAggregateOutputType | null
    _max: CategoriaMaxAggregateOutputType | null
  }

  export type CategoriaAvgAggregateOutputType = {
    id: number | null
  }

  export type CategoriaSumAggregateOutputType = {
    id: number | null
  }

  export type CategoriaMinAggregateOutputType = {
    id: number | null
    nombre: string | null
  }

  export type CategoriaMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
  }

  export type CategoriaCountAggregateOutputType = {
    id: number
    nombre: number
    _all: number
  }


  export type CategoriaAvgAggregateInputType = {
    id?: true
  }

  export type CategoriaSumAggregateInputType = {
    id?: true
  }

  export type CategoriaMinAggregateInputType = {
    id?: true
    nombre?: true
  }

  export type CategoriaMaxAggregateInputType = {
    id?: true
    nombre?: true
  }

  export type CategoriaCountAggregateInputType = {
    id?: true
    nombre?: true
    _all?: true
  }

  export type CategoriaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categoria to aggregate.
     */
    where?: CategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categorias to fetch.
     */
    orderBy?: CategoriaOrderByWithRelationInput | CategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categorias
    **/
    _count?: true | CategoriaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoriaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategoriaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoriaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoriaMaxAggregateInputType
  }

  export type GetCategoriaAggregateType<T extends CategoriaAggregateArgs> = {
        [P in keyof T & keyof AggregateCategoria]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategoria[P]>
      : GetScalarType<T[P], AggregateCategoria[P]>
  }




  export type CategoriaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoriaWhereInput
    orderBy?: CategoriaOrderByWithAggregationInput | CategoriaOrderByWithAggregationInput[]
    by: CategoriaScalarFieldEnum[] | CategoriaScalarFieldEnum
    having?: CategoriaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoriaCountAggregateInputType | true
    _avg?: CategoriaAvgAggregateInputType
    _sum?: CategoriaSumAggregateInputType
    _min?: CategoriaMinAggregateInputType
    _max?: CategoriaMaxAggregateInputType
  }

  export type CategoriaGroupByOutputType = {
    id: number
    nombre: string
    _count: CategoriaCountAggregateOutputType | null
    _avg: CategoriaAvgAggregateOutputType | null
    _sum: CategoriaSumAggregateOutputType | null
    _min: CategoriaMinAggregateOutputType | null
    _max: CategoriaMaxAggregateOutputType | null
  }

  type GetCategoriaGroupByPayload<T extends CategoriaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoriaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoriaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoriaGroupByOutputType[P]>
            : GetScalarType<T[P], CategoriaGroupByOutputType[P]>
        }
      >
    >


  export type CategoriaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    Producto?: boolean | Categoria$ProductoArgs<ExtArgs>
    _count?: boolean | CategoriaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categoria"]>

  export type CategoriaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
  }, ExtArgs["result"]["categoria"]>

  export type CategoriaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
  }, ExtArgs["result"]["categoria"]>

  export type CategoriaSelectScalar = {
    id?: boolean
    nombre?: boolean
  }

  export type CategoriaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre", ExtArgs["result"]["categoria"]>
  export type CategoriaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | Categoria$ProductoArgs<ExtArgs>
    _count?: boolean | CategoriaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoriaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CategoriaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CategoriaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Categoria"
    objects: {
      Producto: Prisma.$ProductoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
    }, ExtArgs["result"]["categoria"]>
    composites: {}
  }

  type CategoriaGetPayload<S extends boolean | null | undefined | CategoriaDefaultArgs> = $Result.GetResult<Prisma.$CategoriaPayload, S>

  type CategoriaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoriaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoriaCountAggregateInputType | true
    }

  export interface CategoriaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Categoria'], meta: { name: 'Categoria' } }
    /**
     * Find zero or one Categoria that matches the filter.
     * @param {CategoriaFindUniqueArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoriaFindUniqueArgs>(args: SelectSubset<T, CategoriaFindUniqueArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Categoria that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoriaFindUniqueOrThrowArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoriaFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoriaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Categoria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFindFirstArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoriaFindFirstArgs>(args?: SelectSubset<T, CategoriaFindFirstArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Categoria that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFindFirstOrThrowArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoriaFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoriaFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categorias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categorias
     * const categorias = await prisma.categoria.findMany()
     * 
     * // Get first 10 Categorias
     * const categorias = await prisma.categoria.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoriaWithIdOnly = await prisma.categoria.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoriaFindManyArgs>(args?: SelectSubset<T, CategoriaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Categoria.
     * @param {CategoriaCreateArgs} args - Arguments to create a Categoria.
     * @example
     * // Create one Categoria
     * const Categoria = await prisma.categoria.create({
     *   data: {
     *     // ... data to create a Categoria
     *   }
     * })
     * 
     */
    create<T extends CategoriaCreateArgs>(args: SelectSubset<T, CategoriaCreateArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categorias.
     * @param {CategoriaCreateManyArgs} args - Arguments to create many Categorias.
     * @example
     * // Create many Categorias
     * const categoria = await prisma.categoria.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoriaCreateManyArgs>(args?: SelectSubset<T, CategoriaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categorias and returns the data saved in the database.
     * @param {CategoriaCreateManyAndReturnArgs} args - Arguments to create many Categorias.
     * @example
     * // Create many Categorias
     * const categoria = await prisma.categoria.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categorias and only return the `id`
     * const categoriaWithIdOnly = await prisma.categoria.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoriaCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoriaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Categoria.
     * @param {CategoriaDeleteArgs} args - Arguments to delete one Categoria.
     * @example
     * // Delete one Categoria
     * const Categoria = await prisma.categoria.delete({
     *   where: {
     *     // ... filter to delete one Categoria
     *   }
     * })
     * 
     */
    delete<T extends CategoriaDeleteArgs>(args: SelectSubset<T, CategoriaDeleteArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Categoria.
     * @param {CategoriaUpdateArgs} args - Arguments to update one Categoria.
     * @example
     * // Update one Categoria
     * const categoria = await prisma.categoria.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoriaUpdateArgs>(args: SelectSubset<T, CategoriaUpdateArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categorias.
     * @param {CategoriaDeleteManyArgs} args - Arguments to filter Categorias to delete.
     * @example
     * // Delete a few Categorias
     * const { count } = await prisma.categoria.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoriaDeleteManyArgs>(args?: SelectSubset<T, CategoriaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categorias
     * const categoria = await prisma.categoria.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoriaUpdateManyArgs>(args: SelectSubset<T, CategoriaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categorias and returns the data updated in the database.
     * @param {CategoriaUpdateManyAndReturnArgs} args - Arguments to update many Categorias.
     * @example
     * // Update many Categorias
     * const categoria = await prisma.categoria.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categorias and only return the `id`
     * const categoriaWithIdOnly = await prisma.categoria.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoriaUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoriaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Categoria.
     * @param {CategoriaUpsertArgs} args - Arguments to update or create a Categoria.
     * @example
     * // Update or create a Categoria
     * const categoria = await prisma.categoria.upsert({
     *   create: {
     *     // ... data to create a Categoria
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Categoria we want to update
     *   }
     * })
     */
    upsert<T extends CategoriaUpsertArgs>(args: SelectSubset<T, CategoriaUpsertArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaCountArgs} args - Arguments to filter Categorias to count.
     * @example
     * // Count the number of Categorias
     * const count = await prisma.categoria.count({
     *   where: {
     *     // ... the filter for the Categorias we want to count
     *   }
     * })
    **/
    count<T extends CategoriaCountArgs>(
      args?: Subset<T, CategoriaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoriaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Categoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoriaAggregateArgs>(args: Subset<T, CategoriaAggregateArgs>): Prisma.PrismaPromise<GetCategoriaAggregateType<T>>

    /**
     * Group by Categoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoriaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoriaGroupByArgs['orderBy'] }
        : { orderBy?: CategoriaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoriaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoriaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Categoria model
   */
  readonly fields: CategoriaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Categoria.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoriaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Producto<T extends Categoria$ProductoArgs<ExtArgs> = {}>(args?: Subset<T, Categoria$ProductoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Categoria model
   */
  interface CategoriaFieldRefs {
    readonly id: FieldRef<"Categoria", 'Int'>
    readonly nombre: FieldRef<"Categoria", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Categoria findUnique
   */
  export type CategoriaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter, which Categoria to fetch.
     */
    where: CategoriaWhereUniqueInput
  }

  /**
   * Categoria findUniqueOrThrow
   */
  export type CategoriaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter, which Categoria to fetch.
     */
    where: CategoriaWhereUniqueInput
  }

  /**
   * Categoria findFirst
   */
  export type CategoriaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter, which Categoria to fetch.
     */
    where?: CategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categorias to fetch.
     */
    orderBy?: CategoriaOrderByWithRelationInput | CategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categorias.
     */
    cursor?: CategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categorias.
     */
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[]
  }

  /**
   * Categoria findFirstOrThrow
   */
  export type CategoriaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter, which Categoria to fetch.
     */
    where?: CategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categorias to fetch.
     */
    orderBy?: CategoriaOrderByWithRelationInput | CategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categorias.
     */
    cursor?: CategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categorias.
     */
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[]
  }

  /**
   * Categoria findMany
   */
  export type CategoriaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter, which Categorias to fetch.
     */
    where?: CategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categorias to fetch.
     */
    orderBy?: CategoriaOrderByWithRelationInput | CategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categorias.
     */
    cursor?: CategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categorias.
     */
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[]
  }

  /**
   * Categoria create
   */
  export type CategoriaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * The data needed to create a Categoria.
     */
    data: XOR<CategoriaCreateInput, CategoriaUncheckedCreateInput>
  }

  /**
   * Categoria createMany
   */
  export type CategoriaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categorias.
     */
    data: CategoriaCreateManyInput | CategoriaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Categoria createManyAndReturn
   */
  export type CategoriaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * The data used to create many Categorias.
     */
    data: CategoriaCreateManyInput | CategoriaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Categoria update
   */
  export type CategoriaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * The data needed to update a Categoria.
     */
    data: XOR<CategoriaUpdateInput, CategoriaUncheckedUpdateInput>
    /**
     * Choose, which Categoria to update.
     */
    where: CategoriaWhereUniqueInput
  }

  /**
   * Categoria updateMany
   */
  export type CategoriaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categorias.
     */
    data: XOR<CategoriaUpdateManyMutationInput, CategoriaUncheckedUpdateManyInput>
    /**
     * Filter which Categorias to update
     */
    where?: CategoriaWhereInput
    /**
     * Limit how many Categorias to update.
     */
    limit?: number
  }

  /**
   * Categoria updateManyAndReturn
   */
  export type CategoriaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * The data used to update Categorias.
     */
    data: XOR<CategoriaUpdateManyMutationInput, CategoriaUncheckedUpdateManyInput>
    /**
     * Filter which Categorias to update
     */
    where?: CategoriaWhereInput
    /**
     * Limit how many Categorias to update.
     */
    limit?: number
  }

  /**
   * Categoria upsert
   */
  export type CategoriaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * The filter to search for the Categoria to update in case it exists.
     */
    where: CategoriaWhereUniqueInput
    /**
     * In case the Categoria found by the `where` argument doesn't exist, create a new Categoria with this data.
     */
    create: XOR<CategoriaCreateInput, CategoriaUncheckedCreateInput>
    /**
     * In case the Categoria was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoriaUpdateInput, CategoriaUncheckedUpdateInput>
  }

  /**
   * Categoria delete
   */
  export type CategoriaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter which Categoria to delete.
     */
    where: CategoriaWhereUniqueInput
  }

  /**
   * Categoria deleteMany
   */
  export type CategoriaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categorias to delete
     */
    where?: CategoriaWhereInput
    /**
     * Limit how many Categorias to delete.
     */
    limit?: number
  }

  /**
   * Categoria.Producto
   */
  export type Categoria$ProductoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    where?: ProductoWhereInput
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    cursor?: ProductoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductoScalarFieldEnum | ProductoScalarFieldEnum[]
  }

  /**
   * Categoria without action
   */
  export type CategoriaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
  }


  /**
   * Model Producto
   */

  export type AggregateProducto = {
    _count: ProductoCountAggregateOutputType | null
    _avg: ProductoAvgAggregateOutputType | null
    _sum: ProductoSumAggregateOutputType | null
    _min: ProductoMinAggregateOutputType | null
    _max: ProductoMaxAggregateOutputType | null
  }

  export type ProductoAvgAggregateOutputType = {
    id: number | null
    stock: number | null
    precio: number | null
    minStock: number | null
    categoriaId: number | null
    stockReservado: number | null
    precioUsd: number | null
    precioSugerido: number | null
    stockInicial: number | null
  }

  export type ProductoSumAggregateOutputType = {
    id: number | null
    stock: number | null
    precio: number | null
    minStock: number | null
    categoriaId: number | null
    stockReservado: number | null
    precioUsd: number | null
    precioSugerido: number | null
    stockInicial: number | null
  }

  export type ProductoMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    descripcion: string | null
    stock: number | null
    ubicacion: string | null
    createdAt: Date | null
    precio: number | null
    minStock: number | null
    activo: boolean | null
    criticidad: string | null
    imagen: string | null
    categoriaId: number | null
    stockReservado: number | null
    sku: string | null
    disponibilidad: string | null
    formato: string | null
    cantidadCaja: string | null
    precioUsd: number | null
    precioSugerido: number | null
    stockInicial: number | null
  }

  export type ProductoMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    descripcion: string | null
    stock: number | null
    ubicacion: string | null
    createdAt: Date | null
    precio: number | null
    minStock: number | null
    activo: boolean | null
    criticidad: string | null
    imagen: string | null
    categoriaId: number | null
    stockReservado: number | null
    sku: string | null
    disponibilidad: string | null
    formato: string | null
    cantidadCaja: string | null
    precioUsd: number | null
    precioSugerido: number | null
    stockInicial: number | null
  }

  export type ProductoCountAggregateOutputType = {
    id: number
    nombre: number
    descripcion: number
    stock: number
    ubicacion: number
    createdAt: number
    precio: number
    minStock: number
    activo: number
    criticidad: number
    imagen: number
    categoriaId: number
    stockReservado: number
    sku: number
    disponibilidad: number
    formato: number
    cantidadCaja: number
    precioUsd: number
    precioSugerido: number
    stockInicial: number
    _all: number
  }


  export type ProductoAvgAggregateInputType = {
    id?: true
    stock?: true
    precio?: true
    minStock?: true
    categoriaId?: true
    stockReservado?: true
    precioUsd?: true
    precioSugerido?: true
    stockInicial?: true
  }

  export type ProductoSumAggregateInputType = {
    id?: true
    stock?: true
    precio?: true
    minStock?: true
    categoriaId?: true
    stockReservado?: true
    precioUsd?: true
    precioSugerido?: true
    stockInicial?: true
  }

  export type ProductoMinAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    stock?: true
    ubicacion?: true
    createdAt?: true
    precio?: true
    minStock?: true
    activo?: true
    criticidad?: true
    imagen?: true
    categoriaId?: true
    stockReservado?: true
    sku?: true
    disponibilidad?: true
    formato?: true
    cantidadCaja?: true
    precioUsd?: true
    precioSugerido?: true
    stockInicial?: true
  }

  export type ProductoMaxAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    stock?: true
    ubicacion?: true
    createdAt?: true
    precio?: true
    minStock?: true
    activo?: true
    criticidad?: true
    imagen?: true
    categoriaId?: true
    stockReservado?: true
    sku?: true
    disponibilidad?: true
    formato?: true
    cantidadCaja?: true
    precioUsd?: true
    precioSugerido?: true
    stockInicial?: true
  }

  export type ProductoCountAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    stock?: true
    ubicacion?: true
    createdAt?: true
    precio?: true
    minStock?: true
    activo?: true
    criticidad?: true
    imagen?: true
    categoriaId?: true
    stockReservado?: true
    sku?: true
    disponibilidad?: true
    formato?: true
    cantidadCaja?: true
    precioUsd?: true
    precioSugerido?: true
    stockInicial?: true
    _all?: true
  }

  export type ProductoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Producto to aggregate.
     */
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     */
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Productos
    **/
    _count?: true | ProductoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductoMaxAggregateInputType
  }

  export type GetProductoAggregateType<T extends ProductoAggregateArgs> = {
        [P in keyof T & keyof AggregateProducto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProducto[P]>
      : GetScalarType<T[P], AggregateProducto[P]>
  }




  export type ProductoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductoWhereInput
    orderBy?: ProductoOrderByWithAggregationInput | ProductoOrderByWithAggregationInput[]
    by: ProductoScalarFieldEnum[] | ProductoScalarFieldEnum
    having?: ProductoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductoCountAggregateInputType | true
    _avg?: ProductoAvgAggregateInputType
    _sum?: ProductoSumAggregateInputType
    _min?: ProductoMinAggregateInputType
    _max?: ProductoMaxAggregateInputType
  }

  export type ProductoGroupByOutputType = {
    id: number
    nombre: string
    descripcion: string | null
    stock: number
    ubicacion: string | null
    createdAt: Date
    precio: number
    minStock: number
    activo: boolean
    criticidad: string
    imagen: string | null
    categoriaId: number
    stockReservado: number
    sku: string | null
    disponibilidad: string | null
    formato: string | null
    cantidadCaja: string | null
    precioUsd: number | null
    precioSugerido: number | null
    stockInicial: number | null
    _count: ProductoCountAggregateOutputType | null
    _avg: ProductoAvgAggregateOutputType | null
    _sum: ProductoSumAggregateOutputType | null
    _min: ProductoMinAggregateOutputType | null
    _max: ProductoMaxAggregateOutputType | null
  }

  type GetProductoGroupByPayload<T extends ProductoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductoGroupByOutputType[P]>
            : GetScalarType<T[P], ProductoGroupByOutputType[P]>
        }
      >
    >


  export type ProductoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    stock?: boolean
    ubicacion?: boolean
    createdAt?: boolean
    precio?: boolean
    minStock?: boolean
    activo?: boolean
    criticidad?: boolean
    imagen?: boolean
    categoriaId?: boolean
    stockReservado?: boolean
    sku?: boolean
    disponibilidad?: boolean
    formato?: boolean
    cantidadCaja?: boolean
    precioUsd?: boolean
    precioSugerido?: boolean
    stockInicial?: boolean
    Categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
    CotizacionTragerDetalle?: boolean | Producto$CotizacionTragerDetalleArgs<ExtArgs>
    _count?: boolean | ProductoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["producto"]>

  export type ProductoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    stock?: boolean
    ubicacion?: boolean
    createdAt?: boolean
    precio?: boolean
    minStock?: boolean
    activo?: boolean
    criticidad?: boolean
    imagen?: boolean
    categoriaId?: boolean
    stockReservado?: boolean
    sku?: boolean
    disponibilidad?: boolean
    formato?: boolean
    cantidadCaja?: boolean
    precioUsd?: boolean
    precioSugerido?: boolean
    stockInicial?: boolean
    Categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["producto"]>

  export type ProductoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    stock?: boolean
    ubicacion?: boolean
    createdAt?: boolean
    precio?: boolean
    minStock?: boolean
    activo?: boolean
    criticidad?: boolean
    imagen?: boolean
    categoriaId?: boolean
    stockReservado?: boolean
    sku?: boolean
    disponibilidad?: boolean
    formato?: boolean
    cantidadCaja?: boolean
    precioUsd?: boolean
    precioSugerido?: boolean
    stockInicial?: boolean
    Categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["producto"]>

  export type ProductoSelectScalar = {
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    stock?: boolean
    ubicacion?: boolean
    createdAt?: boolean
    precio?: boolean
    minStock?: boolean
    activo?: boolean
    criticidad?: boolean
    imagen?: boolean
    categoriaId?: boolean
    stockReservado?: boolean
    sku?: boolean
    disponibilidad?: boolean
    formato?: boolean
    cantidadCaja?: boolean
    precioUsd?: boolean
    precioSugerido?: boolean
    stockInicial?: boolean
  }

  export type ProductoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "descripcion" | "stock" | "ubicacion" | "createdAt" | "precio" | "minStock" | "activo" | "criticidad" | "imagen" | "categoriaId" | "stockReservado" | "sku" | "disponibilidad" | "formato" | "cantidadCaja" | "precioUsd" | "precioSugerido" | "stockInicial", ExtArgs["result"]["producto"]>
  export type ProductoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
    CotizacionTragerDetalle?: boolean | Producto$CotizacionTragerDetalleArgs<ExtArgs>
    _count?: boolean | ProductoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
  }
  export type ProductoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
  }

  export type $ProductoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Producto"
    objects: {
      Categoria: Prisma.$CategoriaPayload<ExtArgs>
      CotizacionTragerDetalle: Prisma.$CotizacionTragerDetallePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      descripcion: string | null
      stock: number
      ubicacion: string | null
      createdAt: Date
      precio: number
      minStock: number
      activo: boolean
      criticidad: string
      imagen: string | null
      categoriaId: number
      stockReservado: number
      sku: string | null
      disponibilidad: string | null
      formato: string | null
      cantidadCaja: string | null
      precioUsd: number | null
      precioSugerido: number | null
      stockInicial: number | null
    }, ExtArgs["result"]["producto"]>
    composites: {}
  }

  type ProductoGetPayload<S extends boolean | null | undefined | ProductoDefaultArgs> = $Result.GetResult<Prisma.$ProductoPayload, S>

  type ProductoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductoCountAggregateInputType | true
    }

  export interface ProductoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Producto'], meta: { name: 'Producto' } }
    /**
     * Find zero or one Producto that matches the filter.
     * @param {ProductoFindUniqueArgs} args - Arguments to find a Producto
     * @example
     * // Get one Producto
     * const producto = await prisma.producto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductoFindUniqueArgs>(args: SelectSubset<T, ProductoFindUniqueArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Producto that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductoFindUniqueOrThrowArgs} args - Arguments to find a Producto
     * @example
     * // Get one Producto
     * const producto = await prisma.producto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductoFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Producto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoFindFirstArgs} args - Arguments to find a Producto
     * @example
     * // Get one Producto
     * const producto = await prisma.producto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductoFindFirstArgs>(args?: SelectSubset<T, ProductoFindFirstArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Producto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoFindFirstOrThrowArgs} args - Arguments to find a Producto
     * @example
     * // Get one Producto
     * const producto = await prisma.producto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductoFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Productos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Productos
     * const productos = await prisma.producto.findMany()
     * 
     * // Get first 10 Productos
     * const productos = await prisma.producto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productoWithIdOnly = await prisma.producto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductoFindManyArgs>(args?: SelectSubset<T, ProductoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Producto.
     * @param {ProductoCreateArgs} args - Arguments to create a Producto.
     * @example
     * // Create one Producto
     * const Producto = await prisma.producto.create({
     *   data: {
     *     // ... data to create a Producto
     *   }
     * })
     * 
     */
    create<T extends ProductoCreateArgs>(args: SelectSubset<T, ProductoCreateArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Productos.
     * @param {ProductoCreateManyArgs} args - Arguments to create many Productos.
     * @example
     * // Create many Productos
     * const producto = await prisma.producto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductoCreateManyArgs>(args?: SelectSubset<T, ProductoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Productos and returns the data saved in the database.
     * @param {ProductoCreateManyAndReturnArgs} args - Arguments to create many Productos.
     * @example
     * // Create many Productos
     * const producto = await prisma.producto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Productos and only return the `id`
     * const productoWithIdOnly = await prisma.producto.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductoCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Producto.
     * @param {ProductoDeleteArgs} args - Arguments to delete one Producto.
     * @example
     * // Delete one Producto
     * const Producto = await prisma.producto.delete({
     *   where: {
     *     // ... filter to delete one Producto
     *   }
     * })
     * 
     */
    delete<T extends ProductoDeleteArgs>(args: SelectSubset<T, ProductoDeleteArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Producto.
     * @param {ProductoUpdateArgs} args - Arguments to update one Producto.
     * @example
     * // Update one Producto
     * const producto = await prisma.producto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductoUpdateArgs>(args: SelectSubset<T, ProductoUpdateArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Productos.
     * @param {ProductoDeleteManyArgs} args - Arguments to filter Productos to delete.
     * @example
     * // Delete a few Productos
     * const { count } = await prisma.producto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductoDeleteManyArgs>(args?: SelectSubset<T, ProductoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Productos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Productos
     * const producto = await prisma.producto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductoUpdateManyArgs>(args: SelectSubset<T, ProductoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Productos and returns the data updated in the database.
     * @param {ProductoUpdateManyAndReturnArgs} args - Arguments to update many Productos.
     * @example
     * // Update many Productos
     * const producto = await prisma.producto.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Productos and only return the `id`
     * const productoWithIdOnly = await prisma.producto.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductoUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Producto.
     * @param {ProductoUpsertArgs} args - Arguments to update or create a Producto.
     * @example
     * // Update or create a Producto
     * const producto = await prisma.producto.upsert({
     *   create: {
     *     // ... data to create a Producto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Producto we want to update
     *   }
     * })
     */
    upsert<T extends ProductoUpsertArgs>(args: SelectSubset<T, ProductoUpsertArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Productos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoCountArgs} args - Arguments to filter Productos to count.
     * @example
     * // Count the number of Productos
     * const count = await prisma.producto.count({
     *   where: {
     *     // ... the filter for the Productos we want to count
     *   }
     * })
    **/
    count<T extends ProductoCountArgs>(
      args?: Subset<T, ProductoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Producto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductoAggregateArgs>(args: Subset<T, ProductoAggregateArgs>): Prisma.PrismaPromise<GetProductoAggregateType<T>>

    /**
     * Group by Producto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductoGroupByArgs['orderBy'] }
        : { orderBy?: ProductoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Producto model
   */
  readonly fields: ProductoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Producto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Categoria<T extends CategoriaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoriaDefaultArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    CotizacionTragerDetalle<T extends Producto$CotizacionTragerDetalleArgs<ExtArgs> = {}>(args?: Subset<T, Producto$CotizacionTragerDetalleArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Producto model
   */
  interface ProductoFieldRefs {
    readonly id: FieldRef<"Producto", 'Int'>
    readonly nombre: FieldRef<"Producto", 'String'>
    readonly descripcion: FieldRef<"Producto", 'String'>
    readonly stock: FieldRef<"Producto", 'Int'>
    readonly ubicacion: FieldRef<"Producto", 'String'>
    readonly createdAt: FieldRef<"Producto", 'DateTime'>
    readonly precio: FieldRef<"Producto", 'Float'>
    readonly minStock: FieldRef<"Producto", 'Int'>
    readonly activo: FieldRef<"Producto", 'Boolean'>
    readonly criticidad: FieldRef<"Producto", 'String'>
    readonly imagen: FieldRef<"Producto", 'String'>
    readonly categoriaId: FieldRef<"Producto", 'Int'>
    readonly stockReservado: FieldRef<"Producto", 'Int'>
    readonly sku: FieldRef<"Producto", 'String'>
    readonly disponibilidad: FieldRef<"Producto", 'String'>
    readonly formato: FieldRef<"Producto", 'String'>
    readonly cantidadCaja: FieldRef<"Producto", 'String'>
    readonly precioUsd: FieldRef<"Producto", 'Float'>
    readonly precioSugerido: FieldRef<"Producto", 'Float'>
    readonly stockInicial: FieldRef<"Producto", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Producto findUnique
   */
  export type ProductoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter, which Producto to fetch.
     */
    where: ProductoWhereUniqueInput
  }

  /**
   * Producto findUniqueOrThrow
   */
  export type ProductoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter, which Producto to fetch.
     */
    where: ProductoWhereUniqueInput
  }

  /**
   * Producto findFirst
   */
  export type ProductoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter, which Producto to fetch.
     */
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     */
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Productos.
     */
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Productos.
     */
    distinct?: ProductoScalarFieldEnum | ProductoScalarFieldEnum[]
  }

  /**
   * Producto findFirstOrThrow
   */
  export type ProductoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter, which Producto to fetch.
     */
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     */
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Productos.
     */
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Productos.
     */
    distinct?: ProductoScalarFieldEnum | ProductoScalarFieldEnum[]
  }

  /**
   * Producto findMany
   */
  export type ProductoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter, which Productos to fetch.
     */
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     */
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Productos.
     */
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Productos.
     */
    distinct?: ProductoScalarFieldEnum | ProductoScalarFieldEnum[]
  }

  /**
   * Producto create
   */
  export type ProductoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * The data needed to create a Producto.
     */
    data: XOR<ProductoCreateInput, ProductoUncheckedCreateInput>
  }

  /**
   * Producto createMany
   */
  export type ProductoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Productos.
     */
    data: ProductoCreateManyInput | ProductoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Producto createManyAndReturn
   */
  export type ProductoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * The data used to create many Productos.
     */
    data: ProductoCreateManyInput | ProductoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Producto update
   */
  export type ProductoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * The data needed to update a Producto.
     */
    data: XOR<ProductoUpdateInput, ProductoUncheckedUpdateInput>
    /**
     * Choose, which Producto to update.
     */
    where: ProductoWhereUniqueInput
  }

  /**
   * Producto updateMany
   */
  export type ProductoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Productos.
     */
    data: XOR<ProductoUpdateManyMutationInput, ProductoUncheckedUpdateManyInput>
    /**
     * Filter which Productos to update
     */
    where?: ProductoWhereInput
    /**
     * Limit how many Productos to update.
     */
    limit?: number
  }

  /**
   * Producto updateManyAndReturn
   */
  export type ProductoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * The data used to update Productos.
     */
    data: XOR<ProductoUpdateManyMutationInput, ProductoUncheckedUpdateManyInput>
    /**
     * Filter which Productos to update
     */
    where?: ProductoWhereInput
    /**
     * Limit how many Productos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Producto upsert
   */
  export type ProductoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * The filter to search for the Producto to update in case it exists.
     */
    where: ProductoWhereUniqueInput
    /**
     * In case the Producto found by the `where` argument doesn't exist, create a new Producto with this data.
     */
    create: XOR<ProductoCreateInput, ProductoUncheckedCreateInput>
    /**
     * In case the Producto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductoUpdateInput, ProductoUncheckedUpdateInput>
  }

  /**
   * Producto delete
   */
  export type ProductoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter which Producto to delete.
     */
    where: ProductoWhereUniqueInput
  }

  /**
   * Producto deleteMany
   */
  export type ProductoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Productos to delete
     */
    where?: ProductoWhereInput
    /**
     * Limit how many Productos to delete.
     */
    limit?: number
  }

  /**
   * Producto.CotizacionTragerDetalle
   */
  export type Producto$CotizacionTragerDetalleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    where?: CotizacionTragerDetalleWhereInput
    orderBy?: CotizacionTragerDetalleOrderByWithRelationInput | CotizacionTragerDetalleOrderByWithRelationInput[]
    cursor?: CotizacionTragerDetalleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CotizacionTragerDetalleScalarFieldEnum | CotizacionTragerDetalleScalarFieldEnum[]
  }

  /**
   * Producto without action
   */
  export type ProductoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
  }


  /**
   * Model CotizacionTrager
   */

  export type AggregateCotizacionTrager = {
    _count: CotizacionTragerCountAggregateOutputType | null
    _avg: CotizacionTragerAvgAggregateOutputType | null
    _sum: CotizacionTragerSumAggregateOutputType | null
    _min: CotizacionTragerMinAggregateOutputType | null
    _max: CotizacionTragerMaxAggregateOutputType | null
  }

  export type CotizacionTragerAvgAggregateOutputType = {
    id: number | null
    subtotal: number | null
    descuento: number | null
    impuesto: number | null
    total: number | null
  }

  export type CotizacionTragerSumAggregateOutputType = {
    id: number | null
    subtotal: number | null
    descuento: number | null
    impuesto: number | null
    total: number | null
  }

  export type CotizacionTragerMinAggregateOutputType = {
    id: number | null
    cliente: string | null
    contacto: string | null
    tipoCliente: string | null
    responsable: string | null
    estado: string | null
    subtotal: number | null
    descuento: number | null
    impuesto: number | null
    total: number | null
    fechaCotizacion: Date | null
    fechaVencimiento: Date | null
    fechaEnvio: Date | null
    fechaSeguimiento: Date | null
    fechaCierre: Date | null
    observaciones: string | null
    createdAt: Date | null
    updatedAt: Date | null
    numero: string | null
  }

  export type CotizacionTragerMaxAggregateOutputType = {
    id: number | null
    cliente: string | null
    contacto: string | null
    tipoCliente: string | null
    responsable: string | null
    estado: string | null
    subtotal: number | null
    descuento: number | null
    impuesto: number | null
    total: number | null
    fechaCotizacion: Date | null
    fechaVencimiento: Date | null
    fechaEnvio: Date | null
    fechaSeguimiento: Date | null
    fechaCierre: Date | null
    observaciones: string | null
    createdAt: Date | null
    updatedAt: Date | null
    numero: string | null
  }

  export type CotizacionTragerCountAggregateOutputType = {
    id: number
    cliente: number
    contacto: number
    tipoCliente: number
    responsable: number
    estado: number
    subtotal: number
    descuento: number
    impuesto: number
    total: number
    fechaCotizacion: number
    fechaVencimiento: number
    fechaEnvio: number
    fechaSeguimiento: number
    fechaCierre: number
    observaciones: number
    createdAt: number
    updatedAt: number
    numero: number
    _all: number
  }


  export type CotizacionTragerAvgAggregateInputType = {
    id?: true
    subtotal?: true
    descuento?: true
    impuesto?: true
    total?: true
  }

  export type CotizacionTragerSumAggregateInputType = {
    id?: true
    subtotal?: true
    descuento?: true
    impuesto?: true
    total?: true
  }

  export type CotizacionTragerMinAggregateInputType = {
    id?: true
    cliente?: true
    contacto?: true
    tipoCliente?: true
    responsable?: true
    estado?: true
    subtotal?: true
    descuento?: true
    impuesto?: true
    total?: true
    fechaCotizacion?: true
    fechaVencimiento?: true
    fechaEnvio?: true
    fechaSeguimiento?: true
    fechaCierre?: true
    observaciones?: true
    createdAt?: true
    updatedAt?: true
    numero?: true
  }

  export type CotizacionTragerMaxAggregateInputType = {
    id?: true
    cliente?: true
    contacto?: true
    tipoCliente?: true
    responsable?: true
    estado?: true
    subtotal?: true
    descuento?: true
    impuesto?: true
    total?: true
    fechaCotizacion?: true
    fechaVencimiento?: true
    fechaEnvio?: true
    fechaSeguimiento?: true
    fechaCierre?: true
    observaciones?: true
    createdAt?: true
    updatedAt?: true
    numero?: true
  }

  export type CotizacionTragerCountAggregateInputType = {
    id?: true
    cliente?: true
    contacto?: true
    tipoCliente?: true
    responsable?: true
    estado?: true
    subtotal?: true
    descuento?: true
    impuesto?: true
    total?: true
    fechaCotizacion?: true
    fechaVencimiento?: true
    fechaEnvio?: true
    fechaSeguimiento?: true
    fechaCierre?: true
    observaciones?: true
    createdAt?: true
    updatedAt?: true
    numero?: true
    _all?: true
  }

  export type CotizacionTragerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CotizacionTrager to aggregate.
     */
    where?: CotizacionTragerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionTragers to fetch.
     */
    orderBy?: CotizacionTragerOrderByWithRelationInput | CotizacionTragerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CotizacionTragerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionTragers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionTragers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CotizacionTragers
    **/
    _count?: true | CotizacionTragerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CotizacionTragerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CotizacionTragerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CotizacionTragerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CotizacionTragerMaxAggregateInputType
  }

  export type GetCotizacionTragerAggregateType<T extends CotizacionTragerAggregateArgs> = {
        [P in keyof T & keyof AggregateCotizacionTrager]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCotizacionTrager[P]>
      : GetScalarType<T[P], AggregateCotizacionTrager[P]>
  }




  export type CotizacionTragerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CotizacionTragerWhereInput
    orderBy?: CotizacionTragerOrderByWithAggregationInput | CotizacionTragerOrderByWithAggregationInput[]
    by: CotizacionTragerScalarFieldEnum[] | CotizacionTragerScalarFieldEnum
    having?: CotizacionTragerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CotizacionTragerCountAggregateInputType | true
    _avg?: CotizacionTragerAvgAggregateInputType
    _sum?: CotizacionTragerSumAggregateInputType
    _min?: CotizacionTragerMinAggregateInputType
    _max?: CotizacionTragerMaxAggregateInputType
  }

  export type CotizacionTragerGroupByOutputType = {
    id: number
    cliente: string
    contacto: string | null
    tipoCliente: string | null
    responsable: string | null
    estado: string
    subtotal: number
    descuento: number
    impuesto: number
    total: number
    fechaCotizacion: Date
    fechaVencimiento: Date | null
    fechaEnvio: Date | null
    fechaSeguimiento: Date | null
    fechaCierre: Date | null
    observaciones: string | null
    createdAt: Date
    updatedAt: Date
    numero: string | null
    _count: CotizacionTragerCountAggregateOutputType | null
    _avg: CotizacionTragerAvgAggregateOutputType | null
    _sum: CotizacionTragerSumAggregateOutputType | null
    _min: CotizacionTragerMinAggregateOutputType | null
    _max: CotizacionTragerMaxAggregateOutputType | null
  }

  type GetCotizacionTragerGroupByPayload<T extends CotizacionTragerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CotizacionTragerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CotizacionTragerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CotizacionTragerGroupByOutputType[P]>
            : GetScalarType<T[P], CotizacionTragerGroupByOutputType[P]>
        }
      >
    >


  export type CotizacionTragerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cliente?: boolean
    contacto?: boolean
    tipoCliente?: boolean
    responsable?: boolean
    estado?: boolean
    subtotal?: boolean
    descuento?: boolean
    impuesto?: boolean
    total?: boolean
    fechaCotizacion?: boolean
    fechaVencimiento?: boolean
    fechaEnvio?: boolean
    fechaSeguimiento?: boolean
    fechaCierre?: boolean
    observaciones?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    numero?: boolean
    detalles?: boolean | CotizacionTrager$detallesArgs<ExtArgs>
    _count?: boolean | CotizacionTragerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cotizacionTrager"]>

  export type CotizacionTragerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cliente?: boolean
    contacto?: boolean
    tipoCliente?: boolean
    responsable?: boolean
    estado?: boolean
    subtotal?: boolean
    descuento?: boolean
    impuesto?: boolean
    total?: boolean
    fechaCotizacion?: boolean
    fechaVencimiento?: boolean
    fechaEnvio?: boolean
    fechaSeguimiento?: boolean
    fechaCierre?: boolean
    observaciones?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    numero?: boolean
  }, ExtArgs["result"]["cotizacionTrager"]>

  export type CotizacionTragerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cliente?: boolean
    contacto?: boolean
    tipoCliente?: boolean
    responsable?: boolean
    estado?: boolean
    subtotal?: boolean
    descuento?: boolean
    impuesto?: boolean
    total?: boolean
    fechaCotizacion?: boolean
    fechaVencimiento?: boolean
    fechaEnvio?: boolean
    fechaSeguimiento?: boolean
    fechaCierre?: boolean
    observaciones?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    numero?: boolean
  }, ExtArgs["result"]["cotizacionTrager"]>

  export type CotizacionTragerSelectScalar = {
    id?: boolean
    cliente?: boolean
    contacto?: boolean
    tipoCliente?: boolean
    responsable?: boolean
    estado?: boolean
    subtotal?: boolean
    descuento?: boolean
    impuesto?: boolean
    total?: boolean
    fechaCotizacion?: boolean
    fechaVencimiento?: boolean
    fechaEnvio?: boolean
    fechaSeguimiento?: boolean
    fechaCierre?: boolean
    observaciones?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    numero?: boolean
  }

  export type CotizacionTragerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cliente" | "contacto" | "tipoCliente" | "responsable" | "estado" | "subtotal" | "descuento" | "impuesto" | "total" | "fechaCotizacion" | "fechaVencimiento" | "fechaEnvio" | "fechaSeguimiento" | "fechaCierre" | "observaciones" | "createdAt" | "updatedAt" | "numero", ExtArgs["result"]["cotizacionTrager"]>
  export type CotizacionTragerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detalles?: boolean | CotizacionTrager$detallesArgs<ExtArgs>
    _count?: boolean | CotizacionTragerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CotizacionTragerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CotizacionTragerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CotizacionTragerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CotizacionTrager"
    objects: {
      detalles: Prisma.$CotizacionTragerDetallePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cliente: string
      contacto: string | null
      tipoCliente: string | null
      responsable: string | null
      estado: string
      subtotal: number
      descuento: number
      impuesto: number
      total: number
      fechaCotizacion: Date
      fechaVencimiento: Date | null
      fechaEnvio: Date | null
      fechaSeguimiento: Date | null
      fechaCierre: Date | null
      observaciones: string | null
      createdAt: Date
      updatedAt: Date
      numero: string | null
    }, ExtArgs["result"]["cotizacionTrager"]>
    composites: {}
  }

  type CotizacionTragerGetPayload<S extends boolean | null | undefined | CotizacionTragerDefaultArgs> = $Result.GetResult<Prisma.$CotizacionTragerPayload, S>

  type CotizacionTragerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CotizacionTragerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CotizacionTragerCountAggregateInputType | true
    }

  export interface CotizacionTragerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CotizacionTrager'], meta: { name: 'CotizacionTrager' } }
    /**
     * Find zero or one CotizacionTrager that matches the filter.
     * @param {CotizacionTragerFindUniqueArgs} args - Arguments to find a CotizacionTrager
     * @example
     * // Get one CotizacionTrager
     * const cotizacionTrager = await prisma.cotizacionTrager.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CotizacionTragerFindUniqueArgs>(args: SelectSubset<T, CotizacionTragerFindUniqueArgs<ExtArgs>>): Prisma__CotizacionTragerClient<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CotizacionTrager that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CotizacionTragerFindUniqueOrThrowArgs} args - Arguments to find a CotizacionTrager
     * @example
     * // Get one CotizacionTrager
     * const cotizacionTrager = await prisma.cotizacionTrager.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CotizacionTragerFindUniqueOrThrowArgs>(args: SelectSubset<T, CotizacionTragerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CotizacionTragerClient<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CotizacionTrager that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerFindFirstArgs} args - Arguments to find a CotizacionTrager
     * @example
     * // Get one CotizacionTrager
     * const cotizacionTrager = await prisma.cotizacionTrager.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CotizacionTragerFindFirstArgs>(args?: SelectSubset<T, CotizacionTragerFindFirstArgs<ExtArgs>>): Prisma__CotizacionTragerClient<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CotizacionTrager that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerFindFirstOrThrowArgs} args - Arguments to find a CotizacionTrager
     * @example
     * // Get one CotizacionTrager
     * const cotizacionTrager = await prisma.cotizacionTrager.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CotizacionTragerFindFirstOrThrowArgs>(args?: SelectSubset<T, CotizacionTragerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CotizacionTragerClient<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CotizacionTragers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CotizacionTragers
     * const cotizacionTragers = await prisma.cotizacionTrager.findMany()
     * 
     * // Get first 10 CotizacionTragers
     * const cotizacionTragers = await prisma.cotizacionTrager.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cotizacionTragerWithIdOnly = await prisma.cotizacionTrager.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CotizacionTragerFindManyArgs>(args?: SelectSubset<T, CotizacionTragerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CotizacionTrager.
     * @param {CotizacionTragerCreateArgs} args - Arguments to create a CotizacionTrager.
     * @example
     * // Create one CotizacionTrager
     * const CotizacionTrager = await prisma.cotizacionTrager.create({
     *   data: {
     *     // ... data to create a CotizacionTrager
     *   }
     * })
     * 
     */
    create<T extends CotizacionTragerCreateArgs>(args: SelectSubset<T, CotizacionTragerCreateArgs<ExtArgs>>): Prisma__CotizacionTragerClient<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CotizacionTragers.
     * @param {CotizacionTragerCreateManyArgs} args - Arguments to create many CotizacionTragers.
     * @example
     * // Create many CotizacionTragers
     * const cotizacionTrager = await prisma.cotizacionTrager.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CotizacionTragerCreateManyArgs>(args?: SelectSubset<T, CotizacionTragerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CotizacionTragers and returns the data saved in the database.
     * @param {CotizacionTragerCreateManyAndReturnArgs} args - Arguments to create many CotizacionTragers.
     * @example
     * // Create many CotizacionTragers
     * const cotizacionTrager = await prisma.cotizacionTrager.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CotizacionTragers and only return the `id`
     * const cotizacionTragerWithIdOnly = await prisma.cotizacionTrager.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CotizacionTragerCreateManyAndReturnArgs>(args?: SelectSubset<T, CotizacionTragerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CotizacionTrager.
     * @param {CotizacionTragerDeleteArgs} args - Arguments to delete one CotizacionTrager.
     * @example
     * // Delete one CotizacionTrager
     * const CotizacionTrager = await prisma.cotizacionTrager.delete({
     *   where: {
     *     // ... filter to delete one CotizacionTrager
     *   }
     * })
     * 
     */
    delete<T extends CotizacionTragerDeleteArgs>(args: SelectSubset<T, CotizacionTragerDeleteArgs<ExtArgs>>): Prisma__CotizacionTragerClient<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CotizacionTrager.
     * @param {CotizacionTragerUpdateArgs} args - Arguments to update one CotizacionTrager.
     * @example
     * // Update one CotizacionTrager
     * const cotizacionTrager = await prisma.cotizacionTrager.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CotizacionTragerUpdateArgs>(args: SelectSubset<T, CotizacionTragerUpdateArgs<ExtArgs>>): Prisma__CotizacionTragerClient<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CotizacionTragers.
     * @param {CotizacionTragerDeleteManyArgs} args - Arguments to filter CotizacionTragers to delete.
     * @example
     * // Delete a few CotizacionTragers
     * const { count } = await prisma.cotizacionTrager.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CotizacionTragerDeleteManyArgs>(args?: SelectSubset<T, CotizacionTragerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CotizacionTragers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CotizacionTragers
     * const cotizacionTrager = await prisma.cotizacionTrager.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CotizacionTragerUpdateManyArgs>(args: SelectSubset<T, CotizacionTragerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CotizacionTragers and returns the data updated in the database.
     * @param {CotizacionTragerUpdateManyAndReturnArgs} args - Arguments to update many CotizacionTragers.
     * @example
     * // Update many CotizacionTragers
     * const cotizacionTrager = await prisma.cotizacionTrager.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CotizacionTragers and only return the `id`
     * const cotizacionTragerWithIdOnly = await prisma.cotizacionTrager.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CotizacionTragerUpdateManyAndReturnArgs>(args: SelectSubset<T, CotizacionTragerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CotizacionTrager.
     * @param {CotizacionTragerUpsertArgs} args - Arguments to update or create a CotizacionTrager.
     * @example
     * // Update or create a CotizacionTrager
     * const cotizacionTrager = await prisma.cotizacionTrager.upsert({
     *   create: {
     *     // ... data to create a CotizacionTrager
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CotizacionTrager we want to update
     *   }
     * })
     */
    upsert<T extends CotizacionTragerUpsertArgs>(args: SelectSubset<T, CotizacionTragerUpsertArgs<ExtArgs>>): Prisma__CotizacionTragerClient<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CotizacionTragers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerCountArgs} args - Arguments to filter CotizacionTragers to count.
     * @example
     * // Count the number of CotizacionTragers
     * const count = await prisma.cotizacionTrager.count({
     *   where: {
     *     // ... the filter for the CotizacionTragers we want to count
     *   }
     * })
    **/
    count<T extends CotizacionTragerCountArgs>(
      args?: Subset<T, CotizacionTragerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CotizacionTragerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CotizacionTrager.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CotizacionTragerAggregateArgs>(args: Subset<T, CotizacionTragerAggregateArgs>): Prisma.PrismaPromise<GetCotizacionTragerAggregateType<T>>

    /**
     * Group by CotizacionTrager.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CotizacionTragerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CotizacionTragerGroupByArgs['orderBy'] }
        : { orderBy?: CotizacionTragerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CotizacionTragerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCotizacionTragerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CotizacionTrager model
   */
  readonly fields: CotizacionTragerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CotizacionTrager.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CotizacionTragerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    detalles<T extends CotizacionTrager$detallesArgs<ExtArgs> = {}>(args?: Subset<T, CotizacionTrager$detallesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CotizacionTrager model
   */
  interface CotizacionTragerFieldRefs {
    readonly id: FieldRef<"CotizacionTrager", 'Int'>
    readonly cliente: FieldRef<"CotizacionTrager", 'String'>
    readonly contacto: FieldRef<"CotizacionTrager", 'String'>
    readonly tipoCliente: FieldRef<"CotizacionTrager", 'String'>
    readonly responsable: FieldRef<"CotizacionTrager", 'String'>
    readonly estado: FieldRef<"CotizacionTrager", 'String'>
    readonly subtotal: FieldRef<"CotizacionTrager", 'Float'>
    readonly descuento: FieldRef<"CotizacionTrager", 'Float'>
    readonly impuesto: FieldRef<"CotizacionTrager", 'Float'>
    readonly total: FieldRef<"CotizacionTrager", 'Float'>
    readonly fechaCotizacion: FieldRef<"CotizacionTrager", 'DateTime'>
    readonly fechaVencimiento: FieldRef<"CotizacionTrager", 'DateTime'>
    readonly fechaEnvio: FieldRef<"CotizacionTrager", 'DateTime'>
    readonly fechaSeguimiento: FieldRef<"CotizacionTrager", 'DateTime'>
    readonly fechaCierre: FieldRef<"CotizacionTrager", 'DateTime'>
    readonly observaciones: FieldRef<"CotizacionTrager", 'String'>
    readonly createdAt: FieldRef<"CotizacionTrager", 'DateTime'>
    readonly updatedAt: FieldRef<"CotizacionTrager", 'DateTime'>
    readonly numero: FieldRef<"CotizacionTrager", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CotizacionTrager findUnique
   */
  export type CotizacionTragerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionTrager to fetch.
     */
    where: CotizacionTragerWhereUniqueInput
  }

  /**
   * CotizacionTrager findUniqueOrThrow
   */
  export type CotizacionTragerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionTrager to fetch.
     */
    where: CotizacionTragerWhereUniqueInput
  }

  /**
   * CotizacionTrager findFirst
   */
  export type CotizacionTragerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionTrager to fetch.
     */
    where?: CotizacionTragerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionTragers to fetch.
     */
    orderBy?: CotizacionTragerOrderByWithRelationInput | CotizacionTragerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CotizacionTragers.
     */
    cursor?: CotizacionTragerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionTragers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionTragers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CotizacionTragers.
     */
    distinct?: CotizacionTragerScalarFieldEnum | CotizacionTragerScalarFieldEnum[]
  }

  /**
   * CotizacionTrager findFirstOrThrow
   */
  export type CotizacionTragerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionTrager to fetch.
     */
    where?: CotizacionTragerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionTragers to fetch.
     */
    orderBy?: CotizacionTragerOrderByWithRelationInput | CotizacionTragerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CotizacionTragers.
     */
    cursor?: CotizacionTragerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionTragers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionTragers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CotizacionTragers.
     */
    distinct?: CotizacionTragerScalarFieldEnum | CotizacionTragerScalarFieldEnum[]
  }

  /**
   * CotizacionTrager findMany
   */
  export type CotizacionTragerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionTragers to fetch.
     */
    where?: CotizacionTragerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionTragers to fetch.
     */
    orderBy?: CotizacionTragerOrderByWithRelationInput | CotizacionTragerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CotizacionTragers.
     */
    cursor?: CotizacionTragerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionTragers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionTragers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CotizacionTragers.
     */
    distinct?: CotizacionTragerScalarFieldEnum | CotizacionTragerScalarFieldEnum[]
  }

  /**
   * CotizacionTrager create
   */
  export type CotizacionTragerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerInclude<ExtArgs> | null
    /**
     * The data needed to create a CotizacionTrager.
     */
    data: XOR<CotizacionTragerCreateInput, CotizacionTragerUncheckedCreateInput>
  }

  /**
   * CotizacionTrager createMany
   */
  export type CotizacionTragerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CotizacionTragers.
     */
    data: CotizacionTragerCreateManyInput | CotizacionTragerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CotizacionTrager createManyAndReturn
   */
  export type CotizacionTragerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * The data used to create many CotizacionTragers.
     */
    data: CotizacionTragerCreateManyInput | CotizacionTragerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CotizacionTrager update
   */
  export type CotizacionTragerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerInclude<ExtArgs> | null
    /**
     * The data needed to update a CotizacionTrager.
     */
    data: XOR<CotizacionTragerUpdateInput, CotizacionTragerUncheckedUpdateInput>
    /**
     * Choose, which CotizacionTrager to update.
     */
    where: CotizacionTragerWhereUniqueInput
  }

  /**
   * CotizacionTrager updateMany
   */
  export type CotizacionTragerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CotizacionTragers.
     */
    data: XOR<CotizacionTragerUpdateManyMutationInput, CotizacionTragerUncheckedUpdateManyInput>
    /**
     * Filter which CotizacionTragers to update
     */
    where?: CotizacionTragerWhereInput
    /**
     * Limit how many CotizacionTragers to update.
     */
    limit?: number
  }

  /**
   * CotizacionTrager updateManyAndReturn
   */
  export type CotizacionTragerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * The data used to update CotizacionTragers.
     */
    data: XOR<CotizacionTragerUpdateManyMutationInput, CotizacionTragerUncheckedUpdateManyInput>
    /**
     * Filter which CotizacionTragers to update
     */
    where?: CotizacionTragerWhereInput
    /**
     * Limit how many CotizacionTragers to update.
     */
    limit?: number
  }

  /**
   * CotizacionTrager upsert
   */
  export type CotizacionTragerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerInclude<ExtArgs> | null
    /**
     * The filter to search for the CotizacionTrager to update in case it exists.
     */
    where: CotizacionTragerWhereUniqueInput
    /**
     * In case the CotizacionTrager found by the `where` argument doesn't exist, create a new CotizacionTrager with this data.
     */
    create: XOR<CotizacionTragerCreateInput, CotizacionTragerUncheckedCreateInput>
    /**
     * In case the CotizacionTrager was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CotizacionTragerUpdateInput, CotizacionTragerUncheckedUpdateInput>
  }

  /**
   * CotizacionTrager delete
   */
  export type CotizacionTragerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerInclude<ExtArgs> | null
    /**
     * Filter which CotizacionTrager to delete.
     */
    where: CotizacionTragerWhereUniqueInput
  }

  /**
   * CotizacionTrager deleteMany
   */
  export type CotizacionTragerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CotizacionTragers to delete
     */
    where?: CotizacionTragerWhereInput
    /**
     * Limit how many CotizacionTragers to delete.
     */
    limit?: number
  }

  /**
   * CotizacionTrager.detalles
   */
  export type CotizacionTrager$detallesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    where?: CotizacionTragerDetalleWhereInput
    orderBy?: CotizacionTragerDetalleOrderByWithRelationInput | CotizacionTragerDetalleOrderByWithRelationInput[]
    cursor?: CotizacionTragerDetalleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CotizacionTragerDetalleScalarFieldEnum | CotizacionTragerDetalleScalarFieldEnum[]
  }

  /**
   * CotizacionTrager without action
   */
  export type CotizacionTragerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTrager
     */
    select?: CotizacionTragerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTrager
     */
    omit?: CotizacionTragerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerInclude<ExtArgs> | null
  }


  /**
   * Model CotizacionTragerDetalle
   */

  export type AggregateCotizacionTragerDetalle = {
    _count: CotizacionTragerDetalleCountAggregateOutputType | null
    _avg: CotizacionTragerDetalleAvgAggregateOutputType | null
    _sum: CotizacionTragerDetalleSumAggregateOutputType | null
    _min: CotizacionTragerDetalleMinAggregateOutputType | null
    _max: CotizacionTragerDetalleMaxAggregateOutputType | null
  }

  export type CotizacionTragerDetalleAvgAggregateOutputType = {
    id: number | null
    cotizacionId: number | null
    productoId: number | null
    cantidad: number | null
    precioUnitario: number | null
    descuentoPct: number | null
    subtotal: number | null
    stockDisponible: number | null
  }

  export type CotizacionTragerDetalleSumAggregateOutputType = {
    id: number | null
    cotizacionId: number | null
    productoId: number | null
    cantidad: number | null
    precioUnitario: number | null
    descuentoPct: number | null
    subtotal: number | null
    stockDisponible: number | null
  }

  export type CotizacionTragerDetalleMinAggregateOutputType = {
    id: number | null
    cotizacionId: number | null
    productoId: number | null
    cantidad: number | null
    precioUnitario: number | null
    descuentoPct: number | null
    subtotal: number | null
    stockDisponible: number | null
    observacion: string | null
  }

  export type CotizacionTragerDetalleMaxAggregateOutputType = {
    id: number | null
    cotizacionId: number | null
    productoId: number | null
    cantidad: number | null
    precioUnitario: number | null
    descuentoPct: number | null
    subtotal: number | null
    stockDisponible: number | null
    observacion: string | null
  }

  export type CotizacionTragerDetalleCountAggregateOutputType = {
    id: number
    cotizacionId: number
    productoId: number
    cantidad: number
    precioUnitario: number
    descuentoPct: number
    subtotal: number
    stockDisponible: number
    observacion: number
    _all: number
  }


  export type CotizacionTragerDetalleAvgAggregateInputType = {
    id?: true
    cotizacionId?: true
    productoId?: true
    cantidad?: true
    precioUnitario?: true
    descuentoPct?: true
    subtotal?: true
    stockDisponible?: true
  }

  export type CotizacionTragerDetalleSumAggregateInputType = {
    id?: true
    cotizacionId?: true
    productoId?: true
    cantidad?: true
    precioUnitario?: true
    descuentoPct?: true
    subtotal?: true
    stockDisponible?: true
  }

  export type CotizacionTragerDetalleMinAggregateInputType = {
    id?: true
    cotizacionId?: true
    productoId?: true
    cantidad?: true
    precioUnitario?: true
    descuentoPct?: true
    subtotal?: true
    stockDisponible?: true
    observacion?: true
  }

  export type CotizacionTragerDetalleMaxAggregateInputType = {
    id?: true
    cotizacionId?: true
    productoId?: true
    cantidad?: true
    precioUnitario?: true
    descuentoPct?: true
    subtotal?: true
    stockDisponible?: true
    observacion?: true
  }

  export type CotizacionTragerDetalleCountAggregateInputType = {
    id?: true
    cotizacionId?: true
    productoId?: true
    cantidad?: true
    precioUnitario?: true
    descuentoPct?: true
    subtotal?: true
    stockDisponible?: true
    observacion?: true
    _all?: true
  }

  export type CotizacionTragerDetalleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CotizacionTragerDetalle to aggregate.
     */
    where?: CotizacionTragerDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionTragerDetalles to fetch.
     */
    orderBy?: CotizacionTragerDetalleOrderByWithRelationInput | CotizacionTragerDetalleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CotizacionTragerDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionTragerDetalles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionTragerDetalles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CotizacionTragerDetalles
    **/
    _count?: true | CotizacionTragerDetalleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CotizacionTragerDetalleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CotizacionTragerDetalleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CotizacionTragerDetalleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CotizacionTragerDetalleMaxAggregateInputType
  }

  export type GetCotizacionTragerDetalleAggregateType<T extends CotizacionTragerDetalleAggregateArgs> = {
        [P in keyof T & keyof AggregateCotizacionTragerDetalle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCotizacionTragerDetalle[P]>
      : GetScalarType<T[P], AggregateCotizacionTragerDetalle[P]>
  }




  export type CotizacionTragerDetalleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CotizacionTragerDetalleWhereInput
    orderBy?: CotizacionTragerDetalleOrderByWithAggregationInput | CotizacionTragerDetalleOrderByWithAggregationInput[]
    by: CotizacionTragerDetalleScalarFieldEnum[] | CotizacionTragerDetalleScalarFieldEnum
    having?: CotizacionTragerDetalleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CotizacionTragerDetalleCountAggregateInputType | true
    _avg?: CotizacionTragerDetalleAvgAggregateInputType
    _sum?: CotizacionTragerDetalleSumAggregateInputType
    _min?: CotizacionTragerDetalleMinAggregateInputType
    _max?: CotizacionTragerDetalleMaxAggregateInputType
  }

  export type CotizacionTragerDetalleGroupByOutputType = {
    id: number
    cotizacionId: number
    productoId: number
    cantidad: number
    precioUnitario: number
    descuentoPct: number
    subtotal: number
    stockDisponible: number | null
    observacion: string | null
    _count: CotizacionTragerDetalleCountAggregateOutputType | null
    _avg: CotizacionTragerDetalleAvgAggregateOutputType | null
    _sum: CotizacionTragerDetalleSumAggregateOutputType | null
    _min: CotizacionTragerDetalleMinAggregateOutputType | null
    _max: CotizacionTragerDetalleMaxAggregateOutputType | null
  }

  type GetCotizacionTragerDetalleGroupByPayload<T extends CotizacionTragerDetalleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CotizacionTragerDetalleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CotizacionTragerDetalleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CotizacionTragerDetalleGroupByOutputType[P]>
            : GetScalarType<T[P], CotizacionTragerDetalleGroupByOutputType[P]>
        }
      >
    >


  export type CotizacionTragerDetalleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cotizacionId?: boolean
    productoId?: boolean
    cantidad?: boolean
    precioUnitario?: boolean
    descuentoPct?: boolean
    subtotal?: boolean
    stockDisponible?: boolean
    observacion?: boolean
    cotizacion?: boolean | CotizacionTragerDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cotizacionTragerDetalle"]>

  export type CotizacionTragerDetalleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cotizacionId?: boolean
    productoId?: boolean
    cantidad?: boolean
    precioUnitario?: boolean
    descuentoPct?: boolean
    subtotal?: boolean
    stockDisponible?: boolean
    observacion?: boolean
    cotizacion?: boolean | CotizacionTragerDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cotizacionTragerDetalle"]>

  export type CotizacionTragerDetalleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cotizacionId?: boolean
    productoId?: boolean
    cantidad?: boolean
    precioUnitario?: boolean
    descuentoPct?: boolean
    subtotal?: boolean
    stockDisponible?: boolean
    observacion?: boolean
    cotizacion?: boolean | CotizacionTragerDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cotizacionTragerDetalle"]>

  export type CotizacionTragerDetalleSelectScalar = {
    id?: boolean
    cotizacionId?: boolean
    productoId?: boolean
    cantidad?: boolean
    precioUnitario?: boolean
    descuentoPct?: boolean
    subtotal?: boolean
    stockDisponible?: boolean
    observacion?: boolean
  }

  export type CotizacionTragerDetalleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cotizacionId" | "productoId" | "cantidad" | "precioUnitario" | "descuentoPct" | "subtotal" | "stockDisponible" | "observacion", ExtArgs["result"]["cotizacionTragerDetalle"]>
  export type CotizacionTragerDetalleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cotizacion?: boolean | CotizacionTragerDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }
  export type CotizacionTragerDetalleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cotizacion?: boolean | CotizacionTragerDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }
  export type CotizacionTragerDetalleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cotizacion?: boolean | CotizacionTragerDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }

  export type $CotizacionTragerDetallePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CotizacionTragerDetalle"
    objects: {
      cotizacion: Prisma.$CotizacionTragerPayload<ExtArgs>
      producto: Prisma.$ProductoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cotizacionId: number
      productoId: number
      cantidad: number
      precioUnitario: number
      descuentoPct: number
      subtotal: number
      stockDisponible: number | null
      observacion: string | null
    }, ExtArgs["result"]["cotizacionTragerDetalle"]>
    composites: {}
  }

  type CotizacionTragerDetalleGetPayload<S extends boolean | null | undefined | CotizacionTragerDetalleDefaultArgs> = $Result.GetResult<Prisma.$CotizacionTragerDetallePayload, S>

  type CotizacionTragerDetalleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CotizacionTragerDetalleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CotizacionTragerDetalleCountAggregateInputType | true
    }

  export interface CotizacionTragerDetalleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CotizacionTragerDetalle'], meta: { name: 'CotizacionTragerDetalle' } }
    /**
     * Find zero or one CotizacionTragerDetalle that matches the filter.
     * @param {CotizacionTragerDetalleFindUniqueArgs} args - Arguments to find a CotizacionTragerDetalle
     * @example
     * // Get one CotizacionTragerDetalle
     * const cotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CotizacionTragerDetalleFindUniqueArgs>(args: SelectSubset<T, CotizacionTragerDetalleFindUniqueArgs<ExtArgs>>): Prisma__CotizacionTragerDetalleClient<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CotizacionTragerDetalle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CotizacionTragerDetalleFindUniqueOrThrowArgs} args - Arguments to find a CotizacionTragerDetalle
     * @example
     * // Get one CotizacionTragerDetalle
     * const cotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CotizacionTragerDetalleFindUniqueOrThrowArgs>(args: SelectSubset<T, CotizacionTragerDetalleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CotizacionTragerDetalleClient<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CotizacionTragerDetalle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerDetalleFindFirstArgs} args - Arguments to find a CotizacionTragerDetalle
     * @example
     * // Get one CotizacionTragerDetalle
     * const cotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CotizacionTragerDetalleFindFirstArgs>(args?: SelectSubset<T, CotizacionTragerDetalleFindFirstArgs<ExtArgs>>): Prisma__CotizacionTragerDetalleClient<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CotizacionTragerDetalle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerDetalleFindFirstOrThrowArgs} args - Arguments to find a CotizacionTragerDetalle
     * @example
     * // Get one CotizacionTragerDetalle
     * const cotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CotizacionTragerDetalleFindFirstOrThrowArgs>(args?: SelectSubset<T, CotizacionTragerDetalleFindFirstOrThrowArgs<ExtArgs>>): Prisma__CotizacionTragerDetalleClient<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CotizacionTragerDetalles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerDetalleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CotizacionTragerDetalles
     * const cotizacionTragerDetalles = await prisma.cotizacionTragerDetalle.findMany()
     * 
     * // Get first 10 CotizacionTragerDetalles
     * const cotizacionTragerDetalles = await prisma.cotizacionTragerDetalle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cotizacionTragerDetalleWithIdOnly = await prisma.cotizacionTragerDetalle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CotizacionTragerDetalleFindManyArgs>(args?: SelectSubset<T, CotizacionTragerDetalleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CotizacionTragerDetalle.
     * @param {CotizacionTragerDetalleCreateArgs} args - Arguments to create a CotizacionTragerDetalle.
     * @example
     * // Create one CotizacionTragerDetalle
     * const CotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.create({
     *   data: {
     *     // ... data to create a CotizacionTragerDetalle
     *   }
     * })
     * 
     */
    create<T extends CotizacionTragerDetalleCreateArgs>(args: SelectSubset<T, CotizacionTragerDetalleCreateArgs<ExtArgs>>): Prisma__CotizacionTragerDetalleClient<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CotizacionTragerDetalles.
     * @param {CotizacionTragerDetalleCreateManyArgs} args - Arguments to create many CotizacionTragerDetalles.
     * @example
     * // Create many CotizacionTragerDetalles
     * const cotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CotizacionTragerDetalleCreateManyArgs>(args?: SelectSubset<T, CotizacionTragerDetalleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CotizacionTragerDetalles and returns the data saved in the database.
     * @param {CotizacionTragerDetalleCreateManyAndReturnArgs} args - Arguments to create many CotizacionTragerDetalles.
     * @example
     * // Create many CotizacionTragerDetalles
     * const cotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CotizacionTragerDetalles and only return the `id`
     * const cotizacionTragerDetalleWithIdOnly = await prisma.cotizacionTragerDetalle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CotizacionTragerDetalleCreateManyAndReturnArgs>(args?: SelectSubset<T, CotizacionTragerDetalleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CotizacionTragerDetalle.
     * @param {CotizacionTragerDetalleDeleteArgs} args - Arguments to delete one CotizacionTragerDetalle.
     * @example
     * // Delete one CotizacionTragerDetalle
     * const CotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.delete({
     *   where: {
     *     // ... filter to delete one CotizacionTragerDetalle
     *   }
     * })
     * 
     */
    delete<T extends CotizacionTragerDetalleDeleteArgs>(args: SelectSubset<T, CotizacionTragerDetalleDeleteArgs<ExtArgs>>): Prisma__CotizacionTragerDetalleClient<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CotizacionTragerDetalle.
     * @param {CotizacionTragerDetalleUpdateArgs} args - Arguments to update one CotizacionTragerDetalle.
     * @example
     * // Update one CotizacionTragerDetalle
     * const cotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CotizacionTragerDetalleUpdateArgs>(args: SelectSubset<T, CotizacionTragerDetalleUpdateArgs<ExtArgs>>): Prisma__CotizacionTragerDetalleClient<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CotizacionTragerDetalles.
     * @param {CotizacionTragerDetalleDeleteManyArgs} args - Arguments to filter CotizacionTragerDetalles to delete.
     * @example
     * // Delete a few CotizacionTragerDetalles
     * const { count } = await prisma.cotizacionTragerDetalle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CotizacionTragerDetalleDeleteManyArgs>(args?: SelectSubset<T, CotizacionTragerDetalleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CotizacionTragerDetalles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerDetalleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CotizacionTragerDetalles
     * const cotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CotizacionTragerDetalleUpdateManyArgs>(args: SelectSubset<T, CotizacionTragerDetalleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CotizacionTragerDetalles and returns the data updated in the database.
     * @param {CotizacionTragerDetalleUpdateManyAndReturnArgs} args - Arguments to update many CotizacionTragerDetalles.
     * @example
     * // Update many CotizacionTragerDetalles
     * const cotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CotizacionTragerDetalles and only return the `id`
     * const cotizacionTragerDetalleWithIdOnly = await prisma.cotizacionTragerDetalle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CotizacionTragerDetalleUpdateManyAndReturnArgs>(args: SelectSubset<T, CotizacionTragerDetalleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CotizacionTragerDetalle.
     * @param {CotizacionTragerDetalleUpsertArgs} args - Arguments to update or create a CotizacionTragerDetalle.
     * @example
     * // Update or create a CotizacionTragerDetalle
     * const cotizacionTragerDetalle = await prisma.cotizacionTragerDetalle.upsert({
     *   create: {
     *     // ... data to create a CotizacionTragerDetalle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CotizacionTragerDetalle we want to update
     *   }
     * })
     */
    upsert<T extends CotizacionTragerDetalleUpsertArgs>(args: SelectSubset<T, CotizacionTragerDetalleUpsertArgs<ExtArgs>>): Prisma__CotizacionTragerDetalleClient<$Result.GetResult<Prisma.$CotizacionTragerDetallePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CotizacionTragerDetalles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerDetalleCountArgs} args - Arguments to filter CotizacionTragerDetalles to count.
     * @example
     * // Count the number of CotizacionTragerDetalles
     * const count = await prisma.cotizacionTragerDetalle.count({
     *   where: {
     *     // ... the filter for the CotizacionTragerDetalles we want to count
     *   }
     * })
    **/
    count<T extends CotizacionTragerDetalleCountArgs>(
      args?: Subset<T, CotizacionTragerDetalleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CotizacionTragerDetalleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CotizacionTragerDetalle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerDetalleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CotizacionTragerDetalleAggregateArgs>(args: Subset<T, CotizacionTragerDetalleAggregateArgs>): Prisma.PrismaPromise<GetCotizacionTragerDetalleAggregateType<T>>

    /**
     * Group by CotizacionTragerDetalle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CotizacionTragerDetalleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CotizacionTragerDetalleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CotizacionTragerDetalleGroupByArgs['orderBy'] }
        : { orderBy?: CotizacionTragerDetalleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CotizacionTragerDetalleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCotizacionTragerDetalleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CotizacionTragerDetalle model
   */
  readonly fields: CotizacionTragerDetalleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CotizacionTragerDetalle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CotizacionTragerDetalleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cotizacion<T extends CotizacionTragerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CotizacionTragerDefaultArgs<ExtArgs>>): Prisma__CotizacionTragerClient<$Result.GetResult<Prisma.$CotizacionTragerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    producto<T extends ProductoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductoDefaultArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CotizacionTragerDetalle model
   */
  interface CotizacionTragerDetalleFieldRefs {
    readonly id: FieldRef<"CotizacionTragerDetalle", 'Int'>
    readonly cotizacionId: FieldRef<"CotizacionTragerDetalle", 'Int'>
    readonly productoId: FieldRef<"CotizacionTragerDetalle", 'Int'>
    readonly cantidad: FieldRef<"CotizacionTragerDetalle", 'Int'>
    readonly precioUnitario: FieldRef<"CotizacionTragerDetalle", 'Float'>
    readonly descuentoPct: FieldRef<"CotizacionTragerDetalle", 'Float'>
    readonly subtotal: FieldRef<"CotizacionTragerDetalle", 'Float'>
    readonly stockDisponible: FieldRef<"CotizacionTragerDetalle", 'Int'>
    readonly observacion: FieldRef<"CotizacionTragerDetalle", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CotizacionTragerDetalle findUnique
   */
  export type CotizacionTragerDetalleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionTragerDetalle to fetch.
     */
    where: CotizacionTragerDetalleWhereUniqueInput
  }

  /**
   * CotizacionTragerDetalle findUniqueOrThrow
   */
  export type CotizacionTragerDetalleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionTragerDetalle to fetch.
     */
    where: CotizacionTragerDetalleWhereUniqueInput
  }

  /**
   * CotizacionTragerDetalle findFirst
   */
  export type CotizacionTragerDetalleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionTragerDetalle to fetch.
     */
    where?: CotizacionTragerDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionTragerDetalles to fetch.
     */
    orderBy?: CotizacionTragerDetalleOrderByWithRelationInput | CotizacionTragerDetalleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CotizacionTragerDetalles.
     */
    cursor?: CotizacionTragerDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionTragerDetalles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionTragerDetalles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CotizacionTragerDetalles.
     */
    distinct?: CotizacionTragerDetalleScalarFieldEnum | CotizacionTragerDetalleScalarFieldEnum[]
  }

  /**
   * CotizacionTragerDetalle findFirstOrThrow
   */
  export type CotizacionTragerDetalleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionTragerDetalle to fetch.
     */
    where?: CotizacionTragerDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionTragerDetalles to fetch.
     */
    orderBy?: CotizacionTragerDetalleOrderByWithRelationInput | CotizacionTragerDetalleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CotizacionTragerDetalles.
     */
    cursor?: CotizacionTragerDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionTragerDetalles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionTragerDetalles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CotizacionTragerDetalles.
     */
    distinct?: CotizacionTragerDetalleScalarFieldEnum | CotizacionTragerDetalleScalarFieldEnum[]
  }

  /**
   * CotizacionTragerDetalle findMany
   */
  export type CotizacionTragerDetalleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    /**
     * Filter, which CotizacionTragerDetalles to fetch.
     */
    where?: CotizacionTragerDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CotizacionTragerDetalles to fetch.
     */
    orderBy?: CotizacionTragerDetalleOrderByWithRelationInput | CotizacionTragerDetalleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CotizacionTragerDetalles.
     */
    cursor?: CotizacionTragerDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CotizacionTragerDetalles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CotizacionTragerDetalles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CotizacionTragerDetalles.
     */
    distinct?: CotizacionTragerDetalleScalarFieldEnum | CotizacionTragerDetalleScalarFieldEnum[]
  }

  /**
   * CotizacionTragerDetalle create
   */
  export type CotizacionTragerDetalleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    /**
     * The data needed to create a CotizacionTragerDetalle.
     */
    data: XOR<CotizacionTragerDetalleCreateInput, CotizacionTragerDetalleUncheckedCreateInput>
  }

  /**
   * CotizacionTragerDetalle createMany
   */
  export type CotizacionTragerDetalleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CotizacionTragerDetalles.
     */
    data: CotizacionTragerDetalleCreateManyInput | CotizacionTragerDetalleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CotizacionTragerDetalle createManyAndReturn
   */
  export type CotizacionTragerDetalleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * The data used to create many CotizacionTragerDetalles.
     */
    data: CotizacionTragerDetalleCreateManyInput | CotizacionTragerDetalleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CotizacionTragerDetalle update
   */
  export type CotizacionTragerDetalleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    /**
     * The data needed to update a CotizacionTragerDetalle.
     */
    data: XOR<CotizacionTragerDetalleUpdateInput, CotizacionTragerDetalleUncheckedUpdateInput>
    /**
     * Choose, which CotizacionTragerDetalle to update.
     */
    where: CotizacionTragerDetalleWhereUniqueInput
  }

  /**
   * CotizacionTragerDetalle updateMany
   */
  export type CotizacionTragerDetalleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CotizacionTragerDetalles.
     */
    data: XOR<CotizacionTragerDetalleUpdateManyMutationInput, CotizacionTragerDetalleUncheckedUpdateManyInput>
    /**
     * Filter which CotizacionTragerDetalles to update
     */
    where?: CotizacionTragerDetalleWhereInput
    /**
     * Limit how many CotizacionTragerDetalles to update.
     */
    limit?: number
  }

  /**
   * CotizacionTragerDetalle updateManyAndReturn
   */
  export type CotizacionTragerDetalleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * The data used to update CotizacionTragerDetalles.
     */
    data: XOR<CotizacionTragerDetalleUpdateManyMutationInput, CotizacionTragerDetalleUncheckedUpdateManyInput>
    /**
     * Filter which CotizacionTragerDetalles to update
     */
    where?: CotizacionTragerDetalleWhereInput
    /**
     * Limit how many CotizacionTragerDetalles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CotizacionTragerDetalle upsert
   */
  export type CotizacionTragerDetalleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    /**
     * The filter to search for the CotizacionTragerDetalle to update in case it exists.
     */
    where: CotizacionTragerDetalleWhereUniqueInput
    /**
     * In case the CotizacionTragerDetalle found by the `where` argument doesn't exist, create a new CotizacionTragerDetalle with this data.
     */
    create: XOR<CotizacionTragerDetalleCreateInput, CotizacionTragerDetalleUncheckedCreateInput>
    /**
     * In case the CotizacionTragerDetalle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CotizacionTragerDetalleUpdateInput, CotizacionTragerDetalleUncheckedUpdateInput>
  }

  /**
   * CotizacionTragerDetalle delete
   */
  export type CotizacionTragerDetalleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
    /**
     * Filter which CotizacionTragerDetalle to delete.
     */
    where: CotizacionTragerDetalleWhereUniqueInput
  }

  /**
   * CotizacionTragerDetalle deleteMany
   */
  export type CotizacionTragerDetalleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CotizacionTragerDetalles to delete
     */
    where?: CotizacionTragerDetalleWhereInput
    /**
     * Limit how many CotizacionTragerDetalles to delete.
     */
    limit?: number
  }

  /**
   * CotizacionTragerDetalle without action
   */
  export type CotizacionTragerDetalleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CotizacionTragerDetalle
     */
    select?: CotizacionTragerDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CotizacionTragerDetalle
     */
    omit?: CotizacionTragerDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CotizacionTragerDetalleInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ClienteScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    rut: 'rut',
    contactoNombre: 'contactoNombre',
    contactoTelefono: 'contactoTelefono',
    contactoCorreo: 'contactoCorreo',
    activo: 'activo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClienteScalarFieldEnum = (typeof ClienteScalarFieldEnum)[keyof typeof ClienteScalarFieldEnum]


  export const FunnelTragerOpportunityScalarFieldEnum: {
    id: 'id',
    cliente: 'cliente',
    contacto: 'contacto',
    telefono: 'telefono',
    correo: 'correo',
    tipoCliente: 'tipoCliente',
    rutEmpresa: 'rutEmpresa',
    region: 'region',
    comuna: 'comuna',
    unidadNegocio: 'unidadNegocio',
    productoId: 'productoId',
    cantidadEstimada: 'cantidadEstimada',
    urgencia: 'urgencia',
    tipoUso: 'tipoUso',
    necesidadSoporteTecnico: 'necesidadSoporteTecnico',
    alternativaProducto: 'alternativaProducto',
    comision: 'comision',
    margenEstimado: 'margenEstimado',
    fechaComprometidaEnvio: 'fechaComprometidaEnvio',
    versionCotizacion: 'versionCotizacion',
    comentariosCliente: 'comentariosCliente',
    objeciones: 'objeciones',
    ordenCompra: 'ordenCompra',
    correoAceptacion: 'correoAceptacion',
    condicionesComerciales: 'condicionesComerciales',
    coordinacionAdministrativa: 'coordinacionAdministrativa',
    estadoDocumentacion: 'estadoDocumentacion',
    traspasoAdministracion: 'traspasoAdministracion',
    traspasoERP: 'traspasoERP',
    coordinacionDespacho: 'coordinacionDespacho',
    estadoComercialOrden: 'estadoComercialOrden',
    estadoDocumentacionVenta: 'estadoDocumentacionVenta',
    responsable: 'responsable',
    etapa: 'etapa',
    montoEstimado: 'montoEstimado',
    probabilidadCierre: 'probabilidadCierre',
    proximaAccion: 'proximaAccion',
    fechaProximaAccion: 'fechaProximaAccion',
    observaciones: 'observaciones',
    origen: 'origen',
    estadoStock: 'estadoStock',
    cotizacionId: 'cotizacionId',
    motivoPerdida: 'motivoPerdida',
    motivoPostergacion: 'motivoPostergacion',
    fechaReactivacion: 'fechaReactivacion',
    documentoRespaldo: 'documentoRespaldo',
    fechaCierre: 'fechaCierre',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    probabilidad: 'probabilidad',
    flujoPosterior: 'flujoPosterior',
    motivoDescarte: 'motivoDescarte',
    tipoBroker: 'tipoBroker',
    fechaEstimadaDespacho: 'fechaEstimadaDespacho',
    fechaSeguimientoPostventa: 'fechaSeguimientoPostventa',
    nombreOportunidad: 'nombreOportunidad',
    cargoContacto: 'cargoContacto',
    direccionProyecto: 'direccionProyecto',
    tipoOportunidad: 'tipoOportunidad',
    fechaProbableCierre: 'fechaProbableCierre',
    riesgoTecnico: 'riesgoTecnico',
    comentariosInternos: 'comentariosInternos',
    observacionesTecnicas: 'observacionesTecnicas',
    observacionCamposFaltantes: 'observacionCamposFaltantes',
    lineaProducto: 'lineaProducto',
    descuento: 'descuento',
    stockOportunidad: 'stockOportunidad',
    reprogramacionesCount: 'reprogramacionesCount',
    fechaUltimoCambioEtapa: 'fechaUltimoCambioEtapa',
    esReactivacion: 'esReactivacion'
  };

  export type FunnelTragerOpportunityScalarFieldEnum = (typeof FunnelTragerOpportunityScalarFieldEnum)[keyof typeof FunnelTragerOpportunityScalarFieldEnum]


  export const FunnelTragerArchivoScalarFieldEnum: {
    id: 'id',
    oportunidadId: 'oportunidadId',
    tipo: 'tipo',
    url: 'url',
    publicId: 'publicId',
    nombreArchivo: 'nombreArchivo',
    mimeType: 'mimeType',
    bytes: 'bytes',
    etapa: 'etapa',
    observaciones: 'observaciones',
    createdAt: 'createdAt'
  };

  export type FunnelTragerArchivoScalarFieldEnum = (typeof FunnelTragerArchivoScalarFieldEnum)[keyof typeof FunnelTragerArchivoScalarFieldEnum]


  export const HistorialEtapaTragerScalarFieldEnum: {
    id: 'id',
    oportunidadId: 'oportunidadId',
    etapaAnterior: 'etapaAnterior',
    etapaNueva: 'etapaNueva',
    usuarioId: 'usuarioId',
    createdAt: 'createdAt'
  };

  export type HistorialEtapaTragerScalarFieldEnum = (typeof HistorialEtapaTragerScalarFieldEnum)[keyof typeof HistorialEtapaTragerScalarFieldEnum]


  export const CategoriaScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre'
  };

  export type CategoriaScalarFieldEnum = (typeof CategoriaScalarFieldEnum)[keyof typeof CategoriaScalarFieldEnum]


  export const ProductoScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    descripcion: 'descripcion',
    stock: 'stock',
    ubicacion: 'ubicacion',
    createdAt: 'createdAt',
    precio: 'precio',
    minStock: 'minStock',
    activo: 'activo',
    criticidad: 'criticidad',
    imagen: 'imagen',
    categoriaId: 'categoriaId',
    stockReservado: 'stockReservado',
    sku: 'sku',
    disponibilidad: 'disponibilidad',
    formato: 'formato',
    cantidadCaja: 'cantidadCaja',
    precioUsd: 'precioUsd',
    precioSugerido: 'precioSugerido',
    stockInicial: 'stockInicial'
  };

  export type ProductoScalarFieldEnum = (typeof ProductoScalarFieldEnum)[keyof typeof ProductoScalarFieldEnum]


  export const CotizacionTragerScalarFieldEnum: {
    id: 'id',
    cliente: 'cliente',
    contacto: 'contacto',
    tipoCliente: 'tipoCliente',
    responsable: 'responsable',
    estado: 'estado',
    subtotal: 'subtotal',
    descuento: 'descuento',
    impuesto: 'impuesto',
    total: 'total',
    fechaCotizacion: 'fechaCotizacion',
    fechaVencimiento: 'fechaVencimiento',
    fechaEnvio: 'fechaEnvio',
    fechaSeguimiento: 'fechaSeguimiento',
    fechaCierre: 'fechaCierre',
    observaciones: 'observaciones',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    numero: 'numero'
  };

  export type CotizacionTragerScalarFieldEnum = (typeof CotizacionTragerScalarFieldEnum)[keyof typeof CotizacionTragerScalarFieldEnum]


  export const CotizacionTragerDetalleScalarFieldEnum: {
    id: 'id',
    cotizacionId: 'cotizacionId',
    productoId: 'productoId',
    cantidad: 'cantidad',
    precioUnitario: 'precioUnitario',
    descuentoPct: 'descuentoPct',
    subtotal: 'subtotal',
    stockDisponible: 'stockDisponible',
    observacion: 'observacion'
  };

  export type CotizacionTragerDetalleScalarFieldEnum = (typeof CotizacionTragerDetalleScalarFieldEnum)[keyof typeof CotizacionTragerDetalleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ClienteWhereInput = {
    AND?: ClienteWhereInput | ClienteWhereInput[]
    OR?: ClienteWhereInput[]
    NOT?: ClienteWhereInput | ClienteWhereInput[]
    id?: IntFilter<"Cliente"> | number
    nombre?: StringFilter<"Cliente"> | string
    rut?: StringNullableFilter<"Cliente"> | string | null
    contactoNombre?: StringNullableFilter<"Cliente"> | string | null
    contactoTelefono?: StringNullableFilter<"Cliente"> | string | null
    contactoCorreo?: StringNullableFilter<"Cliente"> | string | null
    activo?: BoolFilter<"Cliente"> | boolean
    createdAt?: DateTimeFilter<"Cliente"> | Date | string
    updatedAt?: DateTimeFilter<"Cliente"> | Date | string
  }

  export type ClienteOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    rut?: SortOrderInput | SortOrder
    contactoNombre?: SortOrderInput | SortOrder
    contactoTelefono?: SortOrderInput | SortOrder
    contactoCorreo?: SortOrderInput | SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClienteWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    rut?: string
    AND?: ClienteWhereInput | ClienteWhereInput[]
    OR?: ClienteWhereInput[]
    NOT?: ClienteWhereInput | ClienteWhereInput[]
    nombre?: StringFilter<"Cliente"> | string
    contactoNombre?: StringNullableFilter<"Cliente"> | string | null
    contactoTelefono?: StringNullableFilter<"Cliente"> | string | null
    contactoCorreo?: StringNullableFilter<"Cliente"> | string | null
    activo?: BoolFilter<"Cliente"> | boolean
    createdAt?: DateTimeFilter<"Cliente"> | Date | string
    updatedAt?: DateTimeFilter<"Cliente"> | Date | string
  }, "id" | "rut">

  export type ClienteOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    rut?: SortOrderInput | SortOrder
    contactoNombre?: SortOrderInput | SortOrder
    contactoTelefono?: SortOrderInput | SortOrder
    contactoCorreo?: SortOrderInput | SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClienteCountOrderByAggregateInput
    _avg?: ClienteAvgOrderByAggregateInput
    _max?: ClienteMaxOrderByAggregateInput
    _min?: ClienteMinOrderByAggregateInput
    _sum?: ClienteSumOrderByAggregateInput
  }

  export type ClienteScalarWhereWithAggregatesInput = {
    AND?: ClienteScalarWhereWithAggregatesInput | ClienteScalarWhereWithAggregatesInput[]
    OR?: ClienteScalarWhereWithAggregatesInput[]
    NOT?: ClienteScalarWhereWithAggregatesInput | ClienteScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Cliente"> | number
    nombre?: StringWithAggregatesFilter<"Cliente"> | string
    rut?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    contactoNombre?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    contactoTelefono?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    contactoCorreo?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    activo?: BoolWithAggregatesFilter<"Cliente"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Cliente"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Cliente"> | Date | string
  }

  export type FunnelTragerOpportunityWhereInput = {
    AND?: FunnelTragerOpportunityWhereInput | FunnelTragerOpportunityWhereInput[]
    OR?: FunnelTragerOpportunityWhereInput[]
    NOT?: FunnelTragerOpportunityWhereInput | FunnelTragerOpportunityWhereInput[]
    id?: IntFilter<"FunnelTragerOpportunity"> | number
    cliente?: StringFilter<"FunnelTragerOpportunity"> | string
    contacto?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    telefono?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    correo?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    tipoCliente?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    rutEmpresa?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    region?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    comuna?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    unidadNegocio?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    productoId?: IntNullableFilter<"FunnelTragerOpportunity"> | number | null
    cantidadEstimada?: IntNullableFilter<"FunnelTragerOpportunity"> | number | null
    urgencia?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    tipoUso?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    necesidadSoporteTecnico?: BoolNullableFilter<"FunnelTragerOpportunity"> | boolean | null
    alternativaProducto?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    comision?: FloatNullableFilter<"FunnelTragerOpportunity"> | number | null
    margenEstimado?: FloatNullableFilter<"FunnelTragerOpportunity"> | number | null
    fechaComprometidaEnvio?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    versionCotizacion?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    comentariosCliente?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    objeciones?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    ordenCompra?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    correoAceptacion?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    condicionesComerciales?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    coordinacionAdministrativa?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    estadoDocumentacion?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    traspasoAdministracion?: BoolNullableFilter<"FunnelTragerOpportunity"> | boolean | null
    traspasoERP?: BoolNullableFilter<"FunnelTragerOpportunity"> | boolean | null
    coordinacionDespacho?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    estadoComercialOrden?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    estadoDocumentacionVenta?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    responsable?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    etapa?: StringFilter<"FunnelTragerOpportunity"> | string
    montoEstimado?: FloatFilter<"FunnelTragerOpportunity"> | number
    probabilidadCierre?: IntNullableFilter<"FunnelTragerOpportunity"> | number | null
    proximaAccion?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    fechaProximaAccion?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    observaciones?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    origen?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    estadoStock?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    cotizacionId?: IntNullableFilter<"FunnelTragerOpportunity"> | number | null
    motivoPerdida?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    motivoPostergacion?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    fechaReactivacion?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    documentoRespaldo?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    fechaCierre?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    createdAt?: DateTimeFilter<"FunnelTragerOpportunity"> | Date | string
    updatedAt?: DateTimeFilter<"FunnelTragerOpportunity"> | Date | string
    probabilidad?: IntNullableFilter<"FunnelTragerOpportunity"> | number | null
    flujoPosterior?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    motivoDescarte?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    tipoBroker?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    fechaEstimadaDespacho?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    fechaSeguimientoPostventa?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    nombreOportunidad?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    cargoContacto?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    direccionProyecto?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    tipoOportunidad?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    fechaProbableCierre?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    riesgoTecnico?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    comentariosInternos?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    observacionesTecnicas?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    observacionCamposFaltantes?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    lineaProducto?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    descuento?: FloatNullableFilter<"FunnelTragerOpportunity"> | number | null
    stockOportunidad?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    reprogramacionesCount?: IntFilter<"FunnelTragerOpportunity"> | number
    fechaUltimoCambioEtapa?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    esReactivacion?: BoolFilter<"FunnelTragerOpportunity"> | boolean
    archivos?: FunnelTragerArchivoListRelationFilter
    historialEtapas?: HistorialEtapaTragerListRelationFilter
  }

  export type FunnelTragerOpportunityOrderByWithRelationInput = {
    id?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrderInput | SortOrder
    telefono?: SortOrderInput | SortOrder
    correo?: SortOrderInput | SortOrder
    tipoCliente?: SortOrderInput | SortOrder
    rutEmpresa?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    comuna?: SortOrderInput | SortOrder
    unidadNegocio?: SortOrderInput | SortOrder
    productoId?: SortOrderInput | SortOrder
    cantidadEstimada?: SortOrderInput | SortOrder
    urgencia?: SortOrderInput | SortOrder
    tipoUso?: SortOrderInput | SortOrder
    necesidadSoporteTecnico?: SortOrderInput | SortOrder
    alternativaProducto?: SortOrderInput | SortOrder
    comision?: SortOrderInput | SortOrder
    margenEstimado?: SortOrderInput | SortOrder
    fechaComprometidaEnvio?: SortOrderInput | SortOrder
    versionCotizacion?: SortOrderInput | SortOrder
    comentariosCliente?: SortOrderInput | SortOrder
    objeciones?: SortOrderInput | SortOrder
    ordenCompra?: SortOrderInput | SortOrder
    correoAceptacion?: SortOrderInput | SortOrder
    condicionesComerciales?: SortOrderInput | SortOrder
    coordinacionAdministrativa?: SortOrderInput | SortOrder
    estadoDocumentacion?: SortOrderInput | SortOrder
    traspasoAdministracion?: SortOrderInput | SortOrder
    traspasoERP?: SortOrderInput | SortOrder
    coordinacionDespacho?: SortOrderInput | SortOrder
    estadoComercialOrden?: SortOrderInput | SortOrder
    estadoDocumentacionVenta?: SortOrderInput | SortOrder
    responsable?: SortOrderInput | SortOrder
    etapa?: SortOrder
    montoEstimado?: SortOrder
    probabilidadCierre?: SortOrderInput | SortOrder
    proximaAccion?: SortOrderInput | SortOrder
    fechaProximaAccion?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    origen?: SortOrderInput | SortOrder
    estadoStock?: SortOrderInput | SortOrder
    cotizacionId?: SortOrderInput | SortOrder
    motivoPerdida?: SortOrderInput | SortOrder
    motivoPostergacion?: SortOrderInput | SortOrder
    fechaReactivacion?: SortOrderInput | SortOrder
    documentoRespaldo?: SortOrderInput | SortOrder
    fechaCierre?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    probabilidad?: SortOrderInput | SortOrder
    flujoPosterior?: SortOrderInput | SortOrder
    motivoDescarte?: SortOrderInput | SortOrder
    tipoBroker?: SortOrderInput | SortOrder
    fechaEstimadaDespacho?: SortOrderInput | SortOrder
    fechaSeguimientoPostventa?: SortOrderInput | SortOrder
    nombreOportunidad?: SortOrderInput | SortOrder
    cargoContacto?: SortOrderInput | SortOrder
    direccionProyecto?: SortOrderInput | SortOrder
    tipoOportunidad?: SortOrderInput | SortOrder
    fechaProbableCierre?: SortOrderInput | SortOrder
    riesgoTecnico?: SortOrderInput | SortOrder
    comentariosInternos?: SortOrderInput | SortOrder
    observacionesTecnicas?: SortOrderInput | SortOrder
    observacionCamposFaltantes?: SortOrderInput | SortOrder
    lineaProducto?: SortOrderInput | SortOrder
    descuento?: SortOrderInput | SortOrder
    stockOportunidad?: SortOrderInput | SortOrder
    reprogramacionesCount?: SortOrder
    fechaUltimoCambioEtapa?: SortOrderInput | SortOrder
    esReactivacion?: SortOrder
    archivos?: FunnelTragerArchivoOrderByRelationAggregateInput
    historialEtapas?: HistorialEtapaTragerOrderByRelationAggregateInput
  }

  export type FunnelTragerOpportunityWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FunnelTragerOpportunityWhereInput | FunnelTragerOpportunityWhereInput[]
    OR?: FunnelTragerOpportunityWhereInput[]
    NOT?: FunnelTragerOpportunityWhereInput | FunnelTragerOpportunityWhereInput[]
    cliente?: StringFilter<"FunnelTragerOpportunity"> | string
    contacto?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    telefono?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    correo?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    tipoCliente?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    rutEmpresa?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    region?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    comuna?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    unidadNegocio?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    productoId?: IntNullableFilter<"FunnelTragerOpportunity"> | number | null
    cantidadEstimada?: IntNullableFilter<"FunnelTragerOpportunity"> | number | null
    urgencia?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    tipoUso?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    necesidadSoporteTecnico?: BoolNullableFilter<"FunnelTragerOpportunity"> | boolean | null
    alternativaProducto?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    comision?: FloatNullableFilter<"FunnelTragerOpportunity"> | number | null
    margenEstimado?: FloatNullableFilter<"FunnelTragerOpportunity"> | number | null
    fechaComprometidaEnvio?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    versionCotizacion?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    comentariosCliente?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    objeciones?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    ordenCompra?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    correoAceptacion?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    condicionesComerciales?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    coordinacionAdministrativa?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    estadoDocumentacion?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    traspasoAdministracion?: BoolNullableFilter<"FunnelTragerOpportunity"> | boolean | null
    traspasoERP?: BoolNullableFilter<"FunnelTragerOpportunity"> | boolean | null
    coordinacionDespacho?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    estadoComercialOrden?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    estadoDocumentacionVenta?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    responsable?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    etapa?: StringFilter<"FunnelTragerOpportunity"> | string
    montoEstimado?: FloatFilter<"FunnelTragerOpportunity"> | number
    probabilidadCierre?: IntNullableFilter<"FunnelTragerOpportunity"> | number | null
    proximaAccion?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    fechaProximaAccion?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    observaciones?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    origen?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    estadoStock?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    cotizacionId?: IntNullableFilter<"FunnelTragerOpportunity"> | number | null
    motivoPerdida?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    motivoPostergacion?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    fechaReactivacion?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    documentoRespaldo?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    fechaCierre?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    createdAt?: DateTimeFilter<"FunnelTragerOpportunity"> | Date | string
    updatedAt?: DateTimeFilter<"FunnelTragerOpportunity"> | Date | string
    probabilidad?: IntNullableFilter<"FunnelTragerOpportunity"> | number | null
    flujoPosterior?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    motivoDescarte?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    tipoBroker?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    fechaEstimadaDespacho?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    fechaSeguimientoPostventa?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    nombreOportunidad?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    cargoContacto?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    direccionProyecto?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    tipoOportunidad?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    fechaProbableCierre?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    riesgoTecnico?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    comentariosInternos?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    observacionesTecnicas?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    observacionCamposFaltantes?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    lineaProducto?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    descuento?: FloatNullableFilter<"FunnelTragerOpportunity"> | number | null
    stockOportunidad?: StringNullableFilter<"FunnelTragerOpportunity"> | string | null
    reprogramacionesCount?: IntFilter<"FunnelTragerOpportunity"> | number
    fechaUltimoCambioEtapa?: DateTimeNullableFilter<"FunnelTragerOpportunity"> | Date | string | null
    esReactivacion?: BoolFilter<"FunnelTragerOpportunity"> | boolean
    archivos?: FunnelTragerArchivoListRelationFilter
    historialEtapas?: HistorialEtapaTragerListRelationFilter
  }, "id">

  export type FunnelTragerOpportunityOrderByWithAggregationInput = {
    id?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrderInput | SortOrder
    telefono?: SortOrderInput | SortOrder
    correo?: SortOrderInput | SortOrder
    tipoCliente?: SortOrderInput | SortOrder
    rutEmpresa?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    comuna?: SortOrderInput | SortOrder
    unidadNegocio?: SortOrderInput | SortOrder
    productoId?: SortOrderInput | SortOrder
    cantidadEstimada?: SortOrderInput | SortOrder
    urgencia?: SortOrderInput | SortOrder
    tipoUso?: SortOrderInput | SortOrder
    necesidadSoporteTecnico?: SortOrderInput | SortOrder
    alternativaProducto?: SortOrderInput | SortOrder
    comision?: SortOrderInput | SortOrder
    margenEstimado?: SortOrderInput | SortOrder
    fechaComprometidaEnvio?: SortOrderInput | SortOrder
    versionCotizacion?: SortOrderInput | SortOrder
    comentariosCliente?: SortOrderInput | SortOrder
    objeciones?: SortOrderInput | SortOrder
    ordenCompra?: SortOrderInput | SortOrder
    correoAceptacion?: SortOrderInput | SortOrder
    condicionesComerciales?: SortOrderInput | SortOrder
    coordinacionAdministrativa?: SortOrderInput | SortOrder
    estadoDocumentacion?: SortOrderInput | SortOrder
    traspasoAdministracion?: SortOrderInput | SortOrder
    traspasoERP?: SortOrderInput | SortOrder
    coordinacionDespacho?: SortOrderInput | SortOrder
    estadoComercialOrden?: SortOrderInput | SortOrder
    estadoDocumentacionVenta?: SortOrderInput | SortOrder
    responsable?: SortOrderInput | SortOrder
    etapa?: SortOrder
    montoEstimado?: SortOrder
    probabilidadCierre?: SortOrderInput | SortOrder
    proximaAccion?: SortOrderInput | SortOrder
    fechaProximaAccion?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    origen?: SortOrderInput | SortOrder
    estadoStock?: SortOrderInput | SortOrder
    cotizacionId?: SortOrderInput | SortOrder
    motivoPerdida?: SortOrderInput | SortOrder
    motivoPostergacion?: SortOrderInput | SortOrder
    fechaReactivacion?: SortOrderInput | SortOrder
    documentoRespaldo?: SortOrderInput | SortOrder
    fechaCierre?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    probabilidad?: SortOrderInput | SortOrder
    flujoPosterior?: SortOrderInput | SortOrder
    motivoDescarte?: SortOrderInput | SortOrder
    tipoBroker?: SortOrderInput | SortOrder
    fechaEstimadaDespacho?: SortOrderInput | SortOrder
    fechaSeguimientoPostventa?: SortOrderInput | SortOrder
    nombreOportunidad?: SortOrderInput | SortOrder
    cargoContacto?: SortOrderInput | SortOrder
    direccionProyecto?: SortOrderInput | SortOrder
    tipoOportunidad?: SortOrderInput | SortOrder
    fechaProbableCierre?: SortOrderInput | SortOrder
    riesgoTecnico?: SortOrderInput | SortOrder
    comentariosInternos?: SortOrderInput | SortOrder
    observacionesTecnicas?: SortOrderInput | SortOrder
    observacionCamposFaltantes?: SortOrderInput | SortOrder
    lineaProducto?: SortOrderInput | SortOrder
    descuento?: SortOrderInput | SortOrder
    stockOportunidad?: SortOrderInput | SortOrder
    reprogramacionesCount?: SortOrder
    fechaUltimoCambioEtapa?: SortOrderInput | SortOrder
    esReactivacion?: SortOrder
    _count?: FunnelTragerOpportunityCountOrderByAggregateInput
    _avg?: FunnelTragerOpportunityAvgOrderByAggregateInput
    _max?: FunnelTragerOpportunityMaxOrderByAggregateInput
    _min?: FunnelTragerOpportunityMinOrderByAggregateInput
    _sum?: FunnelTragerOpportunitySumOrderByAggregateInput
  }

  export type FunnelTragerOpportunityScalarWhereWithAggregatesInput = {
    AND?: FunnelTragerOpportunityScalarWhereWithAggregatesInput | FunnelTragerOpportunityScalarWhereWithAggregatesInput[]
    OR?: FunnelTragerOpportunityScalarWhereWithAggregatesInput[]
    NOT?: FunnelTragerOpportunityScalarWhereWithAggregatesInput | FunnelTragerOpportunityScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FunnelTragerOpportunity"> | number
    cliente?: StringWithAggregatesFilter<"FunnelTragerOpportunity"> | string
    contacto?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    telefono?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    correo?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    tipoCliente?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    rutEmpresa?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    region?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    comuna?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    unidadNegocio?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    productoId?: IntNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | number | null
    cantidadEstimada?: IntNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | number | null
    urgencia?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    tipoUso?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    necesidadSoporteTecnico?: BoolNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | boolean | null
    alternativaProducto?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    comision?: FloatNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | number | null
    margenEstimado?: FloatNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | number | null
    fechaComprometidaEnvio?: DateTimeNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | Date | string | null
    versionCotizacion?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    comentariosCliente?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    objeciones?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    ordenCompra?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    correoAceptacion?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    condicionesComerciales?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    coordinacionAdministrativa?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    estadoDocumentacion?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    traspasoAdministracion?: BoolNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | boolean | null
    traspasoERP?: BoolNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | boolean | null
    coordinacionDespacho?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    estadoComercialOrden?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    estadoDocumentacionVenta?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    responsable?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    etapa?: StringWithAggregatesFilter<"FunnelTragerOpportunity"> | string
    montoEstimado?: FloatWithAggregatesFilter<"FunnelTragerOpportunity"> | number
    probabilidadCierre?: IntNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | number | null
    proximaAccion?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    fechaProximaAccion?: DateTimeNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | Date | string | null
    observaciones?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    origen?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    estadoStock?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    cotizacionId?: IntNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | number | null
    motivoPerdida?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    motivoPostergacion?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    fechaReactivacion?: DateTimeNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | Date | string | null
    documentoRespaldo?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    fechaCierre?: DateTimeNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FunnelTragerOpportunity"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FunnelTragerOpportunity"> | Date | string
    probabilidad?: IntNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | number | null
    flujoPosterior?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    motivoDescarte?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    tipoBroker?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    fechaEstimadaDespacho?: DateTimeNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | Date | string | null
    fechaSeguimientoPostventa?: DateTimeNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | Date | string | null
    nombreOportunidad?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    cargoContacto?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    direccionProyecto?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    tipoOportunidad?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    fechaProbableCierre?: DateTimeNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | Date | string | null
    riesgoTecnico?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    comentariosInternos?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    observacionesTecnicas?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    observacionCamposFaltantes?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    lineaProducto?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    descuento?: FloatNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | number | null
    stockOportunidad?: StringNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | string | null
    reprogramacionesCount?: IntWithAggregatesFilter<"FunnelTragerOpportunity"> | number
    fechaUltimoCambioEtapa?: DateTimeNullableWithAggregatesFilter<"FunnelTragerOpportunity"> | Date | string | null
    esReactivacion?: BoolWithAggregatesFilter<"FunnelTragerOpportunity"> | boolean
  }

  export type FunnelTragerArchivoWhereInput = {
    AND?: FunnelTragerArchivoWhereInput | FunnelTragerArchivoWhereInput[]
    OR?: FunnelTragerArchivoWhereInput[]
    NOT?: FunnelTragerArchivoWhereInput | FunnelTragerArchivoWhereInput[]
    id?: IntFilter<"FunnelTragerArchivo"> | number
    oportunidadId?: IntFilter<"FunnelTragerArchivo"> | number
    tipo?: StringFilter<"FunnelTragerArchivo"> | string
    url?: StringFilter<"FunnelTragerArchivo"> | string
    publicId?: StringFilter<"FunnelTragerArchivo"> | string
    nombreArchivo?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    mimeType?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    bytes?: IntNullableFilter<"FunnelTragerArchivo"> | number | null
    etapa?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    observaciones?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    createdAt?: DateTimeFilter<"FunnelTragerArchivo"> | Date | string
    oportunidad?: XOR<FunnelTragerOpportunityScalarRelationFilter, FunnelTragerOpportunityWhereInput>
  }

  export type FunnelTragerArchivoOrderByWithRelationInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    tipo?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    nombreArchivo?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    bytes?: SortOrderInput | SortOrder
    etapa?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    oportunidad?: FunnelTragerOpportunityOrderByWithRelationInput
  }

  export type FunnelTragerArchivoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FunnelTragerArchivoWhereInput | FunnelTragerArchivoWhereInput[]
    OR?: FunnelTragerArchivoWhereInput[]
    NOT?: FunnelTragerArchivoWhereInput | FunnelTragerArchivoWhereInput[]
    oportunidadId?: IntFilter<"FunnelTragerArchivo"> | number
    tipo?: StringFilter<"FunnelTragerArchivo"> | string
    url?: StringFilter<"FunnelTragerArchivo"> | string
    publicId?: StringFilter<"FunnelTragerArchivo"> | string
    nombreArchivo?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    mimeType?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    bytes?: IntNullableFilter<"FunnelTragerArchivo"> | number | null
    etapa?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    observaciones?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    createdAt?: DateTimeFilter<"FunnelTragerArchivo"> | Date | string
    oportunidad?: XOR<FunnelTragerOpportunityScalarRelationFilter, FunnelTragerOpportunityWhereInput>
  }, "id">

  export type FunnelTragerArchivoOrderByWithAggregationInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    tipo?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    nombreArchivo?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    bytes?: SortOrderInput | SortOrder
    etapa?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: FunnelTragerArchivoCountOrderByAggregateInput
    _avg?: FunnelTragerArchivoAvgOrderByAggregateInput
    _max?: FunnelTragerArchivoMaxOrderByAggregateInput
    _min?: FunnelTragerArchivoMinOrderByAggregateInput
    _sum?: FunnelTragerArchivoSumOrderByAggregateInput
  }

  export type FunnelTragerArchivoScalarWhereWithAggregatesInput = {
    AND?: FunnelTragerArchivoScalarWhereWithAggregatesInput | FunnelTragerArchivoScalarWhereWithAggregatesInput[]
    OR?: FunnelTragerArchivoScalarWhereWithAggregatesInput[]
    NOT?: FunnelTragerArchivoScalarWhereWithAggregatesInput | FunnelTragerArchivoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FunnelTragerArchivo"> | number
    oportunidadId?: IntWithAggregatesFilter<"FunnelTragerArchivo"> | number
    tipo?: StringWithAggregatesFilter<"FunnelTragerArchivo"> | string
    url?: StringWithAggregatesFilter<"FunnelTragerArchivo"> | string
    publicId?: StringWithAggregatesFilter<"FunnelTragerArchivo"> | string
    nombreArchivo?: StringNullableWithAggregatesFilter<"FunnelTragerArchivo"> | string | null
    mimeType?: StringNullableWithAggregatesFilter<"FunnelTragerArchivo"> | string | null
    bytes?: IntNullableWithAggregatesFilter<"FunnelTragerArchivo"> | number | null
    etapa?: StringNullableWithAggregatesFilter<"FunnelTragerArchivo"> | string | null
    observaciones?: StringNullableWithAggregatesFilter<"FunnelTragerArchivo"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FunnelTragerArchivo"> | Date | string
  }

  export type HistorialEtapaTragerWhereInput = {
    AND?: HistorialEtapaTragerWhereInput | HistorialEtapaTragerWhereInput[]
    OR?: HistorialEtapaTragerWhereInput[]
    NOT?: HistorialEtapaTragerWhereInput | HistorialEtapaTragerWhereInput[]
    id?: IntFilter<"HistorialEtapaTrager"> | number
    oportunidadId?: IntFilter<"HistorialEtapaTrager"> | number
    etapaAnterior?: StringNullableFilter<"HistorialEtapaTrager"> | string | null
    etapaNueva?: StringFilter<"HistorialEtapaTrager"> | string
    usuarioId?: UuidNullableFilter<"HistorialEtapaTrager"> | string | null
    createdAt?: DateTimeFilter<"HistorialEtapaTrager"> | Date | string
    oportunidad?: XOR<FunnelTragerOpportunityScalarRelationFilter, FunnelTragerOpportunityWhereInput>
  }

  export type HistorialEtapaTragerOrderByWithRelationInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    etapaAnterior?: SortOrderInput | SortOrder
    etapaNueva?: SortOrder
    usuarioId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    oportunidad?: FunnelTragerOpportunityOrderByWithRelationInput
  }

  export type HistorialEtapaTragerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: HistorialEtapaTragerWhereInput | HistorialEtapaTragerWhereInput[]
    OR?: HistorialEtapaTragerWhereInput[]
    NOT?: HistorialEtapaTragerWhereInput | HistorialEtapaTragerWhereInput[]
    oportunidadId?: IntFilter<"HistorialEtapaTrager"> | number
    etapaAnterior?: StringNullableFilter<"HistorialEtapaTrager"> | string | null
    etapaNueva?: StringFilter<"HistorialEtapaTrager"> | string
    usuarioId?: UuidNullableFilter<"HistorialEtapaTrager"> | string | null
    createdAt?: DateTimeFilter<"HistorialEtapaTrager"> | Date | string
    oportunidad?: XOR<FunnelTragerOpportunityScalarRelationFilter, FunnelTragerOpportunityWhereInput>
  }, "id">

  export type HistorialEtapaTragerOrderByWithAggregationInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    etapaAnterior?: SortOrderInput | SortOrder
    etapaNueva?: SortOrder
    usuarioId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: HistorialEtapaTragerCountOrderByAggregateInput
    _avg?: HistorialEtapaTragerAvgOrderByAggregateInput
    _max?: HistorialEtapaTragerMaxOrderByAggregateInput
    _min?: HistorialEtapaTragerMinOrderByAggregateInput
    _sum?: HistorialEtapaTragerSumOrderByAggregateInput
  }

  export type HistorialEtapaTragerScalarWhereWithAggregatesInput = {
    AND?: HistorialEtapaTragerScalarWhereWithAggregatesInput | HistorialEtapaTragerScalarWhereWithAggregatesInput[]
    OR?: HistorialEtapaTragerScalarWhereWithAggregatesInput[]
    NOT?: HistorialEtapaTragerScalarWhereWithAggregatesInput | HistorialEtapaTragerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"HistorialEtapaTrager"> | number
    oportunidadId?: IntWithAggregatesFilter<"HistorialEtapaTrager"> | number
    etapaAnterior?: StringNullableWithAggregatesFilter<"HistorialEtapaTrager"> | string | null
    etapaNueva?: StringWithAggregatesFilter<"HistorialEtapaTrager"> | string
    usuarioId?: UuidNullableWithAggregatesFilter<"HistorialEtapaTrager"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"HistorialEtapaTrager"> | Date | string
  }

  export type CategoriaWhereInput = {
    AND?: CategoriaWhereInput | CategoriaWhereInput[]
    OR?: CategoriaWhereInput[]
    NOT?: CategoriaWhereInput | CategoriaWhereInput[]
    id?: IntFilter<"Categoria"> | number
    nombre?: StringFilter<"Categoria"> | string
    Producto?: ProductoListRelationFilter
  }

  export type CategoriaOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    Producto?: ProductoOrderByRelationAggregateInput
  }

  export type CategoriaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CategoriaWhereInput | CategoriaWhereInput[]
    OR?: CategoriaWhereInput[]
    NOT?: CategoriaWhereInput | CategoriaWhereInput[]
    nombre?: StringFilter<"Categoria"> | string
    Producto?: ProductoListRelationFilter
  }, "id">

  export type CategoriaOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    _count?: CategoriaCountOrderByAggregateInput
    _avg?: CategoriaAvgOrderByAggregateInput
    _max?: CategoriaMaxOrderByAggregateInput
    _min?: CategoriaMinOrderByAggregateInput
    _sum?: CategoriaSumOrderByAggregateInput
  }

  export type CategoriaScalarWhereWithAggregatesInput = {
    AND?: CategoriaScalarWhereWithAggregatesInput | CategoriaScalarWhereWithAggregatesInput[]
    OR?: CategoriaScalarWhereWithAggregatesInput[]
    NOT?: CategoriaScalarWhereWithAggregatesInput | CategoriaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Categoria"> | number
    nombre?: StringWithAggregatesFilter<"Categoria"> | string
  }

  export type ProductoWhereInput = {
    AND?: ProductoWhereInput | ProductoWhereInput[]
    OR?: ProductoWhereInput[]
    NOT?: ProductoWhereInput | ProductoWhereInput[]
    id?: IntFilter<"Producto"> | number
    nombre?: StringFilter<"Producto"> | string
    descripcion?: StringNullableFilter<"Producto"> | string | null
    stock?: IntFilter<"Producto"> | number
    ubicacion?: StringNullableFilter<"Producto"> | string | null
    createdAt?: DateTimeFilter<"Producto"> | Date | string
    precio?: FloatFilter<"Producto"> | number
    minStock?: IntFilter<"Producto"> | number
    activo?: BoolFilter<"Producto"> | boolean
    criticidad?: StringFilter<"Producto"> | string
    imagen?: StringNullableFilter<"Producto"> | string | null
    categoriaId?: IntFilter<"Producto"> | number
    stockReservado?: IntFilter<"Producto"> | number
    sku?: StringNullableFilter<"Producto"> | string | null
    disponibilidad?: StringNullableFilter<"Producto"> | string | null
    formato?: StringNullableFilter<"Producto"> | string | null
    cantidadCaja?: StringNullableFilter<"Producto"> | string | null
    precioUsd?: FloatNullableFilter<"Producto"> | number | null
    precioSugerido?: FloatNullableFilter<"Producto"> | number | null
    stockInicial?: IntNullableFilter<"Producto"> | number | null
    Categoria?: XOR<CategoriaScalarRelationFilter, CategoriaWhereInput>
    CotizacionTragerDetalle?: CotizacionTragerDetalleListRelationFilter
  }

  export type ProductoOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    stock?: SortOrder
    ubicacion?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    precio?: SortOrder
    minStock?: SortOrder
    activo?: SortOrder
    criticidad?: SortOrder
    imagen?: SortOrderInput | SortOrder
    categoriaId?: SortOrder
    stockReservado?: SortOrder
    sku?: SortOrderInput | SortOrder
    disponibilidad?: SortOrderInput | SortOrder
    formato?: SortOrderInput | SortOrder
    cantidadCaja?: SortOrderInput | SortOrder
    precioUsd?: SortOrderInput | SortOrder
    precioSugerido?: SortOrderInput | SortOrder
    stockInicial?: SortOrderInput | SortOrder
    Categoria?: CategoriaOrderByWithRelationInput
    CotizacionTragerDetalle?: CotizacionTragerDetalleOrderByRelationAggregateInput
  }

  export type ProductoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    sku?: string
    AND?: ProductoWhereInput | ProductoWhereInput[]
    OR?: ProductoWhereInput[]
    NOT?: ProductoWhereInput | ProductoWhereInput[]
    nombre?: StringFilter<"Producto"> | string
    descripcion?: StringNullableFilter<"Producto"> | string | null
    stock?: IntFilter<"Producto"> | number
    ubicacion?: StringNullableFilter<"Producto"> | string | null
    createdAt?: DateTimeFilter<"Producto"> | Date | string
    precio?: FloatFilter<"Producto"> | number
    minStock?: IntFilter<"Producto"> | number
    activo?: BoolFilter<"Producto"> | boolean
    criticidad?: StringFilter<"Producto"> | string
    imagen?: StringNullableFilter<"Producto"> | string | null
    categoriaId?: IntFilter<"Producto"> | number
    stockReservado?: IntFilter<"Producto"> | number
    disponibilidad?: StringNullableFilter<"Producto"> | string | null
    formato?: StringNullableFilter<"Producto"> | string | null
    cantidadCaja?: StringNullableFilter<"Producto"> | string | null
    precioUsd?: FloatNullableFilter<"Producto"> | number | null
    precioSugerido?: FloatNullableFilter<"Producto"> | number | null
    stockInicial?: IntNullableFilter<"Producto"> | number | null
    Categoria?: XOR<CategoriaScalarRelationFilter, CategoriaWhereInput>
    CotizacionTragerDetalle?: CotizacionTragerDetalleListRelationFilter
  }, "id" | "sku">

  export type ProductoOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    stock?: SortOrder
    ubicacion?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    precio?: SortOrder
    minStock?: SortOrder
    activo?: SortOrder
    criticidad?: SortOrder
    imagen?: SortOrderInput | SortOrder
    categoriaId?: SortOrder
    stockReservado?: SortOrder
    sku?: SortOrderInput | SortOrder
    disponibilidad?: SortOrderInput | SortOrder
    formato?: SortOrderInput | SortOrder
    cantidadCaja?: SortOrderInput | SortOrder
    precioUsd?: SortOrderInput | SortOrder
    precioSugerido?: SortOrderInput | SortOrder
    stockInicial?: SortOrderInput | SortOrder
    _count?: ProductoCountOrderByAggregateInput
    _avg?: ProductoAvgOrderByAggregateInput
    _max?: ProductoMaxOrderByAggregateInput
    _min?: ProductoMinOrderByAggregateInput
    _sum?: ProductoSumOrderByAggregateInput
  }

  export type ProductoScalarWhereWithAggregatesInput = {
    AND?: ProductoScalarWhereWithAggregatesInput | ProductoScalarWhereWithAggregatesInput[]
    OR?: ProductoScalarWhereWithAggregatesInput[]
    NOT?: ProductoScalarWhereWithAggregatesInput | ProductoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Producto"> | number
    nombre?: StringWithAggregatesFilter<"Producto"> | string
    descripcion?: StringNullableWithAggregatesFilter<"Producto"> | string | null
    stock?: IntWithAggregatesFilter<"Producto"> | number
    ubicacion?: StringNullableWithAggregatesFilter<"Producto"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Producto"> | Date | string
    precio?: FloatWithAggregatesFilter<"Producto"> | number
    minStock?: IntWithAggregatesFilter<"Producto"> | number
    activo?: BoolWithAggregatesFilter<"Producto"> | boolean
    criticidad?: StringWithAggregatesFilter<"Producto"> | string
    imagen?: StringNullableWithAggregatesFilter<"Producto"> | string | null
    categoriaId?: IntWithAggregatesFilter<"Producto"> | number
    stockReservado?: IntWithAggregatesFilter<"Producto"> | number
    sku?: StringNullableWithAggregatesFilter<"Producto"> | string | null
    disponibilidad?: StringNullableWithAggregatesFilter<"Producto"> | string | null
    formato?: StringNullableWithAggregatesFilter<"Producto"> | string | null
    cantidadCaja?: StringNullableWithAggregatesFilter<"Producto"> | string | null
    precioUsd?: FloatNullableWithAggregatesFilter<"Producto"> | number | null
    precioSugerido?: FloatNullableWithAggregatesFilter<"Producto"> | number | null
    stockInicial?: IntNullableWithAggregatesFilter<"Producto"> | number | null
  }

  export type CotizacionTragerWhereInput = {
    AND?: CotizacionTragerWhereInput | CotizacionTragerWhereInput[]
    OR?: CotizacionTragerWhereInput[]
    NOT?: CotizacionTragerWhereInput | CotizacionTragerWhereInput[]
    id?: IntFilter<"CotizacionTrager"> | number
    cliente?: StringFilter<"CotizacionTrager"> | string
    contacto?: StringNullableFilter<"CotizacionTrager"> | string | null
    tipoCliente?: StringNullableFilter<"CotizacionTrager"> | string | null
    responsable?: StringNullableFilter<"CotizacionTrager"> | string | null
    estado?: StringFilter<"CotizacionTrager"> | string
    subtotal?: FloatFilter<"CotizacionTrager"> | number
    descuento?: FloatFilter<"CotizacionTrager"> | number
    impuesto?: FloatFilter<"CotizacionTrager"> | number
    total?: FloatFilter<"CotizacionTrager"> | number
    fechaCotizacion?: DateTimeFilter<"CotizacionTrager"> | Date | string
    fechaVencimiento?: DateTimeNullableFilter<"CotizacionTrager"> | Date | string | null
    fechaEnvio?: DateTimeNullableFilter<"CotizacionTrager"> | Date | string | null
    fechaSeguimiento?: DateTimeNullableFilter<"CotizacionTrager"> | Date | string | null
    fechaCierre?: DateTimeNullableFilter<"CotizacionTrager"> | Date | string | null
    observaciones?: StringNullableFilter<"CotizacionTrager"> | string | null
    createdAt?: DateTimeFilter<"CotizacionTrager"> | Date | string
    updatedAt?: DateTimeFilter<"CotizacionTrager"> | Date | string
    numero?: StringNullableFilter<"CotizacionTrager"> | string | null
    detalles?: CotizacionTragerDetalleListRelationFilter
  }

  export type CotizacionTragerOrderByWithRelationInput = {
    id?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrderInput | SortOrder
    tipoCliente?: SortOrderInput | SortOrder
    responsable?: SortOrderInput | SortOrder
    estado?: SortOrder
    subtotal?: SortOrder
    descuento?: SortOrder
    impuesto?: SortOrder
    total?: SortOrder
    fechaCotizacion?: SortOrder
    fechaVencimiento?: SortOrderInput | SortOrder
    fechaEnvio?: SortOrderInput | SortOrder
    fechaSeguimiento?: SortOrderInput | SortOrder
    fechaCierre?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    numero?: SortOrderInput | SortOrder
    detalles?: CotizacionTragerDetalleOrderByRelationAggregateInput
  }

  export type CotizacionTragerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    numero?: string
    AND?: CotizacionTragerWhereInput | CotizacionTragerWhereInput[]
    OR?: CotizacionTragerWhereInput[]
    NOT?: CotizacionTragerWhereInput | CotizacionTragerWhereInput[]
    cliente?: StringFilter<"CotizacionTrager"> | string
    contacto?: StringNullableFilter<"CotizacionTrager"> | string | null
    tipoCliente?: StringNullableFilter<"CotizacionTrager"> | string | null
    responsable?: StringNullableFilter<"CotizacionTrager"> | string | null
    estado?: StringFilter<"CotizacionTrager"> | string
    subtotal?: FloatFilter<"CotizacionTrager"> | number
    descuento?: FloatFilter<"CotizacionTrager"> | number
    impuesto?: FloatFilter<"CotizacionTrager"> | number
    total?: FloatFilter<"CotizacionTrager"> | number
    fechaCotizacion?: DateTimeFilter<"CotizacionTrager"> | Date | string
    fechaVencimiento?: DateTimeNullableFilter<"CotizacionTrager"> | Date | string | null
    fechaEnvio?: DateTimeNullableFilter<"CotizacionTrager"> | Date | string | null
    fechaSeguimiento?: DateTimeNullableFilter<"CotizacionTrager"> | Date | string | null
    fechaCierre?: DateTimeNullableFilter<"CotizacionTrager"> | Date | string | null
    observaciones?: StringNullableFilter<"CotizacionTrager"> | string | null
    createdAt?: DateTimeFilter<"CotizacionTrager"> | Date | string
    updatedAt?: DateTimeFilter<"CotizacionTrager"> | Date | string
    detalles?: CotizacionTragerDetalleListRelationFilter
  }, "id" | "numero">

  export type CotizacionTragerOrderByWithAggregationInput = {
    id?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrderInput | SortOrder
    tipoCliente?: SortOrderInput | SortOrder
    responsable?: SortOrderInput | SortOrder
    estado?: SortOrder
    subtotal?: SortOrder
    descuento?: SortOrder
    impuesto?: SortOrder
    total?: SortOrder
    fechaCotizacion?: SortOrder
    fechaVencimiento?: SortOrderInput | SortOrder
    fechaEnvio?: SortOrderInput | SortOrder
    fechaSeguimiento?: SortOrderInput | SortOrder
    fechaCierre?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    numero?: SortOrderInput | SortOrder
    _count?: CotizacionTragerCountOrderByAggregateInput
    _avg?: CotizacionTragerAvgOrderByAggregateInput
    _max?: CotizacionTragerMaxOrderByAggregateInput
    _min?: CotizacionTragerMinOrderByAggregateInput
    _sum?: CotizacionTragerSumOrderByAggregateInput
  }

  export type CotizacionTragerScalarWhereWithAggregatesInput = {
    AND?: CotizacionTragerScalarWhereWithAggregatesInput | CotizacionTragerScalarWhereWithAggregatesInput[]
    OR?: CotizacionTragerScalarWhereWithAggregatesInput[]
    NOT?: CotizacionTragerScalarWhereWithAggregatesInput | CotizacionTragerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CotizacionTrager"> | number
    cliente?: StringWithAggregatesFilter<"CotizacionTrager"> | string
    contacto?: StringNullableWithAggregatesFilter<"CotizacionTrager"> | string | null
    tipoCliente?: StringNullableWithAggregatesFilter<"CotizacionTrager"> | string | null
    responsable?: StringNullableWithAggregatesFilter<"CotizacionTrager"> | string | null
    estado?: StringWithAggregatesFilter<"CotizacionTrager"> | string
    subtotal?: FloatWithAggregatesFilter<"CotizacionTrager"> | number
    descuento?: FloatWithAggregatesFilter<"CotizacionTrager"> | number
    impuesto?: FloatWithAggregatesFilter<"CotizacionTrager"> | number
    total?: FloatWithAggregatesFilter<"CotizacionTrager"> | number
    fechaCotizacion?: DateTimeWithAggregatesFilter<"CotizacionTrager"> | Date | string
    fechaVencimiento?: DateTimeNullableWithAggregatesFilter<"CotizacionTrager"> | Date | string | null
    fechaEnvio?: DateTimeNullableWithAggregatesFilter<"CotizacionTrager"> | Date | string | null
    fechaSeguimiento?: DateTimeNullableWithAggregatesFilter<"CotizacionTrager"> | Date | string | null
    fechaCierre?: DateTimeNullableWithAggregatesFilter<"CotizacionTrager"> | Date | string | null
    observaciones?: StringNullableWithAggregatesFilter<"CotizacionTrager"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CotizacionTrager"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CotizacionTrager"> | Date | string
    numero?: StringNullableWithAggregatesFilter<"CotizacionTrager"> | string | null
  }

  export type CotizacionTragerDetalleWhereInput = {
    AND?: CotizacionTragerDetalleWhereInput | CotizacionTragerDetalleWhereInput[]
    OR?: CotizacionTragerDetalleWhereInput[]
    NOT?: CotizacionTragerDetalleWhereInput | CotizacionTragerDetalleWhereInput[]
    id?: IntFilter<"CotizacionTragerDetalle"> | number
    cotizacionId?: IntFilter<"CotizacionTragerDetalle"> | number
    productoId?: IntFilter<"CotizacionTragerDetalle"> | number
    cantidad?: IntFilter<"CotizacionTragerDetalle"> | number
    precioUnitario?: FloatFilter<"CotizacionTragerDetalle"> | number
    descuentoPct?: FloatFilter<"CotizacionTragerDetalle"> | number
    subtotal?: FloatFilter<"CotizacionTragerDetalle"> | number
    stockDisponible?: IntNullableFilter<"CotizacionTragerDetalle"> | number | null
    observacion?: StringNullableFilter<"CotizacionTragerDetalle"> | string | null
    cotizacion?: XOR<CotizacionTragerScalarRelationFilter, CotizacionTragerWhereInput>
    producto?: XOR<ProductoScalarRelationFilter, ProductoWhereInput>
  }

  export type CotizacionTragerDetalleOrderByWithRelationInput = {
    id?: SortOrder
    cotizacionId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnitario?: SortOrder
    descuentoPct?: SortOrder
    subtotal?: SortOrder
    stockDisponible?: SortOrderInput | SortOrder
    observacion?: SortOrderInput | SortOrder
    cotizacion?: CotizacionTragerOrderByWithRelationInput
    producto?: ProductoOrderByWithRelationInput
  }

  export type CotizacionTragerDetalleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CotizacionTragerDetalleWhereInput | CotizacionTragerDetalleWhereInput[]
    OR?: CotizacionTragerDetalleWhereInput[]
    NOT?: CotizacionTragerDetalleWhereInput | CotizacionTragerDetalleWhereInput[]
    cotizacionId?: IntFilter<"CotizacionTragerDetalle"> | number
    productoId?: IntFilter<"CotizacionTragerDetalle"> | number
    cantidad?: IntFilter<"CotizacionTragerDetalle"> | number
    precioUnitario?: FloatFilter<"CotizacionTragerDetalle"> | number
    descuentoPct?: FloatFilter<"CotizacionTragerDetalle"> | number
    subtotal?: FloatFilter<"CotizacionTragerDetalle"> | number
    stockDisponible?: IntNullableFilter<"CotizacionTragerDetalle"> | number | null
    observacion?: StringNullableFilter<"CotizacionTragerDetalle"> | string | null
    cotizacion?: XOR<CotizacionTragerScalarRelationFilter, CotizacionTragerWhereInput>
    producto?: XOR<ProductoScalarRelationFilter, ProductoWhereInput>
  }, "id">

  export type CotizacionTragerDetalleOrderByWithAggregationInput = {
    id?: SortOrder
    cotizacionId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnitario?: SortOrder
    descuentoPct?: SortOrder
    subtotal?: SortOrder
    stockDisponible?: SortOrderInput | SortOrder
    observacion?: SortOrderInput | SortOrder
    _count?: CotizacionTragerDetalleCountOrderByAggregateInput
    _avg?: CotizacionTragerDetalleAvgOrderByAggregateInput
    _max?: CotizacionTragerDetalleMaxOrderByAggregateInput
    _min?: CotizacionTragerDetalleMinOrderByAggregateInput
    _sum?: CotizacionTragerDetalleSumOrderByAggregateInput
  }

  export type CotizacionTragerDetalleScalarWhereWithAggregatesInput = {
    AND?: CotizacionTragerDetalleScalarWhereWithAggregatesInput | CotizacionTragerDetalleScalarWhereWithAggregatesInput[]
    OR?: CotizacionTragerDetalleScalarWhereWithAggregatesInput[]
    NOT?: CotizacionTragerDetalleScalarWhereWithAggregatesInput | CotizacionTragerDetalleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CotizacionTragerDetalle"> | number
    cotizacionId?: IntWithAggregatesFilter<"CotizacionTragerDetalle"> | number
    productoId?: IntWithAggregatesFilter<"CotizacionTragerDetalle"> | number
    cantidad?: IntWithAggregatesFilter<"CotizacionTragerDetalle"> | number
    precioUnitario?: FloatWithAggregatesFilter<"CotizacionTragerDetalle"> | number
    descuentoPct?: FloatWithAggregatesFilter<"CotizacionTragerDetalle"> | number
    subtotal?: FloatWithAggregatesFilter<"CotizacionTragerDetalle"> | number
    stockDisponible?: IntNullableWithAggregatesFilter<"CotizacionTragerDetalle"> | number | null
    observacion?: StringNullableWithAggregatesFilter<"CotizacionTragerDetalle"> | string | null
  }

  export type ClienteCreateInput = {
    nombre: string
    rut?: string | null
    contactoNombre?: string | null
    contactoTelefono?: string | null
    contactoCorreo?: string | null
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClienteUncheckedCreateInput = {
    id?: number
    nombre: string
    rut?: string | null
    contactoNombre?: string | null
    contactoTelefono?: string | null
    contactoCorreo?: string | null
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClienteUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    contactoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    contactoTelefono?: NullableStringFieldUpdateOperationsInput | string | null
    contactoCorreo?: NullableStringFieldUpdateOperationsInput | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    contactoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    contactoTelefono?: NullableStringFieldUpdateOperationsInput | string | null
    contactoCorreo?: NullableStringFieldUpdateOperationsInput | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteCreateManyInput = {
    id?: number
    nombre: string
    rut?: string | null
    contactoNombre?: string | null
    contactoTelefono?: string | null
    contactoCorreo?: string | null
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClienteUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    contactoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    contactoTelefono?: NullableStringFieldUpdateOperationsInput | string | null
    contactoCorreo?: NullableStringFieldUpdateOperationsInput | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    rut?: NullableStringFieldUpdateOperationsInput | string | null
    contactoNombre?: NullableStringFieldUpdateOperationsInput | string | null
    contactoTelefono?: NullableStringFieldUpdateOperationsInput | string | null
    contactoCorreo?: NullableStringFieldUpdateOperationsInput | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FunnelTragerOpportunityCreateInput = {
    cliente: string
    contacto?: string | null
    telefono?: string | null
    correo?: string | null
    tipoCliente?: string | null
    rutEmpresa?: string | null
    region?: string | null
    comuna?: string | null
    unidadNegocio?: string | null
    productoId?: number | null
    cantidadEstimada?: number | null
    urgencia?: string | null
    tipoUso?: string | null
    necesidadSoporteTecnico?: boolean | null
    alternativaProducto?: string | null
    comision?: number | null
    margenEstimado?: number | null
    fechaComprometidaEnvio?: Date | string | null
    versionCotizacion?: string | null
    comentariosCliente?: string | null
    objeciones?: string | null
    ordenCompra?: string | null
    correoAceptacion?: string | null
    condicionesComerciales?: string | null
    coordinacionAdministrativa?: string | null
    estadoDocumentacion?: string | null
    traspasoAdministracion?: boolean | null
    traspasoERP?: boolean | null
    coordinacionDespacho?: string | null
    estadoComercialOrden?: string | null
    estadoDocumentacionVenta?: string | null
    responsable?: string | null
    etapa?: string
    montoEstimado?: number
    probabilidadCierre?: number | null
    proximaAccion?: string | null
    fechaProximaAccion?: Date | string | null
    observaciones?: string | null
    origen?: string | null
    estadoStock?: string | null
    cotizacionId?: number | null
    motivoPerdida?: string | null
    motivoPostergacion?: string | null
    fechaReactivacion?: Date | string | null
    documentoRespaldo?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    probabilidad?: number | null
    flujoPosterior?: string | null
    motivoDescarte?: string | null
    tipoBroker?: string | null
    fechaEstimadaDespacho?: Date | string | null
    fechaSeguimientoPostventa?: Date | string | null
    nombreOportunidad?: string | null
    cargoContacto?: string | null
    direccionProyecto?: string | null
    tipoOportunidad?: string | null
    fechaProbableCierre?: Date | string | null
    riesgoTecnico?: string | null
    comentariosInternos?: string | null
    observacionesTecnicas?: string | null
    observacionCamposFaltantes?: string | null
    lineaProducto?: string | null
    descuento?: number | null
    stockOportunidad?: string | null
    reprogramacionesCount?: number
    fechaUltimoCambioEtapa?: Date | string | null
    esReactivacion?: boolean
    archivos?: FunnelTragerArchivoCreateNestedManyWithoutOportunidadInput
    historialEtapas?: HistorialEtapaTragerCreateNestedManyWithoutOportunidadInput
  }

  export type FunnelTragerOpportunityUncheckedCreateInput = {
    id?: number
    cliente: string
    contacto?: string | null
    telefono?: string | null
    correo?: string | null
    tipoCliente?: string | null
    rutEmpresa?: string | null
    region?: string | null
    comuna?: string | null
    unidadNegocio?: string | null
    productoId?: number | null
    cantidadEstimada?: number | null
    urgencia?: string | null
    tipoUso?: string | null
    necesidadSoporteTecnico?: boolean | null
    alternativaProducto?: string | null
    comision?: number | null
    margenEstimado?: number | null
    fechaComprometidaEnvio?: Date | string | null
    versionCotizacion?: string | null
    comentariosCliente?: string | null
    objeciones?: string | null
    ordenCompra?: string | null
    correoAceptacion?: string | null
    condicionesComerciales?: string | null
    coordinacionAdministrativa?: string | null
    estadoDocumentacion?: string | null
    traspasoAdministracion?: boolean | null
    traspasoERP?: boolean | null
    coordinacionDespacho?: string | null
    estadoComercialOrden?: string | null
    estadoDocumentacionVenta?: string | null
    responsable?: string | null
    etapa?: string
    montoEstimado?: number
    probabilidadCierre?: number | null
    proximaAccion?: string | null
    fechaProximaAccion?: Date | string | null
    observaciones?: string | null
    origen?: string | null
    estadoStock?: string | null
    cotizacionId?: number | null
    motivoPerdida?: string | null
    motivoPostergacion?: string | null
    fechaReactivacion?: Date | string | null
    documentoRespaldo?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    probabilidad?: number | null
    flujoPosterior?: string | null
    motivoDescarte?: string | null
    tipoBroker?: string | null
    fechaEstimadaDespacho?: Date | string | null
    fechaSeguimientoPostventa?: Date | string | null
    nombreOportunidad?: string | null
    cargoContacto?: string | null
    direccionProyecto?: string | null
    tipoOportunidad?: string | null
    fechaProbableCierre?: Date | string | null
    riesgoTecnico?: string | null
    comentariosInternos?: string | null
    observacionesTecnicas?: string | null
    observacionCamposFaltantes?: string | null
    lineaProducto?: string | null
    descuento?: number | null
    stockOportunidad?: string | null
    reprogramacionesCount?: number
    fechaUltimoCambioEtapa?: Date | string | null
    esReactivacion?: boolean
    archivos?: FunnelTragerArchivoUncheckedCreateNestedManyWithoutOportunidadInput
    historialEtapas?: HistorialEtapaTragerUncheckedCreateNestedManyWithoutOportunidadInput
  }

  export type FunnelTragerOpportunityUpdateInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    rutEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    comuna?: NullableStringFieldUpdateOperationsInput | string | null
    unidadNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    productoId?: NullableIntFieldUpdateOperationsInput | number | null
    cantidadEstimada?: NullableIntFieldUpdateOperationsInput | number | null
    urgencia?: NullableStringFieldUpdateOperationsInput | string | null
    tipoUso?: NullableStringFieldUpdateOperationsInput | string | null
    necesidadSoporteTecnico?: NullableBoolFieldUpdateOperationsInput | boolean | null
    alternativaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    comision?: NullableFloatFieldUpdateOperationsInput | number | null
    margenEstimado?: NullableFloatFieldUpdateOperationsInput | number | null
    fechaComprometidaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versionCotizacion?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosCliente?: NullableStringFieldUpdateOperationsInput | string | null
    objeciones?: NullableStringFieldUpdateOperationsInput | string | null
    ordenCompra?: NullableStringFieldUpdateOperationsInput | string | null
    correoAceptacion?: NullableStringFieldUpdateOperationsInput | string | null
    condicionesComerciales?: NullableStringFieldUpdateOperationsInput | string | null
    coordinacionAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacion?: NullableStringFieldUpdateOperationsInput | string | null
    traspasoAdministracion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    traspasoERP?: NullableBoolFieldUpdateOperationsInput | boolean | null
    coordinacionDespacho?: NullableStringFieldUpdateOperationsInput | string | null
    estadoComercialOrden?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacionVenta?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    etapa?: StringFieldUpdateOperationsInput | string
    montoEstimado?: FloatFieldUpdateOperationsInput | number
    probabilidadCierre?: NullableIntFieldUpdateOperationsInput | number | null
    proximaAccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProximaAccion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    origen?: NullableStringFieldUpdateOperationsInput | string | null
    estadoStock?: NullableStringFieldUpdateOperationsInput | string | null
    cotizacionId?: NullableIntFieldUpdateOperationsInput | number | null
    motivoPerdida?: NullableStringFieldUpdateOperationsInput | string | null
    motivoPostergacion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaReactivacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documentoRespaldo?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    probabilidad?: NullableIntFieldUpdateOperationsInput | number | null
    flujoPosterior?: NullableStringFieldUpdateOperationsInput | string | null
    motivoDescarte?: NullableStringFieldUpdateOperationsInput | string | null
    tipoBroker?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEstimadaDespacho?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimientoPostventa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nombreOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    cargoContacto?: NullableStringFieldUpdateOperationsInput | string | null
    direccionProyecto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProbableCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riesgoTecnico?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosInternos?: NullableStringFieldUpdateOperationsInput | string | null
    observacionesTecnicas?: NullableStringFieldUpdateOperationsInput | string | null
    observacionCamposFaltantes?: NullableStringFieldUpdateOperationsInput | string | null
    lineaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    descuento?: NullableFloatFieldUpdateOperationsInput | number | null
    stockOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    reprogramacionesCount?: IntFieldUpdateOperationsInput | number
    fechaUltimoCambioEtapa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    esReactivacion?: BoolFieldUpdateOperationsInput | boolean
    archivos?: FunnelTragerArchivoUpdateManyWithoutOportunidadNestedInput
    historialEtapas?: HistorialEtapaTragerUpdateManyWithoutOportunidadNestedInput
  }

  export type FunnelTragerOpportunityUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    rutEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    comuna?: NullableStringFieldUpdateOperationsInput | string | null
    unidadNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    productoId?: NullableIntFieldUpdateOperationsInput | number | null
    cantidadEstimada?: NullableIntFieldUpdateOperationsInput | number | null
    urgencia?: NullableStringFieldUpdateOperationsInput | string | null
    tipoUso?: NullableStringFieldUpdateOperationsInput | string | null
    necesidadSoporteTecnico?: NullableBoolFieldUpdateOperationsInput | boolean | null
    alternativaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    comision?: NullableFloatFieldUpdateOperationsInput | number | null
    margenEstimado?: NullableFloatFieldUpdateOperationsInput | number | null
    fechaComprometidaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versionCotizacion?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosCliente?: NullableStringFieldUpdateOperationsInput | string | null
    objeciones?: NullableStringFieldUpdateOperationsInput | string | null
    ordenCompra?: NullableStringFieldUpdateOperationsInput | string | null
    correoAceptacion?: NullableStringFieldUpdateOperationsInput | string | null
    condicionesComerciales?: NullableStringFieldUpdateOperationsInput | string | null
    coordinacionAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacion?: NullableStringFieldUpdateOperationsInput | string | null
    traspasoAdministracion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    traspasoERP?: NullableBoolFieldUpdateOperationsInput | boolean | null
    coordinacionDespacho?: NullableStringFieldUpdateOperationsInput | string | null
    estadoComercialOrden?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacionVenta?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    etapa?: StringFieldUpdateOperationsInput | string
    montoEstimado?: FloatFieldUpdateOperationsInput | number
    probabilidadCierre?: NullableIntFieldUpdateOperationsInput | number | null
    proximaAccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProximaAccion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    origen?: NullableStringFieldUpdateOperationsInput | string | null
    estadoStock?: NullableStringFieldUpdateOperationsInput | string | null
    cotizacionId?: NullableIntFieldUpdateOperationsInput | number | null
    motivoPerdida?: NullableStringFieldUpdateOperationsInput | string | null
    motivoPostergacion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaReactivacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documentoRespaldo?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    probabilidad?: NullableIntFieldUpdateOperationsInput | number | null
    flujoPosterior?: NullableStringFieldUpdateOperationsInput | string | null
    motivoDescarte?: NullableStringFieldUpdateOperationsInput | string | null
    tipoBroker?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEstimadaDespacho?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimientoPostventa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nombreOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    cargoContacto?: NullableStringFieldUpdateOperationsInput | string | null
    direccionProyecto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProbableCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riesgoTecnico?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosInternos?: NullableStringFieldUpdateOperationsInput | string | null
    observacionesTecnicas?: NullableStringFieldUpdateOperationsInput | string | null
    observacionCamposFaltantes?: NullableStringFieldUpdateOperationsInput | string | null
    lineaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    descuento?: NullableFloatFieldUpdateOperationsInput | number | null
    stockOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    reprogramacionesCount?: IntFieldUpdateOperationsInput | number
    fechaUltimoCambioEtapa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    esReactivacion?: BoolFieldUpdateOperationsInput | boolean
    archivos?: FunnelTragerArchivoUncheckedUpdateManyWithoutOportunidadNestedInput
    historialEtapas?: HistorialEtapaTragerUncheckedUpdateManyWithoutOportunidadNestedInput
  }

  export type FunnelTragerOpportunityCreateManyInput = {
    id?: number
    cliente: string
    contacto?: string | null
    telefono?: string | null
    correo?: string | null
    tipoCliente?: string | null
    rutEmpresa?: string | null
    region?: string | null
    comuna?: string | null
    unidadNegocio?: string | null
    productoId?: number | null
    cantidadEstimada?: number | null
    urgencia?: string | null
    tipoUso?: string | null
    necesidadSoporteTecnico?: boolean | null
    alternativaProducto?: string | null
    comision?: number | null
    margenEstimado?: number | null
    fechaComprometidaEnvio?: Date | string | null
    versionCotizacion?: string | null
    comentariosCliente?: string | null
    objeciones?: string | null
    ordenCompra?: string | null
    correoAceptacion?: string | null
    condicionesComerciales?: string | null
    coordinacionAdministrativa?: string | null
    estadoDocumentacion?: string | null
    traspasoAdministracion?: boolean | null
    traspasoERP?: boolean | null
    coordinacionDespacho?: string | null
    estadoComercialOrden?: string | null
    estadoDocumentacionVenta?: string | null
    responsable?: string | null
    etapa?: string
    montoEstimado?: number
    probabilidadCierre?: number | null
    proximaAccion?: string | null
    fechaProximaAccion?: Date | string | null
    observaciones?: string | null
    origen?: string | null
    estadoStock?: string | null
    cotizacionId?: number | null
    motivoPerdida?: string | null
    motivoPostergacion?: string | null
    fechaReactivacion?: Date | string | null
    documentoRespaldo?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    probabilidad?: number | null
    flujoPosterior?: string | null
    motivoDescarte?: string | null
    tipoBroker?: string | null
    fechaEstimadaDespacho?: Date | string | null
    fechaSeguimientoPostventa?: Date | string | null
    nombreOportunidad?: string | null
    cargoContacto?: string | null
    direccionProyecto?: string | null
    tipoOportunidad?: string | null
    fechaProbableCierre?: Date | string | null
    riesgoTecnico?: string | null
    comentariosInternos?: string | null
    observacionesTecnicas?: string | null
    observacionCamposFaltantes?: string | null
    lineaProducto?: string | null
    descuento?: number | null
    stockOportunidad?: string | null
    reprogramacionesCount?: number
    fechaUltimoCambioEtapa?: Date | string | null
    esReactivacion?: boolean
  }

  export type FunnelTragerOpportunityUpdateManyMutationInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    rutEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    comuna?: NullableStringFieldUpdateOperationsInput | string | null
    unidadNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    productoId?: NullableIntFieldUpdateOperationsInput | number | null
    cantidadEstimada?: NullableIntFieldUpdateOperationsInput | number | null
    urgencia?: NullableStringFieldUpdateOperationsInput | string | null
    tipoUso?: NullableStringFieldUpdateOperationsInput | string | null
    necesidadSoporteTecnico?: NullableBoolFieldUpdateOperationsInput | boolean | null
    alternativaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    comision?: NullableFloatFieldUpdateOperationsInput | number | null
    margenEstimado?: NullableFloatFieldUpdateOperationsInput | number | null
    fechaComprometidaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versionCotizacion?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosCliente?: NullableStringFieldUpdateOperationsInput | string | null
    objeciones?: NullableStringFieldUpdateOperationsInput | string | null
    ordenCompra?: NullableStringFieldUpdateOperationsInput | string | null
    correoAceptacion?: NullableStringFieldUpdateOperationsInput | string | null
    condicionesComerciales?: NullableStringFieldUpdateOperationsInput | string | null
    coordinacionAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacion?: NullableStringFieldUpdateOperationsInput | string | null
    traspasoAdministracion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    traspasoERP?: NullableBoolFieldUpdateOperationsInput | boolean | null
    coordinacionDespacho?: NullableStringFieldUpdateOperationsInput | string | null
    estadoComercialOrden?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacionVenta?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    etapa?: StringFieldUpdateOperationsInput | string
    montoEstimado?: FloatFieldUpdateOperationsInput | number
    probabilidadCierre?: NullableIntFieldUpdateOperationsInput | number | null
    proximaAccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProximaAccion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    origen?: NullableStringFieldUpdateOperationsInput | string | null
    estadoStock?: NullableStringFieldUpdateOperationsInput | string | null
    cotizacionId?: NullableIntFieldUpdateOperationsInput | number | null
    motivoPerdida?: NullableStringFieldUpdateOperationsInput | string | null
    motivoPostergacion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaReactivacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documentoRespaldo?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    probabilidad?: NullableIntFieldUpdateOperationsInput | number | null
    flujoPosterior?: NullableStringFieldUpdateOperationsInput | string | null
    motivoDescarte?: NullableStringFieldUpdateOperationsInput | string | null
    tipoBroker?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEstimadaDespacho?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimientoPostventa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nombreOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    cargoContacto?: NullableStringFieldUpdateOperationsInput | string | null
    direccionProyecto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProbableCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riesgoTecnico?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosInternos?: NullableStringFieldUpdateOperationsInput | string | null
    observacionesTecnicas?: NullableStringFieldUpdateOperationsInput | string | null
    observacionCamposFaltantes?: NullableStringFieldUpdateOperationsInput | string | null
    lineaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    descuento?: NullableFloatFieldUpdateOperationsInput | number | null
    stockOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    reprogramacionesCount?: IntFieldUpdateOperationsInput | number
    fechaUltimoCambioEtapa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    esReactivacion?: BoolFieldUpdateOperationsInput | boolean
  }

  export type FunnelTragerOpportunityUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    rutEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    comuna?: NullableStringFieldUpdateOperationsInput | string | null
    unidadNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    productoId?: NullableIntFieldUpdateOperationsInput | number | null
    cantidadEstimada?: NullableIntFieldUpdateOperationsInput | number | null
    urgencia?: NullableStringFieldUpdateOperationsInput | string | null
    tipoUso?: NullableStringFieldUpdateOperationsInput | string | null
    necesidadSoporteTecnico?: NullableBoolFieldUpdateOperationsInput | boolean | null
    alternativaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    comision?: NullableFloatFieldUpdateOperationsInput | number | null
    margenEstimado?: NullableFloatFieldUpdateOperationsInput | number | null
    fechaComprometidaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versionCotizacion?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosCliente?: NullableStringFieldUpdateOperationsInput | string | null
    objeciones?: NullableStringFieldUpdateOperationsInput | string | null
    ordenCompra?: NullableStringFieldUpdateOperationsInput | string | null
    correoAceptacion?: NullableStringFieldUpdateOperationsInput | string | null
    condicionesComerciales?: NullableStringFieldUpdateOperationsInput | string | null
    coordinacionAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacion?: NullableStringFieldUpdateOperationsInput | string | null
    traspasoAdministracion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    traspasoERP?: NullableBoolFieldUpdateOperationsInput | boolean | null
    coordinacionDespacho?: NullableStringFieldUpdateOperationsInput | string | null
    estadoComercialOrden?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacionVenta?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    etapa?: StringFieldUpdateOperationsInput | string
    montoEstimado?: FloatFieldUpdateOperationsInput | number
    probabilidadCierre?: NullableIntFieldUpdateOperationsInput | number | null
    proximaAccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProximaAccion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    origen?: NullableStringFieldUpdateOperationsInput | string | null
    estadoStock?: NullableStringFieldUpdateOperationsInput | string | null
    cotizacionId?: NullableIntFieldUpdateOperationsInput | number | null
    motivoPerdida?: NullableStringFieldUpdateOperationsInput | string | null
    motivoPostergacion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaReactivacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documentoRespaldo?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    probabilidad?: NullableIntFieldUpdateOperationsInput | number | null
    flujoPosterior?: NullableStringFieldUpdateOperationsInput | string | null
    motivoDescarte?: NullableStringFieldUpdateOperationsInput | string | null
    tipoBroker?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEstimadaDespacho?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimientoPostventa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nombreOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    cargoContacto?: NullableStringFieldUpdateOperationsInput | string | null
    direccionProyecto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProbableCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riesgoTecnico?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosInternos?: NullableStringFieldUpdateOperationsInput | string | null
    observacionesTecnicas?: NullableStringFieldUpdateOperationsInput | string | null
    observacionCamposFaltantes?: NullableStringFieldUpdateOperationsInput | string | null
    lineaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    descuento?: NullableFloatFieldUpdateOperationsInput | number | null
    stockOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    reprogramacionesCount?: IntFieldUpdateOperationsInput | number
    fechaUltimoCambioEtapa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    esReactivacion?: BoolFieldUpdateOperationsInput | boolean
  }

  export type FunnelTragerArchivoCreateInput = {
    tipo: string
    url: string
    publicId: string
    nombreArchivo?: string | null
    mimeType?: string | null
    bytes?: number | null
    etapa?: string | null
    observaciones?: string | null
    createdAt?: Date | string
    oportunidad: FunnelTragerOpportunityCreateNestedOneWithoutArchivosInput
  }

  export type FunnelTragerArchivoUncheckedCreateInput = {
    id?: number
    oportunidadId: number
    tipo: string
    url: string
    publicId: string
    nombreArchivo?: string | null
    mimeType?: string | null
    bytes?: number | null
    etapa?: string | null
    observaciones?: string | null
    createdAt?: Date | string
  }

  export type FunnelTragerArchivoUpdateInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    nombreArchivo?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    bytes?: NullableIntFieldUpdateOperationsInput | number | null
    etapa?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oportunidad?: FunnelTragerOpportunityUpdateOneRequiredWithoutArchivosNestedInput
  }

  export type FunnelTragerArchivoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    oportunidadId?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    nombreArchivo?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    bytes?: NullableIntFieldUpdateOperationsInput | number | null
    etapa?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FunnelTragerArchivoCreateManyInput = {
    id?: number
    oportunidadId: number
    tipo: string
    url: string
    publicId: string
    nombreArchivo?: string | null
    mimeType?: string | null
    bytes?: number | null
    etapa?: string | null
    observaciones?: string | null
    createdAt?: Date | string
  }

  export type FunnelTragerArchivoUpdateManyMutationInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    nombreArchivo?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    bytes?: NullableIntFieldUpdateOperationsInput | number | null
    etapa?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FunnelTragerArchivoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    oportunidadId?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    nombreArchivo?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    bytes?: NullableIntFieldUpdateOperationsInput | number | null
    etapa?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialEtapaTragerCreateInput = {
    etapaAnterior?: string | null
    etapaNueva: string
    usuarioId?: string | null
    createdAt?: Date | string
    oportunidad: FunnelTragerOpportunityCreateNestedOneWithoutHistorialEtapasInput
  }

  export type HistorialEtapaTragerUncheckedCreateInput = {
    id?: number
    oportunidadId: number
    etapaAnterior?: string | null
    etapaNueva: string
    usuarioId?: string | null
    createdAt?: Date | string
  }

  export type HistorialEtapaTragerUpdateInput = {
    etapaAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    etapaNueva?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oportunidad?: FunnelTragerOpportunityUpdateOneRequiredWithoutHistorialEtapasNestedInput
  }

  export type HistorialEtapaTragerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    oportunidadId?: IntFieldUpdateOperationsInput | number
    etapaAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    etapaNueva?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialEtapaTragerCreateManyInput = {
    id?: number
    oportunidadId: number
    etapaAnterior?: string | null
    etapaNueva: string
    usuarioId?: string | null
    createdAt?: Date | string
  }

  export type HistorialEtapaTragerUpdateManyMutationInput = {
    etapaAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    etapaNueva?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialEtapaTragerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    oportunidadId?: IntFieldUpdateOperationsInput | number
    etapaAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    etapaNueva?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoriaCreateInput = {
    nombre: string
    Producto?: ProductoCreateNestedManyWithoutCategoriaInput
  }

  export type CategoriaUncheckedCreateInput = {
    id?: number
    nombre: string
    Producto?: ProductoUncheckedCreateNestedManyWithoutCategoriaInput
  }

  export type CategoriaUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    Producto?: ProductoUpdateManyWithoutCategoriaNestedInput
  }

  export type CategoriaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    Producto?: ProductoUncheckedUpdateManyWithoutCategoriaNestedInput
  }

  export type CategoriaCreateManyInput = {
    id?: number
    nombre: string
  }

  export type CategoriaUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type CategoriaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type ProductoCreateInput = {
    nombre: string
    descripcion?: string | null
    stock: number
    ubicacion?: string | null
    createdAt?: Date | string
    precio: number
    minStock?: number
    activo?: boolean
    criticidad?: string
    imagen?: string | null
    stockReservado?: number
    sku?: string | null
    disponibilidad?: string | null
    formato?: string | null
    cantidadCaja?: string | null
    precioUsd?: number | null
    precioSugerido?: number | null
    stockInicial?: number | null
    Categoria: CategoriaCreateNestedOneWithoutProductoInput
    CotizacionTragerDetalle?: CotizacionTragerDetalleCreateNestedManyWithoutProductoInput
  }

  export type ProductoUncheckedCreateInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    stock: number
    ubicacion?: string | null
    createdAt?: Date | string
    precio: number
    minStock?: number
    activo?: boolean
    criticidad?: string
    imagen?: string | null
    categoriaId: number
    stockReservado?: number
    sku?: string | null
    disponibilidad?: string | null
    formato?: string | null
    cantidadCaja?: string | null
    precioUsd?: number | null
    precioSugerido?: number | null
    stockInicial?: number | null
    CotizacionTragerDetalle?: CotizacionTragerDetalleUncheckedCreateNestedManyWithoutProductoInput
  }

  export type ProductoUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    precio?: FloatFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    criticidad?: StringFieldUpdateOperationsInput | string
    imagen?: NullableStringFieldUpdateOperationsInput | string | null
    stockReservado?: IntFieldUpdateOperationsInput | number
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilidad?: NullableStringFieldUpdateOperationsInput | string | null
    formato?: NullableStringFieldUpdateOperationsInput | string | null
    cantidadCaja?: NullableStringFieldUpdateOperationsInput | string | null
    precioUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    precioSugerido?: NullableFloatFieldUpdateOperationsInput | number | null
    stockInicial?: NullableIntFieldUpdateOperationsInput | number | null
    Categoria?: CategoriaUpdateOneRequiredWithoutProductoNestedInput
    CotizacionTragerDetalle?: CotizacionTragerDetalleUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    precio?: FloatFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    criticidad?: StringFieldUpdateOperationsInput | string
    imagen?: NullableStringFieldUpdateOperationsInput | string | null
    categoriaId?: IntFieldUpdateOperationsInput | number
    stockReservado?: IntFieldUpdateOperationsInput | number
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilidad?: NullableStringFieldUpdateOperationsInput | string | null
    formato?: NullableStringFieldUpdateOperationsInput | string | null
    cantidadCaja?: NullableStringFieldUpdateOperationsInput | string | null
    precioUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    precioSugerido?: NullableFloatFieldUpdateOperationsInput | number | null
    stockInicial?: NullableIntFieldUpdateOperationsInput | number | null
    CotizacionTragerDetalle?: CotizacionTragerDetalleUncheckedUpdateManyWithoutProductoNestedInput
  }

  export type ProductoCreateManyInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    stock: number
    ubicacion?: string | null
    createdAt?: Date | string
    precio: number
    minStock?: number
    activo?: boolean
    criticidad?: string
    imagen?: string | null
    categoriaId: number
    stockReservado?: number
    sku?: string | null
    disponibilidad?: string | null
    formato?: string | null
    cantidadCaja?: string | null
    precioUsd?: number | null
    precioSugerido?: number | null
    stockInicial?: number | null
  }

  export type ProductoUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    precio?: FloatFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    criticidad?: StringFieldUpdateOperationsInput | string
    imagen?: NullableStringFieldUpdateOperationsInput | string | null
    stockReservado?: IntFieldUpdateOperationsInput | number
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilidad?: NullableStringFieldUpdateOperationsInput | string | null
    formato?: NullableStringFieldUpdateOperationsInput | string | null
    cantidadCaja?: NullableStringFieldUpdateOperationsInput | string | null
    precioUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    precioSugerido?: NullableFloatFieldUpdateOperationsInput | number | null
    stockInicial?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProductoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    precio?: FloatFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    criticidad?: StringFieldUpdateOperationsInput | string
    imagen?: NullableStringFieldUpdateOperationsInput | string | null
    categoriaId?: IntFieldUpdateOperationsInput | number
    stockReservado?: IntFieldUpdateOperationsInput | number
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilidad?: NullableStringFieldUpdateOperationsInput | string | null
    formato?: NullableStringFieldUpdateOperationsInput | string | null
    cantidadCaja?: NullableStringFieldUpdateOperationsInput | string | null
    precioUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    precioSugerido?: NullableFloatFieldUpdateOperationsInput | number | null
    stockInicial?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CotizacionTragerCreateInput = {
    cliente: string
    contacto?: string | null
    tipoCliente?: string | null
    responsable?: string | null
    estado?: string
    subtotal?: number
    descuento?: number
    impuesto?: number
    total?: number
    fechaCotizacion?: Date | string
    fechaVencimiento?: Date | string | null
    fechaEnvio?: Date | string | null
    fechaSeguimiento?: Date | string | null
    fechaCierre?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    numero?: string | null
    detalles?: CotizacionTragerDetalleCreateNestedManyWithoutCotizacionInput
  }

  export type CotizacionTragerUncheckedCreateInput = {
    id?: number
    cliente: string
    contacto?: string | null
    tipoCliente?: string | null
    responsable?: string | null
    estado?: string
    subtotal?: number
    descuento?: number
    impuesto?: number
    total?: number
    fechaCotizacion?: Date | string
    fechaVencimiento?: Date | string | null
    fechaEnvio?: Date | string | null
    fechaSeguimiento?: Date | string | null
    fechaCierre?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    numero?: string | null
    detalles?: CotizacionTragerDetalleUncheckedCreateNestedManyWithoutCotizacionInput
  }

  export type CotizacionTragerUpdateInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    descuento?: FloatFieldUpdateOperationsInput | number
    impuesto?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fechaCotizacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaVencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    detalles?: CotizacionTragerDetalleUpdateManyWithoutCotizacionNestedInput
  }

  export type CotizacionTragerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    descuento?: FloatFieldUpdateOperationsInput | number
    impuesto?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fechaCotizacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaVencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
    detalles?: CotizacionTragerDetalleUncheckedUpdateManyWithoutCotizacionNestedInput
  }

  export type CotizacionTragerCreateManyInput = {
    id?: number
    cliente: string
    contacto?: string | null
    tipoCliente?: string | null
    responsable?: string | null
    estado?: string
    subtotal?: number
    descuento?: number
    impuesto?: number
    total?: number
    fechaCotizacion?: Date | string
    fechaVencimiento?: Date | string | null
    fechaEnvio?: Date | string | null
    fechaSeguimiento?: Date | string | null
    fechaCierre?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    numero?: string | null
  }

  export type CotizacionTragerUpdateManyMutationInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    descuento?: FloatFieldUpdateOperationsInput | number
    impuesto?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fechaCotizacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaVencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CotizacionTragerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    descuento?: FloatFieldUpdateOperationsInput | number
    impuesto?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fechaCotizacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaVencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CotizacionTragerDetalleCreateInput = {
    cantidad: number
    precioUnitario: number
    descuentoPct?: number
    subtotal: number
    stockDisponible?: number | null
    observacion?: string | null
    cotizacion: CotizacionTragerCreateNestedOneWithoutDetallesInput
    producto: ProductoCreateNestedOneWithoutCotizacionTragerDetalleInput
  }

  export type CotizacionTragerDetalleUncheckedCreateInput = {
    id?: number
    cotizacionId: number
    productoId: number
    cantidad: number
    precioUnitario: number
    descuentoPct?: number
    subtotal: number
    stockDisponible?: number | null
    observacion?: string | null
  }

  export type CotizacionTragerDetalleUpdateInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnitario?: FloatFieldUpdateOperationsInput | number
    descuentoPct?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    stockDisponible?: NullableIntFieldUpdateOperationsInput | number | null
    observacion?: NullableStringFieldUpdateOperationsInput | string | null
    cotizacion?: CotizacionTragerUpdateOneRequiredWithoutDetallesNestedInput
    producto?: ProductoUpdateOneRequiredWithoutCotizacionTragerDetalleNestedInput
  }

  export type CotizacionTragerDetalleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cotizacionId?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnitario?: FloatFieldUpdateOperationsInput | number
    descuentoPct?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    stockDisponible?: NullableIntFieldUpdateOperationsInput | number | null
    observacion?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CotizacionTragerDetalleCreateManyInput = {
    id?: number
    cotizacionId: number
    productoId: number
    cantidad: number
    precioUnitario: number
    descuentoPct?: number
    subtotal: number
    stockDisponible?: number | null
    observacion?: string | null
  }

  export type CotizacionTragerDetalleUpdateManyMutationInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnitario?: FloatFieldUpdateOperationsInput | number
    descuentoPct?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    stockDisponible?: NullableIntFieldUpdateOperationsInput | number | null
    observacion?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CotizacionTragerDetalleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cotizacionId?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnitario?: FloatFieldUpdateOperationsInput | number
    descuentoPct?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    stockDisponible?: NullableIntFieldUpdateOperationsInput | number | null
    observacion?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ClienteCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    rut?: SortOrder
    contactoNombre?: SortOrder
    contactoTelefono?: SortOrder
    contactoCorreo?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClienteAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    rut?: SortOrder
    contactoNombre?: SortOrder
    contactoTelefono?: SortOrder
    contactoCorreo?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClienteMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    rut?: SortOrder
    contactoNombre?: SortOrder
    contactoTelefono?: SortOrder
    contactoCorreo?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClienteSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type FunnelTragerArchivoListRelationFilter = {
    every?: FunnelTragerArchivoWhereInput
    some?: FunnelTragerArchivoWhereInput
    none?: FunnelTragerArchivoWhereInput
  }

  export type HistorialEtapaTragerListRelationFilter = {
    every?: HistorialEtapaTragerWhereInput
    some?: HistorialEtapaTragerWhereInput
    none?: HistorialEtapaTragerWhereInput
  }

  export type FunnelTragerArchivoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HistorialEtapaTragerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FunnelTragerOpportunityCountOrderByAggregateInput = {
    id?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrder
    telefono?: SortOrder
    correo?: SortOrder
    tipoCliente?: SortOrder
    rutEmpresa?: SortOrder
    region?: SortOrder
    comuna?: SortOrder
    unidadNegocio?: SortOrder
    productoId?: SortOrder
    cantidadEstimada?: SortOrder
    urgencia?: SortOrder
    tipoUso?: SortOrder
    necesidadSoporteTecnico?: SortOrder
    alternativaProducto?: SortOrder
    comision?: SortOrder
    margenEstimado?: SortOrder
    fechaComprometidaEnvio?: SortOrder
    versionCotizacion?: SortOrder
    comentariosCliente?: SortOrder
    objeciones?: SortOrder
    ordenCompra?: SortOrder
    correoAceptacion?: SortOrder
    condicionesComerciales?: SortOrder
    coordinacionAdministrativa?: SortOrder
    estadoDocumentacion?: SortOrder
    traspasoAdministracion?: SortOrder
    traspasoERP?: SortOrder
    coordinacionDespacho?: SortOrder
    estadoComercialOrden?: SortOrder
    estadoDocumentacionVenta?: SortOrder
    responsable?: SortOrder
    etapa?: SortOrder
    montoEstimado?: SortOrder
    probabilidadCierre?: SortOrder
    proximaAccion?: SortOrder
    fechaProximaAccion?: SortOrder
    observaciones?: SortOrder
    origen?: SortOrder
    estadoStock?: SortOrder
    cotizacionId?: SortOrder
    motivoPerdida?: SortOrder
    motivoPostergacion?: SortOrder
    fechaReactivacion?: SortOrder
    documentoRespaldo?: SortOrder
    fechaCierre?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    probabilidad?: SortOrder
    flujoPosterior?: SortOrder
    motivoDescarte?: SortOrder
    tipoBroker?: SortOrder
    fechaEstimadaDespacho?: SortOrder
    fechaSeguimientoPostventa?: SortOrder
    nombreOportunidad?: SortOrder
    cargoContacto?: SortOrder
    direccionProyecto?: SortOrder
    tipoOportunidad?: SortOrder
    fechaProbableCierre?: SortOrder
    riesgoTecnico?: SortOrder
    comentariosInternos?: SortOrder
    observacionesTecnicas?: SortOrder
    observacionCamposFaltantes?: SortOrder
    lineaProducto?: SortOrder
    descuento?: SortOrder
    stockOportunidad?: SortOrder
    reprogramacionesCount?: SortOrder
    fechaUltimoCambioEtapa?: SortOrder
    esReactivacion?: SortOrder
  }

  export type FunnelTragerOpportunityAvgOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    cantidadEstimada?: SortOrder
    comision?: SortOrder
    margenEstimado?: SortOrder
    montoEstimado?: SortOrder
    probabilidadCierre?: SortOrder
    cotizacionId?: SortOrder
    probabilidad?: SortOrder
    descuento?: SortOrder
    reprogramacionesCount?: SortOrder
  }

  export type FunnelTragerOpportunityMaxOrderByAggregateInput = {
    id?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrder
    telefono?: SortOrder
    correo?: SortOrder
    tipoCliente?: SortOrder
    rutEmpresa?: SortOrder
    region?: SortOrder
    comuna?: SortOrder
    unidadNegocio?: SortOrder
    productoId?: SortOrder
    cantidadEstimada?: SortOrder
    urgencia?: SortOrder
    tipoUso?: SortOrder
    necesidadSoporteTecnico?: SortOrder
    alternativaProducto?: SortOrder
    comision?: SortOrder
    margenEstimado?: SortOrder
    fechaComprometidaEnvio?: SortOrder
    versionCotizacion?: SortOrder
    comentariosCliente?: SortOrder
    objeciones?: SortOrder
    ordenCompra?: SortOrder
    correoAceptacion?: SortOrder
    condicionesComerciales?: SortOrder
    coordinacionAdministrativa?: SortOrder
    estadoDocumentacion?: SortOrder
    traspasoAdministracion?: SortOrder
    traspasoERP?: SortOrder
    coordinacionDespacho?: SortOrder
    estadoComercialOrden?: SortOrder
    estadoDocumentacionVenta?: SortOrder
    responsable?: SortOrder
    etapa?: SortOrder
    montoEstimado?: SortOrder
    probabilidadCierre?: SortOrder
    proximaAccion?: SortOrder
    fechaProximaAccion?: SortOrder
    observaciones?: SortOrder
    origen?: SortOrder
    estadoStock?: SortOrder
    cotizacionId?: SortOrder
    motivoPerdida?: SortOrder
    motivoPostergacion?: SortOrder
    fechaReactivacion?: SortOrder
    documentoRespaldo?: SortOrder
    fechaCierre?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    probabilidad?: SortOrder
    flujoPosterior?: SortOrder
    motivoDescarte?: SortOrder
    tipoBroker?: SortOrder
    fechaEstimadaDespacho?: SortOrder
    fechaSeguimientoPostventa?: SortOrder
    nombreOportunidad?: SortOrder
    cargoContacto?: SortOrder
    direccionProyecto?: SortOrder
    tipoOportunidad?: SortOrder
    fechaProbableCierre?: SortOrder
    riesgoTecnico?: SortOrder
    comentariosInternos?: SortOrder
    observacionesTecnicas?: SortOrder
    observacionCamposFaltantes?: SortOrder
    lineaProducto?: SortOrder
    descuento?: SortOrder
    stockOportunidad?: SortOrder
    reprogramacionesCount?: SortOrder
    fechaUltimoCambioEtapa?: SortOrder
    esReactivacion?: SortOrder
  }

  export type FunnelTragerOpportunityMinOrderByAggregateInput = {
    id?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrder
    telefono?: SortOrder
    correo?: SortOrder
    tipoCliente?: SortOrder
    rutEmpresa?: SortOrder
    region?: SortOrder
    comuna?: SortOrder
    unidadNegocio?: SortOrder
    productoId?: SortOrder
    cantidadEstimada?: SortOrder
    urgencia?: SortOrder
    tipoUso?: SortOrder
    necesidadSoporteTecnico?: SortOrder
    alternativaProducto?: SortOrder
    comision?: SortOrder
    margenEstimado?: SortOrder
    fechaComprometidaEnvio?: SortOrder
    versionCotizacion?: SortOrder
    comentariosCliente?: SortOrder
    objeciones?: SortOrder
    ordenCompra?: SortOrder
    correoAceptacion?: SortOrder
    condicionesComerciales?: SortOrder
    coordinacionAdministrativa?: SortOrder
    estadoDocumentacion?: SortOrder
    traspasoAdministracion?: SortOrder
    traspasoERP?: SortOrder
    coordinacionDespacho?: SortOrder
    estadoComercialOrden?: SortOrder
    estadoDocumentacionVenta?: SortOrder
    responsable?: SortOrder
    etapa?: SortOrder
    montoEstimado?: SortOrder
    probabilidadCierre?: SortOrder
    proximaAccion?: SortOrder
    fechaProximaAccion?: SortOrder
    observaciones?: SortOrder
    origen?: SortOrder
    estadoStock?: SortOrder
    cotizacionId?: SortOrder
    motivoPerdida?: SortOrder
    motivoPostergacion?: SortOrder
    fechaReactivacion?: SortOrder
    documentoRespaldo?: SortOrder
    fechaCierre?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    probabilidad?: SortOrder
    flujoPosterior?: SortOrder
    motivoDescarte?: SortOrder
    tipoBroker?: SortOrder
    fechaEstimadaDespacho?: SortOrder
    fechaSeguimientoPostventa?: SortOrder
    nombreOportunidad?: SortOrder
    cargoContacto?: SortOrder
    direccionProyecto?: SortOrder
    tipoOportunidad?: SortOrder
    fechaProbableCierre?: SortOrder
    riesgoTecnico?: SortOrder
    comentariosInternos?: SortOrder
    observacionesTecnicas?: SortOrder
    observacionCamposFaltantes?: SortOrder
    lineaProducto?: SortOrder
    descuento?: SortOrder
    stockOportunidad?: SortOrder
    reprogramacionesCount?: SortOrder
    fechaUltimoCambioEtapa?: SortOrder
    esReactivacion?: SortOrder
  }

  export type FunnelTragerOpportunitySumOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    cantidadEstimada?: SortOrder
    comision?: SortOrder
    margenEstimado?: SortOrder
    montoEstimado?: SortOrder
    probabilidadCierre?: SortOrder
    cotizacionId?: SortOrder
    probabilidad?: SortOrder
    descuento?: SortOrder
    reprogramacionesCount?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FunnelTragerOpportunityScalarRelationFilter = {
    is?: FunnelTragerOpportunityWhereInput
    isNot?: FunnelTragerOpportunityWhereInput
  }

  export type FunnelTragerArchivoCountOrderByAggregateInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    tipo?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    nombreArchivo?: SortOrder
    mimeType?: SortOrder
    bytes?: SortOrder
    etapa?: SortOrder
    observaciones?: SortOrder
    createdAt?: SortOrder
  }

  export type FunnelTragerArchivoAvgOrderByAggregateInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    bytes?: SortOrder
  }

  export type FunnelTragerArchivoMaxOrderByAggregateInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    tipo?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    nombreArchivo?: SortOrder
    mimeType?: SortOrder
    bytes?: SortOrder
    etapa?: SortOrder
    observaciones?: SortOrder
    createdAt?: SortOrder
  }

  export type FunnelTragerArchivoMinOrderByAggregateInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    tipo?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    nombreArchivo?: SortOrder
    mimeType?: SortOrder
    bytes?: SortOrder
    etapa?: SortOrder
    observaciones?: SortOrder
    createdAt?: SortOrder
  }

  export type FunnelTragerArchivoSumOrderByAggregateInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    bytes?: SortOrder
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type HistorialEtapaTragerCountOrderByAggregateInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    etapaAnterior?: SortOrder
    etapaNueva?: SortOrder
    usuarioId?: SortOrder
    createdAt?: SortOrder
  }

  export type HistorialEtapaTragerAvgOrderByAggregateInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
  }

  export type HistorialEtapaTragerMaxOrderByAggregateInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    etapaAnterior?: SortOrder
    etapaNueva?: SortOrder
    usuarioId?: SortOrder
    createdAt?: SortOrder
  }

  export type HistorialEtapaTragerMinOrderByAggregateInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
    etapaAnterior?: SortOrder
    etapaNueva?: SortOrder
    usuarioId?: SortOrder
    createdAt?: SortOrder
  }

  export type HistorialEtapaTragerSumOrderByAggregateInput = {
    id?: SortOrder
    oportunidadId?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type ProductoListRelationFilter = {
    every?: ProductoWhereInput
    some?: ProductoWhereInput
    none?: ProductoWhereInput
  }

  export type ProductoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoriaCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type CategoriaAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CategoriaMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type CategoriaMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type CategoriaSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CategoriaScalarRelationFilter = {
    is?: CategoriaWhereInput
    isNot?: CategoriaWhereInput
  }

  export type CotizacionTragerDetalleListRelationFilter = {
    every?: CotizacionTragerDetalleWhereInput
    some?: CotizacionTragerDetalleWhereInput
    none?: CotizacionTragerDetalleWhereInput
  }

  export type CotizacionTragerDetalleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductoCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    stock?: SortOrder
    ubicacion?: SortOrder
    createdAt?: SortOrder
    precio?: SortOrder
    minStock?: SortOrder
    activo?: SortOrder
    criticidad?: SortOrder
    imagen?: SortOrder
    categoriaId?: SortOrder
    stockReservado?: SortOrder
    sku?: SortOrder
    disponibilidad?: SortOrder
    formato?: SortOrder
    cantidadCaja?: SortOrder
    precioUsd?: SortOrder
    precioSugerido?: SortOrder
    stockInicial?: SortOrder
  }

  export type ProductoAvgOrderByAggregateInput = {
    id?: SortOrder
    stock?: SortOrder
    precio?: SortOrder
    minStock?: SortOrder
    categoriaId?: SortOrder
    stockReservado?: SortOrder
    precioUsd?: SortOrder
    precioSugerido?: SortOrder
    stockInicial?: SortOrder
  }

  export type ProductoMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    stock?: SortOrder
    ubicacion?: SortOrder
    createdAt?: SortOrder
    precio?: SortOrder
    minStock?: SortOrder
    activo?: SortOrder
    criticidad?: SortOrder
    imagen?: SortOrder
    categoriaId?: SortOrder
    stockReservado?: SortOrder
    sku?: SortOrder
    disponibilidad?: SortOrder
    formato?: SortOrder
    cantidadCaja?: SortOrder
    precioUsd?: SortOrder
    precioSugerido?: SortOrder
    stockInicial?: SortOrder
  }

  export type ProductoMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    stock?: SortOrder
    ubicacion?: SortOrder
    createdAt?: SortOrder
    precio?: SortOrder
    minStock?: SortOrder
    activo?: SortOrder
    criticidad?: SortOrder
    imagen?: SortOrder
    categoriaId?: SortOrder
    stockReservado?: SortOrder
    sku?: SortOrder
    disponibilidad?: SortOrder
    formato?: SortOrder
    cantidadCaja?: SortOrder
    precioUsd?: SortOrder
    precioSugerido?: SortOrder
    stockInicial?: SortOrder
  }

  export type ProductoSumOrderByAggregateInput = {
    id?: SortOrder
    stock?: SortOrder
    precio?: SortOrder
    minStock?: SortOrder
    categoriaId?: SortOrder
    stockReservado?: SortOrder
    precioUsd?: SortOrder
    precioSugerido?: SortOrder
    stockInicial?: SortOrder
  }

  export type CotizacionTragerCountOrderByAggregateInput = {
    id?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrder
    tipoCliente?: SortOrder
    responsable?: SortOrder
    estado?: SortOrder
    subtotal?: SortOrder
    descuento?: SortOrder
    impuesto?: SortOrder
    total?: SortOrder
    fechaCotizacion?: SortOrder
    fechaVencimiento?: SortOrder
    fechaEnvio?: SortOrder
    fechaSeguimiento?: SortOrder
    fechaCierre?: SortOrder
    observaciones?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    numero?: SortOrder
  }

  export type CotizacionTragerAvgOrderByAggregateInput = {
    id?: SortOrder
    subtotal?: SortOrder
    descuento?: SortOrder
    impuesto?: SortOrder
    total?: SortOrder
  }

  export type CotizacionTragerMaxOrderByAggregateInput = {
    id?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrder
    tipoCliente?: SortOrder
    responsable?: SortOrder
    estado?: SortOrder
    subtotal?: SortOrder
    descuento?: SortOrder
    impuesto?: SortOrder
    total?: SortOrder
    fechaCotizacion?: SortOrder
    fechaVencimiento?: SortOrder
    fechaEnvio?: SortOrder
    fechaSeguimiento?: SortOrder
    fechaCierre?: SortOrder
    observaciones?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    numero?: SortOrder
  }

  export type CotizacionTragerMinOrderByAggregateInput = {
    id?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrder
    tipoCliente?: SortOrder
    responsable?: SortOrder
    estado?: SortOrder
    subtotal?: SortOrder
    descuento?: SortOrder
    impuesto?: SortOrder
    total?: SortOrder
    fechaCotizacion?: SortOrder
    fechaVencimiento?: SortOrder
    fechaEnvio?: SortOrder
    fechaSeguimiento?: SortOrder
    fechaCierre?: SortOrder
    observaciones?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    numero?: SortOrder
  }

  export type CotizacionTragerSumOrderByAggregateInput = {
    id?: SortOrder
    subtotal?: SortOrder
    descuento?: SortOrder
    impuesto?: SortOrder
    total?: SortOrder
  }

  export type CotizacionTragerScalarRelationFilter = {
    is?: CotizacionTragerWhereInput
    isNot?: CotizacionTragerWhereInput
  }

  export type ProductoScalarRelationFilter = {
    is?: ProductoWhereInput
    isNot?: ProductoWhereInput
  }

  export type CotizacionTragerDetalleCountOrderByAggregateInput = {
    id?: SortOrder
    cotizacionId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnitario?: SortOrder
    descuentoPct?: SortOrder
    subtotal?: SortOrder
    stockDisponible?: SortOrder
    observacion?: SortOrder
  }

  export type CotizacionTragerDetalleAvgOrderByAggregateInput = {
    id?: SortOrder
    cotizacionId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnitario?: SortOrder
    descuentoPct?: SortOrder
    subtotal?: SortOrder
    stockDisponible?: SortOrder
  }

  export type CotizacionTragerDetalleMaxOrderByAggregateInput = {
    id?: SortOrder
    cotizacionId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnitario?: SortOrder
    descuentoPct?: SortOrder
    subtotal?: SortOrder
    stockDisponible?: SortOrder
    observacion?: SortOrder
  }

  export type CotizacionTragerDetalleMinOrderByAggregateInput = {
    id?: SortOrder
    cotizacionId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnitario?: SortOrder
    descuentoPct?: SortOrder
    subtotal?: SortOrder
    stockDisponible?: SortOrder
    observacion?: SortOrder
  }

  export type CotizacionTragerDetalleSumOrderByAggregateInput = {
    id?: SortOrder
    cotizacionId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnitario?: SortOrder
    descuentoPct?: SortOrder
    subtotal?: SortOrder
    stockDisponible?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FunnelTragerArchivoCreateNestedManyWithoutOportunidadInput = {
    create?: XOR<FunnelTragerArchivoCreateWithoutOportunidadInput, FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput> | FunnelTragerArchivoCreateWithoutOportunidadInput[] | FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput[]
    connectOrCreate?: FunnelTragerArchivoCreateOrConnectWithoutOportunidadInput | FunnelTragerArchivoCreateOrConnectWithoutOportunidadInput[]
    createMany?: FunnelTragerArchivoCreateManyOportunidadInputEnvelope
    connect?: FunnelTragerArchivoWhereUniqueInput | FunnelTragerArchivoWhereUniqueInput[]
  }

  export type HistorialEtapaTragerCreateNestedManyWithoutOportunidadInput = {
    create?: XOR<HistorialEtapaTragerCreateWithoutOportunidadInput, HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput> | HistorialEtapaTragerCreateWithoutOportunidadInput[] | HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput[]
    connectOrCreate?: HistorialEtapaTragerCreateOrConnectWithoutOportunidadInput | HistorialEtapaTragerCreateOrConnectWithoutOportunidadInput[]
    createMany?: HistorialEtapaTragerCreateManyOportunidadInputEnvelope
    connect?: HistorialEtapaTragerWhereUniqueInput | HistorialEtapaTragerWhereUniqueInput[]
  }

  export type FunnelTragerArchivoUncheckedCreateNestedManyWithoutOportunidadInput = {
    create?: XOR<FunnelTragerArchivoCreateWithoutOportunidadInput, FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput> | FunnelTragerArchivoCreateWithoutOportunidadInput[] | FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput[]
    connectOrCreate?: FunnelTragerArchivoCreateOrConnectWithoutOportunidadInput | FunnelTragerArchivoCreateOrConnectWithoutOportunidadInput[]
    createMany?: FunnelTragerArchivoCreateManyOportunidadInputEnvelope
    connect?: FunnelTragerArchivoWhereUniqueInput | FunnelTragerArchivoWhereUniqueInput[]
  }

  export type HistorialEtapaTragerUncheckedCreateNestedManyWithoutOportunidadInput = {
    create?: XOR<HistorialEtapaTragerCreateWithoutOportunidadInput, HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput> | HistorialEtapaTragerCreateWithoutOportunidadInput[] | HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput[]
    connectOrCreate?: HistorialEtapaTragerCreateOrConnectWithoutOportunidadInput | HistorialEtapaTragerCreateOrConnectWithoutOportunidadInput[]
    createMany?: HistorialEtapaTragerCreateManyOportunidadInputEnvelope
    connect?: HistorialEtapaTragerWhereUniqueInput | HistorialEtapaTragerWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FunnelTragerArchivoUpdateManyWithoutOportunidadNestedInput = {
    create?: XOR<FunnelTragerArchivoCreateWithoutOportunidadInput, FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput> | FunnelTragerArchivoCreateWithoutOportunidadInput[] | FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput[]
    connectOrCreate?: FunnelTragerArchivoCreateOrConnectWithoutOportunidadInput | FunnelTragerArchivoCreateOrConnectWithoutOportunidadInput[]
    upsert?: FunnelTragerArchivoUpsertWithWhereUniqueWithoutOportunidadInput | FunnelTragerArchivoUpsertWithWhereUniqueWithoutOportunidadInput[]
    createMany?: FunnelTragerArchivoCreateManyOportunidadInputEnvelope
    set?: FunnelTragerArchivoWhereUniqueInput | FunnelTragerArchivoWhereUniqueInput[]
    disconnect?: FunnelTragerArchivoWhereUniqueInput | FunnelTragerArchivoWhereUniqueInput[]
    delete?: FunnelTragerArchivoWhereUniqueInput | FunnelTragerArchivoWhereUniqueInput[]
    connect?: FunnelTragerArchivoWhereUniqueInput | FunnelTragerArchivoWhereUniqueInput[]
    update?: FunnelTragerArchivoUpdateWithWhereUniqueWithoutOportunidadInput | FunnelTragerArchivoUpdateWithWhereUniqueWithoutOportunidadInput[]
    updateMany?: FunnelTragerArchivoUpdateManyWithWhereWithoutOportunidadInput | FunnelTragerArchivoUpdateManyWithWhereWithoutOportunidadInput[]
    deleteMany?: FunnelTragerArchivoScalarWhereInput | FunnelTragerArchivoScalarWhereInput[]
  }

  export type HistorialEtapaTragerUpdateManyWithoutOportunidadNestedInput = {
    create?: XOR<HistorialEtapaTragerCreateWithoutOportunidadInput, HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput> | HistorialEtapaTragerCreateWithoutOportunidadInput[] | HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput[]
    connectOrCreate?: HistorialEtapaTragerCreateOrConnectWithoutOportunidadInput | HistorialEtapaTragerCreateOrConnectWithoutOportunidadInput[]
    upsert?: HistorialEtapaTragerUpsertWithWhereUniqueWithoutOportunidadInput | HistorialEtapaTragerUpsertWithWhereUniqueWithoutOportunidadInput[]
    createMany?: HistorialEtapaTragerCreateManyOportunidadInputEnvelope
    set?: HistorialEtapaTragerWhereUniqueInput | HistorialEtapaTragerWhereUniqueInput[]
    disconnect?: HistorialEtapaTragerWhereUniqueInput | HistorialEtapaTragerWhereUniqueInput[]
    delete?: HistorialEtapaTragerWhereUniqueInput | HistorialEtapaTragerWhereUniqueInput[]
    connect?: HistorialEtapaTragerWhereUniqueInput | HistorialEtapaTragerWhereUniqueInput[]
    update?: HistorialEtapaTragerUpdateWithWhereUniqueWithoutOportunidadInput | HistorialEtapaTragerUpdateWithWhereUniqueWithoutOportunidadInput[]
    updateMany?: HistorialEtapaTragerUpdateManyWithWhereWithoutOportunidadInput | HistorialEtapaTragerUpdateManyWithWhereWithoutOportunidadInput[]
    deleteMany?: HistorialEtapaTragerScalarWhereInput | HistorialEtapaTragerScalarWhereInput[]
  }

  export type FunnelTragerArchivoUncheckedUpdateManyWithoutOportunidadNestedInput = {
    create?: XOR<FunnelTragerArchivoCreateWithoutOportunidadInput, FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput> | FunnelTragerArchivoCreateWithoutOportunidadInput[] | FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput[]
    connectOrCreate?: FunnelTragerArchivoCreateOrConnectWithoutOportunidadInput | FunnelTragerArchivoCreateOrConnectWithoutOportunidadInput[]
    upsert?: FunnelTragerArchivoUpsertWithWhereUniqueWithoutOportunidadInput | FunnelTragerArchivoUpsertWithWhereUniqueWithoutOportunidadInput[]
    createMany?: FunnelTragerArchivoCreateManyOportunidadInputEnvelope
    set?: FunnelTragerArchivoWhereUniqueInput | FunnelTragerArchivoWhereUniqueInput[]
    disconnect?: FunnelTragerArchivoWhereUniqueInput | FunnelTragerArchivoWhereUniqueInput[]
    delete?: FunnelTragerArchivoWhereUniqueInput | FunnelTragerArchivoWhereUniqueInput[]
    connect?: FunnelTragerArchivoWhereUniqueInput | FunnelTragerArchivoWhereUniqueInput[]
    update?: FunnelTragerArchivoUpdateWithWhereUniqueWithoutOportunidadInput | FunnelTragerArchivoUpdateWithWhereUniqueWithoutOportunidadInput[]
    updateMany?: FunnelTragerArchivoUpdateManyWithWhereWithoutOportunidadInput | FunnelTragerArchivoUpdateManyWithWhereWithoutOportunidadInput[]
    deleteMany?: FunnelTragerArchivoScalarWhereInput | FunnelTragerArchivoScalarWhereInput[]
  }

  export type HistorialEtapaTragerUncheckedUpdateManyWithoutOportunidadNestedInput = {
    create?: XOR<HistorialEtapaTragerCreateWithoutOportunidadInput, HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput> | HistorialEtapaTragerCreateWithoutOportunidadInput[] | HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput[]
    connectOrCreate?: HistorialEtapaTragerCreateOrConnectWithoutOportunidadInput | HistorialEtapaTragerCreateOrConnectWithoutOportunidadInput[]
    upsert?: HistorialEtapaTragerUpsertWithWhereUniqueWithoutOportunidadInput | HistorialEtapaTragerUpsertWithWhereUniqueWithoutOportunidadInput[]
    createMany?: HistorialEtapaTragerCreateManyOportunidadInputEnvelope
    set?: HistorialEtapaTragerWhereUniqueInput | HistorialEtapaTragerWhereUniqueInput[]
    disconnect?: HistorialEtapaTragerWhereUniqueInput | HistorialEtapaTragerWhereUniqueInput[]
    delete?: HistorialEtapaTragerWhereUniqueInput | HistorialEtapaTragerWhereUniqueInput[]
    connect?: HistorialEtapaTragerWhereUniqueInput | HistorialEtapaTragerWhereUniqueInput[]
    update?: HistorialEtapaTragerUpdateWithWhereUniqueWithoutOportunidadInput | HistorialEtapaTragerUpdateWithWhereUniqueWithoutOportunidadInput[]
    updateMany?: HistorialEtapaTragerUpdateManyWithWhereWithoutOportunidadInput | HistorialEtapaTragerUpdateManyWithWhereWithoutOportunidadInput[]
    deleteMany?: HistorialEtapaTragerScalarWhereInput | HistorialEtapaTragerScalarWhereInput[]
  }

  export type FunnelTragerOpportunityCreateNestedOneWithoutArchivosInput = {
    create?: XOR<FunnelTragerOpportunityCreateWithoutArchivosInput, FunnelTragerOpportunityUncheckedCreateWithoutArchivosInput>
    connectOrCreate?: FunnelTragerOpportunityCreateOrConnectWithoutArchivosInput
    connect?: FunnelTragerOpportunityWhereUniqueInput
  }

  export type FunnelTragerOpportunityUpdateOneRequiredWithoutArchivosNestedInput = {
    create?: XOR<FunnelTragerOpportunityCreateWithoutArchivosInput, FunnelTragerOpportunityUncheckedCreateWithoutArchivosInput>
    connectOrCreate?: FunnelTragerOpportunityCreateOrConnectWithoutArchivosInput
    upsert?: FunnelTragerOpportunityUpsertWithoutArchivosInput
    connect?: FunnelTragerOpportunityWhereUniqueInput
    update?: XOR<XOR<FunnelTragerOpportunityUpdateToOneWithWhereWithoutArchivosInput, FunnelTragerOpportunityUpdateWithoutArchivosInput>, FunnelTragerOpportunityUncheckedUpdateWithoutArchivosInput>
  }

  export type FunnelTragerOpportunityCreateNestedOneWithoutHistorialEtapasInput = {
    create?: XOR<FunnelTragerOpportunityCreateWithoutHistorialEtapasInput, FunnelTragerOpportunityUncheckedCreateWithoutHistorialEtapasInput>
    connectOrCreate?: FunnelTragerOpportunityCreateOrConnectWithoutHistorialEtapasInput
    connect?: FunnelTragerOpportunityWhereUniqueInput
  }

  export type FunnelTragerOpportunityUpdateOneRequiredWithoutHistorialEtapasNestedInput = {
    create?: XOR<FunnelTragerOpportunityCreateWithoutHistorialEtapasInput, FunnelTragerOpportunityUncheckedCreateWithoutHistorialEtapasInput>
    connectOrCreate?: FunnelTragerOpportunityCreateOrConnectWithoutHistorialEtapasInput
    upsert?: FunnelTragerOpportunityUpsertWithoutHistorialEtapasInput
    connect?: FunnelTragerOpportunityWhereUniqueInput
    update?: XOR<XOR<FunnelTragerOpportunityUpdateToOneWithWhereWithoutHistorialEtapasInput, FunnelTragerOpportunityUpdateWithoutHistorialEtapasInput>, FunnelTragerOpportunityUncheckedUpdateWithoutHistorialEtapasInput>
  }

  export type ProductoCreateNestedManyWithoutCategoriaInput = {
    create?: XOR<ProductoCreateWithoutCategoriaInput, ProductoUncheckedCreateWithoutCategoriaInput> | ProductoCreateWithoutCategoriaInput[] | ProductoUncheckedCreateWithoutCategoriaInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutCategoriaInput | ProductoCreateOrConnectWithoutCategoriaInput[]
    createMany?: ProductoCreateManyCategoriaInputEnvelope
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
  }

  export type ProductoUncheckedCreateNestedManyWithoutCategoriaInput = {
    create?: XOR<ProductoCreateWithoutCategoriaInput, ProductoUncheckedCreateWithoutCategoriaInput> | ProductoCreateWithoutCategoriaInput[] | ProductoUncheckedCreateWithoutCategoriaInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutCategoriaInput | ProductoCreateOrConnectWithoutCategoriaInput[]
    createMany?: ProductoCreateManyCategoriaInputEnvelope
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
  }

  export type ProductoUpdateManyWithoutCategoriaNestedInput = {
    create?: XOR<ProductoCreateWithoutCategoriaInput, ProductoUncheckedCreateWithoutCategoriaInput> | ProductoCreateWithoutCategoriaInput[] | ProductoUncheckedCreateWithoutCategoriaInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutCategoriaInput | ProductoCreateOrConnectWithoutCategoriaInput[]
    upsert?: ProductoUpsertWithWhereUniqueWithoutCategoriaInput | ProductoUpsertWithWhereUniqueWithoutCategoriaInput[]
    createMany?: ProductoCreateManyCategoriaInputEnvelope
    set?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    disconnect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    delete?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    update?: ProductoUpdateWithWhereUniqueWithoutCategoriaInput | ProductoUpdateWithWhereUniqueWithoutCategoriaInput[]
    updateMany?: ProductoUpdateManyWithWhereWithoutCategoriaInput | ProductoUpdateManyWithWhereWithoutCategoriaInput[]
    deleteMany?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
  }

  export type ProductoUncheckedUpdateManyWithoutCategoriaNestedInput = {
    create?: XOR<ProductoCreateWithoutCategoriaInput, ProductoUncheckedCreateWithoutCategoriaInput> | ProductoCreateWithoutCategoriaInput[] | ProductoUncheckedCreateWithoutCategoriaInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutCategoriaInput | ProductoCreateOrConnectWithoutCategoriaInput[]
    upsert?: ProductoUpsertWithWhereUniqueWithoutCategoriaInput | ProductoUpsertWithWhereUniqueWithoutCategoriaInput[]
    createMany?: ProductoCreateManyCategoriaInputEnvelope
    set?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    disconnect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    delete?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    update?: ProductoUpdateWithWhereUniqueWithoutCategoriaInput | ProductoUpdateWithWhereUniqueWithoutCategoriaInput[]
    updateMany?: ProductoUpdateManyWithWhereWithoutCategoriaInput | ProductoUpdateManyWithWhereWithoutCategoriaInput[]
    deleteMany?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
  }

  export type CategoriaCreateNestedOneWithoutProductoInput = {
    create?: XOR<CategoriaCreateWithoutProductoInput, CategoriaUncheckedCreateWithoutProductoInput>
    connectOrCreate?: CategoriaCreateOrConnectWithoutProductoInput
    connect?: CategoriaWhereUniqueInput
  }

  export type CotizacionTragerDetalleCreateNestedManyWithoutProductoInput = {
    create?: XOR<CotizacionTragerDetalleCreateWithoutProductoInput, CotizacionTragerDetalleUncheckedCreateWithoutProductoInput> | CotizacionTragerDetalleCreateWithoutProductoInput[] | CotizacionTragerDetalleUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: CotizacionTragerDetalleCreateOrConnectWithoutProductoInput | CotizacionTragerDetalleCreateOrConnectWithoutProductoInput[]
    createMany?: CotizacionTragerDetalleCreateManyProductoInputEnvelope
    connect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
  }

  export type CotizacionTragerDetalleUncheckedCreateNestedManyWithoutProductoInput = {
    create?: XOR<CotizacionTragerDetalleCreateWithoutProductoInput, CotizacionTragerDetalleUncheckedCreateWithoutProductoInput> | CotizacionTragerDetalleCreateWithoutProductoInput[] | CotizacionTragerDetalleUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: CotizacionTragerDetalleCreateOrConnectWithoutProductoInput | CotizacionTragerDetalleCreateOrConnectWithoutProductoInput[]
    createMany?: CotizacionTragerDetalleCreateManyProductoInputEnvelope
    connect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
  }

  export type CategoriaUpdateOneRequiredWithoutProductoNestedInput = {
    create?: XOR<CategoriaCreateWithoutProductoInput, CategoriaUncheckedCreateWithoutProductoInput>
    connectOrCreate?: CategoriaCreateOrConnectWithoutProductoInput
    upsert?: CategoriaUpsertWithoutProductoInput
    connect?: CategoriaWhereUniqueInput
    update?: XOR<XOR<CategoriaUpdateToOneWithWhereWithoutProductoInput, CategoriaUpdateWithoutProductoInput>, CategoriaUncheckedUpdateWithoutProductoInput>
  }

  export type CotizacionTragerDetalleUpdateManyWithoutProductoNestedInput = {
    create?: XOR<CotizacionTragerDetalleCreateWithoutProductoInput, CotizacionTragerDetalleUncheckedCreateWithoutProductoInput> | CotizacionTragerDetalleCreateWithoutProductoInput[] | CotizacionTragerDetalleUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: CotizacionTragerDetalleCreateOrConnectWithoutProductoInput | CotizacionTragerDetalleCreateOrConnectWithoutProductoInput[]
    upsert?: CotizacionTragerDetalleUpsertWithWhereUniqueWithoutProductoInput | CotizacionTragerDetalleUpsertWithWhereUniqueWithoutProductoInput[]
    createMany?: CotizacionTragerDetalleCreateManyProductoInputEnvelope
    set?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    disconnect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    delete?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    connect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    update?: CotizacionTragerDetalleUpdateWithWhereUniqueWithoutProductoInput | CotizacionTragerDetalleUpdateWithWhereUniqueWithoutProductoInput[]
    updateMany?: CotizacionTragerDetalleUpdateManyWithWhereWithoutProductoInput | CotizacionTragerDetalleUpdateManyWithWhereWithoutProductoInput[]
    deleteMany?: CotizacionTragerDetalleScalarWhereInput | CotizacionTragerDetalleScalarWhereInput[]
  }

  export type CotizacionTragerDetalleUncheckedUpdateManyWithoutProductoNestedInput = {
    create?: XOR<CotizacionTragerDetalleCreateWithoutProductoInput, CotizacionTragerDetalleUncheckedCreateWithoutProductoInput> | CotizacionTragerDetalleCreateWithoutProductoInput[] | CotizacionTragerDetalleUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: CotizacionTragerDetalleCreateOrConnectWithoutProductoInput | CotizacionTragerDetalleCreateOrConnectWithoutProductoInput[]
    upsert?: CotizacionTragerDetalleUpsertWithWhereUniqueWithoutProductoInput | CotizacionTragerDetalleUpsertWithWhereUniqueWithoutProductoInput[]
    createMany?: CotizacionTragerDetalleCreateManyProductoInputEnvelope
    set?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    disconnect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    delete?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    connect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    update?: CotizacionTragerDetalleUpdateWithWhereUniqueWithoutProductoInput | CotizacionTragerDetalleUpdateWithWhereUniqueWithoutProductoInput[]
    updateMany?: CotizacionTragerDetalleUpdateManyWithWhereWithoutProductoInput | CotizacionTragerDetalleUpdateManyWithWhereWithoutProductoInput[]
    deleteMany?: CotizacionTragerDetalleScalarWhereInput | CotizacionTragerDetalleScalarWhereInput[]
  }

  export type CotizacionTragerDetalleCreateNestedManyWithoutCotizacionInput = {
    create?: XOR<CotizacionTragerDetalleCreateWithoutCotizacionInput, CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput> | CotizacionTragerDetalleCreateWithoutCotizacionInput[] | CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput[]
    connectOrCreate?: CotizacionTragerDetalleCreateOrConnectWithoutCotizacionInput | CotizacionTragerDetalleCreateOrConnectWithoutCotizacionInput[]
    createMany?: CotizacionTragerDetalleCreateManyCotizacionInputEnvelope
    connect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
  }

  export type CotizacionTragerDetalleUncheckedCreateNestedManyWithoutCotizacionInput = {
    create?: XOR<CotizacionTragerDetalleCreateWithoutCotizacionInput, CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput> | CotizacionTragerDetalleCreateWithoutCotizacionInput[] | CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput[]
    connectOrCreate?: CotizacionTragerDetalleCreateOrConnectWithoutCotizacionInput | CotizacionTragerDetalleCreateOrConnectWithoutCotizacionInput[]
    createMany?: CotizacionTragerDetalleCreateManyCotizacionInputEnvelope
    connect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
  }

  export type CotizacionTragerDetalleUpdateManyWithoutCotizacionNestedInput = {
    create?: XOR<CotizacionTragerDetalleCreateWithoutCotizacionInput, CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput> | CotizacionTragerDetalleCreateWithoutCotizacionInput[] | CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput[]
    connectOrCreate?: CotizacionTragerDetalleCreateOrConnectWithoutCotizacionInput | CotizacionTragerDetalleCreateOrConnectWithoutCotizacionInput[]
    upsert?: CotizacionTragerDetalleUpsertWithWhereUniqueWithoutCotizacionInput | CotizacionTragerDetalleUpsertWithWhereUniqueWithoutCotizacionInput[]
    createMany?: CotizacionTragerDetalleCreateManyCotizacionInputEnvelope
    set?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    disconnect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    delete?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    connect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    update?: CotizacionTragerDetalleUpdateWithWhereUniqueWithoutCotizacionInput | CotizacionTragerDetalleUpdateWithWhereUniqueWithoutCotizacionInput[]
    updateMany?: CotizacionTragerDetalleUpdateManyWithWhereWithoutCotizacionInput | CotizacionTragerDetalleUpdateManyWithWhereWithoutCotizacionInput[]
    deleteMany?: CotizacionTragerDetalleScalarWhereInput | CotizacionTragerDetalleScalarWhereInput[]
  }

  export type CotizacionTragerDetalleUncheckedUpdateManyWithoutCotizacionNestedInput = {
    create?: XOR<CotizacionTragerDetalleCreateWithoutCotizacionInput, CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput> | CotizacionTragerDetalleCreateWithoutCotizacionInput[] | CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput[]
    connectOrCreate?: CotizacionTragerDetalleCreateOrConnectWithoutCotizacionInput | CotizacionTragerDetalleCreateOrConnectWithoutCotizacionInput[]
    upsert?: CotizacionTragerDetalleUpsertWithWhereUniqueWithoutCotizacionInput | CotizacionTragerDetalleUpsertWithWhereUniqueWithoutCotizacionInput[]
    createMany?: CotizacionTragerDetalleCreateManyCotizacionInputEnvelope
    set?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    disconnect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    delete?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    connect?: CotizacionTragerDetalleWhereUniqueInput | CotizacionTragerDetalleWhereUniqueInput[]
    update?: CotizacionTragerDetalleUpdateWithWhereUniqueWithoutCotizacionInput | CotizacionTragerDetalleUpdateWithWhereUniqueWithoutCotizacionInput[]
    updateMany?: CotizacionTragerDetalleUpdateManyWithWhereWithoutCotizacionInput | CotizacionTragerDetalleUpdateManyWithWhereWithoutCotizacionInput[]
    deleteMany?: CotizacionTragerDetalleScalarWhereInput | CotizacionTragerDetalleScalarWhereInput[]
  }

  export type CotizacionTragerCreateNestedOneWithoutDetallesInput = {
    create?: XOR<CotizacionTragerCreateWithoutDetallesInput, CotizacionTragerUncheckedCreateWithoutDetallesInput>
    connectOrCreate?: CotizacionTragerCreateOrConnectWithoutDetallesInput
    connect?: CotizacionTragerWhereUniqueInput
  }

  export type ProductoCreateNestedOneWithoutCotizacionTragerDetalleInput = {
    create?: XOR<ProductoCreateWithoutCotizacionTragerDetalleInput, ProductoUncheckedCreateWithoutCotizacionTragerDetalleInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutCotizacionTragerDetalleInput
    connect?: ProductoWhereUniqueInput
  }

  export type CotizacionTragerUpdateOneRequiredWithoutDetallesNestedInput = {
    create?: XOR<CotizacionTragerCreateWithoutDetallesInput, CotizacionTragerUncheckedCreateWithoutDetallesInput>
    connectOrCreate?: CotizacionTragerCreateOrConnectWithoutDetallesInput
    upsert?: CotizacionTragerUpsertWithoutDetallesInput
    connect?: CotizacionTragerWhereUniqueInput
    update?: XOR<XOR<CotizacionTragerUpdateToOneWithWhereWithoutDetallesInput, CotizacionTragerUpdateWithoutDetallesInput>, CotizacionTragerUncheckedUpdateWithoutDetallesInput>
  }

  export type ProductoUpdateOneRequiredWithoutCotizacionTragerDetalleNestedInput = {
    create?: XOR<ProductoCreateWithoutCotizacionTragerDetalleInput, ProductoUncheckedCreateWithoutCotizacionTragerDetalleInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutCotizacionTragerDetalleInput
    upsert?: ProductoUpsertWithoutCotizacionTragerDetalleInput
    connect?: ProductoWhereUniqueInput
    update?: XOR<XOR<ProductoUpdateToOneWithWhereWithoutCotizacionTragerDetalleInput, ProductoUpdateWithoutCotizacionTragerDetalleInput>, ProductoUncheckedUpdateWithoutCotizacionTragerDetalleInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FunnelTragerArchivoCreateWithoutOportunidadInput = {
    tipo: string
    url: string
    publicId: string
    nombreArchivo?: string | null
    mimeType?: string | null
    bytes?: number | null
    etapa?: string | null
    observaciones?: string | null
    createdAt?: Date | string
  }

  export type FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput = {
    id?: number
    tipo: string
    url: string
    publicId: string
    nombreArchivo?: string | null
    mimeType?: string | null
    bytes?: number | null
    etapa?: string | null
    observaciones?: string | null
    createdAt?: Date | string
  }

  export type FunnelTragerArchivoCreateOrConnectWithoutOportunidadInput = {
    where: FunnelTragerArchivoWhereUniqueInput
    create: XOR<FunnelTragerArchivoCreateWithoutOportunidadInput, FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput>
  }

  export type FunnelTragerArchivoCreateManyOportunidadInputEnvelope = {
    data: FunnelTragerArchivoCreateManyOportunidadInput | FunnelTragerArchivoCreateManyOportunidadInput[]
    skipDuplicates?: boolean
  }

  export type HistorialEtapaTragerCreateWithoutOportunidadInput = {
    etapaAnterior?: string | null
    etapaNueva: string
    usuarioId?: string | null
    createdAt?: Date | string
  }

  export type HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput = {
    id?: number
    etapaAnterior?: string | null
    etapaNueva: string
    usuarioId?: string | null
    createdAt?: Date | string
  }

  export type HistorialEtapaTragerCreateOrConnectWithoutOportunidadInput = {
    where: HistorialEtapaTragerWhereUniqueInput
    create: XOR<HistorialEtapaTragerCreateWithoutOportunidadInput, HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput>
  }

  export type HistorialEtapaTragerCreateManyOportunidadInputEnvelope = {
    data: HistorialEtapaTragerCreateManyOportunidadInput | HistorialEtapaTragerCreateManyOportunidadInput[]
    skipDuplicates?: boolean
  }

  export type FunnelTragerArchivoUpsertWithWhereUniqueWithoutOportunidadInput = {
    where: FunnelTragerArchivoWhereUniqueInput
    update: XOR<FunnelTragerArchivoUpdateWithoutOportunidadInput, FunnelTragerArchivoUncheckedUpdateWithoutOportunidadInput>
    create: XOR<FunnelTragerArchivoCreateWithoutOportunidadInput, FunnelTragerArchivoUncheckedCreateWithoutOportunidadInput>
  }

  export type FunnelTragerArchivoUpdateWithWhereUniqueWithoutOportunidadInput = {
    where: FunnelTragerArchivoWhereUniqueInput
    data: XOR<FunnelTragerArchivoUpdateWithoutOportunidadInput, FunnelTragerArchivoUncheckedUpdateWithoutOportunidadInput>
  }

  export type FunnelTragerArchivoUpdateManyWithWhereWithoutOportunidadInput = {
    where: FunnelTragerArchivoScalarWhereInput
    data: XOR<FunnelTragerArchivoUpdateManyMutationInput, FunnelTragerArchivoUncheckedUpdateManyWithoutOportunidadInput>
  }

  export type FunnelTragerArchivoScalarWhereInput = {
    AND?: FunnelTragerArchivoScalarWhereInput | FunnelTragerArchivoScalarWhereInput[]
    OR?: FunnelTragerArchivoScalarWhereInput[]
    NOT?: FunnelTragerArchivoScalarWhereInput | FunnelTragerArchivoScalarWhereInput[]
    id?: IntFilter<"FunnelTragerArchivo"> | number
    oportunidadId?: IntFilter<"FunnelTragerArchivo"> | number
    tipo?: StringFilter<"FunnelTragerArchivo"> | string
    url?: StringFilter<"FunnelTragerArchivo"> | string
    publicId?: StringFilter<"FunnelTragerArchivo"> | string
    nombreArchivo?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    mimeType?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    bytes?: IntNullableFilter<"FunnelTragerArchivo"> | number | null
    etapa?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    observaciones?: StringNullableFilter<"FunnelTragerArchivo"> | string | null
    createdAt?: DateTimeFilter<"FunnelTragerArchivo"> | Date | string
  }

  export type HistorialEtapaTragerUpsertWithWhereUniqueWithoutOportunidadInput = {
    where: HistorialEtapaTragerWhereUniqueInput
    update: XOR<HistorialEtapaTragerUpdateWithoutOportunidadInput, HistorialEtapaTragerUncheckedUpdateWithoutOportunidadInput>
    create: XOR<HistorialEtapaTragerCreateWithoutOportunidadInput, HistorialEtapaTragerUncheckedCreateWithoutOportunidadInput>
  }

  export type HistorialEtapaTragerUpdateWithWhereUniqueWithoutOportunidadInput = {
    where: HistorialEtapaTragerWhereUniqueInput
    data: XOR<HistorialEtapaTragerUpdateWithoutOportunidadInput, HistorialEtapaTragerUncheckedUpdateWithoutOportunidadInput>
  }

  export type HistorialEtapaTragerUpdateManyWithWhereWithoutOportunidadInput = {
    where: HistorialEtapaTragerScalarWhereInput
    data: XOR<HistorialEtapaTragerUpdateManyMutationInput, HistorialEtapaTragerUncheckedUpdateManyWithoutOportunidadInput>
  }

  export type HistorialEtapaTragerScalarWhereInput = {
    AND?: HistorialEtapaTragerScalarWhereInput | HistorialEtapaTragerScalarWhereInput[]
    OR?: HistorialEtapaTragerScalarWhereInput[]
    NOT?: HistorialEtapaTragerScalarWhereInput | HistorialEtapaTragerScalarWhereInput[]
    id?: IntFilter<"HistorialEtapaTrager"> | number
    oportunidadId?: IntFilter<"HistorialEtapaTrager"> | number
    etapaAnterior?: StringNullableFilter<"HistorialEtapaTrager"> | string | null
    etapaNueva?: StringFilter<"HistorialEtapaTrager"> | string
    usuarioId?: UuidNullableFilter<"HistorialEtapaTrager"> | string | null
    createdAt?: DateTimeFilter<"HistorialEtapaTrager"> | Date | string
  }

  export type FunnelTragerOpportunityCreateWithoutArchivosInput = {
    cliente: string
    contacto?: string | null
    telefono?: string | null
    correo?: string | null
    tipoCliente?: string | null
    rutEmpresa?: string | null
    region?: string | null
    comuna?: string | null
    unidadNegocio?: string | null
    productoId?: number | null
    cantidadEstimada?: number | null
    urgencia?: string | null
    tipoUso?: string | null
    necesidadSoporteTecnico?: boolean | null
    alternativaProducto?: string | null
    comision?: number | null
    margenEstimado?: number | null
    fechaComprometidaEnvio?: Date | string | null
    versionCotizacion?: string | null
    comentariosCliente?: string | null
    objeciones?: string | null
    ordenCompra?: string | null
    correoAceptacion?: string | null
    condicionesComerciales?: string | null
    coordinacionAdministrativa?: string | null
    estadoDocumentacion?: string | null
    traspasoAdministracion?: boolean | null
    traspasoERP?: boolean | null
    coordinacionDespacho?: string | null
    estadoComercialOrden?: string | null
    estadoDocumentacionVenta?: string | null
    responsable?: string | null
    etapa?: string
    montoEstimado?: number
    probabilidadCierre?: number | null
    proximaAccion?: string | null
    fechaProximaAccion?: Date | string | null
    observaciones?: string | null
    origen?: string | null
    estadoStock?: string | null
    cotizacionId?: number | null
    motivoPerdida?: string | null
    motivoPostergacion?: string | null
    fechaReactivacion?: Date | string | null
    documentoRespaldo?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    probabilidad?: number | null
    flujoPosterior?: string | null
    motivoDescarte?: string | null
    tipoBroker?: string | null
    fechaEstimadaDespacho?: Date | string | null
    fechaSeguimientoPostventa?: Date | string | null
    nombreOportunidad?: string | null
    cargoContacto?: string | null
    direccionProyecto?: string | null
    tipoOportunidad?: string | null
    fechaProbableCierre?: Date | string | null
    riesgoTecnico?: string | null
    comentariosInternos?: string | null
    observacionesTecnicas?: string | null
    observacionCamposFaltantes?: string | null
    lineaProducto?: string | null
    descuento?: number | null
    stockOportunidad?: string | null
    reprogramacionesCount?: number
    fechaUltimoCambioEtapa?: Date | string | null
    esReactivacion?: boolean
    historialEtapas?: HistorialEtapaTragerCreateNestedManyWithoutOportunidadInput
  }

  export type FunnelTragerOpportunityUncheckedCreateWithoutArchivosInput = {
    id?: number
    cliente: string
    contacto?: string | null
    telefono?: string | null
    correo?: string | null
    tipoCliente?: string | null
    rutEmpresa?: string | null
    region?: string | null
    comuna?: string | null
    unidadNegocio?: string | null
    productoId?: number | null
    cantidadEstimada?: number | null
    urgencia?: string | null
    tipoUso?: string | null
    necesidadSoporteTecnico?: boolean | null
    alternativaProducto?: string | null
    comision?: number | null
    margenEstimado?: number | null
    fechaComprometidaEnvio?: Date | string | null
    versionCotizacion?: string | null
    comentariosCliente?: string | null
    objeciones?: string | null
    ordenCompra?: string | null
    correoAceptacion?: string | null
    condicionesComerciales?: string | null
    coordinacionAdministrativa?: string | null
    estadoDocumentacion?: string | null
    traspasoAdministracion?: boolean | null
    traspasoERP?: boolean | null
    coordinacionDespacho?: string | null
    estadoComercialOrden?: string | null
    estadoDocumentacionVenta?: string | null
    responsable?: string | null
    etapa?: string
    montoEstimado?: number
    probabilidadCierre?: number | null
    proximaAccion?: string | null
    fechaProximaAccion?: Date | string | null
    observaciones?: string | null
    origen?: string | null
    estadoStock?: string | null
    cotizacionId?: number | null
    motivoPerdida?: string | null
    motivoPostergacion?: string | null
    fechaReactivacion?: Date | string | null
    documentoRespaldo?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    probabilidad?: number | null
    flujoPosterior?: string | null
    motivoDescarte?: string | null
    tipoBroker?: string | null
    fechaEstimadaDespacho?: Date | string | null
    fechaSeguimientoPostventa?: Date | string | null
    nombreOportunidad?: string | null
    cargoContacto?: string | null
    direccionProyecto?: string | null
    tipoOportunidad?: string | null
    fechaProbableCierre?: Date | string | null
    riesgoTecnico?: string | null
    comentariosInternos?: string | null
    observacionesTecnicas?: string | null
    observacionCamposFaltantes?: string | null
    lineaProducto?: string | null
    descuento?: number | null
    stockOportunidad?: string | null
    reprogramacionesCount?: number
    fechaUltimoCambioEtapa?: Date | string | null
    esReactivacion?: boolean
    historialEtapas?: HistorialEtapaTragerUncheckedCreateNestedManyWithoutOportunidadInput
  }

  export type FunnelTragerOpportunityCreateOrConnectWithoutArchivosInput = {
    where: FunnelTragerOpportunityWhereUniqueInput
    create: XOR<FunnelTragerOpportunityCreateWithoutArchivosInput, FunnelTragerOpportunityUncheckedCreateWithoutArchivosInput>
  }

  export type FunnelTragerOpportunityUpsertWithoutArchivosInput = {
    update: XOR<FunnelTragerOpportunityUpdateWithoutArchivosInput, FunnelTragerOpportunityUncheckedUpdateWithoutArchivosInput>
    create: XOR<FunnelTragerOpportunityCreateWithoutArchivosInput, FunnelTragerOpportunityUncheckedCreateWithoutArchivosInput>
    where?: FunnelTragerOpportunityWhereInput
  }

  export type FunnelTragerOpportunityUpdateToOneWithWhereWithoutArchivosInput = {
    where?: FunnelTragerOpportunityWhereInput
    data: XOR<FunnelTragerOpportunityUpdateWithoutArchivosInput, FunnelTragerOpportunityUncheckedUpdateWithoutArchivosInput>
  }

  export type FunnelTragerOpportunityUpdateWithoutArchivosInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    rutEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    comuna?: NullableStringFieldUpdateOperationsInput | string | null
    unidadNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    productoId?: NullableIntFieldUpdateOperationsInput | number | null
    cantidadEstimada?: NullableIntFieldUpdateOperationsInput | number | null
    urgencia?: NullableStringFieldUpdateOperationsInput | string | null
    tipoUso?: NullableStringFieldUpdateOperationsInput | string | null
    necesidadSoporteTecnico?: NullableBoolFieldUpdateOperationsInput | boolean | null
    alternativaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    comision?: NullableFloatFieldUpdateOperationsInput | number | null
    margenEstimado?: NullableFloatFieldUpdateOperationsInput | number | null
    fechaComprometidaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versionCotizacion?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosCliente?: NullableStringFieldUpdateOperationsInput | string | null
    objeciones?: NullableStringFieldUpdateOperationsInput | string | null
    ordenCompra?: NullableStringFieldUpdateOperationsInput | string | null
    correoAceptacion?: NullableStringFieldUpdateOperationsInput | string | null
    condicionesComerciales?: NullableStringFieldUpdateOperationsInput | string | null
    coordinacionAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacion?: NullableStringFieldUpdateOperationsInput | string | null
    traspasoAdministracion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    traspasoERP?: NullableBoolFieldUpdateOperationsInput | boolean | null
    coordinacionDespacho?: NullableStringFieldUpdateOperationsInput | string | null
    estadoComercialOrden?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacionVenta?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    etapa?: StringFieldUpdateOperationsInput | string
    montoEstimado?: FloatFieldUpdateOperationsInput | number
    probabilidadCierre?: NullableIntFieldUpdateOperationsInput | number | null
    proximaAccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProximaAccion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    origen?: NullableStringFieldUpdateOperationsInput | string | null
    estadoStock?: NullableStringFieldUpdateOperationsInput | string | null
    cotizacionId?: NullableIntFieldUpdateOperationsInput | number | null
    motivoPerdida?: NullableStringFieldUpdateOperationsInput | string | null
    motivoPostergacion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaReactivacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documentoRespaldo?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    probabilidad?: NullableIntFieldUpdateOperationsInput | number | null
    flujoPosterior?: NullableStringFieldUpdateOperationsInput | string | null
    motivoDescarte?: NullableStringFieldUpdateOperationsInput | string | null
    tipoBroker?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEstimadaDespacho?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimientoPostventa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nombreOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    cargoContacto?: NullableStringFieldUpdateOperationsInput | string | null
    direccionProyecto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProbableCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riesgoTecnico?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosInternos?: NullableStringFieldUpdateOperationsInput | string | null
    observacionesTecnicas?: NullableStringFieldUpdateOperationsInput | string | null
    observacionCamposFaltantes?: NullableStringFieldUpdateOperationsInput | string | null
    lineaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    descuento?: NullableFloatFieldUpdateOperationsInput | number | null
    stockOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    reprogramacionesCount?: IntFieldUpdateOperationsInput | number
    fechaUltimoCambioEtapa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    esReactivacion?: BoolFieldUpdateOperationsInput | boolean
    historialEtapas?: HistorialEtapaTragerUpdateManyWithoutOportunidadNestedInput
  }

  export type FunnelTragerOpportunityUncheckedUpdateWithoutArchivosInput = {
    id?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    rutEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    comuna?: NullableStringFieldUpdateOperationsInput | string | null
    unidadNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    productoId?: NullableIntFieldUpdateOperationsInput | number | null
    cantidadEstimada?: NullableIntFieldUpdateOperationsInput | number | null
    urgencia?: NullableStringFieldUpdateOperationsInput | string | null
    tipoUso?: NullableStringFieldUpdateOperationsInput | string | null
    necesidadSoporteTecnico?: NullableBoolFieldUpdateOperationsInput | boolean | null
    alternativaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    comision?: NullableFloatFieldUpdateOperationsInput | number | null
    margenEstimado?: NullableFloatFieldUpdateOperationsInput | number | null
    fechaComprometidaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versionCotizacion?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosCliente?: NullableStringFieldUpdateOperationsInput | string | null
    objeciones?: NullableStringFieldUpdateOperationsInput | string | null
    ordenCompra?: NullableStringFieldUpdateOperationsInput | string | null
    correoAceptacion?: NullableStringFieldUpdateOperationsInput | string | null
    condicionesComerciales?: NullableStringFieldUpdateOperationsInput | string | null
    coordinacionAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacion?: NullableStringFieldUpdateOperationsInput | string | null
    traspasoAdministracion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    traspasoERP?: NullableBoolFieldUpdateOperationsInput | boolean | null
    coordinacionDespacho?: NullableStringFieldUpdateOperationsInput | string | null
    estadoComercialOrden?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacionVenta?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    etapa?: StringFieldUpdateOperationsInput | string
    montoEstimado?: FloatFieldUpdateOperationsInput | number
    probabilidadCierre?: NullableIntFieldUpdateOperationsInput | number | null
    proximaAccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProximaAccion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    origen?: NullableStringFieldUpdateOperationsInput | string | null
    estadoStock?: NullableStringFieldUpdateOperationsInput | string | null
    cotizacionId?: NullableIntFieldUpdateOperationsInput | number | null
    motivoPerdida?: NullableStringFieldUpdateOperationsInput | string | null
    motivoPostergacion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaReactivacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documentoRespaldo?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    probabilidad?: NullableIntFieldUpdateOperationsInput | number | null
    flujoPosterior?: NullableStringFieldUpdateOperationsInput | string | null
    motivoDescarte?: NullableStringFieldUpdateOperationsInput | string | null
    tipoBroker?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEstimadaDespacho?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimientoPostventa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nombreOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    cargoContacto?: NullableStringFieldUpdateOperationsInput | string | null
    direccionProyecto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProbableCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riesgoTecnico?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosInternos?: NullableStringFieldUpdateOperationsInput | string | null
    observacionesTecnicas?: NullableStringFieldUpdateOperationsInput | string | null
    observacionCamposFaltantes?: NullableStringFieldUpdateOperationsInput | string | null
    lineaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    descuento?: NullableFloatFieldUpdateOperationsInput | number | null
    stockOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    reprogramacionesCount?: IntFieldUpdateOperationsInput | number
    fechaUltimoCambioEtapa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    esReactivacion?: BoolFieldUpdateOperationsInput | boolean
    historialEtapas?: HistorialEtapaTragerUncheckedUpdateManyWithoutOportunidadNestedInput
  }

  export type FunnelTragerOpportunityCreateWithoutHistorialEtapasInput = {
    cliente: string
    contacto?: string | null
    telefono?: string | null
    correo?: string | null
    tipoCliente?: string | null
    rutEmpresa?: string | null
    region?: string | null
    comuna?: string | null
    unidadNegocio?: string | null
    productoId?: number | null
    cantidadEstimada?: number | null
    urgencia?: string | null
    tipoUso?: string | null
    necesidadSoporteTecnico?: boolean | null
    alternativaProducto?: string | null
    comision?: number | null
    margenEstimado?: number | null
    fechaComprometidaEnvio?: Date | string | null
    versionCotizacion?: string | null
    comentariosCliente?: string | null
    objeciones?: string | null
    ordenCompra?: string | null
    correoAceptacion?: string | null
    condicionesComerciales?: string | null
    coordinacionAdministrativa?: string | null
    estadoDocumentacion?: string | null
    traspasoAdministracion?: boolean | null
    traspasoERP?: boolean | null
    coordinacionDespacho?: string | null
    estadoComercialOrden?: string | null
    estadoDocumentacionVenta?: string | null
    responsable?: string | null
    etapa?: string
    montoEstimado?: number
    probabilidadCierre?: number | null
    proximaAccion?: string | null
    fechaProximaAccion?: Date | string | null
    observaciones?: string | null
    origen?: string | null
    estadoStock?: string | null
    cotizacionId?: number | null
    motivoPerdida?: string | null
    motivoPostergacion?: string | null
    fechaReactivacion?: Date | string | null
    documentoRespaldo?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    probabilidad?: number | null
    flujoPosterior?: string | null
    motivoDescarte?: string | null
    tipoBroker?: string | null
    fechaEstimadaDespacho?: Date | string | null
    fechaSeguimientoPostventa?: Date | string | null
    nombreOportunidad?: string | null
    cargoContacto?: string | null
    direccionProyecto?: string | null
    tipoOportunidad?: string | null
    fechaProbableCierre?: Date | string | null
    riesgoTecnico?: string | null
    comentariosInternos?: string | null
    observacionesTecnicas?: string | null
    observacionCamposFaltantes?: string | null
    lineaProducto?: string | null
    descuento?: number | null
    stockOportunidad?: string | null
    reprogramacionesCount?: number
    fechaUltimoCambioEtapa?: Date | string | null
    esReactivacion?: boolean
    archivos?: FunnelTragerArchivoCreateNestedManyWithoutOportunidadInput
  }

  export type FunnelTragerOpportunityUncheckedCreateWithoutHistorialEtapasInput = {
    id?: number
    cliente: string
    contacto?: string | null
    telefono?: string | null
    correo?: string | null
    tipoCliente?: string | null
    rutEmpresa?: string | null
    region?: string | null
    comuna?: string | null
    unidadNegocio?: string | null
    productoId?: number | null
    cantidadEstimada?: number | null
    urgencia?: string | null
    tipoUso?: string | null
    necesidadSoporteTecnico?: boolean | null
    alternativaProducto?: string | null
    comision?: number | null
    margenEstimado?: number | null
    fechaComprometidaEnvio?: Date | string | null
    versionCotizacion?: string | null
    comentariosCliente?: string | null
    objeciones?: string | null
    ordenCompra?: string | null
    correoAceptacion?: string | null
    condicionesComerciales?: string | null
    coordinacionAdministrativa?: string | null
    estadoDocumentacion?: string | null
    traspasoAdministracion?: boolean | null
    traspasoERP?: boolean | null
    coordinacionDespacho?: string | null
    estadoComercialOrden?: string | null
    estadoDocumentacionVenta?: string | null
    responsable?: string | null
    etapa?: string
    montoEstimado?: number
    probabilidadCierre?: number | null
    proximaAccion?: string | null
    fechaProximaAccion?: Date | string | null
    observaciones?: string | null
    origen?: string | null
    estadoStock?: string | null
    cotizacionId?: number | null
    motivoPerdida?: string | null
    motivoPostergacion?: string | null
    fechaReactivacion?: Date | string | null
    documentoRespaldo?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    probabilidad?: number | null
    flujoPosterior?: string | null
    motivoDescarte?: string | null
    tipoBroker?: string | null
    fechaEstimadaDespacho?: Date | string | null
    fechaSeguimientoPostventa?: Date | string | null
    nombreOportunidad?: string | null
    cargoContacto?: string | null
    direccionProyecto?: string | null
    tipoOportunidad?: string | null
    fechaProbableCierre?: Date | string | null
    riesgoTecnico?: string | null
    comentariosInternos?: string | null
    observacionesTecnicas?: string | null
    observacionCamposFaltantes?: string | null
    lineaProducto?: string | null
    descuento?: number | null
    stockOportunidad?: string | null
    reprogramacionesCount?: number
    fechaUltimoCambioEtapa?: Date | string | null
    esReactivacion?: boolean
    archivos?: FunnelTragerArchivoUncheckedCreateNestedManyWithoutOportunidadInput
  }

  export type FunnelTragerOpportunityCreateOrConnectWithoutHistorialEtapasInput = {
    where: FunnelTragerOpportunityWhereUniqueInput
    create: XOR<FunnelTragerOpportunityCreateWithoutHistorialEtapasInput, FunnelTragerOpportunityUncheckedCreateWithoutHistorialEtapasInput>
  }

  export type FunnelTragerOpportunityUpsertWithoutHistorialEtapasInput = {
    update: XOR<FunnelTragerOpportunityUpdateWithoutHistorialEtapasInput, FunnelTragerOpportunityUncheckedUpdateWithoutHistorialEtapasInput>
    create: XOR<FunnelTragerOpportunityCreateWithoutHistorialEtapasInput, FunnelTragerOpportunityUncheckedCreateWithoutHistorialEtapasInput>
    where?: FunnelTragerOpportunityWhereInput
  }

  export type FunnelTragerOpportunityUpdateToOneWithWhereWithoutHistorialEtapasInput = {
    where?: FunnelTragerOpportunityWhereInput
    data: XOR<FunnelTragerOpportunityUpdateWithoutHistorialEtapasInput, FunnelTragerOpportunityUncheckedUpdateWithoutHistorialEtapasInput>
  }

  export type FunnelTragerOpportunityUpdateWithoutHistorialEtapasInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    rutEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    comuna?: NullableStringFieldUpdateOperationsInput | string | null
    unidadNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    productoId?: NullableIntFieldUpdateOperationsInput | number | null
    cantidadEstimada?: NullableIntFieldUpdateOperationsInput | number | null
    urgencia?: NullableStringFieldUpdateOperationsInput | string | null
    tipoUso?: NullableStringFieldUpdateOperationsInput | string | null
    necesidadSoporteTecnico?: NullableBoolFieldUpdateOperationsInput | boolean | null
    alternativaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    comision?: NullableFloatFieldUpdateOperationsInput | number | null
    margenEstimado?: NullableFloatFieldUpdateOperationsInput | number | null
    fechaComprometidaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versionCotizacion?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosCliente?: NullableStringFieldUpdateOperationsInput | string | null
    objeciones?: NullableStringFieldUpdateOperationsInput | string | null
    ordenCompra?: NullableStringFieldUpdateOperationsInput | string | null
    correoAceptacion?: NullableStringFieldUpdateOperationsInput | string | null
    condicionesComerciales?: NullableStringFieldUpdateOperationsInput | string | null
    coordinacionAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacion?: NullableStringFieldUpdateOperationsInput | string | null
    traspasoAdministracion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    traspasoERP?: NullableBoolFieldUpdateOperationsInput | boolean | null
    coordinacionDespacho?: NullableStringFieldUpdateOperationsInput | string | null
    estadoComercialOrden?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacionVenta?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    etapa?: StringFieldUpdateOperationsInput | string
    montoEstimado?: FloatFieldUpdateOperationsInput | number
    probabilidadCierre?: NullableIntFieldUpdateOperationsInput | number | null
    proximaAccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProximaAccion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    origen?: NullableStringFieldUpdateOperationsInput | string | null
    estadoStock?: NullableStringFieldUpdateOperationsInput | string | null
    cotizacionId?: NullableIntFieldUpdateOperationsInput | number | null
    motivoPerdida?: NullableStringFieldUpdateOperationsInput | string | null
    motivoPostergacion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaReactivacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documentoRespaldo?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    probabilidad?: NullableIntFieldUpdateOperationsInput | number | null
    flujoPosterior?: NullableStringFieldUpdateOperationsInput | string | null
    motivoDescarte?: NullableStringFieldUpdateOperationsInput | string | null
    tipoBroker?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEstimadaDespacho?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimientoPostventa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nombreOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    cargoContacto?: NullableStringFieldUpdateOperationsInput | string | null
    direccionProyecto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProbableCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riesgoTecnico?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosInternos?: NullableStringFieldUpdateOperationsInput | string | null
    observacionesTecnicas?: NullableStringFieldUpdateOperationsInput | string | null
    observacionCamposFaltantes?: NullableStringFieldUpdateOperationsInput | string | null
    lineaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    descuento?: NullableFloatFieldUpdateOperationsInput | number | null
    stockOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    reprogramacionesCount?: IntFieldUpdateOperationsInput | number
    fechaUltimoCambioEtapa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    esReactivacion?: BoolFieldUpdateOperationsInput | boolean
    archivos?: FunnelTragerArchivoUpdateManyWithoutOportunidadNestedInput
  }

  export type FunnelTragerOpportunityUncheckedUpdateWithoutHistorialEtapasInput = {
    id?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    rutEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    comuna?: NullableStringFieldUpdateOperationsInput | string | null
    unidadNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    productoId?: NullableIntFieldUpdateOperationsInput | number | null
    cantidadEstimada?: NullableIntFieldUpdateOperationsInput | number | null
    urgencia?: NullableStringFieldUpdateOperationsInput | string | null
    tipoUso?: NullableStringFieldUpdateOperationsInput | string | null
    necesidadSoporteTecnico?: NullableBoolFieldUpdateOperationsInput | boolean | null
    alternativaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    comision?: NullableFloatFieldUpdateOperationsInput | number | null
    margenEstimado?: NullableFloatFieldUpdateOperationsInput | number | null
    fechaComprometidaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versionCotizacion?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosCliente?: NullableStringFieldUpdateOperationsInput | string | null
    objeciones?: NullableStringFieldUpdateOperationsInput | string | null
    ordenCompra?: NullableStringFieldUpdateOperationsInput | string | null
    correoAceptacion?: NullableStringFieldUpdateOperationsInput | string | null
    condicionesComerciales?: NullableStringFieldUpdateOperationsInput | string | null
    coordinacionAdministrativa?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacion?: NullableStringFieldUpdateOperationsInput | string | null
    traspasoAdministracion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    traspasoERP?: NullableBoolFieldUpdateOperationsInput | boolean | null
    coordinacionDespacho?: NullableStringFieldUpdateOperationsInput | string | null
    estadoComercialOrden?: NullableStringFieldUpdateOperationsInput | string | null
    estadoDocumentacionVenta?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    etapa?: StringFieldUpdateOperationsInput | string
    montoEstimado?: FloatFieldUpdateOperationsInput | number
    probabilidadCierre?: NullableIntFieldUpdateOperationsInput | number | null
    proximaAccion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProximaAccion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    origen?: NullableStringFieldUpdateOperationsInput | string | null
    estadoStock?: NullableStringFieldUpdateOperationsInput | string | null
    cotizacionId?: NullableIntFieldUpdateOperationsInput | number | null
    motivoPerdida?: NullableStringFieldUpdateOperationsInput | string | null
    motivoPostergacion?: NullableStringFieldUpdateOperationsInput | string | null
    fechaReactivacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documentoRespaldo?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    probabilidad?: NullableIntFieldUpdateOperationsInput | number | null
    flujoPosterior?: NullableStringFieldUpdateOperationsInput | string | null
    motivoDescarte?: NullableStringFieldUpdateOperationsInput | string | null
    tipoBroker?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEstimadaDespacho?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimientoPostventa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nombreOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    cargoContacto?: NullableStringFieldUpdateOperationsInput | string | null
    direccionProyecto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    fechaProbableCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    riesgoTecnico?: NullableStringFieldUpdateOperationsInput | string | null
    comentariosInternos?: NullableStringFieldUpdateOperationsInput | string | null
    observacionesTecnicas?: NullableStringFieldUpdateOperationsInput | string | null
    observacionCamposFaltantes?: NullableStringFieldUpdateOperationsInput | string | null
    lineaProducto?: NullableStringFieldUpdateOperationsInput | string | null
    descuento?: NullableFloatFieldUpdateOperationsInput | number | null
    stockOportunidad?: NullableStringFieldUpdateOperationsInput | string | null
    reprogramacionesCount?: IntFieldUpdateOperationsInput | number
    fechaUltimoCambioEtapa?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    esReactivacion?: BoolFieldUpdateOperationsInput | boolean
    archivos?: FunnelTragerArchivoUncheckedUpdateManyWithoutOportunidadNestedInput
  }

  export type ProductoCreateWithoutCategoriaInput = {
    nombre: string
    descripcion?: string | null
    stock: number
    ubicacion?: string | null
    createdAt?: Date | string
    precio: number
    minStock?: number
    activo?: boolean
    criticidad?: string
    imagen?: string | null
    stockReservado?: number
    sku?: string | null
    disponibilidad?: string | null
    formato?: string | null
    cantidadCaja?: string | null
    precioUsd?: number | null
    precioSugerido?: number | null
    stockInicial?: number | null
    CotizacionTragerDetalle?: CotizacionTragerDetalleCreateNestedManyWithoutProductoInput
  }

  export type ProductoUncheckedCreateWithoutCategoriaInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    stock: number
    ubicacion?: string | null
    createdAt?: Date | string
    precio: number
    minStock?: number
    activo?: boolean
    criticidad?: string
    imagen?: string | null
    stockReservado?: number
    sku?: string | null
    disponibilidad?: string | null
    formato?: string | null
    cantidadCaja?: string | null
    precioUsd?: number | null
    precioSugerido?: number | null
    stockInicial?: number | null
    CotizacionTragerDetalle?: CotizacionTragerDetalleUncheckedCreateNestedManyWithoutProductoInput
  }

  export type ProductoCreateOrConnectWithoutCategoriaInput = {
    where: ProductoWhereUniqueInput
    create: XOR<ProductoCreateWithoutCategoriaInput, ProductoUncheckedCreateWithoutCategoriaInput>
  }

  export type ProductoCreateManyCategoriaInputEnvelope = {
    data: ProductoCreateManyCategoriaInput | ProductoCreateManyCategoriaInput[]
    skipDuplicates?: boolean
  }

  export type ProductoUpsertWithWhereUniqueWithoutCategoriaInput = {
    where: ProductoWhereUniqueInput
    update: XOR<ProductoUpdateWithoutCategoriaInput, ProductoUncheckedUpdateWithoutCategoriaInput>
    create: XOR<ProductoCreateWithoutCategoriaInput, ProductoUncheckedCreateWithoutCategoriaInput>
  }

  export type ProductoUpdateWithWhereUniqueWithoutCategoriaInput = {
    where: ProductoWhereUniqueInput
    data: XOR<ProductoUpdateWithoutCategoriaInput, ProductoUncheckedUpdateWithoutCategoriaInput>
  }

  export type ProductoUpdateManyWithWhereWithoutCategoriaInput = {
    where: ProductoScalarWhereInput
    data: XOR<ProductoUpdateManyMutationInput, ProductoUncheckedUpdateManyWithoutCategoriaInput>
  }

  export type ProductoScalarWhereInput = {
    AND?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
    OR?: ProductoScalarWhereInput[]
    NOT?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
    id?: IntFilter<"Producto"> | number
    nombre?: StringFilter<"Producto"> | string
    descripcion?: StringNullableFilter<"Producto"> | string | null
    stock?: IntFilter<"Producto"> | number
    ubicacion?: StringNullableFilter<"Producto"> | string | null
    createdAt?: DateTimeFilter<"Producto"> | Date | string
    precio?: FloatFilter<"Producto"> | number
    minStock?: IntFilter<"Producto"> | number
    activo?: BoolFilter<"Producto"> | boolean
    criticidad?: StringFilter<"Producto"> | string
    imagen?: StringNullableFilter<"Producto"> | string | null
    categoriaId?: IntFilter<"Producto"> | number
    stockReservado?: IntFilter<"Producto"> | number
    sku?: StringNullableFilter<"Producto"> | string | null
    disponibilidad?: StringNullableFilter<"Producto"> | string | null
    formato?: StringNullableFilter<"Producto"> | string | null
    cantidadCaja?: StringNullableFilter<"Producto"> | string | null
    precioUsd?: FloatNullableFilter<"Producto"> | number | null
    precioSugerido?: FloatNullableFilter<"Producto"> | number | null
    stockInicial?: IntNullableFilter<"Producto"> | number | null
  }

  export type CategoriaCreateWithoutProductoInput = {
    nombre: string
  }

  export type CategoriaUncheckedCreateWithoutProductoInput = {
    id?: number
    nombre: string
  }

  export type CategoriaCreateOrConnectWithoutProductoInput = {
    where: CategoriaWhereUniqueInput
    create: XOR<CategoriaCreateWithoutProductoInput, CategoriaUncheckedCreateWithoutProductoInput>
  }

  export type CotizacionTragerDetalleCreateWithoutProductoInput = {
    cantidad: number
    precioUnitario: number
    descuentoPct?: number
    subtotal: number
    stockDisponible?: number | null
    observacion?: string | null
    cotizacion: CotizacionTragerCreateNestedOneWithoutDetallesInput
  }

  export type CotizacionTragerDetalleUncheckedCreateWithoutProductoInput = {
    id?: number
    cotizacionId: number
    cantidad: number
    precioUnitario: number
    descuentoPct?: number
    subtotal: number
    stockDisponible?: number | null
    observacion?: string | null
  }

  export type CotizacionTragerDetalleCreateOrConnectWithoutProductoInput = {
    where: CotizacionTragerDetalleWhereUniqueInput
    create: XOR<CotizacionTragerDetalleCreateWithoutProductoInput, CotizacionTragerDetalleUncheckedCreateWithoutProductoInput>
  }

  export type CotizacionTragerDetalleCreateManyProductoInputEnvelope = {
    data: CotizacionTragerDetalleCreateManyProductoInput | CotizacionTragerDetalleCreateManyProductoInput[]
    skipDuplicates?: boolean
  }

  export type CategoriaUpsertWithoutProductoInput = {
    update: XOR<CategoriaUpdateWithoutProductoInput, CategoriaUncheckedUpdateWithoutProductoInput>
    create: XOR<CategoriaCreateWithoutProductoInput, CategoriaUncheckedCreateWithoutProductoInput>
    where?: CategoriaWhereInput
  }

  export type CategoriaUpdateToOneWithWhereWithoutProductoInput = {
    where?: CategoriaWhereInput
    data: XOR<CategoriaUpdateWithoutProductoInput, CategoriaUncheckedUpdateWithoutProductoInput>
  }

  export type CategoriaUpdateWithoutProductoInput = {
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type CategoriaUncheckedUpdateWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type CotizacionTragerDetalleUpsertWithWhereUniqueWithoutProductoInput = {
    where: CotizacionTragerDetalleWhereUniqueInput
    update: XOR<CotizacionTragerDetalleUpdateWithoutProductoInput, CotizacionTragerDetalleUncheckedUpdateWithoutProductoInput>
    create: XOR<CotizacionTragerDetalleCreateWithoutProductoInput, CotizacionTragerDetalleUncheckedCreateWithoutProductoInput>
  }

  export type CotizacionTragerDetalleUpdateWithWhereUniqueWithoutProductoInput = {
    where: CotizacionTragerDetalleWhereUniqueInput
    data: XOR<CotizacionTragerDetalleUpdateWithoutProductoInput, CotizacionTragerDetalleUncheckedUpdateWithoutProductoInput>
  }

  export type CotizacionTragerDetalleUpdateManyWithWhereWithoutProductoInput = {
    where: CotizacionTragerDetalleScalarWhereInput
    data: XOR<CotizacionTragerDetalleUpdateManyMutationInput, CotizacionTragerDetalleUncheckedUpdateManyWithoutProductoInput>
  }

  export type CotizacionTragerDetalleScalarWhereInput = {
    AND?: CotizacionTragerDetalleScalarWhereInput | CotizacionTragerDetalleScalarWhereInput[]
    OR?: CotizacionTragerDetalleScalarWhereInput[]
    NOT?: CotizacionTragerDetalleScalarWhereInput | CotizacionTragerDetalleScalarWhereInput[]
    id?: IntFilter<"CotizacionTragerDetalle"> | number
    cotizacionId?: IntFilter<"CotizacionTragerDetalle"> | number
    productoId?: IntFilter<"CotizacionTragerDetalle"> | number
    cantidad?: IntFilter<"CotizacionTragerDetalle"> | number
    precioUnitario?: FloatFilter<"CotizacionTragerDetalle"> | number
    descuentoPct?: FloatFilter<"CotizacionTragerDetalle"> | number
    subtotal?: FloatFilter<"CotizacionTragerDetalle"> | number
    stockDisponible?: IntNullableFilter<"CotizacionTragerDetalle"> | number | null
    observacion?: StringNullableFilter<"CotizacionTragerDetalle"> | string | null
  }

  export type CotizacionTragerDetalleCreateWithoutCotizacionInput = {
    cantidad: number
    precioUnitario: number
    descuentoPct?: number
    subtotal: number
    stockDisponible?: number | null
    observacion?: string | null
    producto: ProductoCreateNestedOneWithoutCotizacionTragerDetalleInput
  }

  export type CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput = {
    id?: number
    productoId: number
    cantidad: number
    precioUnitario: number
    descuentoPct?: number
    subtotal: number
    stockDisponible?: number | null
    observacion?: string | null
  }

  export type CotizacionTragerDetalleCreateOrConnectWithoutCotizacionInput = {
    where: CotizacionTragerDetalleWhereUniqueInput
    create: XOR<CotizacionTragerDetalleCreateWithoutCotizacionInput, CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput>
  }

  export type CotizacionTragerDetalleCreateManyCotizacionInputEnvelope = {
    data: CotizacionTragerDetalleCreateManyCotizacionInput | CotizacionTragerDetalleCreateManyCotizacionInput[]
    skipDuplicates?: boolean
  }

  export type CotizacionTragerDetalleUpsertWithWhereUniqueWithoutCotizacionInput = {
    where: CotizacionTragerDetalleWhereUniqueInput
    update: XOR<CotizacionTragerDetalleUpdateWithoutCotizacionInput, CotizacionTragerDetalleUncheckedUpdateWithoutCotizacionInput>
    create: XOR<CotizacionTragerDetalleCreateWithoutCotizacionInput, CotizacionTragerDetalleUncheckedCreateWithoutCotizacionInput>
  }

  export type CotizacionTragerDetalleUpdateWithWhereUniqueWithoutCotizacionInput = {
    where: CotizacionTragerDetalleWhereUniqueInput
    data: XOR<CotizacionTragerDetalleUpdateWithoutCotizacionInput, CotizacionTragerDetalleUncheckedUpdateWithoutCotizacionInput>
  }

  export type CotizacionTragerDetalleUpdateManyWithWhereWithoutCotizacionInput = {
    where: CotizacionTragerDetalleScalarWhereInput
    data: XOR<CotizacionTragerDetalleUpdateManyMutationInput, CotizacionTragerDetalleUncheckedUpdateManyWithoutCotizacionInput>
  }

  export type CotizacionTragerCreateWithoutDetallesInput = {
    cliente: string
    contacto?: string | null
    tipoCliente?: string | null
    responsable?: string | null
    estado?: string
    subtotal?: number
    descuento?: number
    impuesto?: number
    total?: number
    fechaCotizacion?: Date | string
    fechaVencimiento?: Date | string | null
    fechaEnvio?: Date | string | null
    fechaSeguimiento?: Date | string | null
    fechaCierre?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    numero?: string | null
  }

  export type CotizacionTragerUncheckedCreateWithoutDetallesInput = {
    id?: number
    cliente: string
    contacto?: string | null
    tipoCliente?: string | null
    responsable?: string | null
    estado?: string
    subtotal?: number
    descuento?: number
    impuesto?: number
    total?: number
    fechaCotizacion?: Date | string
    fechaVencimiento?: Date | string | null
    fechaEnvio?: Date | string | null
    fechaSeguimiento?: Date | string | null
    fechaCierre?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    numero?: string | null
  }

  export type CotizacionTragerCreateOrConnectWithoutDetallesInput = {
    where: CotizacionTragerWhereUniqueInput
    create: XOR<CotizacionTragerCreateWithoutDetallesInput, CotizacionTragerUncheckedCreateWithoutDetallesInput>
  }

  export type ProductoCreateWithoutCotizacionTragerDetalleInput = {
    nombre: string
    descripcion?: string | null
    stock: number
    ubicacion?: string | null
    createdAt?: Date | string
    precio: number
    minStock?: number
    activo?: boolean
    criticidad?: string
    imagen?: string | null
    stockReservado?: number
    sku?: string | null
    disponibilidad?: string | null
    formato?: string | null
    cantidadCaja?: string | null
    precioUsd?: number | null
    precioSugerido?: number | null
    stockInicial?: number | null
    Categoria: CategoriaCreateNestedOneWithoutProductoInput
  }

  export type ProductoUncheckedCreateWithoutCotizacionTragerDetalleInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    stock: number
    ubicacion?: string | null
    createdAt?: Date | string
    precio: number
    minStock?: number
    activo?: boolean
    criticidad?: string
    imagen?: string | null
    categoriaId: number
    stockReservado?: number
    sku?: string | null
    disponibilidad?: string | null
    formato?: string | null
    cantidadCaja?: string | null
    precioUsd?: number | null
    precioSugerido?: number | null
    stockInicial?: number | null
  }

  export type ProductoCreateOrConnectWithoutCotizacionTragerDetalleInput = {
    where: ProductoWhereUniqueInput
    create: XOR<ProductoCreateWithoutCotizacionTragerDetalleInput, ProductoUncheckedCreateWithoutCotizacionTragerDetalleInput>
  }

  export type CotizacionTragerUpsertWithoutDetallesInput = {
    update: XOR<CotizacionTragerUpdateWithoutDetallesInput, CotizacionTragerUncheckedUpdateWithoutDetallesInput>
    create: XOR<CotizacionTragerCreateWithoutDetallesInput, CotizacionTragerUncheckedCreateWithoutDetallesInput>
    where?: CotizacionTragerWhereInput
  }

  export type CotizacionTragerUpdateToOneWithWhereWithoutDetallesInput = {
    where?: CotizacionTragerWhereInput
    data: XOR<CotizacionTragerUpdateWithoutDetallesInput, CotizacionTragerUncheckedUpdateWithoutDetallesInput>
  }

  export type CotizacionTragerUpdateWithoutDetallesInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    descuento?: FloatFieldUpdateOperationsInput | number
    impuesto?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fechaCotizacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaVencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CotizacionTragerUncheckedUpdateWithoutDetallesInput = {
    id?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    tipoCliente?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    descuento?: FloatFieldUpdateOperationsInput | number
    impuesto?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fechaCotizacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaVencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSeguimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    numero?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProductoUpsertWithoutCotizacionTragerDetalleInput = {
    update: XOR<ProductoUpdateWithoutCotizacionTragerDetalleInput, ProductoUncheckedUpdateWithoutCotizacionTragerDetalleInput>
    create: XOR<ProductoCreateWithoutCotizacionTragerDetalleInput, ProductoUncheckedCreateWithoutCotizacionTragerDetalleInput>
    where?: ProductoWhereInput
  }

  export type ProductoUpdateToOneWithWhereWithoutCotizacionTragerDetalleInput = {
    where?: ProductoWhereInput
    data: XOR<ProductoUpdateWithoutCotizacionTragerDetalleInput, ProductoUncheckedUpdateWithoutCotizacionTragerDetalleInput>
  }

  export type ProductoUpdateWithoutCotizacionTragerDetalleInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    precio?: FloatFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    criticidad?: StringFieldUpdateOperationsInput | string
    imagen?: NullableStringFieldUpdateOperationsInput | string | null
    stockReservado?: IntFieldUpdateOperationsInput | number
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilidad?: NullableStringFieldUpdateOperationsInput | string | null
    formato?: NullableStringFieldUpdateOperationsInput | string | null
    cantidadCaja?: NullableStringFieldUpdateOperationsInput | string | null
    precioUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    precioSugerido?: NullableFloatFieldUpdateOperationsInput | number | null
    stockInicial?: NullableIntFieldUpdateOperationsInput | number | null
    Categoria?: CategoriaUpdateOneRequiredWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateWithoutCotizacionTragerDetalleInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    precio?: FloatFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    criticidad?: StringFieldUpdateOperationsInput | string
    imagen?: NullableStringFieldUpdateOperationsInput | string | null
    categoriaId?: IntFieldUpdateOperationsInput | number
    stockReservado?: IntFieldUpdateOperationsInput | number
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilidad?: NullableStringFieldUpdateOperationsInput | string | null
    formato?: NullableStringFieldUpdateOperationsInput | string | null
    cantidadCaja?: NullableStringFieldUpdateOperationsInput | string | null
    precioUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    precioSugerido?: NullableFloatFieldUpdateOperationsInput | number | null
    stockInicial?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type FunnelTragerArchivoCreateManyOportunidadInput = {
    id?: number
    tipo: string
    url: string
    publicId: string
    nombreArchivo?: string | null
    mimeType?: string | null
    bytes?: number | null
    etapa?: string | null
    observaciones?: string | null
    createdAt?: Date | string
  }

  export type HistorialEtapaTragerCreateManyOportunidadInput = {
    id?: number
    etapaAnterior?: string | null
    etapaNueva: string
    usuarioId?: string | null
    createdAt?: Date | string
  }

  export type FunnelTragerArchivoUpdateWithoutOportunidadInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    nombreArchivo?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    bytes?: NullableIntFieldUpdateOperationsInput | number | null
    etapa?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FunnelTragerArchivoUncheckedUpdateWithoutOportunidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    nombreArchivo?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    bytes?: NullableIntFieldUpdateOperationsInput | number | null
    etapa?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FunnelTragerArchivoUncheckedUpdateManyWithoutOportunidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: StringFieldUpdateOperationsInput | string
    nombreArchivo?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    bytes?: NullableIntFieldUpdateOperationsInput | number | null
    etapa?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialEtapaTragerUpdateWithoutOportunidadInput = {
    etapaAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    etapaNueva?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialEtapaTragerUncheckedUpdateWithoutOportunidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    etapaAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    etapaNueva?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialEtapaTragerUncheckedUpdateManyWithoutOportunidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    etapaAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    etapaNueva?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductoCreateManyCategoriaInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    stock: number
    ubicacion?: string | null
    createdAt?: Date | string
    precio: number
    minStock?: number
    activo?: boolean
    criticidad?: string
    imagen?: string | null
    stockReservado?: number
    sku?: string | null
    disponibilidad?: string | null
    formato?: string | null
    cantidadCaja?: string | null
    precioUsd?: number | null
    precioSugerido?: number | null
    stockInicial?: number | null
  }

  export type ProductoUpdateWithoutCategoriaInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    precio?: FloatFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    criticidad?: StringFieldUpdateOperationsInput | string
    imagen?: NullableStringFieldUpdateOperationsInput | string | null
    stockReservado?: IntFieldUpdateOperationsInput | number
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilidad?: NullableStringFieldUpdateOperationsInput | string | null
    formato?: NullableStringFieldUpdateOperationsInput | string | null
    cantidadCaja?: NullableStringFieldUpdateOperationsInput | string | null
    precioUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    precioSugerido?: NullableFloatFieldUpdateOperationsInput | number | null
    stockInicial?: NullableIntFieldUpdateOperationsInput | number | null
    CotizacionTragerDetalle?: CotizacionTragerDetalleUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateWithoutCategoriaInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    precio?: FloatFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    criticidad?: StringFieldUpdateOperationsInput | string
    imagen?: NullableStringFieldUpdateOperationsInput | string | null
    stockReservado?: IntFieldUpdateOperationsInput | number
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilidad?: NullableStringFieldUpdateOperationsInput | string | null
    formato?: NullableStringFieldUpdateOperationsInput | string | null
    cantidadCaja?: NullableStringFieldUpdateOperationsInput | string | null
    precioUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    precioSugerido?: NullableFloatFieldUpdateOperationsInput | number | null
    stockInicial?: NullableIntFieldUpdateOperationsInput | number | null
    CotizacionTragerDetalle?: CotizacionTragerDetalleUncheckedUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateManyWithoutCategoriaInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    stock?: IntFieldUpdateOperationsInput | number
    ubicacion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    precio?: FloatFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    criticidad?: StringFieldUpdateOperationsInput | string
    imagen?: NullableStringFieldUpdateOperationsInput | string | null
    stockReservado?: IntFieldUpdateOperationsInput | number
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilidad?: NullableStringFieldUpdateOperationsInput | string | null
    formato?: NullableStringFieldUpdateOperationsInput | string | null
    cantidadCaja?: NullableStringFieldUpdateOperationsInput | string | null
    precioUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    precioSugerido?: NullableFloatFieldUpdateOperationsInput | number | null
    stockInicial?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CotizacionTragerDetalleCreateManyProductoInput = {
    id?: number
    cotizacionId: number
    cantidad: number
    precioUnitario: number
    descuentoPct?: number
    subtotal: number
    stockDisponible?: number | null
    observacion?: string | null
  }

  export type CotizacionTragerDetalleUpdateWithoutProductoInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnitario?: FloatFieldUpdateOperationsInput | number
    descuentoPct?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    stockDisponible?: NullableIntFieldUpdateOperationsInput | number | null
    observacion?: NullableStringFieldUpdateOperationsInput | string | null
    cotizacion?: CotizacionTragerUpdateOneRequiredWithoutDetallesNestedInput
  }

  export type CotizacionTragerDetalleUncheckedUpdateWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    cotizacionId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnitario?: FloatFieldUpdateOperationsInput | number
    descuentoPct?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    stockDisponible?: NullableIntFieldUpdateOperationsInput | number | null
    observacion?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CotizacionTragerDetalleUncheckedUpdateManyWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    cotizacionId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnitario?: FloatFieldUpdateOperationsInput | number
    descuentoPct?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    stockDisponible?: NullableIntFieldUpdateOperationsInput | number | null
    observacion?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CotizacionTragerDetalleCreateManyCotizacionInput = {
    id?: number
    productoId: number
    cantidad: number
    precioUnitario: number
    descuentoPct?: number
    subtotal: number
    stockDisponible?: number | null
    observacion?: string | null
  }

  export type CotizacionTragerDetalleUpdateWithoutCotizacionInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnitario?: FloatFieldUpdateOperationsInput | number
    descuentoPct?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    stockDisponible?: NullableIntFieldUpdateOperationsInput | number | null
    observacion?: NullableStringFieldUpdateOperationsInput | string | null
    producto?: ProductoUpdateOneRequiredWithoutCotizacionTragerDetalleNestedInput
  }

  export type CotizacionTragerDetalleUncheckedUpdateWithoutCotizacionInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnitario?: FloatFieldUpdateOperationsInput | number
    descuentoPct?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    stockDisponible?: NullableIntFieldUpdateOperationsInput | number | null
    observacion?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CotizacionTragerDetalleUncheckedUpdateManyWithoutCotizacionInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnitario?: FloatFieldUpdateOperationsInput | number
    descuentoPct?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    stockDisponible?: NullableIntFieldUpdateOperationsInput | number | null
    observacion?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}