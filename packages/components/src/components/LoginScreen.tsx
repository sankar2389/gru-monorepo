import React, { Component } from "react"
import { View, Text } from "react-native"

class HomeScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: 'white' }}>Login Screen</Text>
            </View>
        );
    }
}

export default HomeScreen;