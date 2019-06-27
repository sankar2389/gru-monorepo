import React from "react"
import { StyleSheet, View, Text, AsyncStorage, Animated, Image, TouchableOpacity } from "react-native";
import moment from "moment";

interface IProps {
    bids: any,
    bidOn: string,
    buyOrSell: any,
    bidActionButtonFunc: Function
}

interface IState {
    bidStartNumber: number,
    bidEndNumber: number,
    userId: string,
    bids: any,
    sortingOrder: string,
}

class BuyAndSellBidsTable extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    state: IState = {
        bidStartNumber: 0,
        bidEndNumber: 5,
        userId: "",
        bids: [],
        sortingOrder: "asc"
    }

    componentWillReceiveProps(newProps: any) {
        if (newProps.bids) {
            this.setState({ bids: newProps.bids })
        }
    }

    async componentDidMount() {
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.setState({
            userId: user._id
        })
    }

    sortONBuyOrSellBids = (field: string) => {
        const { bids, sortingOrder } = this.state
        let sortData

        if (sortingOrder === "asc") {
            sortData = bids.sort((a: any, b: any) => {
                if (a[field] < b[field]) {
                    return -1 //sort ascending
                }
                return 0 //default return
            })
            this.setState({ bids: sortData, sortingOrder: "desc" })
        }
        if (sortingOrder === "desc") {
            sortData = bids.sort((a: any, b: any) => {
                if (b[field] < a[field]) {
                    return -1 //sort descending
                }
                return 0 //default return
            })
            this.setState({ bids: sortData, sortingOrder: "asc" })
        }
    }

    bidsNextOrPrevious = (mode: string) => {
        if (mode === "next") {
            this.setState({
                bidStartNumber: this.state.bidStartNumber + 5,
                bidEndNumber: this.state.bidEndNumber + 5,
            })
        }
        if (mode === "previous") {
            this.setState({
                bidStartNumber: this.state.bidStartNumber - 5,
                bidEndNumber: this.state.bidEndNumber - 5,
            })
        }
    }

    render() {
        const { buyOrSell, bidOn } = this.props
        const { bidStartNumber, bidEndNumber, bids, userId } = this.state
        return bids.length > 0 ?
            <View>
                <View style={styles.firstBidViewStyle}>
                    <Text style={styles.bidHeaderText}>User name</Text>
                    <TouchableOpacity style={styles.bidHeaderText} onPress={() => this.sortONBuyOrSellBids("bidPrice")}>
                        <Text style={styles.bidHeaderText}>Bid Price</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bidHeaderText} onPress={() => this.sortONBuyOrSellBids("bidQuantity")}>
                        <Text >Bid Quantity</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bidHeaderText} onPress={() => this.sortONBuyOrSellBids("totalPrice")}>
                        <Text style={styles.bidHeaderText}>Total Price</Text>
                    </TouchableOpacity>
                    <Text style={styles.bidHeaderText}>Date</Text>
                    <Text style={styles.bidHeaderText}>Action</Text>
                </View>
                {bids.map((bid: any, index: number) => {
                    if (userId === bid.userId || userId === buyOrSell.creator) {
                        if (index >= bidStartNumber && index < bidEndNumber)
                            return (
                                <View key={index} style={styles.bidStyle}>
                                    <Text style={{ flex: 1 }}>{bid.user[0].username}</Text>
                                    <Text style={{ flex: 1 }}>{bid.bidPrice}</Text>
                                    <Text style={{ flex: 1 }}>{bid.bidQuantity}</Text>
                                    <Text style={{ flex: 1 }}>{bid.totalPrice}</Text>
                                    <Text style={{ flex: 1 }}>{moment(bid.createdAt).format('LL')}</Text>
                                    {
                                        userId === buyOrSell.creator ?
                                            <View style={styles.actionButtonView}>
                                                <TouchableOpacity
                                                    style={[styles.bidActionButton, styles.bidAcceptButton]}
                                                    onPress={() => this.props.bidActionButtonFunc(bidOn, "accepted", bid._id, buyOrSell._id, bid.userId)}
                                                >
                                                    <Text style={styles.bidActionButtonText}>
                                                        Accept
                                                </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.bidActionButton, styles.bidRejectButton]}
                                                    onPress={() => this.props.bidActionButtonFunc(bidOn, "rejected", bid._id, buyOrSell._id, bid.userId)}
                                                >
                                                    <Text style={styles.bidActionButtonText}>
                                                        Reject
                                                </Text>
                                                </TouchableOpacity>
                                            </View> :
                                            <View style={styles.actionButtonView} />
                                    }
                                </View>
                            )
                    }
                })}

                {
                    bids.length > 5 ?
                        <View style={styles.bidPaginationView}>
                            <TouchableOpacity style={styles.bidPreviousButton}
                                disabled={bidStartNumber === 0 ? true : false}
                                onPress={() => this.bidsNextOrPrevious("previous")}
                            >
                                <Text style={styles.bidButtonText}>
                                    {"<"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.bidNextButton}
                                disabled={bidEndNumber >= bids.length ? true : false}
                                onPress={() => this.bidsNextOrPrevious("next")}
                            >
                                <Text style={styles.bidButtonText}>
                                    {">"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <Text />
                }
            </View> : <Text />
    }
}
export default BuyAndSellBidsTable;

const styles = StyleSheet.create({
    firstBidViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#2a4944',
        borderTopWidth: 1,
        backgroundColor: '#hg65796',
        marginLeft: 15,
        marginRight: 15
    },
    bidHeaderText: { flex: 1 },
    bidStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        margin: 2,
        borderColor: '#2a4944',
        borderWidth: 1,
        backgroundColor: '#d2f7f1'
    },
    bidPaginationView: { flexDirection: "row", justifyContent: "flex-end", padding: 5, marginRight: 10 },
    bidPreviousButton: { marginRight: 20, paddingLeft: 5, paddingRight: 5 },
    actionButtonView: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" },
    bidActionButton: { padding: 4, marginRight: 5, borderRadius: 5, alignItems: "center", justifyContent: "center" },
    bidAcceptButton: { backgroundColor: "#1D96A8", },
    bidActionButtonText: { color: "#ffffff", fontSize: 14 },
    bidRejectButton: { backgroundColor: "#FF1C14" },
    bidButtonText: { fontSize: 18 },
    bidNextButton: { paddingLeft: 5, paddingRight: 5 },
})

