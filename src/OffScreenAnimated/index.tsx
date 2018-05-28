import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Animated, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';


export interface IOffScreenAnimatedProps {
  visible: boolean;
  style?: StyleProp<ViewStyle>
}

export interface IOffScreenAnimatedState {
  visible: boolean;
  delta: number;
}

export default class OffScreenAnimated extends Component<IOffScreenAnimatedProps, IOffScreenAnimatedState> {
  private _visibility: any;

  constructor(props: IOffScreenAnimatedProps) {
    super(props);
    this.state = {
      visible: this.props.visible,
      delta: 0
    }
  }

  componentWillMount() {
    this._visibility = new Animated.Value(this.props.visible ? 1 : 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({ visible: true });
    }

    Animated.timing(this._visibility, {
      toValue: nextProps.visible ? 1 : 0,
      duration: 300,
    }).start(() => {
      this.setState({ visible: nextProps.visible });
    });
  }

  private _onLayout = (event: LayoutChangeEvent) => {
    this.setState({delta: event.nativeEvent.layout.height});
  }

  private containerStyle() {
    return {
      transform: [
        {
          translateY: this._visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [this.state.delta, 0],
          }),
        },
      ],
    };
  }

  render() {
    const { style, children, ...rest } = this.props;
    const { visible } = this.state;
    const combinedStyle = [this.containerStyle(), style, styles.bottom];
    return (
      <Animated.View onLayout={this._onLayout} pointerEvents={visible ? 'auto' : 'none'} style={combinedStyle} {...rest}>
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%'
  }
})