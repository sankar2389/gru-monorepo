import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput } from "react-native"

class HomeScreen extends Component {
    render() {
        const { loginViewStyle, textStyle, formView } = styles
        return (
            <View style={loginViewStyle}>
                <View style={formView}>
                    <TextInput value={''} placeholder={'Email address'} />
                    <TextInput value={''} placeholder={'Password'} />
                </View>
            </View>
        );
    }
}

export default HomeScreen;

const styles = StyleSheet.create({
    loginViewStyle: {
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center"
    },
    textStyle: {
        color: '#636b6f'
    },
    formView: {
        borderColor: 'black',
        borderWidth: 1

    }
})