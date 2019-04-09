import { connect } from "react-redux";
import React, { Component } from "react";
import { IReduxState, IAuth } from '../../types';
import { NavigationScreenProps } from "react-navigation";
import { View, Text } from "react-native";

interface IProps extends NavigationScreenProps {
    auth: IAuth
}

class AuthLoadingScreen extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
        const { authtoken } = props.auth;
        console.log(authtoken);
        if(authtoken !== undefined && authtoken !== null && authtoken !== '') {
            // authtoken exists => validate authtoken => goto dashboard
            // TODO: validate auth token
            props.navigation.navigate('App')
        } else {
            // authtoken does not exists => goto login
            props.navigation.navigate('Auth')
        }
    }
    render() {
        return(
            <View>
                <Text>AuthLoading...</Text>
            </View>
        )
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, {})(AuthLoadingScreen);