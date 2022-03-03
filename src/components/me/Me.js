import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  StatusBar,
  View,
  Text,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import AsyncStorage from '@react-native-community/async-storage';
import {px} from '../../constants/constants';
import {
  updateBackMessageCount,
  updateLatestUnpaidOrderThunk,
  updateProfile,
} from '../../redux/persistThunkReduces';
import {meProfileClick} from '../../analysis/report';
import {
  GroupRowContainer,
  GroupRowItem,
  GroupTitle,
  GroupContainer,
  GroupItem,
  UnPayTipComponent,
} from './common/MeComponent';
import GlideImage from '../native/GlideImage';
import AppModule from '../../../AppModule';
import Api from '../../Api';
import {navigationRef, dialogs} from '../../utils/refs';
import {meCouponGet, meCouponClose} from '../../analysis/report';

import {globalModalQueue} from '../../utils/modalQueue';
import {standardAction} from '@src/redux';
const DEVICE_WIDTH = Dimensions.get('window').width;
const Me = forwardRef(({navigation}, ref) => {
  const {
    profile,
    meOrderCount,
    message_count,
    token,
    userID,
    feedBackList,
  } = useSelector((state) => {
    return state.deprecatedPersist;
  });
  const {
    un_pay_num,
    pay_num,
    shipped_num,
    received_num,
    coupon_num,
  } = meOrderCount;
  const {lucky_id, create_time} = profile;
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const scrollViewRef = useRef();
  const [pressCount, setPressCount] = useState(0);
  const timer = useRef();
  const handleOrdersPress = (orderStatus, point) => {
    if (!token) {
      navigation.navigate('FBLogin');
      return;
    }
    AppModule.reportClick('10', '221', {OrderType: point});
    navigation.push('Orders', {orderStatus});
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        scrollTop: () => {
          scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
        },
      };
    },
    [],
  );

  useEffect(() => {
    if (token && focus) {
      if (timer.current) {
        clearInterval(timer.current);
      }
      timer.current = setInterval(() => {
        dispatch(updateBackMessageCount(feedBackList.length));
      }, 60 * 1000);
    } else {
      clearInterval(timer.current);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [token, focus, dispatch, feedBackList.length]);

  useEffect(() => {
    if (token) {
      dispatch(updateProfile());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (focus) {
      AppModule.reportShow('10', '89');
    }
  }, [focus]);

  // 拉取最新的未支付订单
  useEffect(() => {
    token && focus && dispatch(updateLatestUnpaidOrderThunk()).catch();
  }, [dispatch, token, focus]);
  useEffect(() => {
    let sub = DeviceEventEmitter.addListener('showCouponDia', (_data) => {
      _data?.length &&
        globalModalQueue.add(dialogs.congratulationsDialog, {
          content: 'You have got the coupon.',
          couponList: _data,
          callBack: () => {
            meCouponGet.setDataAndReport();
          },
          onClose: () => {
            meCouponClose.setDataAndReport();
          },
        });
      dispatch(updateProfile());
    });
    return () => {
      sub.remove();
    };
  }, [navigation, dispatch]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <MeBackground>
        <ScrollView ref={scrollViewRef}>
          <MeHeader
            headerLeft={
              <MeUser
                userName={profile.nick_name}
                userImage={profile.avatar}
                luckyId={lucky_id}
                joinDay={create_time || 0}
                token={token}
                onPressWithLogin={() => {}}
                onPressWithUnLogin={() => {
                  AppModule.reportClick('10', '90');
                  AppModule.reportTap('Me', 'ld_login_click');
                  navigation.navigate('FBLogin');
                }}
              />
            }
            headerRight={
              <MessageTip
                token={token}
                hasMessage={message_count > 0}
                onPress={() => {
                  AppModule.reportClick('10', '94');
                  AppModule.reportTap('Me', 'ld_message_clcik');
                  if (!token) {
                    navigation.navigate('FBLogin');
                    return;
                  }
                  navigation.navigate('MessageList');
                }}
              />
            }
          />
          <GroupContainer
            containerStyle={{marginTop: token ? 70 * px : 30 * px}}>
            <GroupTitle
              rightComponent={
                <TouchableOpacity
                  onPress={() => {
                    handleOrdersPress(-1, '4');
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: '#9A9A9A', fontSize: 36 * px}}>
                      View All
                    </Text>
                    <Image
                      style={{
                        marginLeft: 20 * px,
                        width: 18 * px,
                        height: 32 * px,
                      }}
                      source={require('../../assets/me/me_arrow_icon.png')}
                    />
                  </View>
                </TouchableOpacity>
              }>
              My Orders
            </GroupTitle>
            <GroupRowContainer>
              <GroupRowItem
                tipNum={un_pay_num}
                title={'Unpaid'}
                icon={require('../../assets/me/me_unpaid_icon.png')}
                onPress={() => {
                  handleOrdersPress(0, '0');
                }}
              />
              <GroupRowItem
                tipNum={pay_num}
                title={'To be shipped'}
                icon={require('../../assets/me/me_tobeshipped_icon.png')}
                onPress={() => {
                  handleOrdersPress(1, '1');
                }}
              />
              <GroupRowItem
                tipNum={shipped_num}
                title={'Shipped'}
                icon={require('../../assets/me/me_shipped_icon.png')}
                onPress={() => {
                  handleOrdersPress(2, '2');
                }}
              />
              <GroupRowItem
                tipNum={received_num}
                title={'To be Reviewed'}
                icon={require('../../assets/me/me_tobereviewed_icon.png')}
                onPress={() => {
                  handleOrdersPress(3, '3');
                }}
              />
            </GroupRowContainer>
            <UnPayTipComponent />
            {/* {!!token || end_time < new Date().getTime() / 1000 || loading || (
              <NewUserPreferential
                amount={amount / 100.0}
                title={'New User'}
                date={
                  getTsFormatDate(start_time * 1000) +
                  ' - ' +
                  getTsFormatDate(end_time * 1000)
                }
                onPress={() => {
                  AppModule.reportClick('10', '222');
                  navigation.navigate('FBLogin');
                }}
              />
            )} */}
          </GroupContainer>
          <GroupContainer>
            <GroupTitle>Service</GroupTitle>
            <GroupRowContainer>
              <GroupRowItem
                tipNum={coupon_num}
                title={'Coupon Center'}
                icon={require('../../assets/me/me_coupanCentor_icon.png')}
                onPress={() => {
                  if (!token) {
                    navigation.navigate('FBLogin');
                    return;
                  }
                  AppModule.reportClick('10', '99');
                  AppModule.reportTap('Homepage', 'coupon_tab_click');
                  navigation.push('CouponCenter');
                }}
              />
              <GroupRowItem
                title={'Shipping Address'}
                icon={require('../../assets/me/me_map_icon.png')}
                onPress={() => {
                  if (!token) {
                    navigation.navigate('FBLogin');
                    return;
                  }
                  AppModule.reportClick('10', '103');
                  AppModule.reportTap('Me', 'ld_manage_shiping_address_click');
                  navigation.push('AddressList');
                }}
              />
              <GroupRowItem
                title={'Wish List'}
                icon={require('../../assets/me/me_wishList_icon.png')}
                onPress={() => {
                  if (!token) {
                    navigation.navigate('FBLogin');
                    return;
                  }
                  AppModule.reportClick('10', '223');
                  navigation.navigate('WishList');
                }}
              />
              <View style={{flex: 1}} />
            </GroupRowContainer>
          </GroupContainer>
          <GroupContainer>
            <GroupItem
              title={'About Lucky Deal'}
              icon={require('../../assets/me/ic_about.png')}
              onPress={() => {
                navigation.navigate('About');
              }}
            />
            <GroupItem
              title={'Help'}
              icon={require('../../assets/me/me_help_icon.png')}
              onPress={() => {
                AppModule.reportClick('10', '106');
                navigation.navigate('CustomerHelp');
              }}
            />
            <GroupItem
              title={'Follow Us'}
              icon={require('../../assets/me/me_followUs_icon.png')}
              onPress={() => {
                AppModule.reportClick('10', '225');
                if (!token) {
                  navigation.navigate('FBLogin');
                  return;
                }
                navigation.navigate('FollowUs');
              }}
            />

            <GroupItem
              title={'Version'}
              content={AppModule.versionName}
              icon={require('../../assets/me/me_version.png')}
              onPress={() => {
                setPressCount((old) => (old > 5 ? 0 : old + 1));
              }}
            />
          </GroupContainer>
          {pressCount > 3 ? <MeVersion userID={userID} /> : null}
        </ScrollView>
      </MeBackground>
    </>
  );
});

// 我的界面背景
const MeBackground = ({children}) => {
  return (
    <View style={{width: DEVICE_WIDTH, flex: 1, backgroundColor: '#fff'}}>
      {children}
    </View>
  );
};
// Me 头部组件
const MeHeader = ({headerLeft, headerRight}) => {
  return (
    <View
      style={{
        marginTop: 100 * px,
        flexDirection: 'row',
        paddingHorizontal: 30 * px,
        justifyContent: 'space-between',
        marginBottom: 60 * px,
      }}>
      <View>{headerLeft}</View>
      <View>{headerRight}</View>
    </View>
  );
};

MeHeader.propTypes = {
  headerLeft: PropTypes.element.isRequired,
  headerRight: PropTypes.element.isRequired,
};

// 用户头像
const MeUser = ({
  onPressWithLogin,
  onPressWithUnLogin,
  userName,
  luckyId,
  joinDay = 0,
  userImage,
  token,
}) => {
  // eslint-disable-next-line radix
  const goSetting = () => {
    meProfileClick.setDataAndReport();
    navigationRef.current.navigate('Setting');
  };
  const join = parseInt((new Date().getTime() / 1000 - joinDay) / 24 / 60 / 60);
  return (
    <TouchableOpacity
      style={{flexDirection: 'row'}}
      onPress={token ? onPressWithLogin : onPressWithUnLogin}>
      <GlideImage
        style={{
          width: 150 * px,
          height: 150 * px,
          borderRadius: 150 * px,
        }}
        source={{uri: userImage}}
        defaultSource={require('../../assets/me_avator_default.png')}
      />

      <View
        style={{
          marginLeft: 40 * px,
          justifyContent: !token ? 'center' : 'flex-start',
        }}>
        {!token ? (
          <Text style={{fontSize: 50 * px, color: '#000'}}>Login</Text>
        ) : (
          <>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#000', fontSize: 50 * px}}>{userName}</Text>
            </View>
            <Text style={{fontSize: 24 * px, color: '#000'}}>
              Lucky Id：{luckyId}
            </Text>
            <Text style={{fontSize: 26 * px, color: '#000'}}>
              Join in Lucky Deal {join} days
            </Text>
          </>
        )}
      </View>
      <TouchableOpacity
        onPress={goSetting}
        style={{
          paddingHorizontal: 40 * px,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{width: 42 * px, height: 44 * px, tintColor: '#000'}}
          source={require('../../assets/me/ic_edit.png')}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

MeUser.propTypes = {
  token: PropTypes.string,
  onPressWithLogin: PropTypes.func.isRequired,
  onPressWithUnLogin: PropTypes.func.isRequired,
  userName: PropTypes.string,
  userImage: PropTypes.string.isRequired,
  luckyId: PropTypes.string,
  joinDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isVip: PropTypes.bool,
};

// 消息提示图标
const MessageTip = ({token, hasMessage, onPress}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15 * px,
        paddingVertical: 20 * px,
      }}>
      <TouchableOpacity onPress={onPress} style={{marginTop: 15 * px}}>
        <Image
          style={{width: 54 * px, height: 42 * px, tintColor: '#000'}}
          source={require('../../assets/me/me_message_icon.png')}
        />
        {hasMessage && (
          <View
            style={{
              position: 'absolute',
              width: 20 * px,
              height: 20 * px,
              borderRadius: 20 * px,
              backgroundColor: 'red',
              right: (-20 * px) / 2,
              top: (-20 * px) / 2,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

MessageTip.propTypes = {
  hasMessage: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

// 未登录会员入口
const MePrimaryEntry = ({amount, onPress}) => {
  return (
    <View style={{marginBottom: -30 * px, alignItems: 'center'}}>
      <TouchableOpacity onPress={onPress}>
        <ImageBackground
          style={{
            width: 938 * px,
            height: 130 * px,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={require('../../assets/me/me_vipEntry_bg.png')}>
          <Text style={{color: '#FFF88D', fontSize: 40 * px}}>
            Get ${amount} Discount Benefit
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

MePrimaryEntry.propTypes = {
  amount: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
};

const MeVersion = ({userID}) => {
  const dispatch = useDispatch();
  const [showTest, setShowTest] = useState(true);
  const pressCount = useRef(0);
  const timer = useRef();
  const handleVersionCode = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      pressCount.current = 0;
    }, 3000);
    pressCount.current++;
    if (pressCount.current >= 3) {
      setShowTest(!showTest);
      clearTimeout(timer.current);
      pressCount.current = 0;
    }
  };
  const clearData = () => {
    AsyncStorage.clear();
  };
  const Login = () => {
    let password = AppModule.devMode ? 'phRxRVuej8' : '6O2ivwy5TF';
    Api.emailLogin('yinping@innotechx.com', password).then((res) => {
      console.log('login-dev', res);
      if (res.code === 0) {
        let result = res.data;
        standardAction.auth(result);
        dispatch({
          type: 'setToken',
          payload: result,
        });
        AsyncStorage.setItem('token', result.token);
        AsyncStorage.setItem('user_id', result.user_id.toString());

        dispatch(updateProfile());
        navigationRef.current.goBack();
      }
    });
  };

  return (
    <View
      style={{
        alignItems: 'center',
        paddingTop: 61 * px,
        paddingBottom: 61 * px,
        borderTopColor: '#d5d5d5',
        borderTopWidth: 2 * px,
      }}>
      {showTest && (
        <>
          <Text style={{alignSelf: 'center', textAlign: 'center'}}>
            {`user Id: ${userID}\nBuild ${
              AppModule.buildId || 'Unknown'
            }\nBundle ${AppModule.getActiveBundleVersion() || 'None'}\nEnv: ${
              AppModule.devMode ? 'Dev' : 'Gp'
            }`}
          </Text>
          {AppModule.devMode && (
            <>
              <TouchableOpacity onPress={clearData}>
                <Text style={{paddingVertical: 20}}>CLEAR DATA</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={Login}>
                <Text style={{paddingVertical: 10}}>Login In</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
};

export default Me;
