import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet, AsyncStorage, TouchableOpacity, TextInput, Text, Image, ScrollView } from "react-native";
import { IReduxState } from "../../types";
import { connect } from "react-redux";
import { } from '../../actions';
const CMS_API = process.env.CMS_API;
import moment from "moment";

import CustomeMessage from "../common/customMessage";


interface IProps extends RouteComponentProps {

};

interface IState {

}

class MyBid extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    state: IState = {

    }


    render() {
        return (
            <View>
                <Text>My Bids</Text>
            </View>
        );
    }
}
const mapStateToProps = ({ auth, buyOrSell }: any): IReduxState => {
    return { auth, buyOrSell };
};

export default connect<IReduxState>(mapStateToProps, {


})(MyBid);



const styles = StyleSheet.create({

});