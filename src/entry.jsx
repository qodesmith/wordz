import './styles/styles.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import App from 'components/App'

/*
  https://reactjs.org/docs/concurrent-mode-reference.html
  Fancy React Concurrent Mode!
*/
ReactDOM.createRoot(document.querySelector('#app')).render(<App/>)
