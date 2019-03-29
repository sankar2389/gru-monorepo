import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native"

interface IProps {
    price: string,
    name: string
    avatar: string
}

class UserRatesCard extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    render() {
        const { container, priceStyle, materialStyle, logoCtnr, labelCtnr, logo, nameStyle, avatarStyle } = styles
        const { price, name, avatar } = this.props
        return (
            <View style={ container }>
                <View style={logoCtnr}>
                    <View>
                        <Image style={avatarStyle} source={{uri:avatar}}></Image>
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
        width: "12%",
        backgroundColor: "#ffffff",
        marginRight: 40,
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
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 5,
    },
    avatarStyle: {
        height: 100,
        width: 100,
        backgroundColor: "#bfbfbf",
        borderRadius: 50
    }
})
