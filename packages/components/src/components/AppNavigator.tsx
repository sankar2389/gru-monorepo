import HomeScreen from './Home/HomeScreen'
import LoginScreen from './Login/LoginScreen'
import Dashboard from './Dashboard/Dashboard'
import UserRegScreen from './UserReg'
const nav = require('@react-navigation/core')

const AppNavigator = nav.createSwitchNavigator({
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
    },
    AdminLogin: {
        screen: LoginScreen,
        path: 'admin/login',
        navigationOptions: () => ({
            title: `Admin Login`,
            headerBackTitle: null
        })
    },
    PublicDashboard: {
        screen: Dashboard,
        path: 'public/dashboard',
        navigationOptions: () => ({
            title: `Dashboard`,
            headerBackTitle: null
        })
    },
    Home: {
        screen: HomeScreen,
        path: '/',
        navigationOptions: () => ({
            title: `Home`,
            headerBackTitle: null
        })
    }
    });

export default AppNavigator;