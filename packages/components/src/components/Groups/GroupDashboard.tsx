import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ScrollView, AsyncStorage, Text, TouchableOpacity, TextInput } from 'react-native';
import { fetchGroupQA } from '../../actions';
import { IReduxState } from '../../types';
import axios from 'axios';

// ** Used in render function. DONOT REMOVE
import moment from 'moment';

interface IProps {
    fetchGroupQA: (groupID: string, start?: number) => void;
    location: any;
    group: any;
    match: any;
    history: any;
}

interface IState {
    dWidth: number;
    questionData: any[];
    dataLimitOnPage: number;
    selectedPaginatateNumber: number;
    totalPages: number[];
    visiblePages: number[];
}

class GroupDashboard extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            dWidth: 0,
            questionData: [],
            dataLimitOnPage: 10,
            selectedPaginatateNumber: 1,
            totalPages: [],
            visiblePages: [],
        };
    }

    async componentDidMount() {
        await this.props.fetchGroupQA(this.props.location.state.groupID);
        this.getTotalPages();
        window.addEventListener('resize', this.updateDimension);
    }

    componentWillReceiveProps(newProps: IProps) {
        this.setState({ questionData: newProps.group.questions.questions });
        this.getTotalPages();
    }

    async componentWillMount() {
        this.updateDimension();
    }
    updateDimension = () => {
        this.setState({
            dWidth: window.innerWidth,
        });
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimension);
    }

    onClickQuestion(question: any) {
        AsyncStorage.getItem('token').then((authtoken: string | null) => {
            if (authtoken) {
                this.props.history.push({
                    pathname: `/secure/groups/${this.props.match.params.groupName}/${question._id}`,
                    state: { authtoken, question },
                });
            }
        });
    }

    // Function to get Total pages

    getTotalPages = () => {
        AsyncStorage.getItem('token').then(async (authtoken: string | null) => {
            if (authtoken) {
                const res = await this.getCount('questions', authtoken, this.props.location.state.groupID);

                this.setState(
                    {
                        totalPages: res,
                    },
                    () => {
                        this.updateVisiblePages();
                    },
                );
            }
        });
    };

    // Function to get all records in the DB by datatype as BUY/SELL

    getCount = async (dataType: string, authtoken: string, groupID: number) => {
        const res = await axios.get(process.env.CMS_API + `${dataType}/count?groupID=${groupID}`, {
            headers: {
                Authorization: 'Bearer ' + authtoken,
            },
        });
        const { dataLimitOnPage } = this.state;

        const { data } = res;
        let totalPages = Math.floor(data / dataLimitOnPage);

        if (data % dataLimitOnPage) {
            totalPages += 1;
        }
        const pagesArray: number[] = [];

        for (let i = 1; i <= totalPages; i++) {
            pagesArray.push(i);
        }

        return pagesArray;
    };

    // function to update visible pages to show 3 pages only
    updateVisiblePages = () => {
        const { totalPages, selectedPaginatateNumber } = this.state;
        if (selectedPaginatateNumber !== 1 && selectedPaginatateNumber !== totalPages.length) {
            const visiblePages = totalPages.slice(selectedPaginatateNumber - 2, selectedPaginatateNumber + 1);
            this.setState({ visiblePages });
        } else if (selectedPaginatateNumber === 1) {
            const visiblePages = totalPages.slice(0, 3);
            this.setState({ visiblePages });
        } else {
            const visiblePages = totalPages.slice(-3);
            this.setState({ visiblePages });
        }
    };

    onPressPaginateNext = () => {
        const { selectedPaginatateNumber, totalPages } = this.state;

        if (selectedPaginatateNumber !== totalPages.length) {
            this.setState(
                (prevState: any) => {
                    return {
                        selectedPaginatateNumber: prevState.selectedPaginatateNumber + 1,
                    };
                },
                () => {
                    const { selectedPaginatateNumber, dataLimitOnPage } = this.state;
                    const start = (selectedPaginatateNumber - 1) * dataLimitOnPage;
                    this.props.fetchGroupQA(this.props.location.state.groupID, start);
                },
            );
        }
    };

    // pagination Previous
    onPressPaginatePrevious = () => {
        const { selectedPaginatateNumber } = this.state;
        if (selectedPaginatateNumber !== 1) {
            this.setState(
                (prevState: any) => {
                    return {
                        selectedPaginatateNumber: prevState.selectedPaginatateNumber - 1,
                    };
                },
                () => {
                    const { selectedPaginatateNumber, dataLimitOnPage } = this.state;
                    const start = (selectedPaginatateNumber - 1) * dataLimitOnPage;
                    this.props.fetchGroupQA(this.props.location.state.groupID, start);
                },
            );
        }
    };

    async onPressPaginate(pageCount: number) {
        const { dataLimitOnPage } = this.state;
        this.setState({ selectedPaginatateNumber: pageCount }, () => {
            const start = (pageCount - 1) * dataLimitOnPage;
            this.props.fetchGroupQA(this.props.location.state.groupID, start);
        });
    }

    render() {
        const { innerContainer } = styles;
        return (
            <View style={this.state.dWidth <= 700 ? styles.smMainViewContainer : styles.mainViewContainer}>
                <ScrollView style={this.state.dWidth <= 700 ? styles.smInnerContainer : innerContainer}>
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={styles.headerGroupDashboard}>Group Dashboard</Text>
                        <Text style={this.state.dWidth <= 700 ? styles.smHeaderSmallText : styles.headerSmallText}>
                            Group Q/A : {this.props.match.params.groupName.toUpperCase()}
                        </Text>
                    </View>

                    {/*  Table header */}

                    <View style={styles.tableHeaderStyles}>
                        <View style={{ flex: 2 }}>
                            <Text style={[styles.tableColumnText, { color: '#888' }]}>Title</Text>
                        </View>
                        <View style={styles.tableColumnView}>
                            <Text style={[styles.tableColumnText, { color: '#888' }]}>Creator</Text>
                        </View>
                        <View style={styles.tableColumnView}>
                            <Text style={[styles.tableColumnText, { color: '#888' }]}>Answers</Text>
                        </View>
                        <View style={styles.tableColumnView}>
                            <Text style={[styles.tableColumnText, { color: '#888' }]}>Last Activity</Text>
                        </View>
                    </View>

                    {/* ** Display Questions Table */}
                    {this.state.questionData &&
                        this.state.questionData.length > 0 &&
                        this.state.questionData.map((question: any) => (
                            <TouchableOpacity
                                style={styles.tableRowStyles}
                                key={question._id}
                                onPress={() => this.onClickQuestion(question)}
                            >
                                <View style={{ flex: 2 }}>
                                    <Text style={[styles.tableRowText, { color: '#555' }]}>{question.title}</Text>
                                </View>
                                <View style={styles.tableRowView}>
                                    <Text style={[styles.tableRowText, { color: '#555' }]}>
                                        {question.creator.username}
                                    </Text>
                                </View>
                                <View style={styles.tableRowView}>
                                    <Text style={[styles.tableRowText, { color: '#555' }]}>
                                        {Object.keys(question.comments).length}
                                    </Text>
                                </View>
                                <View style={styles.tableRowView}>
                                    <Text style={[styles.tableRowText, { color: '#555' }]}>
                                        {moment(question.updatedAt).fromNow()}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                    {this.state.questionData && this.state.questionData.length == 0 && (
                        <TouchableOpacity style={styles.tableRowStyles}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.tableRowText, { color: '#555' }]}>No questions Found</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </ScrollView>

                {/* PAGINATION VIEW START */}
                <View style={this.state.dWidth <= 700 ? styles.smPaginationView : styles.paginationView}>
                    <TouchableOpacity onPress={this.onPressPaginatePrevious} style={styles.paginationButton}>
                        <Text>{'<'}</Text>
                    </TouchableOpacity>

                    {this.state.visiblePages.map((pageCount: number) => {
                        return (
                            <TouchableOpacity
                                key={pageCount}
                                onPress={this.onPressPaginate.bind(this, pageCount)}
                                style={
                                    this.state.selectedPaginatateNumber === pageCount
                                        ? styles.pageCountStyle
                                        : styles.paginationButton
                                }
                            >
                                <Text
                                    style={
                                        this.state.selectedPaginatateNumber === pageCount
                                            ? styles.pageCountTextStyle
                                            : null
                                    }
                                >
                                    {pageCount}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}

                    <TouchableOpacity onPress={this.onPressPaginateNext} style={styles.paginationButton}>
                        <Text>{'>'}</Text>
                    </TouchableOpacity>
                </View>
                {/* PAGINATION VIEW END */}
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
    { fetchGroupQA },
)(GroupDashboard);

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
    textItemView: {
        flex: 1,
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    nestedGroupListView: {
        padding: 8,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    smNestedGroupListView: {
        padding: 8,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    userNameText: {
        flexWrap: 'wrap',
        paddingTop: 10,
        fontWeight: '900',
        fontSize: 14,
    },

    tableHeaderStyles: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100vw',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: 'transparent',
        margin: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#aaa',
        padding: 10,
    },
    tableColumnView: {
        flex: 1,
    },
    tableColumnText: {
        fontSize: 21,
    },
    tableRowStyles: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100vw',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: '#fff',
        margin: 10,
        padding: 10,
    },
    tableRowView: {
        flex: 1,
    },
    tableRowText: {
        fontSize: 21,
    },

    paginationView: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'center',
        marginLeft: 10,
        position: 'absolute',
        top: '99%',
    },
    smPaginationView: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '99%',
        width: '100%',
    },
    paginationButton: {
        marginRight: 20,
        backgroundColor: '#ffffff',
        borderRadius: 30,
        padding: 10,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageCountStyle: {
        marginRight: 20,
        backgroundColor: '#d72b2b',
        borderRadius: 30,
        padding: 10,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageCountTextStyle: {
        color: '#ffffff',
    },
});
