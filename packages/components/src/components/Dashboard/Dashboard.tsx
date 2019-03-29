import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button } from "react-native"
import {Navbar, Sidebar, RateCard, UserRatesCard, CalculateRate} from "../common";

class Dashboard extends Component {
    render() {
        const { container, innerContainer, rateCardsContainer, userRateCardsContainer, bullion, heading, calculateRateContainer } = styles
        return (
            <View style={ container }>
                <Sidebar></Sidebar>
                <Navbar></Navbar>
                <View style={innerContainer}>
                    <View style={rateCardsContainer}>
                        <RateCard price={"$1303.44"} material={"Gold"}></RateCard>
                        <RateCard price={"$1303.44"} material={"Silver"}></RateCard>
                        <RateCard price={"$1303.44"} material={"USD"}></RateCard>
                    </View>
                    <View style={calculateRateContainer}>
                        <Text style={heading}>Calculate your gold rates</Text>
                        <CalculateRate></CalculateRate>
                    </View>
                    <View style={bullion}>
                        <Text style={heading}>Bullion user gold rates</Text>
                        <View style={userRateCardsContainer}>
                            <UserRatesCard price={"$1303.44"} name={"Colin Roy"} avatar={"http://i.pravatar.cc/300"}></UserRatesCard>
                            <UserRatesCard price={"$1303.44"} name={"Colin Roy"} avatar={"http://i.pravatar.cc/300"}></UserRatesCard>
                            <UserRatesCard price={"$1303.44"} name={"Colin Roy"} avatar={"http://i.pravatar.cc/300"}></UserRatesCard>
                            <UserRatesCard price={"$1303.44"} name={"Colin Roy"} avatar={"http://i.pravatar.cc/300"}></UserRatesCard>
                            <UserRatesCard price={"$1303.44"} name={"Colin Roy"} avatar={"http://i.pravatar.cc/300"}></UserRatesCard>
                            <UserRatesCard price={"$1303.44"} name={"Colin Roy"} avatar={"http://i.pravatar.cc/300"}></UserRatesCard>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        height: "100%"
    },
    innerContainer: {
        width: "95%",
        marginTop: 70,
        marginLeft: 70,
        padding: 50,
        display: "flex"
    },
    rateCardsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    userRateCardsContainer: {
        display: "flex",
        flexDirection: "row",
        paddingTop: 20,
        justifyContent: "space-between"
    },
    bullion: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 30
    },
    heading: {
        fontSize: 30,
        textAlign: "left",
    },
    calculateRateContainer: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 30
    }
})
