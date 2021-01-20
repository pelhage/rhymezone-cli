export const makeCache = (cache: Record<string, string> = {}) => {
  return {
    get(key) {
      if (typeof key !== 'string') {
        throw Error(`Key ${key} must be a string`)
      }
      if (cache[key]) {
        return cache[key]
      }
    },
    set(key, value) {
      if (typeof key !== 'string') {
        throw Error()
      }
      cache[key] = value
    },
    getRhyme() {
      return 'hi'
    }
  }
}
