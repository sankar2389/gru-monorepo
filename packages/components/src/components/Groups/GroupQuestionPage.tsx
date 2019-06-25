import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, ScrollView, AsyncStorage, Text, TouchableOpacity, TextInput } from "react-native";
import { fetchGroupQA } from "../../actions"
import { IReduxState } from "../../types";
import axios from "axios";
// ** Used in render function. DONOT REMOVE
import moment from "moment";

interface IProps {
    fetchGroupQA: (groupID: string, start?: number) => void
    location: any;
    group: any;
    match: any;
    history: any;
}

interface IState {
    dWidth: number;
    // questionData: any[];
    // dataLimitOnPage: number;
    // selectedPaginatateNumber: number;
    // totalPages: number[];
    // visiblePages: number[];
}

class GroupQuestionPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            dWidth: 0
        }
    }

    async componentDidMount() {
        window.addEventListener("resize", this.updateDimension);
    }

    async componentWillMount() {
        this.updateDimension()
    }


    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimension)
    }

    updateDimension = () => {
        this.setState({
            dWidth: window.innerWidth
        })
    }

    render() {
        return (
            <View>
                <Text>Hello Question</Text>
            </View>
        )
    }
}

export default GroupQuestionPage;