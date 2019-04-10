import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native"

interface IProps {
    price: string,
    material: string,
    icon: string
}

class RateCard extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    render() {
        const { container, priceStyle, materialStyle, logoCtnr, labelCtnr, logo } = styles
        const { price, material, icon } = this.props
        return (
            <View style={ container }>
                <View style={logoCtnr}>
                    <Image
                            source={require(`../../assets/images/${icon}.png`)}
                            style={logo}></Image>
                </View>
                <View style={labelCtnr}>
                    <Text style={priceStyle}>{price}</Text>
                    <Text style={materialStyle}>{material} Rate</Text>
                </View>
            </View>
        );
    }
}

export { RateCard };

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "25%",
        backgroundColor: "#ffffff",
        marginRight: 30,
        marginTop: 30,
        marginBottom: 30,
        display: "flex",
        justifyContent: "center",
        flexDirection: "row"
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
        flexDirection: "column",
        marginRight: 40
    },
    logo: {
        height: 100,
        width: 100
    },
    labelCtnr: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
    }
})
