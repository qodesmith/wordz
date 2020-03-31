import React, { useState, useEffect } from 'react'
import { createWordTree } from 'helpers'
import allWords from '../../all-words.json'

const english = Object.keys(allWords).reduce((acc, letter) => {
  const list = allWords[letter]
  createWordTree(list, acc)
  return acc
}, {})

function getListOfWords(searchTerm) {
  return searchTerm.split('').reduce((acc, letter, i) => {
    if (!acc || !acc[letter]) return null
    if (i === searchTerm.length - 1) {
      return acc[letter].words
    } else {
      return acc[letter]
    }
  }, english)
}


const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentList, setCurrentList] = useState([])

  useEffect(() => {
    let list
    if (searchTerm) list = getListOfWords(searchTerm)
    setCurrentList(list || [])
  }, [searchTerm])

  return (
    <div className="h-100 pa5 df flex-col">
      <h1 className="pv5 mv0 mha">Search For A Word</h1>

      <input
        className="input-search mha"
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="search-results mt5 overflow-y-a pa2 mha">
        {
          currentList.length === 0 ? 'No results.' : (
            currentList.map(word => <div key={word}>{word}</div>)
          )
        }
      </div>
    </div>
  )
}

export default App
