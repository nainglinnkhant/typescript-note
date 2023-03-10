import { Post } from '../types'

// Parameters
type FuncType = (name: string, age: number) => void
const logArgs: FuncType = (name, age) => {
  console.log(name, age)
}
const arr: Parameters<FuncType> = ['John', 20]

// Awaited is used to get resolved values of Promise<>
const getPosts = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts: Awaited<Promise<Post[]>> = await res.json()
}

// We can extract one specific type of a union type using this syntax
type Color = Extract<
  { type: 'rgb'; value: string } | { type: 'hsl'; value: string },
  { type: 'rgb' }
>
