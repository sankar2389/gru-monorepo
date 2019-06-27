import React from "react"
import { StyleSheet, View, Text, Easing, Animated, Image, TouchableOpacity } from "react-native";


interface IProps {
    message: string,
    openMessage: boolean,
    clearMessageState: () => void
    type: string
}

interface IState {
    connectionMessage: boolean,
    animatedValue: any,
    range1: number | null,
    range2: number | null,
    type: string
}

class CustomMessage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    state: IState = {
        connectionMessage: false,
        animatedValue: new Animated.Value(0),
        range1: 100,
        range2: 0,
        type: ""
    }
    componentDidMount() {
        this.openAndCloseCustomMessage()
    }

    openAndCloseCustomMessage = () => {
        if (this.props.openMessage) {
            this.setState({
                connectionMessage: true,
                type: this.props.type
            })
            this.animate(Easing.out(Easing.quad))
        }
        setTimeout(() => {
            this.props.clearMessageState()
            this.setState({
                connectionMessage: false,
                type: ""
            })
        }, 4000);
    }

    animate(easing: any) {
        this.state.animatedValue.setValue(0)
        Animated.timing(
            this.state.animatedValue,
            {
                toValue: 1,
                duration: 1000,
                easing,
            }
        ).start()
    }

    componentWillUnmount() {
        this.openAndCloseCustomMessage()
    }

    onPressCloseCustomMessage = () => {
        this.setState({ connectionMessage: false })
    }

    render() {
        return this.state.connectionMessage ? <Animated.View style={{
            opacity: this.state.animatedValue,
            transform: [{
                translateY: this.state.animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [this.state.range1, this.state.range2],
                }),
            }],
        }}>
            <View style={this.state.type === "error" ? styles.errorMessage : styles.animatedView}>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={() => this.onPressCloseCustomMessage()}>
                        <Image
                            style={{ width: 10, height: 10 }}
                            source={{ uri: 'https://cdn.pixabay.com/photo/2013/07/12/12/40/abort-146096_960_720.png' }}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.messageText}>
                    <h5>{this.props.message} </h5>
                </Text>
            </View>
        </Animated.View > : <Text />
    }
}
export default CustomMessage;

const styles = StyleSheet.create({
    animatedView: {
        backgroundColor: "#2d2d2d", position: "absolute", bottom: 10, borderRadius: 5, right: 20,
    },
    errorMessage: { backgroundColor: "red", position: "absolute", bottom: 10, borderRadius: 5, right: 20, },
    buttonView: { backgroundColor: "black", padding: 5, borderTopRightRadius: 5, borderTopLeftRadius: 5 },
    messageText: { color: "#ffffff", padding: 5 }
})

