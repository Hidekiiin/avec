// テーマカスタマイズを管理するクラス
export class ThemeManager {
    constructor() {
        this.themes = {
            'default': {
                '--primary-color': '#4a6fa5',
                '--secondary-color': '#6b8cae',
                '--background-color': '#f5f7fa',
                '--text-color': '#333333',
                '--accent-color': '#ff6b6b',
                '--card-bg-color': '#ffffff',
                '--border-color': '#e1e5eb',
                '--success-color': '#4caf50',
                '--danger-color': '#f44336',
                '--font-family': '"Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", Meiryo, メイリオ, sans-serif'
            },
            'dark': {
                '--primary-color': '#6d8cb0',
                '--secondary-color': '#8ba5c4',
                '--background-color': '#1a1a1a',
                '--text-color': '#f0f0f0',
                '--accent-color': '#ff7e7e',
                '--card-bg-color': '#2a2a2a',
                '--border-color': '#444444',
                '--success-color': '#66bb6a',
                '--danger-color': '#e57373',
                '--font-family': '"Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", Meiryo, メイリオ, sans-serif'
            },
            'cute': {
                '--primary-color': '#ff85a2',
                '--secondary-color': '#ffa8c0',
                '--background-color': '#fff0f5',
                '--text-color': '#5a3d5c',
                '--accent-color': '#ffde59',
                '--card-bg-color': '#ffffff',
                '--border-color': '#ffd1dc',
                '--success-color': '#77dd77',
                '--danger-color': '#ff6961',
                '--font-family': '"Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN W4", "Comfortaa", cursive'
            },
            'pop': {
                '--primary-color': '#3498db',
                '--secondary-color': '#2ecc71',
                '--background-color': '#ecf0f1',
                '--text-color': '#2c3e50',
                '--accent-color': '#e74c3c',
                '--card-bg-color': '#ffffff',
                '--border-color': '#bdc3c7',
                '--success-color': '#2ecc71',
                '--danger-color': '#e74c3c',
                '--font-family': '"Rounded Mplus 1c", "M PLUS Rounded 1c", sans-serif'
            }
        };
        
        this.currentTheme = 'default';
    }
    
    // テーマの初期化
    initializeTheme() {
        // ローカルストレージからテーマを取得
        const savedTheme = localStorage.getItem('theme') || 'default';
        this.applyTheme(savedTheme);
    }
    
    // テーマの適用
    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            themeName = 'default';
        }
        
        const theme = this.themes[themeName];
        const root = document.documentElement;
        
        for (const [property, value] of Object.entries(theme)) {
            root.style.setProperty(property, value);
        }
        
        this.currentTheme = themeName;
        localStorage.setItem('theme', themeName);
    }
    
    // テーマの切り替え
    toggleTheme() {
        const themeNames = Object.keys(this.themes);
        const currentIndex = themeNames.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        const nextTheme = themeNames[nextIndex];
        
        this.applyTheme(nextTheme);
    }
    
    // カスタムテーマの追加
    addCustomTheme(name, themeProperties) {
        this.themes[name] = themeProperties;
    }
}
