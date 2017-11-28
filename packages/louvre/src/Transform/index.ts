import * as File from "vinyl"
import { List } from "immutable"

export type Files = List<File>
export interface Transform { (files?: Files): Files | Promise<Files> }
export default Transform

export { default as sourceTransform } from "./source"
export { default as destTransform } from "./dest"
