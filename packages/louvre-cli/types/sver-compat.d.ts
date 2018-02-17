declare module "sver-compat" {
  export class Semver {
    static isValid(version: string): boolean
    static compare(v1: Semver | string, v2: Semver | string): 1 | -1 | 0

    constructor(version: string)

    major: number
    minor: number
    patch: number
    pre: string[]
    build: string
    tag: string

    gt(otherVersion: Semver | string): boolean
    lt(otherVersion: Semver | string): boolean
    eq(otherVersion: Semver | string): boolean
    matches(range: SemverRange | string, unstable?: boolean): boolean
    toString(): string
  }

  export class SemverRange {
    static match(
      range: SemverRange | string,
      version: Semver | string,
      unstable?: boolean
    ): boolean
    static isValid(range: string): boolean
    static compare(
      r1: SemverRange | string,
      r2: SemverRange | string
    ): 1 | -1 | 0

    constructor(range: string)

    type: "wildcard" | "major" | "stable" | "exact"
    version: Semver
    isExact: boolean
    isStable: boolean
    isMajor: boolean
    isWildcard: boolean

    gt(otherRange: SemverRange | string): boolean
    lt(otherRange: SemverRange | string): boolean
    eq(otherRange: SemverRange | string): boolean
    has(version: Semver | string, unstable?: boolean): boolean
    contains(otherRange: SemverRange | string): boolean
    intersect(otherRange: SemverRange | string): SemverRange | undefined
    bestMatch(
      versions: (Semver | string)[],
      unstable?: boolean
    ): Semver | undefined
    toString(): string
  }
}

declare module "sver-compat/convert-range" {
  import { SemverRange } from "sver-compat"

  function convertRange(nodeSemver: string): SemverRange
  export = convertRange
}
