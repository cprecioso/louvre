import { Writable } from "stream"
import xs, { Listener, Stream } from "xstream"
import fromEvent from "xstream/extra/fromEvent"

export const writableStreamToListener = <T = any>(
  nodeStream: Writable
): Listener<T> => ({
  next: file => nodeStream.write(file),
  error: err => nodeStream.destroy(err),
  complete: () => nodeStream.end()
})

export const readableStreamToStream = <T = any>(
  nodeStream: NodeJS.ReadableStream
): Stream<T> =>
  xs
    .merge(
      fromEvent<T>(nodeStream, "data"),
      fromEvent<unknown>(nodeStream, "error").map(err => {
        throw err
      })
    )
    .endWhen(fromEvent<undefined>(nodeStream, "end"))
