import API from './core/api'
import CLI from './rhymer-cli'
import { makeCache } from './core/cache'

type IAPI = typeof API
const Cache = makeCache()
type ICache = typeof Cache
// this can probably be simplified further
// by merging rhymer-cli itself
const rhymer = ({
  process,
  API,
  Cache
}: {
  process: any
  API: IAPI
  Cache: ICache
}) => {
  const cliInstance = CLI({ process })
  const userInput = cliInstance.getUserInput()
  const cachedValue = Cache.get(JSON.stringify(userInput))
  if (cachedValue) {
    const parsedCacheValue = JSON.parse(cachedValue)
    return cliInstance.logWordSearchResults(parsedCacheValue)
  }

  return API.fetchWords(userInput)
    .then(cliInstance.logWordSearchResults)
    .catch(console.error)
}

export default () => rhymer({ process, API, Cache })

/* for unit testing purposes */
const __main = rhymer
export { __main }
