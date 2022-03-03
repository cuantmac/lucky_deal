//
//  LDQMLineManager.m
//  LuckyDeal
//
//  Created by sjf on 2021/5/7.
//

#import "LDQMLineManager.h"
#import <QMLineSDK/QMLineSDK.h>
#import "LDTools.h"
#import "QMRemind.h"
#import "QMChatRoomViewController.h"

#define kLDQMLineAccessId @"60b7b080-a3f8-11eb-8fb9-775a449db377"

@interface LDQMLineManager ()

@property (nonatomic, strong) UIActivityIndicatorView *indicatorView;
@property (nonatomic, assign) BOOL isConnecting;

@property (nonatomic, strong) NSString *userName;
@property (nonatomic, strong) NSString *userId;

//注册成功返回值
@property (nonatomic, copy) NSDictionary *dictionary;

@end

@implementation LDQMLineManager

- (instancetype)init {
    self = [super init];
    if (self) {
        
        [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(registerSuccess:) name:CUSTOM_LOGIN_SUCCEED object:nil];
        [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(registerFailure:) name:CUSTOM_LOGIN_ERROR_USER object:nil];
    }
    return self;
}

+ (instancetype)sharedManager {
    static dispatch_once_t onceToken;
    static LDQMLineManager *_manager_;
    dispatch_once(&onceToken, ^{
        _manager_ = [LDQMLineManager.alloc init];
    });
    return _manager_;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)startConnectLineWithUserName:(NSString *)userName userId:(NSString *)userId {
    
    // 按钮连点控制
    if (self.isConnecting) {
        return;
    }
    self.userId = userId;
    self.userName = userName;
    //指示器
    self.indicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    self.indicatorView.layer.cornerRadius = 5;
    self.indicatorView.layer.masksToBounds = YES;
    self.indicatorView.frame = CGRectMake((QM_kScreenWidth-100)/2, (QM_kScreenHeight-100)/2-64, 100, 100);
    self.indicatorView.backgroundColor = [UIColor blackColor];
    self.indicatorView.color = [UIColor whiteColor];
    self.indicatorView.alpha = 0.7;
    UIViewController *currentVC = [LDTools currentViewController];
    [currentVC.view addSubview:self.indicatorView];
    [self.indicatorView startAnimating];
    
    self.isConnecting = YES;
    
    [QMConnect setServerAddress:@"sean-sdk.7moor.com" tcpPort:9939 httpPost:@"https://sean-wechat.7moor.com:9916"];
    
    /**
     accessId:  接入客服系统的密钥， 登录web客服系统（渠道设置->移动APP客服里获取）
     userName:  用户名， 区分用户， 用户名可直接在后台会话列表显示
     userId:    用户ID， 区分用户（只能使用  数字 字母(包括大小写) 下划线 短横线）
     以上3个都是必填项
     */

    [QMConnect registerSDKWithAppKey:kLDQMLineAccessId userName:self.userName userId:self.userId];
}

#pragma mark - notification
- (void)registerSuccess:(NSNotification *)sender {
    NSLog(@"注册成功");
    
    if ([QMPushManager share].selectedPush) {
        [self showChatRoomViewController:@"" processType:@"" entranceId:@""]; //
    }else{

//       //  页面跳转控制
//        if (self.isPushed) {
//            return;
//        }

        [QMConnect sdkGetWebchatScheduleConfig:^(NSDictionary * _Nonnull scheduleDic) {
            dispatch_async(dispatch_get_main_queue(), ^{
                self.dictionary = scheduleDic;
                if ([self.dictionary[@"scheduleEnable"] intValue] == 1) {
                    NSLog(@"日程管理");
                    [self starSchedule];
                }else{
                    NSLog(@"技能组");
                    [self getPeers];
                }
            });
        } failBlock:^{
            [self getPeers];
        }];
    }

    [QMPushManager share].selectedPush = NO;
}

- (void)registerFailure:(NSNotification *)sender {
    NSLog(@"注册失败::%@", sender.object);
    QMLineError *err = sender.object;
    if (err.errorDesc.length > 0) {
        [QMRemind showMessage:err.errorDesc];
    }
    self.isConnecting = NO;
    [self.indicatorView stopAnimating];
}

#pragma mark - 技能组选择
- (void)getPeers {
    [QMConnect sdkGetPeers:^(NSArray * _Nonnull peerArray) {
        dispatch_async(dispatch_get_main_queue(), ^{
            NSArray *peers = peerArray;
            self.isConnecting = NO;
            [self.indicatorView stopAnimating];
            if (peers.count == 1 && peers.count != 0) {
                [self showChatRoomViewController:[peers.firstObject objectForKey:@"id"] processType:@"" entranceId:@""];
            }else {
                [self showPeersWithAlert:peers messageStr:NSLocalizedString(@"title.type", nil)];
            }
        });
    } failureBlock:^{
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.indicatorView stopAnimating];
            self.isConnecting = NO;
        });
    }];
}

#pragma mark - 日程管理
- (void)starSchedule {
    self.isConnecting = NO;
    [_indicatorView stopAnimating];
    if ([self.dictionary[@"scheduleId"] isEqual: @""] || [self.dictionary[@"processId"] isEqual: @""] || [self.dictionary objectForKey:@"entranceNode"] == nil || [self.dictionary objectForKey:@"leavemsgNodes"] == nil) {
        [QMRemind showMessage:NSLocalizedString(@"title.sorryconfigurationiswrong", nil)];
    }else{
        NSDictionary *entranceNode = self.dictionary[@"entranceNode"];
        NSArray *entrances = entranceNode[@"entrances"];
        if (entrances.count == 1 && entrances.count != 0) {
            [self showChatRoomViewController:[entrances.firstObject objectForKey:@"processTo"] processType:[entrances.firstObject objectForKey:@"processType"] entranceId:[entrances.firstObject objectForKey:@"_id"]];
        }else{
            [self showPeersWithAlert:entrances messageStr:NSLocalizedString(@"title.schedule_type", nil)];
        }
    }
}

- (void)showPeersWithAlert: (NSArray *)peers messageStr: (NSString *)message {
    
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:nil message:NSLocalizedString(@"title.type", nil) preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"button.cancel", nil) style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        self.isConnecting = NO;
    }];
    [alertController addAction:cancelAction];
    for (NSDictionary *index in peers) {
        UIAlertAction *surelAction = [UIAlertAction actionWithTitle:[index objectForKey:@"name"] style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            if ([self.dictionary[@"scheduleEnable"] integerValue] == 1) {
                [self showChatRoomViewController:[index objectForKey:@"processTo"] processType:[index objectForKey:@"processType"] entranceId:[index objectForKey:@"_id"]];
            }else{
                [self showChatRoomViewController:[index objectForKey:@"id"] processType:@"" entranceId:@""];
            }
        }];
        [alertController addAction:surelAction];
    }
    [[LDTools currentViewController] presentViewController:alertController animated:YES completion:nil];
}

#pragma mark - 跳转聊天界面
- (void)showChatRoomViewController:(NSString *)peerId processType:(NSString *)processType entranceId:(NSString *)entranceId {
    QMChatRoomViewController *chatRoomViewController = [[QMChatRoomViewController alloc] init];
    chatRoomViewController.peerId = peerId;
    chatRoomViewController.isPush = NO;
    chatRoomViewController.avaterStr = @"";
    if ([self.dictionary[@"scheduleEnable"] intValue] == 1) {
        chatRoomViewController.isOpenSchedule = true;
        chatRoomViewController.scheduleId = self.dictionary[@"scheduleId"];
        chatRoomViewController.processId = self.dictionary[@"processId"];
        chatRoomViewController.currentNodeId = peerId;
        chatRoomViewController.processType = processType;
        chatRoomViewController.entranceId = entranceId;
    }else{
        chatRoomViewController.isOpenSchedule = false;
    }
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:chatRoomViewController];
    nav.modalPresentationStyle = UIModalPresentationOverCurrentContext;
    [[LDTools currentViewController] presentViewController:nav animated:YES completion:nil];
}

@end
