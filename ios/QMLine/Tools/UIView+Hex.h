//
//  UIView+Hex.h
//  IMSDK
//
//  Created by lishuijiao on 2020/12/22.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIView (Hex)

+ (void)drawDashLine:(UIView *)lineView lineLength:(int)lineLength lineSpacing:(int)lineSpacing lineColor:(UIColor *)lineColor;

+ (void)drawLineForView:(UIView *)view lineColor:(UIColor *)lineColor;

@end

NS_ASSUME_NONNULL_END
