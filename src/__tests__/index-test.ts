import * as nock from 'nock'
import { __main } from '../index'
import API from '../core/api'

describe('rhymer CLI', () => {
  const originalLog = console.log
  const originalProcess = process
  let consoleOutput = []
  const mockedLog = output => {
    consoleOutput.push(output)
  }
  const Cache = {
    get: jest.fn()
  }
  let mockedProcess = {
    argv: [],
    exit: jest.fn()
  }
  beforeEach(() => {
    consoleOutput = []
    mockedProcess = {
      argv: originalProcess.argv.slice(),
      exit: jest.fn()
    }
    console.log = mockedLog
  })
  afterEach(() => {
    consoleOutput = []
    console.log = originalLog
  })
  describe('integration test', () => {
    it('should log words that rhyme with cat to the console', async () => {
      mockedProcess.argv.push('--rhyme', 'cat')
      await __main({ process: mockedProcess, API, Cache })
      expect(consoleOutput).toMatchSnapshot()
    })
    it('should log words that nearly rhyme with cat to the console', async () => {
      mockedProcess.argv.push('--nearRhyme', 'cat')
      await __main({ process: mockedProcess, API, Cache })
      expect(consoleOutput).toMatchSnapshot()
    })
  })
  describe('mocked API', () => {
    it('should log words that rhyme with cat to the console', async () => {
      // nock.activate()
      mockedProcess.argv.push('--rhyme', 'cat')
      const scope = nock('https://api.datamuse.com')
        .get('/words')
        .query({ rel_rhy: 'cat' })
        .reply(200, [
          { word: 'at', score: 5475, numSyllables: 1 },
          { word: 'caveat', score: 4418, numSyllables: 3 },
          { word: 'that', score: 3776, numSyllables: 1 },
          { word: 'hat', score: 3092, numSyllables: 1 },
          { word: 'rat', score: 2723, numSyllables: 1 }
        ])
      await __main({ process: mockedProcess, API, Cache })
      nock.restore()
      expect(consoleOutput).toMatchSnapshot()
    })
    describe('caching', () => {
      it('should check the user cache before making requests', () => {
        expect(Cache.get).toHaveBeenCalled()
      })
      it('should return a cached value if it exists in the cache', async () => {
        mockedProcess.argv.push('--nearRhyme', 'cash')
        const scope = nock('https://api.datamuse.com')
          .get('/words')
          .query({ rel_nry: 'cash' })
          .reply(200, [
            { word: 'bash', score: 5475, numSyllables: 1 },
            { word: 'stash', score: 4418, numSyllables: 1 },
            { word: 'slash', score: 3776, numSyllables: 1 }
          ])
        Cache.get.mockReturnValueOnce([{ word: 'cache', score: 4000 }])
        await __main({ process: mockedProcess, API, Cache })
        nock.restore()
        expect(consoleOutput).toMatchSnapshot('cache')
      })
      it('should not return a cached value if it does not exist in the cache', async () => {
        mockedProcess.argv.push('--nearRhyme', 'cash')
        const scope = nock('https://api.datamuse.com')
          .get('/words')
          .query({ rel_nry: 'cash' })
          .reply(200, [
            { word: 'bash', score: 5475, numSyllables: 1 },
            { word: 'stash', score: 4418, numSyllables: 1 },
            { word: 'slash', score: 3776, numSyllables: 1 }
          ])
        Cache.get.mockReturnValueOnce('')
        await __main({ process: mockedProcess, API, Cache })
        nock.restore()
        expect(consoleOutput).not.toContain('cache')
      })
    })
  })
  describe('help', () => {
    // SKIP test because process.exit gets called and hangs
    it.skip('should have a help command', async () => {
      mockedProcess.argv.push('--help')
      await __main({ process: mockedProcess, API, Cache })

      expect(consoleOutput).toMatchSnapshot()
    })
  })
})
