import Transform from "."
import * as File from "vinyl"
import * as vfs from "vinyl-fs"
import * as most from "most"
import { toObservable } from "../stream-helpers"

function sourceTransform(globs: string | string[], options?: vfs.SrcOptions) {
  const t: Transform = files => {
    const newFiles = toObservable<File>(vfs.src(globs, options))
    return most.merge(files, newFiles)
  }
  return t
}

export default sourceTransform
