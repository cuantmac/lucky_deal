import {Platform, Text, TouchableOpacity, View, Share} from 'react-native';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  FC,
} from 'react';
import {APP_ID} from '@src/constants/constants';
import {ReduxRootState} from '@src/redux';
import {useShallowEqualSelector} from '@src/utils/hooks';
import {showPop, VERSION_CODE} from '@src/helper/nativeBridge';
import {useActionSheet} from '@src/widgets/modal/modal';
import {Message} from '@src/helper/message';
import {GlideImage, GlideImageProps} from '@src/widgets/glideImage';
import {createStyleSheet, styleAdapter} from '@src/helper/helper';

type ShareContent = {title?: string; content?: string; url: string};

export interface ShareDialogRef {
  share: (params: ShareContent) => void;
}

export const ShareDialog = forwardRef<ShareDialogRef>(({}, ref) => {
  const [ActionModal, setActionModalVisible] = useActionSheet();
  const [shareContent, setShareContent] = useState<ShareContent>();
  const {userId} = useShallowEqualSelector((state: ReduxRootState) => ({
    userId: state.persist.persistAuth.user_id,
  }));

  const iosShare = async () => {
    try {
      await Share.share({
        title: 'LuckyDeal',
        url: 'https://itunes.apple.com/app/id' + APP_ID,
        message: 'LuckyDeal - Get Discount Goods',
      });
    } catch (e) {
      Message.toast(e);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      share(params) {
        if (Platform.OS === 'ios') {
          iosShare();
          return;
        }
        setShareContent(params);
        setActionModalVisible(true);
      },
    }),
    [setActionModalVisible],
  );

  const sharePop = useCallback(
    (num: number, channel?: string) => {
      if (!shareContent) {
        return;
      }
      showPop(
        'detail',
        'LuckyDeal',
        'Invite your friend to get more money',
        shareContent.url +
          '%3d' +
          userId +
          '%26' +
          'versionCode%3d' +
          VERSION_CODE +
          '%26' +
          'Channel%3d' +
          channel +
          '%26' +
          'Sharetype%3d' +
          2,
        '' + num,
      );
      setActionModalVisible(false);
    },
    [setActionModalVisible, shareContent, userId],
  );

  return (
    <ActionModal maskClosable useDefaultTemplate={false}>
      <View style={{backgroundColor: 'white'}}>
        <View style={ShareDialogStyles.shareContainer}>
          <ShareItem
            onPress={() => sharePop(1, 'fb')}
            icon={require('@src/assets/facebook_icon.png')}
            text={'Facebook'}
          />
          <ShareItem
            onPress={() => sharePop(4, 'messenger')}
            icon={require('@src/assets/messenger_icon.png')}
            text={'Messenger'}
          />

          <ShareItem
            onPress={() => sharePop(3, 'whatsapp')}
            icon={require('@src/assets/whatsapp_icon.png')}
            text={'WhatsApp'}
          />
        </View>
        <View style={ShareDialogStyles.shareContainer}>
          <ShareItem
            onPress={() => sharePop(2, 'twiter')}
            icon={require('@src/assets/twiter_icon.png')}
            text={'Twitter'}
          />
          <ShareItem
            onPress={() => sharePop(5)}
            icon={require('@src/assets/systrm_icon.png')}
            text={'More'}
          />
          <TouchableOpacity style={ShareDialogStyles.imgContainer} />
        </View>
        <View style={styleAdapter({height: 1, backgroundColor: '#000000'})} />
        <TouchableOpacity
          style={ShareDialogStyles.button}
          onPress={() => {
            setActionModalVisible(false);
          }}>
          <Text style={ShareDialogStyles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ActionModal>
  );
});

interface ShareItemProps {
  icon: GlideImageProps['source'];
  text: string;
  onPress?: () => void;
}

const ShareItem: FC<ShareItemProps> = ({onPress, icon, text}) => {
  return (
    <TouchableOpacity style={ShareDialogStyles.imgContainer} onPress={onPress}>
      <View>
        <GlideImage style={ShareDialogStyles.image} source={icon} />
        <Text style={ShareDialogStyles.itemText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ShareDialogStyles = createStyleSheet({
  imgContainer: {
    height: 94,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 52,
    height: 52,
  },
  itemText: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
  },
  shareContainer: {
    height: 94,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  button: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 14,
    color: '#222',
  },
});
