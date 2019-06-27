import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { getGroupsList, webSocketMiddlewareConnectOrJoin, webSocketDisconnect, webSocketConnect, onSendMessage, saveSocketIdInUser } from "../../actions";
import moment from "moment";
import PeopleChat from "./peopleChat"
import GroupChat from "./groupChat"
import CustomeMessage from "../common/customMessage"

interface IProps extends RouteComponentProps {
    group: IGroup,
    getGroupsList: (creator: string) => void,
    webSocketMiddlewareConnectOrJoin: (type: string, groupName: string) => void,
    webSocketDisconnect: () => void,
    webSocketConnect: (socketId: any) => void,
    onSendMessage: (groupId: string, replayText: string) => void,
    groups: any,
    saveSocketIdInUser: (_id: any, socketId: any) => void
};

interface IMsg {
    from: string,
    message: string,
    time: any,
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
    groupId: string,
    connectionMessage: boolean,
    peopleTabCount: number,
    messageBackup: any,
    socketId: string

}

class Chat extends Component<IProps, IState> {
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
        groupId: "",
        connectionMessage: false,
        peopleTabCount: 0,
        messageBackup: [],
        socketId: ""

    }
    constructor(props: IProps) {
        super(props);
    }

    async componentWillReceiveProps(newProps: any) {
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        if (newProps.webrtc.socketids.length > 0) {
            const { groups } = this.props.group;
            const { messages } = this.state;
            const { socketids, message, socketId } = newProps.webrtc;
            // socketids.forEach((sid: any, i: number) => {
            //     groups[i].socketid = sid;
            //     groups[i].connected = false;
            // });

            if (this.state.messageBackup.length > 0) {
                this.setState({ messages: this.state.messageBackup, messageBackup: [] })
            } else {
                if (message.message !== undefined) {
                    messages.push(message)
                }
            }
            this.setState({
                socketids,
                groups,
                messages,
                socketId
            });
            if (socketId) {
                this.props.saveSocketIdInUser(user._id, socketId)
            }
        }
        if (newProps.webrtc.connected) {
            this.setState({
                connectionMessage: true
            })
        }
    }

    clearMessageState = () => {
        this.setState({ connectionMessage: false, })
    }

    async componentWillMount() {
        this.props.webSocketMiddlewareConnectOrJoin("CONNECT", "")
    }

    async componentDidMount() {
        if (this.props.location.state.group.groupName) {
            this.setState({
                groupName: this.props.location.state.group.groupName,
                createdAt: this.props.location.state.group.createdAt,
                members: this.props.location.state.group.members || 0,
                groupId: this.props.location.state.group._id
            })
        }
        let user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getGroupsList(user.email);
        this.joinGroup(this.props.location.state.group);

    }

    onPressSetChatButton = (buttonType: string) => {
        this.setState({
            chatButtonType: buttonType,

        })
        if (buttonType === "people") {
            if (this.state.peopleTabCount === 0) {
                this.setState({ peopleTabCount: 1 })
                this.props.webSocketMiddlewareConnectOrJoin("JOIN", "COMMONPEOPLE")
            } else {
                return;
            }

        } else if (buttonType === "group") {
            this.props.webSocketMiddlewareConnectOrJoin("JOIN", "Group")
        }
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
        let messageData = {
            groupId: this.state.groupId,
            message: this.state.replyText
        }
        let message = JSON.stringify(messageData)
        messages.push({ from: "self", time: new Date(), message })
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

    onPressSelectGroupOrPeople = (joinName: any, type: string) => {
        if (type === "group") {
            this.joinGroup(joinName);
        } else {
            this.joinGroup(joinName);
        }
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
            groupId: group._id,
            messageBackup: this.state.messages
        })
        if (this.state.socketids.length > 0) {
            this.props.webSocketConnect(socketId)
        }
    }

    renderChat() {
        switch (this.state.chatButtonType) {
            case "group": return <GroupChat
                groupName={this.state.groupName}
                groups={this.state.groups}
                onPressSelectGroupOrPeople={this.onPressSelectGroupOrPeople}
            />;
            case "people": return <PeopleChat
                peopleName={this.state.groupName}
                groups={this.state.groups}
                onPressConnect={this.onPressConnect}

            />;
            case "all": return <Text>All</Text>;
        }
    }

    render() {
        const { messages } = this.state;
        return (
            <View style={styles.mainView}>
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

                        {/* START CHAT TYPE RENDER */}
                        {this.renderChat()}
                        {/* END CHAT TYPE RENDER */}
                    </View>
                    {/* LEFT SIDE MESSAGE PART END */}

                    {/* RIGHT SIDE MESSAGE PART START */}
                    <View style={styles.rightSideView}>
                        {this.state.groupName ?
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

                                        let parseMessage = JSON.parse(msg.message)
                                        if (parseMessage.groupId === this.state.groupId) {
                                            return (
                                                <View style={msg.from === "self" ? styles.sendMessageView : styles.receiveMessageView} key={index}>
                                                    <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>
                                                    <View>
                                                        <Text style={{ marginLeft: 10 }}>
                                                            {"User Name"}
                                                        </Text>
                                                        <Text style={msg.from === "self" ? styles.sendMessageText : styles.receiveMessaageText}>
                                                            {parseMessage.message}
                                                        </Text>
                                                        <Text style={styles.messageTimeText} >
                                                            {moment(msg.time).format('LT')}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )
                                        }

                                    })}
                                </View> :
                                <Text />}
                        </View>

                        <View style={styles.messageWriteView}>
                            <TextInput style={styles.writeMessageTextInput}
                                autoFocus={true}
                                editable={this.state.groupConnected ? true : false}
                                placeholder={this.state.groupConnected ? "Write a reply..." : "Unable to establish connection to the messaging server. Please reload and try again."}
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
                {this.state.connectionMessage ?
                    <CustomeMessage
                        type={"success"}
                        message={"You are connected to socket"}
                        openMessage={this.state.connectionMessage}
                        clearMessageState={this.clearMessageState}
                    />
                    :
                    <Text />
                }
            </View>
        )
    }
}

const mapStateToProps = ({ auth, group, webrtc }: any): IReduxState => {
    return { auth, group, webrtc };
};
// @ts-ignore
export default connect<IReduxState>(mapStateToProps, { getGroupsList, webSocketMiddlewareConnectOrJoin, webSocketDisconnect, webSocketConnect, onSendMessage, saveSocketIdInUser })(Chat);

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
    },
    groupNameView: { flex: 1, marginLeft: 20, alignItems: "flex-start", },
    groupNameText: { flexWrap: "wrap", fontWeight: "900" },
    groupDateTime: { marginBottom: 10, color: "gray", fontSize: 12 },

    rightSideListView: {
        padding: 22, flexDirection: "row", justifyContent: "space-around",
        borderLeftColor: "#E5DFDF", borderLeftWidth: 1,
    },
    rightSideView: { flex: 5, },
    messageView: {
        height: "70%", backgroundColor: "#f0f0f0", overflowY: "scroll",
    },
    innerMessageView: { justifyContent: "space-between" },
    receiveMessageView: {
        width: "40%", backgroundColor: "#DCDCDC", borderRadius: 10, paddingTop: 10, paddingBottom: 10, flexDirection: "row", paddingLeft: 5, marginBottom: 10
    },
    messageTimeText: { fontSize: 12, alignSelf: "flex-start", marginLeft: 9 },
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