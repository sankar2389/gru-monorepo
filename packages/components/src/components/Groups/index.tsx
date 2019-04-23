import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IReduxState, IGroup, IAuth } from "../../types";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { getGroupsList } from '../../actions';

interface IProps extends RouteComponentProps {
    group: IGroup,
    getGroupsList: () => void
};

class GroupView extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    componentDidMount() {
        this.props.getGroupsList();
    }
    render() {
        const { groups } = this.props.group;
        console.log(groups);
        const { innerContainer } = styles;
        return (
            <View style={innerContainer}>
                <h1>List of Groups</h1>
                {
                    groups.map((grp, i) => (<p key={i}>{grp.groupName}</p>))
                }
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
        width: "95%",
        marginTop: 70,
        marginLeft: 70,
        padding: 50,
        display: "flex"
    },
    scene: {
        flex: 1,
    }
});