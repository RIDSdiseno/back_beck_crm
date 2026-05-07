
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
 * Model Categoria
 * 
 */
export type Categoria = $Result.DefaultSelection<Prisma.$CategoriaPayload>
/**
 * Model Movimiento
 * 
 */
export type Movimiento = $Result.DefaultSelection<Prisma.$MovimientoPayload>
/**
 * Model Producto
 * 
 */
export type Producto = $Result.DefaultSelection<Prisma.$ProductoPayload>
/**
 * Model Venta
 * 
 */
export type Venta = $Result.DefaultSelection<Prisma.$VentaPayload>
/**
 * Model VentaDetalle
 * 
 */
export type VentaDetalle = $Result.DefaultSelection<Prisma.$VentaDetallePayload>
/**
 * Model user
 * 
 */
export type user = $Result.DefaultSelection<Prisma.$userPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Categorias
 * const categorias = await prisma.categoria.findMany()
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
   * // Fetch zero or more Categorias
   * const categorias = await prisma.categoria.findMany()
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
   * `prisma.categoria`: Exposes CRUD operations for the **Categoria** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categorias
    * const categorias = await prisma.categoria.findMany()
    * ```
    */
  get categoria(): Prisma.CategoriaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.movimiento`: Exposes CRUD operations for the **Movimiento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Movimientos
    * const movimientos = await prisma.movimiento.findMany()
    * ```
    */
  get movimiento(): Prisma.MovimientoDelegate<ExtArgs, ClientOptions>;

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
   * `prisma.venta`: Exposes CRUD operations for the **Venta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ventas
    * const ventas = await prisma.venta.findMany()
    * ```
    */
  get venta(): Prisma.VentaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ventaDetalle`: Exposes CRUD operations for the **VentaDetalle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VentaDetalles
    * const ventaDetalles = await prisma.ventaDetalle.findMany()
    * ```
    */
  get ventaDetalle(): Prisma.VentaDetalleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.userDelegate<ExtArgs, ClientOptions>;
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
    Categoria: 'Categoria',
    Movimiento: 'Movimiento',
    Producto: 'Producto',
    Venta: 'Venta',
    VentaDetalle: 'VentaDetalle',
    user: 'user'
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
      modelProps: "categoria" | "movimiento" | "producto" | "venta" | "ventaDetalle" | "user"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
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
      Movimiento: {
        payload: Prisma.$MovimientoPayload<ExtArgs>
        fields: Prisma.MovimientoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MovimientoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MovimientoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload>
          }
          findFirst: {
            args: Prisma.MovimientoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MovimientoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload>
          }
          findMany: {
            args: Prisma.MovimientoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload>[]
          }
          create: {
            args: Prisma.MovimientoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload>
          }
          createMany: {
            args: Prisma.MovimientoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MovimientoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload>[]
          }
          delete: {
            args: Prisma.MovimientoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload>
          }
          update: {
            args: Prisma.MovimientoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload>
          }
          deleteMany: {
            args: Prisma.MovimientoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MovimientoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MovimientoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload>[]
          }
          upsert: {
            args: Prisma.MovimientoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoPayload>
          }
          aggregate: {
            args: Prisma.MovimientoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMovimiento>
          }
          groupBy: {
            args: Prisma.MovimientoGroupByArgs<ExtArgs>
            result: $Utils.Optional<MovimientoGroupByOutputType>[]
          }
          count: {
            args: Prisma.MovimientoCountArgs<ExtArgs>
            result: $Utils.Optional<MovimientoCountAggregateOutputType> | number
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
      Venta: {
        payload: Prisma.$VentaPayload<ExtArgs>
        fields: Prisma.VentaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VentaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VentaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload>
          }
          findFirst: {
            args: Prisma.VentaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VentaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload>
          }
          findMany: {
            args: Prisma.VentaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload>[]
          }
          create: {
            args: Prisma.VentaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload>
          }
          createMany: {
            args: Prisma.VentaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VentaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload>[]
          }
          delete: {
            args: Prisma.VentaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload>
          }
          update: {
            args: Prisma.VentaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload>
          }
          deleteMany: {
            args: Prisma.VentaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VentaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VentaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload>[]
          }
          upsert: {
            args: Prisma.VentaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaPayload>
          }
          aggregate: {
            args: Prisma.VentaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVenta>
          }
          groupBy: {
            args: Prisma.VentaGroupByArgs<ExtArgs>
            result: $Utils.Optional<VentaGroupByOutputType>[]
          }
          count: {
            args: Prisma.VentaCountArgs<ExtArgs>
            result: $Utils.Optional<VentaCountAggregateOutputType> | number
          }
        }
      }
      VentaDetalle: {
        payload: Prisma.$VentaDetallePayload<ExtArgs>
        fields: Prisma.VentaDetalleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VentaDetalleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VentaDetalleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload>
          }
          findFirst: {
            args: Prisma.VentaDetalleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VentaDetalleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload>
          }
          findMany: {
            args: Prisma.VentaDetalleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload>[]
          }
          create: {
            args: Prisma.VentaDetalleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload>
          }
          createMany: {
            args: Prisma.VentaDetalleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VentaDetalleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload>[]
          }
          delete: {
            args: Prisma.VentaDetalleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload>
          }
          update: {
            args: Prisma.VentaDetalleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload>
          }
          deleteMany: {
            args: Prisma.VentaDetalleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VentaDetalleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VentaDetalleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload>[]
          }
          upsert: {
            args: Prisma.VentaDetalleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VentaDetallePayload>
          }
          aggregate: {
            args: Prisma.VentaDetalleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVentaDetalle>
          }
          groupBy: {
            args: Prisma.VentaDetalleGroupByArgs<ExtArgs>
            result: $Utils.Optional<VentaDetalleGroupByOutputType>[]
          }
          count: {
            args: Prisma.VentaDetalleCountArgs<ExtArgs>
            result: $Utils.Optional<VentaDetalleCountAggregateOutputType> | number
          }
        }
      }
      user: {
        payload: Prisma.$userPayload<ExtArgs>
        fields: Prisma.userFieldRefs
        operations: {
          findUnique: {
            args: Prisma.userFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.userFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findFirst: {
            args: Prisma.userFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.userFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findMany: {
            args: Prisma.userFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          create: {
            args: Prisma.userCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          createMany: {
            args: Prisma.userCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.userCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          delete: {
            args: Prisma.userDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          update: {
            args: Prisma.userUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          deleteMany: {
            args: Prisma.userDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.userUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.userUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          upsert: {
            args: Prisma.userUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.userGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.userCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
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
    categoria?: CategoriaOmit
    movimiento?: MovimientoOmit
    producto?: ProductoOmit
    venta?: VentaOmit
    ventaDetalle?: VentaDetalleOmit
    user?: userOmit
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
    Movimiento: number
    Venta: number
    VentaDetalle: number
  }

  export type ProductoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Movimiento?: boolean | ProductoCountOutputTypeCountMovimientoArgs
    Venta?: boolean | ProductoCountOutputTypeCountVentaArgs
    VentaDetalle?: boolean | ProductoCountOutputTypeCountVentaDetalleArgs
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
  export type ProductoCountOutputTypeCountMovimientoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovimientoWhereInput
  }

  /**
   * ProductoCountOutputType without action
   */
  export type ProductoCountOutputTypeCountVentaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VentaWhereInput
  }

  /**
   * ProductoCountOutputType without action
   */
  export type ProductoCountOutputTypeCountVentaDetalleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VentaDetalleWhereInput
  }


  /**
   * Count Type VentaCountOutputType
   */

  export type VentaCountOutputType = {
    VentaDetalle: number
  }

  export type VentaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    VentaDetalle?: boolean | VentaCountOutputTypeCountVentaDetalleArgs
  }

  // Custom InputTypes
  /**
   * VentaCountOutputType without action
   */
  export type VentaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaCountOutputType
     */
    select?: VentaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VentaCountOutputType without action
   */
  export type VentaCountOutputTypeCountVentaDetalleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VentaDetalleWhereInput
  }


  /**
   * Models
   */

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
   * Model Movimiento
   */

  export type AggregateMovimiento = {
    _count: MovimientoCountAggregateOutputType | null
    _avg: MovimientoAvgAggregateOutputType | null
    _sum: MovimientoSumAggregateOutputType | null
    _min: MovimientoMinAggregateOutputType | null
    _max: MovimientoMaxAggregateOutputType | null
  }

  export type MovimientoAvgAggregateOutputType = {
    id: number | null
    cantidad: number | null
    stockAnterior: number | null
    stockNuevo: number | null
    productoId: number | null
    userId: number | null
  }

  export type MovimientoSumAggregateOutputType = {
    id: number | null
    cantidad: number | null
    stockAnterior: number | null
    stockNuevo: number | null
    productoId: number | null
    userId: number | null
  }

  export type MovimientoMinAggregateOutputType = {
    id: number | null
    tipo: string | null
    cantidad: number | null
    stockAnterior: number | null
    stockNuevo: number | null
    motivo: string | null
    documento: string | null
    createdAt: Date | null
    productoId: number | null
    userId: number | null
  }

  export type MovimientoMaxAggregateOutputType = {
    id: number | null
    tipo: string | null
    cantidad: number | null
    stockAnterior: number | null
    stockNuevo: number | null
    motivo: string | null
    documento: string | null
    createdAt: Date | null
    productoId: number | null
    userId: number | null
  }

  export type MovimientoCountAggregateOutputType = {
    id: number
    tipo: number
    cantidad: number
    stockAnterior: number
    stockNuevo: number
    motivo: number
    documento: number
    createdAt: number
    productoId: number
    userId: number
    _all: number
  }


  export type MovimientoAvgAggregateInputType = {
    id?: true
    cantidad?: true
    stockAnterior?: true
    stockNuevo?: true
    productoId?: true
    userId?: true
  }

  export type MovimientoSumAggregateInputType = {
    id?: true
    cantidad?: true
    stockAnterior?: true
    stockNuevo?: true
    productoId?: true
    userId?: true
  }

  export type MovimientoMinAggregateInputType = {
    id?: true
    tipo?: true
    cantidad?: true
    stockAnterior?: true
    stockNuevo?: true
    motivo?: true
    documento?: true
    createdAt?: true
    productoId?: true
    userId?: true
  }

  export type MovimientoMaxAggregateInputType = {
    id?: true
    tipo?: true
    cantidad?: true
    stockAnterior?: true
    stockNuevo?: true
    motivo?: true
    documento?: true
    createdAt?: true
    productoId?: true
    userId?: true
  }

  export type MovimientoCountAggregateInputType = {
    id?: true
    tipo?: true
    cantidad?: true
    stockAnterior?: true
    stockNuevo?: true
    motivo?: true
    documento?: true
    createdAt?: true
    productoId?: true
    userId?: true
    _all?: true
  }

  export type MovimientoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Movimiento to aggregate.
     */
    where?: MovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimientos to fetch.
     */
    orderBy?: MovimientoOrderByWithRelationInput | MovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Movimientos
    **/
    _count?: true | MovimientoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MovimientoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MovimientoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MovimientoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MovimientoMaxAggregateInputType
  }

  export type GetMovimientoAggregateType<T extends MovimientoAggregateArgs> = {
        [P in keyof T & keyof AggregateMovimiento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMovimiento[P]>
      : GetScalarType<T[P], AggregateMovimiento[P]>
  }




  export type MovimientoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovimientoWhereInput
    orderBy?: MovimientoOrderByWithAggregationInput | MovimientoOrderByWithAggregationInput[]
    by: MovimientoScalarFieldEnum[] | MovimientoScalarFieldEnum
    having?: MovimientoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MovimientoCountAggregateInputType | true
    _avg?: MovimientoAvgAggregateInputType
    _sum?: MovimientoSumAggregateInputType
    _min?: MovimientoMinAggregateInputType
    _max?: MovimientoMaxAggregateInputType
  }

  export type MovimientoGroupByOutputType = {
    id: number
    tipo: string
    cantidad: number
    stockAnterior: number
    stockNuevo: number
    motivo: string | null
    documento: string | null
    createdAt: Date
    productoId: number
    userId: number | null
    _count: MovimientoCountAggregateOutputType | null
    _avg: MovimientoAvgAggregateOutputType | null
    _sum: MovimientoSumAggregateOutputType | null
    _min: MovimientoMinAggregateOutputType | null
    _max: MovimientoMaxAggregateOutputType | null
  }

  type GetMovimientoGroupByPayload<T extends MovimientoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MovimientoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MovimientoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MovimientoGroupByOutputType[P]>
            : GetScalarType<T[P], MovimientoGroupByOutputType[P]>
        }
      >
    >


  export type MovimientoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    cantidad?: boolean
    stockAnterior?: boolean
    stockNuevo?: boolean
    motivo?: boolean
    documento?: boolean
    createdAt?: boolean
    productoId?: boolean
    userId?: boolean
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimiento"]>

  export type MovimientoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    cantidad?: boolean
    stockAnterior?: boolean
    stockNuevo?: boolean
    motivo?: boolean
    documento?: boolean
    createdAt?: boolean
    productoId?: boolean
    userId?: boolean
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimiento"]>

  export type MovimientoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    cantidad?: boolean
    stockAnterior?: boolean
    stockNuevo?: boolean
    motivo?: boolean
    documento?: boolean
    createdAt?: boolean
    productoId?: boolean
    userId?: boolean
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimiento"]>

  export type MovimientoSelectScalar = {
    id?: boolean
    tipo?: boolean
    cantidad?: boolean
    stockAnterior?: boolean
    stockNuevo?: boolean
    motivo?: boolean
    documento?: boolean
    createdAt?: boolean
    productoId?: boolean
    userId?: boolean
  }

  export type MovimientoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tipo" | "cantidad" | "stockAnterior" | "stockNuevo" | "motivo" | "documento" | "createdAt" | "productoId" | "userId", ExtArgs["result"]["movimiento"]>
  export type MovimientoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }
  export type MovimientoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }
  export type MovimientoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }

  export type $MovimientoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Movimiento"
    objects: {
      Producto: Prisma.$ProductoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      tipo: string
      cantidad: number
      stockAnterior: number
      stockNuevo: number
      motivo: string | null
      documento: string | null
      createdAt: Date
      productoId: number
      userId: number | null
    }, ExtArgs["result"]["movimiento"]>
    composites: {}
  }

  type MovimientoGetPayload<S extends boolean | null | undefined | MovimientoDefaultArgs> = $Result.GetResult<Prisma.$MovimientoPayload, S>

  type MovimientoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MovimientoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MovimientoCountAggregateInputType | true
    }

  export interface MovimientoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Movimiento'], meta: { name: 'Movimiento' } }
    /**
     * Find zero or one Movimiento that matches the filter.
     * @param {MovimientoFindUniqueArgs} args - Arguments to find a Movimiento
     * @example
     * // Get one Movimiento
     * const movimiento = await prisma.movimiento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MovimientoFindUniqueArgs>(args: SelectSubset<T, MovimientoFindUniqueArgs<ExtArgs>>): Prisma__MovimientoClient<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Movimiento that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MovimientoFindUniqueOrThrowArgs} args - Arguments to find a Movimiento
     * @example
     * // Get one Movimiento
     * const movimiento = await prisma.movimiento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MovimientoFindUniqueOrThrowArgs>(args: SelectSubset<T, MovimientoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MovimientoClient<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Movimiento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoFindFirstArgs} args - Arguments to find a Movimiento
     * @example
     * // Get one Movimiento
     * const movimiento = await prisma.movimiento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MovimientoFindFirstArgs>(args?: SelectSubset<T, MovimientoFindFirstArgs<ExtArgs>>): Prisma__MovimientoClient<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Movimiento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoFindFirstOrThrowArgs} args - Arguments to find a Movimiento
     * @example
     * // Get one Movimiento
     * const movimiento = await prisma.movimiento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MovimientoFindFirstOrThrowArgs>(args?: SelectSubset<T, MovimientoFindFirstOrThrowArgs<ExtArgs>>): Prisma__MovimientoClient<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Movimientos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Movimientos
     * const movimientos = await prisma.movimiento.findMany()
     * 
     * // Get first 10 Movimientos
     * const movimientos = await prisma.movimiento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const movimientoWithIdOnly = await prisma.movimiento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MovimientoFindManyArgs>(args?: SelectSubset<T, MovimientoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Movimiento.
     * @param {MovimientoCreateArgs} args - Arguments to create a Movimiento.
     * @example
     * // Create one Movimiento
     * const Movimiento = await prisma.movimiento.create({
     *   data: {
     *     // ... data to create a Movimiento
     *   }
     * })
     * 
     */
    create<T extends MovimientoCreateArgs>(args: SelectSubset<T, MovimientoCreateArgs<ExtArgs>>): Prisma__MovimientoClient<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Movimientos.
     * @param {MovimientoCreateManyArgs} args - Arguments to create many Movimientos.
     * @example
     * // Create many Movimientos
     * const movimiento = await prisma.movimiento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MovimientoCreateManyArgs>(args?: SelectSubset<T, MovimientoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Movimientos and returns the data saved in the database.
     * @param {MovimientoCreateManyAndReturnArgs} args - Arguments to create many Movimientos.
     * @example
     * // Create many Movimientos
     * const movimiento = await prisma.movimiento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Movimientos and only return the `id`
     * const movimientoWithIdOnly = await prisma.movimiento.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MovimientoCreateManyAndReturnArgs>(args?: SelectSubset<T, MovimientoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Movimiento.
     * @param {MovimientoDeleteArgs} args - Arguments to delete one Movimiento.
     * @example
     * // Delete one Movimiento
     * const Movimiento = await prisma.movimiento.delete({
     *   where: {
     *     // ... filter to delete one Movimiento
     *   }
     * })
     * 
     */
    delete<T extends MovimientoDeleteArgs>(args: SelectSubset<T, MovimientoDeleteArgs<ExtArgs>>): Prisma__MovimientoClient<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Movimiento.
     * @param {MovimientoUpdateArgs} args - Arguments to update one Movimiento.
     * @example
     * // Update one Movimiento
     * const movimiento = await prisma.movimiento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MovimientoUpdateArgs>(args: SelectSubset<T, MovimientoUpdateArgs<ExtArgs>>): Prisma__MovimientoClient<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Movimientos.
     * @param {MovimientoDeleteManyArgs} args - Arguments to filter Movimientos to delete.
     * @example
     * // Delete a few Movimientos
     * const { count } = await prisma.movimiento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MovimientoDeleteManyArgs>(args?: SelectSubset<T, MovimientoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Movimientos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Movimientos
     * const movimiento = await prisma.movimiento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MovimientoUpdateManyArgs>(args: SelectSubset<T, MovimientoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Movimientos and returns the data updated in the database.
     * @param {MovimientoUpdateManyAndReturnArgs} args - Arguments to update many Movimientos.
     * @example
     * // Update many Movimientos
     * const movimiento = await prisma.movimiento.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Movimientos and only return the `id`
     * const movimientoWithIdOnly = await prisma.movimiento.updateManyAndReturn({
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
    updateManyAndReturn<T extends MovimientoUpdateManyAndReturnArgs>(args: SelectSubset<T, MovimientoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Movimiento.
     * @param {MovimientoUpsertArgs} args - Arguments to update or create a Movimiento.
     * @example
     * // Update or create a Movimiento
     * const movimiento = await prisma.movimiento.upsert({
     *   create: {
     *     // ... data to create a Movimiento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Movimiento we want to update
     *   }
     * })
     */
    upsert<T extends MovimientoUpsertArgs>(args: SelectSubset<T, MovimientoUpsertArgs<ExtArgs>>): Prisma__MovimientoClient<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Movimientos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoCountArgs} args - Arguments to filter Movimientos to count.
     * @example
     * // Count the number of Movimientos
     * const count = await prisma.movimiento.count({
     *   where: {
     *     // ... the filter for the Movimientos we want to count
     *   }
     * })
    **/
    count<T extends MovimientoCountArgs>(
      args?: Subset<T, MovimientoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MovimientoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Movimiento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MovimientoAggregateArgs>(args: Subset<T, MovimientoAggregateArgs>): Prisma.PrismaPromise<GetMovimientoAggregateType<T>>

    /**
     * Group by Movimiento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoGroupByArgs} args - Group by arguments.
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
      T extends MovimientoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MovimientoGroupByArgs['orderBy'] }
        : { orderBy?: MovimientoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MovimientoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMovimientoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Movimiento model
   */
  readonly fields: MovimientoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Movimiento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MovimientoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Producto<T extends ProductoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductoDefaultArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Movimiento model
   */
  interface MovimientoFieldRefs {
    readonly id: FieldRef<"Movimiento", 'Int'>
    readonly tipo: FieldRef<"Movimiento", 'String'>
    readonly cantidad: FieldRef<"Movimiento", 'Int'>
    readonly stockAnterior: FieldRef<"Movimiento", 'Int'>
    readonly stockNuevo: FieldRef<"Movimiento", 'Int'>
    readonly motivo: FieldRef<"Movimiento", 'String'>
    readonly documento: FieldRef<"Movimiento", 'String'>
    readonly createdAt: FieldRef<"Movimiento", 'DateTime'>
    readonly productoId: FieldRef<"Movimiento", 'Int'>
    readonly userId: FieldRef<"Movimiento", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Movimiento findUnique
   */
  export type MovimientoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
    /**
     * Filter, which Movimiento to fetch.
     */
    where: MovimientoWhereUniqueInput
  }

  /**
   * Movimiento findUniqueOrThrow
   */
  export type MovimientoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
    /**
     * Filter, which Movimiento to fetch.
     */
    where: MovimientoWhereUniqueInput
  }

  /**
   * Movimiento findFirst
   */
  export type MovimientoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
    /**
     * Filter, which Movimiento to fetch.
     */
    where?: MovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimientos to fetch.
     */
    orderBy?: MovimientoOrderByWithRelationInput | MovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Movimientos.
     */
    cursor?: MovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Movimientos.
     */
    distinct?: MovimientoScalarFieldEnum | MovimientoScalarFieldEnum[]
  }

  /**
   * Movimiento findFirstOrThrow
   */
  export type MovimientoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
    /**
     * Filter, which Movimiento to fetch.
     */
    where?: MovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimientos to fetch.
     */
    orderBy?: MovimientoOrderByWithRelationInput | MovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Movimientos.
     */
    cursor?: MovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Movimientos.
     */
    distinct?: MovimientoScalarFieldEnum | MovimientoScalarFieldEnum[]
  }

  /**
   * Movimiento findMany
   */
  export type MovimientoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
    /**
     * Filter, which Movimientos to fetch.
     */
    where?: MovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimientos to fetch.
     */
    orderBy?: MovimientoOrderByWithRelationInput | MovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Movimientos.
     */
    cursor?: MovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Movimientos.
     */
    distinct?: MovimientoScalarFieldEnum | MovimientoScalarFieldEnum[]
  }

  /**
   * Movimiento create
   */
  export type MovimientoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
    /**
     * The data needed to create a Movimiento.
     */
    data: XOR<MovimientoCreateInput, MovimientoUncheckedCreateInput>
  }

  /**
   * Movimiento createMany
   */
  export type MovimientoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Movimientos.
     */
    data: MovimientoCreateManyInput | MovimientoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Movimiento createManyAndReturn
   */
  export type MovimientoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * The data used to create many Movimientos.
     */
    data: MovimientoCreateManyInput | MovimientoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Movimiento update
   */
  export type MovimientoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
    /**
     * The data needed to update a Movimiento.
     */
    data: XOR<MovimientoUpdateInput, MovimientoUncheckedUpdateInput>
    /**
     * Choose, which Movimiento to update.
     */
    where: MovimientoWhereUniqueInput
  }

  /**
   * Movimiento updateMany
   */
  export type MovimientoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Movimientos.
     */
    data: XOR<MovimientoUpdateManyMutationInput, MovimientoUncheckedUpdateManyInput>
    /**
     * Filter which Movimientos to update
     */
    where?: MovimientoWhereInput
    /**
     * Limit how many Movimientos to update.
     */
    limit?: number
  }

  /**
   * Movimiento updateManyAndReturn
   */
  export type MovimientoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * The data used to update Movimientos.
     */
    data: XOR<MovimientoUpdateManyMutationInput, MovimientoUncheckedUpdateManyInput>
    /**
     * Filter which Movimientos to update
     */
    where?: MovimientoWhereInput
    /**
     * Limit how many Movimientos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Movimiento upsert
   */
  export type MovimientoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
    /**
     * The filter to search for the Movimiento to update in case it exists.
     */
    where: MovimientoWhereUniqueInput
    /**
     * In case the Movimiento found by the `where` argument doesn't exist, create a new Movimiento with this data.
     */
    create: XOR<MovimientoCreateInput, MovimientoUncheckedCreateInput>
    /**
     * In case the Movimiento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MovimientoUpdateInput, MovimientoUncheckedUpdateInput>
  }

  /**
   * Movimiento delete
   */
  export type MovimientoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
    /**
     * Filter which Movimiento to delete.
     */
    where: MovimientoWhereUniqueInput
  }

  /**
   * Movimiento deleteMany
   */
  export type MovimientoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Movimientos to delete
     */
    where?: MovimientoWhereInput
    /**
     * Limit how many Movimientos to delete.
     */
    limit?: number
  }

  /**
   * Movimiento without action
   */
  export type MovimientoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
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
  }

  export type ProductoSumAggregateOutputType = {
    id: number | null
    stock: number | null
    precio: number | null
    minStock: number | null
    categoriaId: number | null
    stockReservado: number | null
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
    _all: number
  }


  export type ProductoAvgAggregateInputType = {
    id?: true
    stock?: true
    precio?: true
    minStock?: true
    categoriaId?: true
    stockReservado?: true
  }

  export type ProductoSumAggregateInputType = {
    id?: true
    stock?: true
    precio?: true
    minStock?: true
    categoriaId?: true
    stockReservado?: true
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
    Movimiento?: boolean | Producto$MovimientoArgs<ExtArgs>
    Categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
    Venta?: boolean | Producto$VentaArgs<ExtArgs>
    VentaDetalle?: boolean | Producto$VentaDetalleArgs<ExtArgs>
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
  }

  export type ProductoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "descripcion" | "stock" | "ubicacion" | "createdAt" | "precio" | "minStock" | "activo" | "criticidad" | "imagen" | "categoriaId" | "stockReservado", ExtArgs["result"]["producto"]>
  export type ProductoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Movimiento?: boolean | Producto$MovimientoArgs<ExtArgs>
    Categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
    Venta?: boolean | Producto$VentaArgs<ExtArgs>
    VentaDetalle?: boolean | Producto$VentaDetalleArgs<ExtArgs>
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
      Movimiento: Prisma.$MovimientoPayload<ExtArgs>[]
      Categoria: Prisma.$CategoriaPayload<ExtArgs>
      Venta: Prisma.$VentaPayload<ExtArgs>[]
      VentaDetalle: Prisma.$VentaDetallePayload<ExtArgs>[]
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
    Movimiento<T extends Producto$MovimientoArgs<ExtArgs> = {}>(args?: Subset<T, Producto$MovimientoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimientoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Categoria<T extends CategoriaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoriaDefaultArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Venta<T extends Producto$VentaArgs<ExtArgs> = {}>(args?: Subset<T, Producto$VentaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    VentaDetalle<T extends Producto$VentaDetalleArgs<ExtArgs> = {}>(args?: Subset<T, Producto$VentaDetalleArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Producto.Movimiento
   */
  export type Producto$MovimientoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimiento
     */
    select?: MovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimiento
     */
    omit?: MovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoInclude<ExtArgs> | null
    where?: MovimientoWhereInput
    orderBy?: MovimientoOrderByWithRelationInput | MovimientoOrderByWithRelationInput[]
    cursor?: MovimientoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MovimientoScalarFieldEnum | MovimientoScalarFieldEnum[]
  }

  /**
   * Producto.Venta
   */
  export type Producto$VentaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
    where?: VentaWhereInput
    orderBy?: VentaOrderByWithRelationInput | VentaOrderByWithRelationInput[]
    cursor?: VentaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VentaScalarFieldEnum | VentaScalarFieldEnum[]
  }

  /**
   * Producto.VentaDetalle
   */
  export type Producto$VentaDetalleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    where?: VentaDetalleWhereInput
    orderBy?: VentaDetalleOrderByWithRelationInput | VentaDetalleOrderByWithRelationInput[]
    cursor?: VentaDetalleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VentaDetalleScalarFieldEnum | VentaDetalleScalarFieldEnum[]
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
   * Model Venta
   */

  export type AggregateVenta = {
    _count: VentaCountAggregateOutputType | null
    _avg: VentaAvgAggregateOutputType | null
    _sum: VentaSumAggregateOutputType | null
    _min: VentaMinAggregateOutputType | null
    _max: VentaMaxAggregateOutputType | null
  }

  export type VentaAvgAggregateOutputType = {
    id: number | null
    productoId: number | null
    cantidad: number | null
    precio: number | null
    total: number | null
  }

  export type VentaSumAggregateOutputType = {
    id: number | null
    productoId: number | null
    cantidad: number | null
    precio: number | null
    total: number | null
  }

  export type VentaMinAggregateOutputType = {
    id: number | null
    productoId: number | null
    cliente: string | null
    contacto: string | null
    cantidad: number | null
    precio: number | null
    total: number | null
    estado: string | null
    responsable: string | null
    fechaCierre: Date | null
    createdAt: Date | null
  }

  export type VentaMaxAggregateOutputType = {
    id: number | null
    productoId: number | null
    cliente: string | null
    contacto: string | null
    cantidad: number | null
    precio: number | null
    total: number | null
    estado: string | null
    responsable: string | null
    fechaCierre: Date | null
    createdAt: Date | null
  }

  export type VentaCountAggregateOutputType = {
    id: number
    productoId: number
    cliente: number
    contacto: number
    cantidad: number
    precio: number
    total: number
    estado: number
    responsable: number
    fechaCierre: number
    createdAt: number
    _all: number
  }


  export type VentaAvgAggregateInputType = {
    id?: true
    productoId?: true
    cantidad?: true
    precio?: true
    total?: true
  }

  export type VentaSumAggregateInputType = {
    id?: true
    productoId?: true
    cantidad?: true
    precio?: true
    total?: true
  }

  export type VentaMinAggregateInputType = {
    id?: true
    productoId?: true
    cliente?: true
    contacto?: true
    cantidad?: true
    precio?: true
    total?: true
    estado?: true
    responsable?: true
    fechaCierre?: true
    createdAt?: true
  }

  export type VentaMaxAggregateInputType = {
    id?: true
    productoId?: true
    cliente?: true
    contacto?: true
    cantidad?: true
    precio?: true
    total?: true
    estado?: true
    responsable?: true
    fechaCierre?: true
    createdAt?: true
  }

  export type VentaCountAggregateInputType = {
    id?: true
    productoId?: true
    cliente?: true
    contacto?: true
    cantidad?: true
    precio?: true
    total?: true
    estado?: true
    responsable?: true
    fechaCierre?: true
    createdAt?: true
    _all?: true
  }

  export type VentaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Venta to aggregate.
     */
    where?: VentaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ventas to fetch.
     */
    orderBy?: VentaOrderByWithRelationInput | VentaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VentaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ventas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ventas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ventas
    **/
    _count?: true | VentaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VentaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VentaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VentaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VentaMaxAggregateInputType
  }

  export type GetVentaAggregateType<T extends VentaAggregateArgs> = {
        [P in keyof T & keyof AggregateVenta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVenta[P]>
      : GetScalarType<T[P], AggregateVenta[P]>
  }




  export type VentaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VentaWhereInput
    orderBy?: VentaOrderByWithAggregationInput | VentaOrderByWithAggregationInput[]
    by: VentaScalarFieldEnum[] | VentaScalarFieldEnum
    having?: VentaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VentaCountAggregateInputType | true
    _avg?: VentaAvgAggregateInputType
    _sum?: VentaSumAggregateInputType
    _min?: VentaMinAggregateInputType
    _max?: VentaMaxAggregateInputType
  }

  export type VentaGroupByOutputType = {
    id: number
    productoId: number
    cliente: string
    contacto: string | null
    cantidad: number
    precio: number
    total: number
    estado: string
    responsable: string | null
    fechaCierre: Date | null
    createdAt: Date
    _count: VentaCountAggregateOutputType | null
    _avg: VentaAvgAggregateOutputType | null
    _sum: VentaSumAggregateOutputType | null
    _min: VentaMinAggregateOutputType | null
    _max: VentaMaxAggregateOutputType | null
  }

  type GetVentaGroupByPayload<T extends VentaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VentaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VentaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VentaGroupByOutputType[P]>
            : GetScalarType<T[P], VentaGroupByOutputType[P]>
        }
      >
    >


  export type VentaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productoId?: boolean
    cliente?: boolean
    contacto?: boolean
    cantidad?: boolean
    precio?: boolean
    total?: boolean
    estado?: boolean
    responsable?: boolean
    fechaCierre?: boolean
    createdAt?: boolean
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
    VentaDetalle?: boolean | Venta$VentaDetalleArgs<ExtArgs>
    _count?: boolean | VentaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["venta"]>

  export type VentaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productoId?: boolean
    cliente?: boolean
    contacto?: boolean
    cantidad?: boolean
    precio?: boolean
    total?: boolean
    estado?: boolean
    responsable?: boolean
    fechaCierre?: boolean
    createdAt?: boolean
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["venta"]>

  export type VentaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productoId?: boolean
    cliente?: boolean
    contacto?: boolean
    cantidad?: boolean
    precio?: boolean
    total?: boolean
    estado?: boolean
    responsable?: boolean
    fechaCierre?: boolean
    createdAt?: boolean
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["venta"]>

  export type VentaSelectScalar = {
    id?: boolean
    productoId?: boolean
    cliente?: boolean
    contacto?: boolean
    cantidad?: boolean
    precio?: boolean
    total?: boolean
    estado?: boolean
    responsable?: boolean
    fechaCierre?: boolean
    createdAt?: boolean
  }

  export type VentaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productoId" | "cliente" | "contacto" | "cantidad" | "precio" | "total" | "estado" | "responsable" | "fechaCierre" | "createdAt", ExtArgs["result"]["venta"]>
  export type VentaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
    VentaDetalle?: boolean | Venta$VentaDetalleArgs<ExtArgs>
    _count?: boolean | VentaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VentaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }
  export type VentaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }

  export type $VentaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Venta"
    objects: {
      Producto: Prisma.$ProductoPayload<ExtArgs>
      VentaDetalle: Prisma.$VentaDetallePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      productoId: number
      cliente: string
      contacto: string | null
      cantidad: number
      precio: number
      total: number
      estado: string
      responsable: string | null
      fechaCierre: Date | null
      createdAt: Date
    }, ExtArgs["result"]["venta"]>
    composites: {}
  }

  type VentaGetPayload<S extends boolean | null | undefined | VentaDefaultArgs> = $Result.GetResult<Prisma.$VentaPayload, S>

  type VentaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VentaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VentaCountAggregateInputType | true
    }

  export interface VentaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Venta'], meta: { name: 'Venta' } }
    /**
     * Find zero or one Venta that matches the filter.
     * @param {VentaFindUniqueArgs} args - Arguments to find a Venta
     * @example
     * // Get one Venta
     * const venta = await prisma.venta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VentaFindUniqueArgs>(args: SelectSubset<T, VentaFindUniqueArgs<ExtArgs>>): Prisma__VentaClient<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Venta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VentaFindUniqueOrThrowArgs} args - Arguments to find a Venta
     * @example
     * // Get one Venta
     * const venta = await prisma.venta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VentaFindUniqueOrThrowArgs>(args: SelectSubset<T, VentaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VentaClient<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Venta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaFindFirstArgs} args - Arguments to find a Venta
     * @example
     * // Get one Venta
     * const venta = await prisma.venta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VentaFindFirstArgs>(args?: SelectSubset<T, VentaFindFirstArgs<ExtArgs>>): Prisma__VentaClient<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Venta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaFindFirstOrThrowArgs} args - Arguments to find a Venta
     * @example
     * // Get one Venta
     * const venta = await prisma.venta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VentaFindFirstOrThrowArgs>(args?: SelectSubset<T, VentaFindFirstOrThrowArgs<ExtArgs>>): Prisma__VentaClient<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ventas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ventas
     * const ventas = await prisma.venta.findMany()
     * 
     * // Get first 10 Ventas
     * const ventas = await prisma.venta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ventaWithIdOnly = await prisma.venta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VentaFindManyArgs>(args?: SelectSubset<T, VentaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Venta.
     * @param {VentaCreateArgs} args - Arguments to create a Venta.
     * @example
     * // Create one Venta
     * const Venta = await prisma.venta.create({
     *   data: {
     *     // ... data to create a Venta
     *   }
     * })
     * 
     */
    create<T extends VentaCreateArgs>(args: SelectSubset<T, VentaCreateArgs<ExtArgs>>): Prisma__VentaClient<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ventas.
     * @param {VentaCreateManyArgs} args - Arguments to create many Ventas.
     * @example
     * // Create many Ventas
     * const venta = await prisma.venta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VentaCreateManyArgs>(args?: SelectSubset<T, VentaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ventas and returns the data saved in the database.
     * @param {VentaCreateManyAndReturnArgs} args - Arguments to create many Ventas.
     * @example
     * // Create many Ventas
     * const venta = await prisma.venta.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ventas and only return the `id`
     * const ventaWithIdOnly = await prisma.venta.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VentaCreateManyAndReturnArgs>(args?: SelectSubset<T, VentaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Venta.
     * @param {VentaDeleteArgs} args - Arguments to delete one Venta.
     * @example
     * // Delete one Venta
     * const Venta = await prisma.venta.delete({
     *   where: {
     *     // ... filter to delete one Venta
     *   }
     * })
     * 
     */
    delete<T extends VentaDeleteArgs>(args: SelectSubset<T, VentaDeleteArgs<ExtArgs>>): Prisma__VentaClient<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Venta.
     * @param {VentaUpdateArgs} args - Arguments to update one Venta.
     * @example
     * // Update one Venta
     * const venta = await prisma.venta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VentaUpdateArgs>(args: SelectSubset<T, VentaUpdateArgs<ExtArgs>>): Prisma__VentaClient<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ventas.
     * @param {VentaDeleteManyArgs} args - Arguments to filter Ventas to delete.
     * @example
     * // Delete a few Ventas
     * const { count } = await prisma.venta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VentaDeleteManyArgs>(args?: SelectSubset<T, VentaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ventas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ventas
     * const venta = await prisma.venta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VentaUpdateManyArgs>(args: SelectSubset<T, VentaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ventas and returns the data updated in the database.
     * @param {VentaUpdateManyAndReturnArgs} args - Arguments to update many Ventas.
     * @example
     * // Update many Ventas
     * const venta = await prisma.venta.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ventas and only return the `id`
     * const ventaWithIdOnly = await prisma.venta.updateManyAndReturn({
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
    updateManyAndReturn<T extends VentaUpdateManyAndReturnArgs>(args: SelectSubset<T, VentaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Venta.
     * @param {VentaUpsertArgs} args - Arguments to update or create a Venta.
     * @example
     * // Update or create a Venta
     * const venta = await prisma.venta.upsert({
     *   create: {
     *     // ... data to create a Venta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Venta we want to update
     *   }
     * })
     */
    upsert<T extends VentaUpsertArgs>(args: SelectSubset<T, VentaUpsertArgs<ExtArgs>>): Prisma__VentaClient<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ventas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaCountArgs} args - Arguments to filter Ventas to count.
     * @example
     * // Count the number of Ventas
     * const count = await prisma.venta.count({
     *   where: {
     *     // ... the filter for the Ventas we want to count
     *   }
     * })
    **/
    count<T extends VentaCountArgs>(
      args?: Subset<T, VentaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VentaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Venta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VentaAggregateArgs>(args: Subset<T, VentaAggregateArgs>): Prisma.PrismaPromise<GetVentaAggregateType<T>>

    /**
     * Group by Venta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaGroupByArgs} args - Group by arguments.
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
      T extends VentaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VentaGroupByArgs['orderBy'] }
        : { orderBy?: VentaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VentaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVentaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Venta model
   */
  readonly fields: VentaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Venta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VentaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Producto<T extends ProductoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductoDefaultArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    VentaDetalle<T extends Venta$VentaDetalleArgs<ExtArgs> = {}>(args?: Subset<T, Venta$VentaDetalleArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Venta model
   */
  interface VentaFieldRefs {
    readonly id: FieldRef<"Venta", 'Int'>
    readonly productoId: FieldRef<"Venta", 'Int'>
    readonly cliente: FieldRef<"Venta", 'String'>
    readonly contacto: FieldRef<"Venta", 'String'>
    readonly cantidad: FieldRef<"Venta", 'Int'>
    readonly precio: FieldRef<"Venta", 'Float'>
    readonly total: FieldRef<"Venta", 'Float'>
    readonly estado: FieldRef<"Venta", 'String'>
    readonly responsable: FieldRef<"Venta", 'String'>
    readonly fechaCierre: FieldRef<"Venta", 'DateTime'>
    readonly createdAt: FieldRef<"Venta", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Venta findUnique
   */
  export type VentaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
    /**
     * Filter, which Venta to fetch.
     */
    where: VentaWhereUniqueInput
  }

  /**
   * Venta findUniqueOrThrow
   */
  export type VentaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
    /**
     * Filter, which Venta to fetch.
     */
    where: VentaWhereUniqueInput
  }

  /**
   * Venta findFirst
   */
  export type VentaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
    /**
     * Filter, which Venta to fetch.
     */
    where?: VentaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ventas to fetch.
     */
    orderBy?: VentaOrderByWithRelationInput | VentaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ventas.
     */
    cursor?: VentaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ventas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ventas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ventas.
     */
    distinct?: VentaScalarFieldEnum | VentaScalarFieldEnum[]
  }

  /**
   * Venta findFirstOrThrow
   */
  export type VentaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
    /**
     * Filter, which Venta to fetch.
     */
    where?: VentaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ventas to fetch.
     */
    orderBy?: VentaOrderByWithRelationInput | VentaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ventas.
     */
    cursor?: VentaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ventas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ventas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ventas.
     */
    distinct?: VentaScalarFieldEnum | VentaScalarFieldEnum[]
  }

  /**
   * Venta findMany
   */
  export type VentaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
    /**
     * Filter, which Ventas to fetch.
     */
    where?: VentaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ventas to fetch.
     */
    orderBy?: VentaOrderByWithRelationInput | VentaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ventas.
     */
    cursor?: VentaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ventas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ventas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ventas.
     */
    distinct?: VentaScalarFieldEnum | VentaScalarFieldEnum[]
  }

  /**
   * Venta create
   */
  export type VentaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
    /**
     * The data needed to create a Venta.
     */
    data: XOR<VentaCreateInput, VentaUncheckedCreateInput>
  }

  /**
   * Venta createMany
   */
  export type VentaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ventas.
     */
    data: VentaCreateManyInput | VentaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Venta createManyAndReturn
   */
  export type VentaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * The data used to create many Ventas.
     */
    data: VentaCreateManyInput | VentaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Venta update
   */
  export type VentaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
    /**
     * The data needed to update a Venta.
     */
    data: XOR<VentaUpdateInput, VentaUncheckedUpdateInput>
    /**
     * Choose, which Venta to update.
     */
    where: VentaWhereUniqueInput
  }

  /**
   * Venta updateMany
   */
  export type VentaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ventas.
     */
    data: XOR<VentaUpdateManyMutationInput, VentaUncheckedUpdateManyInput>
    /**
     * Filter which Ventas to update
     */
    where?: VentaWhereInput
    /**
     * Limit how many Ventas to update.
     */
    limit?: number
  }

  /**
   * Venta updateManyAndReturn
   */
  export type VentaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * The data used to update Ventas.
     */
    data: XOR<VentaUpdateManyMutationInput, VentaUncheckedUpdateManyInput>
    /**
     * Filter which Ventas to update
     */
    where?: VentaWhereInput
    /**
     * Limit how many Ventas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Venta upsert
   */
  export type VentaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
    /**
     * The filter to search for the Venta to update in case it exists.
     */
    where: VentaWhereUniqueInput
    /**
     * In case the Venta found by the `where` argument doesn't exist, create a new Venta with this data.
     */
    create: XOR<VentaCreateInput, VentaUncheckedCreateInput>
    /**
     * In case the Venta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VentaUpdateInput, VentaUncheckedUpdateInput>
  }

  /**
   * Venta delete
   */
  export type VentaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
    /**
     * Filter which Venta to delete.
     */
    where: VentaWhereUniqueInput
  }

  /**
   * Venta deleteMany
   */
  export type VentaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ventas to delete
     */
    where?: VentaWhereInput
    /**
     * Limit how many Ventas to delete.
     */
    limit?: number
  }

  /**
   * Venta.VentaDetalle
   */
  export type Venta$VentaDetalleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    where?: VentaDetalleWhereInput
    orderBy?: VentaDetalleOrderByWithRelationInput | VentaDetalleOrderByWithRelationInput[]
    cursor?: VentaDetalleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VentaDetalleScalarFieldEnum | VentaDetalleScalarFieldEnum[]
  }

  /**
   * Venta without action
   */
  export type VentaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Venta
     */
    select?: VentaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Venta
     */
    omit?: VentaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaInclude<ExtArgs> | null
  }


  /**
   * Model VentaDetalle
   */

  export type AggregateVentaDetalle = {
    _count: VentaDetalleCountAggregateOutputType | null
    _avg: VentaDetalleAvgAggregateOutputType | null
    _sum: VentaDetalleSumAggregateOutputType | null
    _min: VentaDetalleMinAggregateOutputType | null
    _max: VentaDetalleMaxAggregateOutputType | null
  }

  export type VentaDetalleAvgAggregateOutputType = {
    id: number | null
    ventaId: number | null
    productoId: number | null
    cantidad: number | null
    precio: number | null
    subtotal: number | null
  }

  export type VentaDetalleSumAggregateOutputType = {
    id: number | null
    ventaId: number | null
    productoId: number | null
    cantidad: number | null
    precio: number | null
    subtotal: number | null
  }

  export type VentaDetalleMinAggregateOutputType = {
    id: number | null
    ventaId: number | null
    productoId: number | null
    cantidad: number | null
    precio: number | null
    subtotal: number | null
  }

  export type VentaDetalleMaxAggregateOutputType = {
    id: number | null
    ventaId: number | null
    productoId: number | null
    cantidad: number | null
    precio: number | null
    subtotal: number | null
  }

  export type VentaDetalleCountAggregateOutputType = {
    id: number
    ventaId: number
    productoId: number
    cantidad: number
    precio: number
    subtotal: number
    _all: number
  }


  export type VentaDetalleAvgAggregateInputType = {
    id?: true
    ventaId?: true
    productoId?: true
    cantidad?: true
    precio?: true
    subtotal?: true
  }

  export type VentaDetalleSumAggregateInputType = {
    id?: true
    ventaId?: true
    productoId?: true
    cantidad?: true
    precio?: true
    subtotal?: true
  }

  export type VentaDetalleMinAggregateInputType = {
    id?: true
    ventaId?: true
    productoId?: true
    cantidad?: true
    precio?: true
    subtotal?: true
  }

  export type VentaDetalleMaxAggregateInputType = {
    id?: true
    ventaId?: true
    productoId?: true
    cantidad?: true
    precio?: true
    subtotal?: true
  }

  export type VentaDetalleCountAggregateInputType = {
    id?: true
    ventaId?: true
    productoId?: true
    cantidad?: true
    precio?: true
    subtotal?: true
    _all?: true
  }

  export type VentaDetalleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VentaDetalle to aggregate.
     */
    where?: VentaDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VentaDetalles to fetch.
     */
    orderBy?: VentaDetalleOrderByWithRelationInput | VentaDetalleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VentaDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VentaDetalles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VentaDetalles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VentaDetalles
    **/
    _count?: true | VentaDetalleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VentaDetalleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VentaDetalleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VentaDetalleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VentaDetalleMaxAggregateInputType
  }

  export type GetVentaDetalleAggregateType<T extends VentaDetalleAggregateArgs> = {
        [P in keyof T & keyof AggregateVentaDetalle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVentaDetalle[P]>
      : GetScalarType<T[P], AggregateVentaDetalle[P]>
  }




  export type VentaDetalleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VentaDetalleWhereInput
    orderBy?: VentaDetalleOrderByWithAggregationInput | VentaDetalleOrderByWithAggregationInput[]
    by: VentaDetalleScalarFieldEnum[] | VentaDetalleScalarFieldEnum
    having?: VentaDetalleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VentaDetalleCountAggregateInputType | true
    _avg?: VentaDetalleAvgAggregateInputType
    _sum?: VentaDetalleSumAggregateInputType
    _min?: VentaDetalleMinAggregateInputType
    _max?: VentaDetalleMaxAggregateInputType
  }

  export type VentaDetalleGroupByOutputType = {
    id: number
    ventaId: number
    productoId: number
    cantidad: number
    precio: number
    subtotal: number
    _count: VentaDetalleCountAggregateOutputType | null
    _avg: VentaDetalleAvgAggregateOutputType | null
    _sum: VentaDetalleSumAggregateOutputType | null
    _min: VentaDetalleMinAggregateOutputType | null
    _max: VentaDetalleMaxAggregateOutputType | null
  }

  type GetVentaDetalleGroupByPayload<T extends VentaDetalleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VentaDetalleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VentaDetalleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VentaDetalleGroupByOutputType[P]>
            : GetScalarType<T[P], VentaDetalleGroupByOutputType[P]>
        }
      >
    >


  export type VentaDetalleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ventaId?: boolean
    productoId?: boolean
    cantidad?: boolean
    precio?: boolean
    subtotal?: boolean
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
    Venta?: boolean | VentaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ventaDetalle"]>

  export type VentaDetalleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ventaId?: boolean
    productoId?: boolean
    cantidad?: boolean
    precio?: boolean
    subtotal?: boolean
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
    Venta?: boolean | VentaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ventaDetalle"]>

  export type VentaDetalleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ventaId?: boolean
    productoId?: boolean
    cantidad?: boolean
    precio?: boolean
    subtotal?: boolean
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
    Venta?: boolean | VentaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ventaDetalle"]>

  export type VentaDetalleSelectScalar = {
    id?: boolean
    ventaId?: boolean
    productoId?: boolean
    cantidad?: boolean
    precio?: boolean
    subtotal?: boolean
  }

  export type VentaDetalleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ventaId" | "productoId" | "cantidad" | "precio" | "subtotal", ExtArgs["result"]["ventaDetalle"]>
  export type VentaDetalleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
    Venta?: boolean | VentaDefaultArgs<ExtArgs>
  }
  export type VentaDetalleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
    Venta?: boolean | VentaDefaultArgs<ExtArgs>
  }
  export type VentaDetalleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Producto?: boolean | ProductoDefaultArgs<ExtArgs>
    Venta?: boolean | VentaDefaultArgs<ExtArgs>
  }

  export type $VentaDetallePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VentaDetalle"
    objects: {
      Producto: Prisma.$ProductoPayload<ExtArgs>
      Venta: Prisma.$VentaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      ventaId: number
      productoId: number
      cantidad: number
      precio: number
      subtotal: number
    }, ExtArgs["result"]["ventaDetalle"]>
    composites: {}
  }

  type VentaDetalleGetPayload<S extends boolean | null | undefined | VentaDetalleDefaultArgs> = $Result.GetResult<Prisma.$VentaDetallePayload, S>

  type VentaDetalleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VentaDetalleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VentaDetalleCountAggregateInputType | true
    }

  export interface VentaDetalleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VentaDetalle'], meta: { name: 'VentaDetalle' } }
    /**
     * Find zero or one VentaDetalle that matches the filter.
     * @param {VentaDetalleFindUniqueArgs} args - Arguments to find a VentaDetalle
     * @example
     * // Get one VentaDetalle
     * const ventaDetalle = await prisma.ventaDetalle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VentaDetalleFindUniqueArgs>(args: SelectSubset<T, VentaDetalleFindUniqueArgs<ExtArgs>>): Prisma__VentaDetalleClient<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VentaDetalle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VentaDetalleFindUniqueOrThrowArgs} args - Arguments to find a VentaDetalle
     * @example
     * // Get one VentaDetalle
     * const ventaDetalle = await prisma.ventaDetalle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VentaDetalleFindUniqueOrThrowArgs>(args: SelectSubset<T, VentaDetalleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VentaDetalleClient<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VentaDetalle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleFindFirstArgs} args - Arguments to find a VentaDetalle
     * @example
     * // Get one VentaDetalle
     * const ventaDetalle = await prisma.ventaDetalle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VentaDetalleFindFirstArgs>(args?: SelectSubset<T, VentaDetalleFindFirstArgs<ExtArgs>>): Prisma__VentaDetalleClient<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VentaDetalle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleFindFirstOrThrowArgs} args - Arguments to find a VentaDetalle
     * @example
     * // Get one VentaDetalle
     * const ventaDetalle = await prisma.ventaDetalle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VentaDetalleFindFirstOrThrowArgs>(args?: SelectSubset<T, VentaDetalleFindFirstOrThrowArgs<ExtArgs>>): Prisma__VentaDetalleClient<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VentaDetalles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VentaDetalles
     * const ventaDetalles = await prisma.ventaDetalle.findMany()
     * 
     * // Get first 10 VentaDetalles
     * const ventaDetalles = await prisma.ventaDetalle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ventaDetalleWithIdOnly = await prisma.ventaDetalle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VentaDetalleFindManyArgs>(args?: SelectSubset<T, VentaDetalleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VentaDetalle.
     * @param {VentaDetalleCreateArgs} args - Arguments to create a VentaDetalle.
     * @example
     * // Create one VentaDetalle
     * const VentaDetalle = await prisma.ventaDetalle.create({
     *   data: {
     *     // ... data to create a VentaDetalle
     *   }
     * })
     * 
     */
    create<T extends VentaDetalleCreateArgs>(args: SelectSubset<T, VentaDetalleCreateArgs<ExtArgs>>): Prisma__VentaDetalleClient<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VentaDetalles.
     * @param {VentaDetalleCreateManyArgs} args - Arguments to create many VentaDetalles.
     * @example
     * // Create many VentaDetalles
     * const ventaDetalle = await prisma.ventaDetalle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VentaDetalleCreateManyArgs>(args?: SelectSubset<T, VentaDetalleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VentaDetalles and returns the data saved in the database.
     * @param {VentaDetalleCreateManyAndReturnArgs} args - Arguments to create many VentaDetalles.
     * @example
     * // Create many VentaDetalles
     * const ventaDetalle = await prisma.ventaDetalle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VentaDetalles and only return the `id`
     * const ventaDetalleWithIdOnly = await prisma.ventaDetalle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VentaDetalleCreateManyAndReturnArgs>(args?: SelectSubset<T, VentaDetalleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VentaDetalle.
     * @param {VentaDetalleDeleteArgs} args - Arguments to delete one VentaDetalle.
     * @example
     * // Delete one VentaDetalle
     * const VentaDetalle = await prisma.ventaDetalle.delete({
     *   where: {
     *     // ... filter to delete one VentaDetalle
     *   }
     * })
     * 
     */
    delete<T extends VentaDetalleDeleteArgs>(args: SelectSubset<T, VentaDetalleDeleteArgs<ExtArgs>>): Prisma__VentaDetalleClient<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VentaDetalle.
     * @param {VentaDetalleUpdateArgs} args - Arguments to update one VentaDetalle.
     * @example
     * // Update one VentaDetalle
     * const ventaDetalle = await prisma.ventaDetalle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VentaDetalleUpdateArgs>(args: SelectSubset<T, VentaDetalleUpdateArgs<ExtArgs>>): Prisma__VentaDetalleClient<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VentaDetalles.
     * @param {VentaDetalleDeleteManyArgs} args - Arguments to filter VentaDetalles to delete.
     * @example
     * // Delete a few VentaDetalles
     * const { count } = await prisma.ventaDetalle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VentaDetalleDeleteManyArgs>(args?: SelectSubset<T, VentaDetalleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VentaDetalles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VentaDetalles
     * const ventaDetalle = await prisma.ventaDetalle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VentaDetalleUpdateManyArgs>(args: SelectSubset<T, VentaDetalleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VentaDetalles and returns the data updated in the database.
     * @param {VentaDetalleUpdateManyAndReturnArgs} args - Arguments to update many VentaDetalles.
     * @example
     * // Update many VentaDetalles
     * const ventaDetalle = await prisma.ventaDetalle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VentaDetalles and only return the `id`
     * const ventaDetalleWithIdOnly = await prisma.ventaDetalle.updateManyAndReturn({
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
    updateManyAndReturn<T extends VentaDetalleUpdateManyAndReturnArgs>(args: SelectSubset<T, VentaDetalleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VentaDetalle.
     * @param {VentaDetalleUpsertArgs} args - Arguments to update or create a VentaDetalle.
     * @example
     * // Update or create a VentaDetalle
     * const ventaDetalle = await prisma.ventaDetalle.upsert({
     *   create: {
     *     // ... data to create a VentaDetalle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VentaDetalle we want to update
     *   }
     * })
     */
    upsert<T extends VentaDetalleUpsertArgs>(args: SelectSubset<T, VentaDetalleUpsertArgs<ExtArgs>>): Prisma__VentaDetalleClient<$Result.GetResult<Prisma.$VentaDetallePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VentaDetalles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleCountArgs} args - Arguments to filter VentaDetalles to count.
     * @example
     * // Count the number of VentaDetalles
     * const count = await prisma.ventaDetalle.count({
     *   where: {
     *     // ... the filter for the VentaDetalles we want to count
     *   }
     * })
    **/
    count<T extends VentaDetalleCountArgs>(
      args?: Subset<T, VentaDetalleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VentaDetalleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VentaDetalle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VentaDetalleAggregateArgs>(args: Subset<T, VentaDetalleAggregateArgs>): Prisma.PrismaPromise<GetVentaDetalleAggregateType<T>>

    /**
     * Group by VentaDetalle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleGroupByArgs} args - Group by arguments.
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
      T extends VentaDetalleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VentaDetalleGroupByArgs['orderBy'] }
        : { orderBy?: VentaDetalleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VentaDetalleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVentaDetalleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VentaDetalle model
   */
  readonly fields: VentaDetalleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VentaDetalle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VentaDetalleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Producto<T extends ProductoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductoDefaultArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Venta<T extends VentaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VentaDefaultArgs<ExtArgs>>): Prisma__VentaClient<$Result.GetResult<Prisma.$VentaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the VentaDetalle model
   */
  interface VentaDetalleFieldRefs {
    readonly id: FieldRef<"VentaDetalle", 'Int'>
    readonly ventaId: FieldRef<"VentaDetalle", 'Int'>
    readonly productoId: FieldRef<"VentaDetalle", 'Int'>
    readonly cantidad: FieldRef<"VentaDetalle", 'Int'>
    readonly precio: FieldRef<"VentaDetalle", 'Float'>
    readonly subtotal: FieldRef<"VentaDetalle", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * VentaDetalle findUnique
   */
  export type VentaDetalleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    /**
     * Filter, which VentaDetalle to fetch.
     */
    where: VentaDetalleWhereUniqueInput
  }

  /**
   * VentaDetalle findUniqueOrThrow
   */
  export type VentaDetalleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    /**
     * Filter, which VentaDetalle to fetch.
     */
    where: VentaDetalleWhereUniqueInput
  }

  /**
   * VentaDetalle findFirst
   */
  export type VentaDetalleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    /**
     * Filter, which VentaDetalle to fetch.
     */
    where?: VentaDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VentaDetalles to fetch.
     */
    orderBy?: VentaDetalleOrderByWithRelationInput | VentaDetalleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VentaDetalles.
     */
    cursor?: VentaDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VentaDetalles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VentaDetalles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VentaDetalles.
     */
    distinct?: VentaDetalleScalarFieldEnum | VentaDetalleScalarFieldEnum[]
  }

  /**
   * VentaDetalle findFirstOrThrow
   */
  export type VentaDetalleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    /**
     * Filter, which VentaDetalle to fetch.
     */
    where?: VentaDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VentaDetalles to fetch.
     */
    orderBy?: VentaDetalleOrderByWithRelationInput | VentaDetalleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VentaDetalles.
     */
    cursor?: VentaDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VentaDetalles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VentaDetalles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VentaDetalles.
     */
    distinct?: VentaDetalleScalarFieldEnum | VentaDetalleScalarFieldEnum[]
  }

  /**
   * VentaDetalle findMany
   */
  export type VentaDetalleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    /**
     * Filter, which VentaDetalles to fetch.
     */
    where?: VentaDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VentaDetalles to fetch.
     */
    orderBy?: VentaDetalleOrderByWithRelationInput | VentaDetalleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VentaDetalles.
     */
    cursor?: VentaDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VentaDetalles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VentaDetalles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VentaDetalles.
     */
    distinct?: VentaDetalleScalarFieldEnum | VentaDetalleScalarFieldEnum[]
  }

  /**
   * VentaDetalle create
   */
  export type VentaDetalleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    /**
     * The data needed to create a VentaDetalle.
     */
    data: XOR<VentaDetalleCreateInput, VentaDetalleUncheckedCreateInput>
  }

  /**
   * VentaDetalle createMany
   */
  export type VentaDetalleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VentaDetalles.
     */
    data: VentaDetalleCreateManyInput | VentaDetalleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VentaDetalle createManyAndReturn
   */
  export type VentaDetalleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * The data used to create many VentaDetalles.
     */
    data: VentaDetalleCreateManyInput | VentaDetalleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VentaDetalle update
   */
  export type VentaDetalleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    /**
     * The data needed to update a VentaDetalle.
     */
    data: XOR<VentaDetalleUpdateInput, VentaDetalleUncheckedUpdateInput>
    /**
     * Choose, which VentaDetalle to update.
     */
    where: VentaDetalleWhereUniqueInput
  }

  /**
   * VentaDetalle updateMany
   */
  export type VentaDetalleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VentaDetalles.
     */
    data: XOR<VentaDetalleUpdateManyMutationInput, VentaDetalleUncheckedUpdateManyInput>
    /**
     * Filter which VentaDetalles to update
     */
    where?: VentaDetalleWhereInput
    /**
     * Limit how many VentaDetalles to update.
     */
    limit?: number
  }

  /**
   * VentaDetalle updateManyAndReturn
   */
  export type VentaDetalleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * The data used to update VentaDetalles.
     */
    data: XOR<VentaDetalleUpdateManyMutationInput, VentaDetalleUncheckedUpdateManyInput>
    /**
     * Filter which VentaDetalles to update
     */
    where?: VentaDetalleWhereInput
    /**
     * Limit how many VentaDetalles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VentaDetalle upsert
   */
  export type VentaDetalleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    /**
     * The filter to search for the VentaDetalle to update in case it exists.
     */
    where: VentaDetalleWhereUniqueInput
    /**
     * In case the VentaDetalle found by the `where` argument doesn't exist, create a new VentaDetalle with this data.
     */
    create: XOR<VentaDetalleCreateInput, VentaDetalleUncheckedCreateInput>
    /**
     * In case the VentaDetalle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VentaDetalleUpdateInput, VentaDetalleUncheckedUpdateInput>
  }

  /**
   * VentaDetalle delete
   */
  export type VentaDetalleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
    /**
     * Filter which VentaDetalle to delete.
     */
    where: VentaDetalleWhereUniqueInput
  }

  /**
   * VentaDetalle deleteMany
   */
  export type VentaDetalleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VentaDetalles to delete
     */
    where?: VentaDetalleWhereInput
    /**
     * Limit how many VentaDetalles to delete.
     */
    limit?: number
  }

  /**
   * VentaDetalle without action
   */
  export type VentaDetalleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     */
    select?: VentaDetalleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VentaDetalle
     */
    omit?: VentaDetalleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VentaDetalleInclude<ExtArgs> | null
  }


  /**
   * Model user
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    role: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user to aggregate.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type userGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
    orderBy?: userOrderByWithAggregationInput | userOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: userScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    role: string
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends userGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type userSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type userSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type userSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type userSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
  }

  export type userOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "role" | "createdAt", ExtArgs["result"]["user"]>

  export type $userPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      role: string
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type userGetPayload<S extends boolean | null | undefined | userDefaultArgs> = $Result.GetResult<Prisma.$userPayload, S>

  type userCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<userFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface userDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user'], meta: { name: 'user' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {userFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends userFindUniqueArgs>(args: SelectSubset<T, userFindUniqueArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {userFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends userFindUniqueOrThrowArgs>(args: SelectSubset<T, userFindUniqueOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends userFindFirstArgs>(args?: SelectSubset<T, userFindFirstArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends userFindFirstOrThrowArgs>(args?: SelectSubset<T, userFindFirstOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends userFindManyArgs>(args?: SelectSubset<T, userFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {userCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends userCreateArgs>(args: SelectSubset<T, userCreateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {userCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends userCreateManyArgs>(args?: SelectSubset<T, userCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {userCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends userCreateManyAndReturnArgs>(args?: SelectSubset<T, userCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {userDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends userDeleteArgs>(args: SelectSubset<T, userDeleteArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {userUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends userUpdateArgs>(args: SelectSubset<T, userUpdateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {userDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends userDeleteManyArgs>(args?: SelectSubset<T, userDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends userUpdateManyArgs>(args: SelectSubset<T, userUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {userUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends userUpdateManyAndReturnArgs>(args: SelectSubset<T, userUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {userUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends userUpsertArgs>(args: SelectSubset<T, userUpsertArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends userCountArgs>(
      args?: Subset<T, userCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userGroupByArgs} args - Group by arguments.
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
      T extends userGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: userGroupByArgs['orderBy'] }
        : { orderBy?: userGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, userGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user model
   */
  readonly fields: userFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__userClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the user model
   */
  interface userFieldRefs {
    readonly id: FieldRef<"user", 'String'>
    readonly email: FieldRef<"user", 'String'>
    readonly password: FieldRef<"user", 'String'>
    readonly role: FieldRef<"user", 'String'>
    readonly createdAt: FieldRef<"user", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user findUnique
   */
  export type userFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findUniqueOrThrow
   */
  export type userFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findFirst
   */
  export type userFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findFirstOrThrow
   */
  export type userFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findMany
   */
  export type userFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user create
   */
  export type userCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The data needed to create a user.
     */
    data: XOR<userCreateInput, userUncheckedCreateInput>
  }

  /**
   * user createMany
   */
  export type userCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user createManyAndReturn
   */
  export type userCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user update
   */
  export type userUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The data needed to update a user.
     */
    data: XOR<userUpdateInput, userUncheckedUpdateInput>
    /**
     * Choose, which user to update.
     */
    where: userWhereUniqueInput
  }

  /**
   * user updateMany
   */
  export type userUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user updateManyAndReturn
   */
  export type userUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user upsert
   */
  export type userUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The filter to search for the user to update in case it exists.
     */
    where: userWhereUniqueInput
    /**
     * In case the user found by the `where` argument doesn't exist, create a new user with this data.
     */
    create: XOR<userCreateInput, userUncheckedCreateInput>
    /**
     * In case the user was found with the provided `where` argument, update it with this data.
     */
    update: XOR<userUpdateInput, userUncheckedUpdateInput>
  }

  /**
   * user delete
   */
  export type userDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Filter which user to delete.
     */
    where: userWhereUniqueInput
  }

  /**
   * user deleteMany
   */
  export type userDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: userWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * user without action
   */
  export type userDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
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


  export const CategoriaScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre'
  };

  export type CategoriaScalarFieldEnum = (typeof CategoriaScalarFieldEnum)[keyof typeof CategoriaScalarFieldEnum]


  export const MovimientoScalarFieldEnum: {
    id: 'id',
    tipo: 'tipo',
    cantidad: 'cantidad',
    stockAnterior: 'stockAnterior',
    stockNuevo: 'stockNuevo',
    motivo: 'motivo',
    documento: 'documento',
    createdAt: 'createdAt',
    productoId: 'productoId',
    userId: 'userId'
  };

  export type MovimientoScalarFieldEnum = (typeof MovimientoScalarFieldEnum)[keyof typeof MovimientoScalarFieldEnum]


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
    stockReservado: 'stockReservado'
  };

  export type ProductoScalarFieldEnum = (typeof ProductoScalarFieldEnum)[keyof typeof ProductoScalarFieldEnum]


  export const VentaScalarFieldEnum: {
    id: 'id',
    productoId: 'productoId',
    cliente: 'cliente',
    contacto: 'contacto',
    cantidad: 'cantidad',
    precio: 'precio',
    total: 'total',
    estado: 'estado',
    responsable: 'responsable',
    fechaCierre: 'fechaCierre',
    createdAt: 'createdAt'
  };

  export type VentaScalarFieldEnum = (typeof VentaScalarFieldEnum)[keyof typeof VentaScalarFieldEnum]


  export const VentaDetalleScalarFieldEnum: {
    id: 'id',
    ventaId: 'ventaId',
    productoId: 'productoId',
    cantidad: 'cantidad',
    precio: 'precio',
    subtotal: 'subtotal'
  };

  export type VentaDetalleScalarFieldEnum = (typeof VentaDetalleScalarFieldEnum)[keyof typeof VentaDetalleScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


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

  export type MovimientoWhereInput = {
    AND?: MovimientoWhereInput | MovimientoWhereInput[]
    OR?: MovimientoWhereInput[]
    NOT?: MovimientoWhereInput | MovimientoWhereInput[]
    id?: IntFilter<"Movimiento"> | number
    tipo?: StringFilter<"Movimiento"> | string
    cantidad?: IntFilter<"Movimiento"> | number
    stockAnterior?: IntFilter<"Movimiento"> | number
    stockNuevo?: IntFilter<"Movimiento"> | number
    motivo?: StringNullableFilter<"Movimiento"> | string | null
    documento?: StringNullableFilter<"Movimiento"> | string | null
    createdAt?: DateTimeFilter<"Movimiento"> | Date | string
    productoId?: IntFilter<"Movimiento"> | number
    userId?: IntNullableFilter<"Movimiento"> | number | null
    Producto?: XOR<ProductoScalarRelationFilter, ProductoWhereInput>
  }

  export type MovimientoOrderByWithRelationInput = {
    id?: SortOrder
    tipo?: SortOrder
    cantidad?: SortOrder
    stockAnterior?: SortOrder
    stockNuevo?: SortOrder
    motivo?: SortOrderInput | SortOrder
    documento?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    productoId?: SortOrder
    userId?: SortOrderInput | SortOrder
    Producto?: ProductoOrderByWithRelationInput
  }

  export type MovimientoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MovimientoWhereInput | MovimientoWhereInput[]
    OR?: MovimientoWhereInput[]
    NOT?: MovimientoWhereInput | MovimientoWhereInput[]
    tipo?: StringFilter<"Movimiento"> | string
    cantidad?: IntFilter<"Movimiento"> | number
    stockAnterior?: IntFilter<"Movimiento"> | number
    stockNuevo?: IntFilter<"Movimiento"> | number
    motivo?: StringNullableFilter<"Movimiento"> | string | null
    documento?: StringNullableFilter<"Movimiento"> | string | null
    createdAt?: DateTimeFilter<"Movimiento"> | Date | string
    productoId?: IntFilter<"Movimiento"> | number
    userId?: IntNullableFilter<"Movimiento"> | number | null
    Producto?: XOR<ProductoScalarRelationFilter, ProductoWhereInput>
  }, "id">

  export type MovimientoOrderByWithAggregationInput = {
    id?: SortOrder
    tipo?: SortOrder
    cantidad?: SortOrder
    stockAnterior?: SortOrder
    stockNuevo?: SortOrder
    motivo?: SortOrderInput | SortOrder
    documento?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    productoId?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: MovimientoCountOrderByAggregateInput
    _avg?: MovimientoAvgOrderByAggregateInput
    _max?: MovimientoMaxOrderByAggregateInput
    _min?: MovimientoMinOrderByAggregateInput
    _sum?: MovimientoSumOrderByAggregateInput
  }

  export type MovimientoScalarWhereWithAggregatesInput = {
    AND?: MovimientoScalarWhereWithAggregatesInput | MovimientoScalarWhereWithAggregatesInput[]
    OR?: MovimientoScalarWhereWithAggregatesInput[]
    NOT?: MovimientoScalarWhereWithAggregatesInput | MovimientoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Movimiento"> | number
    tipo?: StringWithAggregatesFilter<"Movimiento"> | string
    cantidad?: IntWithAggregatesFilter<"Movimiento"> | number
    stockAnterior?: IntWithAggregatesFilter<"Movimiento"> | number
    stockNuevo?: IntWithAggregatesFilter<"Movimiento"> | number
    motivo?: StringNullableWithAggregatesFilter<"Movimiento"> | string | null
    documento?: StringNullableWithAggregatesFilter<"Movimiento"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Movimiento"> | Date | string
    productoId?: IntWithAggregatesFilter<"Movimiento"> | number
    userId?: IntNullableWithAggregatesFilter<"Movimiento"> | number | null
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
    Movimiento?: MovimientoListRelationFilter
    Categoria?: XOR<CategoriaScalarRelationFilter, CategoriaWhereInput>
    Venta?: VentaListRelationFilter
    VentaDetalle?: VentaDetalleListRelationFilter
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
    Movimiento?: MovimientoOrderByRelationAggregateInput
    Categoria?: CategoriaOrderByWithRelationInput
    Venta?: VentaOrderByRelationAggregateInput
    VentaDetalle?: VentaDetalleOrderByRelationAggregateInput
  }

  export type ProductoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
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
    Movimiento?: MovimientoListRelationFilter
    Categoria?: XOR<CategoriaScalarRelationFilter, CategoriaWhereInput>
    Venta?: VentaListRelationFilter
    VentaDetalle?: VentaDetalleListRelationFilter
  }, "id">

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
  }

  export type VentaWhereInput = {
    AND?: VentaWhereInput | VentaWhereInput[]
    OR?: VentaWhereInput[]
    NOT?: VentaWhereInput | VentaWhereInput[]
    id?: IntFilter<"Venta"> | number
    productoId?: IntFilter<"Venta"> | number
    cliente?: StringFilter<"Venta"> | string
    contacto?: StringNullableFilter<"Venta"> | string | null
    cantidad?: IntFilter<"Venta"> | number
    precio?: FloatFilter<"Venta"> | number
    total?: FloatFilter<"Venta"> | number
    estado?: StringFilter<"Venta"> | string
    responsable?: StringNullableFilter<"Venta"> | string | null
    fechaCierre?: DateTimeNullableFilter<"Venta"> | Date | string | null
    createdAt?: DateTimeFilter<"Venta"> | Date | string
    Producto?: XOR<ProductoScalarRelationFilter, ProductoWhereInput>
    VentaDetalle?: VentaDetalleListRelationFilter
  }

  export type VentaOrderByWithRelationInput = {
    id?: SortOrder
    productoId?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrderInput | SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    total?: SortOrder
    estado?: SortOrder
    responsable?: SortOrderInput | SortOrder
    fechaCierre?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    Producto?: ProductoOrderByWithRelationInput
    VentaDetalle?: VentaDetalleOrderByRelationAggregateInput
  }

  export type VentaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: VentaWhereInput | VentaWhereInput[]
    OR?: VentaWhereInput[]
    NOT?: VentaWhereInput | VentaWhereInput[]
    productoId?: IntFilter<"Venta"> | number
    cliente?: StringFilter<"Venta"> | string
    contacto?: StringNullableFilter<"Venta"> | string | null
    cantidad?: IntFilter<"Venta"> | number
    precio?: FloatFilter<"Venta"> | number
    total?: FloatFilter<"Venta"> | number
    estado?: StringFilter<"Venta"> | string
    responsable?: StringNullableFilter<"Venta"> | string | null
    fechaCierre?: DateTimeNullableFilter<"Venta"> | Date | string | null
    createdAt?: DateTimeFilter<"Venta"> | Date | string
    Producto?: XOR<ProductoScalarRelationFilter, ProductoWhereInput>
    VentaDetalle?: VentaDetalleListRelationFilter
  }, "id">

  export type VentaOrderByWithAggregationInput = {
    id?: SortOrder
    productoId?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrderInput | SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    total?: SortOrder
    estado?: SortOrder
    responsable?: SortOrderInput | SortOrder
    fechaCierre?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: VentaCountOrderByAggregateInput
    _avg?: VentaAvgOrderByAggregateInput
    _max?: VentaMaxOrderByAggregateInput
    _min?: VentaMinOrderByAggregateInput
    _sum?: VentaSumOrderByAggregateInput
  }

  export type VentaScalarWhereWithAggregatesInput = {
    AND?: VentaScalarWhereWithAggregatesInput | VentaScalarWhereWithAggregatesInput[]
    OR?: VentaScalarWhereWithAggregatesInput[]
    NOT?: VentaScalarWhereWithAggregatesInput | VentaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Venta"> | number
    productoId?: IntWithAggregatesFilter<"Venta"> | number
    cliente?: StringWithAggregatesFilter<"Venta"> | string
    contacto?: StringNullableWithAggregatesFilter<"Venta"> | string | null
    cantidad?: IntWithAggregatesFilter<"Venta"> | number
    precio?: FloatWithAggregatesFilter<"Venta"> | number
    total?: FloatWithAggregatesFilter<"Venta"> | number
    estado?: StringWithAggregatesFilter<"Venta"> | string
    responsable?: StringNullableWithAggregatesFilter<"Venta"> | string | null
    fechaCierre?: DateTimeNullableWithAggregatesFilter<"Venta"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Venta"> | Date | string
  }

  export type VentaDetalleWhereInput = {
    AND?: VentaDetalleWhereInput | VentaDetalleWhereInput[]
    OR?: VentaDetalleWhereInput[]
    NOT?: VentaDetalleWhereInput | VentaDetalleWhereInput[]
    id?: IntFilter<"VentaDetalle"> | number
    ventaId?: IntFilter<"VentaDetalle"> | number
    productoId?: IntFilter<"VentaDetalle"> | number
    cantidad?: IntFilter<"VentaDetalle"> | number
    precio?: FloatFilter<"VentaDetalle"> | number
    subtotal?: FloatFilter<"VentaDetalle"> | number
    Producto?: XOR<ProductoScalarRelationFilter, ProductoWhereInput>
    Venta?: XOR<VentaScalarRelationFilter, VentaWhereInput>
  }

  export type VentaDetalleOrderByWithRelationInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    subtotal?: SortOrder
    Producto?: ProductoOrderByWithRelationInput
    Venta?: VentaOrderByWithRelationInput
  }

  export type VentaDetalleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: VentaDetalleWhereInput | VentaDetalleWhereInput[]
    OR?: VentaDetalleWhereInput[]
    NOT?: VentaDetalleWhereInput | VentaDetalleWhereInput[]
    ventaId?: IntFilter<"VentaDetalle"> | number
    productoId?: IntFilter<"VentaDetalle"> | number
    cantidad?: IntFilter<"VentaDetalle"> | number
    precio?: FloatFilter<"VentaDetalle"> | number
    subtotal?: FloatFilter<"VentaDetalle"> | number
    Producto?: XOR<ProductoScalarRelationFilter, ProductoWhereInput>
    Venta?: XOR<VentaScalarRelationFilter, VentaWhereInput>
  }, "id">

  export type VentaDetalleOrderByWithAggregationInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    subtotal?: SortOrder
    _count?: VentaDetalleCountOrderByAggregateInput
    _avg?: VentaDetalleAvgOrderByAggregateInput
    _max?: VentaDetalleMaxOrderByAggregateInput
    _min?: VentaDetalleMinOrderByAggregateInput
    _sum?: VentaDetalleSumOrderByAggregateInput
  }

  export type VentaDetalleScalarWhereWithAggregatesInput = {
    AND?: VentaDetalleScalarWhereWithAggregatesInput | VentaDetalleScalarWhereWithAggregatesInput[]
    OR?: VentaDetalleScalarWhereWithAggregatesInput[]
    NOT?: VentaDetalleScalarWhereWithAggregatesInput | VentaDetalleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"VentaDetalle"> | number
    ventaId?: IntWithAggregatesFilter<"VentaDetalle"> | number
    productoId?: IntWithAggregatesFilter<"VentaDetalle"> | number
    cantidad?: IntWithAggregatesFilter<"VentaDetalle"> | number
    precio?: FloatWithAggregatesFilter<"VentaDetalle"> | number
    subtotal?: FloatWithAggregatesFilter<"VentaDetalle"> | number
  }

  export type userWhereInput = {
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    id?: StringFilter<"user"> | string
    email?: StringFilter<"user"> | string
    password?: StringFilter<"user"> | string
    role?: StringFilter<"user"> | string
    createdAt?: DateTimeFilter<"user"> | Date | string
  }

  export type userOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type userWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    password?: StringFilter<"user"> | string
    role?: StringFilter<"user"> | string
    createdAt?: DateTimeFilter<"user"> | Date | string
  }, "id" | "email">

  export type userOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: userCountOrderByAggregateInput
    _max?: userMaxOrderByAggregateInput
    _min?: userMinOrderByAggregateInput
  }

  export type userScalarWhereWithAggregatesInput = {
    AND?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    OR?: userScalarWhereWithAggregatesInput[]
    NOT?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"user"> | string
    email?: StringWithAggregatesFilter<"user"> | string
    password?: StringWithAggregatesFilter<"user"> | string
    role?: StringWithAggregatesFilter<"user"> | string
    createdAt?: DateTimeWithAggregatesFilter<"user"> | Date | string
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

  export type MovimientoCreateInput = {
    tipo: string
    cantidad: number
    stockAnterior: number
    stockNuevo: number
    motivo?: string | null
    documento?: string | null
    createdAt?: Date | string
    userId?: number | null
    Producto: ProductoCreateNestedOneWithoutMovimientoInput
  }

  export type MovimientoUncheckedCreateInput = {
    id?: number
    tipo: string
    cantidad: number
    stockAnterior: number
    stockNuevo: number
    motivo?: string | null
    documento?: string | null
    createdAt?: Date | string
    productoId: number
    userId?: number | null
  }

  export type MovimientoUpdateInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    cantidad?: IntFieldUpdateOperationsInput | number
    stockAnterior?: IntFieldUpdateOperationsInput | number
    stockNuevo?: IntFieldUpdateOperationsInput | number
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    Producto?: ProductoUpdateOneRequiredWithoutMovimientoNestedInput
  }

  export type MovimientoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    cantidad?: IntFieldUpdateOperationsInput | number
    stockAnterior?: IntFieldUpdateOperationsInput | number
    stockNuevo?: IntFieldUpdateOperationsInput | number
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productoId?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type MovimientoCreateManyInput = {
    id?: number
    tipo: string
    cantidad: number
    stockAnterior: number
    stockNuevo: number
    motivo?: string | null
    documento?: string | null
    createdAt?: Date | string
    productoId: number
    userId?: number | null
  }

  export type MovimientoUpdateManyMutationInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    cantidad?: IntFieldUpdateOperationsInput | number
    stockAnterior?: IntFieldUpdateOperationsInput | number
    stockNuevo?: IntFieldUpdateOperationsInput | number
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type MovimientoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    cantidad?: IntFieldUpdateOperationsInput | number
    stockAnterior?: IntFieldUpdateOperationsInput | number
    stockNuevo?: IntFieldUpdateOperationsInput | number
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productoId?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
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
    Movimiento?: MovimientoCreateNestedManyWithoutProductoInput
    Categoria: CategoriaCreateNestedOneWithoutProductoInput
    Venta?: VentaCreateNestedManyWithoutProductoInput
    VentaDetalle?: VentaDetalleCreateNestedManyWithoutProductoInput
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
    Movimiento?: MovimientoUncheckedCreateNestedManyWithoutProductoInput
    Venta?: VentaUncheckedCreateNestedManyWithoutProductoInput
    VentaDetalle?: VentaDetalleUncheckedCreateNestedManyWithoutProductoInput
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
    Movimiento?: MovimientoUpdateManyWithoutProductoNestedInput
    Categoria?: CategoriaUpdateOneRequiredWithoutProductoNestedInput
    Venta?: VentaUpdateManyWithoutProductoNestedInput
    VentaDetalle?: VentaDetalleUpdateManyWithoutProductoNestedInput
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
    Movimiento?: MovimientoUncheckedUpdateManyWithoutProductoNestedInput
    Venta?: VentaUncheckedUpdateManyWithoutProductoNestedInput
    VentaDetalle?: VentaDetalleUncheckedUpdateManyWithoutProductoNestedInput
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
  }

  export type VentaCreateInput = {
    cliente: string
    contacto?: string | null
    cantidad: number
    precio: number
    total: number
    estado?: string
    responsable?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    Producto: ProductoCreateNestedOneWithoutVentaInput
    VentaDetalle?: VentaDetalleCreateNestedManyWithoutVentaInput
  }

  export type VentaUncheckedCreateInput = {
    id?: number
    productoId: number
    cliente: string
    contacto?: string | null
    cantidad: number
    precio: number
    total: number
    estado?: string
    responsable?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    VentaDetalle?: VentaDetalleUncheckedCreateNestedManyWithoutVentaInput
  }

  export type VentaUpdateInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Producto?: ProductoUpdateOneRequiredWithoutVentaNestedInput
    VentaDetalle?: VentaDetalleUpdateManyWithoutVentaNestedInput
  }

  export type VentaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    VentaDetalle?: VentaDetalleUncheckedUpdateManyWithoutVentaNestedInput
  }

  export type VentaCreateManyInput = {
    id?: number
    productoId: number
    cliente: string
    contacto?: string | null
    cantidad: number
    precio: number
    total: number
    estado?: string
    responsable?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
  }

  export type VentaUpdateManyMutationInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VentaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VentaDetalleCreateInput = {
    cantidad: number
    precio: number
    subtotal: number
    Producto: ProductoCreateNestedOneWithoutVentaDetalleInput
    Venta: VentaCreateNestedOneWithoutVentaDetalleInput
  }

  export type VentaDetalleUncheckedCreateInput = {
    id?: number
    ventaId: number
    productoId: number
    cantidad: number
    precio: number
    subtotal: number
  }

  export type VentaDetalleUpdateInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    Producto?: ProductoUpdateOneRequiredWithoutVentaDetalleNestedInput
    Venta?: VentaUpdateOneRequiredWithoutVentaDetalleNestedInput
  }

  export type VentaDetalleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    ventaId?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type VentaDetalleCreateManyInput = {
    id?: number
    ventaId: number
    productoId: number
    cantidad: number
    precio: number
    subtotal: number
  }

  export type VentaDetalleUpdateManyMutationInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type VentaDetalleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    ventaId?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type userCreateInput = {
    id: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
  }

  export type userUncheckedCreateInput = {
    id: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
  }

  export type userUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userCreateManyInput = {
    id: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
  }

  export type userUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type ProductoScalarRelationFilter = {
    is?: ProductoWhereInput
    isNot?: ProductoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MovimientoCountOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    cantidad?: SortOrder
    stockAnterior?: SortOrder
    stockNuevo?: SortOrder
    motivo?: SortOrder
    documento?: SortOrder
    createdAt?: SortOrder
    productoId?: SortOrder
    userId?: SortOrder
  }

  export type MovimientoAvgOrderByAggregateInput = {
    id?: SortOrder
    cantidad?: SortOrder
    stockAnterior?: SortOrder
    stockNuevo?: SortOrder
    productoId?: SortOrder
    userId?: SortOrder
  }

  export type MovimientoMaxOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    cantidad?: SortOrder
    stockAnterior?: SortOrder
    stockNuevo?: SortOrder
    motivo?: SortOrder
    documento?: SortOrder
    createdAt?: SortOrder
    productoId?: SortOrder
    userId?: SortOrder
  }

  export type MovimientoMinOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    cantidad?: SortOrder
    stockAnterior?: SortOrder
    stockNuevo?: SortOrder
    motivo?: SortOrder
    documento?: SortOrder
    createdAt?: SortOrder
    productoId?: SortOrder
    userId?: SortOrder
  }

  export type MovimientoSumOrderByAggregateInput = {
    id?: SortOrder
    cantidad?: SortOrder
    stockAnterior?: SortOrder
    stockNuevo?: SortOrder
    productoId?: SortOrder
    userId?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type MovimientoListRelationFilter = {
    every?: MovimientoWhereInput
    some?: MovimientoWhereInput
    none?: MovimientoWhereInput
  }

  export type CategoriaScalarRelationFilter = {
    is?: CategoriaWhereInput
    isNot?: CategoriaWhereInput
  }

  export type VentaListRelationFilter = {
    every?: VentaWhereInput
    some?: VentaWhereInput
    none?: VentaWhereInput
  }

  export type VentaDetalleListRelationFilter = {
    every?: VentaDetalleWhereInput
    some?: VentaDetalleWhereInput
    none?: VentaDetalleWhereInput
  }

  export type MovimientoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VentaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VentaDetalleOrderByRelationAggregateInput = {
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
  }

  export type ProductoAvgOrderByAggregateInput = {
    id?: SortOrder
    stock?: SortOrder
    precio?: SortOrder
    minStock?: SortOrder
    categoriaId?: SortOrder
    stockReservado?: SortOrder
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
  }

  export type ProductoSumOrderByAggregateInput = {
    id?: SortOrder
    stock?: SortOrder
    precio?: SortOrder
    minStock?: SortOrder
    categoriaId?: SortOrder
    stockReservado?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type VentaCountOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    total?: SortOrder
    estado?: SortOrder
    responsable?: SortOrder
    fechaCierre?: SortOrder
    createdAt?: SortOrder
  }

  export type VentaAvgOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    total?: SortOrder
  }

  export type VentaMaxOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    total?: SortOrder
    estado?: SortOrder
    responsable?: SortOrder
    fechaCierre?: SortOrder
    createdAt?: SortOrder
  }

  export type VentaMinOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    cliente?: SortOrder
    contacto?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    total?: SortOrder
    estado?: SortOrder
    responsable?: SortOrder
    fechaCierre?: SortOrder
    createdAt?: SortOrder
  }

  export type VentaSumOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    total?: SortOrder
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

  export type VentaScalarRelationFilter = {
    is?: VentaWhereInput
    isNot?: VentaWhereInput
  }

  export type VentaDetalleCountOrderByAggregateInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    subtotal?: SortOrder
  }

  export type VentaDetalleAvgOrderByAggregateInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    subtotal?: SortOrder
  }

  export type VentaDetalleMaxOrderByAggregateInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    subtotal?: SortOrder
  }

  export type VentaDetalleMinOrderByAggregateInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    subtotal?: SortOrder
  }

  export type VentaDetalleSumOrderByAggregateInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precio?: SortOrder
    subtotal?: SortOrder
  }

  export type userCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type userMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type userMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
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

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type ProductoCreateNestedOneWithoutMovimientoInput = {
    create?: XOR<ProductoCreateWithoutMovimientoInput, ProductoUncheckedCreateWithoutMovimientoInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutMovimientoInput
    connect?: ProductoWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProductoUpdateOneRequiredWithoutMovimientoNestedInput = {
    create?: XOR<ProductoCreateWithoutMovimientoInput, ProductoUncheckedCreateWithoutMovimientoInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutMovimientoInput
    upsert?: ProductoUpsertWithoutMovimientoInput
    connect?: ProductoWhereUniqueInput
    update?: XOR<XOR<ProductoUpdateToOneWithWhereWithoutMovimientoInput, ProductoUpdateWithoutMovimientoInput>, ProductoUncheckedUpdateWithoutMovimientoInput>
  }

  export type MovimientoCreateNestedManyWithoutProductoInput = {
    create?: XOR<MovimientoCreateWithoutProductoInput, MovimientoUncheckedCreateWithoutProductoInput> | MovimientoCreateWithoutProductoInput[] | MovimientoUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: MovimientoCreateOrConnectWithoutProductoInput | MovimientoCreateOrConnectWithoutProductoInput[]
    createMany?: MovimientoCreateManyProductoInputEnvelope
    connect?: MovimientoWhereUniqueInput | MovimientoWhereUniqueInput[]
  }

  export type CategoriaCreateNestedOneWithoutProductoInput = {
    create?: XOR<CategoriaCreateWithoutProductoInput, CategoriaUncheckedCreateWithoutProductoInput>
    connectOrCreate?: CategoriaCreateOrConnectWithoutProductoInput
    connect?: CategoriaWhereUniqueInput
  }

  export type VentaCreateNestedManyWithoutProductoInput = {
    create?: XOR<VentaCreateWithoutProductoInput, VentaUncheckedCreateWithoutProductoInput> | VentaCreateWithoutProductoInput[] | VentaUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: VentaCreateOrConnectWithoutProductoInput | VentaCreateOrConnectWithoutProductoInput[]
    createMany?: VentaCreateManyProductoInputEnvelope
    connect?: VentaWhereUniqueInput | VentaWhereUniqueInput[]
  }

  export type VentaDetalleCreateNestedManyWithoutProductoInput = {
    create?: XOR<VentaDetalleCreateWithoutProductoInput, VentaDetalleUncheckedCreateWithoutProductoInput> | VentaDetalleCreateWithoutProductoInput[] | VentaDetalleUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: VentaDetalleCreateOrConnectWithoutProductoInput | VentaDetalleCreateOrConnectWithoutProductoInput[]
    createMany?: VentaDetalleCreateManyProductoInputEnvelope
    connect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
  }

  export type MovimientoUncheckedCreateNestedManyWithoutProductoInput = {
    create?: XOR<MovimientoCreateWithoutProductoInput, MovimientoUncheckedCreateWithoutProductoInput> | MovimientoCreateWithoutProductoInput[] | MovimientoUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: MovimientoCreateOrConnectWithoutProductoInput | MovimientoCreateOrConnectWithoutProductoInput[]
    createMany?: MovimientoCreateManyProductoInputEnvelope
    connect?: MovimientoWhereUniqueInput | MovimientoWhereUniqueInput[]
  }

  export type VentaUncheckedCreateNestedManyWithoutProductoInput = {
    create?: XOR<VentaCreateWithoutProductoInput, VentaUncheckedCreateWithoutProductoInput> | VentaCreateWithoutProductoInput[] | VentaUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: VentaCreateOrConnectWithoutProductoInput | VentaCreateOrConnectWithoutProductoInput[]
    createMany?: VentaCreateManyProductoInputEnvelope
    connect?: VentaWhereUniqueInput | VentaWhereUniqueInput[]
  }

  export type VentaDetalleUncheckedCreateNestedManyWithoutProductoInput = {
    create?: XOR<VentaDetalleCreateWithoutProductoInput, VentaDetalleUncheckedCreateWithoutProductoInput> | VentaDetalleCreateWithoutProductoInput[] | VentaDetalleUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: VentaDetalleCreateOrConnectWithoutProductoInput | VentaDetalleCreateOrConnectWithoutProductoInput[]
    createMany?: VentaDetalleCreateManyProductoInputEnvelope
    connect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type MovimientoUpdateManyWithoutProductoNestedInput = {
    create?: XOR<MovimientoCreateWithoutProductoInput, MovimientoUncheckedCreateWithoutProductoInput> | MovimientoCreateWithoutProductoInput[] | MovimientoUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: MovimientoCreateOrConnectWithoutProductoInput | MovimientoCreateOrConnectWithoutProductoInput[]
    upsert?: MovimientoUpsertWithWhereUniqueWithoutProductoInput | MovimientoUpsertWithWhereUniqueWithoutProductoInput[]
    createMany?: MovimientoCreateManyProductoInputEnvelope
    set?: MovimientoWhereUniqueInput | MovimientoWhereUniqueInput[]
    disconnect?: MovimientoWhereUniqueInput | MovimientoWhereUniqueInput[]
    delete?: MovimientoWhereUniqueInput | MovimientoWhereUniqueInput[]
    connect?: MovimientoWhereUniqueInput | MovimientoWhereUniqueInput[]
    update?: MovimientoUpdateWithWhereUniqueWithoutProductoInput | MovimientoUpdateWithWhereUniqueWithoutProductoInput[]
    updateMany?: MovimientoUpdateManyWithWhereWithoutProductoInput | MovimientoUpdateManyWithWhereWithoutProductoInput[]
    deleteMany?: MovimientoScalarWhereInput | MovimientoScalarWhereInput[]
  }

  export type CategoriaUpdateOneRequiredWithoutProductoNestedInput = {
    create?: XOR<CategoriaCreateWithoutProductoInput, CategoriaUncheckedCreateWithoutProductoInput>
    connectOrCreate?: CategoriaCreateOrConnectWithoutProductoInput
    upsert?: CategoriaUpsertWithoutProductoInput
    connect?: CategoriaWhereUniqueInput
    update?: XOR<XOR<CategoriaUpdateToOneWithWhereWithoutProductoInput, CategoriaUpdateWithoutProductoInput>, CategoriaUncheckedUpdateWithoutProductoInput>
  }

  export type VentaUpdateManyWithoutProductoNestedInput = {
    create?: XOR<VentaCreateWithoutProductoInput, VentaUncheckedCreateWithoutProductoInput> | VentaCreateWithoutProductoInput[] | VentaUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: VentaCreateOrConnectWithoutProductoInput | VentaCreateOrConnectWithoutProductoInput[]
    upsert?: VentaUpsertWithWhereUniqueWithoutProductoInput | VentaUpsertWithWhereUniqueWithoutProductoInput[]
    createMany?: VentaCreateManyProductoInputEnvelope
    set?: VentaWhereUniqueInput | VentaWhereUniqueInput[]
    disconnect?: VentaWhereUniqueInput | VentaWhereUniqueInput[]
    delete?: VentaWhereUniqueInput | VentaWhereUniqueInput[]
    connect?: VentaWhereUniqueInput | VentaWhereUniqueInput[]
    update?: VentaUpdateWithWhereUniqueWithoutProductoInput | VentaUpdateWithWhereUniqueWithoutProductoInput[]
    updateMany?: VentaUpdateManyWithWhereWithoutProductoInput | VentaUpdateManyWithWhereWithoutProductoInput[]
    deleteMany?: VentaScalarWhereInput | VentaScalarWhereInput[]
  }

  export type VentaDetalleUpdateManyWithoutProductoNestedInput = {
    create?: XOR<VentaDetalleCreateWithoutProductoInput, VentaDetalleUncheckedCreateWithoutProductoInput> | VentaDetalleCreateWithoutProductoInput[] | VentaDetalleUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: VentaDetalleCreateOrConnectWithoutProductoInput | VentaDetalleCreateOrConnectWithoutProductoInput[]
    upsert?: VentaDetalleUpsertWithWhereUniqueWithoutProductoInput | VentaDetalleUpsertWithWhereUniqueWithoutProductoInput[]
    createMany?: VentaDetalleCreateManyProductoInputEnvelope
    set?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    disconnect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    delete?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    connect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    update?: VentaDetalleUpdateWithWhereUniqueWithoutProductoInput | VentaDetalleUpdateWithWhereUniqueWithoutProductoInput[]
    updateMany?: VentaDetalleUpdateManyWithWhereWithoutProductoInput | VentaDetalleUpdateManyWithWhereWithoutProductoInput[]
    deleteMany?: VentaDetalleScalarWhereInput | VentaDetalleScalarWhereInput[]
  }

  export type MovimientoUncheckedUpdateManyWithoutProductoNestedInput = {
    create?: XOR<MovimientoCreateWithoutProductoInput, MovimientoUncheckedCreateWithoutProductoInput> | MovimientoCreateWithoutProductoInput[] | MovimientoUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: MovimientoCreateOrConnectWithoutProductoInput | MovimientoCreateOrConnectWithoutProductoInput[]
    upsert?: MovimientoUpsertWithWhereUniqueWithoutProductoInput | MovimientoUpsertWithWhereUniqueWithoutProductoInput[]
    createMany?: MovimientoCreateManyProductoInputEnvelope
    set?: MovimientoWhereUniqueInput | MovimientoWhereUniqueInput[]
    disconnect?: MovimientoWhereUniqueInput | MovimientoWhereUniqueInput[]
    delete?: MovimientoWhereUniqueInput | MovimientoWhereUniqueInput[]
    connect?: MovimientoWhereUniqueInput | MovimientoWhereUniqueInput[]
    update?: MovimientoUpdateWithWhereUniqueWithoutProductoInput | MovimientoUpdateWithWhereUniqueWithoutProductoInput[]
    updateMany?: MovimientoUpdateManyWithWhereWithoutProductoInput | MovimientoUpdateManyWithWhereWithoutProductoInput[]
    deleteMany?: MovimientoScalarWhereInput | MovimientoScalarWhereInput[]
  }

  export type VentaUncheckedUpdateManyWithoutProductoNestedInput = {
    create?: XOR<VentaCreateWithoutProductoInput, VentaUncheckedCreateWithoutProductoInput> | VentaCreateWithoutProductoInput[] | VentaUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: VentaCreateOrConnectWithoutProductoInput | VentaCreateOrConnectWithoutProductoInput[]
    upsert?: VentaUpsertWithWhereUniqueWithoutProductoInput | VentaUpsertWithWhereUniqueWithoutProductoInput[]
    createMany?: VentaCreateManyProductoInputEnvelope
    set?: VentaWhereUniqueInput | VentaWhereUniqueInput[]
    disconnect?: VentaWhereUniqueInput | VentaWhereUniqueInput[]
    delete?: VentaWhereUniqueInput | VentaWhereUniqueInput[]
    connect?: VentaWhereUniqueInput | VentaWhereUniqueInput[]
    update?: VentaUpdateWithWhereUniqueWithoutProductoInput | VentaUpdateWithWhereUniqueWithoutProductoInput[]
    updateMany?: VentaUpdateManyWithWhereWithoutProductoInput | VentaUpdateManyWithWhereWithoutProductoInput[]
    deleteMany?: VentaScalarWhereInput | VentaScalarWhereInput[]
  }

  export type VentaDetalleUncheckedUpdateManyWithoutProductoNestedInput = {
    create?: XOR<VentaDetalleCreateWithoutProductoInput, VentaDetalleUncheckedCreateWithoutProductoInput> | VentaDetalleCreateWithoutProductoInput[] | VentaDetalleUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: VentaDetalleCreateOrConnectWithoutProductoInput | VentaDetalleCreateOrConnectWithoutProductoInput[]
    upsert?: VentaDetalleUpsertWithWhereUniqueWithoutProductoInput | VentaDetalleUpsertWithWhereUniqueWithoutProductoInput[]
    createMany?: VentaDetalleCreateManyProductoInputEnvelope
    set?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    disconnect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    delete?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    connect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    update?: VentaDetalleUpdateWithWhereUniqueWithoutProductoInput | VentaDetalleUpdateWithWhereUniqueWithoutProductoInput[]
    updateMany?: VentaDetalleUpdateManyWithWhereWithoutProductoInput | VentaDetalleUpdateManyWithWhereWithoutProductoInput[]
    deleteMany?: VentaDetalleScalarWhereInput | VentaDetalleScalarWhereInput[]
  }

  export type ProductoCreateNestedOneWithoutVentaInput = {
    create?: XOR<ProductoCreateWithoutVentaInput, ProductoUncheckedCreateWithoutVentaInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutVentaInput
    connect?: ProductoWhereUniqueInput
  }

  export type VentaDetalleCreateNestedManyWithoutVentaInput = {
    create?: XOR<VentaDetalleCreateWithoutVentaInput, VentaDetalleUncheckedCreateWithoutVentaInput> | VentaDetalleCreateWithoutVentaInput[] | VentaDetalleUncheckedCreateWithoutVentaInput[]
    connectOrCreate?: VentaDetalleCreateOrConnectWithoutVentaInput | VentaDetalleCreateOrConnectWithoutVentaInput[]
    createMany?: VentaDetalleCreateManyVentaInputEnvelope
    connect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
  }

  export type VentaDetalleUncheckedCreateNestedManyWithoutVentaInput = {
    create?: XOR<VentaDetalleCreateWithoutVentaInput, VentaDetalleUncheckedCreateWithoutVentaInput> | VentaDetalleCreateWithoutVentaInput[] | VentaDetalleUncheckedCreateWithoutVentaInput[]
    connectOrCreate?: VentaDetalleCreateOrConnectWithoutVentaInput | VentaDetalleCreateOrConnectWithoutVentaInput[]
    createMany?: VentaDetalleCreateManyVentaInputEnvelope
    connect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProductoUpdateOneRequiredWithoutVentaNestedInput = {
    create?: XOR<ProductoCreateWithoutVentaInput, ProductoUncheckedCreateWithoutVentaInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutVentaInput
    upsert?: ProductoUpsertWithoutVentaInput
    connect?: ProductoWhereUniqueInput
    update?: XOR<XOR<ProductoUpdateToOneWithWhereWithoutVentaInput, ProductoUpdateWithoutVentaInput>, ProductoUncheckedUpdateWithoutVentaInput>
  }

  export type VentaDetalleUpdateManyWithoutVentaNestedInput = {
    create?: XOR<VentaDetalleCreateWithoutVentaInput, VentaDetalleUncheckedCreateWithoutVentaInput> | VentaDetalleCreateWithoutVentaInput[] | VentaDetalleUncheckedCreateWithoutVentaInput[]
    connectOrCreate?: VentaDetalleCreateOrConnectWithoutVentaInput | VentaDetalleCreateOrConnectWithoutVentaInput[]
    upsert?: VentaDetalleUpsertWithWhereUniqueWithoutVentaInput | VentaDetalleUpsertWithWhereUniqueWithoutVentaInput[]
    createMany?: VentaDetalleCreateManyVentaInputEnvelope
    set?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    disconnect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    delete?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    connect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    update?: VentaDetalleUpdateWithWhereUniqueWithoutVentaInput | VentaDetalleUpdateWithWhereUniqueWithoutVentaInput[]
    updateMany?: VentaDetalleUpdateManyWithWhereWithoutVentaInput | VentaDetalleUpdateManyWithWhereWithoutVentaInput[]
    deleteMany?: VentaDetalleScalarWhereInput | VentaDetalleScalarWhereInput[]
  }

  export type VentaDetalleUncheckedUpdateManyWithoutVentaNestedInput = {
    create?: XOR<VentaDetalleCreateWithoutVentaInput, VentaDetalleUncheckedCreateWithoutVentaInput> | VentaDetalleCreateWithoutVentaInput[] | VentaDetalleUncheckedCreateWithoutVentaInput[]
    connectOrCreate?: VentaDetalleCreateOrConnectWithoutVentaInput | VentaDetalleCreateOrConnectWithoutVentaInput[]
    upsert?: VentaDetalleUpsertWithWhereUniqueWithoutVentaInput | VentaDetalleUpsertWithWhereUniqueWithoutVentaInput[]
    createMany?: VentaDetalleCreateManyVentaInputEnvelope
    set?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    disconnect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    delete?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    connect?: VentaDetalleWhereUniqueInput | VentaDetalleWhereUniqueInput[]
    update?: VentaDetalleUpdateWithWhereUniqueWithoutVentaInput | VentaDetalleUpdateWithWhereUniqueWithoutVentaInput[]
    updateMany?: VentaDetalleUpdateManyWithWhereWithoutVentaInput | VentaDetalleUpdateManyWithWhereWithoutVentaInput[]
    deleteMany?: VentaDetalleScalarWhereInput | VentaDetalleScalarWhereInput[]
  }

  export type ProductoCreateNestedOneWithoutVentaDetalleInput = {
    create?: XOR<ProductoCreateWithoutVentaDetalleInput, ProductoUncheckedCreateWithoutVentaDetalleInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutVentaDetalleInput
    connect?: ProductoWhereUniqueInput
  }

  export type VentaCreateNestedOneWithoutVentaDetalleInput = {
    create?: XOR<VentaCreateWithoutVentaDetalleInput, VentaUncheckedCreateWithoutVentaDetalleInput>
    connectOrCreate?: VentaCreateOrConnectWithoutVentaDetalleInput
    connect?: VentaWhereUniqueInput
  }

  export type ProductoUpdateOneRequiredWithoutVentaDetalleNestedInput = {
    create?: XOR<ProductoCreateWithoutVentaDetalleInput, ProductoUncheckedCreateWithoutVentaDetalleInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutVentaDetalleInput
    upsert?: ProductoUpsertWithoutVentaDetalleInput
    connect?: ProductoWhereUniqueInput
    update?: XOR<XOR<ProductoUpdateToOneWithWhereWithoutVentaDetalleInput, ProductoUpdateWithoutVentaDetalleInput>, ProductoUncheckedUpdateWithoutVentaDetalleInput>
  }

  export type VentaUpdateOneRequiredWithoutVentaDetalleNestedInput = {
    create?: XOR<VentaCreateWithoutVentaDetalleInput, VentaUncheckedCreateWithoutVentaDetalleInput>
    connectOrCreate?: VentaCreateOrConnectWithoutVentaDetalleInput
    upsert?: VentaUpsertWithoutVentaDetalleInput
    connect?: VentaWhereUniqueInput
    update?: XOR<XOR<VentaUpdateToOneWithWhereWithoutVentaDetalleInput, VentaUpdateWithoutVentaDetalleInput>, VentaUncheckedUpdateWithoutVentaDetalleInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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
    Movimiento?: MovimientoCreateNestedManyWithoutProductoInput
    Venta?: VentaCreateNestedManyWithoutProductoInput
    VentaDetalle?: VentaDetalleCreateNestedManyWithoutProductoInput
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
    Movimiento?: MovimientoUncheckedCreateNestedManyWithoutProductoInput
    Venta?: VentaUncheckedCreateNestedManyWithoutProductoInput
    VentaDetalle?: VentaDetalleUncheckedCreateNestedManyWithoutProductoInput
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
  }

  export type ProductoCreateWithoutMovimientoInput = {
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
    Categoria: CategoriaCreateNestedOneWithoutProductoInput
    Venta?: VentaCreateNestedManyWithoutProductoInput
    VentaDetalle?: VentaDetalleCreateNestedManyWithoutProductoInput
  }

  export type ProductoUncheckedCreateWithoutMovimientoInput = {
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
    Venta?: VentaUncheckedCreateNestedManyWithoutProductoInput
    VentaDetalle?: VentaDetalleUncheckedCreateNestedManyWithoutProductoInput
  }

  export type ProductoCreateOrConnectWithoutMovimientoInput = {
    where: ProductoWhereUniqueInput
    create: XOR<ProductoCreateWithoutMovimientoInput, ProductoUncheckedCreateWithoutMovimientoInput>
  }

  export type ProductoUpsertWithoutMovimientoInput = {
    update: XOR<ProductoUpdateWithoutMovimientoInput, ProductoUncheckedUpdateWithoutMovimientoInput>
    create: XOR<ProductoCreateWithoutMovimientoInput, ProductoUncheckedCreateWithoutMovimientoInput>
    where?: ProductoWhereInput
  }

  export type ProductoUpdateToOneWithWhereWithoutMovimientoInput = {
    where?: ProductoWhereInput
    data: XOR<ProductoUpdateWithoutMovimientoInput, ProductoUncheckedUpdateWithoutMovimientoInput>
  }

  export type ProductoUpdateWithoutMovimientoInput = {
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
    Categoria?: CategoriaUpdateOneRequiredWithoutProductoNestedInput
    Venta?: VentaUpdateManyWithoutProductoNestedInput
    VentaDetalle?: VentaDetalleUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateWithoutMovimientoInput = {
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
    Venta?: VentaUncheckedUpdateManyWithoutProductoNestedInput
    VentaDetalle?: VentaDetalleUncheckedUpdateManyWithoutProductoNestedInput
  }

  export type MovimientoCreateWithoutProductoInput = {
    tipo: string
    cantidad: number
    stockAnterior: number
    stockNuevo: number
    motivo?: string | null
    documento?: string | null
    createdAt?: Date | string
    userId?: number | null
  }

  export type MovimientoUncheckedCreateWithoutProductoInput = {
    id?: number
    tipo: string
    cantidad: number
    stockAnterior: number
    stockNuevo: number
    motivo?: string | null
    documento?: string | null
    createdAt?: Date | string
    userId?: number | null
  }

  export type MovimientoCreateOrConnectWithoutProductoInput = {
    where: MovimientoWhereUniqueInput
    create: XOR<MovimientoCreateWithoutProductoInput, MovimientoUncheckedCreateWithoutProductoInput>
  }

  export type MovimientoCreateManyProductoInputEnvelope = {
    data: MovimientoCreateManyProductoInput | MovimientoCreateManyProductoInput[]
    skipDuplicates?: boolean
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

  export type VentaCreateWithoutProductoInput = {
    cliente: string
    contacto?: string | null
    cantidad: number
    precio: number
    total: number
    estado?: string
    responsable?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    VentaDetalle?: VentaDetalleCreateNestedManyWithoutVentaInput
  }

  export type VentaUncheckedCreateWithoutProductoInput = {
    id?: number
    cliente: string
    contacto?: string | null
    cantidad: number
    precio: number
    total: number
    estado?: string
    responsable?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    VentaDetalle?: VentaDetalleUncheckedCreateNestedManyWithoutVentaInput
  }

  export type VentaCreateOrConnectWithoutProductoInput = {
    where: VentaWhereUniqueInput
    create: XOR<VentaCreateWithoutProductoInput, VentaUncheckedCreateWithoutProductoInput>
  }

  export type VentaCreateManyProductoInputEnvelope = {
    data: VentaCreateManyProductoInput | VentaCreateManyProductoInput[]
    skipDuplicates?: boolean
  }

  export type VentaDetalleCreateWithoutProductoInput = {
    cantidad: number
    precio: number
    subtotal: number
    Venta: VentaCreateNestedOneWithoutVentaDetalleInput
  }

  export type VentaDetalleUncheckedCreateWithoutProductoInput = {
    id?: number
    ventaId: number
    cantidad: number
    precio: number
    subtotal: number
  }

  export type VentaDetalleCreateOrConnectWithoutProductoInput = {
    where: VentaDetalleWhereUniqueInput
    create: XOR<VentaDetalleCreateWithoutProductoInput, VentaDetalleUncheckedCreateWithoutProductoInput>
  }

  export type VentaDetalleCreateManyProductoInputEnvelope = {
    data: VentaDetalleCreateManyProductoInput | VentaDetalleCreateManyProductoInput[]
    skipDuplicates?: boolean
  }

  export type MovimientoUpsertWithWhereUniqueWithoutProductoInput = {
    where: MovimientoWhereUniqueInput
    update: XOR<MovimientoUpdateWithoutProductoInput, MovimientoUncheckedUpdateWithoutProductoInput>
    create: XOR<MovimientoCreateWithoutProductoInput, MovimientoUncheckedCreateWithoutProductoInput>
  }

  export type MovimientoUpdateWithWhereUniqueWithoutProductoInput = {
    where: MovimientoWhereUniqueInput
    data: XOR<MovimientoUpdateWithoutProductoInput, MovimientoUncheckedUpdateWithoutProductoInput>
  }

  export type MovimientoUpdateManyWithWhereWithoutProductoInput = {
    where: MovimientoScalarWhereInput
    data: XOR<MovimientoUpdateManyMutationInput, MovimientoUncheckedUpdateManyWithoutProductoInput>
  }

  export type MovimientoScalarWhereInput = {
    AND?: MovimientoScalarWhereInput | MovimientoScalarWhereInput[]
    OR?: MovimientoScalarWhereInput[]
    NOT?: MovimientoScalarWhereInput | MovimientoScalarWhereInput[]
    id?: IntFilter<"Movimiento"> | number
    tipo?: StringFilter<"Movimiento"> | string
    cantidad?: IntFilter<"Movimiento"> | number
    stockAnterior?: IntFilter<"Movimiento"> | number
    stockNuevo?: IntFilter<"Movimiento"> | number
    motivo?: StringNullableFilter<"Movimiento"> | string | null
    documento?: StringNullableFilter<"Movimiento"> | string | null
    createdAt?: DateTimeFilter<"Movimiento"> | Date | string
    productoId?: IntFilter<"Movimiento"> | number
    userId?: IntNullableFilter<"Movimiento"> | number | null
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

  export type VentaUpsertWithWhereUniqueWithoutProductoInput = {
    where: VentaWhereUniqueInput
    update: XOR<VentaUpdateWithoutProductoInput, VentaUncheckedUpdateWithoutProductoInput>
    create: XOR<VentaCreateWithoutProductoInput, VentaUncheckedCreateWithoutProductoInput>
  }

  export type VentaUpdateWithWhereUniqueWithoutProductoInput = {
    where: VentaWhereUniqueInput
    data: XOR<VentaUpdateWithoutProductoInput, VentaUncheckedUpdateWithoutProductoInput>
  }

  export type VentaUpdateManyWithWhereWithoutProductoInput = {
    where: VentaScalarWhereInput
    data: XOR<VentaUpdateManyMutationInput, VentaUncheckedUpdateManyWithoutProductoInput>
  }

  export type VentaScalarWhereInput = {
    AND?: VentaScalarWhereInput | VentaScalarWhereInput[]
    OR?: VentaScalarWhereInput[]
    NOT?: VentaScalarWhereInput | VentaScalarWhereInput[]
    id?: IntFilter<"Venta"> | number
    productoId?: IntFilter<"Venta"> | number
    cliente?: StringFilter<"Venta"> | string
    contacto?: StringNullableFilter<"Venta"> | string | null
    cantidad?: IntFilter<"Venta"> | number
    precio?: FloatFilter<"Venta"> | number
    total?: FloatFilter<"Venta"> | number
    estado?: StringFilter<"Venta"> | string
    responsable?: StringNullableFilter<"Venta"> | string | null
    fechaCierre?: DateTimeNullableFilter<"Venta"> | Date | string | null
    createdAt?: DateTimeFilter<"Venta"> | Date | string
  }

  export type VentaDetalleUpsertWithWhereUniqueWithoutProductoInput = {
    where: VentaDetalleWhereUniqueInput
    update: XOR<VentaDetalleUpdateWithoutProductoInput, VentaDetalleUncheckedUpdateWithoutProductoInput>
    create: XOR<VentaDetalleCreateWithoutProductoInput, VentaDetalleUncheckedCreateWithoutProductoInput>
  }

  export type VentaDetalleUpdateWithWhereUniqueWithoutProductoInput = {
    where: VentaDetalleWhereUniqueInput
    data: XOR<VentaDetalleUpdateWithoutProductoInput, VentaDetalleUncheckedUpdateWithoutProductoInput>
  }

  export type VentaDetalleUpdateManyWithWhereWithoutProductoInput = {
    where: VentaDetalleScalarWhereInput
    data: XOR<VentaDetalleUpdateManyMutationInput, VentaDetalleUncheckedUpdateManyWithoutProductoInput>
  }

  export type VentaDetalleScalarWhereInput = {
    AND?: VentaDetalleScalarWhereInput | VentaDetalleScalarWhereInput[]
    OR?: VentaDetalleScalarWhereInput[]
    NOT?: VentaDetalleScalarWhereInput | VentaDetalleScalarWhereInput[]
    id?: IntFilter<"VentaDetalle"> | number
    ventaId?: IntFilter<"VentaDetalle"> | number
    productoId?: IntFilter<"VentaDetalle"> | number
    cantidad?: IntFilter<"VentaDetalle"> | number
    precio?: FloatFilter<"VentaDetalle"> | number
    subtotal?: FloatFilter<"VentaDetalle"> | number
  }

  export type ProductoCreateWithoutVentaInput = {
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
    Movimiento?: MovimientoCreateNestedManyWithoutProductoInput
    Categoria: CategoriaCreateNestedOneWithoutProductoInput
    VentaDetalle?: VentaDetalleCreateNestedManyWithoutProductoInput
  }

  export type ProductoUncheckedCreateWithoutVentaInput = {
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
    Movimiento?: MovimientoUncheckedCreateNestedManyWithoutProductoInput
    VentaDetalle?: VentaDetalleUncheckedCreateNestedManyWithoutProductoInput
  }

  export type ProductoCreateOrConnectWithoutVentaInput = {
    where: ProductoWhereUniqueInput
    create: XOR<ProductoCreateWithoutVentaInput, ProductoUncheckedCreateWithoutVentaInput>
  }

  export type VentaDetalleCreateWithoutVentaInput = {
    cantidad: number
    precio: number
    subtotal: number
    Producto: ProductoCreateNestedOneWithoutVentaDetalleInput
  }

  export type VentaDetalleUncheckedCreateWithoutVentaInput = {
    id?: number
    productoId: number
    cantidad: number
    precio: number
    subtotal: number
  }

  export type VentaDetalleCreateOrConnectWithoutVentaInput = {
    where: VentaDetalleWhereUniqueInput
    create: XOR<VentaDetalleCreateWithoutVentaInput, VentaDetalleUncheckedCreateWithoutVentaInput>
  }

  export type VentaDetalleCreateManyVentaInputEnvelope = {
    data: VentaDetalleCreateManyVentaInput | VentaDetalleCreateManyVentaInput[]
    skipDuplicates?: boolean
  }

  export type ProductoUpsertWithoutVentaInput = {
    update: XOR<ProductoUpdateWithoutVentaInput, ProductoUncheckedUpdateWithoutVentaInput>
    create: XOR<ProductoCreateWithoutVentaInput, ProductoUncheckedCreateWithoutVentaInput>
    where?: ProductoWhereInput
  }

  export type ProductoUpdateToOneWithWhereWithoutVentaInput = {
    where?: ProductoWhereInput
    data: XOR<ProductoUpdateWithoutVentaInput, ProductoUncheckedUpdateWithoutVentaInput>
  }

  export type ProductoUpdateWithoutVentaInput = {
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
    Movimiento?: MovimientoUpdateManyWithoutProductoNestedInput
    Categoria?: CategoriaUpdateOneRequiredWithoutProductoNestedInput
    VentaDetalle?: VentaDetalleUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateWithoutVentaInput = {
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
    Movimiento?: MovimientoUncheckedUpdateManyWithoutProductoNestedInput
    VentaDetalle?: VentaDetalleUncheckedUpdateManyWithoutProductoNestedInput
  }

  export type VentaDetalleUpsertWithWhereUniqueWithoutVentaInput = {
    where: VentaDetalleWhereUniqueInput
    update: XOR<VentaDetalleUpdateWithoutVentaInput, VentaDetalleUncheckedUpdateWithoutVentaInput>
    create: XOR<VentaDetalleCreateWithoutVentaInput, VentaDetalleUncheckedCreateWithoutVentaInput>
  }

  export type VentaDetalleUpdateWithWhereUniqueWithoutVentaInput = {
    where: VentaDetalleWhereUniqueInput
    data: XOR<VentaDetalleUpdateWithoutVentaInput, VentaDetalleUncheckedUpdateWithoutVentaInput>
  }

  export type VentaDetalleUpdateManyWithWhereWithoutVentaInput = {
    where: VentaDetalleScalarWhereInput
    data: XOR<VentaDetalleUpdateManyMutationInput, VentaDetalleUncheckedUpdateManyWithoutVentaInput>
  }

  export type ProductoCreateWithoutVentaDetalleInput = {
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
    Movimiento?: MovimientoCreateNestedManyWithoutProductoInput
    Categoria: CategoriaCreateNestedOneWithoutProductoInput
    Venta?: VentaCreateNestedManyWithoutProductoInput
  }

  export type ProductoUncheckedCreateWithoutVentaDetalleInput = {
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
    Movimiento?: MovimientoUncheckedCreateNestedManyWithoutProductoInput
    Venta?: VentaUncheckedCreateNestedManyWithoutProductoInput
  }

  export type ProductoCreateOrConnectWithoutVentaDetalleInput = {
    where: ProductoWhereUniqueInput
    create: XOR<ProductoCreateWithoutVentaDetalleInput, ProductoUncheckedCreateWithoutVentaDetalleInput>
  }

  export type VentaCreateWithoutVentaDetalleInput = {
    cliente: string
    contacto?: string | null
    cantidad: number
    precio: number
    total: number
    estado?: string
    responsable?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
    Producto: ProductoCreateNestedOneWithoutVentaInput
  }

  export type VentaUncheckedCreateWithoutVentaDetalleInput = {
    id?: number
    productoId: number
    cliente: string
    contacto?: string | null
    cantidad: number
    precio: number
    total: number
    estado?: string
    responsable?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
  }

  export type VentaCreateOrConnectWithoutVentaDetalleInput = {
    where: VentaWhereUniqueInput
    create: XOR<VentaCreateWithoutVentaDetalleInput, VentaUncheckedCreateWithoutVentaDetalleInput>
  }

  export type ProductoUpsertWithoutVentaDetalleInput = {
    update: XOR<ProductoUpdateWithoutVentaDetalleInput, ProductoUncheckedUpdateWithoutVentaDetalleInput>
    create: XOR<ProductoCreateWithoutVentaDetalleInput, ProductoUncheckedCreateWithoutVentaDetalleInput>
    where?: ProductoWhereInput
  }

  export type ProductoUpdateToOneWithWhereWithoutVentaDetalleInput = {
    where?: ProductoWhereInput
    data: XOR<ProductoUpdateWithoutVentaDetalleInput, ProductoUncheckedUpdateWithoutVentaDetalleInput>
  }

  export type ProductoUpdateWithoutVentaDetalleInput = {
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
    Movimiento?: MovimientoUpdateManyWithoutProductoNestedInput
    Categoria?: CategoriaUpdateOneRequiredWithoutProductoNestedInput
    Venta?: VentaUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateWithoutVentaDetalleInput = {
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
    Movimiento?: MovimientoUncheckedUpdateManyWithoutProductoNestedInput
    Venta?: VentaUncheckedUpdateManyWithoutProductoNestedInput
  }

  export type VentaUpsertWithoutVentaDetalleInput = {
    update: XOR<VentaUpdateWithoutVentaDetalleInput, VentaUncheckedUpdateWithoutVentaDetalleInput>
    create: XOR<VentaCreateWithoutVentaDetalleInput, VentaUncheckedCreateWithoutVentaDetalleInput>
    where?: VentaWhereInput
  }

  export type VentaUpdateToOneWithWhereWithoutVentaDetalleInput = {
    where?: VentaWhereInput
    data: XOR<VentaUpdateWithoutVentaDetalleInput, VentaUncheckedUpdateWithoutVentaDetalleInput>
  }

  export type VentaUpdateWithoutVentaDetalleInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Producto?: ProductoUpdateOneRequiredWithoutVentaNestedInput
  }

  export type VentaUncheckedUpdateWithoutVentaDetalleInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
    Movimiento?: MovimientoUpdateManyWithoutProductoNestedInput
    Venta?: VentaUpdateManyWithoutProductoNestedInput
    VentaDetalle?: VentaDetalleUpdateManyWithoutProductoNestedInput
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
    Movimiento?: MovimientoUncheckedUpdateManyWithoutProductoNestedInput
    Venta?: VentaUncheckedUpdateManyWithoutProductoNestedInput
    VentaDetalle?: VentaDetalleUncheckedUpdateManyWithoutProductoNestedInput
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
  }

  export type MovimientoCreateManyProductoInput = {
    id?: number
    tipo: string
    cantidad: number
    stockAnterior: number
    stockNuevo: number
    motivo?: string | null
    documento?: string | null
    createdAt?: Date | string
    userId?: number | null
  }

  export type VentaCreateManyProductoInput = {
    id?: number
    cliente: string
    contacto?: string | null
    cantidad: number
    precio: number
    total: number
    estado?: string
    responsable?: string | null
    fechaCierre?: Date | string | null
    createdAt?: Date | string
  }

  export type VentaDetalleCreateManyProductoInput = {
    id?: number
    ventaId: number
    cantidad: number
    precio: number
    subtotal: number
  }

  export type MovimientoUpdateWithoutProductoInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    cantidad?: IntFieldUpdateOperationsInput | number
    stockAnterior?: IntFieldUpdateOperationsInput | number
    stockNuevo?: IntFieldUpdateOperationsInput | number
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type MovimientoUncheckedUpdateWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    cantidad?: IntFieldUpdateOperationsInput | number
    stockAnterior?: IntFieldUpdateOperationsInput | number
    stockNuevo?: IntFieldUpdateOperationsInput | number
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type MovimientoUncheckedUpdateManyWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    cantidad?: IntFieldUpdateOperationsInput | number
    stockAnterior?: IntFieldUpdateOperationsInput | number
    stockNuevo?: IntFieldUpdateOperationsInput | number
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type VentaUpdateWithoutProductoInput = {
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    VentaDetalle?: VentaDetalleUpdateManyWithoutVentaNestedInput
  }

  export type VentaUncheckedUpdateWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    VentaDetalle?: VentaDetalleUncheckedUpdateManyWithoutVentaNestedInput
  }

  export type VentaUncheckedUpdateManyWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    cliente?: StringFieldUpdateOperationsInput | string
    contacto?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    estado?: StringFieldUpdateOperationsInput | string
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCierre?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VentaDetalleUpdateWithoutProductoInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    Venta?: VentaUpdateOneRequiredWithoutVentaDetalleNestedInput
  }

  export type VentaDetalleUncheckedUpdateWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    ventaId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type VentaDetalleUncheckedUpdateManyWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    ventaId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type VentaDetalleCreateManyVentaInput = {
    id?: number
    productoId: number
    cantidad: number
    precio: number
    subtotal: number
  }

  export type VentaDetalleUpdateWithoutVentaInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    Producto?: ProductoUpdateOneRequiredWithoutVentaDetalleNestedInput
  }

  export type VentaDetalleUncheckedUpdateWithoutVentaInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type VentaDetalleUncheckedUpdateManyWithoutVentaInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precio?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
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