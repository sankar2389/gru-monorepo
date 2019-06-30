import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ScrollView, AsyncStorage, Text, TouchableOpacity, TextInput } from 'react-native';
import { fetchGroupQADetails } from '../../actions';
import { IReduxState } from '../../types';
import axios from 'axios';
// ** Used in render function. DONOT REMOVE
import moment from 'moment';

interface IProps {
    fetchGroupQADetails: (questionID: string) => void;
    location: any;
    group: any;
    match: any;
    history: any;
}

interface IState {
    dWidth: number;
    questionDetails: any;
}

class GroupQuestionPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            dWidth: 0,
            questionDetails: {},
        };
    }

    async componentDidMount() {
        this.props.fetchGroupQADetails(this.props.match.params.questionID);
        window.addEventListener('resize', this.updateDimension);
    }

    componentWillReceiveProps(newProps: any) {
        this.setState({ questionDetails: newProps.group.questionDetails });
        try {
            if (newProps.group.questionDetails.creator) {
                const creator = JSON.parse(newProps.group.questionDetails.creator);
                this.setState(prevState => {
                    return {
                        ...prevState,
                        questionDetails: {
                            ...prevState.questionDetails,
                            creator,
                        },
                    };
                });
            }
        } catch (error) {
            console.error(error);
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

    editQuestion = () => {
        AsyncStorage.getItem('token').then((authtoken: string | null) => {
            if (authtoken) {
                this.props.history.push({
                    pathname: `/secure/groups/${this.props.match.params.groupName}/${
                        this.props.match.params.questionID
                    }/edit`,
                    state: { authtoken, groupID: this.props.location.state.groupID },
                });
            }
        });
    };

    editComment = (comment: any) => {
        AsyncStorage.getItem('token').then((authtoken: string | null) => {
            if (authtoken) {
                this.props.history.push({
                    pathname: `/secure/groups/${this.props.match.params.groupName}/${
                        this.props.match.params.questionID
                    }/${comment._id}/edit`,
                    state: { authtoken, groupID: this.props.location.state.groupID },
                });
            }
        });
    };

    newComment = () => {
        AsyncStorage.getItem('token').then((authtoken: string | null) => {
            if (authtoken) {
                this.props.history.push({
                    pathname: `/secure/groups/${this.props.match.params.groupName}/${
                        this.props.match.params.questionID
                    }/new_comment/new`,
                    state: { authtoken, groupID: this.props.location.state.groupID },
                });
            }
        });
    };

    render() {
        const { innerContainer } = styles;
        const { questionDetails } = this.state;
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
                            <Text style={styles.headerGroupDashboard}>Q: {this.state.questionDetails.title}</Text>
                            <Text style={this.state.dWidth <= 700 ? styles.smHeaderSmallText : styles.headerSmallText}>
                                Group Q/A : {this.props.match.params.groupName.toUpperCase()}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.newCommentButton} onPress={this.newComment}>
                                <Text style={{ color: '#fff' }}>New Comment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView style={this.state.dWidth <= 700 ? styles.smInnerContainer : innerContainer}>
                    {/*  Question Description Text */}

                    {questionDetails.creator && (
                        <View style={styles.questionDescriptionView}>
                            <View>
                                <Text style={[styles.questionDescriptionText, { color: '#999' }]}>
                                    {questionDetails.description}
                                </Text>
                            </View>
                            <View style={styles.questionBottomView}>
                                <View style={styles.questionButtonsView}>
                                    <View style={styles.buttonView}>
                                        <TouchableOpacity onPress={this.editQuestion}>
                                            <Text style={styles.editButton}>Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.buttonView}>
                                        <TouchableOpacity>
                                            <Text style={styles.editButton}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.questionDetailsView}>
                                    <View style={styles.questionAuthorView}>
                                        <Text style={styles.questionAuthorText}>last Activity</Text>
                                        <Text style={styles.questionAuthorText}>
                                            {moment(questionDetails.createdAt).fromNow()}
                                        </Text>
                                    </View>
                                    <View style={styles.questionAuthorView}>
                                        <Text style={styles.questionAuthorText}>
                                            By {questionDetails.creator.username}
                                        </Text>
                                        <Text style={styles.questionAuthorText}>Posted on</Text>
                                        <Text style={styles.questionAuthorText}>
                                            {moment(questionDetails.createdAt).format('MMM Do YY \\at h:mm a')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Comments View */}
                    {questionDetails.comments &&
                        questionDetails.comments.length > 0 &&
                        questionDetails.comments.map((comment: any) => (
                            <View style={styles.questionCommentView} key={comment._id}>
                                <View>
                                    <Text style={[styles.questionDescriptionText, { color: '#999' }]}>
                                        {comment.description}
                                    </Text>
                                </View>
                                <View style={styles.questionBottomView}>
                                    <View style={styles.questionButtonsView}>
                                        <View style={styles.buttonView}>
                                            <TouchableOpacity onPress={() => this.editComment(comment)}>
                                                <Text style={styles.editButton}>Edit</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.buttonView}>
                                            <TouchableOpacity>
                                                <Text style={styles.editButton}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.questionDetailsView}>
                                        <View style={styles.questionAuthorView}>
                                            <Text style={styles.questionAuthorText}>last Activity</Text>
                                            <Text style={styles.questionAuthorText}>
                                                {moment(comment.createdAt).fromNow()}
                                            </Text>
                                        </View>
                                        <View style={styles.questionAuthorView}>
                                            <Text style={styles.questionAuthorText}>By {comment.creator.username}</Text>
                                            <Text style={styles.questionAuthorText}>Posted on</Text>
                                            <Text style={styles.questionAuthorText}>
                                                {moment(comment.createdAt).format('MMM Do YY \\at h:mm a')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
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
    { fetchGroupQADetails },
)(GroupQuestionPage);

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
    imageAndNameView: { flexDirection: 'row', flexWrap: 'wrap' },
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
    tableColumnView: {
        flex: 1,
    },
    questionBottomView: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '85vw',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'flex-end',
    },
    questionDetailsView: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        // width: '85vw',
    },
    questionDescriptionText: {
        fontSize: 20,
        textAlign: 'justify',
    },
    questionAuthorView: {
        margin: 10,
        padding: 10,
    },
    questionAuthorText: {
        textAlign: 'right',
        fontSize: 15,
        color: '#000',
    },
    questionButtonsView: {
        margin: 10,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
    },
    buttonView: {
        margin: 10,
    },
    editButton: {
        fontSize: 20,
    },

    questionCommentView: {
        width: '90vw',
        backgroundColor: 'transparent',
        marginLeft: 50,
        marginTop: 60,
        // borderBottomWidth: 1,
        // borderLeftWidth: 1,
        // borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: '#aaa',
        borderTopColor: '#aaa',
        padding: 30,
    },
    newCommentButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
        width: 150,
        marginRight: 50,
    },
});
