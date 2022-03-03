//
//  LDPaypalWebViewController.h
//  LuckyDeal
//
//  Created by sjf on 2021/4/29.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface LDPaypalWebViewController : UIViewController

@property (nonatomic, strong) NSString *url;
@property (nonatomic, strong) NSDictionary *addressInfo;

@end

NS_ASSUME_NONNULL_END
