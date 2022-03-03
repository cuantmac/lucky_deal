import {createStyleSheet} from '@src/helper/helper';
import {PrivacyPolicyRoute, TermsOfServiceRoute} from '@src/routes';
import React, {FC, useCallback} from 'react';
import {Text, View, StyleProp, ViewStyle} from 'react-native';

export const LoginFooter: FC = () => {
  const TermsOfServiceRouter = TermsOfServiceRoute.useRouteLink();
  const PrivacyPolicyRouter = PrivacyPolicyRoute.useRouteLink();
  const handleServicePress = useCallback(() => {
    TermsOfServiceRouter.navigate();
  }, [TermsOfServiceRouter]);

  const handlePolicyPress = useCallback(() => {
    PrivacyPolicyRouter.navigate();
  }, [PrivacyPolicyRouter]);

  return (
    <Text style={LoginFooterStyles.text}>
      By access out service,you are agree with the{' '}
      <Text style={LoginFooterStyles.linkText} onPress={handleServicePress}>
        Terms of Service
      </Text>{' '}
      and{' '}
      <Text style={LoginFooterStyles.linkText} onPress={handlePolicyPress}>
        Privacy Policy
      </Text>
    </Text>
  );
};

const LoginFooterStyles = createStyleSheet({
  text: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 17,
  },
  linkText: {
    color: '#222',
  },
});

interface LoginBottomContainerProps {
  style?: StyleProp<ViewStyle>;
}

export const LoginBottomContainer: FC<LoginBottomContainerProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[LoginBottomContainerStyles.container, style]}>
      {children}
    </View>
  );
};

const LoginBottomContainerStyles = createStyleSheet({
  container: {
    justifyContent: 'flex-end',
    paddingBottom: 30,
    flex: 1,
    overflow: 'hidden',
  },
});
