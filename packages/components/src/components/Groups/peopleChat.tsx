import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput, ScrollView } from "react-native";

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
        console.log(this.state.peopleName)
        return (
            this.props.groups.length > 0 ?
                <View style={styles.groupView}>
                    {
                        this.props.groups.map((group: any, index: number) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => this.props.onPressConnect(index, group.socketid)}
                                    disabled={this.props.peopleName == group.groupName ? true : false}>
                                    <View style={this.props.peopleName === group.groupName ?
                                        [styles.groupListView, styles.selectedGroup] : styles.groupListView}>
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
                                            <Text>Last message</Text>
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
    avatarStyle: {
        height: 50,
        width: 50,
        backgroundColor: "#bfbfbf",
        borderRadius: 50,
    },
    groupView: { height: "85%", overflowY: "scroll" },
    groupNameView: { flex: 1, marginLeft: 20, alignItems: "flex-start", },
    groupNameText: { flexWrap: "wrap", fontWeight: "900" },
    groupListView: {
        padding: 20, flexDirection: "row", justifyContent: "space-around",
        borderColor: "#E5DFDF", borderWidth: 1,
    },
    selectedGroup: { backgroundColor: "#f0f0f0" }
});