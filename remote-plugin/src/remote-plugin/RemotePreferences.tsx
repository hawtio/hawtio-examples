import { CardBody, Content } from '@patternfly/react-core'
import React from 'react'
import { pluginTitle } from './globals'

export const SamplePreferences: React.FunctionComponent = () => {
  return (
    <CardBody>
      <Content component='h2'>{pluginTitle}</Content>
      <Content component='p'>Preferences view for the Remote plugin example.</Content>
    </CardBody>
  )
}
