import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from "react-native";
import { fetchGroupQA } from "../../actions"
import { IReduxState } from "../../types";
import moment from "moment";

interface IProps {
    fetchGroupQA: (groupID: string) => void
    location: any,
    group: any
}

interface IState {
    dWidth: number;
    questionData: any[];
}

class GroupDashboard extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            dWidth: 0,
            questionData: [],
        }
    }

    async componentDidMount() {
        await this.props.fetchGroupQA(this.props.location.state.groupID)
        window.addEventListener("resize", this.updateDimension);
    }

    componentWillReceiveProps(newProps: IProps) {
        this.setState({ questionData: newProps.group.questions.questions })

    }

    async componentWillMount() {
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

                    {/*  Table header */}

                    <View style={styles.tableHeaderStyles}>
                        <View style={{ flex: 2 }}>
                            <Text style={[styles.tableColumnText, { color: "#888" }]}>Title</Text>
                        </View>
                        <View style={styles.tableColumnView}>
                            <Text style={[styles.tableColumnText, { color: "#888" }]}>Creator</Text>
                        </View>
                        <View style={styles.tableColumnView}>
                            <Text style={[styles.tableColumnText, { color: "#888" }]}>Answers</Text>
                        </View>
                        <View style={styles.tableColumnView}>
                            <Text style={[styles.tableColumnText, { color: "#888" }]}>Last Activity</Text>
                        </View>

                    </View>

                    {/* ** Display Questions Table */}
                    {this.state.questionData && this.state.questionData.length > 0 && this.state.questionData.map((question: any) => (
                        <TouchableOpacity style={styles.tableRowStyles}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.tableRowText, { color: "#555" }]}>{question.title}</Text>
                            </View>
                            <View style={styles.tableRowView}>
                                <Text style={[styles.tableRowText, { color: "#555" }]}>{question.creator.username}</Text>
                            </View>
                            <View style={styles.tableRowView}>
                                <Text style={[styles.tableRowText, { color: "#555" }]}>{Object.keys(question.comments).length}</Text>
                            </View>
                            <View style={styles.tableRowView}>
                                <Text style={[styles.tableRowText, { color: "#555" }]}>{moment(question.updatedAt).fromNow()}</Text>
                            </View>

                        </TouchableOpacity>
                    ))}

                </ScrollView>

            </View>
        )
    }
}

function mapStateToProps({ auth, group }: any): IReduxState {
    return {
        auth,
        group
    }
}

export default connect<IReduxState>(mapStateToProps, { fetchGroupQA })(GroupDashboard);

const styles = StyleSheet.create({
    mainViewContainer: { marginLeft: 55, height: 810, marginTop: 70 },
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
    imageAndNameView: { flexDirection: "row", flexWrap: "wrap" },
    headerView: { flexDirection: 'row', justifyContent: "space-between", marginBottom: 20 },
    smHeaderView: { flexDirection: "column", marginBottom: 20 },
    pageOpacity: {
        opacity: 1
    },
    headerSmallText: { marginBottom: 50, color: "#686662", fontSize: 18 },
    smHeaderSmallText: { marginBottom: 20, color: "#686662", fontSize: 18 },

    pageOpacityNone: {

    },
    buyAndSellPageHeadText: {
        fontSize: 16
    },
    textItemView: {
        flex: 1,
        flexWrap: "wrap",
        justifyContent: "space-around"
    },
    nestedGroupListView: {
        padding: 8,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    smNestedGroupListView: {
        padding: 8,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    userNameText: { flexWrap: "wrap", paddingTop: 10, fontWeight: "900", fontSize: 14 },

    tableHeaderStyles: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100vw",
        flexDirection: "row",
        flexWrap: "nowrap",
        backgroundColor: 'transparent',
        margin: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#aaa",
        padding: 10

    },
    tableColumnView: {
        flex: 1,
    },
    tableColumnText: {
        fontSize: 21
    },
    tableRowStyles: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100vw",
        flexDirection: "row",
        flexWrap: "nowrap",
        backgroundColor: '#fff',
        margin: 10,
        padding: 10

    },
    tableRowView: {
        flex: 1,
    },
    tableRowText: {
        fontSize: 21
    }



})