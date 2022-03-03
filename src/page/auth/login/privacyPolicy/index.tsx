import {createStyleSheet} from '@src/helper/helper';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import React, {FC} from 'react';
import {ScrollView, Text} from 'react-native';

const PrivacyPolicy: FC = () => {
  useNavigationHeader({
    title: 'Privacy Policy',
  });
  return (
    <ScrollView contentContainerStyle={TextStyles.container}>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;This Privacy Policy describes how your personal information
        is collected, used, and shared when you visit or make a purchase from
        Gesleben.me (the “Site”).
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;Text Marketing and notifications: By subscribing to text
        notifications you agree to receive recurring automated marketing
        messages at the phone number provided. Consent is not a condition of
        purchase. Reply STOP to unsubscribe. HELP for help. Msg & Data rates may
        apply. More info view Privacy Policy and ToS.
      </Text>
      <Text style={TextStyles.header}>
        &nbsp;&nbsp;Personal information we collect
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;When you visit the Site, we automatically collect certain
        information about your device, including information about your web
        browser, IP address, time zone, and some of the cookies that are
        installed on your device. Additionally, as you browse the Site, we
        collect information about the individual web pages or products that you
        view, what websites or search terms referred you to the Site, and
        information about how you interact with the Site. We refer to this
        automatically-collected information as “Device Information”.
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;We collect Device Information using the following
        technologies:
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;- “Cookies” are data files that are placed on your device or
        computer and often include an anonymous unique identifier. For more
        information about cookies, and how to disable cookies, visit
        http://www.allaboutcookies.org.
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;- “Log files” track actions occurring on the Site, and
        collect data including your IP address, browser type, Internet service
        provider, referring/exit pages, and date/time stamps.
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;- “Web beacons”, “tags”, and “pixels” are electronic files
        used to record information about how you browse the Site.
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;Additionally when you make a purchase or attempt to make a
        purchase through the Site, we collect certain information from you,
        including your name, billing address, shipping address, payment
        information (including credit card numbers), email address, and phone
        number. We refer to this information as “Order Information”.
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;When we talk about “Personal Information” in this Privacy
        Policy, we are talking both about Device Information and Order
        Information.
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;By using our website, you (the visitor) agree to allow third
        parties to process your IP address, in order to determine your location
        for the purpose of currency conversion. You also agree to have that
        currency stored in a session cookie in your browser (a temporary cookie
        which gets automatically removed when you close your browser). We do
        this in order for the selected currency to remain selected and
        consistent when browsing our website so that the prices can convert to
        your (the visitor) local currency.
      </Text>
      <Text style={TextStyles.header}>
        &nbsp;&nbsp;How do we use your personal information?
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;We use the Order Information that we collect generally to
        fulfill any orders placed through the Site (including processing your
        payment information, arranging for shipping, and providing you with
        invoices and/or order confirmations). Additionally, we use this Order
        Information to:
      </Text>
      <Text style={TextStyles.text}>&nbsp;&nbsp;- Communicate with you;</Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;- Screen our orders for potential risk or fraud; and
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;- When in line with the preferences you have shared with us,
        provide you with information or advertising relating to our products or
        services.
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;We use the Device Information that we collect to help us
        screen for potential risk and fraud (in particular, your IP address),
        and more generally to improve and optimize our Site (for example, by
        generating analytics about how our customers browse and interact with
        the Site, and to assess the success of our marketing and advertising
        campaigns).
      </Text>
      <Text style={TextStyles.header}>
        &nbsp;&nbsp;Sharing you personal Information
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;We share your Personal Information with third parties to
        help us use your Personal Information, as described above. We also use
        Google Analytics to help us understand how our customers use the Site --
        you can read more about how Google uses your Personal Information here:
        https://www.google.com/intl/en/policies/privacy/. You can also opt-out
        of Google Analytics here: https://tools.google.com/dlpage/gaoptout.
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;Finally, we may also share your Personal Information to
        comply with applicable laws and regulations, to respond to a subpoena,
        search warrant or other lawful request for information we receive, or to
        otherwise protect our rights.
      </Text>
      <Text style={TextStyles.header}>&nbsp;&nbsp;Do not track</Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;Please note that we do not alter our Site’s data collection
        and use practices when we see a Do Not Track signal from your browser.
      </Text>
      <Text style={TextStyles.header}>&nbsp;&nbsp;Your rights</Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;If you are a European resident, you have the right to access
        personal information we hold about you and to ask that your personal
        information be corrected, updated, or deleted. If you would like to
        exercise this right, please contact us through the contact information
        below.
      </Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;Additionally, if you are a European resident we note that we
        are processing your information in order to fulfill contracts we might
        have with you (for example if you make an order through the Site), or
        otherwise to pursue our legitimate business interests listed above.
        Additionally, please note that your information will be transferred
        outside of Europe, including to Canada and the United States.
      </Text>
      <Text style={TextStyles.header}>&nbsp;&nbsp;Data retention</Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;When you place an order through the Site, we will maintain
        your Order Information for our records unless and until you ask us to
        delete this information.
      </Text>
      <Text style={TextStyles.header}>&nbsp;&nbsp;Changes</Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;We may update this privacy policy from time to time in order
        to reflect, for example, changes to our practices or for other
        operational, legal or regulatory reasons.
      </Text>
      <Text style={TextStyles.header}>&nbsp;&nbsp;Minors</Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;The Site is not intended for individuals under the age of
        14.
      </Text>
      <Text style={TextStyles.header}>&nbsp;&nbsp;Contact us</Text>
      <Text style={TextStyles.text}>
        &nbsp;&nbsp;For more information about our privacy practices, if you
        have questions, or if you would like to make a complaint, please contact
        us by e mail at Geslebenservice@gmail.com
      </Text>
    </ScrollView>
  );
};

const TextStyles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: 10,
  },
  header: {
    fontSize: 14,
    color: 'black',
    fontWeight: '700',
    lineHeight: 18,
    marginVertical: 5,
  },
  text: {
    fontSize: 14,
    color: 'black',
    lineHeight: 20,
  },
});

export default PrivacyPolicy;
