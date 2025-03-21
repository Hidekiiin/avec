import { WebRTCConnection } from './webrtc.js';
import { SocketConnection } from './socket.js';
import { UI } from './ui.js';
import { ThemeManager } from './themes.js';

class VoiceChatApp {
    constructor() {
        this.ui = new UI();
        this.themeManager = new ThemeManager();
        this.socketConnection = new SocketConnection();
        this.webrtcConnection = new WebRTCConnection(this.socketConnection);
        
        this.selectedInterests = [];
        
        this.initializeApp();
    }
    
    initializeApp() {
        // UIイベントリスナーの設定
        this.setupUIListeners();
        
        // WebRTCコールバックの設定
        this.setupWebRTCCallbacks();
        
        // テーマ初期化
        this.themeManager.initializeTheme();
    }
    
    setupUIListeners() {
        // ランダムマッチングボタン
        document.getElementById('random-match-btn').addEventListener('click', () => {
            this.startRandomMatching();
        });
        
        // 趣味マッチングボタン
        document.getElementById('interest-match-btn').addEventListener('click', () => {
            this.ui.showInterestForm();
        });
        
        // 趣味タグの選択
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                const tagName = e.target.getAttribute('data-tag');
                this.toggleInterestTag(tagName, e.target);
            });
        });
        
        // マッチング開始ボタン
        document.getElementById('start-matching-btn').addEventListener('click', () => {
            this.startInterestMatching();
        });
        
        // マッチングキャンセルボタン
        document.getElementById('cancel-matching-btn').addEventListener('click', () => {
            this.cancelMatching();
        });
        
        // ミュートボタン
        document.getElementById('mute-btn').addEventListener('click', () => {
            const isMuted = this.webrtcConnection.toggleMute();
            this.ui.updateMuteButton(isMuted);
        });
        
        // 通話終了ボタン
        document.getElementById('end-call-btn').addEventListener('click', () => {
            this.endCall();
        });
        
        // メッセージ送信ボタン
        document.getElementById('send-btn').addEventListener('click', () => {
            this.sendChatMessage();
        });
        
        // メッセージ入力フィールドでEnterキー
        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });
        
        // テーマ切り替えボタン
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.themeManager.toggleTheme();
        });
    }
    
    setupWebRTCCallbacks() {
        // 接続確立時
        this.webrtcConnection.onConnected(() => {
            this.ui.showChatRoom();
            this.ui.updateConnectionStatus(true, '接続しました');
        });
        
        // 切断時
        this.webrtcConnection.onDisconnected(() => {
            this.ui.showWelcomeScreen();
            this.ui.updateConnectionStatus(false, '切断されました');
        });
        
        // メッセージ受信時
        this.webrtcConnection.onMessage((message) => {
            this.ui.addChatMessage(message.text, false);
            this.ui.playNotificationSound(); // 通知音を再生
        });
    }
    
    // 趣味タグの選択切り替え
    toggleInterestTag(tagName, element) {
        const index = this.selectedInterests.indexOf(tagName);
        
        if (index === -1) {
            // 最大5つまで選択可能
            if (this.selectedInterests.length < 5) {
                this.selectedInterests.push(tagName);
                element.classList.add('selected');
            }
        } else {
            this.selectedInterests.splice(index, 1);
            element.classList.remove('selected');
        }
    }
    
    // ランダムマッチング開始
    startRandomMatching() {
        this.socketConnection.connect();
        this.socketConnection.requestRandomMatch();
        this.ui.showMatchingScreen();
    }
    
    // 趣味ベースのマッチング開始
    startInterestMatching() {
        if (this.selectedInterests.length === 0) {
            alert('少なくとも1つの趣味を選択してください');
            return;
        }
        
        this.socketConnection.connect();
        this.socketConnection.requestInterestMatch(this.selectedInterests);
        this.ui.showMatchingScreen();
    }
    
    // マッチングキャンセル
    cancelMatching() {
        this.socketConnection.cancelMatching();
        this.ui.showWelcomeScreen();
    }
    
    // 通話終了
    endCall() {
        this.webrtcConnection.endCall();
        this.ui.showWelcomeScreen();
    }
    
    // チャットメッセージ送信
    sendChatMessage() {
        const messageInput = document.getElementById('message-input');
        const text = messageInput.value.trim();
        
        if (text) {
            const sent = this.webrtcConnection.sendMessage(text);
            if (sent) {
                this.ui.addChatMessage(text, true);
                messageInput.value = '';
            }
        }
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new VoiceChatApp();
});
