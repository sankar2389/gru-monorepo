import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet } from "react-native";
import { Navbar, Sidebar } from "../common";
import { logoutUser } from '../../actions';
import { IReduxState } from "../../types";
import { connect } from "react-redux";

interface IProps extends RouteComponentProps {
    logoutUser: () => void
};
class Navigation extends Component<IProps> {
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

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, { logoutUser })(Navigation);