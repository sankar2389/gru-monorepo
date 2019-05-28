import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { getGroupsList } from "../../actions";
import io from 'socket.io-client';
import moment from "moment";
const SOCKET_SERVER_API = process.env.SOCKET_SERVER_API;


interface IProps extends RouteComponentProps {
    group: IGroup,
    getGroupsList: (creator: string) => void,

};

interface IState {
    chatButtonType: string,
    groupName: "",
    createdAt: any,
    members: number,
    replyText: string,
    sendMessage: any
}

class GroupChat extends Component<IProps, IState> {
    state: IState = {
        chatButtonType: "group",
        groupName: "",
        createdAt: "",
        members: 0,
        replyText: "",
        sendMessage: []

    }
    constructor(props: IProps) {
        super(props);

    }

    async componentDidMount() {
        const authtoken = await AsyncStorage.getItem('token')
        console.log(SOCKET_SERVER_API);
        
        const socket = io(SOCKET_SERVER_API + '', {
            query: { token: authtoken }
        });
        if (this.props.location.state.group.groupName) {
            this.setState({
                groupName: this.props.location.state.group.groupName,
                createdAt: this.props.location.state.group.createdAt,
                members: this.props.location.state.group.members || 0
            })
        }
        let user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getGroupsList(user.email);
    }

    onPressSetChatButton = (buttonType: string) => {
        this.setState({
            chatButtonType: buttonType
        })
    }

    async onPressGetGroupDetails() {
        let user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getGroupsList(user.email);
    }

    onHandelChangeReplyInput = (replyText: string) => {
        this.setState({
            replyText: replyText
        })
    }

    onPressReplyMessage = () => {
        let sendMessage = this.state.sendMessage;
        sendMessage.push(this.state.replyText)
        this.setState({
            sendMessage: sendMessage,
            replyText: "",
        })
        //this._root.focus()

    }

    onPressSelectGroup = (group: any) => {
        this.setState({
            groupName: group.groupName,
            createdAt: group.createdAt,
            members: group.members || 0
        })
    }


    render() {
        const { groups } = this.props.group;

        return (
            <View style={styles.chatView}>
                {/* LEFT SIDE MESSAGE PART START */}
                <View style={styles.flexLeftView}>
                    <View style={styles.textAndAddButtonView}>
                        <TextInput
                            //value={this.state.search}
                            placeholder={'Search group, people'}
                            style={styles.inputStyle}
                        />
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.chatTypeView}>
                        <TouchableOpacity style={this.state.chatButtonType === "all" ?
                            [styles.selectedChatButton, styles.chatTypeButton] : styles.chatTypeButton}
                            onPress={() => { this.onPressSetChatButton("all") }}
                        >
                            <Text>ALL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.chatButtonType === "people" ?
                            [styles.selectedChatButton, styles.chatTypeButton] : styles.chatTypeButton}
                            onPress={() => { this.onPressSetChatButton("people") }}>
                            <Text>PEOPLE</Text>
                        </TouchableOpacity >
                        <TouchableOpacity style={this.state.chatButtonType === "group" ?
                            [styles.selectedChatButton, styles.chatTypeButton] : styles.chatTypeButton}
                            onPress={() => { this.onPressSetChatButton("group") }}>
                            <Text>GROUP</Text>
                        </TouchableOpacity>
                    </View>
                    {/* MAP ON GROUP LIST */}
                    {groups.length > 0 ?
                        <View style={styles.groupView}>
                            {
                                groups.map((group, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => this.onPressSelectGroup(group)}>
                                            <View style={this.state.groupName === group.groupName ?
                                                [styles.groupListView, styles.selectedGroup] : styles.groupListView}>
                                                <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>

                                                <View style={styles.groupNameView}>
                                                    <View style={{ flexDirection: "row", }}>
                                                        <Text style={styles.groupNameText}>
                                                            {group.groupName}
                                                        </Text>
                                                        <View style={styles.memberLenght}>
                                                            <Text style={styles.memberLengthText}>16</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={styles.groupDateTime}>
                                                        {moment(group.createdAt).fromNow()} {moment(group.createdAt).format('h:mm')} | {group.members.length} Members
                                                        </Text>
                                                    <Text>
                                                        Last message
                                                        </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                        :
                        <Text />
                    }
                </View>
                {/* LEFT SIDE MESSAGE PART END */}


                {/* RIGHT SIDE MESSAGE PART START */}
                <View style={styles.rightSideView}>
                    <View style={styles.rightSideListView}>
                        <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>
                        <View style={styles.groupNameView}>
                            <Text style={styles.groupNameText}>
                                {this.state.groupName}
                            </Text>

                            <Text style={styles.groupDateTime}>
                                {moment(this.state.createdAt).fromNow()} {""}
                                {moment(this.state.createdAt).format('h:mm')} | {this.state.members} Members
                                </Text>
                        </View>
                    </View>

                    <View style={styles.messageView}>
                        <View style={styles.receiveMessageView}>
                            <Text style={styles.receiveMessaageText}>
                                Receive message Receive message  Receive message Receive message  Receive message Receive message Receive message Receive message Receive message Receive message
                            </Text>
                        </View>
                        {this.state.sendMessage.length > 0 ?
                            <View style={styles.sendMessageView}>
                                {this.state.sendMessage.map((sendMsg: string, index: number) => {
                                    return (
                                        <Text style={styles.sendMessageText} key={index}>
                                            {"sendMsg"}
                                            {"sendMsg"}
                                            {"sendMsg"}
                                            {"sendMsg"}
                                            {"sendMsg"}
                                            {"sendMsg"}
                                            {"sendMsg"}
                                            {"sendMsg"}
                                            {"sendMsg"} {"sendMsg"} {"sendMsg"} {"sendMsg"} {"sendMsg"} {"sendMsg"} {"sendMsg"} {"sendMsg"} {"sendMsg"} {"sendMsg"} {"sendMsg"}
                                        </Text>
                                    )
                                })}

                            </View>
                            :
                            <Text />
                        }
                    </View>


                    <View style={styles.messageWriteView}>
                        <TextInput style={styles.writeMessageTextInput}
                            //ref={component => this._root = component}
                            autoFocus={true}
                            placeholder={"Write a reply..."}
                            multiline={true}
                            numberOfLines={4}
                            value={this.state.replyText}
                            onChangeText={(replyText) => this.onHandelChangeReplyInput(replyText)}
                        />
                        <View style={styles.sendButtonView}>
                            <TouchableOpacity style={this.state.replyText ? styles.sendButtom : styles.sendButtonDisable}
                                onPress={() => this.onPressReplyMessage()}
                                disabled={this.state.replyText ? false : true}
                            >
                                <Text style={styles.sendButtonText}>Reply</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
                {/* RIGHT SIDE MESSAGE PART END */}
            </View>
        )
    }
}

const mapStateToProps = ({ auth, group }: any): IReduxState => {
    return { auth, group };
};
// @ts-ignore
export default connect<IReduxState>(mapStateToProps, { getGroupsList })(GroupChat);

const styles = StyleSheet.create({
    chatView: {
        backgroundColor: "#f4f5f9",
        marginTop: 70,
        marginLeft: 70,
        paddingTop: 50,
        paddingRight: 50,
        paddingBottom: 50,
        display: "flex",
        flexDirection: "row", flex: 1
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
    flexLeftView: { flex: 1.5 },
    textAndAddButtonView: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    addButton: { backgroundColor: "tomato", padding: 10, borderRadius: 50, height: 40, width: 40 },
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
        paddingLeft: 20, paddingRight: 100, marginTop: 20, height: "70%",
        backgroundColor: "#f0f0f0", overflowY: "scroll"
    },
    receiveMessageView: {
        alignItems: "flex-start", paddingTop: 15, marginRight: 650,
    },
    sendMessageView: { alignItems: "flex-start", paddingTop: 15, marginLeft: 650, },
    messageWriteView: { alignItems: "center", backgroundColor: "#f0f0f0" },
    writeMessageTextInput: { width: "92%", height: "70%", marginTop: 5, backgroundColor: "#ffffff", borderRadius: 5, padding: 10, margin: 5 },
    receiveMessaageText: { backgroundColor: "#DCDCDC", borderRadius: 10, padding: 10, },
    sendButtonView: { width: "92%", alignItems: "flex-end", marginTop: 5 },
    sendMessageText: { backgroundColor: "#ffffff", borderRadius: 10, padding: 10, margin: 5 },
    sendButtom: { paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: "#DC143C", borderRadius: 5 },
    sendButtonDisable: { paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: "gray", borderRadius: 5 },
    sendButtonText: { fontStyle: "italic", fontFamily: "Open Sans", color: "#ffffff" }
});