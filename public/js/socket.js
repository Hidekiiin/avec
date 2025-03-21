// Socket.IO通信を管理するクラス
export class SocketConnection {
    constructor() {
        // 本番環境ではサーバーレス関数のURLに変更
        this.socket = io('https://your-serverless-function-url.netlify.app', {
            transports: ['websocket'],
            autoConnect: false
        });
        
        this.userId = null;
        this.interests = [];
        this.setupEventListeners();
    }
    
    // 接続開始
    connect() {
        if (!this.socket.connected) {
            this.socket.connect();
        }
    }
    
    // イベントリスナーの設定
    setupEventListeners() {
        // 接続成功時
        this.socket.on('connect', () => {
            console.log('Connected to signaling server');
            // 一時的なユーザーIDを生成
            this.userId = this.generateUserId();
            this.socket.emit('register', { userId: this.userId });
        });
        
        // 接続エラー時
        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
        
        // 切断時
        this.socket.on('disconnect', () => {
            console.log('Disconnected from signaling server');
        });
    }
    
    // ランダムマッチングをリクエスト
    requestRandomMatch() {
        this.socket.emit('request-match', { type: 'random' });
    }
    
    // 趣味ベースのマッチングをリクエスト
    requestInterestMatch(interests) {
        this.interests = interests;
        this.socket.emit('request-match', { 
            type: 'interest',
            interests: interests
        });
    }
    
    // マッチングをキャンセル
    cancelMatching() {
        this.socket.emit('cancel-match');
    }
    
    // イベントリスナーの追加
    on(event, callback) {
        this.socket.on(event, callback);
    }
    
    // イベント発行
    emit(event, data) {
        this.socket.emit(event, data);
    }
    
    // 切断
    disconnect() {
        this.socket.disconnect();
    }
    
    // 一時的なユーザーIDの生成
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
}
