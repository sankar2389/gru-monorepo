import React from 'react'
import './App.css'
import AppNavigator from './AppNavigator'
const navWeb = require('@react-navigation/web')

export function App() {
  const AppContainer = navWeb.createBrowserApp(AppNavigator);
  return (
    <div className="App">
      <AppContainer />
    </div>
  )
}