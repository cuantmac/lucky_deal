#脚本所在的目录必须和WorkSpace或者说工程主目录所在的目录在同一个目录层级中
#gem install fir-cli
#来源(外部入参, sh xcodebuild.sh debug 代表打的archive debug包。 不带参数 默认打的release包)
Source="$1"

#配置参数
Workspace_Name="LuckyDeal"

#工程名字
Project_Name="LuckyDeal"

Product_Name="Lucky Deal"

#配置打包方式Release或者Debug

fir_token="129d5495d6ecc424086003ce6eef44a4"

upload_token=$fir_token

if [ $Source == "debug" ]; then
Configuration="Debug"
else
Configuration="Release"
fi

#基础主路径
BUILD_PATH=./build
PROJECT_DIR=./LuckyDeal

#上传到pgyer的
LOG_FILE="buildLog"

INFOPLIST_FILE="Info.plist"

#不同版本的基础子路径
#adHoc
ADHOC_PATH=${BUILD_PATH}/adHoc

#配置编译文件的存放地址
#adHoc
CONFIGURATION_BUILD_PATH_ADHOC=${ADHOC_PATH}/${Configuration}-iphoneos

#配置打包结果输出的路径
#AdHoc版本
AdHocPrijectOutPath=${ADHOC_PATH}/adHocOut

#加载各个版本的plist文件，为了实现一个脚本打包所有版本，这里对不同对版本创建了不同的plist配置文件。等号后面是文件路径，一般把plist文件放在与脚本同一级别的文件层中。我这里测试用所以plist文件都一样，实际使用是请分开配置为不同文件
ADHOCExportOptionsPlist="./adHocExportOptions.plist"

echo "***************************adhoc打包中******************************"
#首先清除原来的文件夹
rm -rf ${BUILD_PATH}
#创建文件夹，路径需要一层一层创建，不然会创建失败
mkdir ${BUILD_PATH}
touch ${LOG_FILE}
mkdir ${ADHOC_PATH}
#编译文件
mkdir ${CONFIGURATION_BUILD_PATH_ADHOC}
#打包输出的文件
mkdir ${AdHocPrijectOutPath}
#copy
mkdir ${DSYM_COPY_PATH_ADHOC}
#运行前clean工程
xcodebuild clean -workspace ${Project_Name}.xcworkspace -scheme $Project_Name -configuration $Configuration
#Pod操作(禁用更新本地cocoapos repo spec, 节约打包时间，但是要确定本地的repo库不要太老)
pod install
#pod update --no-repo-update

#编译
xcodebuild archive -workspace ${Project_Name}.xcworkspace -scheme $Project_Name -configuration $Configuration -archivePath ${ADHOC_PATH}/$Project_Name-adhoc.xcarchive -allowProvisioningUpdates -allowProvisioningDeviceRegistration
#打包
xcodebuild  -exportArchive -archivePath ${ADHOC_PATH}/$Project_Name-adhoc.xcarchive -exportOptionsPlist $ADHOCExportOptionsPlist -exportPath ${AdHocPrijectOutPath} -allowProvisioningUpdates

shortVersion=$(/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" "${PROJECT_DIR}/${INFOPLIST_FILE}")
shortVersion="$shortVersion"

buildNumber=$(/usr/libexec/PlistBuddy -c "Print :CFBundleVersion" "${PROJECT_DIR}/${INFOPLIST_FILE}")
buildNumber="$buildNumber"

#自增build版本
buildVersion=$(echo ${buildNumber} | grep -o -E '\d{1,3}$')
buildVersion=$(($buildVersion + 1))
#
##设置build版本
#echo "newBuildNumber = $buildVersion"
#/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $buildVersion" "${PROJECT_DIR}/${INFOPLIST_FILE}"


echo "***************************upload pgyer中******************************"
#echo "***************************upload fir.im 中******************************"

#业务测试打包上传

if [ -f "${AdHocPrijectOutPath}/$Product_Name.ipa" ];then
curl -F "file=@${AdHocPrijectOutPath}/$Product_Name.ipa" \
-F '_api_key=7cc4018b3f9932d2eb7b326b9b91a424' \
-F 'buildInstallType=2' \
-F 'buildPassword=123456' \
     https://www.pgyer.com/apiv2/app/upload --progress-bar | tee -a "${LOG_FILE}" ; test ${PIPESTATUS[0]} -eq 0
else
curl -F "file=@${AdHocPrijectOutPath}/$Project_Name.ipa" \
-F '_api_key=7cc4018b3f9932d2eb7b326b9b91a424' \
-F 'buildInstallType=2' \
-F 'buildPassword=123456' \
     https://www.pgyer.com/apiv2/app/upload --progress-bar | tee -a "${LOG_FILE}" ; test ${PIPESTATUS[0]} -eq 0
fi



echo -e "\n"
echo "下载地址为：https://www.pgyer.com/ldeal"

#fir login -T $upload_token       # fir.im token
#fir publish ${AdHocPrijectOutPath}/$Project_Name.ipa
#echo "下载地址为：https://fir.im/qjppure"

# 复制 dSYM 包里的 XXX 文件 上传到指定的地方
#TARGET_PATH=${ADHOC_PATH}/$Project_Name-adhoc.xcarchive/dSYMs/${Project_Name}.app.dSYM/Contents/Resources/DWARF/${Project_Name}
#echo  ${AdHocPrijectOutPath}
#echo    $TARGET_PATH
#
#curl -k "https://api.bugly.qq.com/openapi/file/upload/symbol?app_key=c711abed-e565-42c6-b399-debe2ebd924c&app_id=9b7e0d9007" --form "api_version=1" --form "app_id=9b7e0d9007" --form "app_key=c711abed-e565-42c6-b399-debe2ebd924c" --form "symbolType=2"  --form "bundleId=net.feishi.vchat" --form "productVersion=${shortVersion}" --form "fileName=vchat" --form "file=@${TARGET_PATH}" --verbose --progress-bar | tee -a "${LOG_FILE}" ; test ${PIPESTATUS[0]} -eq 0

#cp ${TARGET_PATH} ${EXPORT_DIR}
