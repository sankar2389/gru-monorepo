import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet, AsyncStorage, TouchableOpacity, TextInput, Text, Image } from "react-native";
import { IReduxState } from "../../types";
import { connect } from "react-redux";
import io from 'socket.io-client';
import moment from "moment";
import { createBuyOrSell, getBuyDataByCreator, getSellDataByCreator } from '../../actions';
const CMS_API = process.env.CMS_API;

interface IProps extends RouteComponentProps {
    createBuyOrSell: (buyOrsell: string, buyOrSellPrice: number, creator: string) => void,
    getBuyDataByCreator: (creator: string) => void,
    getSellDataByCreator: (creator: string) => void,
    buyOrSell: any,
};

interface IState {
    modalVisible: boolean,
    buyOrSellPrice: string,
    buyOrSellRadioOption: string,
    dropDown: number,
    buyOrSellData: any[],
    buyData: any[],
    sellData: any[],
    dataFromCollection: string

}

class BuySell extends Component<IProps> {
    state: IState = {
        modalVisible: false,
        buyOrSellPrice: "",
        buyOrSellRadioOption: "",
        dropDown: -1,
        buyOrSellData: [],
        buyData: [],
        sellData: [],
        dataFromCollection: ""
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
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getBuyDataByCreator(user.email)
    }


    onPressVisibleModal = () => {
        this.setState({ modalVisible: true })
    }

    onHandelChangeInput = (buySellInput: string) => {
        this.setState({ buyOrSellPrice: buySellInput });
    }

    onCancelModal = () => {
        this.setState({ modalVisible: false })
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
        if (this.state.buyOrSellRadioOption.length <= 0) {
            alert("Please select any one Buy or Sell")
        }
        else {

            let buyOrsell = this.state.buyOrSellRadioOption
            let buyOrSellPrice = parseInt(this.state.buyOrSellPrice)
            let creator = user.email

            this.props.createBuyOrSell(buyOrsell, buyOrSellPrice, creator)
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
        }
        if (newProps.buyOrSell.buyOrSellData.sells !== undefined) {
            const { sellData } = this.state;
            sellData.push(newProps.buyOrSell.buyOrSellData.sells);
            this.setState({
                sellData: newProps.buyOrSell.buyOrSellData.sells, ...sellData,
                dataFromCollection: "SELL_DATA"
            });
        }
    }

    async onPressGetSellDataBYCreator() {
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getSellDataByCreator(user.email);
    }

    async onPressGetBuyDataBYCreator() {
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        this.props.getBuyDataByCreator(user.email);
    }


    render() {
        const { innerContainer } = styles;
        return (
            <View style={innerContainer}>
                <View style={this.state.modalVisible ? styles.pageOpacity : styles.pageOpacityNone}>
                    <View style={styles.headerView}>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity onPress={() => this.onPressGetBuyDataBYCreator()}>
                                <Text style={this.state.dataFromCollection === "BUY_DATA" ?
                                    [styles.buyAndSellPageHeadText, styles.selectedTextColor] : styles.buyAndSellPageHeadText}>Buy </Text>
                            </TouchableOpacity>
                            <Text style={styles.buyAndSellPageHeadText}>/ </Text>
                            <TouchableOpacity onPress={() => this.onPressGetSellDataBYCreator()}>
                                <Text style={this.state.dataFromCollection === "SELL_DATA" ? [styles.buyAndSellPageHeadText, styles.selectedTextColor] : styles.buyAndSellPageHeadText}>Sell</Text>
                            </TouchableOpacity>

                        </View>
                        <View>
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
                    <View>
                        {this.state.buyData.map((buyOrSell: any, index: number) => {
                            return (
                                <View style={styles.nestedGroupListView} key={index}>

                                    <Text style={styles.buyOrSellText}>
                                        <u><b>Price</b></u><br /> {buyOrSell.price}
                                    </Text>
                                    <Text >
                                        <u><b>Created Date</b></u> <br />{moment(buyOrSell.createdAt).fromNow()} {moment(buyOrSell.createdAt).format('h:mm')}
                                    </Text>


                                </View>

                            )

                        })}
                    </View>
                }
                {/* DISPLAY SELL */}
                {
                    this.state.dataFromCollection === "SELL_DATA" &&
                    <View>
                        {this.state.sellData.map((buyOrSell: any, index: number) => {
                            return (
                                <View style={styles.nestedGroupListView} key={index}>

                                    <Text style={styles.buyOrSellText}>
                                        <u><b>Price</b></u><br /> {buyOrSell.price}
                                    </Text>
                                    <Text >
                                        <u><b>Created Date</b></u> <br />{moment(buyOrSell.createdAt).fromNow()} {moment(buyOrSell.createdAt).format('h:mm')}
                                    </Text>


                                </View>

                            )

                        })}
                    </View>
                }

                {/* BUY AND SELL MODAL START */}

                {
                    this.state.modalVisible ?
                        <View style={styles.modalContainer}>
                            <View style={styles.modalView}>
                                <View style={styles.modalCreateBuySellView}>
                                    <Text style={styles.createBuySellText}>Create Buy And Sell</Text>
                                </View>

                                <View style={styles.goldOrSilverView}>
                                    <label style={{
                                        backgroundColor: "#FFD700", paddingRight: 50, paddingTop: 20,
                                        paddingBottom: 20, borderRadius: 5, marginRight: 30
                                    }}>
                                        <input type="radio" name="goldOrSilver"
                                        //onChange={() => this.onClikcSetGoldOrSilver("gold")}
                                        />
                                        Gold
                                     </label>

                                    <label style={{
                                        backgroundColor: "#D3D3D3", paddingRight: 50, paddingTop: 20,
                                        paddingBottom: 20, borderRadius: 5,
                                    }}>
                                        <input type="radio" name="goldOrSilver"
                                        //onChange={() => this.onClikcSetGoldOrSilver("gold")}
                                        />
                                        Silver
                                     </label>
                                </View>

                                <View style={styles.textInput}>
                                    <TextInput
                                        autoFocus={true}
                                        value={this.state.buyOrSellPrice}
                                        placeholder={'Buy or Sell'}
                                        style={styles.inputStyle}
                                        // onChangeText={groupName => {
                                        //     this.setState({ groupName: groupName });
                                        // }}
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


                                <View style={styles.buttonView}>
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

                        </View> : <Text />
                }
                {/* BUY AND SELL MODAL END */}
            </View >
        );
    }
}
const mapStateToProps = ({ auth, buyOrSell }: any): IReduxState => {
    return { auth, buyOrSell };
};

export default connect<IReduxState>(mapStateToProps, { createBuyOrSell, getBuyDataByCreator, getSellDataByCreator })(BuySell);

const BuyList = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);
const SellList = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const styles = StyleSheet.create({
    innerContainer: {
        width: "95%",
        marginTop: 70,
        marginLeft: 70,
        padding: 50,
        display: "flex"
    },
    scene: {
        flex: 1,
    },
    headerView: { flexDirection: 'row', justifyContent: "space-between", marginBottom: 20 },
    pageOpacity: {
        opacity: 0.2
    },
    pageOpacityNone: {

    },
    buyAndSellPageHeadText: {
        fontSize: 30
    },
    addButtom: { backgroundColor: '#ff4d4d', padding: 10, borderRadius: 5 },
    addGroupText: { color: "#ffffff" },
    modalContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    selectedTextColor: {
        color: "tomato"
    },
    modalView: {
        backgroundColor: "#ffffff",
        width: 500,
        height: 400,
        position: "relative",
        marginTop: 30,
        marginLeft: "auto",
        marginRight: "auto"
    },
    textInput: { flexDirection: "row", marginTop: 15, marginLeft: 20 },
    modalCreateBuySellView: {
        backgroundColor: "gray",
        alignItems: 'center',
        justifyContent: "center"
    },
    createBuySellText: { color: "#ffffff", fontSize: 20 },
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
        top: 350, left: 300
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
        padding: 10,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        flexDirection: "row", alignItems: "flex-start", justifyContent: "space-around"
    },
    buyOrSellText: { flexWrap: "wrap", padding: 0, marginRight: 10 },
    buyOrSellDateTime: { marginBottom: 10, color: "gray", fontSize: 12 },
    droupDownView: { marginTop: 20, marginRight: 20 },
    dropdownDots: {
        position: "absolute",
        right: 0,
        top: 0
    },
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
});