import Transform from "."
import * as vfs from "vinyl-fs"
import * as most from "most"
import { fromObservable } from "../stream-helpers"

function destTransform(folder: string, options?: vfs.DestOptions) {
  const f: Transform = files => {
    const [observable, stream] = fromObservable(files)
    stream.pipe(vfs.dest(folder, options))
    return observable
  }
  return f
}

export default destTransform
