import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet, AsyncStorage, Text, TouchableOpacity } from "react-native";
import { getGroupsList } from '../../actions';

interface IProps extends RouteComponentProps {
    group: IGroup,
    getGroupsList: (creator: string) => void
};

class GroupView extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    async componentDidMount() {
        const user: IStrapiUser = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getGroupsList(user.email);
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
                    <View style={styles.nestedGroupListView} >
                        <View style={styles.groupListMainContainer}>
                            <View style={styles.textView}>
                                <Text style={{ marginLeft: 50 }}>
                                    {/* Logo */}
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
                    <View style={styles.nestedGroupListView} />

                    <View style={styles.nestedGroupListView} />

                    <View style={styles.nestedGroupListView} />

                    <View style={styles.nestedGroupListView} />

                    <View style={styles.nestedGroupListView} />
                    <View style={styles.nestedGroupListView} />
                    <View style={styles.nestedGroupListView} />
                    <View style={styles.nestedGroupListView} />

                </View>

            </View>


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
});