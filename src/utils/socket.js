import io from 'socket.io-client';
import {WS_URL} from '../constants/constants';
import AppModule from '../../AppModule';

function SocketConfig() {
  // this.socket = io(WS_URL, {
  //   autoConnect: true,
  //   path: '/socket.io/',
  //   transports: ['websocket'],
  // });

  // let onevent = this.socket.onevent;
  // this.socket.onevent = function(packet) {
  //   console.log('onevent', packet);
  //   onevent.call(this, packet);
  // };

  // this.socket.on('connection', () => {
  //   console.log('socket connection');
  // });

  // this.socket.on('connect', () => {
  //   console.log('socket connect');
  // });

  // this.socket.on('reconnect', () => {
  //   console.log('socket reconnect');
  // });

  // this.socket.on('disconnect', () => {
  //   console.log('socket disconnect');
  // });

  // this.socket.on('businessError', (error) => {
  //   console.log('businessError', error);
  //   this.onError(error);
  // });

  // this.socket.on('error', (error) => {
  //   console.log('socket error', error);
  //   this.onError(error);
  // });

  this.auctionListStatusRes = function (res) {};
  this.auctionDetailRes = function (res) {};
  this.auctionDetailStatusRes = function (res) {};
  this.winnerListRes = function (res) {};
  this.auctionBidRes = function (res) {};
  this.appointmentRes = function (res) {};
  this.specialAuctionWinnerRes = function (res) {};

  this.onError = function (error) {};

  // this.socket.on('AuctionListStatusResponse', (r) => {
  //   this.auctionListStatusRes(r);
  // });
  // this.socket.on('AuctionDetailResponse', (res) => {
  //   this.auctionDetailRes(res);
  // });

  // this.socket.on('AuctionDetailStatusResponse', (r) => {
  //   this.auctionDetailStatusRes(r);
  // });
  // this.socket.on('WinnerListResponse', (r) => {
  //   this.winnerListRes(r);
  // });
  // this.socket.on('AuctionBidResponse', (r) => {
  //   this.auctionBidRes(r);
  // });
  // this.socket.on('AppointmentResponse', (r) => {
  //   this.appointmentRes(r);
  // });
  // this.socket.on('SpecialAuctionWinnerResponse', (r) => {
  //   this.specialAuctionWinnerRes(r);
  // });

  this.connect = function () {
    // if (!this.socket.connected && !this.socket.connecting) {
    //   this.socket.connect();
    // }
  };

  //竞拍列表状态更新，每秒调用
  this.auctionListStatus = function (token, list, callback) {
    // this.auctionListStatusRes = callback;
    // this.socket.emit('AuctionListStatus', {
    //   token: token,
    //   list: list,
    // });
  };
  //竞拍详情
  this.auctionDetail = function (token, auctionId, callback) {
    // this.auctionDetailRes = callback;
    // this.socket.emit('AuctionDetail', {
    //   token: token,
    //   auction_id: auctionId,
    // });
  };
  //竞拍详情状态，每秒调用
  this.auctionDetailStatus = function (token, auctionId, dealPrice, callback) {
    // this.auctionDetailStatusRes = callback;
    // this.socket.emit('AuctionDetailStatus', {
    //   token: token,
    //   auction_id: auctionId,
    //   deal_price: dealPrice,
    // });
  };
  //未使用
  this.winnerList = function (productId, page, callback) {
    // this.winnerListRes = callback;
    // this.socket.emit('/winner/list', {
    //   product_id: productId,
    //   page: page,
    // });
  };
  //竞拍
  this.auctionBid = function (token, auctionId, add_price, callback) {
    // this.auctionBidRes = callback;
    // this.socket.emit('AuctionBid', {
    //   token: token,
    //   auction_id: auctionId,
    //   add_price: add_price,
    //   version: AppModule.versionCode,
    // });
  };
  //预约竞拍
  this.appointment = function (token, auctionId, callback) {
    // this.appointmentRes = callback;
    // this.socket.emit('Appointment', {
    //   token: token,
    //   auction_id: auctionId,
    // });
  };
  //预约竞拍状态查询
  this.specialAuctionWinner = function (token, callback) {
    // this.specialAuctionWinnerRes = callback;
    // this.socket.emit('SpecialAuctionWinner', {
    //   token: token,
    // });
  };
}

export default new SocketConfig();
