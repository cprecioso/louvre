export const isIterator = (
  result: any
): result is Iterator<any> | AsyncIterator<any> =>
  result && result.next && typeof result.next === "function"

export const isIterable = (result: any): result is Iterable<any> =>
  result &&
  result[Symbol.iterator] &&
  typeof result[Symbol.iterator] === "function"

export declare namespace asAsyncGenerator {
  export type AcceptableResults<T> =
    | T
    | Iterable<T>
    | Promise<T | Iterable<T>>
    | Iterator<T>
    | AsyncIterator<T>
}

export async function* asAsyncGenerator<T>(
  result: asAsyncGenerator.AcceptableResults<T>
): AsyncIterableIterator<T> {
  if (isIterator(result)) {
    while (true) {
      const { done, value } = await Promise.resolve(result.next())
      if (done) {
        return
      } else {
        yield value
      }
    }
  } else {
    const awaitedResult = await Promise.resolve(result)
    if (isIterable(awaitedResult)) {
      for (const item of awaitedResult) {
        yield item
      }
    } else {
      yield awaitedResult
    }
  }
}
