// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Liminos Studio Dev ホームページがロードされました。');

    // 1. スクロール時のヘッダーの変化（例）
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(31, 41, 55, 0.95)'; // スクロールでヘッダーを濃くする
            header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.backgroundColor = 'var(--bg-dark)';
            header.style.boxShadow = 'none';
        }
    });

    // 2. プロジェクトデータの動的読み込みと表示 (★ ここを実装します)
    const loadProjects = async () => {
        if (!projectGrid) return;

        try {
            // JSONファイルをフェッチ
            const response = await fetch('assets/projects.json');
            
            if (!response.ok) {
                throw new Error('プロジェクトデータの読み込みに失敗しました。');
            }
            
            const projects = await response.json();
            
            // 既存のコンテンツ（サンプルのカード）をクリア
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
    const themeToggleButton = document.getElementById('theme-toggle'); // HTMLにボタンを追加してください
    
    // 初期テーマの設定 (LocalStorageから取得、なければダークモード)
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', currentTheme);

    if (themeToggleButton) {
        themeToggleButton.textContent = currentTheme === 'dark' ? '☀️' : '🌙'; // アイコン表示
        
        themeToggleButton.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggleButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
    
    // ページの読み込み完了時に実行
    loadProjects();
});
