import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput, ScrollView } from "react-native";
import { getGroupsList, webSocketMiddlewareConnectOrJoin, webSocketDisconnect, webSocketConnect, onSendMessage, connected } from "../../actions";
import moment from "moment";

interface IProps extends RouteComponentProps {
    group: IGroup,
    getGroupsList: (creator: string) => void,
    webSocketMiddlewareConnectOrJoin: (type: string, groupName: string) => void,
    webSocketDisconnect: () => void,
    webSocketConnect: (socketId: any) => void,
    onSendMessage: (groupId: string, replayText: string) => void
};

interface IMsg {
    from: string,
    message: string,
    time: any,
    groupId: string
}

interface IState {
    chatButtonType: string,
    groupName: "",
    createdAt: any,
    members: number,
    replyText: string,
    sendMessage: any,
    socketids: any,
    groups: any,
    messages: IMsg[],
    groupConnected: boolean,
    groupId: string

}

class GroupChat extends Component<IProps, IState> {
    state: IState = {
        chatButtonType: "group",
        groupName: "",
        createdAt: "",
        members: 0,
        replyText: "",
        sendMessage: [],
        socketids: [],
        groups: [],
        messages: [],
        groupConnected: false,
        groupId: ""
    }
    constructor(props: IProps) {
        super(props);
    }

    componentWillReceiveProps(newProps: any) {
        if (newProps.webrtc.socketids.length > 0) {
            const { groups } = this.props.group;
            const { messages } = this.state;
            const { socketids, message } = newProps.webrtc;
            socketids.forEach((sid: any, i: number) => {
                groups[i].socketid = sid;
                groups[i].connected = false;
            });
            if (Object.entries(message).length > 0 && message.constructor === Object) {
                messages.push(message)
            }
            this.setState({
                socketids: newProps.webrtc.socketids,
                groups,
                messages
            });
        }
    }

    async componentDidMount() {
        if (this.props.location.state.group.groupName) {
            this.setState({
                groupName: this.props.location.state.group.groupName,
                createdAt: this.props.location.state.group.createdAt,
                members: this.props.location.state.group.members || 0
            })
        }
        let user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getGroupsList(user.email);
        this.joinGroup(this.props.location.state.group);
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
        let messages = this.state.messages;
        messages.push({ from: "self", time: new Date(), groupId: this.state.groupId, message: this.state.replyText })
        this.props.onSendMessage(this.state.groupId, this.state.replyText)
        this.setState({
            messages: messages,
            replyText: "",
        })
    }

    joinGroup = (group: any) => {
        this.setState({
            groupName: group.groupName,
            createdAt: group.createdAt,
            members: group.members || 0
        })
        this.props.webSocketMiddlewareConnectOrJoin("JOIN", group.groupName)
    }

    onPressSelectGroup = (group: any) => {
        this.joinGroup(group);
    }

    onPressLeave = (groupIndex: number) => {
        this.props.webSocketDisconnect()
        const { groups } = this.state;
        groups[groupIndex].connected = false;
        this.setState({
            groupName: "",
            createdAt: "",
            groups,
            groupConnected: false
        })
    }
    onPressConnect = (groupIndex: number, socketId: string) => {
        const { groups } = this.state;
        const group = groups[groupIndex];
        // groups[groupIndex].connected = true;
        for (let i = 0; i < groups.length; i++) {
            if (i === groupIndex) {
                groups[i].connected = true;
            } else {
                groups[i].connected = false;
            }
        }
        this.setState({
            groupName: group.groupName,
            createdAt: group.createdAt,
            members: group.members || 0,
            groups,
            groupConnected: true,
            groupId: group._id
        })
        if (this.state.socketids.length > 0) {
            this.props.webSocketConnect(socketId)
        }
    }

    render() {
        const { groups, messages } = this.state;
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
                                groups.map((group: any, index: number) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => this.onPressSelectGroup(group)}>
                                            <View style={this.state.groupName === group.groupName ?
                                                [styles.groupListView, styles.selectedGroup] : styles.groupListView}>
                                                <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>

                                                <View style={styles.groupNameView}>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={styles.groupNameText}>
                                                            {group.groupName}
                                                        </Text>
                                                        <View style={styles.memberLenght}>
                                                            <Text style={styles.memberLengthText}>16</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text>{group.socketid}</Text>
                                                    </View>
                                                    <Text style={styles.groupDateTime}>
                                                        {moment(group.createdAt).fromNow()} {moment(group.createdAt).format('h:mm')} | {group.members.length} Members
                                                        </Text>
                                                    <Text>Last message</Text>
                                                    <View style={{ width: "105%", alignItems: "flex-end" }}>
                                                        {group.connected === true ?
                                                            <TouchableOpacity onPress={() => this.onPressLeave(index)}>
                                                                <Text>Leave</Text>
                                                            </TouchableOpacity>
                                                            :
                                                            <TouchableOpacity onPress={() => this.onPressConnect(index, group.socketid)}>
                                                                <Text>Connect</Text>
                                                            </TouchableOpacity>
                                                        }
                                                    </View>
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
                    {this.state.groupName.length > 0 ?
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
                        </View> : <Text>There is no connected group</Text>}

                    <View style={styles.messageView}>
                        {messages.length > 0 ?
                            <View style={styles.innerMessageView}>
                                {messages.map((msg, index) => {
                                    return (
                                        <View style={msg.from === "self" ? styles.sendMessageView : styles.receiveMessageView} key={index}>
                                            <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>
                                            <View>
                                                <Text style={{ marginLeft: 10 }}>
                                                    {"User Name"}
                                                </Text>
                                                <Text style={msg.from === "self" ? styles.sendMessageText : styles.receiveMessaageText}>
                                                    {msg.message}
                                                </Text>
                                                <Text style={styles.messageTimeText} >
                                                    {moment(msg.time).format('LT')}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View> :
                            <Text />}
                    </View>

                    <View style={styles.messageWriteView}>
                        <TextInput style={styles.writeMessageTextInput}
                            //ref={component => this._root = component}
                            autoFocus={true}
                            editable={this.state.groupConnected ? true : false}
                            placeholder={this.state.groupConnected ? "Write a reply..." : "Unable to establish connection to the messaging server. Please reload and try again."}
                            //multiline={true}
                            numberOfLines={4}
                            value={this.state.replyText}
                            onChangeText={(replyText) => this.onHandelChangeReplyInput(replyText)}
                            onSubmitEditing={() => {
                                this.onPressReplyMessage()
                            }}
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

const mapStateToProps = ({ auth, group, webrtc }: any): IReduxState => {
    return { auth, group, webrtc };
};
// @ts-ignore
export default connect<IReduxState>(mapStateToProps, { getGroupsList, webSocketMiddlewareConnectOrJoin, webSocketDisconnect, webSocketConnect, onSendMessage })(GroupChat);

const styles = StyleSheet.create({
    chatView: {
        backgroundColor: "#f4f5f9",
        marginTop: 70,
        marginLeft: 70,
        paddingTop: 50,
        paddingRight: 50,
        paddingBottom: 50,
        display: "flex",
        flexDirection: "row", flex: 1,
        height: "92.5vh"
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
    flexLeftView: { flex: 1.8, height: "82vh" },
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