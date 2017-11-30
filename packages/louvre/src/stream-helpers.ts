import * as most from "most"
import { PassThrough } from "stream"

export function toObservable<T>(stream: NodeJS.ReadableStream): most.Stream<T> {
  return (
    most.fromEvent<T>("data", stream)
    .merge(most.fromEvent<any>("error", stream).take(1).flatMap(err => most.throwError(err)))
    .until(most.fromEvent<void>("end", stream).take(1))
  )
}

export function fromObservable<T>(observable: most.Stream<T>) {
  const stream = new PassThrough({ objectMode: true })
  const newObservable =
    observable
    .tap(data => { stream.write(data) })
  return [newObservable, stream] as [most.Stream<T>, NodeJS.ReadableStream]
}
