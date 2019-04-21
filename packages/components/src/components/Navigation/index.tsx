import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet } from "react-native";
import { Navbar, Sidebar } from "../common";

interface IProps extends RouteComponentProps {};
export default class Navigation extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    render() {
        return (
            <View>
                <Sidebar {...this.props} />
                <Navbar {...this.props} />
            </View>
        )
    }
}