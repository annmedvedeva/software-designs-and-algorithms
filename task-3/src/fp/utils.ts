import { Maybe, none, some } from "./maybe";

export const constant = <A>(a: A) => () => a

/**
 * Performs left-to-right function composition
 */
export function flow<A, B, C>(fa: (a: A) => B, fb: (b: B) => C): (a: A) => C;
export function flow<A, B, C, D>(fa: (a: A) => B, fb: (b: B) => C, fc: (c: C) => D): (a: A) => D;
export function flow<A, B, C, D, E>(fa: (a: A) => B, fb: (b: B) => C, fc: (c: C) => D, fd: (d: D) => E): (a: A) => E;
export function flow(...fns: Array<(...args: Array<any>) => any>) {
    return (a: any) => fns.reduce(
        (acc, fn) => fn(acc),
        a,
    )
}

/**
 * Pipes the value into the pipeline of functions
 * Handy for automatic data typing
 * pipe(5, (a) => a*2, (b) => b+1) === 11
 */
export function pipe<A, B>(a: A, fa: (a: A) => B): B;
export function pipe<A, B, C>(a: A, fa: (ab: A) => B, fb: (bc: B) => C): C;
export function pipe<A, B, C, D>(a: A, fa: (ab: A) => B, fb: (bc: B) => C, d: (cd: C) => D): D;
export function pipe<A, B, C, D, E>(a: A, fa: (ab: A) => B, fb: (bc: B) => C, d: (cd: C) => D, e: (de: D) => E): E;
export function pipe(a: any, ...fns: Array<(...args: Array<any>) => any>) {
    return fns.reduce(
        (acc, fn) => fn(acc),
        a,
    )
}

export type Predicate<A> = (a: A) => boolean
/**
 * High-order function for pattern matching
 * Each parameter is a tuple [predicate, fn]
 * Returns a function, by passing some value to which, this value would be passed to predicates left-to-right
 * and if the predicate returns "true" - value would be passed to the "fn"
 *
 * See examples in the tests
 */
export const matcher = <A, R>(...predicates: Array<[Predicate<A>, (a: A) => R]>) => (a: A) => {
    let i = 0;
    predicates.some(([predicate]) => {
        if (predicate(a)) {
            return true
        }
        i++
        return false
    })
    return predicates[i][1](a)
}

/**
 * Returns the property of the object
 * If there is no such property, return none
 *
 * @example
 * const getAge = prop('age')
 * expect(getAge({ age: 10 })).toStrictEqual(some(10))
 */
export const prop = <V extends Record<string, unknown>, K extends keyof V>(key: K) => (obj: V): Maybe<V[K]> => key in obj ? some(obj[key]) : none
