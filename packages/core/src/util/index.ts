export * from "./asAsyncGenerator"
export * from "./asyncIterableToXstream"
export * from "./nodeStreamsToXs"

/**
 * A value or a Promise of it
 */
export type PoV<V> = Promise<V> | V
export const unPoV = <V>(v: PoV<V>): Promise<V> => Promise.resolve(v)

/**
 * A value or an array of it
 */
export type AoV<V> = V[] | V
export const unAoV = <V>(v: AoV<V>): V[] => (Array.isArray(v) ? v : [v])
