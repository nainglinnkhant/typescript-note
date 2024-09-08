import { Post } from "./types"

// Generic is a type argument
// Generic Type
type GenericType<T> = {
  data: T
}
type Example = GenericType<number>
const example: Example = { data: 12 }

// Generic Function
const fetchRequest = async <T>(): Promise<T> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  return res.json()
}
const callFetchRequest = async () => {
  const posts = await fetchRequest<Post[]>()
}

// Generic can also take the type of argument and infer it to the result
// We don't need to know the type of object passed in to infer it to the result. Genric will do it for us.
const addIdToObject = <T>(obj: T) => {
  return {
    id: "12",
    ...obj,
  }
}
const object = addIdToObject({ firstName: "John", lastName: "Doe" })

// <T extends specific type> syntax can be used to constrain T to that specific type
type GetPromiseReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>
// The below type gets the resolved value of an async function
type Result = GetPromiseReturnType<() => Promise<{ firstName: "John"; lastName: "Doe" }>>

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

// Another usage of generic constraint
const getDeepValue = <
  TObj,
  TFirstKey extends keyof TObj,
  TSecondKey extends keyof TObj[TFirstKey]
>(
  obj: TObj,
  firstKey: TFirstKey,
  secondKey: TSecondKey
) => {
  return {} as TObj[TFirstKey][TSecondKey]
}

const deepObject = {
  foo: {
    a: true,
    b: 1,
  },
  bar: {
    c: "cool",
    d: 2,
  },
}
const deepValue = getDeepValue(deepObject, "foo", "a")

// It is fine to use type casting in the return value of a function
const getObjectKeys = <TObj extends {}>(obj: TObj) => {
  return Object.keys(obj) as (keyof TObj)[]
}
const keys = getObjectKeys({ name: "John", age: 14 })

// Another magic of generic constraints. 'value' knows the exact type 'getValue' function will return.
const getValue = <TObj, TKey extends keyof TObj>(obj: TObj, key: TKey) => {
  return obj[key]
}
const value = getValue({ a: 1, b: "string", c: true }, "a")

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
  { name: "John", age: 20 },
  { name: "Dave", age: 30 },
]
console.log(groupBy(users, "age"))

// In this case below, generic is inferred from the argument and conditional type is used for the return value
interface Human {
  firstname: string
  lastname: string
}
interface Animal {
  name: string
}
type HumanOrAnimal<T extends Human | Animal> = T extends Human
  ? { humanName: string }
  : { animalName: string }

const getDisplayName = <T extends Human | Animal>(item: T): HumanOrAnimal<T> => {
  if ("name" in item) {
    return { animalName: item.name } as HumanOrAnimal<T>
  } else {
    return {
      humanName: `${item.firstname} ${item.lastname}`,
    } as HumanOrAnimal<T>
  }
}

const human = getDisplayName({ firstname: "John", lastname: "Doe" })
const dog = getDisplayName({ name: "Brownie" })

// Generics in a function are passed to another functions that were returned from that function
const makeKeyRemover =
  <TKey extends string>(arr: TKey[]) =>
  <TObj>(obj: TObj): Omit<TObj, TKey> => {
    return {} as any
  }
const keyRemover = makeKeyRemover(["a", "b"])
const newObj = keyRemover({ a: 1, b: 2, c: 3 })

// Keys will be a union type and it will include all keys of Obj
type Obj = {
  a: "a"
  a2: "a2"
  a3: "a3"
  b: "b"
  b1: "b1"
  b2: "b2"
}
type Keys = keyof Obj

// KeysStartingWithA will be a union type and it will include all keys of Obj starting with 'a'
type KeysStartingWithA = Extract<Keys, `a${string}`>

// The below syntax can be used to iterate through each member of a union type
// In the case below, we gave the private generic _ExtractedKeys a default value to avoid DRY
type ValuesOfKeysStartingWithA<
  TObj,
  _ExtractedKeys extends keyof TObj = Extract<keyof TObj, `a${string}`>
> = {
  [K in _ExtractedKeys]: TObj[K]
}[_ExtractedKeys]

type Values = ValuesOfKeysStartingWithA<Obj>

// We can type cast an array or object as const to make the literal value is inferred and the value is immutable
const contributors = ["Anderson", "Lee", "Mike"] as const
