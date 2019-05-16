import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet, Text, Easing, Animated, } from "react-native";
import { Navbar, Sidebar } from "../common";
import { logoutUser, toggleSideBar } from '../../actions';
import { IReduxState } from "../../types";
import { connect } from "react-redux";

interface IProps extends RouteComponentProps {
    logoutUser: () => void,
    toggleSideBar: () => void

};

interface IState {
    toggleSideBarState: boolean,
    animatedValue: any,
    range1: number | null,
    range2: number | null
}

class Navigation extends Component<IProps> {
    state: IState = {
        toggleSideBarState: true,
        animatedValue: new Animated.Value(0),
        range1: null,
        range2: null
    }
    constructor(props: IProps) {
        super(props);
    }
    componentWillReceiveProps(newProps: any) {
        console.log("new", newProps.auth)
        this.setState({
            toggleSideBarState: newProps.auth.onToggleSideBar,
            range1: newProps.auth.range1,
            range2: newProps.auth.range2
        }, () => {
            if (this.state.toggleSideBarState) {
                this.animate(Easing.out(Easing.quad))
            } else {
                this.animate(Easing.in(Easing.quad))
            }
        })
    }

    animate(easing: any) {
        this.state.animatedValue.setValue(0)
        Animated.timing(
            this.state.animatedValue,
            {
                toValue: 1,
                duration: 400,
                easing
            }
        ).start()
    }

    render() {
        const marginLeft = this.state.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [this.state.range1, this.state.range2]
        })
        return (
            <View>
                <Animated.View style={{ marginLeft }} >
                    <Sidebar {...this.props} />
                </Animated.View>

                <Navbar {...this.props} />
            </View>
        )
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, { logoutUser, toggleSideBar })(Navigation);

const styles = StyleSheet.create({
    block: {
        width: 50,
        height: 50,
        backgroundColor: 'red'
    }
})