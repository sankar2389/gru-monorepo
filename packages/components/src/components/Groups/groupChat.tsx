import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { UserRatesCard } from "../common";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput, ImageBackground } from "react-native";
import { getGroupsList } from "../../actions";
import moment from "moment";


interface IProps extends RouteComponentProps {
    group: IGroup,
    getGroupsList: (creator: string) => void,

};

interface IState {
    chatButtonType: string,
    groupName: "",
    createdAt: any,
    memgers: number,
    replyText: string
}

class GroupChat extends Component<IProps, IState> {
    state: IState = {
        chatButtonType: "group",
        groupName: "",
        createdAt: "",
        memgers: 0,
        replyText: ""

    }
    constructor(props: IProps) {
        super(props);

    }

    async componentDidMount() {
        console.log("this.props", this.props.location.state.group)
        if (this.props.location.state.group.groupName) {
            this.setState({
                groupName: this.props.location.state.group.groupName,
                createdAt: this.props.location.state.group.createdAt,
                memgers: this.props.location.state.group.members || 0
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
        alert("sumbited")
    }

    onPressSelectGroup = (group: any) => {
        console.log(group)
        this.setState({
            groupName: group.groupName,
            createdAt: group.createdAt,
            memgers: group.members || 0
        })
    }


    render() {
        const { groups } = this.props.group
        return (
            <View style={styles.chatView}>
                <View style={styles.pageHeightView}>

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
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={styles.groupNameText}>
                                                                {group.groupName}
                                                            </Text>
                                                            <Text style={styles.memberLenght}>10</Text>
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
                                    {moment(this.state.createdAt).format('h:mm')} | {this.state.memgers} Members
                                </Text>
                            </View>
                        </View>

                        <View style={styles.messageView}>
                            <View style={styles.receiveMessageView}>
                                <Text style={styles.receiveMessaageText}>Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message </Text>
                                <Text style={styles.receiveMessaageText}>Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message Receive message </Text>
                            </View>
                            <View style={styles.sendMessageView}>
                                <Text style={styles.sendMessageText}>
                                    Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message </Text>
                                <Text style={styles.sendMessageText}>
                                    Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message
                                    </Text>
                                <Text style={styles.sendMessageText}>
                                    Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message </Text>

                                <Text style={styles.sendMessageText}>
                                    Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message </Text>

                                <Text style={styles.sendMessageText}>
                                    Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message </Text>

                                <Text style={styles.sendMessageText}>
                                    Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message </Text>

                                <Text style={styles.sendMessageText}>
                                    Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message </Text>
                                <Text style={styles.sendMessageText}>
                                    Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message </Text>
                                <Text style={styles.sendMessageText}>
                                    Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message </Text>
                                <Text style={styles.sendMessageText}>
                                    Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message Send message </Text>


                            </View>

                        </View>

                        <View style={styles.messageWriteView}>
                            <TextInput style={styles.writeMessageTextInput}
                                placeholder={"Write a reply..."}
                                multiline={true}
                                numberOfLines={4}
                                value={this.state.replyText}
                                onChangeText={(replyText) => this.onHandelChangeReplyInput(replyText)}
                            />
                            <View style={styles.sendButtonView}>
                                <TouchableOpacity style={styles.sendButtom}
                                    onPress={() => this.onPressReplyMessage()}
                                >
                                    <Text style={styles.sendButtonText}>Reply</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                    {/* RIGHT SIDE MESSAGE PART END */}
                </View>
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
        display: "flex"

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
    pageHeightView: { backgroundColor: "#f4f5f9", flexDirection: "row", flex: 1 },
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
    groupView: { height: "83vh", overflowY: "scroll" },
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
    memberLenght: { backgroundColor: "tomato", color: "#ffffff", borderRadius: 20, padding: 1, fontSize: 14 },
    rightSideView: { flex: 5, },
    messageView: {
        paddingLeft: 20, paddingRight: 100, marginTop: 20, height: "44%",
        overflowY: "scroll", backgroundColor: "#f0f0f0"
    },
    receiveMessageView: {
        alignItems: "flex-start", paddingTop: 15, marginRight: 650,
    },
    sendMessageView: { alignItems: "flex-start", paddingTop: 15, marginLeft: 650, },
    messageWriteView: { alignItems: "center", backgroundColor: "#f0f0f0" },
    writeMessageTextInput: { width: "92%", height: "70%", marginTop: 5, backgroundColor: "#ffffff", borderRadius: 5, padding: 10 },
    receiveMessaageText: { backgroundColor: "#DCDCDC", borderRadius: 10, padding: 10 },
    sendButtonView: { width: "92%", alignItems: "flex-end", marginTop: 5 },
    sendMessageText: { backgroundColor: "#ffffff", borderRadius: 10, padding: 10 },
    sendButtom: { paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: "#DC143C", borderRadius: 5 },
    sendButtonText: { fontStyle: "italic", fontFamily: "Open Sans", color: "#ffffff" }
});