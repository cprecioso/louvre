import _Pipeline from "./Pipeline"
import _louvre from "./louvre"

function louvre(): typeof _louvre {
  return _louvre.apply(null, arguments)
}

namespace louvre {
  export const Pipeline = _Pipeline
  export type Pipeline = _Pipeline
}

export = louvre
