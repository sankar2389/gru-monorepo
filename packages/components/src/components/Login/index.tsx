import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button, AsyncStorage, TouchableOpacity } from "react-native";
import { IReduxState, IAuth } from '../../types';
import { connect } from 'react-redux';
// @ts-ignore
import { Router, RouteComponentProps } from 'react-router';
import { loginUser } from '../../actions';
import axios from "axios";

interface IProps extends RouteComponentProps {
    loginUser: Function,
    auth: IAuth
}
interface IState {
    email: string,
    password: string
}
class LoginScreen extends Component<IProps, IState> {
    static navigationOptions = {
        title: 'Login',
    };
    state: IState = {
        email: '',
        password: ''
    }
    constructor(props: IProps) {
        super(props);
    }
    login() {
        const { email, password } = this.state;
        this.props.loginUser({ email, password });

    }
    componentDidMount() {
        // AsyncStorage.clear()
        AsyncStorage.getItem('token')
            .then(authtoken => {
                axios.get(process.env.CMS_API + "users/me", {
                    headers: {
                        Authorization: 'Bearer ' + authtoken
                    }
                }).then(res => {
                    if (res.data.role.name === "Authenticated") {
                        this.props.history.push({
                            pathname: '/secure/dashboard',
                            state: { authtoken }
                        });
                    }
                }).catch(e => {
                    console.log(e, "ERROR");
                });
            });
    }

    componentDidUpdate() {
        const { auth } = this.props;

        if (auth.authtoken) {
            this.props.history.push({
                pathname: '/secure/dashboard',
            });
            return;
        }
    }

    render() {
        const { email, password } = this.state;
        const { inputStyle, loginViewStyleFtr, h3, a, or } = styles;
        return (
            <View style={styles.loginViewStyle}>
                <View style={styles.formView}>
                    <Text>GRU</Text>
                    <TextInput
                        autoFocus={true}
                        value={email}
                        placeholder={'Email address'}
                        style={inputStyle}
                        onChangeText={(text) => this.setState({ email: text })}
                        onSubmitEditing={() => {
                            this.login()
                        }}
                    />
                    <TextInput
                        value={password}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        style={inputStyle}
                        onChangeText={(text) => this.setState({ password: text })}
                        onSubmitEditing={() => {
                            this.login()
                        }}
                    />

                    <TouchableOpacity style={styles.loginBtnCtnr} onPress={() => this.login()}>
                        <Text style={{ color: "#ffffff" }}>
                            LOGIN
                        </Text>
                    </TouchableOpacity>

                    <Text onPress={() => this.props.history.push('/forget')}>Forget Password</Text>
                    <View style={loginViewStyleFtr}>
                        <Text style={or}>or</Text>
                        <View>
                            <Text style={h3}>New user ?</Text>
                            <Text style={a} onPress={() => this.props.history.push('/newuser')}>Create new account</Text>
                        </View>
                    </View>
                </View>

            </View >


        );
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, { loginUser })(LoginScreen);

const styles = StyleSheet.create({
    loginViewStyle: {
        height: "100%", alignItems: "center", justifyContent: "center",
    },
    loginViewStyleFtr: {
        marginTop: 60,
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 250,
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: "#FFF9EA",
        borderRadius: 5
    },
    headerText: {
        color: '#d72b2b',
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
    formView: { backgroundColor: "#ffffff", padding: 50, marginBottom: 90, borderRadius: 5 },
    inputStyle: {
        height: 30,
        width: "100%",
        borderColor: '#ededed',
        borderBottomWidth: 1,
        margin: 15,
    },
    loginBtnCtnr: { backgroundColor: "#d72b2b", padding: 10, width: "110%", marginRight: 40, marginBottom: 15, marginTop: 10, borderRadius: 5 }
})
