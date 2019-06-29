import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ScrollView, AsyncStorage, Text, TouchableOpacity, TextInput } from 'react-native';
import { fetchCommentDetails, updateComment } from '../../actions';
import { IReduxState } from '../../types';
import axios from 'axios';
// ** Used in render function. DONOT REMOVE
import moment from 'moment';

interface IProps {
    fetchCommentDetails: (commentID: string) => void;
    updateComment: (commentID: string, description: string) => void;
    location: any;
    group: any;
    match: any;
    history: any;
}

interface IState {
    dWidth: number;
    commentDetails: any;
    description: string;
    commentID: string;
}

class GroupCommentsActionPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            dWidth: 0,
            commentDetails: {},
            description: '',
            commentID: '',
        };
    }

    async componentDidMount() {
        if (this.props.match.params.action === 'edit') {
            await this.props.fetchCommentDetails(this.props.match.params.commentID);
        }
        if (this.props.match.params.action === 'new') {
            this.setState({ commentDetails: {}, description: '', commentID: '' });
        }
        window.addEventListener('resize', this.updateDimension);
    }

    componentWillReceiveProps(newProps: any) {
        if (this.props.match.params.action === 'edit') {
            if (newProps.group.commentDetail.comments) {
                this.setState({
                    commentDetails: newProps.group.commentDetail.comments[0],
                    description: newProps.group.commentDetail.comments[0].description,
                    commentID: newProps.match.params.commentID,
                });
            }
        }
        if (this.props.match.params.action === 'new') {
            this.setState({ commentDetails: {}, description: '', commentID: '' });
        }
    }

    async componentWillMount() {
        this.updateDimension();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimension);
    }

    updateDimension = () => {
        this.setState({
            dWidth: window.innerWidth,
        });
    };

    updateComment = async () => {
        const { commentID, description } = this.state;
        this.props.updateComment(commentID, description);
        AsyncStorage.getItem('token').then((authtoken: string | null) => {
            if (authtoken) {
                this.props.history.push({
                    pathname: `/secure/groups/${this.props.match.params.groupName}/${
                        this.props.match.params.questionID
                    }`,
                    state: { authtoken },
                });
            }
        });
    };

    newComment = async () => {
        const { commentID, description } = this.state;
        // this.props.newComment(commentID, description);
        AsyncStorage.getItem('token').then((authtoken: string | null) => {
            if (authtoken) {
                this.props.history.push({
                    pathname: `/secure/groups/${this.props.match.params.groupName}/${
                        this.props.match.params.questionID
                    }`,
                    state: { authtoken },
                });
            }
        });
    };

    render() {
        const { innerContainer } = styles;
        const { commentDetails } = this.state;
        return (
            <View style={this.state.dWidth <= 700 ? styles.smMainViewContainer : styles.mainViewContainer}>
                <View
                    style={this.state.dWidth <= 700 ? styles.questionHeaderContainerSM : styles.questionHeaderContainer}
                >
                    <View
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            width: '100%',
                        }}
                    >
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={styles.headerGroupDashboard}>
                                {this.props.match.params.action === 'edit' ? 'Edit Comment' : 'New Comment'}
                            </Text>
                            <Text style={this.state.dWidth <= 700 ? styles.smHeaderSmallText : styles.headerSmallText}>
                                Group Q/A : {this.props.match.params.groupName.toUpperCase()}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.editButton} onPress={this.updateComment}>
                                <Text style={{ color: '#fff' }}>
                                    {this.props.match.params.action === 'edit' ? 'Edit' : 'New'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView style={this.state.dWidth <= 700 ? styles.smInnerContainer : innerContainer}>
                    {/*  Question Description Text */}

                    <View style={styles.questionDescriptionView}>
                        <View>
                            <TextInput
                                style={[styles.commentTextField, { color: '#999' }]}
                                value={this.state.description}
                                onChangeText={text => this.setState({ description: text })}
                                multiline={true}
                                autoFocus={true}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps({ auth, group }: any): IReduxState {
    return {
        auth,
        group,
    };
}

export default connect<IReduxState>(
    mapStateToProps,
    { fetchCommentDetails, updateComment },
)(GroupCommentsActionPage);

const styles = StyleSheet.create({
    mainViewContainer: { marginLeft: 55, height: '90vh', marginTop: 70 },
    smMainViewContainer: { marginLeft: 5, height: 503, zIndex: -1 },
    questionHeaderContainer: { marginLeft: 55, marginTop: 70 },
    questionHeaderContainerSM: { marginLeft: 5, zIndex: -1 },
    innerContainer: {
        marginTop: 10,
        marginLeft: 30,
        // paddingLeft: 50,
        marginRight: 10,
        display: 'flex',
        flexWrap: 'wrap',
        height: 800,
    },
    smInnerContainer: {
        marginTop: 10,
        marginLeft: 5,
        //paddingLeft: 70,
        marginRight: 7,
        paddingRight: 7,
        display: 'flex',
        height: 490,
    },
    headerGroupDashboard: { fontWeight: '900', fontSize: 30 },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    smHeaderView: { flexDirection: 'column', marginBottom: 20 },
    pageOpacity: {
        opacity: 1,
    },
    headerSmallText: { marginBottom: 50, color: '#686662', fontSize: 18 },
    smHeaderSmallText: { marginBottom: 20, color: '#686662', fontSize: 18 },
    questionDescriptionView: {
        width: '90vw',
        backgroundColor: 'transparent',
        marginLeft: 50,
        borderBottomWidth: 1,
        // borderLeftWidth: 1,
        // borderRightWidth: 1,
        // borderTopWidth: 1,
        borderBottomColor: '#aaa',
        padding: 30,
    },
    commentTextField: {
        fontSize: 20,
        height: 380,
        textAlign: 'justify',
    },
    questionAuthorView: {
        margin: 10,
        padding: 10,
    },
    editButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
        width: 80,
        marginRight: 50,
    },
});
