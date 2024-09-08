type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

type RemoveByKey<TObj extends {}, TArr extends (keyof TObj)[]> = Omit<TObj, TArr[number]>

const removeKeys = <TObj extends {}, TArr extends (keyof TObj)[]>(
  obj: TObj,
  keys: TArr
) => {
  const objEntries = Object.entries(obj) as Entries<TObj>
  const filteredObjArrs = objEntries.filter(objEntry => !keys.includes(objEntry[0]))
  return Object.fromEntries(filteredObjArrs) as RemoveByKey<TObj, TArr>
}
const removedKeys = removeKeys({ a: 1, b: 2, c: 3 }, ["a", "b"])
console.log(removedKeys.c)
