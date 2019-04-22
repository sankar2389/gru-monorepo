import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";

interface IProps extends RouteComponentProps { };

class GroupView extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    render() {
        const { innerContainer } = styles;
        return (
            <View style={innerContainer}>
                <h1>List of Groups</h1>
            </View>
        );
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, {})(GroupView);

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