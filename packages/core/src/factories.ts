import Pipeline from "./Pipeline"
export const merge: typeof Pipeline.merge = Pipeline.merge.bind(Pipeline)
export const empty: typeof Pipeline.empty = Pipeline.empty.bind(Pipeline)
export const src: typeof Pipeline.src = Pipeline.src.bind(Pipeline)
