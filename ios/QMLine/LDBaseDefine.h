//
//  LDBaseDefine.h
//  LuckyDeal
//
//  Created by sjf on 2021/5/7.
//

#ifndef LDBaseDefine_h
#define LDBaseDefine_h

//arc
#define WEAKSELF __weak typeof(self) weakSelf = self
#define STRONGSELF __strong typeof(weakSelf)self = weakSelf

#define QM_kStatusBarHeight  [UIApplication sharedApplication].statusBarFrame.size.height
#define kStatusBarAndNavHeight (QM_kStatusBarHeight + 44.0)
#define QM_IS_iPHONEX  ((QM_kStatusBarHeight > 20)?YES:NO)

#define QM_kScreenWidth  [[UIScreen mainScreen] bounds].size.width
#define QM_kScreenHeight (QM_IS_iPHONEX ? ([[UIScreen mainScreen] bounds].size.height - 34) : ([[UIScreen mainScreen] bounds].size.height))
#define LDScreenHeight [[UIScreen mainScreen] bounds].size.height

#define sizeScaleByDesign(value) (UIScreen.mainScreen.bounds.size.width / 375 * value)

#ifndef kScale6
#define kScale6 (UIScreen.mainScreen.bounds.size.width/375.0)
#endif


#define QM_iPhone6sScaleWidth [[UIScreen mainScreen] bounds].size.width/375

#define QMDeVice (([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPhone)?YES:NO)

#define kInputViewHeight 75


#define QMChatTextMaxWidth (QM_kScreenWidth - 67 * 2 - 30)
#define kSafeArea (QM_IS_iPHONEX ? 34.0 : 0)

#define isDarkStyle ([QMPushManager share].isStyle)

#define QMWeakSelf \
__weak typeof(self) self_weak_ = self;

#define QMStrongSelf \
_Pragma("clang diagnostic push") \
_Pragma("clang diagnostic ignored \"-Wshadow\"") \
__strong typeof(self) self = self_weak_;\
_Pragma("clang diagnostic pop")

#define QM_PingFangSC_Med  @"PingFangSC-Medium"
#define QM_PingFangSC_Reg  @"PingFangSC-Regular"
#define QM_PingFangSC_Lig  @"PingFangSC-Light"
#define QM_PingFangTC_Sem  @"PingFangTC-Semibold"

#endif /* LDBaseDefine_h */
