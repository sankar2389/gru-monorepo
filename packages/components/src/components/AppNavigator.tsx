import HomeScreen from './HomeScreen'
import LoginScreen from './LoginScreen'
const nav = require('@react-navigation/core')
const AppNavigator = nav.createSwitchNavigator({
    Login: {
        screen: LoginScreen,
        path: '/login',
        navigationOptions: () => ({
            title: `Login`,
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