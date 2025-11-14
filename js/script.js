// js/script.js (統合・修正版)

document.addEventListener('DOMContentLoaded', () => {
    console.log('Liminos Studio Dev ホームページがロードされました。');

    // ===========================================
    // 共通要素の定義
    // ===========================================
    const header = document.getElementById('main-header');
    const projectGrid = document.querySelector('.project-grid');
    const themeToggleButton = document.getElementById('theme-toggle'); 
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // 言語切り替え用の変数
    const initialLang = localStorage.getItem('lang') || 'ja';
    let translations = {};


    // 1. スクロール時のヘッダーの変化 (クラス切り替え方式に修正)
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled'); 
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. プロジェクトデータの動的読み込みと表示 (変更なし)
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


    // 3. ダークモード切り替えの実装 (変更なし)
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


    // 4. 言語切り替えの実装 (変更なし)
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

    const translatePage = (lang, data) => {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (data[key]) {
                element.textContent = data[key];
            }
        });

        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        localStorage.setItem('lang', lang);
    };

    langButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const newLang = button.getAttribute('data-lang');
            
            translations = await fetchTranslations(newLang);
            if (Object.keys(translations).length > 0) {
                translatePage(newLang, translations);
            }
        });
    });

    const initializeLanguage = async () => {
        translations = await fetchTranslations(initialLang);
        if (Object.keys(translations).length > 0) {
            translatePage(initialLang, translations);
        }
    };
    
    // ===========================================
    // 実行ロジック
    // ===========================================
    
    loadProjects();
    initializeLanguage(); 
});
