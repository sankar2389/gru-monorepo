import HomeScreen from './components/Home/HomeScreen';
import LoginScreen from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import UserRegScreen from './components/UserReg';
import AuthLoadingScreen from './components/AuthLoading';
// @ts-ignore
import { createSwitchNavigator, createNavigator, SwitchRouter } from "@react-navigation/core";
// @ts-ignore
import { createStackNavigator } from "@react-navigation/web";

const AuthStack = createSwitchNavigator({
    PublicDashboard: {
        screen: Dashboard,
        path: 'public/dashboard',
        navigationOptions: () => ({
            title: `Dashboard`,
            headerBackTitle: null
        })
    },
    AdminLogin: {
        screen: LoginScreen,
        path: 'admin/login',
        navigationOptions: () => ({
            title: `Admin Login`,
            headerBackTitle: null
        })
    },
    UserLogin: {
        screen: LoginScreen,
        path: 'public/login',
        navigationOptions: () => ({
            title: `Public Login`,
            headerBackTitle: null
        })
    },
    UserReg: {
        screen: UserRegScreen,
        path: 'public/newuser',
        navigationOptions: () => ({
            title: `User registration`,
            headerBackTitle: null
        })
    }
})

const AppNavigator = createSwitchNavigator(
    {
        Home: {
            screen: HomeScreen,
            path: '/',
            navigationOptions: () => ({
                title: `Home`,
                headerBackTitle: null
            })
        },
        AuthLoading: AuthLoadingScreen,
        Auth: AuthStack
    },
    {
        initialRouteName: 'Home',
    }
);

export default AppNavigator;