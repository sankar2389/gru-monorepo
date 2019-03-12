import { ComponentType } from 'react';
import { AppRegistry } from 'react-native-web';
import './index.css';
import App from '@gru-monorepo/components/src/App';
// import App from './App';
import * as serviceWorke0r from './serviceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));

const render = (AppComponent: ComponentType) => {
  AppRegistry.registerComponent('devhub', () => AppComponent)
  AppRegistry.runApplication('devhub', {
    rootTag: document.getElementById('root'),
  })
}

render(App)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
