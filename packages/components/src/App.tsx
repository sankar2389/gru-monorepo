import React, { ComponentType } from 'react';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './components/Login';
import HomeScreen from './components/Home/HomeScreen';
import UserRegScreen from './components/UserReg';
import Dashboard from './components/Dashboard';
import BuySell from './components/BuySell';
import GroupView from './components/Groups';
import Chat from './components/Groups/Chat';
import GroupDashboard from './components/Groups/GroupDashboard';
import GroupQuestionPage from './components/Groups/GroupQuestionPage';
import GroupCommentsActionPage from './components/Groups/GroupCommentsActionPage';
import GroupQuestionActionPage from './components/Groups/GroupQuestionActionPage';

import './App.css';
import Navigation from './components/Navigation';
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
                    <PrivateRoute path="/secure" component={Dashboard} exact />
                    <PrivateRoute path="/secure/dashboard" component={Dashboard} />
                    <PrivateRoute path="/secure/buysell" component={BuySell} />
                    <PrivateRoute path="/secure/groups/:groupName" component={GroupDashboard} exact />
                    <PrivateRoute
                        path="/secure/groups/:groupName/:questionID/:commentID/:action"
                        component={GroupCommentsActionPage}
                    />
                    <PrivateRoute
                        path="/secure/groups/:groupName/:questionID/:action"
                        component={GroupQuestionActionPage}
                        exact
                    />
                    <PrivateRoute path="/secure/groups/:groupName/:questionID" component={GroupQuestionPage} exact />
                    <PrivateRoute path="/secure/groups" component={GroupView} exact />
                    <PrivateRoute path="/secure/chat" component={Chat} />
                </Router>
            </div>
        </Provider>
    );
}

const PrivateRoute: any = ({ component: PrivateComponent, auth, ...rest }: { component: ComponentType; auth: any }) => (
    <Route
        {...rest}
        render={(props: any) =>
            isAuthenticated(props) === true ? (
                <View style={styles.container}>
                    <Navigation {...props} />
                    <PrivateComponent {...props} />
                </View>
            ) : (
                <Redirect to="/login" />
            )
        }
    />
);

function isAuthenticated(props: any): boolean {
    // TODO: authentication token restores if stored in redux
    // ** Fetching authtoken from store can follow following workflow
    // props.getAuthToken()
    // props.didUpdate() [on store update]
    // read authtoken
    // return true/false
    const { state } = props.location;
    if (state && state.authtoken) {
        return true;
    }
    return false;
}

const styles = StyleSheet.create({
    container: {
        //height: "100%",
    },
});
