import HomeScreen from './HomeScreen'
import LoginScreen from './LoginScreen'
const navCore = require('@react-navigation/core')

const AppNavigator = navCore.createSwitchNavigator({
    Home: {
        screen: HomeScreen
    },
    Login: {
        screen: LoginScreen
    }
    });

export default AppNavigator;