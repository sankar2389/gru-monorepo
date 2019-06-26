import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet, AsyncStorage, TouchableOpacity, TextInput, Text, Image, ScrollView } from "react-native";
import { IReduxState } from "../../types";
import { connect } from "react-redux";
import { getAllBidsByUserId, clearBuyOrSellReducer } from '../../actions';
const CMS_API = process.env.CMS_API;
import moment from "moment";
import CustomeMessage from "../common/customMessage";


interface IProps extends RouteComponentProps {
    getAllBidsByUserId: (userId: string, bidStart: number) => void,
    clearBuyOrSellReducer: () => void
};

interface IState {
    myBids: any,
    bidStart: number,
    messageType: string,
    message: string,
    openCustomMessage: boolean
}

class MyBid extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    state: IState = {
        myBids: [],
        bidStart: 0,
        messageType: "",
        message: "",
        openCustomMessage: false
    }

    async componentDidMount() {
        const { bidStart } = this.state
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getAllBidsByUserId(user._id, bidStart)
    }

    componentWillReceiveProps(newProps: any) {
        const { myBids } = newProps.buyOrSell
        if (newProps.buyOrSell.messageType === "success") {
            this.setState({
                messageType: "success",
                message: newProps.buyOrSell.message,
                openCustomMessage: true
            })
            this.props.clearBuyOrSellReducer()
        }
        // type
        if (newProps.buyOrSell.messageType === "error") {
            this.setState({
                messageType: "error",
                message: newProps.buyOrSell.message,
                openCustomMessage: true
            })
            this.props.clearBuyOrSellReducer()
        }
        if (myBids.length > 0) {
            this.setState({ myBids })
        }
    }

    onPressBidNext = async () => {
        let bidStart = this.state.bidStart + 20
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getAllBidsByUserId(user._id, bidStart)
        this.setState({ bidStart: bidStart })
    }

    onPressBidPrevious = async () => {
        if (this.state.bidStart > 0) {
            let bidStart = this.state.bidStart - 20
            const user = JSON.parse((await AsyncStorage.getItem('user'))!);
            this.props.getAllBidsByUserId(user._id, bidStart)
            this.setState({ bidStart: bidStart })
        } else {
            this.setState({
                messageType: "success",
                message: "You are begning of the file",
                openCustomMessage: true
            })
        }
    }

    clearMessageState = () => {
        this.setState({ message: "", openCustomMessage: false })
    }

    render() {
        const { myBids } = this.state
        console.log("state", myBids)
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
                                            <TouchableOpacity>
                                                <Text>
                                                    Cancel
                                                </Text>
                                            </TouchableOpacity>
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        })}
                    </table> :
                    <Text />
                }
                {/* CUSTOME MESSAGE START */}
                {this.state.message ?
                    <CustomeMessage
                        type={this.state.messageType}
                        message={this.state.message}
                        openMessage={this.state.openCustomMessage}
                        clearMessageState={this.clearMessageState}
                    />
                    :
                    <Text />
                }
                {/* CUSTOME MESSAGE START */}
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }} >
                    <TouchableOpacity style={{ marginRight: 10, padding: 10 }}
                        onPress={() => this.onPressBidPrevious()}
                    >
                        <Text style={{ fontSize: 16, fontFamily: "fantasy" }}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 10, padding: 10, }}
                        onPress={() => this.onPressBidNext()}
                    >
                        <Text style={{ fontSize: 16, fontFamily: "fantasy" }}>Next</Text>
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
    getAllBidsByUserId,
    clearBuyOrSellReducer
})(MyBid);


const styles = StyleSheet.create({

});