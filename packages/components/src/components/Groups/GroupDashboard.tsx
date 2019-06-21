import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, ScrollView, Text } from "react-native";

type IProps = any

interface IState {
    dWidth: number
}

class GroupDashboard extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            dWidth: 0
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimension)
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
        const { innerContainer } = styles;

        return (
            <View style={this.state.dWidth <= 700 ? styles.smMainViewContainer : styles.mainViewContainer}>
                <ScrollView style={this.state.dWidth <= 700 ? styles.smInnerContainer : innerContainer}>
                    <View style={{ alignItems: "flex-start" }}>
                        <Text style={styles.headerGroupDashboard}>
                            Group Dashboard
                    </Text>
                        <Text style={this.state.dWidth <= 700 ? styles.smHeaderSmallText : styles.headerSmallText}>Group Q/A</Text>
                    </View>
                </ScrollView>

                {/* ** Display Questions Table */}

                

            </View>
        )
    }
}

export default connect()(GroupDashboard);

const styles = StyleSheet.create({
    mainViewContainer: { marginLeft: 70, height: 810, marginTop: 70 },
    smMainViewContainer: { marginLeft: 5, height: 503, zIndex: -1 },
    innerContainer: {
        marginTop: 10,
        marginLeft: 30,
        // paddingLeft: 50,
        marginRight: 10,
        display: "flex",
        flexWrap: "wrap",
        height: 800,

    },
    smInnerContainer: {
        marginTop: 10,
        marginLeft: 5,
        //paddingLeft: 70,
        marginRight: 7,
        paddingRight: 7,
        display: "flex",
        height: 490,
    },
    headerGroupDashboard: { fontWeight: "900", fontSize: 30 },
    blankTextStyle: {},
    imageAndNameView: { flexDirection: "row", flexWrap: "wrap" },
    headerView: { flexDirection: 'row', justifyContent: "space-between", marginBottom: 20 },
    smHeaderView: { flexDirection: "column", marginBottom: 20 },
    pageOpacity: {
        opacity: 0.2
    },
    headerSmallText: { marginBottom: 50, color: "#686662", fontSize: 18 },
    smHeaderSmallText: { marginBottom: 20, color: "#686662", fontSize: 18 },

    pageOpacityNone: {

    },
    buyAndSellPageHeadText: {
        fontSize: 16
    },
})