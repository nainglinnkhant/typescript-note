// Infer should be only used in conditional types

type LooseReturnType<T> = T extends (...args: any) => infer R ? R : never
type StrictReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : never

const func = () => true
const foo = 'bar'

// FuncResultOne can be passed in any type as the generic isn't constrained to a specific type
type FuncResultOne = LooseReturnType<typeof foo>
// FuncResultTwo can't be passed in any type as the generic is constrained to the function type
type FuncResultTwo = StrictReturnType<typeof func>

type GetFromDeepObject<T> = T extends
  | {
      a: {
        b: {
          c: infer C
        }
      }
    }
  | {
      a: {
        c: infer C
      }
    }
  ? C
  : never

type ObjectTypeOne = GetFromDeepObject<{
  a: {
    b: {
      c: number
    }
  }
}>
type ObjectTypeTwo = GetFromDeepObject<{
  a: {
    c: number
  }
}>
// ObjectTypeThree doesn't infer the type of c as the object pattern passed in doesn't match with the constrained one
type ObjectTypeThree = GetFromDeepObject<{
  c: number
}>
