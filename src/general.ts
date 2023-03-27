// TypeScript iterates through each member of a union type when it's doing a the conditional type checking and this is called distributivity
type Letters = 'a' | 'b' | 'c'
type RemoveC<T> = T extends 'c' ? never : T
type LettersWithoutC = RemoveC<Letters>

// The below A type doesn't extract 'a' from the union type because we didn't use a type helper to make distributivity works
type Union = 'a' | 'b' | 'c'
type A = 'a' | 'b' | 'c' extends 'a' ? 'a' : never

// TypeScript merges the members of union types and in the case below, other string type members will be overriden by the 'string' type
// To prevent it, we can use the following approach
type LooseAutocomplete<T extends string> = T | Omit<string, T>
type Sizes = 'sm' | 'xs'
type SizeAutocomplete = LooseAutocomplete<Sizes>
// Now we can use other strings that were not included in the union type while we still get the autocomplete
const size: SizeAutocomplete = 'md'

// Function overloads define the possible patterns of a function
// Function overloads
function fn(x: string): void
function fn(x: number): void
function fn(x: any) {
  console.log(x)
}
fn('21')
fn(21)

// Advanced function overloads
function compose<Input, FirstArg>(
  func: (input: Input) => FirstArg
): (input: Input) => FirstArg

function compose<Input, FirstArg, SecondArg>(
  func: (input: Input) => FirstArg,
  func2: (input: FirstArg) => SecondArg
): (input: FirstArg) => SecondArg

function compose<Input, FirstArg, SecondArg, ThirdArg>(
  func: (input: Input) => FirstArg,
  func2: (input: FirstArg) => SecondArg,
  func3: (input: SecondArg) => ThirdArg
): (input: SecondArg) => ThirdArg

function compose(...args: any[]) {
  return {} as any
}
const addOne = (a: number) => a + 1
const numToString = (a: number) => a.toString()
const stringToNum = (a: string) => parseInt(a)
const composedFunc = compose(addOne, numToString, stringToNum)

// How to get a union type which includes the values of an object or array type
interface ColorVariants {
  primary: 'blue'
  secondary: 'red'
  tertiary: 'green'
}
type PrimaryColor = ColorVariants['primary']
type NonPrimaryColor = ColorVariants['secondary' | 'tertiary']
type EveryColor = ColorVariants[keyof ColorVariants]

type LettersArray = ['a', 'b', 'c']
type AOrB = LettersArray[0 | 1]
type Letter = LettersArray[number]

interface UserRoleConfig {
  user: ['view', 'create', 'update']
  superAdmin: ['view', 'create', 'update', 'delete']
}
type Role = keyof UserRoleConfig
type RoleActions = UserRoleConfig[keyof UserRoleConfig][number]

// The type of import can be taken as follow
type ActionModule = typeof import('./actions')
type Actions = ActionModule[keyof ActionModule]

// How to exclude a certain type from an array
type ExcludeTypeArr<TArr extends any[], TExclude> = Exclude<TArr[number], TExclude>[]
const arr = [1, 2, 3, 'string', true]
type ExcludedArr = ExcludeTypeArr<typeof arr, string>
