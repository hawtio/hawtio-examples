import { Hawtio, connect, hawtio, jmx } from '@hawtio/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { plugin } from './remote-plugin'

/*
const App = () => (
  <div>
    <h1>Hawtio Example - Remote Plugin</h1>
    <p>This is a Hawtio plugin example.</p>
  </div>
)
*/

// Register essential plugins
connect()
jmx()

// Register the plugin under development
plugin()

// Bootstrap Hawtio
hawtio.bootstrap()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Hawtio />
  </React.StrictMode>,
)
