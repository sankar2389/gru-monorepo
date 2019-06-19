import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet, AsyncStorage, TouchableOpacity, TextInput, Text, Image, ScrollView } from "react-native";
import { IReduxState } from "../../types";
import { connect } from "react-redux";
import io from 'socket.io-client';
import { createBuyOrSell, getBuyDataByCreator, getSellDataByCreator, onUpdateBuyPrice, onUpdateSellPrice, onCreateBids } from '../../actions';
import { type } from "os";
const CMS_API = process.env.CMS_API;

interface IProps extends RouteComponentProps {
    createBuyOrSell: (buyOrsell: string, buyOrSellType: string, unit: string, quantity: any, buyOrSellPrice: number, creator: string, creatorObject: any) => void,
    getBuyDataByCreator: (creator: string) => void,
    getSellDataByCreator: (creator: string) => void,
    onUpdateBuyPrice: (_id: any, buyOrSellPrice: number, creator: string) => void,
    onUpdateSellPrice: (_id: any, buyOrSellPrice: number, creator: string) => void,
    buyOrSell: any,
    onCreateBids: (userId: string, bidsPrice: number, buyOrSellId: string, bidOnBuyOrSell: string) => void
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
    startDataOnPage: number,
    endDataOnPage: number,
    dataLimitOnPage: number,
    buyOrSellPageCount: any[],
    selectedPaginatateNumber: number,
    userName: string,
    dWidth: number,
    unit: string,
    quantity: number,
    bidModalVisible: boolean,
    bidOnBuyOrSell: string,
    buyOrSellId: string

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
        startDataOnPage: 0,
        endDataOnPage: 10,
        dataLimitOnPage: 10,
        buyOrSellPageCount: [],
        selectedPaginatateNumber: 1,
        userName: "",
        dWidth: 700,
        unit: "mg",
        quantity: 0,
        bidModalVisible: false,
        bidOnBuyOrSell: "",
        buyOrSellId: ""

    }
    constructor(props: IProps) {
        super(props);

    }
    async componentDidMount() {
        const socket = io(CMS_API + '');
        // socket.on('hello', (res: any) => console.log(res));
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
        this.props.getBuyDataByCreator(user.email)
        this.setState({
            userName: user.username
        })
        window.addEventListener("resize", this.updateDimension)
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
            buyOrSellType: ""
        })
    }

    onClikcSetBuyOrSell = (evt: string) => {
        this.setState({
            buyOrSellRadioOption: evt
        })
    }

    async onPressCreateBuyOrSell() {
        const isNum = /^[0-9\b]+$/;
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        let buyOrSellPrice = this.state.buyOrSellPrice
        if (this.state.buyOrSellType.length <= 0) {
            alert("Please select gold or silver")
        } else if (isNum.test(buyOrSellPrice) !== true) {
            alert("Please enter number only")
        }
        if (this.state.buyOrSellRadioOption.length <= 0) {
            alert("Please select any one Buy or Sell")
        }
        else {
            let buyOrsell = this.state.buyOrSellRadioOption
            let buyOrSellPrice = parseInt(this.state.buyOrSellPrice)
            let creator = user.email
            let creatorObject = user
            let unit = this.state.unit
            let quantity = this.state.quantity
            this.props.createBuyOrSell(buyOrsell, this.state.buyOrSellType, unit, quantity, buyOrSellPrice, creator, creatorObject)
            this.onCancelModal();
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
            });
            let dLength = newProps.buyOrSell.buyOrSellData.buys.length
            this.onLoadPagePagination(dLength)
        }
        if (newProps.buyOrSell.buyOrSellData.sells !== undefined) {
            const { sellData } = this.state;
            //sellData.push(newProps.buyOrSell.buyOrSellData.sells);
            this.setState({
                sellData: newProps.buyOrSell.buyOrSellData.sells, ...sellData,
                dataFromCollection: "SELL_DATA"
            });
            let dLength = newProps.buyOrSell.buyOrSellData.sells.length
            this.onLoadPagePagination(dLength)
        }
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


    async onPressGetSellDataBYCreator() {
        this.setState({
            startDataOnPage: 0,
            endDataOnPage: 10,
            dataLimitOnPage: 10,
            selectedPaginatateNumber: 1
        })
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getSellDataByCreator(user.email);
    }

    async onPressGetBuyDataBYCreator() {
        this.setState({
            startDataOnPage: 0,
            endDataOnPage: 10,
            dataLimitOnPage: 10,
            selectedPaginatateNumber: 1
        })
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getBuyDataByCreator(user.email);
    }

    //pagination Next
    onPressPaginateNext() {
        let buySellpageCount: any
        if (this.state.dataFromCollection === "BUY_DATA") {
            buySellpageCount = this.state.buyData.length
        }
        if (this.state.dataFromCollection === "SELL_DATA") {
            buySellpageCount = this.state.sellData.length
        }
        if (this.state.endDataOnPage < buySellpageCount) {
            this.setState({
                startDataOnPage: this.state.startDataOnPage + this.state.dataLimitOnPage,
                endDataOnPage: this.state.endDataOnPage + this.state.dataLimitOnPage,
                selectedPaginatateNumber: this.state.selectedPaginatateNumber + 1
            })
        } else {
            alert("EOF")
        }
    }

    //pagination Previous
    onPressPaginatePrevious() {
        if (this.state.startDataOnPage > 0) {
            this.setState({
                startDataOnPage: this.state.startDataOnPage - this.state.dataLimitOnPage,
                endDataOnPage: this.state.endDataOnPage - this.state.dataLimitOnPage,
                selectedPaginatateNumber: this.state.selectedPaginatateNumber - 1
            })
        } else {
            alert("BOF")
        }
    }

    onPressPaginate(pageCount: number) {
        let count = pageCount * this.state.dataLimitOnPage
        let startDataOnPage = count - this.state.dataLimitOnPage
        let endDataOnPage = count
        this.setState({
            startDataOnPage: startDataOnPage,
            endDataOnPage: endDataOnPage,
            selectedPaginatateNumber: pageCount
        })
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
        let bidsPrice = parseInt(this.state.buyOrSellPrice)
        let buyOrSellId = this.state.buyOrSellId
        if (bidsPrice && user._id) {
            this.props.onCreateBids(user._id, bidsPrice, buyOrSellId, this.state.bidOnBuyOrSell)
            this.onCancelModal()
        }
    }

    render() {
        const { innerContainer } = styles;
        return (
            <View style={this.state.dWidth <= 700 ? styles.smMainViewContainer : styles.mainViewContainer}>
                <ScrollView style={this.state.dWidth <= 700 ? styles.smInnerContainer : innerContainer}>
                    <View style={{ alignItems: "flex-start" }}>
                        <Text style={styles.headerBuyAndSell}>
                            Buy / Sell
                    </Text>
                        <Text style={this.state.dWidth <= 700 ? styles.smHeaderSmallText : styles.headerSmallText}>Bullion user gold rates</Text>
                    </View>


                    <View style={this.state.modalVisible ? styles.pageOpacity : styles.pageOpacityNone}>
                        <View style={this.state.dWidth <= 700 ? styles.smHeaderView : styles.headerView}>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                <TouchableOpacity onPress={() => this.onPressGetBuyDataBYCreator()} style={this.state.dataFromCollection === "BUY_DATA" ?
                                    styles.buyOrSellButtonTab : styles.blankTextStyle
                                }>
                                    <Text style={this.state.dataFromCollection === "BUY_DATA" ?
                                        [styles.buyAndSellPageHeadText, styles.selectedTextColor] : styles.buyAndSellPageHeadText}>
                                        BUY({this.state.buyData.length})
                                    </Text>
                                </TouchableOpacity>
                                <Text style={styles.buyAndSellPageHeadText}> / </Text>
                                <TouchableOpacity onPress={() => this.onPressGetSellDataBYCreator()}
                                    style={this.state.dataFromCollection === "SELL_DATA" ?
                                        styles.buyOrSellButtonTab : styles.blankTextStyle
                                    }
                                >
                                    <Text style={this.state.dataFromCollection === "SELL_DATA" ?
                                        [styles.buyAndSellPageHeadText, styles.selectedTextColor] : styles.buyAndSellPageHeadText}>
                                        SELL({this.state.sellData.length})
                                    </Text>
                                </TouchableOpacity>

                            </View>
                            <View style={this.state.dWidth <= 700 ? styles.addButtonOutterView : styles.blankTextStyle}>
                                <TouchableOpacity disabled={this.state.modalVisible ? true : false}
                                    style={styles.addButtom} onPress={() => this.onPressVisibleModal()}>
                                    <Text style={styles.addGroupText}>+ Create Buy Or Sell</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* <TabView /> */}
                    </View>


                    {/* DISPLAY BUY */}
                    {
                        this.state.dataFromCollection === "BUY_DATA" &&
                        <View style={this.state.modalVisible ? styles.pageOpacity : styles.pageOpacityNone}>
                            {this.state.buyData.map((buyOrSell: any, index: number) => {
                                if (index >= this.state.startDataOnPage && index < this.state.endDataOnPage) {
                                    return (
                                        <View style={this.state.dWidth <= 700 ? styles.smNestedGroupListView : styles.nestedGroupListView} key={index}>
                                            <View style={styles.imageAndNameView}>
                                                <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>
                                                <Text style={styles.userNameText}>{buyOrSell.creatorObject.username}</Text>
                                            </View>
                                            <View style={styles.textItemView}>
                                                <Text style={styles.buyOrSellText}>
                                                    asks
                                            </Text>
                                            </View>
                                            <View style={styles.secontRowView}>
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
                                            {/* <Text style={styles.buyOrSellText}>
                                            {moment(buyOrSell.createdAt).fromNow()} {moment(buyOrSell.createdAt).format('h:mm')}
                                        </Text> */}
                                            <View>

                                                <TouchableOpacity style={styles.setPriceButton}
                                                    onPress={() => this.onPressSetBidPrice("buy", buyOrSell._id)}
                                                >
                                                    <Text>Set Price</Text>
                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    )
                                }

                            }).reverse()}
                        </View>
                    }
                    {/* DISPLAY SELL */}
                    {
                        this.state.dataFromCollection === "SELL_DATA" &&
                        <View style={this.state.modalVisible ? styles.pageOpacity : styles.pageOpacityNone}>
                            {this.state.sellData.map((buyOrSell: any, index: number) => {
                                if (index >= this.state.startDataOnPage && index < this.state.endDataOnPage) {
                                    return (
                                        <View style={this.state.dWidth <= 700 ? styles.smNestedGroupListView : styles.nestedGroupListView} key={index}>
                                            <View style={styles.imageAndNameView}>
                                                <Image style={styles.avatarStyle} source={{ uri: "http://i.pravatar.cc/300" }}></Image>
                                                <Text style={styles.userNameText}>{buyOrSell.creatorObject !== undefined ? buyOrSell.creatorObject.username : ""}</Text>
                                            </View>
                                            <View style={styles.textItemView}>
                                                <Text style={styles.buyOrSellText}>
                                                    asks
                                            </Text>
                                            </View>
                                            <View style={styles.secontRowView}>
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
                                                onPress={() => this.onPressSetBidPrice("sell", buyOrSell._id)}
                                            >
                                                <Text>Set Price</Text>
                                            </TouchableOpacity>

                                        </View>

                                    )
                                }

                            }).reverse()}
                        </View>
                    }

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

                                            < Text style={{}
                                            }>
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
                                    // onSubmitEditing={() => {
                                    //     this.onPressCreateBuyOrSell()
                                    // }}
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
                {this.state.buyOrSellPageCount.length > 1 ?
                    <View style={this.state.dWidth <= 700 ? styles.smPaginationView : styles.paginationView}>
                        <TouchableOpacity style={styles.paginationButton} onPress={this.onPressPaginatePrevious.bind(this)}>
                            <Text>{"<"}</Text>
                        </TouchableOpacity>
                        {this.state.buyOrSellPageCount.map(pageCount => {
                            if (pageCount > 1) {
                                if (pageCount >= this.state.selectedPaginatateNumber && pageCount < this.state.selectedPaginatateNumber + 2) {
                                    return (
                                        <TouchableOpacity key={pageCount}
                                            onPress={this.onPressPaginate.bind(this, pageCount)}
                                            style={this.state.selectedPaginatateNumber === pageCount ? styles.pageCountStyle : styles.paginationButton}
                                        >
                                            <Text style={this.state.selectedPaginatateNumber === pageCount ? styles.pageCountTextStyle : styles.blankTextStyle}>
                                                {pageCount}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }
                            } else {
                                return (
                                    <TouchableOpacity key={pageCount}
                                        onPress={this.onPressPaginate.bind(this, pageCount)}
                                        style={this.state.selectedPaginatateNumber === pageCount ? styles.pageCountStyle : styles.paginationButton}
                                    >
                                        <Text style={this.state.selectedPaginatateNumber === pageCount ? styles.pageCountTextStyle : styles.blankTextStyle}>{pageCount}</Text>
                                    </TouchableOpacity>
                                )
                            }
                        })}

                        <TouchableOpacity
                            onPress={this.onPressPaginateNext.bind(this)}
                            style={styles.paginationButton}>
                            <Text>{">"}</Text>
                        </TouchableOpacity>
                    </View> : <Text />}
                {/* PAGINATION VIEW END */}
            </View>


        );
    }
}
const mapStateToProps = ({ auth, buyOrSell }: any): IReduxState => {
    return { auth, buyOrSell };
};

export default connect<IReduxState>(mapStateToProps, { createBuyOrSell, getBuyDataByCreator, getSellDataByCreator, onUpdateBuyPrice, onUpdateSellPrice, onCreateBids })(BuySell);

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
        top: 120,
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
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    smNestedGroupListView: {
        padding: 8,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    buyOrSellText: { flexWrap: "wrap", color: "#686662", fontSize: 14, alignSelf: "center" },
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