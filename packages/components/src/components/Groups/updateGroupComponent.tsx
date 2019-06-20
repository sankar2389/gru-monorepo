import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput, ScrollView, TouchableWithoutFeedbackBase } from "react-native";
import { onAddUserToGroup, onRemoveUserFromGroup, searchUser } from '../../actions';
//import AwesomeDebouncePromise from 'awesome-debounce-promise';


interface IProps extends RouteComponentProps {
    group: IGroup,
    editedGroup: any,
    cancelGroupUpdate: Function,
    updateGroup: Function,
    onAddUserToGroup(groupId: any, user: any): () => void,
    onRemoveUserFromGroup(groupId: any, user: any): () => void,
    searchUser(searchString: string): () => void
    auth: any

};

interface IState {
    groupName: string,
    groupId: string
    searchMemberText: string,
    users: any,
    group: any
}

class UpdateGroup extends Component<IProps, IState> {
    state: IState = {
        searchMemberText: "",
        groupId: this.props.editedGroup._id,
        groupName: this.props.editedGroup.groupName,
        group: this.props.editedGroup,
        users: [],

    }
    constructor(props: IProps) {
        super(props);
    }

    componentWillReceiveProps(newProps: any) {
        console.log("newsssssssss", newProps.group.groups)
        if (newProps.auth.users.length > 0) {
            console.log("new", newProps.auth.users)
            this.setState({ users: newProps.auth.users })
        }
        if (newProps.group.groups.length > 0) {
            let group = newProps.group.groups.filter((g: any) => g._id === this.state.groupId)
            this.setState({ group: group[0] })
        }
    }

    onPressSearchUserByUserName = (searchString: string) => {
        this.setState({ searchMemberText: searchString })
        this.props.searchUser(searchString)

    }

    onPressAddUserToGroup = async (user: any) => {
        let groupId = this.state.groupId
        if (groupId && user) {
            this.props.onAddUserToGroup(groupId, user)
        }
    }

    onPressRemoveUserFromGroup = (user: any) => {
        let groupId = this.state.groupId
        if (groupId && user) {
            this.props.onRemoveUserFromGroup(groupId, user)
        }
    }
    componentDidMount() {

    }

    render() {
        console.log("staet", this.state.group)
        return (
            <View style={styles.containerView}>
                <Text>
                    UPDATE GROUP
            </Text>

                <View style={styles.groupNameView}>
                    <Text>Group Name</Text>
                    <TextInput
                        style={styles.inputStyle}
                        autoFocus={true}
                        value={this.state.groupName}
                        onChangeText={(groupName) => this.setState({ groupName: groupName })}
                    />
                </View>
                <View style={styles.buttonView}>

                    <TouchableOpacity style={styles.cancelButton}
                        onPress={() => this.props.cancelGroupUpdate()}
                    >
                        <Text style={styles.buttonText}>
                            Cancel
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.updateButton}
                        onPress={() => this.props.updateGroup(this.props.editedGroup._id, this.state.groupName, this.props.editedGroup.creator)}
                    >
                        <Text style={styles.buttonText}>
                            Update
                    </Text>
                    </TouchableOpacity>
                </View>

                {/* SEARCH MEMBERS */}
                <View>
                    <Text>ADD MEMBERS</Text>
                    <Text>Search Members</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                        <TextInput style={{
                            position: "relative", zIndex: 1, left: 5, height: 50, width: "30%", paddingLeft: 10, paddingRight: 10,
                            backgroundColor: "#ffffff", borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
                        }}
                            placeholder="Search Members"
                            value={this.state.searchMemberText}
                            onChangeText={(name) => this.onPressSearchUserByUserName(name)}
                        >
                        </TextInput>
                        <TouchableOpacity
                            style={{ padding: 5, backgroundColor: "#2196F3", borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                            onPress={() => this.onPressSearchUserByUserName(name)}
                        >
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={{ uri: 'https://image.flaticon.com/icons/png/512/55/55369.png' }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        {this.props.auth.users.length > 0 && this.state.searchMemberText ?
                            <ScrollView style={{ height: 600, marginTop: 10 }}>
                                {this.props.auth.users.map((user: any, index: number) => {


                                    let data = this.state.group.members.filter((a: string) => a === user._id)

                                    console.log("dasttt", data)
                                    return (

                                        <View key={user._id} style={styles.item}>
                                            <Text>{user.username}</Text>
                                            {data ?
                                                <View>
                                                    {user._id === data[0] ?
                                                        <TouchableOpacity onPress={() => this.onPressRemoveUserFromGroup(user)}>
                                                            <Text>
                                                                Remove
                                                </Text>
                                                        </TouchableOpacity> :
                                                        <TouchableOpacity onPress={() => this.onPressAddUserToGroup(user)}>
                                                            <Text>
                                                                Add
                                                </Text>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                                :
                                                <View>

                                                    <TouchableOpacity onPress={() => this.onPressAddUserToGroup(user)}>
                                                        <Text>
                                                            Add
                                                </Text>
                                                    </TouchableOpacity>

                                                </View>
                                            }

                                        </View>
                                    )
                                })}
                            </ScrollView> :
                            <Text />
                        }
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
export default connect<IReduxState>(mapStateToProps, { onAddUserToGroup, onRemoveUserFromGroup, searchUser })(UpdateGroup);

const styles = StyleSheet.create({
    containerView: { marginLeft: 50 },
    inputStyle: {
        height: 50,
        borderColor: 'gray',
        backgroundColor: "#ffffff",
        borderRadius: 20, marginTop: 10,
        paddingLeft: 10,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        margin: 2,
        borderColor: '#2a4944',
        borderWidth: 1,
        backgroundColor: '#d2f7f1'
    },
    buttonView: {
        //backgroundColor: "pink",
        flexDirection: "row",
        marginTop: 15,
    },

    updateButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        marginRight: 10,

    },
    buttonText: {
        color: "#ffffff",
    },
    groupNameView: { marginTop: 50 }

});