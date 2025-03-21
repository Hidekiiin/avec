// UI操作を管理するクラス
export class UI {
    constructor() {
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.interestForm = document.getElementById('interest-form');
        this.matchingScreen = document.getElementById('matching-screen');
        this.chatRoom = document.getElementById('chat-room');
        this.statusIndicator = document.getElementById('status-indicator');
        this.connectionText = document.getElementById('connection-text');
        this.messagesContainer = document.getElementById('messages');
        this.muteButton = document.getElementById('mute-btn');
        
        // 通知音の初期化
        this.notificationSound = new Audio('assets/sounds/notification.mp3');
    }
    
    // ウェルカム画面を表示
    showWelcomeScreen() {
        this.welcomeScreen.style.display = 'block';
        this.interestForm.style.display = 'none';
        this.matchingScreen.style.display = 'none';
        this.chatRoom.style.display = 'none';
    }
    
    // 趣味選択フォームを表示
    showInterestForm() {
        this.welcomeScreen.style.display = 'block';
        this.interestForm.style.display = 'block';
        this.matchingScreen.style.display = 'none';
        this.chatRoom.style.display = 'none';
    }
    
    // マッチング画面を表示
    showMatchingScreen() {
        this.welcomeScreen.style.display = 'none';
        this.interestForm.style.display = 'none';
        this.matchingScreen.style.display = 'block';
        this.chatRoom.style.display = 'none';
    }
    
    // チャットルームを表示
    showChatRoom() {
        this.welcomeScreen.style.display = 'none';
        this.interestForm.style.display = 'none';
        this.matchingScreen.style.display = 'none';
        this.chatRoom.style.display = 'block';
    }
    
    // 接続状態の更新
    updateConnectionStatus(isConnected, text) {
        this.statusIndicator.className = isConnected ? 'connected' : 'disconnected';
        this.connectionText.textContent = text;
    }
    
    // ミュートボタンの更新
    updateMuteButton(isMuted) {
        if (isMuted) {
            this.muteButton.textContent = 'ミュート解除';
            this.muteButton.classList.add('muted');
        } else {
            this.muteButton.textContent = 'ミュート';
            this.muteButton.classList.remove('muted');
        }
    }
    
    // チャットメッセージの追加
    addChatMessage(text, isSelf) {
        const messageElement = document.createElement('div');
        messageElement.className = isSelf ? 'message self' : 'message other';
        
        const textElement = document.createElement('p');
        textElement.textContent = text;
        
        const timeElement = document.createElement('span');
        timeElement.className = 'time';
        const now = new Date();
        timeElement.textContent = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        messageElement.appendChild(textElement);
        messageElement.appendChild(timeElement);
        
        this.messagesContainer.appendChild(messageElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    // 通知音を再生
    playNotificationSound() {
        this.notificationSound.play().catch(error => {
            console.warn('通知音の再生に失敗しました:', error);
        });
    }
}
