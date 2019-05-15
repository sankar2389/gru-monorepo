import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet, Text } from "react-native";
import { Navbar, Sidebar } from "../common";
import { logoutUser, toggleSideBar } from '../../actions';
import { IReduxState } from "../../types";
import { connect } from "react-redux";

interface IProps extends RouteComponentProps {
    logoutUser: () => void,
    toggleSideBar: () => void

};

interface IState {
    toggleSideBarState: boolean
}

class Navigation extends Component<IProps> {
    state: IState = {
        toggleSideBarState: true
    }
    constructor(props: IProps) {
        super(props);
    }
    componentWillReceiveProps(newProps: any) {
        this.setState({
            toggleSideBarState: newProps.auth.onToggleSideBar
        })
    }

    render() {
        return (
            <View>
                {this.state.toggleSideBarState ? <Sidebar {...this.props} /> : <Text />}
                <Navbar {...this.props} />
            </View>
        )
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, { logoutUser, toggleSideBar })(Navigation);