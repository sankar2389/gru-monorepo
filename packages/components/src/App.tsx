import React, { ComponentType } from 'react'
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import LoginScreen from './components/Login';
import HomeScreen from './components/Home/HomeScreen';
import UserRegScreen from './components/UserReg';
import Dashboard from './components/Dashboard';
import './App.css';
export function App() {
  const store = configureStore();
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Route path="/" component={HomeScreen} exact />
          <Route path="/login" component={LoginScreen} />
          <Route path="/newuser" component={UserRegScreen} />
          <Route path="/admin" component={LoginScreen} />
          <PrivateRoute path="/secure" component={Dashboard} />
          <PrivateRoute path="/secure/:securePath" component={Dashboard} />
        </Router>
      </div>
    </Provider>
  )
}

const PrivateRoute: any = ({ component: PrivateComponent, auth, ...rest }: { component: ComponentType, auth: any }) => (
<Route {...rest} render={(props: any) => (
    isAuthenticated(props) === true ? <PrivateComponent {...props} /> : <Redirect to='/login' />
  )} />
)

function isAuthenticated(props: any): boolean {
  // TODO: authentication token restores if stored in redux
  // Fetching authtoken from store can follow following workflow
  // props.getAuthToken()
  // props.didUpdate() [on store update]
  // read authtoken
  // return true/false
  const { state } = props.location;
  if (state && state.authtoken) {
    return true
  }
  return false
}