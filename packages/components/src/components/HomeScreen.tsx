import React, { Component } from "react"
import { View, Text } from "react-native"

class HomeScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <header className="App-header">
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer">
                        Buy/Sell on gru
                    </a>
                </header>
            </View>
        );
    }
}

export default HomeScreen;