import Transform from "."
import { List } from "immutable"
import * as vfs from "vinyl-fs"
import { array as getStream } from "get-stream"

function sourceTransform(globs: string | string[], options?: vfs.SrcOptions) {
  return (async (files = List()) => {
    const newFiles = await getStream(vfs.src(globs, options))
    return files.concat(newFiles)
  }) as Transform
}

export default sourceTransform
