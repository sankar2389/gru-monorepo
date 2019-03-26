import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button } from "react-native"
import { NavigationScreenProps } from 'react-navigation'

type Props = NavigationScreenProps
class LoginScreen extends Component<Props> {
    render() {
        const { loginViewStyle, loginBtnCtnr, formView, inputStyle, headerText } = styles
        return (
            <View style={loginViewStyle}>
                <View style={formView}>
                    <Text style={headerText}>GRU</Text>
                    <TextInput value={''} placeholder={'Email address'} style={inputStyle} underlineColorAndroid={'red'} />
                    <TextInput value={''} placeholder={'Password'} style={inputStyle} />
                    <View style={loginBtnCtnr}>
                        <Button
                            onPress={() => this.props.navigation.navigate('PublicDashboard')}
                            title="Login"
                            color="#d72b2b"
                            accessibilityLabel="Log in to the user panel"
                        />
                    </View>
                    <View>
                        <Text>New user ?</Text>
                        <Text onPress={() => this.props.navigation.navigate('UserReg')}>Create new account</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
    loginViewStyle: {
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center"
    },
    headerText: {
        color: '#d72b2b'
    },
    formView: {
        width: '20vw',
        height: '40vh',
        backgroundColor: '#ffffff'
    },
    inputStyle: {
        height: 30,
        borderColor: '#ededed',
        borderBottomWidth: 1
    },
    loginBtnCtnr: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginTop: 5
    }
})