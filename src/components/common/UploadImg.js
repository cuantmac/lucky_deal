import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import React, {useState, useImperativeHandle, forwardRef} from 'react';
import * as ImagePicker from 'react-native-image-picker';
import {px} from '../../constants/constants';

export default forwardRef(({callback, uploadIcon, uploadText}, ref) => {
  useImperativeHandle(ref, () => ({
    resetList: () => {
      setAvatarSource([]);
    },
  }));
  const [avatarSource, setAvatarSource] = useState([]);
  const options = {
    mediaType:'photo',
    quality: 1.0,
    includeBase64:false,
    maxWidth: 600,
    maxHeight: 600
  };
  const selectPhoto = () => {
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setAvatarSource([
          ...avatarSource,
          {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          },
        ]);

        callback([
          ...avatarSource,
          {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          },
        ]);
        // const base_data = 'data:image/jpeg;base64,' + response.data;
      }
    });
  };

  const openCamera = () => {
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setAvatarSource([
          ...avatarSource,
          {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          },
        ]);

        callback([
          ...avatarSource,
          {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          },
        ]);
        // const base_data = 'data:image/jpeg;base64,' + response.data;
      }
    });
  };
  const deleteImg = (index) => {
    setAvatarSource(
      avatarSource.filter((item, i) => {
        return i !== index;
      }),
    );
    callback(avatarSource);
  };

  return (
    <View style={[styles.flexRowBetween, styles.uploadContainer]}>
      {avatarSource.map((photo, index) => {
        return (
          <View
            style={[
              styles.pickContaner,
              {
                borderWidth: 0,
                backgroundColor: 'transparent',
                position: 'relative',
              },
            ]}
            key={`image-${index}`}>
            <Image
              style={{width: 100, height: 100}}
              source={{uri: photo.uri}}
              // resizeMode={'contain'}
            />
            <TouchableOpacity
              onPress={() => deleteImg(index)}
              style={{position: 'absolute', top: 1, right: 1, padding: 10}}>
              <Image
                source={require('../../assets/circle_close.png')}
                style={{
                  width: 50 * px,
                  height: 50 * px,
                  position: 'absolute',
                  top: 5,
                  right: 5,
                }}
              />
            </TouchableOpacity>
          </View>
        );
      })}
      <TouchableOpacity
        onPress={openCamera}
        style={[styles.pickContaner]}>
        <Image
          source={uploadIcon ? uploadIcon : require('../../assets/camrow.png')}
          style={styles.uploadAvatar}
        />
        {uploadText && <Text>{uploadText}</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={selectPhoto}
        style={[styles.pickContaner]}>
        <Image
          source={uploadIcon ? uploadIcon : require('../../assets/album.png')}
          style={styles.uploadAvatar}
        />
        {uploadText && <Text>{uploadText}</Text>}
      </TouchableOpacity>
    </View>
  );
});
const styles = StyleSheet.create({
  flexRowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  uploadAvatar: {
    width: 101 * px,
    height: 90 * px,
    margin: 6,
    // backgroundColor: '#F0F0F0',
  },
  uploadContainer: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 15,
    marginLeft: 55 * px,
    marginRight: 55 * px,
  },
  pickContaner: {
    borderRadius: 25 * px,
    borderWidth: 0,
    borderColor: '#A4A4A4',
    borderStyle: 'dashed',
    backgroundColor: '#D6D6D6',
    width: 100,
    height: 100,
    overflow: 'hidden',
    marginHorizontal: 5,
    marginVertical: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
  },
});
