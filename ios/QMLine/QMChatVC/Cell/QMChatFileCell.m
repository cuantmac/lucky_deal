//
//  QMChatFileCell.m
//  IMSDK
//
//  Created by lishuijiao on 2020/10/21.
//

#import "QMChatFileCell.h"
#import "QMChatShowFileViewController.h"
#import "PieView.h"
#import "QMLabelText.h"
#import "QMProfileManager.h"
#import "LDTools.h"

@implementation QMChatFileCell {
    UIImageView *_fileImageView;
    UILabel *_fileName;
    UILabel *_fileSize;
    NSString *_statusString;
    PieView *_pieView;
}

- (void)createUI {
    [super createUI];
    
    _fileImageView = [[UIImageView alloc] init];
    _fileImageView.clipsToBounds = YES;
    [self.chatBackgroundView addSubview:_fileImageView];
    
    _fileName = [[UILabel alloc] init];
    _fileName.font = [UIFont fontWithName:QM_PingFangSC_Med size:16];
    _fileName.textColor = [UIColor colorWithHexString:QMColor_151515_text];
    _fileName.numberOfLines = 2;
    [self.chatBackgroundView addSubview:_fileName];
    
    _fileSize = [[UILabel alloc] init];
    _fileSize.font = [UIFont fontWithName:QM_PingFangSC_Reg size:11];
    _fileSize.textColor = [UIColor colorWithHexString:QMColor_999999_text];
    [self.chatBackgroundView addSubview:_fileSize];
    
}

- (void)setData:(CustomMessage *)message avater:(NSString *)avater {
    self.message = message;
    [super setData:message avater:avater];
    
    UITapGestureRecognizer * tapPressGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapPressGesture:)];
    [self.chatBackgroundView addGestureRecognizer:tapPressGesture];

    NSString *fileNameText = @"";
    if (message.fileName != nil) {
        fileNameText = message.fileName;
    }else {
        fileNameText = message.message;
    }
    
    NSString *fileSizeText = @"";
    if (message.fileSize == nil) {
        fileSizeText = @"0 K";
    }else {
        NSArray *textArray = [message.fileSize componentsSeparatedByString:@"&"];
        fileSizeText = textArray[0];
    }

    CGFloat fileNameHeight = [QMLabelText calculateTextHeight:fileNameText fontName:QM_PingFangSC_Med fontSize:16 maxWidth:QMChatTextMaxWidth - 60];
    fileNameHeight = fileNameHeight > 45 ? 45 : fileNameHeight;
    
    NSString *imageName = [self matchImageWithFileNameExtension: message.fileName.pathExtension.lowercaseString];
    _fileImageView.image = [UIImage imageNamed:imageName];
    
    if ([message.fromType isEqualToString:@"0"]) {
        self.chatBackgroundView.backgroundColor = [UIColor colorWithHexString:isDarkStyle ? QMColor_News_Agent_Dark : QMColor_News_Agent_Light];
        self.chatBackgroundView.frame = CGRectMake(67, CGRectGetMaxY(self.timeLabel.frame)+25, QM_kScreenWidth - 67 * 2, 90);
        self.sendStatus.frame = CGRectMake(CGRectGetMinX(self.chatBackgroundView.frame)-25, CGRectGetMidY(self.chatBackgroundView.frame)-10, 20, 20);

        if ([message.status isEqualToString:@"0"]) {
            _statusString = NSLocalizedString(@"title.uploaded", nil);
        }else if ([message.status isEqualToString:@"1"]) {
            _statusString = NSLocalizedString(@"title.uploadFailure", nil);
        }else {
            _statusString = NSLocalizedString(@"title.uploading", nil);
        }
        
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
            self.readStatus.frame = CGRectMake(CGRectGetMinX(self.chatBackgroundView.frame)-35, CGRectGetMaxY(self.chatBackgroundView.frame)-22, 25, 17);
        }
    }else {
        self.chatBackgroundView.frame = CGRectMake(67, CGRectGetMaxY(self.timeLabel.frame)+25, QM_kScreenWidth - 67 * 2, 90);
                
        if ([message.downloadState isEqualToString:@"2"]) {
            _statusString = NSLocalizedString(@"title.downloads", nil);
        }else if ([message.downloadState isEqualToString:@"1"]) {
            _statusString = NSLocalizedString(@"title.notDownloaded", nil);
        }else if ([message.downloadState isEqualToString:@"0"]) {
            _statusString = NSLocalizedString(@"title.downloaded", nil);
        }else {
            _statusString = NSLocalizedString(@"title.downloaded", nil);
        }
    }
    
    _fileName.text = fileNameText;
    _fileSize.text = [NSString stringWithFormat:@"%@ / %@",fileSizeText, _statusString];
    _fileImageView.frame = CGRectMake(self.chatBackgroundView.frame.size.width - 60, 15, 45, 60);
    _fileName.frame = CGRectMake(15, 17, QMChatTextMaxWidth - 60, fileNameHeight);
    _fileSize.frame = CGRectMake(17, CGRectGetMaxY(_fileName.frame) + 10, QMChatTextMaxWidth - 60, 11);
}

- (void)setProgress:(float)progress {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self setPieView:progress];
    });
}

- (void)setPieView:(float)progress {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self->_pieView removeFromSuperview];
        self->_pieView = [[PieView alloc] initWithFrame:CGRectMake(-45/2, -15, 90, 90) dataItems:@[@(progress),@(1-progress)] colorItems:@[[UIColor clearColor], [UIColor colorWithHexString:QMColor_000000_text alpha:0.2]]];
        self->_pieView.backgroundColor = [UIColor clearColor];
        [self->_fileImageView addSubview:self->_pieView];
        [self->_pieView stroke];
    });
}

- (void)tapPressGesture:(id)sender {
    if (self.message.localFilePath == nil) {
        NSString *localPath = [[QMProfileManager sharedInstance] checkFileExtension: self.message.fileName];
        __weak QMChatFileCell *weakSelf = self;
        [QMConnect downloadFileWithMessage:self.message localFilePath:localPath progressHander:^(float progress) {
            dispatch_async(dispatch_get_main_queue(), ^{
                [weakSelf setProgress:progress];
            });
        } successBlock:^{
            // 图片或视频存储至相册
            dispatch_async(dispatch_get_main_queue(), ^{
                [weakSelf setProgress:1];
            });
        } failBlock:^(NSString * _Nonnull error) {
            [weakSelf setProgress:1];
        }];
    }else {
        // 打开本地文件
        QMChatShowFileViewController *showFile = [[QMChatShowFileViewController alloc] init];
        showFile.modalPresentationStyle = UIModalPresentationFullScreen;
        showFile.filePath = self.message.localFilePath;
        UIViewController *vc = [LDTools currentViewController];
        [vc presentViewController:showFile animated:YES completion:nil];
    }
}

- (NSString *)matchImageWithFileNameExtension:(NSString *)fileName {
    NSString * str;
    if ([fileName isEqualToString:@"doc"]||[fileName isEqualToString:@"docx"]) {
        str = @"doc";
    }else if ([fileName isEqualToString:@"xlsx"]||[fileName isEqualToString:@"xls"]) {
        str = @"xls";
    }else if ([fileName isEqualToString:@"ppt"]||[fileName isEqualToString:@"pptx"]) {
        str = @"pptx";
    }else if ([fileName isEqualToString:@"pdf"]) {
        str = @"pdf";
    }else if ([fileName isEqualToString:@"mp3"]) {
        str = @"mp3";
    }else if ([fileName isEqualToString:@"mov"]||[fileName isEqualToString:@"mp4"]) {
        str = @"mov";
    }else if ([fileName isEqualToString:@"png"]||[fileName isEqualToString:@"jpg"]||[fileName isEqualToString:@"bmp"]||[fileName isEqualToString:@"jpeg"]) {
        str = @"png";
    }else {
        str = @"other";
    }
    return [NSString stringWithFormat:@"qm_file_%@", str];
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
