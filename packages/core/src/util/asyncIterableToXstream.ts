import xs, { Listener, Producer, Stream } from "xstream"

export const asyncIterableToXstream = <T>(
  iterable: AsyncIterable<T>
): Stream<T> => xs.create(new AsyncIterableProducer<T>(iterable))

class AsyncIterableProducer<T> implements Producer<T> {
  constructor(private readonly _iterable: AsyncIterable<T>) {}

  isOn = false

  async start(l: Listener<T>) {
    this.isOn = true
    try {
      for await (const item of this._iterable) {
        if (!this.isOn) return
        l.next(item)
      }
      if (!this.isOn) return
      l.complete()
    } catch (err) {
      if (!this.isOn) return
      l.error(err)
    }
  }

  stop() {
    this.isOn = false
  }
}
