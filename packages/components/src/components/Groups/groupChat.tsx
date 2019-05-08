import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { UserRatesCard } from "../common";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput } from "react-native";
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
    memgers: number
}

class GroupChat extends Component<IProps, IState> {
    state: IState = {
        chatButtonType: "",
        groupName: "",
        createdAt: "",
        memgers: 0

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


    render() {
        const { groups } = this.props.group
        return (
            <View style={styles.chatView}>
                <View style={styles.pageHeightView}>
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
                            <View style={{ height: "83vh", overflow: "scroll" }}>
                                {
                                    groups.map((group, index) => {
                                        return (
                                            <TouchableOpacity key={index}>
                                                <View style={styles.groupListView}>
                                                    <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>

                                                    <View style={styles.groupNameView}>
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={styles.groupNameText}>
                                                                {group.groupName}
                                                            </Text>
                                                            <Text style={{ backgroundColor: "red", color: "#ffffff", borderRadius: 20, padding: 1, fontSize: 14 }}>10</Text>
                                                        </View>
                                                        <Text style={styles.groupDateTime}>
                                                            created on : {moment(group.createdAt).fromNow()} {moment(group.createdAt).format('h:mm')} | {group.members.length} Members
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
                    <View style={{ flex: 5, backgroundColor: "yellow" }}>
                        <View style={styles.groupListView}>
                            <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>

                            <View style={styles.groupNameView}>

                                <Text style={styles.groupNameText}>
                                    {this.state.groupName}

                                </Text>


                                <Text style={styles.groupDateTime}>
                                    {moment(this.state.createdAt).fromNow()}
                                    {moment(this.state.createdAt).format('h:mm')} |
                                    {this.state.memgers} Members
                                            </Text>

                            </View>
                        </View>
                    </View>
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
        padding: 50,
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
    pageHeightView: { height: "89.2vh", backgroundColor: "#f4f5f9", flexDirection: "row", flex: 1 },
    flexLeftView: { flex: 1.5 },
    textAndAddButtonView: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    addButton: { backgroundColor: "tomato", padding: 10, borderRadius: 50, height: 40, width: 40 },
    addButtonText: { color: "#ffffff", fontWeight: "900", fontSize: 18 },
    chatTypeView: { flexDirection: "row", justifyContent: "space-around" },
    chatTypeButton: { padding: 10 },
    selectedChatButton: {
        borderBottomWidth: 2, borderBottomColor: "#9b8325"
    },
    avatarStyle: {
        height: 50,
        width: 50,
        backgroundColor: "#bfbfbf",
        borderRadius: 50,
        // marginLeft: 50

    },
    groupNameView: { flex: 1, marginLeft: 20, alignItems: "flex-start", },
    groupNameText: { flexWrap: "wrap", fontWeight: "900" },
    groupDateTime: { marginBottom: 10, color: "gray", fontSize: 12 },
    groupListView: {
        padding: 10, flexDirection: "row", justifyContent: "space-around",
        borderBottomColor: "gray", borderBottomWidth: 1,
    }
});