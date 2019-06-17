import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { UserRatesCard } from "../common";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput } from "react-native";


interface IProps extends RouteComponentProps {
    group: IGroup,
    editedGroup: any,
    cancelGroupUpdate: Function,
    updateGroup: Function

};

interface IState {
    groupName: any,
    searchMemberText: string
}

class UpdateGroup extends Component<IProps, IState> {
    state: IState = {
        searchMemberText: "",
        groupName: this.props.editedGroup.groupName

    }
    constructor(props: IProps) {
        super(props);
        //this.onPressPaginate = this.onPressPaginate.bind(this);
    }

    onHandelChangeInput = (groupName: string) => {
        this.setState({ groupName: groupName });
    }
    onPressSearchUser = () => {
        alert("search user")
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
                        onChangeText={(groupName) => this.onHandelChangeInput(groupName)}
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
                <View>
                    <Text>ADD MEMBERS</Text>
                    <Text>Search Members</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                        <TextInput style={{
                            position: "relative", zIndex: 1, color: "red", left: 5, height: 50, width: "30%", paddingLeft: 10, paddingRight: 10,
                            backgroundColor: "#ffffff", borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
                        }}
                            placeholder="Search Members"

                            value={this.state.searchMemberText}
                            onChangeText={(searchMemberText) => this.onHandelChangeInput(searchMemberText)}
                        >
                        </TextInput>
                        {/* <TouchableOpacity
                            style={{ padding: 14.5, backgroundColor: "green", borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                            onPress={() => this.onPressSearchUser()}
                        > */}
                        <Image
                            source={require('../../assets/images/searchIcon')}
                        />
                        {/* </TouchableOpacity> */}
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
export default connect<IReduxState>(mapStateToProps, {})(UpdateGroup);

const styles = StyleSheet.create({
    containerView: { marginLeft: 50 },
    inputStyle: {
        height: 50,
        borderColor: 'gray',
        backgroundColor: "#ffffff",
        borderRadius: 20, marginTop: 10,
        paddingLeft: 10,
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