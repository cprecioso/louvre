import * as File from "vinyl"
import { Stream } from "most"

export type Files = Stream<File>
export interface Transform { (files: Files): Files }
export default Transform

export { default as sourceTransform } from "./source"
export { default as destTransform } from "./dest"
