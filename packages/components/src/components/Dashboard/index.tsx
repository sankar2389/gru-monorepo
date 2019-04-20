import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button, AsyncStorage } from "react-native"
import { Navbar, Sidebar, RateCard, UserRatesCard, CalculateRate} from "../common";
import { logoutUser } from '../../actions';
import { connect } from "react-redux";
import { IReduxState } from "../../types";
import { RouteComponentProps } from "react-router";

interface IProps extends RouteComponentProps {
    logoutUser: Function
}
class Dashboard extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    
    handleClicked() {
        console.log("Button clicked");
    }
    handleLogout() {
        this.props.logoutUser();
        this.props.history.push('/public');
    }
    render() {
        const { container, innerContainer, rateCardsContainer, userRateCardsContainer, bullion, heading, calculateRateContainer } = styles
        return (
            <View style={ container }>
                <Sidebar></Sidebar>
                <Navbar handleLogout={this.handleLogout} clicked={this.handleClicked} search=""></Navbar>
                <View style={innerContainer}>
                    <View style={rateCardsContainer}>
                        <RateCard price={"$1303.44"} material={"Gold"} icon={"gold"}></RateCard>
                        <RateCard price={"$1303.44"} material={"Silver"} icon={"silver"}></RateCard>
                        <RateCard price={"$1303.44"} material={"USD"} icon={"usd"}></RateCard>
                    </View>
                    <View style={calculateRateContainer}>
                        <Text style={heading}>Calculate your gold rates</Text>
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

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, { logoutUser })(Dashboard);

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
