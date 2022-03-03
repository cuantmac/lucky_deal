//
//  QMChatBaseCell.m
//  IMSDK
//
//  Created by lishuijiao on 2020/10/19.
//

#import "QMChatBaseCell.h"
#import "QMDateManager.h"
#import "LDTools.h"

@implementation QMChatBaseCell {
    CustomMessage *_message;
}

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.backgroundColor = [UIColor clearColor];
        [self createUI];
    }
    return self;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)prepareForReuse {
    [super prepareForReuse];
    self.iconImage.image = nil;
    self.chatBackgroundView.backgroundColor = nil;
    self.timeLabel.text = nil;
    self.readStatus.text = nil;
}

- (void)createUI {
    self.iconImage = [[UIImageView alloc] init];
    self.iconImage.backgroundColor = [UIColor whiteColor];
    self.iconImage.contentMode = UIViewContentModeScaleAspectFill;
    self.iconImage.layer.cornerRadius = 8;
    self.iconImage.layer.masksToBounds = true;
    self.iconImage.clipsToBounds = YES;
    [self.contentView addSubview:self.iconImage];
    
    self.timeLabel = [[UILabel alloc] init];
    self.timeLabel.hidden = YES;
    self.timeLabel.textAlignment = NSTextAlignmentCenter;
    self.timeLabel.backgroundColor = [UIColor clearColor];
    self.timeLabel.textColor = [UIColor colorWithHexString:QMColor_666666_text];
    self.timeLabel.font = [UIFont fontWithName:QM_PingFangSC_Reg size:12];
    [self.contentView addSubview:self.timeLabel];
    
    self.chatBackgroundView = [[UIView alloc] init];
    self.chatBackgroundView.layer.masksToBounds = YES;
    self.chatBackgroundView.layer.cornerRadius = 8;
    [self.contentView addSubview:self.chatBackgroundView];

    self.sendStatus = [[UIImageView alloc] init];
    self.sendStatus.userInteractionEnabled = YES;
    [self.contentView addSubview:self.sendStatus];

    UITapGestureRecognizer *tapResendMessage = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(reSendAction:)];
    [self.sendStatus addGestureRecognizer:tapResendMessage];
    
    self.readStatus = [[UILabel alloc] init];
    self.readStatus.hidden = YES;
    self.readStatus.textAlignment = NSTextAlignmentCenter;
    self.readStatus.backgroundColor = [UIColor clearColor];
    self.readStatus.textColor = [UIColor grayColor];
    self.readStatus.font = [UIFont systemFontOfSize:12];
    [self.contentView addSubview:self.readStatus];
}

- (void)setData:(CustomMessage *)message avater:(NSString *)avater {
    _message = message;
    if (self.timeLabel.hidden == YES) {
        self.timeLabel.frame = CGRectZero;
    }else {
        self.timeLabel.frame = CGRectMake(0, 24, QM_kScreenWidth, 12);
    }
    
    NSString *spString = message.createdTime;
    NSDate *confromTime = [NSDate dateWithTimeIntervalSince1970:[spString integerValue]/1000];
    self.timeLabel.text = [QMDateManager getTimeDate:confromTime timeStatus:true];

    if ([message.fromType isEqualToString:@"0"]) {
        if ([NSURL URLWithString:avater]) {
            [self.iconImage sd_setImageWithURL:[NSURL URLWithString:avater] placeholderImage:[UIImage imageNamed:@"qm_default_user"]];
        }else {
            self.iconImage.image = [UIImage imageNamed:@"qm_default_user"];
        }
        
        self.iconImage.frame = CGRectMake(QM_kScreenWidth-57, CGRectGetMaxY(self.timeLabel.frame)+25, 45, 45);

        self.chatBackgroundView.backgroundColor = [UIColor colorWithHexString:QMColor_News_Custom];
    }else {
        //接收
        if ([message.userType isEqualToString:@"system"]) {
            [self.iconImage sd_setImageWithURL:[NSURL URLWithString:[QMConnect sdkSystemMessageIcon]] placeholderImage:[UIImage imageNamed:@"qm_default_robot"]];
        }else {
            if ([NSURL URLWithString:message.agentIcon]) {
                [self.iconImage sd_setImageWithURL:[NSURL URLWithString:message.agentIcon] placeholderImage:[UIImage imageNamed:@"qm_default_agent"]];
            }else {
                if ([message.isRobot isEqualToString:@"1"]) {
                    self.iconImage.image = [UIImage imageNamed:@"qm_default_robot"];
                }else {
                    self.iconImage.image = [UIImage imageNamed:@"qm_default_agent"];
                }
            }
        }
        
        self.iconImage.frame = CGRectMake(12, CGRectGetMaxY(self.timeLabel.frame)+25, 45, 45);
        
        self.chatBackgroundView.backgroundColor = [UIColor colorWithHexString:isDarkStyle ? QMColor_News_Agent_Dark : QMColor_News_Agent_Light];
        self.sendStatus.hidden = YES;
    }
    
    if ([message.fromType isEqualToString:@"0"]) {
        if ([message.status isEqualToString:@"0"]) {
            self.sendStatus.hidden = YES;
        }else if ([message.status isEqualToString:@"1"]) {
            self.sendStatus.hidden = NO;
            self.sendStatus.image = [UIImage imageNamed:@"qm_send_failed"];
            [self removeSendingAnimation];
        } else if ([message.status isEqualToString:@"2"]) {
            self.sendStatus.hidden = NO;
            self.sendStatus.image = [UIImage imageNamed:@"icon_sending"];
            [self showSendingAnimation];
            [[NSNotificationCenter defaultCenter] removeObserver:self]; // 防止cell重用已监听其他id
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(progressChange:) name:message._id object:nil];
        }
    }
}

- (void)progressChange:(NSNotification *)notfi {
    if ([notfi.name isEqualToString:_message._id]) {
        float progress = [notfi.object floatValue];
        [self setProgress:progress];
    }
}

- (void)showSendingAnimation {
    CABasicAnimation * animation = [CABasicAnimation animationWithKeyPath:@"transform.rotation.z"];
    animation.fromValue = @0.0;
    animation.toValue = @(2*M_PI);
    animation.duration = 1.0;
    animation.repeatCount = MAXFLOAT;
    animation.removedOnCompletion = NO;
    __weak QMChatBaseCell *strongSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        [strongSelf.sendStatus.layer addAnimation:animation forKey:@"transform.rotation.z"];
    });
}

- (void)removeSendingAnimation {
    __weak QMChatBaseCell *strongSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        [strongSelf.sendStatus.layer removeAnimationForKey:@"transform.rotation.z"];
    });
}

- (void)setProgress: (float)progress {
    
}

- (void)longPressTapGesture:(id)sender {
    
}

- (void)reSendAction: (UITapGestureRecognizer *)gesture {
    if ([QMPushManager share].isFinish == YES) {
        [[NSNotificationCenter defaultCenter] postNotificationName:CUSTOMSRV_FINISH object:@"tapAction"];
        return;
    }
    
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"" message:NSLocalizedString(@"button.sendAgain", nil) preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction * doneAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"button.sure", nil) style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        if ([self->_message.status isEqualToString:@"1"]) {

            [QMConnect resendMessage:self->_message successBlock:^{
                NSLog(@"消息重发成功");
            } failBlock:^(NSString *reason){
                NSLog(@"消息重发失败");
            }];
        }
    }];
    UIAlertAction * cancelAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"button.cancel", nil) style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {

    }];
    [alert addAction:doneAction];
    [alert addAction:cancelAction];
    [[LDTools currentViewController] presentViewController:alert animated:YES completion:nil];
}

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
