//
//  QMChatNoteCell.m
//  IMSDK
//
//  Created by lishuijiao on 2020/10/20.
//

#import "QMChatNoteCell.h"
#import "QMLabelText.h"
#import "QMRemind.h"

@implementation QMChatNoteCell {
    UILabel *_detailLabel;
    
    UIView *_coverView;
    UILabel *_titleLabel;
    UIButton *_sendButton;
    UILabel *_contentLabel;
}

- (void)createUI {
    [super createUI];
    
    _detailLabel = [[UILabel alloc] init];
    _detailLabel.frame = CGRectMake(10, 0, QM_kScreenWidth - 20, 12);
    _detailLabel.textAlignment = NSTextAlignmentCenter;
    _detailLabel.textColor = [UIColor colorWithHexString:QMColor_666666_text];
    _detailLabel.font = [UIFont fontWithName:QM_PingFangSC_Reg size:12];
    [self.contentView addSubview:_detailLabel];
    
    _coverView = [[UIView alloc] init];
    _coverView.frame = CGRectMake(67, 0, QM_kScreenWidth - 67*2, 120);
    _coverView.layer.masksToBounds = YES;
    _coverView.layer.cornerRadius = 8;
    _coverView.backgroundColor = [UIColor colorWithHexString:isDarkStyle ? QMColor_News_Agent_Dark : QMColor_News_Agent_Light];
    [self.contentView addSubview:_coverView];
    
    _titleLabel = [[UILabel alloc] init];
    _titleLabel.frame = CGRectMake(10, 20, CGRectGetWidth(_coverView.frame)-20, 17);
    _titleLabel.textAlignment = NSTextAlignmentCenter;
    _titleLabel.textColor = [UIColor colorWithHexString:isDarkStyle ? @"#D5D5D5" : @"#02071D"];
    _titleLabel.font = [UIFont fontWithName:QM_PingFangSC_Med size:17];
    [_coverView addSubview:_titleLabel];
    
    _sendButton = [[UIButton alloc] init];
    _sendButton.frame = CGRectMake((QM_kScreenWidth-67*2)/2-50, CGRectGetMaxY(_coverView.frame)-40, 100, 25);
    [_sendButton setTitle:NSLocalizedString(@"立即评价", nil) forState:UIControlStateNormal];
    [_sendButton setTitleColor:[UIColor colorWithHexString:QMColor_FFFFFF_text] forState:UIControlStateNormal];
    [_sendButton setBackgroundColor:[UIColor colorWithHexString:QMColor_News_Custom]];
    _sendButton.titleLabel.font = [UIFont fontWithName:QM_PingFangSC_Reg size:13];
    _sendButton.hidden = YES;
    [_sendButton addTarget:self action:@selector(sendAction:) forControlEvents:UIControlEventTouchUpInside];
    [_coverView addSubview:_sendButton];
    
    _contentLabel = [[UILabel alloc] init];
//    _contentLabel.frame = CGRectMake(10, 57, CGRectGetWidth(_coverView.frame)-20, 17);
    _contentLabel.hidden = YES;
    _contentLabel.numberOfLines = 0;
    _contentLabel.textAlignment = NSTextAlignmentCenter;
    _contentLabel.textColor = [UIColor colorWithHexString:isDarkStyle ? @"#808FA6" : QMColor_News_Custom];
    _contentLabel.font = [UIFont fontWithName:QM_PingFangSC_Reg size:13];
    [_coverView addSubview:_contentLabel];
}

- (void)setData:(CustomMessage *)message avater:(NSString *)avater {
    self.message = message;
    [super setData:message avater:avater];
    self.iconImage.hidden = YES;
    
    if ([message.fromType isEqualToString:@"1"]) {
        _detailLabel.text = message.message;
        _detailLabel.frame = CGRectMake(10, CGRectGetMaxY(self.timeLabel.frame)+25, QM_kScreenWidth - 20, 12);
        self.timeLabel.hidden = YES;
    }
    
    if ([message.evaluateStatus isEqualToString:@"0"]) {
        _titleLabel.text = NSLocalizedString(@"请您对本次服务做出评价", nil);
        _sendButton.hidden = NO;
        _contentLabel.hidden = YES;
        _coverView.frame = CGRectMake(67, CGRectGetMaxY(self.timeLabel.frame)+25, QM_kScreenWidth - 135, 120);
    }else if ([message.evaluateStatus isEqualToString:@"1"]) {
        _titleLabel.text = NSLocalizedString(@"请您对本次服务做出评价", nil);
        _sendButton.hidden = NO;
        _contentLabel.hidden = YES;
        _coverView.frame = CGRectMake(67, CGRectGetMaxY(self.timeLabel.frame)+25, QM_kScreenWidth - 135, 120);
    }else if ([message.evaluateStatus isEqualToString:@"2"]) {
        _titleLabel.text = NSLocalizedString(@"感谢您对本次服务做出评价", nil);
        _sendButton.hidden = YES;
        _contentLabel.hidden = NO;
        _contentLabel.text = message.message;
        CGFloat contentHeight = [QMLabelText calculateTextHeight:message.message fontName:QM_PingFangSC_Reg fontSize:13 maxWidth:QM_kScreenWidth - 67*2 - 20];
        _contentLabel.frame = CGRectMake(10, 57, QM_kScreenWidth - 67*2 - 20, contentHeight);
        _coverView.frame = CGRectMake(67, CGRectGetMaxY(self.timeLabel.frame)+25, QM_kScreenWidth - 67*2, 57 + contentHeight + 15);
    }
}

- (void)sendAction:(UIButton *)button {
    if ([self.message.evaluateStatus isEqualToString:@"0"]) {
        
        if (self.message.evaluateTimestamp.length > 0) {
            NSMutableDictionary *params = [NSMutableDictionary dictionary];
            [params setValue:self.message.evaluateTimestamp forKey:@"timestamp"];
            [params setValue:self.message.evaluateTimeout forKey:@"timeout"];
            
            [QMConnect sdkCheckImCsrTimeoutParams:params success:^{
                dispatch_async(dispatch_get_main_queue(), ^{
                    if (self.noteSelected) {
                        self.noteSelected(self.message);
                    }
                });
            } failureBlock:^{
                [QMRemind showMessage:NSLocalizedString(@"title.evaluation_timeout", nil) showTime:5 andPosition:QM_kScreenHeight/2 - 10];
            }];
        }

//        if (self.noteSelected) {
//            self.noteSelected(self.message);
//        }
    }else if ([self.message.evaluateStatus isEqualToString:@"1"]) {
        [QMRemind showMessage:@"已评价"];
    }
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
