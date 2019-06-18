import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { UserRatesCard } from "../common";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput, ScrollView } from "react-native";
import { getAllUsers, onAddUserToGroup } from '../../actions';

interface IProps extends RouteComponentProps {
    group: IGroup,
    editedGroup: any,
    cancelGroupUpdate: Function,
    updateGroup: Function,
    getAllUsers(): () => void,
    onAddUserToGroup(groupId: any, user: any): () => void

};

interface IState {
    groupName: string,
    groupId: string
    searchMemberText: string,
    users: any,
    searchingUsers: any
}

class UpdateGroup extends Component<IProps, IState> {
    state: IState = {
        searchMemberText: "",
        groupId: this.props.editedGroup._id,
        groupName: this.props.editedGroup.groupName,
        users: [],
        searchingUsers: [],
    }
    constructor(props: IProps) {
        super(props);
        //this.onPressPaginate = this.onPressPaginate.bind(this);
    }

    componentWillReceiveProps(newProps: any) {
        if (newProps.auth.users.length > 0) {
            this.setState({ users: newProps.auth.users })
        }
    }

    componentDidMount() {
        this.props.getAllUsers()
    }

    onPressSearchUserByUserName = (name: string) => {
        let users = this.state.users;
        if (users.length > 0) {
            let searchIngUsers = users.filter((user: any, index: number) => {
                return user.username.indexOf(name) > -1;
            });
            if (name) {
                if (searchIngUsers.length > 0) {
                    this.setState({ searchingUsers: searchIngUsers })
                } else {
                    this.setState({ searchingUsers: "" })
                }
            }
        }
    }

    onPressAddUserToGroup = async (user: any) => {
        let groupId = this.state.groupId
        if (groupId && user) {
            this.props.onAddUserToGroup(groupId, user)
        }

    }

    render() {
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
                            //value={this.state.searchMemberText}
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
                        {this.state.searchingUsers.length > 0 ?
                            <ScrollView style={{ height: 600, marginTop: 10 }}>
                                {this.state.searchingUsers.map((user: any, index: number) => {

                                    return (
                                        <View key={user._id} style={styles.item}>
                                            <Text>{user.username}</Text>
                                            <View>
                                                {user._id === 1 || user._id == 5 ?
                                                    <TouchableOpacity>
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
                                        </View>
                                    )
                                })}
                            </ScrollView> :
                            <Text>User not found</Text>
                        }
                    </View>
                </View>

            </View>

        )
    }
}

const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};
// @ts-ignore
export default connect<IReduxState>(mapStateToProps, { getAllUsers, onAddUserToGroup })(UpdateGroup);

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