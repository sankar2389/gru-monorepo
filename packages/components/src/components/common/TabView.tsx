import React, { Component } from "react";
import { View } from "react-native";

export default class TabView extends Component {
    render() {
        return(
            <View>
                <h1>Tabview</h1>
                <React.Fragment>
                    <h2>item 1</h2>
                    <h2>item 2</h2>
                </React.Fragment>
            </View>
        );
    }
}