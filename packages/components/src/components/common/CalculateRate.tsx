import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button } from "react-native"
import { InterfaceGRC } from "../../types";

interface IProps {
    onSubmit: (values: any) => void
}
interface IState {
    goldRate: string,
    duty: string,
    gst: string,
    profit: string,
    fiatRate: string,
    goldOunce: string
}

class CalculateRate extends Component<IProps, IState> {
    state: IState = {
        goldRate: '',
        duty: '',
        gst: '',
        profit: '',
        fiatRate: '',
        goldOunce: ''
    }
    constructor(props: IProps) {
        super(props);
    }
    _handleCalculation() {
        const { goldRate, fiatRate, goldOunce, duty, gst } = this.state;
        const gr = parseFloat(goldRate);
        const fr = parseFloat(fiatRate);
        const ga = parseFloat(goldRate);
        const dt = parseFloat(duty);
        const vt = parseFloat(gst);

        this.props.onSubmit({ gr, fr, ga, dt, vt });
    }
    render() {
        const { container, inputStyle, calculateButtonContainer } = styles
        const { goldRate, fiatRate, goldOunce, profit, duty, gst } = this.state;
        return (
            <View style={ container }>
                <TextInput
                    value={goldRate}
                    placeholder={'Gold Rate'}
                    style={inputStyle}
                    onChangeText={(text) => this.setState({ goldRate: text })}
                />
                <TextInput
                    value={fiatRate}
                    placeholder={'USD/INR Rate'}
                    style={inputStyle}
                    onChangeText={(text) => this.setState({ goldRate: text })}
                />
                <TextInput
                    value={goldOunce}
                    placeholder={'Gounce'}
                    style={inputStyle}
                    onChangeText={(text) => this.setState({ goldRate: text })}
                />
                <TextInput
                    value={duty}
                    placeholder={'Duty'}
                    style={inputStyle}
                    onChangeText={(text) => this.setState({ goldRate: text })}
                />
                <TextInput
                    value={gst}
                    placeholder={'GST'}
                    style={inputStyle}
                    onChangeText={(text) => this.setState({ goldRate: text })}
                />
                <TextInput
                    value={profit}
                    placeholder={'Profit'}
                    style={inputStyle}
                    onChangeText={(text) => this.setState({ goldRate: text })}
                />
                <View style={calculateButtonContainer}>
                    <Button
                        onPress={() => this._handleCalculation()}
                        title="Submit"
                        color="#d72b2b"
                        accessibilityLabel="Submit Calculation"
                    />
                </View>
            </View>
        );
    }
}

export { CalculateRate };

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: "98%",
        backgroundColor: "#ffffff",
        display: "flex",
        // justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
    },
    inputStyle: {
        height: 30,
        borderColor: '#ededed',
        borderBottomWidth: 1,
        width: 200,
        marginLeft: 20,
        marginRight: 20
    },
    calculateButtonContainer: {
        display: 'flex',
        alignItems: "center",
        marginTop: 5,
        marginBottom: 20
    }
})
