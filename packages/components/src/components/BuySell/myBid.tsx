import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet, AsyncStorage, TouchableOpacity, TextInput, Text, Image, ScrollView } from "react-native";
import { IReduxState } from "../../types";
import { connect } from "react-redux";
import { getAllBidsByUserId, clearBuyOrSellReducer, getOrderById } from '../../actions';
const CMS_API = process.env.CMS_API;
import moment from "moment";
import CustomeMessage from "../common/customMessage";


interface IProps extends RouteComponentProps {
    getAllBidsByUserId: (userId: string, bidStart: number) => void,
    clearBuyOrSellReducer: () => void,
    getOrderById: (orderId: string, buyOrSellType: string) => void
};

interface IState {
    myBids: any,
    bidStart: number,
    messageType: string,
    message: string,
    openCustomMessage: boolean,
    isModalVisible: boolean,
    buyOrSellOrder: any,
    buyOrSellType: string
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
        openCustomMessage: false,
        isModalVisible: false,
        buyOrSellOrder: [],
        buyOrSellType: ""
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
            this.setState({ myBids, buyOrSellOrder: newProps.buyOrSell.buyOrSellOrder })
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

    onPressGetOrder = (orderId: string, buyOrSellType: string) => {
        this.props.getOrderById(orderId, buyOrSellType)
        this.setState({
            isModalVisible: true,
            buyOrSellType: buyOrSellType
        })
    }

    onPressCancelModal = () => {
        this.setState({
            isModalVisible: false,
            buyOrSellOrder: []
        })
    }

    render() {
        const { myBids, buyOrSellOrder } = this.state
        console.log("state", buyOrSellOrder)
        return (
            <View style={{ marginLeft: 80, marginTop: 80 }}>
                <Text>My Bids</Text>
                {myBids.length > 0 ?
                    <table style={{ width: "99%" }}>
                        <thead>
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

                                    <tr style={index % 2 === 0 ? { backgroundColor: "#71848B" } : { backgroundColor: "#D4E1EC" }}>
                                        <td >
                                            <TouchableOpacity onPress={() => this.onPressGetOrder(bid.buyOrSellId, bid.buyOrSellType)}>
                                                {bid.bidPrice}
                                            </TouchableOpacity>
                                        </td>
                                        <td>
                                            <TouchableOpacity onPress={() => this.onPressGetOrder(bid.buyOrSellId, bid.buyOrSellType)}>
                                                {bid.bidQuantity}
                                            </TouchableOpacity>
                                        </td>
                                        <td>
                                            <TouchableOpacity onPress={() => this.onPressGetOrder(bid.buyOrSellId, bid.buyOrSellType)}>
                                                {bid.totalPrice}
                                            </TouchableOpacity>
                                        </td>
                                        <td>
                                            <TouchableOpacity onPress={() => this.onPressGetOrder(bid.buyOrSellId, bid.buyOrSellType)}>
                                                <Text>
                                                    {moment(bid.createdAt).format("ll")}
                                                </Text>
                                            </TouchableOpacity>
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

                {/* BID MODAL START */}
                {
                    this.state.isModalVisible && buyOrSellOrder.length > 0 ?
                        <View style={styles.modalContainer}>
                            <View style={styles.modalView}>
                                <table style={{ width: "99%" }}>
                                    <thead>
                                        <tr>
                                            <th> Quantity</th>
                                            <th>Type</th>
                                            <th>Price</th>
                                            <th>OrderOn</th>
                                        </tr>
                                    </thead>

                                    <tbody >
                                        <tr>
                                            <td >
                                                {buyOrSellOrder[0].quantity}  {buyOrSellOrder[0].unit}
                                            </td>
                                            <td >
                                                {buyOrSellOrder[0].type}
                                            </td>
                                            <td >
                                                {buyOrSellOrder[0].price}
                                            </td>
                                            <td >
                                                {this.state.buyOrSellType}
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                                <View style={{
                                    width: "98%", flexDirection: "row", justifyContent: "flex-end", position: "absolute", bottom: 0, right: 0,
                                }}>
                                    <TouchableOpacity
                                        onPress={() => this.onPressCancelModal()}
                                        style={styles.modalCancelButton}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View> :
                        <Text />
                }
                {/* BIDS MODAL END */}

            </View>
        );
    }
}
const mapStateToProps = ({ auth, buyOrSell }: any): IReduxState => {
    return { auth, buyOrSell };
};

export default connect<IReduxState>(mapStateToProps, {
    getAllBidsByUserId,
    clearBuyOrSellReducer,
    getOrderById
})(MyBid);


const styles = StyleSheet.create({
    modalContainer: {
        // backgroundColor: "gray",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: "100vh"
    },
    modalView: {
        backgroundColor: "#8F99AB",
        width: "90%",
        height: "20%",
        position: "relative",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    modalCancelButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#ffffff"
    },

});