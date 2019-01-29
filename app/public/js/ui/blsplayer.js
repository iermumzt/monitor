/****
* 初始化player的参数
* @param container_id html中的元素id，用于包含播放器
* @param width 播放器宽度
* @param height 播放器高度
* */
function BlsPlayer(container_id, width, height) {
    if(!BlsPlayer.g_player_list)
        BlsPlayer.g_player_list = {};

    BlsPlayer.g_player_list[container_id] = this;
    this.container = container_id;
    this.width = width;
    this.height = height;
    this.callbackObj = null;
}

/****
* 启动flash播放器，在start之前，需要做好事件监听和参数设置
* @param swf_url swf文件所在位置
* */
BlsPlayer.prototype.start = function(swf_url){
    // embed the flash.
    var flashvars = {};
    flashvars.player_id = this.container;
    flashvars.on_player_ready = "on_bls_player_ready";
    flashvars.on_stream_metadata = "on_bls_stream_metadata";
    flashvars.on_connection_status = "on_bls_connection_status";
    flashvars.on_connection_error = "on_bls_connection_error";
    flashvars.on_hls_time_update = "on_hls_time_update";
    flashvars.on_hls_play_state_change = "on_hls_play_state_change";
    flashvars.player_width = this.width;
    flashvars.player_height = this.height;
    
    var params = {};
    params.wmode = "opaque";
    params.allowFullScreen = "true";
    params.allowScriptAccess = "always";
    
    var attributes = {};
    
    var self = this;

    swfobject.embedSWF(
        swf_url, 
        this.container,
        this.width, this.height,
        "11.1.0", "playerProductInstall.swf",
        flashvars, params, attributes,
        function(callbackObj){
            self.callbackObj = callbackObj;
        }
    );
}

/**
* play the stream.
* @param url the url of stream, rtmp or http.
* @param volume the volume, 0 is mute, 1 is 100%, 2 is 200%.
*/
BlsPlayer.prototype.play = function(url, volume) {
    this.stop();
    
    if (url) {
        this.stream_url = url;
    }
    
    // volume maybe 0, so never use if(volume) to check its value.
    if (volume != null && volume != undefined) {
        this.volume = volume;
    }else{
        this.volume = 1;
    }
    
    this.callbackObj.ref.__play(this.stream_url, this.width, this.height, this.volume);
}

/**
* play the stream.
* @param url the url of  m3u8.
*/
BlsPlayer.prototype.play_hls_source = function(m3u8_url,volume) {
    this.stop();
    
    this.callbackObj.ref.__play_hls_source(m3u8_url);
    if (volume != null && volume != undefined) {
        this.callbackObj.ref.__set_volume(volume);
    }
    
}

/**
* 停止播放，断开与服务器的连接
*/
BlsPlayer.prototype.stop = function() {
    try{
       this.callbackObj.ref.__stop(); 
   }catch(e){
        
   }
}

/**
* 暂停播放，并不会断开连接
*/
BlsPlayer.prototype.pause = function() {
    this.callbackObj.ref.__pause();
}

/**
* 恢复播放状态
*/
BlsPlayer.prototype.resume = function() {
    this.callbackObj.ref.__resume();
}

/**
* 设置播放音量
*/
BlsPlayer.prototype.set_volume = function(num) {
    this.callbackObj.ref.__set_volume(num);
}

/**
* 获取当前播放器缓冲区中的数据大小，单位秒
*/
BlsPlayer.prototype.get_buffer_time = function() {
    return this.callbackObj.ref.__get_buffer_time();
}

/**
* 设置缓冲区大小，与延迟相关，默认为0.8，单位秒
* @param num 缓冲区长度
*/
BlsPlayer.prototype.set_buffer_time = function(num) {
    return this.callbackObj.ref.__set_buffer_len(num);
}

/**
* 获取当前直播时间，单位秒
*/
BlsPlayer.prototype.get_live_time = function() {
    return this.callbackObj.ref.__get_live_time();
}

/**
* 改变全屏状态（未实现）
*/
BlsPlayer.prototype.change_full_screen = function() {
    this.callbackObj.ref.__change_full_screen();
}

/**
* 设置视频画面缩放倍数
* param num 画面放大的倍数，double型，最小值为1
*/
BlsPlayer.prototype.scale_vedio_size = function(num){
    this.callbackObj.ref.__scale_vedio_size(num);
}

/**
* 设置是否双击全屏
* param enable boolean 表示是否开启双击全屏的效果
*/
BlsPlayer.prototype.enable_double_click_full_screen = function(enable){
    this.callbackObj.ref.__set_double_click_full_screen(enable);
}

/**
* 设置视频画面的长宽
* @param width 画面宽度
* @param height 画面高度
*/
BlsPlayer.prototype.set_vedio_size = function(width, height){
    this.callbackObj.ref.width = width;
    this.callbackObj.ref.height = height;
    this.callbackObj.ref.__set_vedio_size(width, height);
}

/**
* 事件监听函数 on_player_ready
* 当播放器初始化完成后，会回调此函数，通知js可以做后续的播放等处理
* */
function on_bls_player_ready(player_id) {  
    if(BlsPlayer.g_player_list[player_id] && BlsPlayer.g_player_list[player_id].on_player_ready){
        BlsPlayer.g_player_list[player_id].on_player_ready();
    }
}

/**
* 事件监听函数 on_stream_metadata
* 当获取到直播流中的metadata后，回调此函数
* @param metadata metadata信息，Object类型
* */
function on_bls_stream_metadata(player_id, metadata) {  
    if(BlsPlayer.g_player_list[player_id] && BlsPlayer.g_player_list[player_id].on_stream_metadata){
        BlsPlayer.g_player_list[player_id].on_stream_metadata(metadata);
    }
}

/**
* 事件监听函数 on_connection_status
* 当与服务器的直播连接状态发生变化时，回调此函数
* @param info 表示服务器连接状态，格式如下：
*       code: "NetConnection.Connect.Success"(连接成功)/
              "NetConnection.Connect.Failed"(连接服务器失败)/
              "NetConnection.Connect.Closed"(连接关闭)
*       description: "Connection succeeded"
*       level: "status"/"error"
*       objectEncoding: 0
* */
function on_bls_connection_status(player_id, info){
    if(BlsPlayer.g_player_list[player_id] && BlsPlayer.g_player_list[player_id].on_connection_status){
        BlsPlayer.g_player_list[player_id].on_connection_status(info);
    }
}

/**
* 事件监听函数 on_hls_time_update
* 播放hls源时监听流时间
* @param time 当前相对时间
* */
function on_hls_time_update(player_id, time){
    if(BlsPlayer.g_player_list[player_id] && BlsPlayer.g_player_list[player_id].on_hls_time_update){
        BlsPlayer.g_player_list[player_id].on_hls_time_update(time);
    }
}

/**
* 事件监听函数 on_hls_play_state_change
* 播放hls源播放状态变化时监听开始和停止状态
* @param state string "playing"/"stopped"
* */
function on_hls_play_state_change(player_id, state){
    if(BlsPlayer.g_player_list[player_id] && BlsPlayer.g_player_list[player_id].on_hls_play_state_change){
        BlsPlayer.g_player_list[player_id].on_hls_play_state_change(state);
    }
}