import React from 'react'
import './App.css'
import { Provider } from 'react-redux'
import AppNavigator from './AppNavigator'
import configureStore from './configureStore'
const navWeb = require('@react-navigation/web')

export function App() {
  const AppContainer = navWeb.createBrowserApp(AppNavigator);
  const store = configureStore();
  return (
    <Provider store={store}>
      <div className="App">
        <AppContainer />
      </div>
    </Provider>
  )
}