import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet, AsyncStorage, TouchableOpacity, TextInput, Text, Image, ScrollView } from "react-native";
import { IReduxState } from "../../types";
import { connect } from "react-redux";
import { getAllBidsByUserId } from '../../actions';
const CMS_API = process.env.CMS_API;
import moment from "moment";

import CustomeMessage from "../common/customMessage";


interface IProps extends RouteComponentProps {
    getAllBidsByUserId: (userId: string, bidStart: number) => void
};

interface IState {
    myBids: any,
    bidStart: number
}

class MyBid extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    state: IState = {
        myBids: [],
        bidStart: 0
    }

    async componentDidMount() {
        const { bidStart } = this.state
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getAllBidsByUserId(user._id, bidStart)
    }

    componentWillReceiveProps(newProps: any) {
        console.log("newProps", newProps.buyOrSell.myBids)
        const { myBids } = newProps.buyOrSell
        if (myBids.length > 0) {
            this.setState({ myBids })
        }
    }

    render() {
        console.log("state", this.state.myBids)
        const { myBids } = this.state
        return (
            <View style={{ marginLeft: 80, marginTop: 80, alignItems: "flex-start" }}>
                <Text>My Bids</Text>
                {myBids.length > 0 ?
                    <table style={{ backgroundColor: "yellow", width: "99%" }}>
                        <thead style={{ backgroundColor: "red" }}>
                            <tr>
                                <th>Bid Price</th>
                                <th>Bid Quantity</th>
                                <th>Total Price</th>
                                <th>Created Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {myBids.map((bid: any, index: number) => {
                            return (
                                <tbody key={index}>
                                    <tr>
                                        <td>
                                            {bid.bidPrice}
                                        </td>
                                        <td>
                                            {bid.bidQuantity}
                                        </td>
                                        <td>
                                            {bid.totalPrice}
                                        </td>
                                        <td>
                                            {moment(bid.createdAt).format("ll")}
                                        </td>
                                        <td>
                                            Button
                                        </td>

                                    </tr>
                                </tbody>
                            )
                        })}

                    </table> :
                    <Text />
                }
            </View>
        );
    }
}
const mapStateToProps = ({ auth, buyOrSell }: any): IReduxState => {
    return { auth, buyOrSell };
};

export default connect<IReduxState>(mapStateToProps, {
    getAllBidsByUserId
})(MyBid);


const styles = StyleSheet.create({

});