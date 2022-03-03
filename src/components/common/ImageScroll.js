import {Modal, ActivityIndicator, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import {px} from '../../constants/constants';
import {ModalContainer} from '../common/ModalContainer';
export default function ImageScroll({data, callback}) {
  // console.log('data', data);
  return (
    <ModalContainer
      visible={data.show}
      transparent={true}
      animationType="fade"
      onRequestClose={callback}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 10,
          top: 20,
          zIndex: 9999,
          padding: 40 * px,
        }}
        onPress={callback}>
        <Image
          source={require('../../assets/circle_close.png')}
          style={{width: 100 * px, height: 100 * px}}
        />
      </TouchableOpacity>
      <ImageViewer
        loadingRender={() => {
          return <ActivityIndicator />;
        }}
        onCancel={callback}
        backgroundColor={'rgba(255,255,255,.8)'}
        enablePreload={true}
        useNativeDriver={true}
        enableImageZoom={false}
        enableSwipeDown={true}
        imageUrls={data.list}
        index={data.index}
        failImageSource={require('../../assets/error_big_comment.png')}
      />
    </ModalContainer>
  );
}
