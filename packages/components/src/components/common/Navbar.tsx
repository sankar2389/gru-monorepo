import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import { IReduxState } from "../../types";

interface IProps {
    handleLogout: () => void
    search: string
    clicked: () => void,
}
interface IState {
    search: string
}
export const Navbar = (props: IProps) => {
    const { navbar, headerText, inputStyle, navButtonCtnr, navButtonGroup, navButton,
        navButtonCtnrAdd, navButtonText } = styles;
    return (
        <View style={navbar}>
            <Text style={headerText}>GRU</Text>
            <TextInput
                value={props.search}
                placeholder={'Search'}
                style={inputStyle}
            />
            <View style={navButtonGroup}>
                <View style={navButtonCtnrAdd}>
                    <div onClick={props.clicked}>
                        <Image
                            source={require('../../assets/images/add-icon.png')}
                            style={navButton}></Image>
                    </div>
                    <Text style={navButtonText}>Add</Text>
                </View>
                <View style={navButtonCtnr}>
                    <div onClick={props.clicked}>
                        <Image
                            source={require('../../assets/images/buy-sell-icon.png')}
                            style={navButton}></Image>
                    </div>
                    <Text style={navButtonText}>Buy/Sell</Text>
                </View>
                <View style={navButtonCtnr}>
                    <div onClick={props.clicked}>
                        <Image
                            source={require('../../assets/images/info.png')}
                            style={navButton}></Image>
                            <Text style={navButtonText}>Help</Text>
                    </div>
                </View>
                <View style={navButtonCtnr}>
                    <div onClick={props.handleLogout}>
                        <Image
                            source={require('../../assets/images/logout.png')}
                            style={navButton}></Image>
                            <Text style={navButtonText}>Logout</Text>
                    </div>
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
        height: 70,
        marginLeft: 7,
        marginRight: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navButtonCtnrAdd: {
        display: 'flex',
        width: 60,
        backgroundColor: "#FFC44A",
        height: 70,
        marginLeft: 7,
        marginRight: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navButtonGroup: {
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        top: 0,
        right: 0
    },
    navButton: {
        width: 30, 
        height: 30
    },
    navButtonText: {
        fontSize: 15,
        marginTop: 5,
    }
})
