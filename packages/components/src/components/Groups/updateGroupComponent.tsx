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
}

class UpdateGroup extends Component<IProps, IState> {
    state: IState = {
        groupName: this.props.editedGroup.groupName

    }
    constructor(props: IProps) {
        super(props);
        //this.onPressPaginate = this.onPressPaginate.bind(this);
    }

    onHandelChangeInput = (groupName: string) => {
        this.setState({ groupName: groupName });
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
                        // onChangeText={groupName => {
                        //     this.setState({ groupName: groupName });
                        // }}
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
        height: 40,
        borderColor: 'gray',
        backgroundColor: "#ffffff",
        borderRadius: 5, marginTop: 10,
        paddingLeft: 10
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