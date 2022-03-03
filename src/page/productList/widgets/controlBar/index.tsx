import {createStyleSheet, px2dp, styleAdapter} from '@src/helper/helper';
import React, {FC, useMemo, useCallback, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Image,
} from 'react-native';
import {Portal, PortalHost} from '@gorhom/portal';
import {GlideImage} from '@src/widgets/glideImage';
import {useModal} from '@src/widgets/modal/modal';

export enum DIRECTION_ENUM {
  HORIZONTAL,
  VERTICAL,
}

const SORT_TYPE = {
  BEST_MATCH: {
    name: 'Best match',
    sortName: 'Best match',
    value: 0,
  },
  TOP_SALES: {
    name: 'Top sales',
    sortName: 'Top sales',
    value: 1,
  },
  DATE_ADDED: {
    name: 'Date Added(New to Old)',
    sortName: 'Date Added',
    value: 2,
  },
  PRICE_HIGH_2_LOW: {
    name: 'Price(High to Low)',
    sortName: 'Price(High to Low)',
    value: 3,
  },
  PRICE_LOW_2_HIGH: {
    name: 'Price(Low to High)',
    sortName: 'Price(Low to High)',
    value: 4,
  },
};

interface ControlBarProps {
  sort: number;
  onSortChange: (val: number) => void;
  direction?: DIRECTION_ENUM;
  onDirectionChange?: (direction: DIRECTION_ENUM) => void;
}

export const ControlBar: FC<ControlBarProps> = ({
  sort,
  onSortChange,
  direction,
  onDirectionChange,
  children,
}) => {
  return (
    <>
      <View style={ControlBarStyles.container}>
        <View style={ControlBarStyles.menu}>
          <ExpandControlItem onChange={onSortChange} sort={sort} />
          <ToggleControlItem onChange={onSortChange} sort={sort} />
          <Top2LowControlItem onChange={onSortChange} sort={sort} />
          <TouchableOpacity
            onPress={() =>
              onDirectionChange &&
              onDirectionChange(
                direction === DIRECTION_ENUM.HORIZONTAL
                  ? DIRECTION_ENUM.VERTICAL
                  : DIRECTION_ENUM.HORIZONTAL,
              )
            }
            style={ControlBarStyles.direction}>
            {direction === DIRECTION_ENUM.HORIZONTAL ? (
              <Image
                style={ControlBarStyles.directionIcon}
                source={require('@src/assets/productList/vertical.png')}
              />
            ) : (
              <Image
                style={ControlBarStyles.directionIcon}
                source={require('@src/assets/productList/horizontal.png')}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={ControlBarStyles.wrap}>
        {children}
        <PortalHost name={'CONTROL_BAR_EXPAND_HOST'} />
      </View>
    </>
  );
};

interface ControlItemProps {
  sort: number;
  onChange: (val: number) => void;
}

const ExpandControlItem: FC<ControlItemProps> = ({sort, onChange}) => {
  const data = useMemo(() => {
    return [SORT_TYPE.BEST_MATCH, SORT_TYPE.DATE_ADDED];
  }, []);

  const [Modal, setModalVisible, visible] = useModal();
  const imageAnimate = useRef(new Animated.Value(0)).current;
  const option = useMemo(() => {
    const defaultLabel = data[0].sortName;
    const item = data.find(({value}) => value === sort);
    return {
      active: !!item,
      label: item?.sortName || defaultLabel,
    };
  }, [data, sort]);

  const handleClose = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  const toggleModalVisible = useCallback(() => {
    if (visible) {
      setTimeout(() => {
        setModalVisible(!visible);
      }, 200);
      return;
    }
    setModalVisible(!visible);
  }, [setModalVisible, visible]);

  const openAnimate = useMemo(() => {
    return Animated.timing(imageAnimate, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
  }, [imageAnimate]);

  const closeAnimate = useMemo(() => {
    return Animated.timing(imageAnimate, {
      toValue: 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
  }, [imageAnimate]);

  useEffect(() => {
    if (visible) {
      closeAnimate.stop();
      openAnimate.start();
    } else {
      openAnimate.stop();
      closeAnimate.start();
    }
  }, [closeAnimate, openAnimate, visible]);

  return (
    <ControlItemContainer
      active={option.active}
      text={option.label}
      onPress={toggleModalVisible}>
      <Portal hostName="CONTROL_BAR_EXPAND_HOST">
        <Modal
          onBackButtonPress={handleClose}
          onBackdropPress={handleClose}
          maskClosable
          modalStyle={{justifyContent: 'flex-start'}}
          usePortal={false}
          animationIn={'slideInDown'}
          animationOut="slideOutUp">
          {data?.map((item, index) => (
            <ExpandItem
              key={item.value}
              active={item.value === sort}
              label={item.name}
              onPress={() => {
                toggleModalVisible();
                onChange && onChange(item.value);
              }}
              showBottomBorder={index !== data.length - 1}
            />
          ))}
        </Modal>
      </Portal>
      <Animated.Image
        style={[
          ControlItemContainerStyles.icon,
          {
            transform: [
              {
                rotateZ: imageAnimate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-180deg', '0deg'],
                }),
              },
            ],
            marginBottom: imageAnimate.interpolate({
              inputRange: [0, 1],
              outputRange: [px2dp(-2), 0],
            }),
            tintColor: visible ? '#000' : '#666',
          },
        ]}
        source={require('@src/assets/productList/arrow-up.png')}
      />
    </ControlItemContainer>
  );
};

const ToggleControlItem: FC<ControlItemProps> = ({sort, onChange}) => {
  const data = SORT_TYPE.TOP_SALES;
  return (
    <ControlItemContainer
      text={data.name}
      active={data.value === sort}
      onPress={() => {
        onChange && onChange(data.value);
      }}
    />
  );
};

const Top2LowControlItem: FC<ControlItemProps> = ({sort, onChange}) => {
  const data = useMemo(() => {
    return [SORT_TYPE.PRICE_HIGH_2_LOW, SORT_TYPE.PRICE_LOW_2_HIGH];
  }, []);

  const option = useMemo(() => {
    const index = data.findIndex(({value}) => value === sort);
    return {
      active: index !== -1,
      label: 'Price',
      index,
    };
  }, [data, sort]);

  const toggle = useCallback(() => {
    if (option.active) {
      onChange && onChange(data[(option.index + 1) % data.length].value);
      return;
    }
    onChange && onChange(data[0].value);
  }, [data, onChange, option.active, option.index]);

  return (
    <ControlItemContainer
      text={option.label}
      active={option.active}
      onPress={toggle}>
      <View style={Top2LowControlItemStyles.iconWrap}>
        <Image
          style={[
            ControlItemContainerStyles.icon,
            {
              tintColor: sort === data[0].value ? '#000' : '#666',
            },
          ]}
          source={require('@src/assets/productList/arrow-up.png')}
        />
        <Image
          style={[
            ControlItemContainerStyles.icon,
            Top2LowControlItemStyles.bottomIcon,
            {
              tintColor: sort === data[1].value ? '#000' : '#666',
            },
          ]}
          source={require('@src/assets/productList/arrow-up.png')}
        />
      </View>
    </ControlItemContainer>
  );
};

const Top2LowControlItemStyles = createStyleSheet({
  iconWrap: {},
  bottomIcon: {
    marginTop: 3,
    transform: [
      {
        rotateZ: '-180deg',
      },
    ],
  },
});

interface ControlItemContainerProps {
  text?: string;
  active?: boolean;
  onPress?: () => void;
}

const ControlItemContainer: FC<ControlItemContainerProps> = ({
  active,
  text,
  onPress,
  children,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={ControlItemContainerStyles.container}>
        <Text
          style={[
            ControlItemContainerStyles.text,
            active && ControlItemContainerStyles.textActive,
          ]}>
          {text}
        </Text>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const ControlItemContainerStyles = createStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    marginRight: 20,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
  },
  textActive: {
    color: '#222',
  },
  icon: {
    marginLeft: 3,
    width: 11,
    height: 6,
  },
});

export interface ExpandItemProps {
  label: string;
  active: boolean;
  showBottomBorder?: boolean;
  onPress?: () => void;
}

const ExpandItem: FC<ExpandItemProps> = ({
  label,
  showBottomBorder = true,
  active,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        ExpandItemStyles.container,
        styleAdapter({
          borderBottomWidth: showBottomBorder ? 1 : 0,
        }),
      ]}
      onPress={onPress}>
      <Text
        style={[ExpandItemStyles.text, active && ExpandItemStyles.activeText]}>
        {label}
      </Text>
      {active && (
        <GlideImage
          defaultSource={false}
          style={ExpandItemStyles.icon}
          source={require('@src/assets/productList/active.png')}
        />
      )}
    </TouchableOpacity>
  );
};

const ExpandItemStyles = createStyleSheet({
  container: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  activeText: {
    color: '#222',
  },
  icon: {
    width: 13,
    height: 10,
  },
});

const ControlBarStyles = createStyleSheet({
  wrap: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
  },
  menu: {
    flex: 1,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
  },

  direction: {
    height: 23,
    paddingLeft: 19,
    borderLeftWidth: 1,
    borderLeftColor: '#E1E1E1',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  directionIcon: {
    width: 15,
    height: 16,
  },
  centered: {
    width: '100%',
    flex: 1,
    position: 'absolute',
    top: 82,
    zIndex: 9999,
    bottom: 0,
  },
  content: {
    backgroundColor: 'rgba(0,0,0, 0.4)',
    overflow: 'hidden',
    opacity: 0,
    zIndex: 10,
  },
  sheet: {
    width: '100%',
    height: 0,
    backgroundColor: '#fff',
  },
});
