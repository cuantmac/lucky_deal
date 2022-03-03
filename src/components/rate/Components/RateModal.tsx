import React, {Component} from 'react';
import {Linking, Modal, Platform, Text, View} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';

import {RateModalStyles} from '../Assets/Styles/RateModal';
import {Button} from './Button';
import {TextBox} from './TextBox';
import {ModalContainer} from '../../../components/common/ModalContainer';
import {IProps, IState} from '../Interfaces/IRateModal';

export class RateModal extends Component<IProps, IState> {
  public static defaultProps = {
    modalTitle: 'How many stars do you give to this app?',
    cancelBtnText: 'Cancel',
    totalStarCount: 5,
    defaultStars: 0,
    emptyCommentErrorMessage: 'Please specify your opinion.',
    isVisible: true,
    isModalOpen: false,
    commentPlaceholderText: 'You can type your comments here ...',
    rateBtnText: 'Rate',
    sendBtnText: 'Send',
    storeRedirectThreshold: 3,
    starLabels: ['Terrible', 'Bad', 'Okay', 'Good', 'Great'],
    isTransparent: true,
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      isModalOpen: props.isModalOpen,
      rating: 0,
      review: '',
      reviewError: false,
      showContactForm: false,
    };
  }

  componentDidUpdate(prevProps: Readonly<IProps>) {
    if (this.props.isModalOpen !== prevProps.isModalOpen) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({isModalOpen: this.props.isModalOpen});
    }
  }

  public render(): JSX.Element {
    const {onClosed} = this.props;
    const {isModalOpen} = this.state;
    return (
      <ModalContainer visible={isModalOpen} onRequestClose={() => onClosed}>
        {this.renderRateModal()}
      </ModalContainer>
    );
  }

  private onStarSelected(e: number): void {
    const {onStarSelected} = this.props;
    if (onStarSelected) {
      onStarSelected(e);
    }
    this.setState({rating: e});
  }

  private renderRateModal(): JSX.Element {
    const {modalContainer, modalWrapper} = RateModalStyles;
    const {style} = this.props;

    return (
      <View style={[modalWrapper, style]}>
        <View style={modalContainer}>
          {!this.state.showContactForm && this.renderRatingView()}
          {this.state.showContactForm && this.renderContactFormView()}
        </View>
      </View>
    );
  }

  private renderRatingView(): JSX.Element {
    const {
      title,
      buttonContainer,
      button,
      buttonCancel,
      buttonCancelText,
    } = RateModalStyles;
    const {
      starLabels,
      isVisible,
      cancelBtnText,
      totalStarCount,
      defaultStars,
      rateBtnText,
      modalTitle,
    } = this.props;

    return (
      <React.Fragment>
        <Text style={title}>{modalTitle}</Text>
        <AirbnbRating
          count={totalStarCount}
          defaultRating={defaultStars}
          showRating={isVisible}
          reviews={starLabels}
          onFinishRating={(e: number) => this.onStarSelected(e)}
        />

        <View style={buttonContainer}>
          <View style={{flex: 1}} />
          <Button
            text={cancelBtnText}
            containerStyle={[button, buttonCancel]}
            textStyle={buttonCancelText}
            onPress={this.onClosed.bind(this)}
          />
          <Button
            text={rateBtnText}
            containerStyle={button}
            onPress={this.sendRate.bind(this)}
          />
        </View>
      </React.Fragment>
    );
  }

  private renderContactFormView(): JSX.Element {
    const {
      buttonContainer,
      button,
      buttonCancel,
      buttonCancelText,
    } = RateModalStyles;
    const {commentPlaceholderText, sendBtnText, cancelBtnText} = this.props;

    return (
      <React.Fragment>
        <TextBox
          containerStyle={[RateModalStyles.textBox]}
          textStyle={{paddingVertical: 5}}
          value={this.state.review}
          placeholder={commentPlaceholderText}
          multiline
          autoFocus
          onChangeText={(value: string) =>
            this.setState({review: value, reviewError: false})
          }
        />
        <View>{this.state.reviewError && this.renderReviewError()}</View>
        <View style={buttonContainer}>
          <View style={{flex: 1}} />
          <Button
            text={cancelBtnText}
            containerStyle={[button, buttonCancel]}
            textStyle={buttonCancelText}
            onPress={this.onClosedContactForm.bind(this)}
          />
          <Button
            text={sendBtnText}
            containerStyle={button}
            onPress={this.sendContactUsForm.bind(this)}
          />
        </View>
      </React.Fragment>
    );
  }

  private renderReviewError(): JSX.Element {
    const {errorText} = RateModalStyles;
    const {emptyCommentErrorMessage} = this.props;

    return <Text style={errorText}>{emptyCommentErrorMessage}</Text>;
  }

  private onClosed(): void {
    const {onClosed} = this.props;
    if (onClosed) {
      onClosed();
    } else {
      this.setState({isModalOpen: false});
    }
  }

  private onClosedContactForm(): void {
    this.setState({showContactForm: false});
    this.onClosed();
  }

  private sendRate(): void {
    const {
      storeRedirectThreshold,
      playStoreUrl,
      iTunesStoreUrl,
      onSendReview,
    } = this.props;
    if (this.state.rating <= 0) {
      return;
    }
    if (this.state.rating > storeRedirectThreshold) {
      Platform.OS === 'ios'
        ? Linking.openURL(iTunesStoreUrl || '')
        : Linking.openURL(playStoreUrl || '');
      this.setState({isModalOpen: false});
      onSendReview();
    } else {
      this.setState({showContactForm: true});
    }
  }

  private sendContactUsForm(): void {
    const {sendContactUsForm} = this.props;
    if (this.state.review.length > 0) {
      if (sendContactUsForm && typeof sendContactUsForm === 'function') {
        this.setState({showContactForm: false});
        return sendContactUsForm({...this.state});
      }
      throw new Error('You should generate sendContactUsForm function');
    } else {
      this.setState({reviewError: true});
    }
  }
}