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
            <View style={{ marginLeft: 80, marginTop: 80 }}>
                <Text>My Bids</Text>
                {myBids.length > 0 ?
                    <table style={{ width: "99%" }}>
                        <thead>
                            <tr>
                                <th style={{ border: 1 }}>Bid Price</th>
                                <th style={{ border: 1 }}>Bid Quantity</th>
                                <th style={{ border: 1 }}>Total Price</th>
                                <th style={{ border: 1 }}>Created Date</th>
                                <th style={{ border: 1 }}>Action</th>
                            </tr>
                        </thead>
                        {myBids.map((bid: any, index: number) => {
                            return (
                                <tbody key={index}>
                                    <tr style={index % 2 === 0 ? { backgroundColor: "#71848B" } : { backgroundColor: "#D4E1EC" }}>
                                        <td >
                                            {bid.bidPrice}
                                        </td>
                                        <td style={{ border: 1 }}>
                                            {bid.bidQuantity}
                                        </td>
                                        <td style={{ border: 1 }}>
                                            {bid.totalPrice}
                                        </td>
                                        <td style={{ border: 1 }}>
                                            {moment(bid.createdAt).format("ll")}
                                        </td>
                                        <td style={{ border: 1 }}>
                                            Button
                                        </td>

                                    </tr>
                                </tbody>
                            )
                        })}
                    </table> :
                    <Text />
                }
                <View style={{ backgroundColor: "red", flexDirection: "row", justifyContent: "flex-end", marginRight: 18, marginTop: 10 }}>
                    <TouchableOpacity style={{ marginRight: 10, padding: 10 }}>
                        <Text>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>Next</Text>
                    </TouchableOpacity>
                </View>
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