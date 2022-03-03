// import Api from '../Api';
// import Utils from './Utils';
// import { Linking } from 'react-native';
// import { PACKAGE_NAME } from '../constants/constants';
// import { store } from '../redux';
// import { updateProfile } from '../redux/persistThunkReduces';

// export async function GoogleSubscription(productId) {
//   async function _onSubscribeFinish(purchaseToken, orderId) {
//     try {
//       let res = await Api.googleSubscribe(productId, purchaseToken, orderId);
//       if (res && res.data && res.data.success && res.data.success === 1) {
//         await store.dispatch(updateProfile());
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

//   async function _subscribeThroughPlayStore() {
//     await InAppBilling.close();
//     try {
//       await InAppBilling.open();
//       await InAppBilling.loadOwnedPurchasesFromGoogle();
//       const details = await InAppBilling.subscribe(productId);
//       //purchased and need to send purchase token to server
//       if (details.purchaseState === 'PurchasedSuccessfully') {
//         return await _onSubscribeFinish(
//           details.purchaseToken,
//           details.orderId,
//           productId,
//         );
//       }
//     } catch (err) {
//       console.log(err);
//       Utils.toastFun('Your payment failed!');
//       return false;
//     } finally {
//       await InAppBilling.close();
//     }
//   }

//   return new Promise((resolve, reject) => {
//     _subscribeThroughPlayStore()
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

// export async function CheckSubscription(productIds) {
//   try {
//     await InAppBilling.open();
//     await InAppBilling.loadOwnedPurchasesFromGoogle();
//     for (let i = 0; i < productIds.length; i++) {
//       const productId = productIds[i];
//       const isSubscribed = await InAppBilling.isSubscribed(productId);
//       console.log('check sub', productId, isSubscribed);
//       if (isSubscribed) {
//         const detail = await InAppBilling.getSubscriptionTransactionDetails(
//           productId,
//         );
//         Api.googleSubNotify(
//           productId,
//           detail.purchaseToken,
//           detail.orderId,
//         ).catch(console.log);
//         return;
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   } finally {
//     await InAppBilling.close();
//   }
// }

// export async function needShowRestore(productId) {
//   try {
//     await InAppBilling.open();
//     await InAppBilling.loadOwnedPurchasesFromGoogle();
//     const isSubscribed = await InAppBilling.isSubscribed(productId);
//     if (isSubscribed) {
//       return false;
//     }
//     const detail = await InAppBilling.getSubscriptionTransactionDetails(
//       productId,
//     );
//     return !detail.autoRenewing;
//   } catch (err) {
//     console.log(err);
//   } finally {
//     await InAppBilling.close();
//   }
// }

// export function restore(productId) {
//   Linking.openURL(
//     `https://play.google.com/store/account/subscriptions?sku=${productId}&package=${PACKAGE_NAME}`,
//   ).catch(console.log);
// }
