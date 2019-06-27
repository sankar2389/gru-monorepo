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
    // questionData: any[];
    // dataLimitOnPage: number;
    // selectedPaginatateNumber: number;
    // totalPages: number[];
    // visiblePages: number[];
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

    render() {
        const { innerContainer } = styles;
        const { questionDetails } = this.state;
        return (
            <View style={this.state.dWidth <= 700 ? styles.smMainViewContainer : styles.mainViewContainer}>
                <ScrollView style={this.state.dWidth <= 700 ? styles.smInnerContainer : innerContainer}>
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={styles.headerGroupDashboard}>Q: {this.state.questionDetails.title}</Text>
                        <Text style={this.state.dWidth <= 700 ? styles.smHeaderSmallText : styles.headerSmallText}>
                            Group Q/A : {this.props.match.params.groupName.toUpperCase()}
                        </Text>
                    </View>

                    {/*  Question Description Text */}

                    {questionDetails.creator && (
                        <View style={styles.questionDescriptionView}>
                            <View>
                                <Text style={[styles.questionDescriptionText, { color: '#999' }]}>
                                    {questionDetails.description}
                                </Text>
                            </View>
                            <View style={styles.questionAuthorView}>
                                <Text style={styles.questionAuthorText}>By {questionDetails.creator.username}</Text>
                                <Text style={styles.questionAuthorText}>By {questionDetails.creator.username}</Text>
                            </View>
                        </View>
                    )}
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
    mainViewContainer: { marginLeft: 55, height: 810, marginTop: 70 },
    smMainViewContainer: { marginLeft: 5, height: 503, zIndex: -1 },
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
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        width: '90vw',
        // flexDirection: 'column',
        // flexWrap: 'nowrap',
        backgroundColor: 'transparent',
        marginLeft: 70,
        borderBottomWidth: 1,
        // borderLeftWidth: 1,
        // borderRightWidth: 1,
        // borderTopWidth: 1,
        borderBottomColor: '#aaa',
        padding: 40,
    },
    tableColumnView: {
        flex: 1,
    },
    questionDescriptionText: {
        fontSize: 25,
        textAlign: 'justify',
    },
    questionAuthorView: {
        margin: 50,
        padding: 20,
    },
    questionAuthorText: {
        textAlign: 'right',
        fontSize: 20,
        color: '#000',
    },
});
