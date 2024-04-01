import { CardBody, Text, TextContent } from '@patternfly/react-core'
import React from 'react'
import { pluginTitle } from './globals'

export const SamplePreferences: React.FunctionComponent = () => {
  return (
    <CardBody>
      <TextContent>
        <Text component='h2'>{pluginTitle}</Text>
        <Text component='p'>Preferences view for the Remote plugin example.</Text>
      </TextContent>
    </CardBody>
  )
}
