//
//  QMChatShowImageViewController.h
//  IMSDK
//
//  Created by lishuijiao on 2020/10/19.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface QMChatShowImageViewController : UIViewController

@property (nonatomic ,copy)NSString * picName;

@property (nonatomic ,copy)NSString * picType;

@property (nonatomic ,strong)UIImage *image;

@property (nonatomic ,strong)UIImageView * bigImageView;

@end

NS_ASSUME_NONNULL_END
