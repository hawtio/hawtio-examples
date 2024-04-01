import { hawtio, HawtioPlugin, helpRegistry, preferencesRegistry } from '@hawtio/react'
import { log, pluginName, pluginPath, pluginTitle } from './globals'
import help from './help.md'
import { RemotePlugin } from './RemotePlugin'
import { SamplePreferences } from './RemotePreferences'

export const plugin: HawtioPlugin = () => {
  log.info('Loading remote plugin')

  hawtio.addPlugin({
    id: pluginName,
    title: pluginTitle,
    path: pluginPath,
    order: -1,
    component: RemotePlugin,
    isActive: async () => true,
  })

  helpRegistry.add(pluginName, pluginTitle, help, 100)
  preferencesRegistry.add(pluginName, pluginTitle, SamplePreferences, 100)
}
