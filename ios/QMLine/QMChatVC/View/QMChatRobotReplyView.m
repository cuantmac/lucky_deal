//
//  QMChatRobotReplyView.m
//  IMSDK
//
//  Created by lishuijiao on 2020/10/27.
//

#import "QMChatRobotReplyView.h"

@implementation QMChatRobotReplyView {
    UILabel *_noHelpLabel;
    
    UILabel *_helpLabel;
    
    UILabel *_lineLabel;
}

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor clearColor];
        [self createView];
    }
    return  self;
}

- (void)setFrame:(CGRect)frame {
    [super setFrame:frame];
    self.noHelpBtn.frame = CGRectMake(self.bounds.size.width - 95, 0, 80, 35);
    self.helpBtn.frame = CGRectMake(self.bounds.size.width - 169, 0, 80, 35);
    self.describeLbl.frame = CGRectMake(15, 55, self.bounds.size.width - 30, self.bounds.size.height - 55);
    _lineLabel.frame = CGRectMake(0, 39.7, self.bounds.size.width, 0.6);
}

- (void)setStatus:(NSString *)status {
    if ([status isEqualToString:@"none"]) {
        [_lineLabel setHidden:YES];
        [self.describeLbl setHidden:YES];
        [self.noHelpBtn setSelected:NO];
        [self.helpBtn setSelected:NO];
    }else if ([status isEqualToString:@"useful"]) {
        [_lineLabel setHidden:NO];
        [self.describeLbl setHidden:NO];
        [self.noHelpBtn setSelected:NO];
        [self.helpBtn setSelected:YES];
        self.describeLbl.text = self.fingerUp.length > 0 ? self.fingerUp : NSLocalizedString(@"title.thanks_yes", nil);
        _helpLabel.textColor = [UIColor colorWithHexString:@"#FFFFFF"];
    }else if ([status isEqualToString:@"useless"]) {
        [_lineLabel setHidden:NO];
        [self.describeLbl setHidden:NO];
        [self.noHelpBtn setSelected:YES];
        [self.helpBtn setSelected:NO];
        self.describeLbl.text = self.fingerDown.length > 0 ? self.fingerDown : NSLocalizedString(@"title.thanks_no", nil);
        _noHelpLabel.textColor = [UIColor colorWithHexString:@"#FFFFFF"];
    }else {
        [_lineLabel setHidden:YES];
        [self.describeLbl setHidden:YES];
        [self.noHelpBtn setSelected:NO];
        [self.helpBtn setSelected:NO];
    }
}

- (void)createView {
    self.helpBtn = [[UIButton alloc] init];
    [self.helpBtn setImage:[UIImage imageNamed:@"qm_useful_nor"] forState:UIControlStateNormal];
    [self.helpBtn setImage:[UIImage imageNamed:@"qm_useful_sel"] forState:UIControlStateSelected];
    [self addSubview:self.helpBtn];

    self.noHelpBtn = [[UIButton alloc] init];
    [self.noHelpBtn setImage:[UIImage imageNamed:@"qm_useless_nor"] forState:UIControlStateNormal];
    [self.noHelpBtn setImage:[UIImage imageNamed:@"qm_useless_sel"] forState:UIControlStateSelected];
    [self addSubview:self.noHelpBtn];

    _helpLabel = [[UILabel alloc] init];
    _helpLabel.frame = CGRectMake(5, 10, 70, 15);
    _helpLabel.text = NSLocalizedString(@"button.yeshelp", nil);
    _helpLabel.textColor = [UIColor colorWithHexString:QMColor_News_Custom];
    _helpLabel.textAlignment = NSTextAlignmentCenter;
    _helpLabel.font = [UIFont fontWithName:QM_PingFangSC_Med size:13];
    [self.helpBtn addSubview:_helpLabel];
    
    _noHelpLabel = [[UILabel alloc] init];
    _noHelpLabel.frame = CGRectMake(5, 10, 70, 15);
    _noHelpLabel.text = NSLocalizedString(@"button.nohelp", nil);
    _noHelpLabel.textColor = [UIColor colorWithHexString:@"#F8624F"];
    _noHelpLabel.textAlignment = NSTextAlignmentCenter;
    _noHelpLabel.font = [UIFont fontWithName:QM_PingFangSC_Med size:13];
    [self.noHelpBtn addSubview:_noHelpLabel];
    
    self.describeLbl = [[UILabel alloc] init];
    self.describeLbl.backgroundColor = [UIColor clearColor];
    self.describeLbl.font = [UIFont fontWithName:QM_PingFangSC_Med size:13];
    self.describeLbl.textColor = [UIColor grayColor];
    self.describeLbl.numberOfLines = 0;
    [self addSubview:self.describeLbl];

    _lineLabel = [[UILabel alloc] init];
    _lineLabel.backgroundColor = [UIColor colorWithHexString:QMColor_999999_text];
    [self addSubview:_lineLabel];
}

@end
