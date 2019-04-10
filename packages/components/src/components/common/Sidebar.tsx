import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image, NativeAppEventEmitter } from "react-native";
import {NavigationScreenProps} from "react-navigation";
import {IAuth} from "../../types";
import { url } from "inspector";

class Sidebar extends Component {
    clicked() {
        console.log("clicked")
    }
    render() {
        const { sidebar, sidebarButtonGroup, sidebarButtonCtnr, sidebarButton } = styles;
        return (
            <View style={ sidebar }>
                <View style={ sidebarButtonGroup }>
                    <View style={sidebarButtonCtnr}>
                        <div onClick={this.clicked}>
                            <Image
                                source={require('../../assets/images/dashboard-white-logo.png')}
                                style={sidebarButton}
                                resizeMode={'contain'}></Image>
                        </div>
                    </View>
                    <View style={sidebarButtonCtnr}>
                        <div onClick={this.clicked}>
                            <Image
                                source={require('../../assets/images/home.png')}
                                style={sidebarButton}></Image>
                        </div>
                    </View>
                    <View style={sidebarButtonCtnr}>
                        <div onClick={this.clicked}>
                            <Image
                                source={require('../../assets/images/card.png')}
                                style={sidebarButton}></Image>
                        </div>
                    </View>
                    <View style={sidebarButtonCtnr}>
                        <div onClick={this.clicked}>
                            <Image
                                source={require('../../assets/images/group.png')}
                                style={sidebarButton}></Image>
                        </div>
                    </View>
                    <View style={sidebarButtonCtnr}>
                        <div onClick={this.clicked}>
                            <Image
                                source={require('../../assets/images/buy-sell-white.png')}
                                style={sidebarButton}></Image>
                        </div>
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
        position: "absolute",
        top: 70,
        left: 0,
        bottom: 0
    },
    sidebarButtonCtnr: {
        display: 'flex',
        width: 70,
        backgroundColor: "#d72b2b",
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sidebarButtonGroup: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: 0,
        right: 0
    },
    sidebarButton: {
        width: 30, 
        height: 30
    }
})
