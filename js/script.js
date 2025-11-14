// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Liminos Studio Dev ホームページがロードされました。');

    // ===========================================
    // 共通要素の定義 (DOMContentLoadedスコープ内)
    // ===========================================
    const header = document.getElementById('main-header');
    // HTMLのプロジェクトグリッド要素を取得
    const projectGrid = document.querySelector('.project-grid'); 
    // CSSのテーマ変数（--bg-dark）に対応するため、変数を一時的に定義 (CSS側で--bg-mainを使用しているため、ここは調整が必要です)
    const cssBgDark = '#1f2937'; 


    // 1. スクロール時のヘッダーの変化
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                // スクロールでヘッダーを濃くする (半透明の濃い色)
                header.style.backgroundColor = 'rgba(31, 41, 55, 0.95)'; 
                header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.5)';
            } else {
                // スクロールが戻ったときにCSS変数(--bg-dark)が持つ値に戻す
                // 厳密には getComputedStyle を使うべきですが、ここでは簡易的にベタ打ち、またはCSS変数名に合わせる
                header.style.backgroundColor = 'var(--bg-main)'; 
                header.style.boxShadow = 'none';
            }
        });
    }

    // 2. プロジェクトデータの動的読み込みと表示
    const loadProjects = async () => {
        if (!projectGrid) return;

        try {
            const response = await fetch('assets/projects.json');
            
            if (!response.ok) {
                throw new Error('プロジェクトデータの読み込みに失敗しました。');
            }
            
            const projects = await response.json();
            
            projectGrid.innerHTML = ''; 

            projects.forEach(project => {
                const card = document.createElement('article');
                card.className = 'project-card';
                
                // プロジェクトカードのHTMLを生成
                card.innerHTML = `
                    <div class="card-image" style="background-image: url('${project.imageUrl}');"></div>
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                    <div class="card-footer">
                        <span class="tag">${project.category}</span>
                        <span class="status status-${project.status.toLowerCase().replace(/\s/g, '-')}" title="プロジェクトの状態">${project.status}</span>
                    </div>
                    ${project.link ? `<a href="${project.link}" target="_blank" class="card-link">詳細を見る &rarr;</a>` : ''}
                `;
                
                projectGrid.appendChild(card);
            });

        } catch (error) {
            console.error('プロジェクトの読み込みエラー:', error);
            projectGrid.innerHTML = `<p class="error-message">プロジェクト情報を読み込めませんでした。管理者にお問い合わせください。</p>`;
        }
    };


    // 3. ダークモード切り替えの実装
    const themeToggleButton = document.getElementById('theme-toggle'); 
    
    // 初期テーマの設定
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', currentTheme);

    if (themeToggleButton) {
        themeToggleButton.textContent = currentTheme === 'dark' ? '☀️' : '🌙'; 
        
        themeToggleButton.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggleButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }


    // 4. 言語切り替えの実装
    const langButtons = document.querySelectorAll('.lang-btn');
    const initialLang = localStorage.getItem('lang') || 'ja';
    let translations = {};

    // 翻訳データを取得する関数
    const fetchTranslations = async (lang) => {
        try {
            const response = await fetch(`./assets/i18n/${lang}.json`);
            if (!response.ok) {
                console.error(`Error loading translations for ${lang}.`);
                return {};
            }
            return response.json();
        } catch (error) {
            console.error("Failed to load translation file:", error);
            return {};
        }
    };

    // DOM要素を更新する関数
    const translatePage = (lang, data) => {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (data[key]) {
                element.textContent = data[key];
            }
        });

        // ボタンのアクティブ状態を更新
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        localStorage.setItem('lang', lang);
    };

    // 言語切り替えボタンのイベントリスナー設定
    langButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const newLang = button.getAttribute('data-lang');
            
            // データを取得し、ページを翻訳
            translations = await fetchTranslations(newLang);
            if (Object.keys(translations).length > 0) {
                translatePage(newLang, translations);
            }
        });
    });

    // 初期ロード時の翻訳実行
    const initializeLanguage = async () => {
        translations = await fetchTranslations(initialLang);
        if (Object.keys(translations).length > 0) {
            translatePage(initialLang, translations);
        }
    };
    
    // ===========================================
    // 実行ロジック
    // ===========================================
    
    // プロジェクトの読み込み
    loadProjects();
    
    // 言語の初期化
    initializeLanguage(); 
});
