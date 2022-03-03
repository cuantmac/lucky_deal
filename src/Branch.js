//import branch, {BranchEvent} from 'react-native-branch';
import branch, {BranchEvent} from 'react-native-branch';
export default {
  async reportBranchEvent(name, customData) {
    // only canonicalIdentifier is required
    // let buo = await branch.createBranchUniversalObject('luckydealIdentifier', {
    //   locallyIndex: true,
    //   title: 'Lucky Deal',
    //   contentDescription: 'Lucky Deal branch',
    // });
    // if (customData) {
    //   // Log a standard event with parameters
    //   new BranchEvent(name, buo, {
    //     customData: customData,
    //   }).logEvent();
    // } else {
    //   new BranchEvent(name, buo).logEvent();
    // }
  },

  uploadUserId(userId) {
    branch.setIdentity(userId);
  },
};
