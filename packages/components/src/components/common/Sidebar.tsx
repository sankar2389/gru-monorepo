import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import {NavigationScreenProps} from "react-navigation";
import {IAuth} from "../../types";

class Sidebar extends Component {
    clicked() {
        console.log("clicked")
    }
    render() {
        const { sidebar, sidebarButtonGroup, sidebarButtonCtnr } = styles;
        return (
            <View style={ sidebar }>
                <View style={ sidebarButtonGroup }>
                    <View style={sidebarButtonCtnr}>
                        <Button
                            onPress={() => this.clicked()}
                            title="Add"
                            color="#d72b2b"
                            accessibilityLabel="Add"
                        />
                    </View>
                    <View style={sidebarButtonCtnr}>
                        <Button
                            onPress={() => this.clicked()}
                            title="Buy/Sell"
                            color="#d72b2b"
                            accessibilityLabel="Buy or sell"
                        />
                    </View>
                    <View style={sidebarButtonCtnr}>
                        <Button
                            onPress={() => this.clicked()}
                            title="Help"
                            color="#d72b2b"
                            accessibilityLabel="Get help"
                        />
                    </View>
                    <View style={sidebarButtonCtnr}>
                        <Button
                            onPress={() => this.clicked()}
                            title="Logout"
                            color="#d72b2b"
                            accessibilityLabel="Logout"
                        />
                    </View>
                </View>
            </View>
        )
    }
}

export { Sidebar }


const styles = StyleSheet.create({
    sidebar: {
        width: 70,
        backgroundColor: "#d72b2b",
        height: "100%",
        position: "absolute",
        top: 70,
        left: 0
    },
    sidebarButtonCtnr: {
        display: 'flex',
        width: 70,
        backgroundColor: "#d72b2b",
        height: 70,
    },
    sidebarButtonGroup: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: 0,
        right: 0
    }
})
