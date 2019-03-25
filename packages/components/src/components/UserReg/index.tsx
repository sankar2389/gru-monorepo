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
    email: string
}
class UserRegScreen extends Component<IProps, IState> {
    state = {
        username: 'Santanu B',
        password: '1234',
        confirmPass: '1234',
        email: 'santanubarai@mathcody.com'
    }
    constructor(props: IProps) {
        super(props);
    }
    componentDidUpdate(prevProps: IProps) {
        console.log(this.props);
    }
    signup() {
        const { confirmPass, password, username, email } = this.state;
        if(password === confirmPass) {
            this.props.signupUser({ username, email, password });
        } else {
            throw Error("Password did not match");
        }
    }
    render() {
        const { username, password, confirmPass, email } = this.state;
        const { loginViewStyle, formView, signupBtnCtnr, inputStyle } = styles
        return (
            <View style={loginViewStyle}>
                <View style={formView}>
                    <TextInput value={username} placeholder={'Name'} style={inputStyle} underlineColorAndroid={'red'} />
                    <TextInput value={email} placeholder={'Email address'} style={inputStyle} underlineColorAndroid={'red'} />
                    <TextInput value={password} placeholder={'Password'} secureTextEntry={true} style={inputStyle} />
                    <TextInput value={confirmPass} placeholder={'Confirm password'} secureTextEntry={true} style={inputStyle} />
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
    }
})