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
    updateGroup: any,
    startDataOnPage: number,
    endDataOnPage: number,
    limitDataOnPage: number,
    dropDown: number,
    selectedPaginatateNumber: number
}

class GroupView extends Component<IProps, IState> {
    state: IState = {
        groupList: [],
        groupPageCount: [],
        modalVisible: false,
        groupName: "",
        updateGroup: "",
        startDataOnPage: 0,
        endDataOnPage: 6,
        limitDataOnPage: 6,
        dropDown: -1,
        selectedPaginatateNumber: 1
    }
    constructor(props: IProps) {
        super(props);
        this.onPressGoToGroupChat = this.onPressGoToGroupChat.bind(this);
    }
    async componentDidMount() {
        const user: IStrapiUser = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getGroupsList(user.email);
    }

    componentWillReceiveProps(newProps: any) {
        let groupPageCount = []
        let groupLength = newProps.group.groups.length
        let totalpage = groupLength / this.state.limitDataOnPage
        let count = groupLength % this.state.limitDataOnPage
        if (count !== 0) {
            totalpage = totalpage + 1
            if (totalpage > 1) {
                for (let i = 1; i <= totalpage; i++) {
                    groupPageCount.push(i)
                }
            }
        } else {
            if (totalpage > 1) {
                for (let i = 1; i <= totalpage; i++) {
                    groupPageCount.push(i)
                }
            }
        }

        this.setState({
            groupPageCount: groupPageCount
        })
    }

    onPressPaginate(pageCount: number) {
        let count = pageCount * this.state.limitDataOnPage
        let startDataOnPage = count - this.state.limitDataOnPage
        let endDataOnPage = count
        this.setState({
            startDataOnPage: startDataOnPage,
            endDataOnPage: endDataOnPage,
            selectedPaginatateNumber: pageCount
        })

    }

    //pagination Next
    onPressPaginateNext() {
        if (this.state.endDataOnPage < this.props.group.groups.length) {
            this.setState({
                startDataOnPage: this.state.startDataOnPage + this.state.limitDataOnPage,
                endDataOnPage: this.state.endDataOnPage + this.state.limitDataOnPage,
                selectedPaginatateNumber: this.state.selectedPaginatateNumber + 1
            })
        } else {
            alert("EOF")
        }
    }

    // //pagination Previous
    onPressPaginatePrevious() {
        if (this.state.startDataOnPage > 0) {
            this.setState({
                startDataOnPage: this.state.startDataOnPage - this.state.limitDataOnPage,
                endDataOnPage: this.state.endDataOnPage - this.state.limitDataOnPage,
                selectedPaginatateNumber: this.state.selectedPaginatateNumber - 1
            })
        } else {
            alert("BOF")
        }
    }

    //Create group 
    async onPressCreateGroup() {
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        if (this.state.groupName.length <= 60 && user.email) {
            const groupData = {
                groupName: this.state.groupName,
                creator: user.email,
                createdAt: new Date()
            }
            this.props.createGroup(groupData)
            this.setState({ groupName: "", modalVisible: false })
        } else {
            alert("Please check group name")
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
    onClickEditGroup = (group: any) => {
        if (group) {
            this.setState({
                updateGroup: group
            })
        }
    }

    cancelGroupUpdate = () => {
        this.setState({
            updateGroup: "",
            dropDown: -1
        })
    }

    updateGroup = (_id: string, groupName: string, creator: string) => {
        if (_id && groupName.length < 60) {
            this.props.onUpdateGroup(_id, groupName, creator);
            this.cancelGroupUpdate()
        } else {
            alert("Please check group name")
        }
    }

    handelDropdownClick = (index: number) => {
        if (index === this.state.dropDown) {
            this.setState({
                dropDown: -1
            })
        } else {
            this.setState({
                dropDown: index
            })
        }
    }

    onCancelModal = () => {
        this.setState({ modalVisible: false })
    }

    onPressVisibleModal = () => {
        this.setState({ modalVisible: true })
    }

    onHandelChangeInput = (groupName: string) => {
        this.setState({ groupName: groupName });
    }

    onPressGoToGroupChat = (group: any) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    this.props.history.push({
                        pathname: '/secure/group-chat',
                        state: { authtoken, group }
                    });
                }
            })
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
                                <Text style={styles.gorupPageHeadText}>List of Groups</Text>
                                <Text>No of groups - {groups.length}</Text>
                            </View>
                            <View>
                                <TouchableOpacity disabled={this.state.modalVisible ? true : false}
                                    style={styles.addButtom} onPress={() => this.onPressVisibleModal()}>
                                    <Text style={styles.addGroupText}>+ Add Group</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {groups.length > 0 ?
                            <View style={styles.groupListMainContainer}>
                                {groups.map((group, index) => {
                                    if (index >= this.state.startDataOnPage && index < this.state.endDataOnPage) {
                                        return (

                                            <View style={styles.nestedGroupListView} key={index} >
                                                {/* */}
                                                <View style={styles.groupListMainContainer}>
                                                    <TouchableOpacity onPress={() => this.onPressGoToGroupChat(group)}
                                                        style={styles.goToGroupChatButton}>
                                                        <View style={styles.textView}>
                                                            <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>
                                                        </View>

                                                        <View style={styles.textView}>
                                                            <Text style={styles.groupNameText}>
                                                                {group.groupName}
                                                            </Text>
                                                            <Text style={styles.groupDateTime}>
                                                                {moment(group.createdAt).fromNow()} {moment(group.createdAt).format('h:mm')} | {group.members.length} Members
</Text>
                                                            <Text>
                                                                {/* Image */}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <View style={styles.droupDownView}>
                                                        <Text onPress={() => this.handelDropdownClick(index)} style={styles.dropdownDots}>
                                                            ...
</Text>
                                                        {this.state.dropDown === index ?
                                                            <View style={styles.dropdown}>
                                                                <ul style={{ listStyleType: "none", padding: 5, textAlign: "left", margin: 5 }}>
                                                                    <li onClick={() => this.onClickEditGroup(group)} style={{ cursor: "pointer" }}>Edit</li>
                                                                    <li onClick={() => this.onClickDeleteGroup(group._id, group.creator)} style={{ cursor: "pointer" }}>Delete</li>
                                                                </ul>
                                                            </View> : <Text />
                                                        }
                                                    </View>
                                                </View>

                                            </View>

                                        )

                                    }
                                })}
                            </View>
                            :
                            <Text />
                        }
                    </View>

                    {/* ADD GROUP MODAL START */}
                    {
                        this.state.modalVisible ?
                            <View style={styles.modalContainer}>
                                <View style={styles.modalView}>
                                    <View style={styles.modalCreateGroupView}>
                                        <Text style={styles.createGroupText}>Create Group</Text>
                                    </View>
                                    <View style={styles.textInput}>
                                        <TextInput
                                            autoFocus={true}
                                            value={this.state.groupName}
                                            placeholder={'Group Name'}
                                            style={styles.inputStyle}
                                            // onChangeText={groupName => {
                                            // this.setState({ groupName: groupName });
                                            // }}
                                            onChangeText={(groupName) => this.onHandelChangeInput(groupName)}
                                            onSubmitEditing={() => {
                                                this.onPressCreateGroup()
                                            }}
                                        />
                                    </View>
                                    <View style={styles.buttonView}>
                                        <TouchableOpacity onPress={() => this.onCancelModal()}
                                            style={styles.modalCancelButton}>
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.submitButton}
                                            onPress={() => this.onPressCreateGroup()}
                                        >
                                            <Text style={styles.buttonText}>Submit</Text>
                                        </TouchableOpacity>

                                    </View>

                                </View>
                            </View> : <Text />
                    }
                    {/* ADD GROUP MODAL END */}


                    {/* PAGINATION VIEW START */}
                    {this.state.groupPageCount.length > 1 ?
                        <View style={styles.paginationView}>
                            <TouchableOpacity style={styles.paginationButton} onPress={this.onPressPaginatePrevious.bind(this)}>
                                <Text>{"<"}</Text>
                            </TouchableOpacity>
                            {this.state.groupPageCount.map(pageCount => {
                                if (pageCount > 1) {
                                    if (pageCount >= this.state.selectedPaginatateNumber && pageCount < this.state.selectedPaginatateNumber + 2) {
                                        return (

                                            <TouchableOpacity key={pageCount}
                                                onPress={this.onPressPaginate.bind(this, pageCount)}
                                                style={this.state.selectedPaginatateNumber === pageCount ? styles.pageCountStyle : styles.paginationButton}
                                            >
                                                <Text style={this.state.selectedPaginatateNumber === pageCount ? styles.pageCountTextStyle : styles.blankTextStyle}>
                                                    {pageCount}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                } else {
                                    return (
                                        <TouchableOpacity key={pageCount}
                                            onPress={this.onPressPaginate.bind(this, pageCount)}
                                            style={this.state.selectedPaginatateNumber === pageCount ? styles.pageCountStyle : styles.paginationButton}
                                        >
                                            <Text style={this.state.selectedPaginatateNumber === pageCount ? styles.pageCountTextStyle : styles.blankTextStyle}>
                                                {pageCount}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }
                            })}

                            <TouchableOpacity
                                onPress={this.onPressPaginateNext.bind(this)}
                                style={styles.paginationButton}>
                                <Text>{">"}</Text>
                            </TouchableOpacity>
                        </View> : <Text />}
                    {/* PAGINATION VIEW END */}


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
    dropdownDots: {
        position: "absolute",
        right: 0,
        top: 0
    },
    dropdown: {
        position: "absolute",
        right: 0,
        top: 20,
        boxShadow: `1px 1px #e0dada`,
        borderWidth: 1,
        borderColor: "#e0dada",
        borderStyle: "solid",
        backgroundColor: '#ffffff',
    },
    textView: {
        flex: 1,
        marginTop: 40,
        flexWrap: 'wrap',
        alignItems: "flex-start",
        //backgroundColor: "red"

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
    pageCountStyle: {
        marginRight: 20,
        backgroundColor: '#d72b2b',
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
        borderRadius: 50,
        marginLeft: 50

    },
    button: {
        flex: 1,
        backgroundColor: "#cccccc"
    },
    modalContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    modalView: {
        backgroundColor: "#ffffff",
        //opacity: 0.7,
        width: 500,
        height: 400,
        position: "relative",
        marginTop: 30,
        marginLeft: "auto",
        marginRight: "auto"
        // left: 600,
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
    },
    gorupPageHeadText: { fontSize: 30 },
    addGroupText: { color: "#ffffff" },
    groupNameText: { marginBottom: 10, flexWrap: "wrap", fontWeight: "900", padding: 0, marginLeft: 15 },
    groupDateTime: { marginBottom: 10, color: "gray", fontSize: 12 },
    droupDownView: { marginTop: 20, marginRight: 20 },
    createGroupText: { color: "#ffffff", fontSize: 20 },
    textInput: { flexDirection: "row", marginTop: 15, marginLeft: 20 },
    goToGroupChatButton: { flexDirection: "row", paddingRight: 60 },
    pageCountTextStyle: {},
    blankTextStyle: {},
    paginationView: {}
});