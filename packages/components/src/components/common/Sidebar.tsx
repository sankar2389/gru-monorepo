import React, { Component } from "react";
import { View, Text, StyleSheet, AsyncStorage, Image, TouchableOpacity } from "react-native";
import { RouteComponentProps } from "react-router";

interface IProps extends RouteComponentProps { };

interface IState {
    sideBarBackgroundColor: string | undefined,
    dWidth: any

}

class Sidebar extends Component<IProps, IState> {
    state: IState = {
        sideBarBackgroundColor: undefined,
        dWidth: ""

    }
    constructor(props: IProps) {
        super(props)
        this._gotoBuySell = this._gotoBuySell.bind(this);
        this._gotoGroups = this._gotoGroups.bind(this);
        this._gotoDash = this._gotoDash.bind(this);

    }
    componentDidMount() {
        if (this.props.history.location.pathname) {
            this.setState({
                sideBarBackgroundColor: this.props.history.location.pathname
            })
        }
        window.addEventListener("resize", this.updateDimension)
    }

    clicked() {
        console.log("clicked")
    }
    _gotoBuySell() {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    this.props.history.push({
                        pathname: '/secure/buysell',
                        state: { authtoken }
                    });
                }
            })
    }
    _gotoGroups = () => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    this.props.history.push({
                        pathname: '/secure/groups',
                        state: { authtoken }
                    });
                }
            })
    }
    _gotoDash() {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    this.props.history.push({
                        pathname: '/secure/dashboard',
                        state: { authtoken }
                    });
                }
            })
    }

    componentWillMount() {
        this.updateDimension()
    }

    updateDimension = () => {
        this.setState({
            dWidth: window.innerWidth
        })
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimension)
    }

    render() {
        console.log("state", this.state.dWidth)
        const { sidebar, sidebarButtonGroup, sidebarButtonCtnr, sidebarButton } = styles;
        return (
            <View style={this.state.dWidth <= 700 ? styles.smSidebar : sidebar}>
                <View style={sidebarButtonGroup}>
                    <View style={this.state.sideBarBackgroundColor === "/secure/dashboard" ? [sidebarButtonCtnr, styles.sideBarNavigationBackgroundColor] : sidebarButtonCtnr}>
                        <TouchableOpacity onPress={() => this._gotoDash()}>
                            <Image
                                accessibilityLabel='City'
                                source={require('../../assets/images/dashboard-white-logo.png')}
                                style={sidebarButton}
                                resizeMode={'contain'} />
                        </TouchableOpacity>
                    </View>

                    <View style={sidebarButtonCtnr}>
                        <TouchableOpacity onPress={() => this.clicked()}>
                            <Image
                                source={require('../../assets/images/home.png')}
                                style={sidebarButton} />
                        </TouchableOpacity>
                    </View>
                    <View style={sidebarButtonCtnr}>
                        <TouchableOpacity onPress={() => this.clicked()}>
                            <Image
                                source={require('../../assets/images/card.png')}
                                style={sidebarButton} />
                        </TouchableOpacity>
                    </View>
                    <View style={this.state.sideBarBackgroundColor === "/secure/groups" ?
                        [sidebarButtonCtnr, styles.sideBarNavigationBackgroundColor] : sidebarButtonCtnr}>
                        <TouchableOpacity onPress={() => this._gotoGroups()}>
                            <Image
                                source={require('../../assets/images/group.png')}
                                style={sidebarButton} />
                        </TouchableOpacity>
                    </View>
                    <View style={this.state.sideBarBackgroundColor === "/secure/buysell" ? [sidebarButtonCtnr, styles.sideBarNavigationBackgroundColor] : sidebarButtonCtnr}>
                        <TouchableOpacity onPress={() => this._gotoBuySell()}>
                            <Image
                                source={require('../../assets/images/buy-sell-white.png')}
                                style={sidebarButton} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export { Sidebar }


const styles = StyleSheet.create({
    sidebar: {
        width: 70,
        height: "92.6vh",
        backgroundColor: "#d72b2b",
        position: "absolute",
        top: 70,
        left: 0,
        bottom: 0,
    },

    smSidebar: {
        width: 70,
        height: "79vh",
        backgroundColor: "#d72b2b",
        position: "absolute",
        top: 155,
        left: 0,
        bottom: 0,
    },
    sidebarButtonCtnr: {
        backgroundColor: "#d72b2b",
        display: 'flex',
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sidebarButtonGroup: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: 0,
        right: 0,
    },
    sidebarButton: {
        width: 30,
        height: 30
    },

    sideBarNavigationBackgroundColor: {
        backgroundColor: "#787878",
    }
})
