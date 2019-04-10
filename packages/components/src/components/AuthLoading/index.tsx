import { connect } from "react-redux";
import React, { Component } from "react";
import { IReduxState, IAuth } from '../../types';
import { NavigationScreenProps } from "react-navigation";
import { View, Text, AsyncStorage } from "react-native";

interface IProps extends NavigationScreenProps {
    auth: IAuth
}

class AuthLoadingScreen extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
        const { authtoken } = props.auth;
        console.log(authtoken);
        this._bootstrapAsync();
    }
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('token');
        console.log(userToken);
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'App' : 'Auth')
    };
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