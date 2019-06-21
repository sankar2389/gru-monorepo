import React, { Component } from "react";
import { IReduxState, } from "../../types";
import { connect } from "react-redux";
import moment from "moment";
import { View, StyleSheet, Text, TouchableOpacity, Image, } from "react-native";

interface IProps {
    groups: any,
    groupName: string,
    onPressSelectGroupOrPeople: Function

}
interface IState {
    groupName: string,
}

class GroupChat extends Component<IProps, IState> {
    state: IState = {
        groupName: this.props.groupName || "",
    }
    constructor(props: IProps) {
        super(props);

    }
    render() {
        return (
            this.props.groups.length > 0 ?
                <View style={styles.groupView}>
                    {
                        this.props.groups.map((group: any, index: number) => {
                            if (group.groupName !== this.state.groupName) {
                                return (
                                    <TouchableOpacity key={index} onPress={() => this.props.onPressSelectGroupOrPeople(group, "group")}>
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
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }

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
export default connect<IReduxState>(mapStateToProps)(GroupChat);

const styles = StyleSheet.create({

    avatarStyle: {
        height: 50,
        width: 50,
        backgroundColor: "#bfbfbf",
        borderRadius: 50,
    },
    groupView: { height: "85%", overflowY: "scroll" },
    groupNameView: { flex: 1, marginLeft: 20, alignItems: "flex-start", },
    groupNameText: { flexWrap: "wrap", fontWeight: "900" },
    groupDateTime: { marginBottom: 10, color: "gray", fontSize: 12 },
    groupListView: {
        padding: 20, flexDirection: "row", justifyContent: "space-around",
        borderColor: "#E5DFDF", borderWidth: 1,
    },
    selectedGroup: { backgroundColor: "#f0f0f0" },
    memberLenght: {
        backgroundColor: "tomato", borderRadius: 50, height: 25, width: 25, marginLeft: 5, justifyContent: "center"
    },
    memberLengthText: { color: "#ffffff" },
    rightSideView: { flex: 5, },

});