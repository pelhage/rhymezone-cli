import chalk from 'chalk'

function logger() {
  const wordStyler = {
    weak: chalk.dim,
    normal: chalk.blue,
    strong: chalk.blue.bold
  }

  const sortBySyllables = data =>
    data.sort().sort((a, b) => a.numSyllables - b.numSyllables)

  const logWordSearchResults = (data: { word: string; score: number }[]) => {
    const styleWordByScore = ({ word, score }) => {
      if (score > 3000) {
        return wordStyler.strong(word)
      } else if (score > 2000) {
        return wordStyler.normal(word)
      }
      return wordStyler.weak(word)
    }

    const prettyData = sortBySyllables(data)
      .map(styleWordByScore)
      .join(' ')

    console.log(prettyData)
  }

  return {
    wordStyler,
    logWordSearchResults
  }
}

export default logger()
