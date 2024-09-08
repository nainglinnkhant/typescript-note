import { Post } from "../types"

// Parameters
type FuncType = (name: string, age: number) => void
const logArgs: FuncType = (name, age) => {
  console.log(name, age)
}
const arr: Parameters<FuncType> = ["John", 20]

// Awaited is used to get resolved values of Promise<>
const getPosts = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts: Awaited<Promise<Post[]>> = await res.json()
}

// We can extract one specific type of a union type using this syntax
type Color = Extract<
  { type: "rgb"; value: string } | { type: "hsl"; value: string },
  { type: "rgb" }
>

// Deep Partial
type DeepPartial<Thing> = Thing extends Function
  ? Thing
  : Thing extends Array<infer InferredArrayMember>
  ? DeepPartialArray<InferredArrayMember>
  : Thing extends object
  ? DeepPartialObject<Thing>
  : Thing | undefined

interface DeepPartialArray<Thing> extends Array<DeepPartial<Thing>> {}

type DeepPartialObject<Thing> = {
  [Key in keyof Thing]?: DeepPartial<Thing[Key]>
}

interface SocialPost {
  id: string
  comments: { value: string }[]
  meta: {
    name: string
    description: string
  }
}
// In the case below, we don't need to specify the 'description' prop anymore whereas we have to if we used the original Partial
const socialPost: DeepPartial<SocialPost> = {
  id: "12",
  meta: {
    name: "Foo",
  },
}

// Development helper type that lets you see properties of a type
type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type Spread<T1, T2> = T2 & Omit<T1, keyof T2>

type StrictOmit<T, K extends keyof T> = Omit<T, K>

type AnyStringExceptError<T> = T extends "error" ? never : T

function logString<T extends string>(str: AnyStringExceptError<T>) {
  console.log(str)
}
// logString('error')
