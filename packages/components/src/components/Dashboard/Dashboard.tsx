import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button } from "react-native"
import {Navbar, Sidebar} from "../common";

class Dashboard extends Component {
    render() {
        const {container } = styles
        return (
            <View style={ container }>
                <Sidebar></Sidebar>
                <Navbar></Navbar>
            </View>
        );
    }
}

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        height: "100%"
    }
})
