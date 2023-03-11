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

// The approach to make an argument optional based on another argument that was passed in
type AuthEvent =
  | {
      type: 'LOG_IN'
      payload: {
        userId: number
      }
    }
  | {
      type: 'SIGN_OUT'
    }

const sendEvent = <Type extends AuthEvent['type']>(
  ...args: Extract<AuthEvent, { type: Type }> extends { payload: infer TPayload }
    ? [type: Type, payload: TPayload]
    : [type: Type]
) => {}
sendEvent('LOG_IN', { userId: 1 })
sendEvent('SIGN_OUT')

// Another usage of infer combining with template literal
interface ApiData {
  'maps:longitude': string
  'maps:latitude': string
  coords: number[]
}
type RemoveMapsFromObj<TObj> = {
  [TKey in keyof TObj as RemoveMaps<TKey>]: TObj[TKey]
}
type RemoveMaps<T> = T extends `maps:${infer WithoutMaps}` ? WithoutMaps : T
type DesiredShape = RemoveMapsFromObj<ApiData>
