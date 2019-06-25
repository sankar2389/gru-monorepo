import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet, AsyncStorage, TouchableOpacity, TextInput, Text, Image, ScrollView } from "react-native";
import { IReduxState } from "../../types";
import { connect } from "react-redux";
import io from 'socket.io-client';
import { createBuyOrSell, getAllBuyData, getAllSellData, onCreateBids, getBidsByBidId, bidAcceptOrReject, clearBuyOrSellReducer } from '../../actions';
const CMS_API = process.env.CMS_API;
import moment from "moment";
import axios from "axios";
import CustomeMessage from "../common/customMessage";
import BuyAndSellTable from "./buyAndSellTable";

interface IProps extends RouteComponentProps {
    createBuyOrSell: (buyOrsell: string, buyOrSellType: string, unit: string, quantity: any, buyOrSellPrice: number, creator: string, creatorObject: any) => void,
    getAllBuyData: (start?: number) => void,
    getAllSellData: (start?: number) => void,
    buyOrSell: any,
    onCreateBids: (userId: string, bidsPrice: number, buyOrSellId: string, bidOnBuyOrSell: string, bidQuantity: number, totalPrice: number) => void,
    getBidsByBidId: (bids: any) => void,
    bidAcceptOrReject: (type: string, evt: string, status: string, _id: string, buyOrSellId: string) => void,
    clearBuyOrSellReducer: () => void
};

interface IState {
    modalVisible: boolean,
    buyOrSellPrice: string,
    buyOrSellRadioOption: string,
    buyOrSellType: string,
    dropDown: number,
    buyOrSellData: any[],
    buyData: any[],
    sellData: any[],
    dataFromCollection: string,
    dataLimitOnPage: number,
    totalPages: number[],
    visiblePages: number[],
    buysCount: number,
    sellsCount: number,
    selectedPaginatateNumber: number,
    userName: string,
    dWidth: number,
    unit: string,
    quantity: number,
    bidModalVisible: boolean,
    bidOnBuyOrSell: string,
    buyOrSellId: string,
    expandBidView: boolean,
    buyOrSellIndex: number,
    bids: any,
    bidQuantity: string,
    bidStartNumber: number,
    bidEndNumber: number,
    userId: string,
    messageType: string,
    message: string,
    openCustomMessage: boolean,
    sortingOrder: string,
    sortingCounter: number,
    sortedQueue: any,
    sortingFieldName: string,
    previousSortingOrder: string

}

class BuySell extends Component<IProps> {
    state: IState = {
        modalVisible: false,
        buyOrSellPrice: "",
        buyOrSellRadioOption: "",
        buyOrSellType: "",
        dropDown: -1,
        buyOrSellData: [],
        buyData: [],
        sellData: [],
        dataFromCollection: "",
        dataLimitOnPage: 10,
        totalPages: [],
        visiblePages: [],
        buysCount: 0,
        sellsCount: 0,
        selectedPaginatateNumber: 1,
        userId: "",
        userName: "",
        dWidth: 700,
        unit: "mg",
        quantity: 0,
        bidModalVisible: false,
        bidOnBuyOrSell: "",
        buyOrSellId: "",
        expandBidView: false,
        buyOrSellIndex: -1,
        bids: [],
        bidQuantity: "",
        bidStartNumber: 0,
        bidEndNumber: 5,
        messageType: "",
        message: "",
        openCustomMessage: true,
        sortingOrder: "asc",
        sortingCounter: 0,
        sortedQueue: [],
        sortingFieldName: "",
        previousSortingOrder: ""
    }
    constructor(props: IProps) {
        super(props);

    }
    async componentDidMount() {
        const socket = io(CMS_API + '');
        socket.on('buy', (res: any) => {
            const { buyData } = this.state;
            buyData.push(JSON.parse(res).message);
            this.setState({ buyData });
        });
        socket.on('sell', (res: any) => {
            const { sellData } = this.state;
            sellData.push(JSON.parse(res).message);
            this.setState({ sellData });
        });
        this.onPressGetSellDataBYCreator()
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        await this.props.getAllBuyData()
        this.setState({
            userName: user.username,
            userId: user._id
        })
        this.getTotalPages()
        window.addEventListener("resize", this.updateDimension)
    }

    // Function to get Total pages

    getTotalPages = () => {
        AsyncStorage.getItem("token").then(async (authtoken: string | null) => {
            if (authtoken) {
                const { dataFromCollection } = this.state;
                if (dataFromCollection === "BUY_DATA") {

                    const res = await this.getCount("buys", authtoken)

                    this.setState({
                        totalPages: res.pagesArray,
                        buysCount: res.data
                    }, () => {
                        this.updateVisiblePages()
                    })
                }
                if (dataFromCollection === "SELL_DATA") {
                    const res = await this.getCount("sells", authtoken)

                    this.setState({
                        totalPages: res.pagesArray,
                        sellsCount: res.data
                    }, () => {
                        this.updateVisiblePages()
                    })
                }
            }
        })
    }

    // Function to get all records in the DB by datatype as BUY/SELL

    getCount = async (dataType: string, authtoken: string) => {
        const res = await axios.get(process.env.CMS_API + `${dataType}/count`, {
            headers: {
                Authorization: "Bearer " + authtoken
            }
        })
        const { dataLimitOnPage } = this.state;

        const { data } = res;
        let totalPages = Math.floor(data / dataLimitOnPage);

        if (data % dataLimitOnPage) {
            totalPages += 1
        }
        const pagesArray: number[] = []

        for (let i = 1; i <= totalPages; i++) {
            pagesArray.push(i)
        }

        return {
            pagesArray,
            data
        }
    }

    // function to update visible pages to show 3 pages only
    updateVisiblePages = () => {
        const { totalPages, selectedPaginatateNumber } = this.state
        if (selectedPaginatateNumber !== 1 && selectedPaginatateNumber !== totalPages.length) {
            const visiblePages = totalPages.slice(selectedPaginatateNumber - 2, selectedPaginatateNumber + 1)
            this.setState({ visiblePages })
        }
        else if (selectedPaginatateNumber === 1) {
            const visiblePages = totalPages.slice(0, 3)
            this.setState({ visiblePages })
        }
        else {
            const visiblePages = totalPages.slice(-3)
            this.setState({ visiblePages })

        }
    }

    onPressVisibleModal = () => {
        this.setState({ modalVisible: true })
    }

    onHandelChangeInput = (buySellInput: string) => {
        this.setState({ buyOrSellPrice: buySellInput });
    }

    onCancelModal = () => {
        this.setState({
            modalVisible: false,
            bidModalVisible: false,
            buyOrSellPrice: "",
            buyOrSellRadioOption: "",
            buyOrSellType: "",
            bidQuantity: ""
        })
    }

    onClikcSetBuyOrSell = (evt: string) => {
        this.setState({
            buyOrSellRadioOption: evt
        })
    }
    // On press submit modal
    async onPressCreateBuyOrSell() {
        const isNum = /^[0-9\b]+$/;
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        let buyOrSellPrice = this.state.buyOrSellPrice
        if (this.state.buyOrSellType.length <= 0) {
            alert("Please select gold or silver")
        } else if (isNum.test(buyOrSellPrice) !== true) {
            alert("Please enter number only")
        }
        else if (this.state.buyOrSellRadioOption.length <= 0) {
            alert("Please select any one Buy or Sell")
        }
        else {
            let buyOrsell = this.state.buyOrSellRadioOption
            let buyOrSellPrice = parseInt(this.state.buyOrSellPrice)
            let creator = user._id
            let creatorObject = user
            let unit = this.state.unit
            let quantity = this.state.quantity
            this.props.createBuyOrSell(buyOrsell, this.state.buyOrSellType, unit, quantity, buyOrSellPrice, creator, creatorObject)
            this.onCancelModal();
            this.getTotalPages()
        }
    }

    handelDropdownClick = (index: number) => {
        if (index === this.state.dropDown) {
            this.setState({
                dropDown: -1
            });
        } else {
            this.setState({
                dropDown: index
            });
        }
    }

    componentWillReceiveProps(newProps: any) {
        if (newProps.buyOrSell.buyOrSellData.buys !== undefined) {
            const { buyData } = this.state;
            this.setState({
                buyData: newProps.buyOrSell.buyOrSellData.buys, ...buyData,
                dataFromCollection: "BUY_DATA"
            }, () => {
                this.getTotalPages()
            });
        }
        if (newProps.buyOrSell.buyOrSellData.sells !== undefined) {
            const { sellData } = this.state;
            this.setState({
                sellData: newProps.buyOrSell.buyOrSellData.sells, ...sellData,
                dataFromCollection: "SELL_DATA"
            }, () => {
                this.getTotalPages()
            });
        }
        if (newProps.buyOrSell.bids) {
            this.setState({
                bids: newProps.buyOrSell.bids
            })
        }
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
    }

    clearMessageState = () => {
        this.setState({ message: "", openCustomMessage: false })
    }
    onLoadPagePagination = (dLength: any) => {
        let buyOrSellPageCount = []
        let dataLength = dLength
        let totalpage = dataLength / this.state.dataLimitOnPage
        let count = dataLength % this.state.dataLimitOnPage
        if (count !== 0) {
            totalpage = totalpage + 1
            if (totalpage > 1) {
                for (let i = 1; i <= totalpage; i++) {
                    buyOrSellPageCount.push(i)
                }
            }
        } else {
            if (totalpage > 1) {
                for (let i = 1; i <= totalpage; i++) {
                    buyOrSellPageCount.push(i)
                }
            }
        }
        this.setState({
            buyOrSellPageCount: buyOrSellPageCount
        })
    }

    // Get all sell  data on press
    onPressGetSellDataBYCreator = async () => {
        this.setState({
            startDataOnPage: 0,
            endDataOnPage: 10,
            dataLimitOnPage: 10,
            selectedPaginatateNumber: 1,
            expandBidView: false,
            buyOrSellIndex: -1,
            bids: []
        })
        this.props.getAllSellData();
    }
    // get all buy data on press
    onPressGetBuyDataBYCreator = async () => {
        this.setState({
            startDataOnPage: 0,
            endDataOnPage: 10,
            dataLimitOnPage: 10,
            selectedPaginatateNumber: 1,
            expandBidView: false,
            buyOrSellIndex: -1,
            bids: []
        })
        this.props.getAllBuyData()
    }

    // pagination Next
    onPressPaginateNext = () => {
        const { selectedPaginatateNumber, totalPages, dataFromCollection } = this.state;
        if (dataFromCollection === "BUY_DATA") {
            if (selectedPaginatateNumber !== totalPages.length) {
                this.setState((prevState: any) => {
                    return { selectedPaginatateNumber: prevState.selectedPaginatateNumber + 1 }
                }, () => {
                    const { selectedPaginatateNumber, dataLimitOnPage } = this.state
                    const start = (selectedPaginatateNumber - 1) * dataLimitOnPage;
                    this.props.getAllBuyData(start)
                })
            }
        }
        if (dataFromCollection === "SELL_DATA") {
            if (selectedPaginatateNumber !== totalPages.length) {
                this.setState((prevState: any) => {
                    return { selectedPaginatateNumber: prevState.selectedPaginatateNumber + 1 }
                }, () => {
                    const { selectedPaginatateNumber, dataLimitOnPage } = this.state
                    const start = (selectedPaginatateNumber - 1) * dataLimitOnPage;
                    this.props.getAllSellData(start)
                })
            }
        }
    }

    // pagination Previous
    onPressPaginatePrevious = () => {
        const { selectedPaginatateNumber, dataFromCollection } = this.state
        if (dataFromCollection === "BUY_DATA") {
            if (selectedPaginatateNumber !== 1) {
                this.setState((prevState: any) => {
                    return { selectedPaginatateNumber: prevState.selectedPaginatateNumber - 1 }
                }, () => {
                    const { selectedPaginatateNumber, dataLimitOnPage } = this.state
                    const start = (selectedPaginatateNumber - 1) * dataLimitOnPage;
                    this.props.getAllBuyData(start)
                })
            }
        }
        if (dataFromCollection === "SELL_DATA") {
            if (selectedPaginatateNumber !== 1) {
                this.setState((prevState: any) => {
                    return { selectedPaginatateNumber: prevState.selectedPaginatateNumber - 1 }
                }, () => {
                    const { selectedPaginatateNumber, dataLimitOnPage } = this.state
                    const start = (selectedPaginatateNumber - 1) * dataLimitOnPage;
                    this.props.getAllSellData(start)
                })
            }
        }
    }

    async onPressPaginate(pageCount: number) {
        const { dataFromCollection, dataLimitOnPage } = this.state
        const start = (pageCount - 1) * dataLimitOnPage;
        if (dataFromCollection === "BUY_DATA") {
            this.setState({ selectedPaginatateNumber: pageCount }, () => {
                this.props.getAllBuyData(start)
            })
        }
        if (dataFromCollection === "SELL_DATA") {
            this.setState({ selectedPaginatateNumber: pageCount }, () => {
                this.props.getAllSellData(start)
            })
        }
    }

    onPressSetBidPrice = (bidOn: string, buyOrsellId: string) => {
        this.setState({
            bidModalVisible: true,
            bidOnBuyOrSell: bidOn,
            buyOrSellId: buyOrsellId
        })
    }
    // CHECKPAGE LENGTH
    componentWillMount() {
        this.updateDimension()
    }
    updateDimension = () => {
        this.setState({
            dWidth: window.innerWidth
        })
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimension)
    }

    onClikcSetGoldOrSilver = (type: string) => {
        this.setState({ buyOrSellType: type })
    }

    onPressCreateBids = async () => {
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        const { onCreateBids } = this.props
        let bidsPrice = parseInt(this.state.buyOrSellPrice)
        let buyOrSellId = this.state.buyOrSellId
        let bidQuantity = parseInt(this.state.bidQuantity)
        if ((bidsPrice && user._id) && bidQuantity) {
            let totalPrice = bidsPrice * bidQuantity
            onCreateBids(user._id, bidsPrice, buyOrSellId, this.state.bidOnBuyOrSell, bidQuantity, totalPrice)
            this.onCancelModal()
        }
    }

    onPressExpandedBid = (buyOrSell: any) => {
        if (buyOrSell.bids.length > 0) {
            this.props.getBidsByBidId(buyOrSell.bids)
            this.setState({
                expandBidView: true,
                bids: []
            })
        } else {
            this.setState({
                messageType: "success",
                message: "No bids found",
                openCustomMessage: true,
                bids: [],
                expandBidView: false,
            })
            this.props.clearBuyOrSellReducer()
        }

    }

    bidActionButtonFunc = (type: string, evt: string, _id: string, buyOrSellId: string) => {
        console.log("Type", type)
        this.props.bidAcceptOrReject(type, evt, "closed", _id, buyOrSellId)
    }

    render() {
        const { innerContainer } = styles;
        const { dWidth, modalVisible, dataFromCollection, buyData, sellData, buyOrSellIndex, bids, bidStartNumber, bidEndNumber } = this.state;
        return (
            <View style={dWidth <= 700 ? styles.smMainViewContainer : styles.mainViewContainer}>
                <ScrollView style={dWidth <= 700 ? styles.smInnerContainer : innerContainer}>
                    <View style={{ alignItems: "flex-start" }}>
                        <Text style={styles.headerBuyAndSell}>
                            Buy / Sell
                    </Text>
                        <Text style={dWidth <= 700 ? styles.smHeaderSmallText : styles.headerSmallText}>Bullion user gold rates</Text>
                    </View>

                    <View style={modalVisible ? styles.pageOpacity : styles.pageOpacityNone}>
                        <View style={dWidth <= 700 ? styles.smHeaderView : styles.headerView}>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                <TouchableOpacity onPress={this.onPressGetBuyDataBYCreator} style={this.state.dataFromCollection === "BUY_DATA" ?
                                    styles.buyOrSellButtonTab : styles.blankTextStyle
                                }>
                                    <Text style={dataFromCollection === "BUY_DATA" ?
                                        [styles.buyAndSellPageHeadText, styles.selectedTextColor] : styles.buyAndSellPageHeadText}>
                                        BUY({buyData.length})
                                    </Text>
                                </TouchableOpacity>
                                <Text style={styles.buyAndSellPageHeadText}> / </Text>
                                <TouchableOpacity onPress={() => this.onPressGetSellDataBYCreator()}
                                    style={dataFromCollection === "SELL_DATA" ?
                                        styles.buyOrSellButtonTab : styles.blankTextStyle
                                    }
                                >
                                    <Text style={this.state.dataFromCollection === "SELL_DATA" ?
                                        [styles.buyAndSellPageHeadText, styles.selectedTextColor] : styles.buyAndSellPageHeadText}>
                                        SELL({sellData.length})
                                    </Text>
                                </TouchableOpacity>

                            </View>
                            <View style={dWidth <= 700 ? styles.addButtonOutterView : styles.blankTextStyle}>
                                <TouchableOpacity disabled={modalVisible ? true : false}
                                    style={styles.addButtom} onPress={() => this.onPressVisibleModal()}>
                                    <Text style={styles.addGroupText}>+ Create Buy Or Sell</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* <TabView /> */}
                    </View>

                    <View style={this.state.modalVisible ? styles.pageOpacity : styles.pageOpacityNone}>
                        <BuyAndSellTable
                            data={dataFromCollection === "SELL_DATA" ? sellData : buyData}
                            bidOn={dataFromCollection === "SELL_DATA" ? "sell" : "buy"}
                            bids={this.state.bids}
                            dWidth={dWidth}
                            onPressExpandedBid={this.onPressExpandedBid}
                            onPressSetBidPrice={this.onPressSetBidPrice}
                            bidActionButtonFunc={this.bidActionButtonFunc}
                        />
                    </View>
                    {/* DISPLAY SELL */}


                    {/* BUY AND SELL MODAL START */}
                    {
                        this.state.modalVisible ?
                            <View style={styles.modalContainer}>
                                <View style={this.state.dWidth <= 700 ? styles.smModalView : styles.modalView}>
                                    <View style={styles.modalCreateBuySellView}>
                                        <Text style={styles.createBuySellText}>Buy / Sell</Text>
                                    </View>

                                    <View style={styles.goldOrSilverView}>
                                        <label style={{
                                            backgroundColor: "#FFD700", paddingRight: 50, paddingTop: 20,
                                            paddingBottom: 20, borderRadius: 5, marginRight: 30
                                        }}>
                                            <input type="radio" name="goldOrSilver"
                                                onChange={() => this.onClikcSetGoldOrSilver("gold")}
                                            />
                                            Gold
                                     </label>
                                        <label style={{
                                            backgroundColor: "#D3D3D3", paddingRight: 50, paddingTop: 20,
                                            paddingBottom: 20, borderRadius: 5,
                                        }}>
                                            <input type="radio" name="goldOrSilver"
                                                onChange={() => this.onClikcSetGoldOrSilver("silver")}
                                            />
                                            Silver
                                     </label>
                                        <View style={{ marginLeft: 10, alignItems: "flex-start" }}>
                                            <Text>
                                                Enter quantity
                                            </Text>
                                            <TextInput style={{ width: "50%", borderWidth: 2, padding: 2 }}
                                                // value={this.state.quantity}
                                                onChangeText={quantity => {
                                                    this.setState({ quantity: parseInt(quantity) });
                                                }}
                                            />
                                            <Text>
                                                Select unit
                                         </Text>
                                            <select value={this.state.unit} onChange={(evt) => this.setState({ unit: evt.target.value })}>
                                                <option value="mg">Miligram</option>
                                                <option value="gm">gram</option>
                                            </select>

                                        </View>
                                    </View>
                                    <View style={styles.textInput}>
                                        <TextInput
                                            autoFocus={true}
                                            value={this.state.buyOrSellPrice}
                                            placeholder={'Buy or Sell Price'}
                                            style={styles.inputStyle}
                                            onChangeText={(buySellInput) => this.onHandelChangeInput(buySellInput)}
                                            onSubmitEditing={() => {
                                                this.onPressCreateBuyOrSell()
                                            }}
                                        />
                                    </View>
                                    <View style={styles.radioButtonView}>
                                        <label style={{ marginRight: 30 }}>
                                            <input type="radio" name="buyOrSell" checked={this.state.buyOrSellRadioOption === "buy" ? true : false}
                                                onChange={(evt) => this.onClikcSetBuyOrSell("buy")}
                                            />
                                            Buy
                                     </label>

                                        <label>
                                            <input type="radio" name="buyOrSell" checked={this.state.buyOrSellRadioOption === "sell" ? true : false}
                                                onChange={() => this.onClikcSetBuyOrSell("sell")}
                                            />
                                            Sell
                                     </label>

                                    </View>
                                    <View style={this.state.dWidth ? styles.smButtonView : styles.buttonView}>
                                        <TouchableOpacity onPress={() => this.onCancelModal()}
                                            style={styles.modalCancelButton}>
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.submitButton}
                                            onPress={() => this.onPressCreateBuyOrSell()}
                                        >
                                            <Text style={styles.buttonText}>Submit</Text>
                                        </TouchableOpacity>

                                    </View>

                                </View>

                            </View> :
                            <Text />
                    }
                    {/* BUY AND SELL MODAL END */}

                    {/* BID MODAL START */}
                    {
                        this.state.bidModalVisible ?
                            <View style={styles.modalContainer}>
                                <View style={this.state.dWidth <= 700 ? styles.smModalView : styles.modalView}>
                                    <Text style={styles.createBuySellText}>{this.state.bidOnBuyOrSell === "buy" ? "BIDS ON BUY" : "BIDS ON SELL"}</Text>
                                    <TextInput
                                        autoFocus={true}
                                        value={this.state.buyOrSellPrice}
                                        placeholder={'Set bids price'}
                                        style={styles.inputStyle}
                                        onChangeText={(buySellInput) => this.onHandelChangeInput(buySellInput)}
                                    />
                                    <TextInput
                                        value={this.state.bidQuantity}
                                        placeholder={'Quantity'}
                                        style={styles.bidQuantityInputStyle}
                                        onChangeText={(bidQuantity) => this.setState({ bidQuantity: bidQuantity })}

                                    />
                                    <View style={this.state.dWidth ? styles.setPriceSmButtonView : styles.setPricebuttonView}>
                                        <TouchableOpacity onPress={() => this.onCancelModal()}
                                            style={styles.modalCancelButton}>
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.submitButton}
                                            onPress={() => this.onPressCreateBids()}
                                        >
                                            <Text style={styles.buttonText}>Set Bids</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View> :
                            <Text />
                    }
                    {/* BIDS MODAL END */}

                </ScrollView >
                {/* PAGINATION VIEW START */}
                <View style={this.state.dWidth <= 700 ? styles.smPaginationView : styles.paginationView}>
                    <TouchableOpacity
                        onPress={this.onPressPaginatePrevious}
                        style={styles.paginationButton}>
                        <Text>{"<"}</Text>
                    </TouchableOpacity>

                    {this.state.visiblePages.map((pageCount: number) => {
                        return (<TouchableOpacity key={pageCount}
                            onPress={this.onPressPaginate.bind(this, pageCount)}
                            style={this.state.selectedPaginatateNumber === pageCount ? styles.pageCountStyle : styles.paginationButton}
                        >
                            <Text style={this.state.selectedPaginatateNumber === pageCount ? styles.pageCountTextStyle : styles.blankTextStyle}>
                                {pageCount}
                            </Text>
                        </TouchableOpacity>)
                    })}
                    <TouchableOpacity
                        onPress={this.onPressPaginateNext}
                        style={styles.paginationButton}>
                        <Text>{">"}</Text>
                    </TouchableOpacity>
                </View>
                {/* PAGINATION VIEW END */}
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
            </View >
        );
    }
}
const mapStateToProps = ({ auth, buyOrSell }: any): IReduxState => {
    return { auth, buyOrSell };
};

export default connect<IReduxState>(mapStateToProps, {
    createBuyOrSell, getAllBuyData,
    getAllSellData, onCreateBids,
    getBidsByBidId, bidAcceptOrReject,
    clearBuyOrSellReducer

})(BuySell);

const BuyList = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);
const SellList = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const styles = StyleSheet.create({
    mainViewContainer: { marginLeft: 70, height: 810, marginTop: 70 },
    smMainViewContainer: { marginLeft: 5, height: 503, zIndex: -1 },
    innerContainer: {
        marginTop: 10,
        marginLeft: 30,
        // paddingLeft: 50,
        marginRight: 10,
        display: "flex",
        flexWrap: "wrap",
        height: 800,

    },
    smInnerContainer: {
        marginTop: 10,
        marginLeft: 5,
        //paddingLeft: 70,
        marginRight: 7,
        paddingRight: 7,
        display: "flex",
        height: 490,
    },








    scene: {
        flex: 1,
    },
    headerBuyAndSell: { fontWeight: "900", fontSize: 20 },
    buyOrSellButtonTab: {
        borderBottomWidth: 2, borderBottomColor: "red"
    },
    blankTextStyle: {},
    imageAndNameView: { flexDirection: "row", flexWrap: "wrap" },
    headerView: { flexDirection: 'row', justifyContent: "space-between", marginBottom: 20 },
    smHeaderView: { flexDirection: "column", marginBottom: 20 },
    pageOpacity: {
        opacity: 0.2
    },
    headerSmallText: { marginBottom: 50, color: "#686662" },
    smHeaderSmallText: { marginBottom: 20, color: "#686662" },

    pageOpacityNone: {

    },
    buyAndSellPageHeadText: {
        fontSize: 16
    },
    addButtom: { backgroundColor: '#ff4d4d', padding: 10, marginRight: 10, borderRadius: 5 },
    addGroupText: { color: "#ffffff" },
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




    secontRowView: {
        flexDirection: "row", flex: 1,
        justifyContent: "space-around", alignItems: "flex-start", width: "95%", padding: 10
    },
    addButtonOutterView: {
        marginTop: 10
    },
    selectedTextColor: {
        color: "tomato",
    },
    saveButtonText: {
        color: "#ffffff"
    },
    setPriceButton: {
        borderWidth: 1, borderColor: "#f4c242",
        padding: 10, alignItems: "flex-end", justifyContent: "flex-end", borderRadius: 5
    },
    saveButton: {
        backgroundColor: "#e01134", paddingLeft: 22,
        paddingRight: 22, paddingBottom: 11, paddingTop: 11, marginRight: 5, borderRadius: 5
    },
    modalView: {
        backgroundColor: "#ffffff",
        width: 500,
        height: 400,
        position: "relative",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOpacity: 1,
        shadowOffset: { width: 10, height: 10, },
        shadowRadius: 100,
        elevation: 24,
    },
    smModalView: {
        backgroundColor: "#ffffff",
        width: "99%",
        height: 400,
        position: "relative",
        marginTop: 10,
        marginLeft: "auto",
        marginRight: "auto"
    },
    textInput: { flexDirection: "row", marginTop: 15, marginLeft: 20 },
    modalCreateBuySellView: {
        alignItems: "flex-start",
        justifyContent: "center",
        marginTop: 20,
        paddingLeft: 105
    },
    createBuySellText: { fontWeight: "900", fontSize: 20 },
    inputStyle: {
        height: 30,
        margin: 15,
        backgroundColor: "rgba(106,106,106,0.41)",
        borderRadius: 20,
        padding: 20,
        width: "60%",
        position: "absolute",
        top: 100,
        left: "15%"
    },
    bidQuantityInputStyle: {
        height: 30,
        margin: 15,
        backgroundColor: "rgba(106,106,106,0.41)",
        borderRadius: 20,
        padding: 20,
        width: "60%",
        position: "absolute",
        top: 150,
        left: "15%"
    },
    buttonView: {
        flexDirection: "row",
        alignItems: "flex-end",
        position: "absolute",
        top: 350, left: 300,
    },
    smButtonView: {
        flexDirection: "row",
        alignItems: "flex-end",
        position: "absolute",
        top: 300, left: 100,
    },

    setPricebuttonView: {
        flexDirection: "row",
        alignItems: "flex-end",
        position: "absolute",
        top: 50, left: 350,
    },
    setPriceSmButtonView: {
        flexDirection: "row",
        alignItems: "flex-end",
        position: "absolute",
        top: 250, left: 200,
    },
    modalCancelButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        marginRight: 10
    },
    buttonText: {
        color: "#ffffff"
    },
    textItemView: {
        flex: 1,
        flexWrap: "wrap",
        justifyContent: "space-around"
    },
    submitButton: {
        backgroundColor: "green",
        padding: 10, borderRadius: 5
    },
    radioButtonView: {
        flexDirection: "row",
        position: "absolute",
        top: 250,
        left: "21%"

    },
    goldOrSilverView: {
        flexDirection: "row",
        position: "absolute",
        top: 70,
        left: "21%"
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
    buyOrSellText: { flexWrap: "wrap", color: "#686662", fontSize: 14, alignSelf: "center" },
    buyOrSellTextHeader: { flexWrap: "wrap", fontSize: 14, alignSelf: "center", fontWeight: "900" },
    userNameText: { flexWrap: "wrap", paddingTop: 10, fontWeight: "900", fontSize: 14 },
    buyOrSellDateTime: { marginBottom: 10, color: "gray", fontSize: 12 },
    droupDownView: { marginTop: 20, marginRight: 20 },
    dropdownDots: {
        position: "absolute",
        right: 0,
        top: 0
    },
    editTextInput: { borderBottomColor: "black", borderBottomWidth: 1, width: 90, marginLeft: 100 },
    dropdown: {
        position: "absolute",
        right: 0,
        top: 20,
        boxShadow: `1px 1px #e0dada`,
        borderWidth: 1,
        borderColor: "#e0dada",
        borderStyle: "solid",
        backgroundColor: '#ffffff',
    },
    paginationButton: {
        marginRight: 20,
        backgroundColor: '#ffffff',
        borderRadius: 30,
        padding: 10,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pageCountStyle: {
        marginRight: 20,
        backgroundColor: '#d72b2b',
        borderRadius: 30,
        padding: 10,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pageCountTextStyle: {
        color: "#ffffff"
    },
    avatarStyle: {
        height: 35,
        width: 35,
        backgroundColor: "#bfbfbf",
        borderRadius: 40,
        // marginLeft: 20,
        marginRight: 15
    },
    paginationView: {
        flexDirection: "row", padding: 20, justifyContent: "center", marginLeft: 10,
        position: "absolute", top: "99%",
    },
    smPaginationView: {
        flexDirection: "row", padding: 20, justifyContent: "center", alignItems: "center",
        position: "absolute", top: "99%", width: "100%"
    }
});