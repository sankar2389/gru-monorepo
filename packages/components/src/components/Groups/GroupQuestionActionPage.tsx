import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ScrollView, AsyncStorage, Text, TouchableOpacity, TextInput } from 'react-native';
import { fetchGroupQADetails, updateQuestion, newQuestion, resetUpdateStatus } from '../../actions';
import { IReduxState } from '../../types';
import axios from 'axios';
// ** Used in render function. DONOT REMOVE
import moment from 'moment';

interface IProps {
    fetchGroupQADetails: (questionID: string) => void;
    updateQuestion: (questionID: string, title: string, description: string) => void;
    newQuestion: (creator: any, title: string, description: string, groupID: string) => void;
    resetUpdateStatus: () => void;
    location: any;
    group: any;
    match: any;
    history: any;
}

interface IState {
    dWidth: number;
    questionDetails: any;
    title: string;
    description: string;
    questionID: string;
}

class GroupCommentsActionPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            dWidth: 0,
            questionDetails: {},
            description: '',
            title: '',
            questionID: '',
        };
    }

    async componentDidMount() {
        this.getData();
        window.addEventListener('resize', this.updateDimension);
    }

    getData = async () => {
        if (this.props.match.params.action === 'edit') {
            await this.props.fetchGroupQADetails(this.props.match.params.questionID);
        }
        if (this.props.match.params.action === 'new') {
            this.setState({ questionDetails: {}, description: '', questionID: '' });
        }
    };

    componentWillReceiveProps(newProps: any) {
        if (this.props.match.params.action === 'edit') {
            if (newProps.group.questionDetails) {
                this.setState({
                    questionDetails: newProps.group.questionDetails,
                    title: newProps.group.questionDetails.title,
                    description: newProps.group.questionDetails.description,
                    questionID: newProps.match.params.questionID,
                });
            }
        }
        if (this.props.match.params.action === 'new') {
            this.setState({ questionDetails: {}, description: '', questionID: '' });
        }
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        if (prevProps.group.questionUpdateStatus !== this.props.group.questionUpdateStatus) {
            if (this.props.group.questionUpdateStatus === 0) {
                AsyncStorage.getItem('token').then((authtoken: string | null) => {
                    if (authtoken) {
                        this.props.history.push({
                            pathname: `/secure/groups/${this.props.match.params.groupName}/`,
                            state: { authtoken, groupID: this.props.location.state.groupID },
                        });
                        this.props.resetUpdateStatus();
                    }
                });
            }
            if (this.props.group.questionUpdateStatus === 1) {
                this.props.resetUpdateStatus();
                alert('Something Wrong with question sending');
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

    updateQuestion = async () => {
        const { questionID, title, description } = this.state;
        await this.props.updateQuestion(questionID, title, description);
    };

    newQuestion = async () => {
        const { title, description } = this.state;
        if (title.length > 0 && description.length > 0) {
            const creator = await AsyncStorage.getItem('user');
            const groupID = this.props.location.state.groupID;
            await this.props.newQuestion(creator, title, description, groupID);
        }
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
                            <Text style={styles.headerGroupDashboard}>
                                {this.props.match.params.action === 'edit' ? 'Edit Question' : 'New Question'}
                            </Text>
                            <Text style={this.state.dWidth <= 700 ? styles.smHeaderSmallText : styles.headerSmallText}>
                                Group Q/A : {this.props.match.params.groupName.toUpperCase()}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={
                                    this.props.match.params.action === 'edit' ? this.updateQuestion : this.newQuestion
                                }
                            >
                                <Text style={{ color: '#fff' }}>
                                    {this.props.match.params.action === 'edit' ? 'Edit Question' : 'Add New Question'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView style={this.state.dWidth <= 700 ? styles.smInnerContainer : innerContainer}>
                    {/*  Question Description Text */}

                    <View style={styles.questionTitleView}>
                        <View>
                            <TextInput
                                style={[styles.questionTitleTextField, { color: '#999' }]}
                                value={this.state.title}
                                onChangeText={text => this.setState({ title: text })}
                                multiline={true}
                                autoFocus={true}
                                placeholder="Enter Title"
                            />
                        </View>
                    </View>
                    <View style={styles.questionDescriptionView}>
                        <View>
                            <TextInput
                                style={[styles.questionDescTextField, { color: '#999' }]}
                                value={this.state.description}
                                onChangeText={text => this.setState({ description: text })}
                                multiline={true}
                                placeholder="Enter Question Description"
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
    { fetchGroupQADetails, updateQuestion, newQuestion, resetUpdateStatus },
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
    questionTitleView: {
        width: '90vw',
        backgroundColor: 'transparent',
        marginLeft: 50,
        marginBottom: 50,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: '#aaa',
    },
    questionDescriptionView: {
        width: '90vw',
        backgroundColor: 'transparent',
        marginLeft: 50,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: '#aaa',
    },
    questionDescTextField: {
        fontSize: 20,
        height: 380,
        padding: 30,
        textAlign: 'justify',
    },

    questionTitleTextField: {
        fontSize: 20,
        // height: 380,
        padding: 20,
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
        width: 150,
        marginRight: 50,
    },
});
