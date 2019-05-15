import React, { Component } from "react"
import { View, Text, StyleSheet } from "react-native"
import { RateCard, UserRatesCard, CalculateRate } from "../common";
import { logoutUser } from '../../actions';
import { connect } from "react-redux";
import { IReduxState, InterfaceGRC } from "../../types";
import createApolloClient from '../../apollo';
import gql from 'graphql-tag';
import { RouteComponentProps } from "react-router";

interface IProps extends RouteComponentProps {
    logoutUser: Function
}

class Dashboard extends Component<IProps> {

    constructor(props: IProps) {
        super(props);
    }
    async componentDidMount() {
        /*const client = createApolloClient('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU1NTg5MTkzLCJleHAiOjE1NTgxODExOTN9.DkdcPF0yek5FaHiDNrZOAqJhUMnZpLu_hi1Sg-83yho');
        await client.query({
          query: gql`
          query {
            groups {
                groupName
              }
          }`        
        }).then((res: any) => {
            console.log('res :',res.data);
        });*/
    }

    handleClicked() {
        console.log("Button clicked");
    }
    _handleCalc(values: InterfaceGRC) {
        const { goldRate, fiatRate, goldOunce, duty, gst } = values;
        console.log("will handle gold rate calculation");
    }
    render() {
        const { innerContainer, rateCardsContainer, userRateCardsContainer, bullion, heading, calculateRateContainer } = styles
        return (
            <View style={innerContainer}>
                <View style={rateCardsContainer}>
                    <RateCard price={"$1303.44"} material={"Gold"} icon={"gold"}></RateCard>
                    <RateCard price={"$1303.44"} material={"Silver"} icon={"silver"}></RateCard>
                    <RateCard price={"$1303.44"} material={"USD"} icon={"usd"}></RateCard>
                </View>
                <View style={calculateRateContainer}>
                    <Text style={heading}>Calculate your gold rates</Text>
                </View>
                <CalculateRate onSubmit={this._handleCalc} />
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
        );
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, { logoutUser })(Dashboard);

const styles = StyleSheet.create({
    innerContainer: {
        width: "95%",
        marginTop: 70,
        marginLeft: 70,
        padding: 50,
        display: "flex",
        backgroundColor: "green"
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
