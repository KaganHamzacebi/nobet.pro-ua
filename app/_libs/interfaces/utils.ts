/**
 * @Param: T - Key of the K
 * @Param K - Entity
 * Returns the value of a given key of the Entity
 */
export type TypeOfKey<T extends keyof K, K extends Record<string, any>> = K[T];

export type KeyOf<T> = keyof T;