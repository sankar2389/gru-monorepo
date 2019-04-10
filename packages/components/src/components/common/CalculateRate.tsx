import React, { Component } from "react"
import { View, Text, StyleSheet, TextInput, Button } from "react-native"

interface IState {
    goldRate: string,
    duty: string,
    vat: string,
    profile: string,
    moneyRate: string,
    gounce:string
}

class CalculateRate extends Component<IState> {
    state: IState = {
        goldRate: '',
        duty: '',
        vat: '',
        profile: '',
        moneyRate: '',
        gounce: ''
    }
    submitCalculation() {
        console.log('Calculation')
    }
    render() {
        const { container, inputStyle, calculateButtonContainer } = styles
        const { goldRate, duty, gounce, moneyRate, profile, vat } = this.state;
        return (
            <View style={ container }>
                <TextInput
                    value={goldRate}
                    placeholder={'Gold Rate'}
                    style={inputStyle}
                    onChangeText={(text) => this.setState({ goldRate: text })}
                />
                <TextInput
                    value={moneyRate}
                    placeholder={'USD/INR Rate'}
                    style={inputStyle}
                    onChangeText={(text) => this.setState({ goldRate: text })}
                />
                <TextInput
                    value={gounce}
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
                    value={vat}
                    placeholder={'Vat'}
                    style={inputStyle}
                    onChangeText={(text) => this.setState({ goldRate: text })}
                />
                <TextInput
                    value={profile}
                    placeholder={'Profile'}
                    style={inputStyle}
                    onChangeText={(text) => this.setState({ goldRate: text })}
                />
                <View style={calculateButtonContainer}>
                    <Button
                        onPress={() => this.submitCalculation()}
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
