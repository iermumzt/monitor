// var callServer = require("../lib/callserver").callServer;
// //var config = require("../config");
// var ss = "d78d65f3d334fa3d78d86af733b9d026";
// //var lx="b553d4438ba7bdaea68059231e1d1d70";
// var getlistcoupon = function(_params, req) {
//   return callServer("camera_my_tickets", {
//     ____url: "http://123.57.4.235:8084/v2/store/listcoupon",
//     access_token: ss,
//   }, req);

// };
// var getlistpaycard = function(_params, req) {
//   return callServer("camera_my_cards", {
//     ____url: "http://123.57.4.235:8084/v2/store/listpaycard",
//     access_token: ss,
//     //deviceid: _params.deviceid
//   }, req);

// };
// var getpaycard_record = function(_params, req) {
//   return callServer("camera_my_cardhistory", {
//     ____url: "http://123.57.4.235:8084/v2/store/paycard_record",
//     access_token: ss,
//   }, req);
// };
// var getcoupon_record = function(_params, req) {
//   return callServer("camera_my_tickethistory", {
//     ____url: "http://123.57.4.235:8084/v2/store/coupon_record",
//     access_token: ss,
//   }, req);

// };
// var getlistorder = function(_params, req) {
//   return callServer("personal_orders", {
//     ____url: "http://123.57.4.235:8084/v2/store/listorder",
//     access_token: ss,
//   }, req);

// };
// var getyunlist = function(_params, req) {
//   return callServer("camera_yunlist", {
//     ____url: "http://123.57.4.235:8084/v2/store/cvrplan",
//     access_token: ss,
//   }, req);

// };
// var getmyorder = function(_params, req) {

//   return callServer("personal_myorder", {
//     ____url: "http://123.57.4.235:8084/v2/store/orderinfo",
//     access_token: ss,
//     ordersn: _params.ordersn
//   }, req);
// };
// var getcreateorder = function(_params, req) {
//   return callServer("camera_creat_order", {
//     ____url: "http://123.57.4.235:8084/v2/store/createorder",
//     access_token: ss,
//     item: _params.item
//   }, req);

// };
// var postconfirmorder = function(_params, req) {
//   return callServer("personal_recordpay", {
//     ____url: "http://123.57.4.235:8084/v2/store/confirmorder ",
//     access_token: ss,
//     //deviceid: _params.deviceid
//     ordersn: _params.ordersn,
//     rid: _params.rid
//   }, req);

// };
// var postdroporder = function(_params, req) {
//   return callServer("personal_deleteordernumber", {
//     ____url: "http://123.57.4.235:8084/v2/store/droporder ",
//     access_token: ss,
//     ordersn: _params.ordersn
//   }, req);
// };
// var postusepaycard = function(_params, req) {
//   return callServer("personal_kapay", {
//     ____url: "http://123.57.4.235:8084/v2/store/usepaycard ",
//     paycardno: _params.paycardno,
//     deviceid: _params.deviceid
//   }, req);

// };
// var postcreateinvoice = function(_params, req) {
//   return callServer("personal_street2", {
//     ____url: "http://123.57.4.235:8084/v2/store/createinvoice ",
//     access_token: ss,
//     ordersn: _params.ordersn,
//     country: _params.country,
//     province: _params.province,
//     city: _params.city,
//     district: _params.district,
//     street: _params.street,
//     address: _params.address,
//     zipcode: _params.zipcode, //邮箱
//     consignee: _params.consignee,
//     mobile: _params.mobile

//   }, req);

// };
// var postaddcoupon = function(_params, req) {
//   return callServer("personal_addTicket", {
//     ____url: "http://123.57.4.235:8084/v2/store/addcoupon ",
//     access_token: ss,
//     couponno: _params.couponno
//   }, req);

// };
// var postaddpaycard = function(_params, req) {
//   return callServer("personal_addKa", {
//     ____url: "http://123.57.4.235:8084/v2/store/addpaycard ",
//     access_token: ss,
//     paycardno: _params.paycardno
//   }, req);

// };

// var postpayment = function(_params, req) {
//   return callServer("personal_paymoney", {
//     ____url: "http://123.57.4.235:8084/v2/store/payment ",
//     access_token: ss,
//     paycardno: _params.paycardno
//   }, req);
// };
// module.exports = {
//   getlistcoupon: getlistcoupon,
//   getlistpaycard: getlistpaycard,
//   getpaycard_record: getpaycard_record,
//   getcoupon_record: getcoupon_record,
//   getlistorder: getlistorder,
//   getyunlist: getyunlist,
//   getmyorder: getmyorder,
//   getcreateorder: getcreateorder,
//   postconfirmorder: postconfirmorder,
//   postdroporder: postdroporder,
//   postusepaycard: postusepaycard,
//   postcreateinvoice: postcreateinvoice,
//   postaddcoupon: postaddcoupon,
//   postaddpaycard: postaddpaycard,
//   postpayment: postpayment
// };
