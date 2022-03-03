import {
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  PRIVACY,
  px,
  StatusBarHeight,
  TERM_OF_SERVICE,
} from '../../constants/constants';
import {CardStyleInterpolators} from '@react-navigation/stack';
import AppModule from '../../../AppModule';
import {useSelector} from 'react-redux';
import Api from '../../Api';

import Utils from '../../utils/Utils';
import {useDispatch} from 'react-redux';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import {ACCENT, PRIMARY} from '../../constants/colors';
import {updateProfile} from '../../redux/persistThunkReduces';
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import SafeAreaView from 'react-native-safe-area-view';
import {thunkAction} from '@src/redux';

export default function ({navigation, route}) {
  const {gender, deeplinkData} = useSelector(
    (state) => state.deprecatedPersist,
  );
  const diversion_type = deeplinkData.ids ? 1 : 0;
  const dispatch = useDispatch();
  const [registering, setRegistering] = useState(false);

  const [registerMethod, setRegisterMethod] = useState('');
  const isGuide = route.params?.isGuide;

  useEffect(() => {
    if (navigation.isFocused()) {
      AppModule.reportShow('10', '91');
    }
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    });
  }, [navigation]);

  const facebookLogin = async () => {
    if (registering) {
      return;
    }
    AppModule.reportClick('10', '92', {
      LoginType: 0,
    });
    AppModule.reportTap('Login', 'ld_facebook_login_click');
    setRegistering(true);
    setRegisterMethod('fb');

    try {
      let data = await LoginManager.logInWithPermissions([
        'email',
        'public_profile',
      ]);
      if (!data.isCancelled) {
        console.log('Login data: ', data);

        let accessTokenData = await AccessToken.getCurrentAccessToken();
        const infoRequest = new GraphRequest(
          '/me',
          {
            accessToken: accessTokenData.accessToken,
            parameters: {
              fields: {
                string: 'email,name,picture',
              },
            },
          },
          async (graphError, result) => {
            if (graphError) {
              setRegistering(false);
              console.log('Error: ', graphError);
              Utils.toastFun('Login error');
              AppModule.reportValue('Login', 'ld_facebook_login_result', {
                way: 'failed',
              });
            } else {
              console.log('Success fetching data: ', result);

              let registerResult = await Api.facebookLogin(
                result.id,
                result.name,
                result.picture.data.url,
                accessTokenData.accessToken,
                gender,
                diversion_type,
              );
              console.log('regist', registerResult);
              if (registerResult?.token) {
                await thunkAction.syncData(registerResult);
                dispatch({
                  type: 'setToken',
                  payload: registerResult,
                });
                AsyncStorage.setItem('token', registerResult.token);
                AsyncStorage.setItem(
                  'user_id',
                  registerResult.user_id.toString(),
                );

                dispatch({
                  type: 'updateOlderUserStatus',
                  payload: registerResult.order_user,
                });
                dispatch(updateProfile());

                navigation.goBack();

                if (isGuide) {
                  navigation.goBack();
                }
                if (route.params?.onGoBack) {
                  route.params.onGoBack(true);
                }
                AppModule.reportValue('Login', 'ld_facebook_login_result', {
                  way: 'success',
                });
              }
              setRegistering(false);
            }
          },
        );
        new GraphRequestManager().addRequest(infoRequest).start();
      } else {
        Utils.toastFun('Login error');
        setRegistering(false);
        AppModule.reportValue('Login', 'ld_facebook_login_result', {
          way: 'failed',
        });
      }
    } catch (e) {
      console.log('facebook login', e);
    } finally {
      setRegistering(false);
    }
  };

  const googleSignin = async () => {
    if (registering) {
      return;
    }
    AppModule.reportClick('10', '92', {
      LoginType: 1,
    });
    AppModule.reportTap('Login', 'ld_google_login_click');
    setRegistering(true);
    setRegisterMethod('google');
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('google signin', userInfo);
      if (userInfo && userInfo.idToken) {
        let registerResult = await Api.googleLogin(
          userInfo.user.id,
          userInfo.user.name,
          userInfo.user.photo,
          userInfo.idToken,
          gender,
          diversion_type,
        );
        console.log('regist', registerResult);
        if (registerResult?.token) {
          await thunkAction.syncData(registerResult);
          dispatch({
            type: 'setToken',
            payload: registerResult,
          });
          AsyncStorage.setItem('token', registerResult.token);
          AsyncStorage.setItem('user_id', registerResult.user_id.toString());
          dispatch({
            type: 'updateOlderUserStatus',
            payload: registerResult.data?.order_user,
          });
          dispatch(updateProfile());

          navigation.goBack();
          if (isGuide) {
            navigation.goBack();
          }
          if (route.params?.onGoBack) {
            route.params.onGoBack(true);
          }
          AppModule.reportValue('Login', 'ld_google_login_result', {
            way: 'success',
          });
        } else {
          AppModule.reportValue('Login', 'ld_google_login_result', {
            way: 'failed',
          });
          setRegistering(false);
        }
        setRegistering(false);
      }
      console.log(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Utils.toastFun(error);
      } else {
        // some other error happened
        Utils.toastFun(error);
      }
      AppModule.reportValue('Login', 'ld_google_login_result', {
        way: 'failed',
      });
      setRegistering(false);
    }
  };

  const appleSignIn = async () => {
    if (registering) {
      return;
    }
    AppModule.reportTap('Login', 'ld_apple_login_click');
    setRegistering(true);
    setRegisterMethod('apple');
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      const nickName =
        (appleAuthRequestResponse.fullName.givenName ||
          appleAuthRequestResponse.fullName.familyName) &&
        appleAuthRequestResponse.fullName.givenName +
          ' ' +
          appleAuthRequestResponse.fullName.familyName;

      if (appleAuthRequestResponse.user) {
        let registerResult = await Api.appleLogin(
          appleAuthRequestResponse.user,
          nickName,
          appleAuthRequestResponse.identityToken,
          gender,
          diversion_type,
        );
        console.log('regist', registerResult);
        if (registerResult?.token) {
          dispatch({
            type: 'setToken',
            payload: registerResult,
          });
          AsyncStorage.setItem('token', registerResult.token);
          AsyncStorage.setItem('user_id', registerResult.user_id.toString());
          dispatch({
            type: 'updateOlderUserStatus',
            payload: registerResult.data?.order_user,
          });
          dispatch(updateProfile());

          navigation.goBack();
          if (isGuide) {
            navigation.goBack();
          }
          if (route.params?.onGoBack) {
            route.params.onGoBack(true);
          }
          AppModule.reportValue('Login', 'ld_apple_login_result', {
            way: 'success',
          });
        } else {
          AppModule.reportValue('Login', 'ld_apple_login_result', {
            way: 'failed',
          });
          setRegistering(false);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginRight: 10,
          marginTop: StatusBarHeight + 10,
        }}>
        <TouchableOpacity
          style={{
            height: 60 * px,
            backgroundColor: '#00000011',
            borderRadius: 30 * px,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            AppModule.reportClick('10', '93');
            navigation.goBack();
            if (isGuide) {
              navigation.goBack();
            }
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 35 * px,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
            SKIP
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', marginTop: 44 * px}}>
            <View
              style={{
                alignItems: 'flex-start',
              }}>
              {isGuide ? (
                <TouchableOpacity
                  style={{
                    marginLeft: 17 * px,
                    height: 60 * px,
                  }}
                  onPress={() => {
                    AppModule.reportTap('NewUserGuide', 'ld_guide_back_click');
                    navigation.goBack();
                  }}>
                  <Text
                    style={{
                      backgroundColor: '#00000011',
                      color: 'black',
                      fontSize: 35 * px,
                      height: 60 * px,
                      borderRadius: 30 * px,
                      paddingLeft: 10,
                      paddingRight: 10,
                      lineHeight: 60 * px,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    BACK
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <Text
            style={{
              color: '#000000',
              fontSize: 50 * px,
              marginTop: 45 * px,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            Log in and start to buy & save
          </Text>
          <Image
            source={require('../../assets/deng.png')}
            resizeMode={'contain'}
            style={{
              width: 1030 * px,
              flex: 1,
              alignSelf: 'center',
              marginTop: 30 * px,
            }}
          />
          <TouchableOpacity
            style={{
              marginTop: 30 * px,
              marginLeft: 55 * px,
              marginRight: 55 * px,
              borderRadius: 75.9 * px,
              backgroundColor: ACCENT,
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.23,
              shadowRadius: 2.62,
              height: 151.8 * px,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={facebookLogin}>
            {registering && registerMethod === 'fb' ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <View
                style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                <Image
                  style={{
                    width: 115 * px,
                    height: 115 * px,
                    marginLeft: 60 * px,
                  }}
                  source={require('../../assets/fb_icon.png')}
                />
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 50 * px,
                    marginRight: 60 * px,
                  }}>
                  Login With Facebook
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {Platform.OS === 'android' ? (
            <TouchableOpacity
              style={{
                marginTop: 50 * px,
                marginLeft: 55 * px,
                marginRight: 55 * px,
                backgroundColor: 'white',
                borderRadius: 75.9 * px,
                height: 151.8 * px,
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={googleSignin}>
              {registering && registerMethod === 'google' ? (
                <ActivityIndicator color={PRIMARY} />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    style={{
                      width: 100 * px,
                      height: 100 * px,
                      marginLeft: 60 * px,
                    }}
                    resizeMode={'contain'}
                    source={require('../../assets/google.png')}
                  />
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      color: 'black',
                      fontSize: 50 * px,
                      marginRight: 60 * px,
                    }}>
                    Login With Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <AppleButton
              style={{
                marginTop: 50 * px,
                marginLeft: 55 * px,
                marginRight: 55 * px,
                borderWidth: 1,
                borderRadius: 75.9 * px,
                height: 151.8 * px,
                overflow: 'hidden',
              }}
              buttonStyle={AppleButton.Style.DEFAULT}
              buttonType={AppleButton.Type.SIGN_IN}
              onPress={appleSignIn}
            />
          )}

          <Text
            style={{
              color: '#999999',
              fontSize: 30 * px,
              textAlign: 'center',
              marginTop: 86 * px,
              marginBottom: 36 * px,
              marginLeft: 72 * px,
              marginRight: 72 * px,
            }}>
            By access out service,you are agree with the{' '}
            <Text
              onPress={() =>
                // Linking.openURL(TERM_OF_SERVICE)
                navigation.push('MyWebview', {
                  pay_url: TERM_OF_SERVICE,
                  title: 'Terms of Service',
                })
              }
              style={{color: 'black'}}>
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text
              onPress={() =>
                // Linking.openURL(PRIVACY)
                navigation.push('MyWebview', {
                  pay_url: PRIVACY,
                  title: 'Privacy Policy',
                })
              }
              style={{color: 'black'}}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
