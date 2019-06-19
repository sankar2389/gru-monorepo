import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput, ScrollView } from "react-native";
import { onAddUserToGroup, searchUser } from '../../actions';
import AwesomeDebouncePromise from 'awesome-debounce-promise';


interface IProps extends RouteComponentProps {
    group: IGroup,
    editedGroup: any,
    cancelGroupUpdate: Function,
    updateGroup: Function,
    onAddUserToGroup(groupId: any, user: any): () => void
    searchUser(searchString: string): () => void
    auth: any

};

interface IState {
    groupName: string,
    groupId: string
    searchMemberText: string,
    data: any,
    users: any,
}

class UpdateGroup extends Component<IProps, IState> {
    state: IState = {
        searchMemberText: "",
        groupId: this.props.editedGroup._id,
        groupName: this.props.editedGroup.groupName,
        users: [],
        data: [
            { 'name': 'Ben', 'id': 1 },
            { 'name': 'Susan', 'id': 2 },
            { 'name': 'Robert', 'id': 3 },
            { 'name': 'Mary', 'id': 4 },
            { 'name': 'Daniel', 'id': 5 },
            { 'name': 'Laura', 'id': 6 },
            { 'name': 'John', 'id': 7 },
            { 'name': 'Debra', 'id': 8 },
            { 'name': 'Aron', 'id': 9 },
            { 'name': 'Ann', 'id': 10 },
            { 'name': 'Steve', 'id': 11 },
            { 'name': 'Olivia', 'id': 12 }
        ]

    }
    constructor(props: IProps) {
        super(props);
    }

    componentWillReceiveProps(newProps: any) {

        if (newProps.auth.users.length > 0) {
            console.log("new", newProps.auth.users)
            this.setState({ users: newProps.auth.users })
        }
    }



    onPressSearchUserByUserName = (searchString: string) => {
        this.setState({ searchMemberText: searchString })
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
export default connect<IReduxState>(mapStateToProps, { onAddUserToGroup, searchUser })(UpdateGroup);

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