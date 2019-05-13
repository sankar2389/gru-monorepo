import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Modal, Image, TouchableOpacity } from "react-native";
import { IReduxState } from "../../types";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";

interface IProps extends RouteComponentProps {
    logoutUser: () => void,
    clicked?: () => void
};
interface IState {
    search: string | undefined,
    viewBuySell: boolean,
    mouseEvent: string | undefined,
}

class NavbarComponent extends Component<IProps, IState> {
    state: IState = {
        search: undefined,
        viewBuySell: false,
        mouseEvent: ""
    }
    constructor(props: IProps) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout() {
        this.props.logoutUser();
        this.props.history.push('/login');
    }
    showBuySell() {
        this.setState({ viewBuySell: true });
    }

    onMouseEnterHandler = (eventString: string) => {
        this.setState({ mouseEvent: eventString })
    }
    onMouseLeaveHandler() {
        this.setState({ mouseEvent: " " })
    }

    render() {
        const { navbar, headerText, inputStyle, navButtonCtnr, navButtonGroup, navButton,
            navButtonCtnrAdd, navButtonText, mouseOverBackgroundColor } = styles;
        return (
            <View style={{ flex: 1, padding: 5, flexDirection: "row", backgroundColor: "#ffffff", }}>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={headerText}>GRU</Text>

                </View>

                <View style={{ flex: 2 }}>
                    <TextInput
                        value={this.state.search}
                        placeholder={'Search'}
                        style={inputStyle}
                    />
                </View>

                <View style={{ flex: 3, flexDirection: "row", justifyContent: "flex-end" }}>
                    <View style={navButtonCtnrAdd}>
                        <TouchableOpacity onPress={this.showBuySell}>
                            <Image
                                source={require('../../assets/images/add-icon.png')}
                                style={navButton}></Image>
                        </TouchableOpacity>
                        <Text style={navButtonText}>Add</Text>
                    </View>
                    <View style={this.state.mouseEvent === "bySel" ? [navButtonCtnr, mouseOverBackgroundColor] : navButtonCtnr}>
                        <div onMouseEnter={() => this.onMouseEnterHandler("bySel")}
                            onMouseLeave={() => this.onMouseLeaveHandler()}
                        >
                            <TouchableOpacity onPress={this.props.clicked}>
                                <Image
                                    source={require('../../assets/images/buy-sell-icon.png')}
                                    style={navButton}></Image>
                                <Text style={navButtonText}>Buy/Sell</Text>
                            </TouchableOpacity>
                        </div>
                    </View>
                    <View style={this.state.mouseEvent === "help" ? [navButtonCtnr, mouseOverBackgroundColor] : navButtonCtnr}>
                        <div onMouseEnter={() => this.onMouseEnterHandler("help")}
                            onMouseLeave={() => this.onMouseLeaveHandler()}
                        >
                            <TouchableOpacity onPress={this.props.clicked}>
                                <Image
                                    source={require('../../assets/images/info.png')}
                                    style={navButton}></Image>
                                <Text style={navButtonText}>Help</Text>
                            </TouchableOpacity>
                        </div>
                    </View>
                    <View style={this.state.mouseEvent === "logout" ? [navButtonCtnr, mouseOverBackgroundColor] : navButtonCtnr}>
                        <div onMouseEnter={() => this.onMouseEnterHandler("logout")}
                            onMouseLeave={() => this.onMouseLeaveHandler()}
                        >
                            <TouchableOpacity onPress={this.handleLogout}>
                                <Image
                                    source={require('../../assets/images/logout.png')}
                                    style={navButton}></Image>
                                <Text style={navButtonText}>Logout</Text>
                            </TouchableOpacity>

                        </div>
                    </View>
                </View>
            </View >
        );
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export const Navbar = connect<IReduxState>(mapStateToProps, {})(NavbarComponent);

const styles = StyleSheet.create({
    navbar: {
        width: "100%",
        height: 70,
        backgroundColor: "#ffffff",
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 150
    },
    headerText: {
        color: '#d72b2b',
        fontSize: 40
    },
    inputStyle: {
        height: 30,
        borderColor: '#ededed',
        borderBottomWidth: 1,
        margin: 15,
        backgroundColor: "rgba(226,226,226,0.21)",
        borderRadius: 20,
        padding: 20,
        width: "50%",
        position: "absolute",
        top: 0,
        left: "30%"
    },
    navButtonCtnr: {
        display: 'flex',
        width: 60,
        height: 70,
        marginLeft: 7,
        marginRight: 7,
        alignItems: 'center',
        justifyContent: 'center',

    },
    navButtonCtnrAdd: {
        display: 'flex',
        width: 60,
        backgroundColor: "#FFC44A",
        height: 70,
        marginLeft: 7,
        marginRight: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navButtonGroup: {
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        top: 0,
        right: 0
    },
    navButton: {
        width: 30,
        height: 30
    },
    navButtonText: {
        fontSize: 15,
        marginTop: 5,
    },
    mouseOverBackgroundColor: {
        backgroundColor: "tomato",
    }
})
