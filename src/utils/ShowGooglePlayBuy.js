// import InAppBilling from 'react-native-billing';
// import Api from '../Api';
// import Utils from './Utils';

// export async function ShowGooglePlayBuy(productId, chargeType) {
//   async function _onSubscribeFinish(
//     purchaseToken,
//     orderId,
//     productId,
//     chargeType,
//   ) {
//     try {
//       let res = await Api.googlePay({
//         token: purchaseToken,
//         order_id: orderId,
//         product_id: productId,
//         charge_type: chargeType,
//       });

//       if (res && res.data && res.data.success && res.data.success === 1) {
//         Utils.toastFun('The purchase succeeded!');
//         return true;
//       } else {
//         Utils.toastFun('Your payment failed!');
//         return false;
//       }
//     } catch (e) {
//       console.log(e);
//       return false;
//     }
//   }

//   async function _subscribeThroughPlayStore(productId, chargeType) {
//     await InAppBilling.close();
//     try {
//       await InAppBilling.open();
//       try {
//         //首先要消耗这个商品
//         await InAppBilling.consumePurchase(productId);
//       } catch (e) {
//         console.log(e);
//       }
//       if (!(await InAppBilling.isPurchased(productId))) {
//         const details = await InAppBilling.purchase(productId);
//         //purchased and need to send purchase token to server
//         if (details.purchaseState === 'PurchasedSuccessfully') {
//           let result = await _onSubscribeFinish(
//             details.purchaseToken,
//             details.orderId,
//             productId,
//             chargeType,
//           );

//           return result;
//         }
//       }
//     } catch (err) {
//       console.log(err);
//       Utils.toastFun('Your payment failed!');
//       return false;
//     } finally {
//       try {
//         await InAppBilling.consumePurchase(productId);
//       } catch (e) {
//         console.log(e);
//       }

//       await InAppBilling.close();
//     }
//   }

//   return new Promise((resolve, reject) => {
//     _subscribeThroughPlayStore(productId, chargeType)
//       .then((result) => {
//         if (result) {
//           resolve(true);
//         } else {
//           resolve(false);
//         }
//       })
//       .catch((error) => reject(error));
//   });
// }

// export default async function () {}
