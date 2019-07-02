import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ScrollView, AsyncStorage, Text, TouchableOpacity, TextInput } from 'react-native';
import {
    fetchGroupQADetails,
    updateComment,
    newComment,
    resetUpdateStatus,
    deleteComment,
    deleteQuestion,
} from '../../actions';
import { IReduxState } from '../../types';
// ** Used in render function. DONOT REMOVE
import moment from 'moment';
interface IProps {
    fetchGroupQADetails: (questionID: string) => void;
    updateComment: (commentID: string, description: string) => void;
    deleteComment: (commentID: string) => void;
    deleteQuestion: (questionID: string) => void;
    newComment: (creator: any, description: string, groupID: string, questionID: string) => void;
    resetUpdateStatus: () => void;
    location: any;
    group: any;
    match: any;
    history: any;
}

interface IState {
    dWidth: number;
    questionDetails: any;
    commentDescription: string;
    commentID: string;
    modalState: boolean;
    modalType: string;
    currentUser: any;
    deleteModal: boolean;
}

class GroupQuestionPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            dWidth: 0,
            questionDetails: {},
            commentDescription: '',
            modalState: false,
            modalType: '',
            commentID: '',
            currentUser: {},
            deleteModal: false,
        };
    }

    async componentDidMount() {
        await this.props.fetchGroupQADetails(this.props.match.params.questionID);
        const user = await AsyncStorage.getItem('user');
        // @ts-ignore
        this.setState({ currentUser: JSON.parse(user) });
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

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        if (
            prevProps.group.commentUpdateStatus !== this.props.group.commentUpdateStatus &&
            this.state.modalState === prevState.modalState
        ) {
            if (this.props.group.commentUpdateStatus === 0) {
                this.props.resetUpdateStatus();
                this.setState({ modalState: false });
                this.props.fetchGroupQADetails(this.props.match.params.questionID);
            }
            if (this.props.group.commentUpdateStatus === 1) {
                alert('Something Wrong');
                this.props.resetUpdateStatus();
            }

            if (this.props.group.questionUpdateStatus === 1) {
                AsyncStorage.getItem('token').then((authtoken: string | null) => {
                    if (authtoken) {
                        this.props.history.push({
                            pathname: `/secure/groups/${this.props.match.params.groupName}/`,
                            state: { authtoken, groupID: this.props.location.state.groupID },
                        });
                    }
                });
            }
        }
        if (prevProps.group.questionUpdateStatus !== this.props.group.questionUpdateStatus) {
            if (this.props.group.questionUpdateStatus === 0) {
                AsyncStorage.getItem('token').then((authtoken: string | null) => {
                    if (authtoken) {
                        this.props.resetUpdateStatus();
                        this.props.history.push({
                            pathname: `/secure/groups/${this.props.match.params.groupName}/`,
                            state: { authtoken, groupID: this.props.location.state.groupID },
                        });
                    }
                });
            }
            if (this.props.group.questionUpdateStatus === 1) {
                alert('Something Wrong');
                this.props.resetUpdateStatus();
            }
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
                    pathname: `/secure/groups/${this.props.match.params.groupName}/${this.props.match.params.questionID}/edit`,
                    state: { authtoken, groupID: this.props.location.state.groupID },
                });
            }
        });
    };

    editComment = (comment: any) => {
        this.setState({
            commentDescription: comment.description,
            commentID: comment._id,
            modalState: true,
            modalType: 'edit',
        });
    };

    newComment = () => {
        this.setState({ commentDescription: '', modalState: true, modalType: 'new' });
    };

    onCommentSendEdit = async () => {
        const { commentID, commentDescription } = this.state;
        await this.props.updateComment(commentID, commentDescription);
    };

    onCommentSendNew = async () => {
        const { commentDescription } = this.state;
        if (commentDescription.length > 0) {
            const creator = await AsyncStorage.getItem('user');
            const groupID = this.props.location.state.groupID;
            const questionID = this.props.match.params.questionID;
            await this.props.newComment(creator, commentDescription, groupID, questionID);
        }
    };

    deleteQuestion = () => {
        this.setState({ deleteModal: true });
    };
    deleteComments = (comment: any) => {
        this.setState({ deleteModal: true, commentID: comment._id });
    };

    onPressDelete = () => {
        if (this.state.deleteModal) {
            const { commentID } = this.state;
            if (commentID) {
                this.props.deleteComment(commentID);
                this.setState({ deleteModal: false, commentID: '' });
            } else {
                const { questionDetails } = this.state;
                console.log(questionDetails._id);

                this.props.deleteQuestion(questionDetails._id);
            }
        }
    };

    onCancelDeleteModal = () => {
        this.setState({ deleteModal: false });
    };

    onCommentModalClose = () => {
        this.setState({ modalState: false, commentDescription: '' });
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
                        {this.state.questionDetails && (
                            <View style={{ alignItems: 'flex-start' }}>
                                <Text style={styles.headerGroupDashboard}>Q: {this.state.questionDetails.title}</Text>
                                <Text
                                    style={this.state.dWidth <= 700 ? styles.smHeaderSmallText : styles.headerSmallText}
                                >
                                    Group Q/A : {this.props.match.params.groupName.toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <View>
                            <TouchableOpacity style={styles.newCommentButton} onPress={this.newComment}>
                                <Text style={{ color: '#fff' }}>New Comment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView style={this.state.dWidth <= 700 ? styles.smInnerContainer : innerContainer}>
                    {/*  Question Description Text */}

                    {Object.keys(questionDetails).length > 0 && questionDetails.creator && (
                        <View style={styles.questionDescriptionView}>
                            <View>
                                <Text style={[styles.questionDescriptionText, { color: '#999' }]}>
                                    {questionDetails.description}
                                </Text>
                            </View>
                            <View style={styles.questionBottomView}>
                                {this.state.currentUser && this.state.currentUser._id === questionDetails.creator._id && (
                                    <View style={styles.questionButtonsView}>
                                        <View style={styles.buttonView}>
                                            <TouchableOpacity onPress={this.editQuestion}>
                                                <Text style={styles.editButton}>Edit</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.buttonView}>
                                            <TouchableOpacity onPress={() => this.deleteQuestion()}>
                                                <Text style={styles.editButton}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
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
                                            {this.state.currentUser._id === comment.creator._id && (
                                                <TouchableOpacity onPress={() => this.editComment(comment)}>
                                                    <Text style={styles.editButton}>Edit</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <View style={styles.buttonView}>
                                            {this.state.currentUser._id === comment.creator._id && (
                                                <TouchableOpacity onPress={() => this.deleteComments(comment)}>
                                                    <Text style={styles.editButton}>Delete</Text>
                                                </TouchableOpacity>
                                            )}
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

                {/* Comment Text Field Modal */}
                {this.state.modalState && (
                    <View>
                        <View style={styles.commentModalView}>
                            <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                <TouchableOpacity
                                    style={styles.commentSubmitButton}
                                    onPress={
                                        this.state.modalType == 'edit' ? this.onCommentSendEdit : this.onCommentSendNew
                                    }
                                >
                                    <Text style={{ color: '#fff' }}>
                                        {this.state.modalType == 'edit' ? 'Edit Comment' : 'New Comment'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.commentSubmitButton} onPress={this.onCommentModalClose}>
                                    <Text style={{ color: '#fff' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.commentViewStyle}>
                                <TextInput
                                    style={[styles.commentTextField, { color: '#999' }]}
                                    value={this.state.commentDescription}
                                    onChangeText={text => this.setState({ commentDescription: text })}
                                    multiline={true}
                                    autoFocus={true}
                                    placeholder="Enter new Comment"
                                />
                            </View>
                        </View>
                        <View />
                    </View>
                )}

                {/* Delete Modal */}
                {this.state.deleteModal && (
                    <View style={styles.deleteModalViewContainer}>
                        <View style={styles.deleteModalView}>
                            <View style={styles.deleteModalText}>
                                <Text style={{ fontSize: 18 }}>Are You Sure?</Text>
                                <Text style={{ fontSize: 18 }}>This action cannot be Undone</Text>
                            </View>
                            <View style={styles.deleteModalDeleteContainer}>
                                <TouchableOpacity style={styles.deleteModalButtons} onPress={this.onCancelDeleteModal}>
                                    <Text style={{ color: '#fff' }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteModalButtons}
                                    onPress={() => this.onPressDelete()}
                                >
                                    <Text style={{ color: '#fff' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
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
    { fetchGroupQADetails, newComment, updateComment, resetUpdateStatus, deleteComment, deleteQuestion },
)(GroupQuestionPage);

const styles = StyleSheet.create({
    mainViewContainer: { marginLeft: 55, height: '92vh', marginTop: 70, position: 'relative' },
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
        marginTop: 30,
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
        marginRight: 10,
    },
    commentModalView: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        flexWrap: 'nowrap',
        alignItems: 'center',
        width: '100%',
        padding: 30,
        marginLeft: 20,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    commentViewStyle: {
        width: '70vw',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: '#aaa',
    },
    commentTextField: {
        fontSize: 20,
        height: 180,
        padding: 30,
        textAlign: 'justify',
    },
    commentSubmitButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
        width: 150,
        marginRight: 10,
    },
    deleteModalViewContainer: {
        position: 'absolute',
        top: '40%',
        left: '35%',
        // right: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        backgroundColor: '#000',
        boxShadow: '0px 0px 90px rgb(0,0,0)',
    },
    deleteModalView: {
        width: '30vw',
        height: '20vh',
        padding: 30,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        zIndex: 9,
    },

    deleteModalText: {
        flex: 4,
        padding: 7,
        width: '100%',
    },
    deleteModalButtons: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
        width: 150,
        marginRight: 10,
        marginLeft: 10,
    },
    deleteModalDeleteContainer: {
        // flexBasis: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
