import { ComponentType } from 'react';
import { AppRegistry } from 'react-native';
import './index.css';
import { App } from '@gru/components/src/components/App';
import * as serviceWorker from './serviceWorker';

const render = (AppComponent: ComponentType) => {
  AppRegistry.registerComponent('gruapp', () => AppComponent)
  AppRegistry.runApplication('gruapp', {
    rootTag: document.getElementById('root'),
  })
}

render(App)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();