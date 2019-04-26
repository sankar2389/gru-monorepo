import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Alert } from "react-native";
import { getGroupsList } from '../../actions';

interface IProps extends RouteComponentProps {
    group: IGroup,
    getGroupsList: (creator: string) => void
};

interface IState {
    groupList: any[],
    groupPageCount: any[],
}

class GroupView extends Component<IProps, IState> {
    state: IState = {
        groupList: [1, 2, 3, 4, 5, 6],
        groupPageCount: [1, 2, 3]
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

    render() {
        const { groups } = this.props.group;
        console.log(groups);
        const { innerContainer } = styles;
        return (
            <View style={innerContainer}>
                <View style={styles.headerView}>
                    <View>
                        <Text style={{ fontSize: 30 }}>List of Groups</Text>
                        <Text>No of groups - 10</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.addButtom}>
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
                                        <Text style={{ marginLeft: 50 }}>
                                            {/* Logo */}{group}
                                        </Text>
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

                                    <View style={{ marginTop: 50, marginRight: 20 }}>
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

            </View >


        );
    }
}

const mapStateToProps = ({ auth, group }: any): IReduxState => {
    return { auth, group };
};
// @ts-ignore
export default connect<IReduxState>(mapStateToProps, { getGroupsList })(GroupView);

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
        marginTop: 60,
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
    }
});