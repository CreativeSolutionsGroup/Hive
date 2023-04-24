// Removes keys `keys` from object `t`. `keys` must be a subset of `T`
function exclude<T, Key extends keyof T>(t: T,
  keys: Key[]): Omit<T, Key> {
  for (let key of keys) {
    delete t[key];
  }
  return t;
}