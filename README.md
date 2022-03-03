# LuckyDeal

## Before run

```
yarn config set registry http://nexus.qutoutiao.net/repository/qtt/
yarn install
cd ios
pod install
```

Add the following lines to your $HOME/.bash_profile or $HOME/.bashrc config file:
```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## How to run

```
yarn start
```

then, open another terminal

```
yarn android/yarn ios
```

如果yarn ios 后提示没有main.jsbundle 文件，则可以在yarn ios 之前执行
```
yarn bundle:ios 
```
命令生成main.jsbundle文件文。

本地生成bundle 文件<br/>
Android:
```
yarn bundle:android 
```
生成的main.jsbundle 文件存放在./android/app/src/main/assets/ 路径中
<br/><br/>
IOS:
```
yarn bundle:ios 
```
生成的main.jsbundle 文件存放在./ios/ 路径中
