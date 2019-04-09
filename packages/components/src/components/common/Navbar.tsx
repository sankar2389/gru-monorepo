import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { IReduxState } from "../../types";

interface IProps {
    handleLogout: () => void
    search: string
    clicked: () => void
}
interface IState {
    search: string
}
export const Navbar = (props: IProps) => {
    const { navbar, headerText, inputStyle, navButtonCtnr, navButtonGroup } = styles;
    return (
        <View style={navbar}>
            <Text style={headerText}>GRU</Text>
            <TextInput
                value={props.search}
                placeholder={'Search'}
                style={inputStyle}
            />
            <View style={navButtonGroup}>
                <View style={navButtonCtnr}>
                    <Button
                        onPress={props.clicked}
                        title="Add"
                        color="#d72b2b"
                        accessibilityLabel="Add"
                    />
                </View>
                <View style={navButtonCtnr}>
                    <Button
                        onPress={props.clicked}
                        title="Buy/Sell"
                        color="#d72b2b"
                        accessibilityLabel="Buy or sell"
                    />
                </View>
                <View style={navButtonCtnr}>
                    <Button
                        onPress={props.clicked}
                        title="Help"
                        color="#d72b2b"
                        accessibilityLabel="Get help"
                    />
                </View>
                <View style={navButtonCtnr}>
                    <Button
                        onPress={props.handleLogout}
                        title="Logout"
                        color="#d72b2b"
                        accessibilityLabel="Logout"
                    />
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    navbar: {
        width: "100%",
        height: 70,
        backgroundColor: "#ffffff",
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft:150
    },
    headerText: {
        color: '#d72b2b',
        fontSize: 40
    },
    inputStyle: {
        height: 30,
        borderColor: '#ededed',
        borderBottomWidth: 1,
        margin: 15,
        backgroundColor: "rgba(226,226,226,0.21)",
        borderRadius: 20,
        padding: 20,
        width: "20%",
        position: "absolute",
        top: 0,
        left: "30%"
    },
    navButtonCtnr: {
        display: 'flex',
        width: 60,
        backgroundColor: "#d72b2b",
        height: 70,
        marginLeft: 7,
        marginRight: 7
    },
    navButtonGroup: {
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        top: 0,
        right: 0
    }
})
