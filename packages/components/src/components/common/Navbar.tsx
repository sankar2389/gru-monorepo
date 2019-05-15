import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Modal, Image, TouchableOpacity, Platform } from "react-native";
import { IReduxState } from "../../types";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";

interface IProps extends RouteComponentProps {
    logoutUser: () => void,
    clicked?: () => void,
    toggleSideBar: (onToggleSideBar: Boolean) => void
};
interface IState {
    search: string | undefined,
    viewBuySell: boolean,
    mouseEvent: string | undefined,
    dWidth: any,
    onToggleSideBar: boolean
}

class NavbarComponent extends Component<IProps, IState> {
    state: IState = {
        search: undefined,
        viewBuySell: false,
        mouseEvent: "",
        dWidth: "",
        onToggleSideBar: true
    }
    constructor(props: IProps) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.onPressToggleSideBar = this.onPressToggleSideBar.bind(this);
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

    componentWillMount() {
        this.updateDimension()
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimension)
    }
    updateDimension = () => {
        this.setState({
            dWidth: window.innerWidth
        })
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimension)
    }

    onPressToggleSideBar() {
        this.setState({
            onToggleSideBar: !this.state.onToggleSideBar
        }, () => {
            this.props.toggleSideBar(this.state.onToggleSideBar)
        })

    }


    render() {
        const { navbar, headerText, inputStyle, navButtonCtnr, navButtonGroup, navButton,
            navButtonCtnrAdd, navButtonText, mouseOverBackgroundColor } = styles;
        return (
            <View style={this.state.dWidth <= 700 ? styles.smNavbar : navbar}>
                <Text style={this.state.dWidth <= 700 ? styles.smHeaderText : headerText}>GRU</Text>
                <TextInput
                    value={this.state.search}
                    placeholder={'Search'}
                    style={this.state.dWidth <= 700 ? styles.smInputStyle : inputStyle}
                />
                <View style={this.state.dWidth <= 700 ? styles.smNavButtonGroup : navButtonGroup}>
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
                {this.state.dWidth <= 700 ?
                    <TouchableOpacity onPress={this.onPressToggleSideBar} style={{ position: "absolute", top: 15, right: 20, }}>
                        <Text>{this.state.onToggleSideBar ? "Hide" : "Show"}</Text>
                    </TouchableOpacity> : <Text />}
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
    smNavbar: {
        width: "100%",
        height: 164,
        backgroundColor: "#ffffff",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 10
    },
    headerText: {
        color: '#d72b2b',
        fontSize: 40
    },
    smHeaderText: {
        color: '#d72b2b',
        fontSize: 30
    },

    inputStyle: {
        height: 30,
        borderColor: '#ededed',
        borderRadius: 20,
        borderBottomWidth: 1,
        margin: 15,
        backgroundColor: "rgba(226,226,226,0.21)",
        position: "absolute",
        top: 0,
        left: "30%",
        width: 170,
        padding: 10
    },
    smInputStyle: {
        height: 10,
        borderColor: '#ededed',
        borderBottomWidth: 1,
        backgroundColor: "rgba(226,226,226,0.21)",
        borderRadius: 20,
        padding: 15,
        width: 150,
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
    smNavButtonGroup: {
        paddingTop: 5,
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "red"
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
