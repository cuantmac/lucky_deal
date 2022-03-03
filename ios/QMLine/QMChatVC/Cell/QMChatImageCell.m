//
//  QMChatImageCell.m
//  IMSDK
//
//  Created by lishuijiao on 2020/10/19.
//

#import "QMChatImageCell.h"
#import "QMChatShowImageViewController.h"
#import "QMTapGestureRecognizer.h"
#import "LDTools.h"

@implementation QMChatImageCell {
    UIImageView *_imageView;
    
    NSString *_messageId;
}

- (void)createUI {
    [super createUI];
    
    _imageView = [[UIImageView alloc] init];
    _imageView.userInteractionEnabled = YES;
    _imageView.contentMode = UIViewContentModeScaleAspectFill;
    _imageView.clipsToBounds = YES;
    _imageView.layer.cornerRadius = 8;
    [self.contentView addSubview:_imageView];
    
    UILongPressGestureRecognizer * longPressGesture = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressTapGesture:)];
    [_imageView addGestureRecognizer:longPressGesture];
}

- (void)setData:(CustomMessage *)message avater:(NSString *)avater {
    [super setData:message avater:avater];
    
    _messageId = message._id;
    self.message = message;

    if ([message.fromType isEqualToString:@"0"]) {
        NSString *filePath = [NSString stringWithFormat:@"%@/%@/%@",NSHomeDirectory(),@"Documents",message.message];
        _imageView.image = [UIImage imageWithContentsOfFile:filePath];
        CGSize imgSize = _imageView.image.size;
        CGFloat imgWidth = 0.0;
        CGFloat imgHeight = 0.0;
        if (imgSize.height > imgSize.width) {
            imgHeight = 200;
            imgWidth = imgHeight *imgSize.width/imgSize.height;
        } else {
            imgWidth = 200;
            imgHeight = imgWidth *imgSize.height/imgSize.width;
        }
        _imageView.frame = CGRectMake(CGRectGetMinX(self.iconImage.frame)-10-imgWidth, CGRectGetMaxY(self.timeLabel.frame)+25, imgWidth, imgHeight);

        self.sendStatus.frame = CGRectMake(CGRectGetMinX(_imageView.frame)-25, CGRectGetMidY(_imageView.frame)-10, 20, 20);

        if ([message.status isEqualToString:@"0"] && [QMPushManager share].isOpenRead) {
            if ([message.isRead isEqualToString:@"1"]) {
                self.readStatus.hidden = NO;
                self.readStatus.text = @"已读";
            }else if ([message.isRead isEqualToString:@"0"]) {
                self.readStatus.hidden = NO;
                self.readStatus.text = @"未读";
            }else {
                self.readStatus.hidden = YES;
            }
            self.readStatus.frame = CGRectMake(CGRectGetMinX(_imageView.frame)-35, CGRectGetMaxY(_imageView.frame)-22, 25, 17);
        }
    }else {
        
        [_imageView sd_setImageWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@?imageView2/0/w/200/interlace/1/q/80",message.message]] completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
            
            CGSize imgSize = image.size;
            
            CGFloat imgWidth = 0.0;
            CGFloat imgHeight = 0.0;
            imgHeight = 140;
            imgWidth = imgHeight *imgSize.width/imgSize.height;
            imgWidth = imgWidth == 0 ? imgHeight : imgWidth;
            if (imgWidth > 2* imgHeight) {
                imgWidth = 2 * imgHeight;
            }

            _imageView.frame = CGRectMake(CGRectGetMaxX(self.iconImage.frame)+10, CGRectGetMaxY(self.timeLabel.frame)+25, imgWidth, imgHeight);
        }];
    }
    
    QMTapGestureRecognizer * tapPressGesture = [[QMTapGestureRecognizer alloc] initWithTarget:self action:@selector(imagePressGesture:)];
    tapPressGesture.picName = message.message;
    tapPressGesture.picType = message.fromType;
    tapPressGesture.image = _imageView.image;
    [_imageView addGestureRecognizer:tapPressGesture];
}

- (void)longPressTapGesture:(UILongPressGestureRecognizer *)sender {
    if (sender.state == UIGestureRecognizerStateBegan) {
        [self becomeFirstResponder];
        UIMenuController *menu = [UIMenuController sharedMenuController];
        UIMenuItem *removeMenu = [[UIMenuItem alloc] initWithTitle:@"删除" action:@selector(removeMenu:)];
        [menu setMenuItems:[NSArray arrayWithObjects:removeMenu, nil]];
        [menu setTargetRect:_imageView.frame inView:self];
        [menu setMenuVisible:true animated:true];
        
        UIWindow *window = [[[UIApplication sharedApplication] delegate] window];
        if ([window isKeyWindow] == NO) {
            [window becomeKeyWindow];
            [window makeKeyAndVisible];
        }
    }
}

- (BOOL)canBecomeFirstResponder {
    return YES;
}

- (BOOL)canPerformAction:(SEL)action withSender:(id)sender {
    if (action == @selector(removeMenu:)) {
        return YES;
    }else {
        return  NO;
    }
}

- (void)removeMenu:(id)sender {
    // 删除语音(只能删除本地数据库消息)
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:NSLocalizedString(@"title.prompt", nil) message:NSLocalizedString(@"title.statement", nil) preferredStyle:UIAlertControllerStyleAlert];

    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"button.cancel", nil) style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
    
    }];
    UIAlertAction *sureAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"button.sure", nil) style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        [QMConnect removeDataFromDataBase:_messageId];
        [[NSNotificationCenter defaultCenter] postNotificationName:CHATMSG_RELOAD object:nil];
    }];
    [alertController addAction:cancelAction];
    [alertController addAction:sureAction];
    
    [[LDTools currentViewController] presentViewController:alertController animated:YES completion:nil];
}

- (void)imagePressGesture:(QMTapGestureRecognizer *)gestureRecognizer {
    QMChatShowImageViewController * showPicVC = [[QMChatShowImageViewController alloc] init];
    showPicVC.picName = gestureRecognizer.picName;
    showPicVC.picType = gestureRecognizer.picType;
    showPicVC.image = gestureRecognizer.image;
    [[LDTools currentViewController] presentViewController:showPicVC animated:true completion:nil];
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
