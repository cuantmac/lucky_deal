import React, {FC, useRef, useCallback} from 'react';
import {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Easing,
  Animated,
} from 'react-native';
import {px} from '../../../constants/constants';
import Utils from '../../../utils/Utils';
import {Button} from '../../button/Button';

export interface BottomActionProps {
  discount?: number;
  totalPrice?: number;
  onPress?: () => void;
  loading?: boolean;
  btnText?: string;
}

/**
 * @deprecated 待删除
 */
export const BottomAction: FC<BottomActionProps> = ({
  totalPrice = 0,
  loading = false,
  onPress,
  discount = 0,
  children,
  btnText = 'CHECKOUT',
}) => {
  const animateValue = useRef(new Animated.Value(0)).current;
  const openRef = useRef<boolean>(false);

  const openAnimate = useMemo(() => {
    return Animated.timing(animateValue, {
      duration: 200,
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: false,
    });
  }, [animateValue]);

  const closeAnimate = useMemo(() => {
    return Animated.timing(animateValue, {
      duration: 200,
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: false,
    });
  }, [animateValue]);

  const handleToggle = useCallback(() => {
    if (openRef.current) {
      openAnimate.stop();
      closeAnimate.start();
    } else {
      closeAnimate.stop();
      openAnimate.start();
    }
    if (openRef.current) {
      openRef.current = false;
      return;
    }
    openRef.current = true;
  }, [closeAnimate, openAnimate]);

  return (
    <>
      <Animated.View
        style={[
          BottomActionStyles.container,
          {
            borderTopLeftRadius: animateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 20 * px],
            }),
            borderTopRightRadius: animateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 20 * px],
            }),
          },
        ]}>
        <Animated.View
          style={[
            BottomActionStyles.expandContainer,
            {
              maxHeight: animateValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100],
              }),
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggle}
            style={BottomActionStyles.expandTitleContainer}>
            <Text style={BottomActionStyles.expandTitle}>Summary</Text>
            <Image
              style={BottomActionStyles.expandClose}
              source={require('../../../assets/close.png')}
            />
          </TouchableOpacity>
          <View style={BottomActionStyles.expandItem}>
            <Text style={BottomActionStyles.expandItemTitle}>Subtotal:</Text>
            <Text style={BottomActionStyles.expandItemValue}>
              {Utils.convertAmountUS(totalPrice)}
            </Text>
          </View>
          <View style={BottomActionStyles.expandItem}>
            <Text>Discount:</Text>
            <Text
              style={[BottomActionStyles.expandItemValue, {color: '#E00404'}]}>
              {Utils.convertAmountUS(discount, true)}
            </Text>
          </View>
        </Animated.View>
        <TouchableOpacity
          onPress={discount > 0 ? handleToggle : undefined}
          activeOpacity={0.8}
          style={BottomActionStyles.totalContainer}>
          <Text>Bag Total:</Text>
          <View style={BottomActionStyles.totalPriceContainer}>
            {discount > 0 && (
              <Animated.Image
                style={[
                  BottomActionStyles.expandIcon,
                  {
                    transform: [
                      {
                        rotateZ: animateValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['90deg', '270deg'],
                        }),
                      },
                    ],
                  },
                ]}
                source={require('../../../assets/me_arrow.png')}
              />
            )}

            <Text style={BottomActionStyles.totalPrice}>
              {Utils.convertAmountUS(totalPrice - discount)}
            </Text>
          </View>
        </TouchableOpacity>
        <Button loading={loading} onPress={onPress} title={btnText} />
        <View style={{paddingBottom: 12 * px}}>{children}</View>
      </Animated.View>
    </>
  );
};

export const BottomActionText: FC = ({children}) => {
  return (
    <Text
      style={{
        width: '100%',
        textAlign: 'center',
        marginTop: 12 * px,
        fontSize: 30 * px,
        color: '#9A9A9A',
      }}>
      {children}
    </Text>
  );
};

const BottomActionStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 18 * px,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 118 * px,
    alignItems: 'center',
    paddingHorizontal: 10 * px,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 38 * px,
    fontWeight: 'bold',
    marginLeft: 33 * px,
  },
  expandIcon: {
    height: 27 * px,
    width: 15 * px,
  },
  expandContainer: {
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  expandItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10 * px,
    height: 60 * px,
    alignItems: 'center',
  },
  expandItemTitle: {
    fontSize: 38 * px,
  },
  expandItemValue: {
    fontSize: 38 * px,
    fontWeight: 'bold',
  },
  expandTitleContainer: {
    height: 130 * px,
    position: 'relative',
    justifyContent: 'center',
    paddingBottom: 30 * px,
    alignItems: 'center',
  },
  expandTitle: {
    fontSize: 38 * px,
  },
  expandClose: {
    top: 40 * px,
    position: 'absolute',
    right: 20 * px,
    width: 30 * px,
    height: 30 * px,
  },
});
