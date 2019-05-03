import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { UserRatesCard } from "../common";
import UpdateGroup from "./updateGroupComponent";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput } from "react-native";
import { getGroupsList, createGroup, onDeleteGroup, onUpdateGroup } from '../../actions';
import { string } from "prop-types";
import moment from "moment";

interface IProps extends RouteComponentProps {
    group: IGroup,
    getGroupsList: (creator: string) => void,
    createGroup: (groupData: any) => void,
    onDeleteGroup: (groupId: string, creator: string) => void,
    onUpdateGroup: (groupId: string, groupName: string, creator: string) => void,
};

interface IState {
    groupList: any[],
    groupPageCount: any[],
    modalVisible: boolean,
    groupName: string,
    updateGroup: any
}

class GroupView extends Component<IProps, IState> {
    state: IState = {
        groupList: [],
        groupPageCount: [1, 2, 3],
        modalVisible: false,
        groupName: "",
        updateGroup: ""
    }
    constructor(props: IProps) {
        super(props);
        //this.onPressPaginate = this.onPressPaginate.bind(this);
    }
    async componentDidMount() {
        const user: IStrapiUser = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getGroupsList(user.email);
    }

    onPressPaginate(pageCount: number) {
        let groupList = []
        let onPageCount = pageCount + 5
        for (let i = pageCount; i <= onPageCount; i++) {
            groupList.push(i)
        }

        this.setState({ groupList: groupList })

    }

    //pagination Next
    onPressPaginateNext() {
        let groupList = []
        let groupFistElement = this.state.groupList[0] + 1
        for (let i = groupFistElement; i <= groupFistElement + 5; i++) {
            groupList.push(i)
        }

        this.setState({ groupList: groupList })

    }

    //pagination Previous
    onPressPaginatePrevious() {
        let groupList = []
        let groupFistElement = this.state.groupList[0] - 1
        if (groupFistElement >= 1) {
            for (let i = groupFistElement; i <= groupFistElement + 5; i++) {
                groupList.push(i)
            }
            this.setState({ groupList: groupList })
        } else {
            Alert.alert("BOF", "You are begning of the group")
        }

    }

    //Create group 
    async onPressCreateGroup() {
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);

        if (this.state.groupName && user.email) {
            const groupData = {
                groupName: this.state.groupName,
                creator: user.email,
                createdAt: new Date()
            }
            this.props.createGroup(groupData)
            this.setState({ groupName: "", modalVisible: false })
        }
    }


    //Delete group
    onClickDeleteGroup(groupId: string, creator: string) {
        let confirms = confirm(`Delete confirmation \n Are you want to delete ?`)
        if (confirms) {
            this.props.onDeleteGroup(groupId, creator)
        }
    }

    //Edit group
    onClicEditGroup = (group: any) => {
        if (group) {
            this.setState({
                updateGroup: group
            })
        }
    }

    cancelGroupUpdate = () => {
        this.setState({
            updateGroup: ""
        })
    }

    updateGroup = (_id: string, groupName: string, creator: string) => {
        if (_id && groupName) {
            this.props.onUpdateGroup(_id, groupName, creator);
            this.cancelGroupUpdate()
        } else {
            alert("Please check group name")
        }
    }




    render() {
        const { groups } = this.props.group;
        const { innerContainer } = styles;
        return this.state.updateGroup ?
            (
                /** Update group in component */
                <View style={innerContainer}>
                    <UpdateGroup
                        editedGroup={this.state.updateGroup}
                        cancelGroupUpdate={this.cancelGroupUpdate}
                        updateGroup={this.updateGroup}

                    />
                </View>
            ) :
            (
                <View style={innerContainer}>
                    <View style={this.state.modalVisible ? styles.pageOpacity : styles.pageOpacityNone}>
                        <View style={styles.headerView}>
                            <View>
                                <Text style={{ fontSize: 30 }}>List of Groups</Text>
                                <Text>No of groups - {groups.length}</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.addButtom} onPress={() => this.setState({ modalVisible: true })}>
                                    <Text style={{ color: "#ffffff" }}>+ Add Group</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {groups.length > 0 ?
                            <View style={styles.groupListMainContainer}>
                                {groups.map((group, index) => {
                                    return (
                                        <View style={styles.nestedGroupListView} key={index}>

                                            <View style={styles.groupListMainContainer}>
                                                <View style={styles.textView}>
                                                    <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>
                                                </View>

                                                <View style={styles.textView}>
                                                    <Text style={{ marginBottom: 10, flexWrap: "wrap" }}>
                                                        {group.groupName}
                                                    </Text>
                                                    <Text style={{ marginBottom: 10 }}>
                                                        {moment(group.createdAt).format(' DD-MM-YY, h:mm')}   | Total Member
                                            </Text>
                                                    <Text>
                                                        {/* Image */}
                                                    </Text>
                                                </View>

                                                <View style={{ marginTop: 20, marginRight: 20 }}>
                                                    {/* <TouchableOpacity>
                                                <Text style={{ fontSize: 20, marginRight: 30 }}>
                                                    ...
                                            </Text>
                                            </TouchableOpacity> */}
                                                    <select style={{ backgroundColor: "#ffffff", border: "none", WebkitAppearance: "none" }} defaultValue="...">
                                                        <option >...</option>
                                                        <option onClick={() => this.onClicEditGroup(group)}>Edit</option>
                                                        <option onClick={() => this.onClickDeleteGroup(group._id, group.creator)}>Delete</option>
                                                    </select>
                                                </View>
                                            </View>
                                        </View>

                                    )
                                })}
                            </View>
                            :
                            <Text />
                        }
                        {/* PAGINATION VIEW START */}
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity style={styles.paginationButton} onPress={this.onPressPaginatePrevious.bind(this)}>
                                <Text>{"<"}</Text>
                            </TouchableOpacity>
                            {this.state.groupPageCount.map(pageCount => {
                                return (
                                    <TouchableOpacity key={pageCount}
                                        onPress={this.onPressPaginate.bind(this, pageCount)}
                                        style={styles.paginationButton}
                                    >
                                        <Text>{pageCount}</Text>
                                    </TouchableOpacity>
                                )
                            })}

                            <TouchableOpacity
                                onPress={this.onPressPaginateNext.bind(this)}
                                style={styles.paginationButton}>
                                <Text>{">"}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* PAGINATION VIEW END */}
                    </View>

                    {/* ADD GROUP MODAL START */}
                    {
                        this.state.modalVisible ?
                            <View style={styles.modalView}>
                                <View style={styles.modalCreateGroupView}>
                                    <Text style={{ color: "#ffffff", fontSize: 20 }}>Create Groups</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 15, marginLeft: 20 }}>
                                    <TextInput
                                        autoFocus={true}
                                        value={this.state.groupName}
                                        placeholder={'Group Name Here'}
                                        style={styles.inputStyle}
                                        onChangeText={groupName => {
                                            this.setState({ groupName: groupName });
                                        }}
                                        onSubmitEditing={() => {
                                            this.onPressCreateGroup()
                                        }}
                                    />
                                </View>
                                <View style={styles.buttonView}>
                                    <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}
                                        style={styles.modalCancelButton}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.submitButton}
                                        onPress={() => this.onPressCreateGroup()}
                                    >
                                        <Text style={styles.buttonText}>Submit</Text>
                                    </TouchableOpacity>

                                </View>

                            </View> : <Text />
                    }
                    {/* ADD GROUP MODAL END */}
                </View >
            )

    }
}

const mapStateToProps = ({ auth, group }: any): IReduxState => {
    return { auth, group };
};
// @ts-ignore
export default connect<IReduxState>(mapStateToProps, { getGroupsList, createGroup, onDeleteGroup, onUpdateGroup })(GroupView);

const styles = StyleSheet.create({
    innerContainer: {
        backgroundColor: '#f0f0f0',
        width: "95%",
        marginTop: 70,
        marginLeft: 70,
        padding: 50,
        display: "flex"
    },
    scene: {
        flex: 1,
    },
    pageOpacity: {
        opacity: 0.2
    },
    pageOpacityNone: {

    },
    groupListMainContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: "wrap"
    },
    nestedGroupListView: {
        width: 500,
        height: 200,
        backgroundColor: '#ffffff',
        marginBottom: 100,
        borderRadius: 5
    },
    textView: {
        marginTop: 40,
        marginLeft: 10,
        flexWrap: 'wrap'

    },
    headerView: { flexDirection: 'row', justifyContent: "space-between", marginBottom: 20 },
    addButtom: { backgroundColor: '#ff4d4d', padding: 10, borderRadius: 5 },
    paginationButton: {
        marginRight: 20,
        backgroundColor: '#ffffff',
        borderRadius: 30,
        padding: 10,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarStyle: {
        height: 100,
        width: 100,
        backgroundColor: "#bfbfbf",
        borderRadius: 50
    },
    button: {
        flex: 1,
        backgroundColor: "#cccccc"
    },
    modalView: {
        backgroundColor: "#ffffff",
        //opacity: 0.7,
        width: 500,
        height: 400,
        position: "absolute",
        left: 600,
        //borderWidth: 
    },
    modalCreateGroupView: {
        backgroundColor: "gray",
        alignItems: 'center',
        justifyContent: "center"
    },
    inputStyle: {
        height: 30,
        //borderBottomWidth: 1,
        margin: 15,
        backgroundColor: "rgba(106,106,106,0.41)",
        borderRadius: 20,
        padding: 20,
        width: "60%",
        position: "absolute",
        top: 100,
        left: "15%"
    },
    modalCancelButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        marginRight: 10
    },
    buttonView: {
        flexDirection: "row",
        alignItems: "flex-end",
        position: "absolute",
        top: 350, left: 300
    },
    buttonText: {
        color: "#ffffff"
    },
    submitButton: {
        backgroundColor: "green",
        padding: 10, borderRadius: 5
    }
});