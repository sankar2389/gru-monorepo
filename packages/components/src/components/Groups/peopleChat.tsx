import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput, ScrollView } from "react-native";

//import CustomMessage from "../common/customMessage"

interface IProps {
    groups: any,
    peopleName: string,
    onPressConnect: Function

}
interface IState {
    peopleName: string,
}

class PeopleChat extends Component<IProps, IState> {
    state: IState = {
        peopleName: this.props.peopleName || "",
    }
    constructor(props: IProps) {
        super(props);

    }
    render() {
        // const { groups, messages } = this.props;
        console.log(this.state.peopleName)
        return (
            this.props.groups.length > 0 ?
                <View style={styles.groupView}>
                    {
                        this.props.groups.map((group: any, index: number) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => this.props.onPressConnect(index, group.socketid)}>
                                    <View style={styles.groupListView}>
                                        <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>
                                        <View style={styles.groupNameView}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={styles.groupNameText}>
                                                    {group.groupName}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text>{group.socketid}</Text>
                                            </View>
                                            {/* <Text style={styles.groupDateTime}>
                                                {moment(group.createdAt).fromNow()} {moment(group.createdAt).format('h:mm')} | {group.members.length} Members
                                                </Text> */}
                                            <Text>Last message</Text>
                                            {/* <View style={{ width: "105%", alignItems: "flex-end" }}>
                                                {group.connected === true ?
                                                    <TouchableOpacity onPress={() => this.onPressLeave(index)}>
                                                        <Text>Leave</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity onPress={() => this.onPressConnect(index, group.socketid)}>
                                                        <Text>Connect</Text>
                                                    </TouchableOpacity>
                                                }
                                            </View> */}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                :
                <Text />
        )
    }
}



const mapStateToProps = ({ auth, group, webrtc }: any): IReduxState => {
    return { auth, group, webrtc };
};
// @ts-ignore
export default connect<IReduxState>(mapStateToProps)(PeopleChat);

const styles = StyleSheet.create({
    mainView: {
        zIndex: -1
    },
    chatView: {
        backgroundColor: "#f4f5f9",
        marginTop: 70,
        marginLeft: 70,
        paddingTop: 50,
        paddingRight: 50,
        paddingBottom: 50,
        display: "flex",
        flexDirection: "row", flex: 1,
        height: "92.5vh",
        zIndex: -1
    },
    inputStyle: {
        height: 30,
        borderColor: '#ededed',
        borderBottomWidth: 1,
        margin: 15,
        backgroundColor: "rgba(226,226,226, 0.8)",
        borderRadius: 20,
        padding: 20,
        width: "70%",
    },
    customMessageView: {
        marginLeft: 70
    },
    flexLeftView: { flex: 1.8, height: "82vh" },
    textAndAddButtonView: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    addButton: { backgroundColor: "tomato", borderRadius: 50, height: 40, width: 40, paddingTop: 5 },
    addButtonText: { color: "#ffffff", fontWeight: "900", fontSize: 18 },
    chatTypeView: { flexDirection: "row", justifyContent: "space-around" },
    chatTypeButton: { padding: 10 },
    selectedChatButton: {
        borderBottomWidth: 2, borderBottomColor: "#9b8325", marginBottom: 5
    },
    avatarStyle: {
        height: 50,
        width: 50,
        backgroundColor: "#bfbfbf",
        borderRadius: 50,
        // marginLeft: 50

    },
    groupView: { height: "85%", overflowY: "scroll" },
    groupNameView: { flex: 1, marginLeft: 20, alignItems: "flex-start", },
    groupNameText: { flexWrap: "wrap", fontWeight: "900" },
    groupDateTime: { marginBottom: 10, color: "gray", fontSize: 12 },
    groupListView: {
        padding: 20, flexDirection: "row", justifyContent: "space-around",
        borderColor: "#E5DFDF", borderWidth: 1,
    },

    rightSideListView: {
        padding: 22, flexDirection: "row", justifyContent: "space-around",
        borderLeftColor: "#E5DFDF", borderLeftWidth: 1,
    },
    selectedGroup: { backgroundColor: "#f0f0f0" },
    memberLenght: {
        backgroundColor: "tomato", borderRadius: 50, height: 25, width: 25, marginLeft: 5, justifyContent: "center"
    },
    memberLengthText: { color: "#ffffff" },
    rightSideView: { flex: 5, },
    messageView: {
        // paddingLeft: 20, paddingRight: 100, marginTop: 20, height: "70%",
        //  
        height: "70%", backgroundColor: "#f0f0f0", overflowY: "scroll",
    },
    innerMessageView: { justifyContent: "space-between" },
    receiveMessageView: {
        //alignItems: "flex-start", paddingBottom: 25, marginRight: 650,
        width: "40%", backgroundColor: "#DCDCDC", borderRadius: 10, paddingTop: 10, paddingBottom: 10, flexDirection: "row", paddingLeft: 5, marginBottom: 10
    },
    messageTimeText: { fontSize: 12, alignSelf: "flex-start", marginLeft: 9 },
    // receiveMessaageTimeText: { fontSize: 12 },
    sendMessageView: {
        alignSelf: "flex-end", flexDirection: "row", width: "40%", backgroundColor: "#ffffff",
        borderRadius: 10, paddingTop: 10, paddingBottom: 10, paddingLeft: 5, marginBottom: 5
    },
    messageWriteView: { alignItems: "center", backgroundColor: "#f0f0f0", padding: 9 },
    writeMessageTextInput: { width: "92%", height: 60, backgroundColor: "#ffffff", borderRadius: 5, padding: 10, },
    receiveMessaageText: { alignSelf: "flex-start", marginLeft: 10 },
    sendButtonView: { width: "92%", alignItems: "flex-end", marginTop: 5, padding: 10 },
    sendMessageText: { alignSelf: "flex-start", marginLeft: 10 },
    sendButtom: { paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: "#DC143C", borderRadius: 5 },
    sendButtonDisable: { paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: "gray", borderRadius: 5 },
    sendButtonText: { fontStyle: "italic", fontFamily: "Open Sans", color: "#ffffff" }
});