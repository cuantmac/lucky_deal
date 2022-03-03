import React, {useMemo, useCallback} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import {pure} from 'recompose';
import {ProductRoute, MysteryRoute} from '../../../routes/index';
import {px} from '../../../constants/constants';
import AppModule from '../../../../AppModule';
import Utils from '../../../utils/Utils';
import GlideImage from '../../native/GlideImage';
import {reportData} from '../../../constants/reportData';

function BestSellItem({data, index}) {
  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();
  const onPress = useCallback(
    () => {
      AppModule.reportClick(reportData.home, '243', {
        CategoryId: data.category_id || data?.special_topic?.category_id || 0,
        LinkID: data?.special_topic?.redirect_url || '',
        ProductId: data.bag_id || data.product_id,
        RecommendType: data.product_category,
      });
      if (data.product_category === 1) {
        // 福袋商品
        MysteryRouter.navigate({productId: data.bag_id});
      } else if (data.product_category === 2 || data.product_category === 4) {
        // 直购和会员商品
        ProductRouter.navigate({productId: data.product_id});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index],
  );
  //const now = useSelector((state) => state.memory.now);
  const ActivityTag = useMemo(
    () => {
      return data?.activity_tag ? (
        <View
          style={{
            backgroundColor: data.activity_tag_color
              ? data.activity_tag_color
              : '#D70000',
            position: 'absolute',
            left: 0,
            top: 0,
            height: 50 * px,
            // borderBottomRightRadius: 25 * px,
            borderTopLeftRadius: 18 * px,
            borderBottomRightRadius: 40 * px,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 30 * px,
              paddingHorizontal: 10,
            }}>
            {data.activity_tag}
          </Text>
        </View>
      ) : null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.activity_tag],
  );
  const BaseTag = useMemo(
    () =>
      data.base_tag?.length > 0 && data.base_tag.map ? (
        <View
          style={{
            flexDirection: 'row',
            height: 36 * px,
            marginTop: 10 * px,
          }}>
          {data.base_tag.map((item) => (
            <View
              key={item}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFD7D7',
                borderRadius: 4,
                marginRight: 2,
              }}>
              <Text
                style={{
                  color: '#F34A31',
                  fontSize: 26 * px,
                  paddingHorizontal: 5,
                }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={{height: 36 * px}} />
      ),
    [data.base_tag],
  );

  const BuyItNowPrice = useMemo(() => {
    let _percent =
      data.original_price === 0
        ? 0
        : ((1 - data.mark_price / data.original_price) * 100).toFixed(0);
    _percent = _percent < 0 ? '0' : _percent > 99 ? 99 : _percent;
    return (
      <View
        style={{
          marginLeft: 0,
          marginTop: 20 * px,
          height: 20,
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text
          numberOfLines={1}
          style={{
            color: 'black',
            fontSize: data.mark_price > 9999 ? 40 * px : 46 * px,
            marginTop: 0,
            fontWeight: 'bold',
            marginRight: 5 * px,
          }}>
          ${(data.mark_price / 100.0).toFixed(2)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#8A8A8A',
              fontSize: 34 * px,
              textDecorationLine: 'line-through',
            }}>
            ${data.original_price / 100.0}
          </Text>

          <Text
            style={{
              color: '#F34A31',
              fontSize: 26 * px,
              marginLeft: 16 * px,
            }}>
            {_percent}% OFF
          </Text>
        </View>
      </View>
    );
  }, [data.mark_price, data.original_price]);

  /*竞拍未开始*/
  // const StartingSoon = useMemo(
  //   () => (
  //     <Text
  //       style={{
  //         color: 'black',
  //         width: '100%',
  //         margin: 8,
  //         marginTop: 40 * px,
  //         marginBottom: 0,
  //         fontSize: 12,
  //         height: 36,
  //         fontWeight: 'bold',
  //       }}>
  //       {/*Coming in: {Utils.endTimeShow(data.begin_time - now)}*/}
  //     </Text>
  //   ),
  //   [],
  // );
  const Render = useMemo(() => {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        {data.product_category === 5 || data.product_category === 6 ? (
          <View
            style={{
              width: 510 * px,
              height: 900 * px,
            }}>
            <GlideImage
              showDefaultImage={true}
              source={Utils.getImageUri(data?.special_topic?.logo_image)}
              defaultSource={require('../../../assets/lucky_deal_default_high.png')}
              resizeMode={'stretch'}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 20 * px,
              }}
            />
          </View>
        ) : (
          <View
            style={{
              height: 900 * px,
            }}>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                width: 510 * px,
              }}>
              <GlideImage
                showDefaultImage={true}
                source={Utils.getImageUri(data.image)}
                defaultSource={require('../../../assets/lucky_deal_default_middle.png')}
                resizeMode={'stretch'}
                style={{
                  width: 510 * px,
                  height: 510 * px,
                  borderTopLeftRadius: 20 * px,
                  borderTopRightRadius: 20 * px,
                }}
              />
              {ActivityTag}
            </View>
            <View style={{paddingHorizontal: 15 * px}}>
              {BuyItNowPrice}
              <Text
                numberOfLines={2}
                style={{
                  color: 'black',
                  paddingRight: 5 * px,
                  //marginLeft: 8,
                  marginRight: 10,
                  fontSize: 40 * px,
                  // width: 400 * px,
                }}>
                {data.title ? data.title : 'Unknown'}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  marginTop: 6 * px,
                  color: '#8A8A8A',
                  //marginLeft: 8,
                  marginRight: 10,
                  fontSize: 30 * px,
                }}>
                {data.order_num} Orders
              </Text>
              {BaseTag}
            </View>
            <View
              style={{
                height: 80 * px,
                width: 170 * px,
                // marginLeft: 20 * px,
                bottom: 10,
                left: 20 * px,
                overflow: 'hidden',
                position: 'absolute',
                borderWidth: 2 * px,
                borderStyle: 'solid',
                borderColor: '#000',
                borderRadius: 40 * px,
              }}>
              <Text
                style={{
                  fontSize: 42 * px,
                  textAlign: 'center',
                  paddingTop: 5 * px,
                }}>
                Buy
              </Text>
            </View>
          </View>
        )}
      </TouchableWithoutFeedback>
    );
  }, [data, BaseTag, BuyItNowPrice, ActivityTag, onPress]);
  return Render;
}

export default pure(BestSellItem);
