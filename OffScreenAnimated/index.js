import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Animated } from 'react-native';

export default class OffScreenAnimated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
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

  render() {
    const { visible, style, children, ...rest } = this.props;

    const containerStyle = {
      transform: [
        {
          translateY: this._visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [this.props.delta || 50, 0],
          }),
        },
      ],
    };

    const combinedStyle = [containerStyle, style];
    return (
      <Animated.View pointerEvents={this.state.visible ? 'auto' : 'none'} style={combinedStyle} {...rest}>
        {children}
      </Animated.View>
    );
  }
}