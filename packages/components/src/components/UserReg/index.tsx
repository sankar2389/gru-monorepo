import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button } from "react-native"
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux';
import { signupUser } from '../../actions';
import { IAuth, IReduxState } from '../../types';

interface IProps {
    navigation: NavigationScreenProps,
    signupUser: Function,
    auth: IAuth
}
interface IState {
    username: string,
    password: string,
    confirmPass: string,
    email: string,
    formError?: Error
}
class UserRegScreen extends Component<IProps, IState> {
    state = {
        username: 'Santanu B',
        password: '1234',
        confirmPass: '1234',
        email: 'santanubarai@mathcody.com',
        formError: undefined
    }
    constructor(props: IProps) {
        super(props);
    }
    signup() {
        const { confirmPass, password, username, email } = this.state;
        if(password === confirmPass) {
            this.props.signupUser({ username, email, password });
        } else {
            const vErr: Error = Error("Password did not match")
            this.setState({ formError: vErr });
        }
    }
    render() {
        const { username, password, confirmPass, email, formError } = this.state;
        const { error } = this.props.auth;
        const { loginViewStyle, formView, signupBtnCtnr, inputStyle, errorMsg } = styles
        return (
            <View style={loginViewStyle}>
                <View style={formView}>
                    <TextInput
                        value={username}
                        placeholder={'Name'}
                        style={inputStyle}
                        underlineColorAndroid={'red'}
                        onChangeText={(text) => this.setState({ username: text })}
                    />
                    <TextInput
                        value={email}
                        placeholder={'Email address'}
                        style={inputStyle}
                        underlineColorAndroid={'red'}
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                    <TextInput
                        value={password}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        style={inputStyle}
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                    <TextInput
                        value={confirmPass}
                        placeholder={'Confirm password'}
                        secureTextEntry={true}
                        style={inputStyle}
                        onChangeText={(text) => this.setState({ confirmPass: text })}
                    />
                    {
                        error !== null &&
                        <Text style={errorMsg}>Error: {error.message}</Text>
                    }
                    {
                        formError !== undefined &&
                        <Text style={errorMsg}>Error: {formError.message}</Text>
                    }
                    <View style={signupBtnCtnr}>
                        <Button
                            onPress={() => this.signup()}
                            title="Sign Up"
                            color="#d72b2b"
                            accessibilityLabel="Register new user"
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, { signupUser })(UserRegScreen);

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
    signupBtnCtnr: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginTop: 5
    },
    errorMsg: {
        color: '#fd3b3be8'
    }
})