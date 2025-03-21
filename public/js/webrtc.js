// WebRTC接続を管理するクラス
export class WebRTCConnection {
    constructor(socketConnection) {
        this.socket = socketConnection;
        this.peer = null;
        this.localStream = null;
        this.remoteStream = null;
        this.isInitiator = false;
        this.isConnected = false;
        this.onConnectedCallback = null;
        this.onDisconnectedCallback = null;
        this.onMessageCallback = null;
        
        // Socket.IOイベントリスナーの設定
        this.setupSocketListeners();
    }
    
    // Socket.IOイベントリスナーの設定
    setupSocketListeners() {
        // シグナリングメッセージの受信
        this.socket.on('signal', async (data) => {
            if (this.peer) {
                try {
                    await this.peer.signal(data);
                } catch (error) {
                    console.error('Signaling error:', error);
                }
            }
        });
        
        // マッチング成功時
        this.socket.on('matched', (data) => {
            this.isInitiator = data.isInitiator;
            this.startPeerConnection();
        });
        
        // 相手が切断した時
        this.socket.on('peer-disconnected', () => {
            this.handleDisconnect();
        });
    }
    
    // マイクへのアクセスを取得
    async getLocalStream() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ 
                audio: true, 
                video: false 
            });
            return this.localStream;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            throw error;
        }
    }
    
    // WebRTC接続の開始
    async startPeerConnection() {
        try {
            if (!this.localStream) {
                await this.getLocalStream();
            }
            
            // Simple-Peerの初期化
            this.peer = new SimplePeer({
                initiator: this.isInitiator,
                stream: this.localStream,
                trickle: true
            });
            
            // Peerイベントの設定
            this.setupPeerEvents();
            
        } catch (error) {
            console.error('Failed to start peer connection:', error);
        }
    }
    
    // Peerイベントの設定
    setupPeerEvents() {
        // シグナリングデータの送信
        this.peer.on('signal', (data) => {
            this.socket.emit('signal', data);
        });
        
        // 接続確立時
        this.peer.on('connect', () => {
            this.isConnected = true;
            if (this.onConnectedCallback) {
                this.onConnectedCallback();
            }
        });
        
        // ストリーム受信時
        this.peer.on('stream', (stream) => {
            this.remoteStream = stream;
            const audioElement = document.createElement('audio');
            audioElement.id = 'remote-audio';
            audioElement.srcObject = stream;
            audioElement.autoplay = true;
            document.body.appendChild(audioElement);
        });
        
        // データチャネルメッセージ受信時
        this.peer.on('data', (data) => {
            const message = JSON.parse(data);
            if (this.onMessageCallback) {
                this.onMessageCallback(message);
            }
        });
        
        // エラー発生時
        this.peer.on('error', (err) => {
            console.error('Peer connection error:', err);
            this.handleDisconnect();
        });
        
        // 接続終了時
        this.peer.on('close', () => {
            this.handleDisconnect();
        });
    }
    
    // メッセージ送信
    sendMessage(text) {
        if (this.peer && this.isConnected) {
            const message = {
                type: 'chat',
                text: text,
                timestamp: new Date().toISOString()
            };
            this.peer.send(JSON.stringify(message));
            return true;
        }
        return false;
    }
    
    // マイクのミュート切り替え
    toggleMute() {
        if (this.localStream) {
            const audioTracks = this.localStream.getAudioTracks();
            if (audioTracks.length > 0) {
                const enabled = !audioTracks[0].enabled;
                audioTracks[0].enabled = enabled;
                return enabled; // true: ミュート解除, false: ミュート
            }
        }
        return false;
    }
    
    // 接続終了処理
    handleDisconnect() {
        this.isConnected = false;
        
        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(track => track.stop());
            this.remoteStream = null;
            const remoteAudio = document.getElementById('remote-audio');
            if (remoteAudio) {
                remoteAudio.remove();
            }
        }
        
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        
        if (this.onDisconnectedCallback) {
            this.onDisconnectedCallback();
        }
    }
    
    // 通話終了
    endCall() {
        this.socket.emit('end-call');
        this.handleDisconnect();
        
        // ローカルストリームも停止
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
    }
    
    // コールバック設定
    onConnected(callback) {
        this.onConnectedCallback = callback;
    }
    
    onDisconnected(callback) {
        this.onDisconnectedCallback = callback;
    }
    
    onMessage(callback) {
        this.onMessageCallback = callback;
    }
}
