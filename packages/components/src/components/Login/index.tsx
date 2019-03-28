import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { NavigationScreenProps } from 'react-navigation';
import { IReduxState, IAuth } from '../../types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions';

interface IProps extends NavigationScreenProps{
    loginUser: Function,
    auth: IAuth
}
interface IState {
    email: string,
    password: string
}
class LoginScreen extends Component<IProps, IState> {
    state: IState = {
        email: 'santanubarai@test.com',
        password: '1234'
    }
    constructor(props: IProps) {
        super(props);
    }
    login() {
        const { email, password } = this.state;
        this.props.loginUser({ email, password });
    }
    componentDidUpdate() {
        const { authtoken } = this.props.auth;
        if(authtoken) {
            this.props.navigation.navigate('App')
        }
    }
    render() {
        const { email, password } = this.state;
        const { loginViewStyle, loginBtnCtnr, formView, inputStyle, headerText } = styles
        return (
            <View style={loginViewStyle}>
                <View style={formView}>
                    <Text style={headerText}>GRU</Text>
                    <TextInput
                        value={email}
                        placeholder={'Email address'}
                        style={inputStyle}
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                    <TextInput
                        value={password}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        style={inputStyle}
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                    <View style={loginBtnCtnr}>
                        <Button
                            onPress={() => this.login()}
                            title="Login"
                            color="#d72b2b"
                            accessibilityLabel="Log in to the user panel"
                        />
                    </View>
                    <View>
                        <Text>New user ?</Text>
                        <Text onPress={() => this.props.navigation.navigate('UserReg')}>Create new account</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, { loginUser })(LoginScreen);

const styles = StyleSheet.create({
    loginViewStyle: {
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center"
    },
    headerText: {
        color: '#d72b2b'
    },
    formView: {
        width: '20vw',
        height: '40vh',
        backgroundColor: '#ffffff'
    },
    inputStyle: {
        height: 30,
        borderColor: '#ededed',
        borderBottomWidth: 1
    },
    loginBtnCtnr: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginTop: 5
    }
})