//
//  LDLaunchLoadingView.m
//  LuckyDeal
//
//  Created by sjf on 2021/5/12.
//

#import "LDLaunchLoadingView.h"

@interface LDLaunchLoadingView ()

@property (nonatomic, weak) NSTimer *timer;
@property (nonatomic, assign) NSInteger timerFlag;

@end

@implementation LDLaunchLoadingView

- (instancetype)init {
    self = [super initWithFrame:[UIScreen mainScreen].bounds];
    if (self) {
//        NSArray *arr = @[@"1"];
//        NSString *string = [arr objectAtIndex:2];
        
        self.timerFlag = 3;
        
        self.backgroundColor = [UIColor whiteColor];
        
        CGFloat bottomHeight = QM_kScreenWidth*242/1080.0;
        UIImageView *bottomImageV = [[UIImageView alloc] initWithFrame:CGRectMake(0, LDScreenHeight-bottomHeight, QM_kScreenWidth, bottomHeight)];
        bottomImageV.image = [UIImage imageNamed:@"splash_bg"];
        [self addSubview:bottomImageV];
        
        UILabel *tipLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, bottomImageV.frame.origin.y-38-21, QM_kScreenWidth, 21)];
        tipLabel.textColor = [UIColor blackColor];
        tipLabel.textAlignment = NSTextAlignmentCenter;
        tipLabel.text = @"Good Stuff, Everyone Can Afford";
        tipLabel.font = [UIFont systemFontOfSize:17];
        [self addSubview:tipLabel];
        
        UIImageView *ldIcon = [[UIImageView alloc] initWithFrame:CGRectMake((QM_kScreenWidth-192)/2, tipLabel.frame.origin.y-8-36, 192, 36)];
        ldIcon.image = [UIImage imageNamed:@"ld_text"];
        [self addSubview:ldIcon];
        
        CGFloat originY = ldIcon.frame.origin.y/2.0-47.5;
        UIImageView *icon = [[UIImageView alloc] initWithFrame:CGRectMake((QM_kScreenWidth-95)/2, originY, 95, 95)];
        icon.image = [UIImage imageNamed:@"ic_launcher"];
        [self addSubview:icon];
        
        _timer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(handleTimer) userInfo:nil repeats:YES];
    }
    return self;
}

- (void)dismissLoadingView {
    if (self.superview) {
        [self invalidateTimer];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            for (UIView *view in self.subviews) {
                [view removeFromSuperview];
            }
            [self removeFromSuperview];
        });
    }
}

- (void)handleTimer {
    self.timerFlag--;
    if (self.timerFlag <= 0) {
        [self dismissLoadingView];
        return;
    }
}

- (void)invalidateTimer {
    if (_timer) {
        [_timer invalidate];
        _timer = nil;
    }
}

@end
