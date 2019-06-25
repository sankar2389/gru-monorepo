import React from "react"
import { StyleSheet, View, Text, Easing, Animated, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import BuyAndSellBidsTable from "./buyAndSellBidsTable";

interface IProps {
    data: any,
    bidOn: string,
    bids: any
    dWidth: Number,
    onPressExpandedBid: Function,
    onPressSetBidPrice: Function,
    bidActionButtonFunc: Function
}

interface IState {
    buyOrSellData: any[],
    sortingCounter: number,
    sortedQueue: any,
    sortingOrder: string,
    sortingFieldName: string,
    previousSortingOrder: string,
    buyOrSellIndex: number
}

class BuyAndSellTable extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    state: IState = {
        buyOrSellData: [],
        sortingCounter: 0,
        sortedQueue: [],
        sortingOrder: "asc",
        sortingFieldName: "",
        previousSortingOrder: "",
        buyOrSellIndex: -1

    }

    componentWillReceiveProps(newProps: any) {
        console.log("newJProps", newProps)
        this.setState({ buyOrSellData: newProps.data })
    }

    sortBuyOrSellData = (sortOnField: string) => {
        const { sortingCounter, sortedQueue, sortingOrder, sortingFieldName, previousSortingOrder } = this.state
        let counter = sortingCounter + 1
        if (sortingFieldName === sortOnField) {
            if (counter >= 2) {
                if (sortedQueue.length > 1) {
                    sortedQueue.pop()
                    let field = sortedQueue[sortedQueue.length - 1]
                    this.onCallPreviousSortBuyAndSellFunction(field, sortOnField)
                } else {
                    let field = sortedQueue[sortedQueue.length - 1]
                    this.callOnSortingBuyAndSell(field, sortOnField, counter = 0, previousSortingOrder)
                }


            } else {
                let field = sortedQueue[sortedQueue.length - 1]
                this.callOnSortingBuyAndSell(field, sortOnField, counter, previousSortingOrder)
            }
        } else {
            sortedQueue.push(sortOnField)
            let field = sortedQueue[sortedQueue.length - 1]
            if (sortingOrder === "asc") {
                this.callOnSortingBuyAndSell(field, sortOnField, counter, "asc")
            }
            if (sortingOrder === "desc") {
                this.callOnSortingBuyAndSell(field, sortOnField, counter, "desc")
            }
        }

    }

    onCallPreviousSortBuyAndSellFunction = (field: string, sortOnField: string) => {
        const { sortedQueue, buyOrSellData, previousSortingOrder } = this.state
        let sortedData

        if (previousSortingOrder === "asc") {
            sortedData = buyOrSellData.sort((a: any, b: any) => {
                if (a[field] < b[field]) {
                    return -1 //sort ascending
                }
                return 0 //default return
            })
            this.setState({
                buyOrSellData: sortedData,
                sortingOrder: "desc",
                sortingCounter: 0,
                sortedQueue: sortedQueue,
                sortingFieldName: sortOnField,
            })
        }
        if (previousSortingOrder === "desc") {
            sortedData = buyOrSellData.sort((a: any, b: any) => {
                if (b[field] < a[field]) {
                    return -1 //sort descending
                }
                return 0 //default return
            })
            this.setState({
                buyOrSellData: sortedData,
                sortingOrder: "asc",
                sortingCounter: 0,
                sortedQueue: sortedQueue,
                sortingFieldName: sortOnField,
            })
        }

    }

    callOnSortingBuyAndSell = (field: string, sortOnField: string, counter: number, previousSortingOrder: string) => {
        const { sortedQueue, buyOrSellData, sortingOrder, } = this.state
        let sortedData
        if (sortingOrder === "asc") {
            sortedData = buyOrSellData.sort((a: any, b: any) => {
                if (a[field] < b[field]) {
                    return -1 //sort ascending
                }
                return 0 //default return
            })
            this.setState({
                buyOrSellData: sortedData,
                sortingOrder: "desc",
                sortingCounter: counter,
                sortedQueue: sortedQueue,
                sortingFieldName: sortOnField,
                previousSortingOrder: previousSortingOrder
            })
        }
        if (sortingOrder === "desc") {
            sortedData = buyOrSellData.sort((a: any, b: any) => {
                if (b[field] < a[field]) {
                    return -1 //sort descending
                }
                return 0 //default return
            })
            this.setState({
                buyOrSellData: sortedData,
                sortingOrder: "asc",
                sortingCounter: counter,
                sortedQueue: sortedQueue,
                sortingFieldName: sortOnField,
                previousSortingOrder: previousSortingOrder
            })
        }

    }

    onPressExpandedBids = (buyOrSell: any, index: number) => {
        if (buyOrSell.bids.length > 0) {
            this.setState({ buyOrSellIndex: index })
            this.props.onPressExpandedBid(buyOrSell)
        } else {
            this.props.onPressExpandedBid(buyOrSell)
        }


    }

    render() {
        const { dWidth, bidOn, bids } = this.props
        const { buyOrSellData, buyOrSellIndex } = this.state
        return (
            buyOrSellData.length > 0 ?
                <View>
                    <View style={dWidth <= 700 ? styles.smNestedGroupListViewHeader : styles.nestedGroupListViewHeader}>
                        <View style={styles.imageAndNameView}>
                            <TouchableOpacity >
                                <Text style={[styles.userNameText, { marginLeft: 50 }]}>{"UserName"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textItemView}>
                            <Text style={styles.buyOrSellTextHeader}>
                                asks
                                    </Text>
                        </View>
                        <View style={styles.secondRowView}>
                            <View style={styles.textItemView}>
                                <TouchableOpacity onPress={() => { this.sortBuyOrSellData("quantity") }}>
                                    <Text style={styles.buyOrSellTextHeader}>
                                        Quantity / Unit
                                        </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.textItemView}>
                                <TouchableOpacity onPress={() => { this.sortBuyOrSellData("type") }}>
                                    <Text style={styles.buyOrSellTextHeader}>
                                        Type
                                        </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.textItemView}>
                                <TouchableOpacity onPress={() => { this.sortBuyOrSellData("price") }}>
                                    <Text style={styles.buyOrSellTextHeader}>
                                        &#8377; Price
                                        </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: 70, }} />
                    </View>
                    {buyOrSellData.map((buyOrSell: any, index: number) => {
                        return (
                            <View key={index}>
                                <TouchableOpacity onPress={() => this.onPressExpandedBids(buyOrSell, index)}>
                                    <View style={dWidth <= 700 ? styles.smNestedGroupListView : styles.nestedGroupListView} key={index}>
                                        <View style={styles.imageAndNameView}>
                                            <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>
                                            <Text style={styles.userNameText}>
                                                {buyOrSell.creatorObject !== undefined ? buyOrSell.creatorObject.username : ""}
                                            </Text>
                                        </View>
                                        <View style={styles.textItemView}>
                                            <Text style={styles.buyOrSellText}>
                                                asks
                                </Text>
                                        </View>
                                        <View style={styles.secondRowView}>
                                            <View style={styles.textItemView}>
                                                <Text style={styles.buyOrSellText}>
                                                    {buyOrSell.quantity}{buyOrSell.unit}
                                                </Text>
                                            </View>
                                            <View style={styles.textItemView}>
                                                <Text style={styles.buyOrSellText}>
                                                    {buyOrSell.type}
                                                </Text>
                                            </View>
                                            <View style={styles.textItemView}>
                                                <Text style={styles.buyOrSellText}>
                                                    &#8377; {buyOrSell.price}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={styles.setPriceButton}
                                            onPress={() => this.props.onPressSetBidPrice(bidOn, buyOrSell._id)}
                                        >
                                            <Text>Set Price</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>

                                {/* EXPANDABLE BID START */}
                                {
                                    buyOrSellIndex === index ?
                                        <BuyAndSellBidsTable
                                            bids={bids}
                                            bidOn={bidOn}
                                            buyOrSell={buyOrSell}
                                            bidActionButtonFunc={this.props.bidActionButtonFunc}
                                        /> :
                                        <Text />
                                }


                                {/* EXPANDABLE BID END */}
                            </View>
                        )
                    })}
                </View>
                :
                <Text />

        )
    }
}
export default BuyAndSellTable;

const styles = StyleSheet.create({
    nestedGroupListViewHeader: {
        padding: 8,
        backgroundColor: '#707070',
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    smNestedGroupListView: {
        padding: 8,
        backgroundColor: '#ffffff',
        marginTop: 10,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    smNestedGroupListViewHeader: {
        padding: 8,
        backgroundColor: '#303030',
        marginTop: 10,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    imageAndNameView: { flexDirection: "row", flexWrap: "wrap" },
    userNameText: { flexWrap: "wrap", paddingTop: 10, fontWeight: "900", fontSize: 14 },
    textItemView: {
        flex: 1,
        flexWrap: "wrap",
        justifyContent: "space-around"
    },
    buyOrSellTextHeader: { flexWrap: "wrap", fontSize: 14, alignSelf: "center", fontWeight: "900" },
    secondRowView: {
        flexDirection: "row", flex: 1,
        justifyContent: "space-around", alignItems: "flex-start", width: "95%", padding: 10
    },
    nestedGroupListView: {
        padding: 8,
        backgroundColor: '#ffffff',
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    avatarStyle: {
        height: 35,
        width: 35,
        backgroundColor: "#bfbfbf",
        borderRadius: 40,
        marginRight: 15
    },
    buyOrSellText: { flexWrap: "wrap", color: "#686662", fontSize: 14, alignSelf: "center" },
    setPriceButton: {
        borderWidth: 1, borderColor: "#f4c242",
        padding: 10, alignItems: "flex-end", justifyContent: "flex-end", borderRadius: 5
    },

})

