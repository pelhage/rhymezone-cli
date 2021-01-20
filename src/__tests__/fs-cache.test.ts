import { makeCache } from '../core/cache'

describe('local cache', () => {
  describe('make cache', () => {
    it('instantiates an object to access the cache', () => {
      const cacheInstance = makeCache()
      expect(cacheInstance).toHaveProperty('getRhyme')
      expect(cacheInstance).toHaveProperty('get')
      expect(cacheInstance).toHaveProperty('set')
    })
    it('can instantiate the cache with pre-existing data', () => {
      const cacheInstance = makeCache({ foo: 'bar' })
      const actual = cacheInstance.get('foo')
      const expected = 'bar'

      expect(actual).toBe(expected)
    })
  })
  describe('setting values', () => {
    it('sets values for the cache', () => {
      const cacheInstance = makeCache()
      cacheInstance.set('foo', 'bar')
      const actual = cacheInstance.get('foo')
      const expected = 'bar'

      expect(actual).toBe(expected)
    })
    it('should throw if the key is not a string', () => {
      const cacheInstance = makeCache()
      expect(() => cacheInstance.set(55, 'bar')).toThrow()
      expect(() => cacheInstance.set(undefined, 'bar')).toThrow()
      expect(() => cacheInstance.set(null, 'bar')).toThrow()
      expect(() => cacheInstance.set(NaN, 'bar')).toThrow()
      expect(() => cacheInstance.set({}, 'bar')).toThrow()
      expect(() => cacheInstance.set([], 'bar')).toThrow()
      expect(() => cacheInstance.set(() => {}, 'bar')).toThrow()
    })
  })
  describe('getting values', () => {
    it('reads values from the cache', () => {
      const cacheInstance = makeCache({ foo: 'baz' })
      const actual = cacheInstance.get('foo')
      const expected = 'baz'

      expect(actual).toBe(expected)
    })
    it('returns undefined for values not in the cache', () => {
      const cacheInstance = makeCache()
      const actual = cacheInstance.get('foo')
      const expected = undefined
      expect(actual).toBe(expected)
    })
    it('should throw if the key is not a string', () => {
      const cacheInstance = makeCache()
      expect(() => cacheInstance.get(55)).toThrow()
      expect(() => cacheInstance.get(undefined)).toThrow()
      expect(() => cacheInstance.get(null)).toThrow()
      expect(() => cacheInstance.get(NaN)).toThrow()
      expect(() => cacheInstance.get({})).toThrow()
      expect(() => cacheInstance.get([])).toThrow()
      expect(() => cacheInstance.get(() => {})).toThrow()
    })
  })
})
