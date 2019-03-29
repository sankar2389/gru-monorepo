import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button } from "react-native"

class UserRatesCard extends Component {
    constructor(props: any) {
        super(props);
        console.log(props)
        this.state={
            price:"",
            name:"",
            avatar:""
        };
    }
    componentDidMount(){
        this.setState({
            price: this.props.price,
            name: this.props.name,
            avatar: this.props.avatar
        });
    }
    render() {
        const { container, priceStyle, materialStyle, logoCtnr, labelCtnr, logo, nameStyle, avatarStyle } = styles
        const { price, name, avatar } = this.state
        return (
            <View style={ container }>
                <View style={logoCtnr}>
                    <View style={avatarStyle}>
                    </View>
                    <Text style={nameStyle}>{name}</Text>
                    <View style={logo}></View>
                </View>
                <View style={labelCtnr}>
                    <Text style={priceStyle}>{price}</Text>
                </View>
            </View>
        );
    }
}

export { UserRatesCard };

const styles = StyleSheet.create({
    container: {
        height: 300,
        width: "10%",
        backgroundColor: "#ffffff",
        margin: 15,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
    priceStyle: {
        fontSize: 25,
        fontWeight: "bold"
    },
    materialStyle: {
        color: "#9d9d9d",
        fontSize: 15,
        fontWeight: "bold"
    },
    logoCtnr: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
    },
    logo: {
        height: 100,
        width: 100,
        backgroundColor: "#bfbfbf"
    },
    labelCtnr: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
    },
    nameStyle: {

    },
    avatarStyle: {
        height: 100,
        width: 100,
        backgroundColor: "#bfbfbf",
        borderRadius: 50
    }
})
