//
//  LDPaypalWebViewController.m
//  LuckyDeal
//
//  Created by sjf on 2021/4/29.
//

#import "LDPaypalWebViewController.h"
#import <WebKit/WebKit.h>
#import "ReactInteraction.h"

@interface LDPaypalWebViewController () <WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler>

@property (nonatomic, strong) WKWebView *webView;

@property (nonatomic, strong) UIButton *backButton;

@end

@implementation LDPaypalWebViewController

- (instancetype)init {
    if (self = [super init]) {
        self.providesPresentationContextTransitionStyle = YES;
        self.definesPresentationContext = YES;
        self.modalPresentationStyle = UIModalPresentationOverCurrentContext;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor whiteColor];
    [self.view addSubview:self.backButton];
    [self.view addSubview:self.webView];
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:self.url]]];
}


- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];
    
    if(_webView) {
        CGRect frame = self.view.bounds;
        frame.origin.y = self.backButton.frame.origin.y+self.backButton.frame.size.height;
        frame.size.height = frame.size.height - frame.origin.y;
        _webView.frame = frame;
    }
}

#pragma mark - WKNavigationDelegate/WKUIDelegate

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSLog(@"%@", navigationAction.request.URL.absoluteString);
    if ([navigationAction.request.URL.absoluteString hasPrefix:@"luckydeal://share"]) {
        [[ReactInteraction shareInstance] paypalBackAction];
        [self dismissViewControllerAnimated:YES completion:nil];
        decisionHandler(WKNavigationActionPolicyCancel);
    } else {
        decisionHandler(WKNavigationActionPolicyAllow);
    }
}

//开始加载
- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation {
    
}

//加载失败
- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error {

}

//内容开始返回
- (void)webView:(WKWebView *)webView didCommitNavigation:(WKNavigation *)navigation {
    
}

//页面加载完成
- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
//    self.progressView.hidden = YES;
    if (self.addressInfo) {
        NSString *state = self.addressInfo[@"state"];
        if (state.length > 1) {
            NSString *firstSubString = [state substringWithRange:NSMakeRange(0, 1)].uppercaseString;
            NSString *secondSubString = [state substringWithRange:NSMakeRange(1, 1)];
            state = [NSString stringWithFormat:@"%@%@", firstSubString, secondSubString];
        }
        NSString *lineOne = self.addressInfo[@"address_line_one"];
        NSString *lineTwo = self.addressInfo[@"address_line_two"];
        NSString *zip = self.addressInfo[@"zip"];
        NSString *phone = self.addressInfo[@"phone_number"];
        NSString *city = self.addressInfo[@"city"];
        
        NSString *javascript = [NSString stringWithFormat:@"function fill_address() {"
            @"function getElementById(str) {"
                @"return new Promise(function(resolve) {"
                    @"var ele;"
                    @"var timer = setInterval(function() {"
                    @"ele = document.getElementById(str);"
                    @"console.log('retry');"
                        @"if(ele) {"
                            @"resolve(ele);"
                            @"clearInterval(timer);"
                        @"}"
                    @"}, 1000);"
                @"});"
            @"}"
            @"function triggerOnChange(ele) {"
                @"ele.addEventListener('input', function(){}, false);"
                @"var event = new InputEvent('input');"
                @"ele.dispatchEvent(event);"
            @"}"
            @"function triggerSelectChange(ele) {"
                @"var event = new Event('change');"
                @"ele.dispatchEvent(event);"
            @"}"
            @"getElementById('billingLine1').then(function() {"
                @"var line1 = document.getElementById('billingLine1');"
                @"if (line1) { line1.value='%@'; triggerOnChange(line1);}"
                @"var line2 = document.getElementById('billingLine2');"
                @"if (line2) { line2.value='%@'; triggerOnChange(line2);}"
                @"var city = document.getElementById('billingCity');]"
                @"if (city) { city.value='%@'; triggerOnChange(city);}"
                @"var selState = document.getElementById('billingState');"
                @"if (selState) {"
                @"for (i=0;i<selState.options.length; i++) {"
                    @"if (selState.options[i].label == '%@') {"
                        @"selState.selectedIndex = i;triggerSelectChange(selState); break;"
                    @"}"
                @"}}"
                @"var postCode = document.getElementById('billingPostalCode');"
                @"if (postCode) { postCode.value='%@'; triggerOnChange(postCode);}"
                @"var phone = document.getElementById('telephone');"
                @"if (phone) { phone.value='%@'; triggerOnChange(phone);}"
            @"});"
        @"}()", lineOne, lineTwo, city, state, zip, phone];
        
        [self.webView evaluateJavaScript:javascript completionHandler:nil];
    }
}

//提交发生错误
- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    
}

//
- (void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(WKNavigation *)navigation {
    
}

- (void)backButtonClicked:(id)sender {
    [[ReactInteraction shareInstance] paypalBackAction];
    [self dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark - lazy load
- (WKWebView *)webView {
    if (!_webView) {
        WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
        configuration.processPool = [WKProcessPool.alloc init];
        configuration.allowsInlineMediaPlayback = YES;
        
        _webView = [[WKWebView alloc] initWithFrame:[UIScreen mainScreen].bounds configuration:configuration];
        _webView.allowsBackForwardNavigationGestures = YES;
        _webView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        _webView.navigationDelegate = self;
        _webView.UIDelegate = self;
    }
    return _webView;
}

- (UIButton *)backButton {
    if (!_backButton) {
        _backButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _backButton.exclusiveTouch = YES;
        _backButton.frame = CGRectMake(0, [[UIApplication sharedApplication] statusBarFrame].size.height, 44, 44);
        [_backButton setImage:[UIImage imageNamed:@"ld_back_button"] forState:UIControlStateNormal];
        
        [_backButton addTarget:self action:@selector(backButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backButton;
}

@end
