import { ComponentType } from 'react'
import { AppRegistry } from 'react-native'

import './index.css'

import { App } from '@gru/components/src/components/App'

const render = (AppComponent: ComponentType) => {
  AppRegistry.registerComponent('devhub', () => AppComponent)
  AppRegistry.runApplication('devhub', {
    rootTag: document.getElementById('root'),
  })
}

render(App)
