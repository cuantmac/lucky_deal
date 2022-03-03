//
//  QMChatCommonProblemCell.m
//  IMSDK
//
//  Created by lishuijiao on 2020/12/14.
//

#import "QMChatCommonProblemCell.h"
#import "SegmentView.h"
#import "AnswerView.h"
#import "AnswerMoreView.h"
#import "QMPushManager.h"

@interface QMChatCommonProblemCell () <SegmentViewDelegate, AnswerViewDelegate>

@property (nonatomic, strong) SegmentView *segmentView;

@property (nonatomic, strong) AnswerView *answerView;

@property (nonatomic, strong) UIImageView *titleImageView;

@property (nonatomic, strong) UIView *moreView;

@property (nonatomic, strong) UIButton *moreButton;

@property (nonatomic) BOOL isDragging;

@property (nonatomic) NSInteger selectedIndex;

@property (nonatomic, copy) NSMutableArray *nameArray;

@property (nonatomic, copy) NSMutableArray *listArray;

@property (nonatomic, strong) AnswerMoreView *answerMoreView;

@end

@implementation QMChatCommonProblemCell

- (void)createUI {
    [super createUI];
    
    _titleImageView = [[UIImageView alloc] init];
    _titleImageView.image = [UIImage imageNamed:@"qm_common_title"];
    [self.chatBackgroundView addSubview:_titleImageView];
    
    _segmentView = [[SegmentView alloc] init];
    _segmentView.delegate = self;
    _segmentView.alignment = HGCategoryViewAlignmentLeft;
    _segmentView.originalIndex = 0;
    _segmentView.itemSpacing = 25;
    _segmentView.topBorder.hidden = YES;
    _segmentView.titleNormalColor = [UIColor colorWithHexString:isDarkStyle ? QMColor_D5D5D5_text : QMColor_151515_text];
    _segmentView.titleSelectedColor = [UIColor colorWithHexString:isDarkStyle ? QMColor_FFFFFF_text : QMColor_News_Custom];
    [self.chatBackgroundView addSubview:_segmentView];
    
    _answerView = [[AnswerView alloc] init];
    _answerView.delegate = self;
    [self.chatBackgroundView addSubview:_answerView];
    
    _moreView = [[UIView alloc] init];
    _moreView.hidden = YES;
    _moreView.backgroundColor = [UIColor colorWithHexString:isDarkStyle ? QMColor_News_Agent_Dark : QMColor_News_Agent_Light];
    [self.chatBackgroundView addSubview:_moreView];
    
    _moreButton = [[UIButton alloc] init];
    _moreButton.titleLabel.font = [UIFont fontWithName:QM_PingFangSC_Reg size:14];
    [_moreButton setTitle:@"查看更多" forState:UIControlStateNormal];
    [_moreButton setTitleColor:[UIColor colorWithHexString:isDarkStyle ? QMColor_D5D5D5_text : QMColor_News_Custom] forState:UIControlStateNormal];
    [_moreButton addTarget:self action:@selector(moreAction:) forControlEvents:UIControlEventTouchUpInside];
    [self.moreView addSubview:_moreButton];
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    NSData *jsonData = [self.message.common_questions_group dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSArray *commonArray = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&err];
    if(err) {
        NSLog(@"json解析失败：%@",err);
        return;
    }

    _nameArray = [[NSMutableArray alloc] init];
    _listArray = [[NSMutableArray alloc] init];

    if (commonArray.count) {
        for (NSDictionary *item in commonArray) {
            NSString *name = item[@"name"];
            NSArray *list = item[@"list"];
            if (name.length) {
                [_nameArray addObject:name];
            }
            if (list.count) {
                [_listArray addObject:list];
            }
        }
    }
    
    NSString *cellIndex = self.message.common_selected_index.length ? self.message.common_selected_index : @"0";

    NSArray *itemArray = _listArray[[cellIndex integerValue]];
    CGFloat answerHeight = itemArray.count > 5 ? 5 * 45 + 40 : itemArray.count * 45;

    self.chatBackgroundView.frame = CGRectMake(12, CGRectGetMaxY(self.timeLabel.frame) + 25, QM_kScreenWidth - 12*2, answerHeight+100);

    [self.answerView mas_updateConstraints:^(MASConstraintMaker *make) {
        make.height.mas_equalTo(answerHeight);
    }];

}

- (void)setData:(CustomMessage *)message avater:(NSString *)avater {
    self.message = message;
    [super setData:message avater:avater];
    
    self.iconImage.hidden = YES;

    NSData *jsonData = [message.common_questions_group dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSArray *commonArray = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&err];
    if(err) {
        NSLog(@"json解析失败：%@",err);
        return;
    }

    _nameArray = [[NSMutableArray alloc] init];
    _listArray = [[NSMutableArray alloc] init];

    if (commonArray.count) {
        for (NSDictionary *item in commonArray) {
            NSString *name = item[@"name"];
            NSArray *list = item[@"list"];
            if (name.length) {
                [_nameArray addObject:name];
            }
            if (list.count) {
                [_listArray addObject:list];
            }
        }
    }else {
        return;
    }

    
    if ([message.fromType isEqualToString:@"1"]) {
        self.chatBackgroundView.frame = CGRectMake(12, CGRectGetMaxY(self.timeLabel.frame) + 25, QM_kScreenWidth - 12*2, self.contentView.frame.size.height - 25);
        
        NSString *cellIndex = message.common_selected_index.length ? message.common_selected_index : @"0";        
        
        [_segmentView changeSelected:[cellIndex integerValue]];
        [self.answerView setSelectedPage:[cellIndex integerValue] animated:NO];
        
        self.segmentView.titles = _nameArray;
        
        self.answerView.lists = _listArray;
        
        [self.titleImageView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.chatBackgroundView).offset(13);
            make.left.equalTo(self.chatBackgroundView).offset(16);
            make.width.mas_equalTo(155.5);
            make.height.mas_equalTo(43);
        }];
        
        [self.segmentView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.chatBackgroundView).offset(59);
            make.left.right.equalTo(self.chatBackgroundView);
            make.height.mas_equalTo(self.segmentView.height);
        }];
        
        NSArray *itemArray = _listArray[[cellIndex integerValue]];

        CGFloat answerHeight = itemArray.count > 5 ? 5 * 45 + 40 : itemArray.count * 45;

        [self.answerView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.segmentView.mas_bottom).offset(0);
            make.left.right.equalTo(self.chatBackgroundView);
            make.height.mas_equalTo(answerHeight);
        }];
        
        self.moreView.hidden = itemArray.count > 5 ? NO : YES;
        [self.moreView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.answerView.mas_bottom).offset(-39);
            make.left.right.equalTo(self.chatBackgroundView);
            make.bottom.equalTo(self.chatBackgroundView.mas_bottom);
        }];
        
        [self.moreButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.center.equalTo(self.moreView);
            make.width.mas_equalTo(60);
        }];
    }
}

#pragma mark - buttonAction
- (void)moreAction:(UIButton *)button {
    if (_answerMoreView) {
        [_answerMoreView removeFromSuperview];
    }
    
    _answerMoreView = [[AnswerMoreView alloc] init];
    _answerMoreView.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
    [[UIApplication sharedApplication].keyWindow addSubview:_answerMoreView];
    [_answerMoreView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo([UIApplication sharedApplication].keyWindow);
    }];
    NSString *index = self.message.common_selected_index.length ? self.message.common_selected_index : @"0";
    [_answerMoreView setModel:_listArray[[index integerValue]] andTitle:_nameArray[[index integerValue]]];
    
    QMWeakSelf
    _answerMoreView.tapTableView = ^(NSString * _Nonnull text) {
        QMStrongSelf
        dispatch_async(dispatch_get_main_queue(), ^{
            self.tapSendMessage(text, @"");
        });
    };
}

#pragma mark - SegmentViewDelegate
- (void)SegmentViewDidSelectedItemAtIndex:(NSInteger)index {
    self.message.common_selected_index = [NSString stringWithFormat:@"%ld", (long)index];
    self.isDragging = NO;
    [self.answerView setSelectedPage:index animated:NO];
}

#pragma mark - AnswerViewDelegate
- (void)pagesViewWillBeginDragging {
    self.isDragging = YES;
}

- (void)pagesViewDidEndDragging {

}

- (void)pagesViewScrollingToTargetPage:(NSInteger)targetPage sourcePage:(NSInteger)sourcePage percent:(CGFloat)percent {
    if (!self.isDragging) {
        return;
    }
    [self.segmentView scrollToTargetIndex:targetPage sourceIndex:sourcePage percent:percent];
}

- (void)pagesViewWillTransitionToPage:(NSInteger)page {

}

- (void)pagesViewDidTransitionToPage:(NSInteger)page {
    self.message.common_selected_index = [NSString stringWithFormat:@"%ld", (long)page];
    if (page != _selectedIndex) {
        self.selectedIndex = page;
        self.tapCommonAction(page);
    }
}

- (void)pagesViewSelectedText:(NSString *)text {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.tapSendMessage(text, @"");        
    });
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
