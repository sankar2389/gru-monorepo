import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { UserRatesCard } from "../common";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput } from "react-native";


interface IProps extends RouteComponentProps {
    group: IGroup,
    editedGroup: any,
    cancelGroupUpdate: Function,
    updateGroup: Function

};

interface IState {
    groupName: string,
}

class GroupChat extends Component<IProps, IState> {
    state: IState = {
        groupName: ""

    }
    constructor(props: IProps) {
        super(props);

    }


    render() {
        return (
            <View>
                <Text>Group chat</Text>
            </View>
        )
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};
// @ts-ignore
export default connect<IReduxState>(mapStateToProps, {})(GroupChat);

const styles = StyleSheet.create({

});