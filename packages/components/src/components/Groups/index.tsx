import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth, IStrapiUser } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet, AsyncStorage, Text } from "react-native";
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
                 <h1>List of Groups</h1>
                 <View style={styles.groupListMainContainer}>
                    <View style={styles.nestedGroupListView} >
                    <Text>
Hello
                    </Text>
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
    groupListMainContainer:{
        flex: 1, 
        flexDirection: 'row',  
        justifyContent: 'space-between', 
        flexWrap: "wrap"
    },
    nestedGroupListView:{
        width: 500, 
        height: 250, 
        backgroundColor: '#ffffff', 
        marginBottom:100, 
        borderRadius:5
    }
});