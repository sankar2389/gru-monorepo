import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet } from "react-native";
import { IReduxState } from "../../types";
import { connect } from "react-redux";
import TabView from "../common/TabView";
import io from 'socket.io-client';

interface IProps extends RouteComponentProps { };
class BuySell extends Component<IProps> {
    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'First' },
            { key: 'second', title: 'Second' },
        ],
    };
    constructor(props: IProps) {
        super(props);
    }
    componentDidMount() {
        const socket = io('http://localhost:1337/');
        socket.on('hello', (res: any) => console.log(res));
        socket.on('buy', (res: any) => console.log(res));
        socket.on('sell', (res: any) => console.log(res));
    }
    render() {
        const { innerContainer } = styles;
        return (
            <View style={innerContainer}>
                <h1>Buy / Sell</h1>
                <h6>Bullion user gold rates</h6>
                <TabView />
            </View>
        );
    }
}
const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, {})(BuySell);

const BuyList = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);
const SellList = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const styles = StyleSheet.create({
    innerContainer: {
        width: "95%",
        marginTop: 70,
        marginLeft: 70,
        padding: 50,
        display: "flex"
    },
    scene: {
        flex: 1,
    }
});