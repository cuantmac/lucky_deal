import {StatusBarHeight} from '@src/constants/constants';
import {createCtx, createStyleSheet, isWeb} from '@src/helper/helper';
import {GlideImage, GlideImageProps} from '@src/widgets/glideImage';
import React, {FC, ReactNode, useCallback, useContext} from 'react';
import {useState} from 'react';
import {useRef} from 'react';
import {ScaledSize, useWindowDimensions, Text} from 'react-native';
import {
  TouchableOpacity,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import {useModal} from '../modal';

interface MenuModalProps {
  menu?: ReactNode;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  offsetX?: number;
}

type BtnSize = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

const [menuModalCtx, MenuModalProvider] = createCtx<{
  onPress: () => void;
}>({
  onPress: () => {},
});

export const MenuModal: FC<MenuModalProps> = ({
  menu = null,
  style,
  children,
  offsetX,
  containerStyle,
}) => {
  const [Modal, setModalVisible] = useModal();
  const touchRef = useRef<TouchableOpacity>(null);
  const windowSize = useWindowDimensions();
  const [btnSize, setBtnSize] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
  });

  const handleBtnPress = useCallback(() => {
    touchRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setBtnSize({x, y, width, height, pageX, pageY});
      setModalVisible(true);
    });
  }, [setModalVisible]);

  // 计算弹窗菜单的位置
  const position = checkPosition(btnSize, windowSize, offsetX);

  return (
    <>
      <TouchableOpacity
        onLayout={() => {}}
        ref={touchRef}
        activeOpacity={0.8}
        onPress={handleBtnPress}
        style={style}>
        {children}
      </TouchableOpacity>
      <Modal maskClosable animationIn={'fadeIn'} animationOut="fadeOut">
        <MenuModalProvider
          providerValue={{
            onPress: () => setModalVisible(false),
          }}>
          <MemuContainer style={containerStyle} position={position}>
            <View style={MenuModalStyles.container}>{menu}</View>
          </MemuContainer>
        </MenuModalProvider>
      </Modal>
    </>
  );
};

interface MemuContainerProps {
  position: ReturnType<typeof checkPosition>;
  onPress?: () => void;
  style?: ViewStyle;
}

// 弹窗菜单容器
const MemuContainer: FC<MemuContainerProps> = ({position, children, style}) => {
  return (
    <View style={position.positionSize}>
      <MenuIndicator isHeader position={position} />
      <View style={style}>{children}</View>
      <MenuIndicator isHeader={false} position={position} />
    </View>
  );
};

interface MenuIndicatorProps {
  isHeader: boolean;
  position: ReturnType<typeof checkPosition>;
}

// 箭头指示器
const MenuIndicator: FC<MenuIndicatorProps> = ({position, isHeader}) => {
  if (isHeader && !position.position.isBottom) {
    return null;
  }

  if (!isHeader && position.position.isBottom) {
    return null;
  }

  return (
    <View style={MenuModalStyles.indicatorContainer}>
      <View
        style={[
          MenuModalStyles.menuIndicator,
          isHeader
            ? MenuModalStyles.menuIndicatorTop
            : MenuModalStyles.menuIndicatorBottom,
          position.indicatorPosition,
        ]}
      />
    </View>
  );
};

interface MenuModalItemProps {
  source: GlideImageProps['source'];
  onPress?: () => void;
  title: string;
  disabled?: boolean;
}

// 弹窗菜单样式
export const MenuModalItem: FC<MenuModalItemProps> = ({
  source,
  onPress,
  title,
  disabled,
}) => {
  const {state} = useContext(menuModalCtx);
  return (
    <TouchableHighlight
      underlayColor="rgba(182,182,182,.5)"
      onPress={() => {
        state.onPress && state.onPress();
        onPress && onPress();
      }}
      disabled={disabled}
      style={MenuModalStyles.menuModalItemContainer}>
      <>
        <GlideImage style={MenuModalStyles.menuIcon} source={source} />
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={MenuModalStyles.menuTitle}>
          {title}
        </Text>
      </>
    </TouchableHighlight>
  );
};

const MenuModalStyles = createStyleSheet({
  container: {
    minWidth: 146,
    maxWidth: 200,
    backgroundColor: 'white',
  },
  indicatorContainer: {
    position: 'relative',
    height: 10,
  },
  menuIndicator: {
    width: 0,
    height: 0,
  },
  menuIndicatorTop: {
    borderBottomWidth: 8,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomColor: 'white',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  menuIndicatorBottom: {
    borderTopColor: 'white',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopWidth: 8,
    borderLeftWidth: 6,
    borderRightWidth: 6,
  },
  menuModalItemContainer: {
    height: 36,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 15,
    height: 15,
  },
  menuTitle: {
    marginLeft: 10,
    fontSize: 13,
    flex: 1,
  },
});

// 根据按钮大小位置，窗口的大小 计算弹窗菜单的位置
function checkPosition(
  btnSize: BtnSize,
  windowSize: ScaledSize,
  offsetX: number = 0,
) {
  const indicatorWidth = 12;
  const position = {
    isLeft: true,
    isBottom: true,
  };
  const horizontalValue = (windowSize.width - btnSize.width) / 2;
  const verticalValue = (windowSize.height - btnSize.height) / 2;
  if (btnSize.pageX + btnSize.width >= horizontalValue) {
    position.isLeft = false;
  }

  if (btnSize.pageY + btnSize.height >= verticalValue) {
    position.isBottom = false;
  }
  return {
    btnSize,
    position,
    offsetX,
    indicatorPosition: {
      position: 'absolute' as 'absolute',
      left: position.isLeft
        ? offsetX + btnSize.width / 2 - indicatorWidth / 2
        : undefined,
      right: position.isLeft
        ? undefined
        : offsetX + btnSize.width / 2 - indicatorWidth / 2,
      top: position.isBottom ? undefined : 0,
      bottom: position.isBottom ? 0 : undefined,
    },
    positionSize: {
      position: 'absolute' as 'absolute',
      left: position.isLeft ? btnSize.pageX - offsetX : undefined,
      right: position.isLeft
        ? undefined
        : windowSize.width - btnSize.pageX - btnSize.width - offsetX,
      top: position.isBottom ? btnSize.pageY + btnSize.height : undefined,
      bottom: position.isBottom
        ? undefined
        : windowSize.height - btnSize.pageY - (isWeb() ? 0 : StatusBarHeight),
    },
  };
}
