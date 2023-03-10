import { Post } from '../types'

// Generic is a type argument
// Generic Type
type GenericType<T> = {
  data: T
}
type Example = GenericType<number>
const example: Example = { data: 12 }

// Generic Function
const fetchRequest = async <T>(): Promise<T> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  return res.json()
}
const callFetchRequest = async () => {
  const posts = await fetchRequest<Post[]>()
}

// Generic can also take the type of argument and infer it to the result
// We don't need to know the type of object passed in to infer it to the result. Genric will do it for us.
const addIdToObject = <T>(obj: T) => {
  return {
    id: '12',
    ...obj,
  }
}
const object = addIdToObject({ firstName: 'John', lastName: 'Doe' })

// <T extends specific type> syntax can be used to constrain T to that specific type
type GetPromiseReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>
// The below type gets the resolved value of an async function
type Result = GetPromiseReturnType<() => Promise<{ firstName: 'John'; lastName: 'Doe' }>>

// We should always constrain generic type with 'extends'
const getKeyWithHighestValue = <TObj extends Record<string, number>>(
  obj: TObj
): {
  key: keyof TObj
  value: number
} => {
  const keys = Object.keys(obj) as (keyof TObj)[]

  let highestKey = keys[0]
  let highestValue = obj[highestKey]

  keys.forEach(key => {
    if (obj[key] > highestValue) {
      highestKey = key
      highestValue = obj[key]
    }
  })

  return {
    key: highestKey,
    value: highestValue,
  }
}
const highestKey = getKeyWithHighestValue({ a: 1, b: 2, c: 3 })

// It is fine to use type casting in the return value of a function
const getObjectKeys = <TObj extends {}>(obj: TObj) => {
  return Object.keys(obj) as (keyof TObj)[]
}
const keys = getObjectKeys({ name: 'John', age: 14 })

// Another magic of generic constraints. 'value' knows the exact type 'getValue' function will return.
const getValue = <TObj, TKey extends keyof TObj>(obj: TObj, key: TKey) => {
  return obj[key]
}
const value = getValue({ a: 1, b: 'string', c: true }, 'a')

// Generics can be given default values like we give default values to the parameters of a function
const createSet = <T = string>() => {
  return new Set<T>()
}
const numberSet = createSet<number>()
const stringSet = createSet()

// How to avoid using 'any' in utility functions using generics
const groupBy = <TObj extends Record<string, unknown>, TKey extends keyof TObj>(
  arr: TObj[],
  key: TKey
) => {
  const result = {} as Record<TObj[TKey] & PropertyKey, TObj[]>

  arr.forEach(item => {
    const groupKey = item[key] as TObj[TKey] & PropertyKey
    if (result[groupKey]) {
      result[groupKey].push(item)
    } else {
      result[groupKey] = [item]
    }
  })

  return result
}
const users = [
  { name: 'John', age: 20 },
  { name: 'Dave', age: 30 },
]
console.log(groupBy(users, 'age'))
