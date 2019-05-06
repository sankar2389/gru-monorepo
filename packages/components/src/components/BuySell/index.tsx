import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { View, StyleSheet, AsyncStorage, TouchableOpacity, TextInput, Text } from "react-native";
import { IReduxState } from "../../types";
import { connect } from "react-redux";
import TabView from "../common/TabView";
import io from 'socket.io-client';
import { createBuyOrSell } from '../../actions';

interface IProps extends RouteComponentProps {
    createBuyOrSell: (data: any) => void,
};

interface IState {
    modalVisible: boolean,
    buyOrSellPrice: string,
    buyOrSellRadioOption: string
}

class BuySell extends Component<IProps> {
    // state = {
    //     index: 0,
    //     routes: [
    //         { key: 'first', title: 'First' },
    //         { key: 'second', title: 'Second' },
    //     ],
    // };

    state: IState = {
        modalVisible: false,
        buyOrSellPrice: "",
        buyOrSellRadioOption: ""
    }
    constructor(props: IProps) {
        super(props);

    }
    componentDidMount() {
        const socket = io('http://localhost:1337/');
        socket.on('hello', (res: any) => console.log(res));
        socket.on('buy', (res: any) => console.log(res));
        socket.on('sell', (res: any) => console.log(res));
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
        const num = /^[0-9\b]+$/;
        const user = JSON.parse((await AsyncStorage.getItem('user'))!);
        if (num.test(this.state.buyOrSellPrice) !== true) {
            alert("Enter number only")
        } else if (this.state.buyOrSellRadioOption.length <= 0) {
            alert("Please select any one Buy or Sell")
        }
        else {
            const data = {
                buyOrsell: this.state.buyOrSellRadioOption,
                buyOrSellPrice: this.state.buyOrSellPrice,
                creator: user.email

            }
            this.props.createBuyOrSell(data)
        }


    }


    render() {
        const { innerContainer } = styles;
        return (
            <View style={innerContainer}>
                {/* <h1>Buy / Sell</h1>
                <h6>Bullion user gold rates</h6> */}
                <View style={this.state.modalVisible ? styles.pageOpacity : styles.pageOpacityNone}>
                    <View style={styles.headerView}>
                        <View>
                            <Text style={styles.buyAndSellPageHeadText}>Buy and Sell</Text>
                        </View>
                        <View>
                            <TouchableOpacity disabled={this.state.modalVisible ? true : false}
                                style={styles.addButtom} onPress={() => this.onPressVisibleModal()}>
                                <Text style={styles.addGroupText}>+ Create Buy Or Sell</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TabView />
                </View>

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
                                            //this.onPressCreateGroup()
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
            </View>
        );
    }
}
const mapStateToProps = ({ auth }: any): IReduxState => {
    return { auth };
};

export default connect<IReduxState>(mapStateToProps, { createBuyOrSell })(BuySell);

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
    modalView: {
        backgroundColor: "#ffffff",
        //opacity: 0.7,
        width: 500,
        height: 400,
        position: "relative",
        marginTop: 30,
        marginLeft: "auto",
        marginRight: "auto"
        // left: 600,
        //borderWidth: 
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
        //borderBottomWidth: 1,
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
    }
});