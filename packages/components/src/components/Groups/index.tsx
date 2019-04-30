import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { UserRatesCard } from "../common";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert, Image, TextInput, Modal } from "react-native";
import { getGroupsList, createGroup } from '../../actions';


interface IProps extends RouteComponentProps {
    group: IGroup,
    getGroupsList: (creator: string) => void,
    createGroup: (groupData: any) => void
};

interface IState {
    groupList: any[],
    groupPageCount: any[],
    modalVisible: boolean,
    groupName: string

}

class GroupView extends Component<IProps, IState> {
    state: IState = {
        groupList: [1, 2, 3, 4, 5, 6],
        groupPageCount: [1, 2, 3],
        modalVisible: false,
        groupName: ""
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
        console.log(pageCount)
        let groupList = []
        let onPageCount = pageCount + 5
        for (let i = pageCount; i <= onPageCount; i++) {
            groupList.push(i)
        }

        this.setState({ groupList: groupList })
        console.log("groupList", groupList)
    }

    onPressPaginateNext() {
        let groupList = []
        let groupFistElement = this.state.groupList[0] + 1
        console.log("groupFistElement", groupFistElement)
        for (let i = groupFistElement; i <= groupFistElement + 5; i++) {
            groupList.push(i)
        }

        this.setState({ groupList: groupList })

    }

    onPressPaginatePrevious() {
        let groupList = []
        let groupFistElement = this.state.groupList[0] - 1
        if (groupFistElement >= 1) {
            console.log("groupFistElement", groupFistElement)
            for (let i = groupFistElement; i <= groupFistElement + 5; i++) {
                groupList.push(i)
            }

            this.setState({ groupList: groupList })
        } else {
            Alert.alert("BOF", "You are begning of the group")
        }

    }

    onPressCreateGroup = () => {
        if (this.state.groupName) {
            const groupData = {
                groupName: this.state.groupName,
                creator: "example@example.com"
            }
            this.props.createGroup(groupData)
            this.setState({ groupName: "" })
        }
    }


    render() {
        const { groups } = this.props.group;
        console.log(groups);
        const { innerContainer } = styles;
        return (
            <View style={innerContainer}>
                <View style={this.state.modalVisible ? styles.pageOpacity : styles.pageOpacityNone}>
                    <View style={styles.headerView}>
                        <View>
                            <Text style={{ fontSize: 30 }}>List of Groups</Text>
                            <Text>No of groups - 10</Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.addButtom} onPress={() => this.setState({ modalVisible: true })}>
                                <Text style={{ color: "#ffffff" }}>+ Add Group</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={styles.groupListMainContainer}>
                        {this.state.groupList.map((group, index) => {
                            return (

                                <View style={styles.nestedGroupListView} key={index}>

                                    <View style={styles.groupListMainContainer}>
                                        <View style={styles.textView}>
                                            <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>
                                        </View>

                                        <View style={styles.textView}>
                                            <Text style={{ marginBottom: 10 }}>
                                                Group Name
                                        </Text>
                                            <Text style={{ marginBottom: 10 }}>
                                                Date, time  | Total Member
                                        </Text>
                                            <Text>
                                                {/* Image */}
                                            </Text>
                                        </View>

                                        <View style={{ marginTop: 20, marginRight: 20 }}>
                                            <TouchableOpacity>
                                                <Text style={{ fontSize: 20, marginRight: 30 }}>
                                                    ...
                                            </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                </View>

                            )
                        })}
                    </View>

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
                                    value={this.state.groupName}
                                    placeholder={'Group Name Here'}
                                    style={styles.inputStyle}
                                    onChangeText={groupName => {
                                        this.setState({ groupName: groupName });
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


        );
    }
}

const mapStateToProps = ({ auth, group }: any): IReduxState => {
    return { auth, group };
};
// @ts-ignore
export default connect<IReduxState>(mapStateToProps, { getGroupsList, createGroup })(GroupView);

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
        marginLeft: 20
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