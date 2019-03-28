import React, { Component } from "react";
import { View } from "react-native";
import { NavigationScreenProps } from 'react-navigation';

interface IProps extends NavigationScreenProps {}
class HomeScreen extends Component<IProps> {
    static navigationOptions = {
        title: 'Home'
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <header className="App-header">
                    <p>GRU</p>
                    <div className="panel-links">
                        <a
                            className="login-link"
                            href="AuthLoading"
                            target="_self"
                            rel="noopener noreferrer">
                            User panel
                        </a>
                        <a
                            className="login-link"
                            href="AuthLoading"
                            target="_self"
                            rel="noopener noreferrer">
                            Admin panel
                        </a>
                    </div>
                </header>
            </View>
        );
    }
}

export default HomeScreen;