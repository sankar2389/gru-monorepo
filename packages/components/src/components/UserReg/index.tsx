import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button } from "react-native"
import { NavigationScreenProps } from 'react-navigation'

type IProps = NavigationScreenProps
class UserRegScreen extends Component<IProps> {
    signup() {
    }
    render() {
        const { loginViewStyle, formView, signupBtnCtnr, inputStyle } = styles
        return (
            <View style={loginViewStyle}>
                <View style={formView}>
                    <TextInput value={''} placeholder={'Name'} style={inputStyle} underlineColorAndroid={'red'} />
                    <TextInput value={''} placeholder={'Email address'} style={inputStyle} underlineColorAndroid={'red'} />
                    <TextInput value={''} placeholder={'Password'} style={inputStyle} />
                    <TextInput value={''} placeholder={'Confirm password'} style={inputStyle} />
                    <View style={signupBtnCtnr}>
                        <Button
                            onPress={() => this.signup()}
                            title="Sign Up"
                            color="#d72b2b"
                            accessibilityLabel="Register new user"
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export default UserRegScreen;

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
    signupBtnCtnr: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginTop: 5
    }
})