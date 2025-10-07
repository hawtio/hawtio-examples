import { HawtioInitialization } from '@hawtio/react/init'
import React from 'react'
import ReactDOM from 'react-dom/client'

/*
const App = () => (
  <div>
    <h1>Hawtio Example - Remote Plugin</h1>
    <p>This is a Hawtio plugin example.</p>
  </div>
)
*/

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<HawtioInitialization verbose={true} />)

import('@hawtio/react').then(async ({ hawtio, connect, jmx }) => {

  // Register essential plugins
  connect()
  jmx()

  // Register the plugin under development
  import('./remote-plugin').then(({ plugin }) => plugin())

  // Bootstrap Hawtio
  await hawtio.bootstrap()
  const { Hawtio } = await import('@hawtio/react/ui')
  root.render(
    <React.StrictMode>
      <Hawtio />
    </React.StrictMode>,
  )
})
