import { Component } from "react";
import { RouteComponentProps } from "react-router";
import React, { View, StyleSheet } from "react-native";
import { IReduxState } from "../../types";
import { connect } from "react-redux";

interface IProps extends RouteComponentProps { };
class BuySell extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    render() {
        const { innerContainer } = styles;
        return (
            <View style={innerContainer}>
                <h1>BuySell</h1>
            </View>
        );
    }
}
const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, {})(BuySell);

const styles = StyleSheet.create({
    innerContainer: {
        width: "95%",
        marginTop: 70,
        marginLeft: 70,
        padding: 50,
        display: "flex"
    },
});