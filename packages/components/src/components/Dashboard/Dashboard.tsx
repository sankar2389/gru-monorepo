import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button } from "react-native"

class Dashboard extends Component {
    render() {
        const { loginViewStyle, formView, headerText } = styles
        return (
            <View style={loginViewStyle}>
                <View style={formView}>
                    <Text style={headerText}>ICICI Payment Gateway</Text>
                </View>
            </View>
        );
    }
}

export default Dashboard;

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
    }
})