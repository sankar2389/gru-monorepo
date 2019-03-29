import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button } from "react-native"

class RateCard extends Component {
    constructor(props: any) {
        super(props);
        console.log(props)
        this.state={
            price:"",
            material:""
        };
    }
    componentDidMount(){
        this.setState({
            price: this.props.price,
            material:this.props.material
        });
    }
    render() {
        const { container, priceStyle, materialStyle, logoCtnr, labelCtnr, logo } = styles
        const { price, material } = this.state
        return (
            <View style={ container }>
                <View style={logoCtnr}>
                    <View style={logo}></View>
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
        margin: 15,
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
    }
})
