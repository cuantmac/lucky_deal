import {Dimensions, Platform, StatusBar} from 'react-native';
import {DEV_MODE} from '../helper/nativeBridge';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
export const SCREEN_WIDTH = screenWidth;
export const SCREEN_HEIGHT = screenHeight;
export const px = screenWidth / 1080;
export const AUCTION_TAB_HEIGHT = 80;
export const StatusBarHeight = StatusBar.currentHeight || 0;
// Platform.OS === 'android' ? StatusBar.currentHeight : 66;
export const PACKAGE_NAME = 'com.luckydeal';
export const APP_ID = '1531277195';

// export let gobal = {};
export const SERVER_URL =
  process.env.REACT_APP_BASE_URL ||
  (DEV_MODE ? 'https://test-api.luckydeal.vip' : 'https://api.luckydeal.vip');
//'https://tx-api.luckydeal.vip';
// export const SERVER_URL = '58.247.129.10:9001';
export const WS_URL = DEV_MODE
  ? 'ws://api.test.luckynow.me:9002'
  : 'wss://api-ws.luckydeal.vip';

export const STRIPE_PUBLISHERKEY = DEV_MODE
  ? 'pk_test_51HmEiyFHbSIlGJ0auQwa6soN0FNwS02AQkg1q5rIjV1XRaOhs9OV5Qe7dUeGWuN1enr5XxPojWGjFgwYdtRpRpPf00WpE7XUK8'
  : 'pk_live_51HmEiyFHbSIlGJ0aDn4JrgsMmZY9qYA5NKrJ3RHafZxMHttYFuaKF2Zcq5XGXY4b27xqZt3mVRQd5QJI9nHvkVes00evCarUGd';

export const EMAIL = 'service@luckydeal.vip';

export const HELP = 'https://www.luckydeal.vip/luckydeal-help.html';

export const TERM_OF_SERVICE = 'https://www.luckydeal.vip/term-of-service.html';

export const PRIVACY = 'https://www.luckydeal.vip/privacy-policy.html';

export const INVITE_RULES = `·The more you invite the more bids you get.
·Rewards distribution: invitation bids are awarded when your friends in the auction.
·The auction must pay a certain amount.
·Every time you invite a friend, you will get 50 bids.
`;

export const SELL_OUT_RULES = `About The Sell Out Function

1. The Sold Out function means that the successful bidding products can be sold through the Lucky Deal platform at a certain proportion of the saved price of the goods (The proportion is generally 75%);
2. You only need a few minutes to sell the product successfully. The price of the sold product is related to the attribute of the product and the time of sale. The price may exist in change;
3. After the sale is successful, the product payment will be sent to your PayPal account within 3-5 working days. You may have to pay a little PayPal handling fee by receiving the payment;
4. Choosing to sell goods means that you will give up buying the goods you bid on. And you will no longer be able to buy the goods at a low price;
5. The final interpretation of this function belongs to Lucky Deal.
`;
export const SUPER_BOX_RULES = `
1. Turn the wheel and draw your own lucky number
2. You only need a few minutes to sell the product successfully. The price of the sold product is related to the attribute of the product and the time of sale. The price may exist in change;
3. After the sale is successful, the product payment will be sent to your PayPal account within 3-5 working days. You may have to pay a little PayPal handling fee by receiving the payment;
4. Choosing to sell goods means that you will give up buying the goods you bid on. And you will no longer be able to buy the goods at a low price;
5. The final interpretation of this function belongs to Lucky Deal.
`;

export const GOOGLE_WEB_CLIENT_ID =
  '159269991422-tl5lno00hrmp55gccsadgbl9u4ldk2nb.apps.googleusercontent.com';

export const FB_DL = Platform.select({
  android: 'fb://page/114160796984633',
  ios: 'fb://page/?id=114160796984633',
});
export const FB_URL = 'https://www.facebook.com/Shopping-Time-114160796984633';

export const YOUTUBE_DL = Platform.select({
  android: 'vnd.youtube.com/channel/UCYuV2QxSzDThoxCkNflX_3g',
  ios: 'youtube://www.youtube.com/channel/UCYuV2QxSzDThoxCkNflX_3g',
});
export const YOUTUBE =
  'https://www.youtube.com/channel/UCYuV2QxSzDThoxCkNflX_3g';
export const INS = 'http://instagram.com/OfficialLuckyDeal';
export const SNAPCHAT = 'https://www.snapchat.com/add/lucky_deal';

export const OUT_DELIVERY_ADDRESS = [
  'ALASKA',
  'AK',
  'HAWAII',
  'HI',
  'PUERTO RICO',
  'PR',
  'GUAM',
  'GU',
  'VIRGIN ISLANDS',
  'VI',
  'NORTHERN MARIANA ISLANDS',
  'MP',
];
export const FIRST_DEAL_COUPON = 2;
export const MEMBER_SHIP_RIGHT_OPEN = [
  'Free shipping （Save up to $80 shipping fee)',
  'Members of the zone to buy goods at will',
  'Members can buy certain products at a lower price',
];
export const PAYPAL_DATA = {
  clientId:
    'AdeogR1Nx0ZcNuhtW6BS2EsXHQUaBqB8oSmUDCnQnbpi8Zewhy5dJUBu_rhBgaOXPvkx4QcNiedbp5uw',
  sandboxAccount: 'sb-3dpvk3335972@personal.example.com',
  secret:
    'EGYA3ajyPMWMWzb42NrG1jpOpmN1nlmXNHxYgetE8de239GuvIOifvsHrCIiVpWHMUC2u9n0ozF7wvbX',
};

export const PATH_HOME = 'HomePage';
export const PATH_MYSTERY = 'MysteryArea';
export const PATH_MYSTERYBOX = 'MysteryBox';
export const PATH_PURCHASE = 'OneDollarArea';
export const PATH_AUCTION = 'AuctionArea';
export const PATH_DEEPLINK = 'Deeplink';

export const FROM_HOME = '0';
export const FROM_MYSTERY = '1';
export const FROM_OFFERS = '2';
export const FROM_ONE_DOLLAR = '3';
export const FROM_OTHER = 4;
export const FROM_SUPER_BOX = 10;
export const FROM_ADD_ITEMS = 11;
export const FROM_CART = 12;
export const FROM_VIP = '5';
export const FROM_SEARCH = '6';
export const FROM_FLASH_DEALS = '7';
export const HTML_TEST =
  '<p>Product Details: &middot; Product:2pcs/Pair</p><p>Cosplay Anime Eyes Lenses NARUTO Sharingan Contact Lenses for eyes Uchiha Sasuke Hatake Kakashi Colored Lenses for Eye</p><p>Water content: 40%&nbsp;</p><p>Life Span:Yearly Disposable Contacts</p><p>Center thickness: 0.06mm&nbsp;</p><p>Base curve: 8.6mm&nbsp;</p><p>Diameter: 14.5mm​&nbsp;</p><p>Lens material: HEMA&nbsp;</p><p>Lenses color:Black,White,Red,Yellow,Hexagram,Three magatama,Sharingan&nbsp;</p><p>Lenses hardness: Soft&nbsp;</p><p>Package included:1pair Color contact lenses((With case)&nbsp;</p><p>The lenses only for eye color, not optical lenses, you can\'t choose power</p><p><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9abe01665.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9abf6e914.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9ac0cdc2b.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9ac2b3430.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9ac42cd78.jpg" /> <img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9ac596ac6.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9ac70839d.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9ac85c545.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9ac9ccaa3.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9acb3ea0f.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9acc9cbb3.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9ace2dc2a.jpg" /><img class="detail-desc-decorate-image" src="https://static.luckydeal.vip/product_sync_desc/5fab989dd3352/5fab9ad03f210.jpg" /></p>';
export const PAY_HTML = `<!DOCTYPE html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Ensures optimal rendering on mobile devices. -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- Optimal Internet Explorer compatibility -->
    <script src="https://www.paypal.com/sdk/js?client-id=AdeogR1Nx0ZcNuhtW6BS2EsXHQUaBqB8oSmUDCnQnbpi8Zewhy5dJUBu_rhBgaOXPvkx4QcNiedbp5uw&currency=EUR"></script>
</head>

<body>
    <div id="paypal-button-container"></div>

    <script>
        let purchase_units_amount = {
            currency_code: "EUR",
            value: "8.00",
            breakdown: {
                item_total: {
                    value: "10.00",
                    currency_code: "EUR"
                },
                discount: {
                    value: "2.00",
                    currency_code: "EUR"
                },
            }
        }

        let purchase_units_item_list = [{
            name: "NeoPhone",
            sku: "sku03",
            unit_amount: {
                value: "5.00",
                currency_code: "EUR"
            },
            quantity: "1"
        }, {
            name: "Fitness Watch",
            sku: "sku04",
            unit_amount: {
                value: "5.00",
                currency_code: "EUR"
            },
            quantity: "1"
        }]

        let purchase_units_shipping_address = {
            "address_line_1": "123 Townsend St",
            "address_line_2": "Floor 6",
            "admin_area_2": "San Francisco",
            "admin_area_1": "CA",
            "postal_code": "94107",
            "country_code": "US"
        };

        paypal.Buttons({
            // 配置付款按钮 https://developer.paypal.com/docs/checkout/integration-features/customize-button/
            style: {
                layout: 'vertical', // 布局方式：vertical: 垂直，horizontal：水平，
                color: 'gold',
                shape: 'rect',
                label: 'paypal'
            },
            //返回顾客在paypal上选择的地址，具体用法参考 https://developer.paypal.com/docs/checkout/integration-features/shipping-callback/
            onShippingChange: (data, actions) => {
                console.log("onShippingChange", data, actions);
            },
            // 按钮第一次呈现时调用
            onInit: () => {
                console.log("onInit");
            },
            // 点击付款按钮时调用 通常用于表单验证
            onClick: () => {
                console.log("onClick");
                return true;
            },
            createOrder: (data, actions) => {
                // 参考链接：https://developer.paypal.com/docs/api/orders/v2/#orders_patch
                return actions.order.create({
                    purchase_units: [{
                        amount: purchase_units_amount,
                        shipping: {
                            address: purchase_units_shipping_address
                        },
                        items: purchase_units_item_list
                    }],
                    application_context: {
                        brand_name: "LilySilk",
                        shipping_preference: "SET_PROVIDED_ADDRESS", // GET_FROM_FILE / NO_SHIPPING / SET_PROVIDED_ADDRESS
                        user_action: "PAY_NOW"
                    }
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    console.log("capture", details);
                });
            },
            onCancel: (data) => {
                console.log("onCancel", data);
            },
            onError: (err) => {
                // 参考资料：https://developer.paypal.com/docs/api/orders/v2/#orders_patch
                console.log("onError", err);
            }
        }).render('#paypal-button-container');
    </script>
</body>`;

//黑五活动开关
export const blackFridayOpen = true;

// 分类类型常量
export const CATEGORY_TYPE = {
  VIP_PRODUCT_CATEGORY_ID: 'vip_product_category_id',
};

// 首页优惠券间隔N次弹框
export const HOME_COUPON_DIALOG_TIME = 3;

// 运费免费额度
export const FREE_SHOPPING_AMOUNT = 3900;
//税费免费额度
export const FREE_TAX_AMOUNT = 2900;

export const HELP_CUSTOMER =
  'https://ykf-webchat.7moor.com/wapchat.html?accessId=e8615500-7bfc-11eb-b431-334660e48435&fromUrl=http://www.luckydeal.vip&urlTitle=LuckyDeal&language=EN';
