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
        email: 'santanubarai@mathcody.com',
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
        const { loginViewStyle, loginBtnCtnr, formView, inputStyle, headerText, loginViewStyleFtr, h3, a, or } = styles
        return (
            <View style={loginViewStyle}>
                <View style={formView}>
                    <View>
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
                        <Text style={a} onPress={() => this.props.navigation.navigate('Forget')}>Forget Password</Text>
                    </View>
                    <View style={loginViewStyleFtr}>
                        <Text style={or}>or</Text>
                        <View>
                            <Text style={h3}>New user ?</Text>
                            <Text style={a} onPress={() => this.props.navigation.navigate('UserReg')}>Create new account</Text>
                        </View>
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
    loginViewStyleFtr: {
        width: '100%',
        position: 'absolute',
        left: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: "#FFF9EA"
    },
    headerText: {
        color: '#d72b2b',
        margin: 20,
        fontSize: 40
    },
    h3: {
        margin: 8
    },
    a: {
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "#13b0ff",
        color: "#13b0ff"
    },
    or: {
        position: 'absolute',
        top: -8,
        color: '#878787',
    },
    formView: {
        width: '20vw',
        height: '50vh',
        backgroundColor: '#ffffff',
        padding: 25
    },
    inputStyle: {
        height: 30,
        borderColor: '#ededed',
        borderBottomWidth: 1,
        margin: 15,
    },
    loginBtnCtnr: {
        display: 'flex',
        width: '100%',
        marginTop: 5,
        marginBottom: 20
    }
})
