// グローバル変数
let categories = [];
let uploadedImages = []; // 複数画像対応に変更
let selectedQuestions = [1, 2, 3]; // デフォルトで最初の3つを選択

// 動的文字数制限の設定 - より短く設定
const charLimits = {
    1: { title: 50, question: 15, content: 80 },
    2: { title: 50, question: 15, content: 80 },
    3: { title: 45, question: 12, content: 60 },
    4: { title: 45, question: 12, content: 60 },
    5: { title: 45, question: 10, content: 50 },
    6: { title: 45, question: 10, content: 50 }
};

// DOM要素の取得
const elements = {
    // 入力要素
    title: document.getElementById('title'),
    author: document.getElementById('author'),
    year: document.getElementById('year'),
    categoryInput: document.getElementById('category-input'),
    addCategoryBtn: document.getElementById('add-category'),
    categoriesContainer: document.getElementById('categories'),
    uploadArea: document.getElementById('upload-area'),
    imageInput: document.getElementById('image-input'),
    uploadBtn: document.getElementById('upload-btn'),
    uploadedImageContainer: document.getElementById('uploaded-image'),
    previewImg: document.getElementById('preview-img'),
    removeImageBtn: document.getElementById('remove-image'),
    clearAllBtn: document.getElementById('clear-all'),
    saveDataBtn: document.getElementById('save-data'),
    selectedCount: document.getElementById('selected-count'),
    
    // プレビュー要素
    previewTitle: document.getElementById('preview-title'),
    previewAuthor: document.getElementById('preview-author'),
    previewYear: document.getElementById('preview-year'),
    previewCategories: document.getElementById('preview-categories'),
    previewPaperImage: document.getElementById('preview-paper-image'),
    previewPaperImg: document.getElementById('preview-paper-img')
};

// 文字数カウント要素
const charCountElements = {
    title: document.getElementById('title-count'),
    author: document.getElementById('author-count'),
    q1: document.getElementById('q1-count'),
    q2: document.getElementById('q2-count'),
    q3: document.getElementById('q3-count'),
    q4: document.getElementById('q4-count'),
    q5: document.getElementById('q5-count'),
    q6: document.getElementById('q6-count')
};

// 質問要素の取得
const questionLabels = document.querySelectorAll('.question-label');
const questionContents = document.querySelectorAll('.question-content');
const questionCheckboxes = document.querySelectorAll('.question-checkbox');
const questionItems = document.querySelectorAll('.question-item');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCharacterLimits();
    updateQuestionVisibility();
    loadSavedData();
    updatePreview();
    updateFontSizes(); // 初期フォントサイズ設定
});

// ウィンドウリサイズ時のフォントサイズ調整
window.addEventListener('resize', updateFontSizes);

// イベントリスナーの初期化
function initializeEventListeners() {
    // 基本情報の入力イベント
    elements.title.addEventListener('input', function() {
        updateCharCount('title', this.value.length, 50);
        updatePreview();
        saveData();
    });
    
    elements.author.addEventListener('input', function() {
        updateCharCount('author', this.value.length, 100);
        updatePreview();
        saveData();
    });
    
    elements.year.addEventListener('input', function() {
        updatePreview();
        saveData();
    });
    
    // カテゴリ関連イベント
    elements.addCategoryBtn.addEventListener('click', addCategory);
    elements.categoryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCategory();
        }
    });
    
    // 画像アップロード関連イベント
    elements.uploadBtn.addEventListener('click', () => elements.imageInput.click());
    elements.imageInput.addEventListener('change', handleImageSelect);
    elements.removeImageBtn.addEventListener('click', removeAllImages);
    
    // ドラッグ&ドロップ
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('drop', handleDrop);
    elements.uploadArea.addEventListener('click', () => elements.imageInput.click());
    
    // ペースト機能
    document.addEventListener('paste', handlePaste);
    
    // 質問チェックボックスイベント
    questionCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            const questionNum = index + 1;
            if (this.checked) {
                if (!selectedQuestions.includes(questionNum)) {
                    selectedQuestions.push(questionNum);
                }
            } else {
                selectedQuestions = selectedQuestions.filter(q => q !== questionNum);
            }
            
            // 最低1つは選択必須
            if (selectedQuestions.length === 0) {
                this.checked = true;
                selectedQuestions.push(questionNum);
                alert('最低1つの質問を選択してください');
                return;
            }
            
            updateCharacterLimits();
            updateQuestionVisibility();
            updateSelectedCount();
            updatePreview();
            saveData();
        });
    });
    
    // 質問関連イベント
    questionLabels.forEach((label, index) => {
        label.addEventListener('input', function() {
            const questionNum = index + 1;
            const currentLimits = charLimits[selectedQuestions.length];
            updateCharCount(`q${questionNum}-label`, this.value.length, currentLimits.question);
            updatePreview();
            saveData();
        });
    });
    
    questionContents.forEach((content, index) => {
        content.addEventListener('input', function() {
            const questionNum = index + 1;
            const currentLimits = charLimits[selectedQuestions.length];
            updateCharCount(`q${questionNum}`, this.value.length, currentLimits.content);
            updatePreview();
            saveData();
        });
    });
    
    // コントロールボタン
    elements.clearAllBtn.addEventListener('click', clearAllData);
    elements.saveDataBtn.addEventListener('click', saveData);
}

// 動的文字数制限の更新
function updateCharacterLimits() {
    const currentLimits = charLimits[selectedQuestions.length];
    
    // タイトルの制限更新
    elements.title.maxLength = currentLimits.title;
    
    // 質問ラベルと内容の制限更新
    questionLabels.forEach((label, index) => {
        label.maxLength = currentLimits.question;
    });
    
    questionContents.forEach((content, index) => {
        content.maxLength = currentLimits.content;
    });
    
    // 文字数カウント表示の更新
    updateCharCount('title', elements.title.value.length, currentLimits.title);
    questionContents.forEach((content, index) => {
        const questionNum = index + 1;
        updateCharCount(`q${questionNum}`, content.value.length, currentLimits.content);
    });
}

// 選択数の更新
function updateSelectedCount() {
    elements.selectedCount.textContent = `(${selectedQuestions.length}/6選択中)`;
}

// 質問の表示/非表示更新
function updateQuestionVisibility() {
    questionItems.forEach((item, index) => {
        const questionNum = index + 1;
        const isSelected = selectedQuestions.includes(questionNum);
        
        if (isSelected) {
            item.classList.remove('disabled');
            questionLabels[index].disabled = false;
            questionContents[index].disabled = false;
        } else {
            item.classList.add('disabled');
            questionLabels[index].disabled = true;
            questionContents[index].disabled = true;
        }
    });
}

// 文字数カウント更新
function updateCharCount(elementKey, currentLength, maxLength) {
    const countElement = charCountElements[elementKey];
    if (countElement) {
        countElement.textContent = `${currentLength}/${maxLength}`;
        
        // 警告色の設定
        countElement.classList.remove('warning', 'danger');
        if (currentLength > maxLength * 0.8) {
            countElement.classList.add('warning');
        }
        if (currentLength >= maxLength) {
            countElement.classList.add('danger');
        }
    }
}

// カテゴリ追加
function addCategory() {
    const categoryValue = elements.categoryInput.value.trim();
    
    if (!categoryValue) return;
    if (categories.length >= 5) {
        alert('カテゴリは最大5個まで追加できます');
        return;
    }
    if (categories.includes(categoryValue)) {
        alert('既に追加されているカテゴリです');
        return;
    }
    
    categories.push(categoryValue);
    elements.categoryInput.value = '';
    
    renderCategories();
    updatePreview();
    saveData();
}

// カテゴリ削除
function removeCategory(categoryToRemove) {
    categories = categories.filter(cat => cat !== categoryToRemove);
    renderCategories();
    updatePreview();
    saveData();
}

// カテゴリ表示更新
function renderCategories() {
    elements.categoriesContainer.innerHTML = '';
    
    categories.forEach(category => {
        const categoryTag = document.createElement('div');
        categoryTag.className = 'category-tag';
        categoryTag.innerHTML = `
            ${category}
            <span class="remove" onclick="removeCategory('${category}')">&times;</span>
        `;
        elements.categoriesContainer.appendChild(categoryTag);
    });
    
    // 追加ボタンの状態更新
    elements.addCategoryBtn.disabled = categories.length >= 5;
}

// 画像選択処理
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processImageFile(file);
    }
}

// ドラッグオーバー処理
function handleDragOver(event) {
    event.preventDefault();
    elements.uploadArea.classList.add('dragover');
}

// ドロップ処理
function handleDrop(event) {
    event.preventDefault();
    elements.uploadArea.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        processImageFile(files[0]);
    }
}

// ペースト処理
function handlePaste(event) {
    const items = event.clipboardData.items;
    
    for (let item of items) {
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            processImageFile(file);
            break;
        }
    }
}

// 画像ファイル処理
function processImageFile(file) {
    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('画像サイズは5MB以下にしてください');
        return;
    }
    
    // 最大3枚まで制限
    if (uploadedImages.length >= 3) {
        alert('画像は最大3枚まで追加できます');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImages.push({
            id: Date.now(),
            src: e.target.result,
            name: file.name
        });
        displayUploadedImages();
        updatePreview();
        saveData();
    };
    reader.readAsDataURL(file);
}

// アップロード画像表示
function displayUploadedImages() {
    const container = elements.uploadedImageContainer;
    
    if (uploadedImages.length > 0) {
        container.style.display = 'block';
        elements.uploadArea.style.display = 'none';
        
        // 画像一覧を表示
        container.innerHTML = '';
        uploadedImages.forEach((image, index) => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'uploaded-image-item';
            imageDiv.innerHTML = `
                <img src="${image.src}" alt="アップロード画像${index + 1}" style="max-height: 60px; margin: 2px;">
                <button type="button" onclick="removeImage(${image.id})" style="display: block; margin: 2px auto; font-size: 0.8rem; padding: 2px 6px;">削除</button>
            `;
            container.appendChild(imageDiv);
        });
        
        // 追加ボタンを表示（3枚未満の場合）
        if (uploadedImages.length < 3) {
            const addButton = document.createElement('button');
            addButton.textContent = '画像を追加';
            addButton.onclick = () => elements.imageInput.click();
            addButton.style.margin = '5px auto';
            addButton.style.display = 'block';
            container.appendChild(addButton);
        }
    } else {
        container.style.display = 'none';
        elements.uploadArea.style.display = 'block';
    }
}

// 画像削除（IDで指定）
function removeImage(imageId) {
    uploadedImages = uploadedImages.filter(img => img.id !== imageId);
    displayUploadedImages();
    updatePreview();
    saveData();
}

// 全画像削除
function removeAllImages() {
    uploadedImages = [];
    elements.uploadedImageContainer.style.display = 'none';
    elements.uploadArea.style.display = 'block';
    elements.imageInput.value = '';
    updatePreview();
    saveData();
}

// プレビュー更新
function updatePreview() {
    // 基本情報更新
    elements.previewTitle.textContent = elements.title.value || '論文タイトル';
    elements.previewAuthor.textContent = elements.author.value || '著者名';
    elements.previewYear.textContent = elements.year.value ? `(${elements.year.value})` : '(年度)';
    
    // カテゴリ更新
    elements.previewCategories.innerHTML = '';
    categories.forEach(category => {
        const categoryElement = document.createElement('span');
        categoryElement.className = 'category';
        categoryElement.textContent = category;
        elements.previewCategories.appendChild(categoryElement);
    });
    
    // 画像更新（複数画像対応）
    const paperImagesContainer = document.getElementById('preview-paper-images');
    if (uploadedImages.length > 0) {
        paperImagesContainer.style.display = 'flex';
        paperImagesContainer.innerHTML = '';
        
        // 全ての画像を表示（最大3枚）
        uploadedImages.forEach((image, index) => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'image-item';
            imageDiv.innerHTML = `<img src="${image.src}" alt="図表${index + 1}">`;
            paperImagesContainer.appendChild(imageDiv);
        });
    } else {
        paperImagesContainer.style.display = 'none';
    }
    
    // 質問コンテナの更新（選択された質問のみ表示）
    const questionsGrid = document.querySelector('.questions-grid');
    questionsGrid.innerHTML = '';
    
    selectedQuestions.sort((a, b) => a - b).forEach(questionNum => {
        const index = questionNum - 1;
        const label = questionLabels[index];
        const content = questionContents[index];
        
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.innerHTML = `
            <h4 class="question-title">${label.value || `質問${questionNum}`}</h4>
            <p class="question-answer">${content.value || '回答内容がここに表示されます'}</p>
        `;
        questionsGrid.appendChild(questionCard);
    });
    
    // グリッドレイアウトを選択数に応じて調整
    updateGridLayout();
    
    // フォントサイズ更新
    setTimeout(updateFontSizes, 100);
}

// グリッドレイアウトの調整
function updateGridLayout() {
    const questionsGrid = document.querySelector('.questions-grid');
    const count = selectedQuestions.length;
    
    // 質問数に応じたレイアウト調整（短い文字数向け）
    if (count <= 2) {
        questionsGrid.style.gridTemplateColumns = '1fr';
    } else if (count <= 4) {
        questionsGrid.style.gridTemplateColumns = '1fr 1fr';
    } else {
        questionsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
    
    // フォントサイズの動的調整
    const cards = questionsGrid.querySelectorAll('.question-card');
    cards.forEach(card => {
        const title = card.querySelector('.question-title');
        const answer = card.querySelector('.question-answer');
        
        // 質問数に応じてフォントサイズを調整（短文向け最適化）
        if (count > 4) {
            title.style.fontSize = '0.6rem';
            answer.style.fontSize = '0.55rem';
            answer.style.lineHeight = '1.2';
        } else if (count > 2) {
            title.style.fontSize = '0.65rem';
            answer.style.fontSize = '0.6rem';
            answer.style.lineHeight = '1.25';
        } else {
            title.style.fontSize = '0.7rem';
            answer.style.fontSize = '0.65rem';
            answer.style.lineHeight = '1.3';
        }
    });
}

// データ保存
function saveData() {
    const data = {
        title: elements.title.value,
        author: elements.author.value,
        year: elements.year.value,
        categories: categories,
        images: uploadedImages, // 複数画像対応
        selectedQuestions: selectedQuestions,
        questions: Array.from(questionLabels).map((label, index) => ({
            label: label.value,
            content: questionContents[index].value
        }))
    };
    
    localStorage.setItem('paper-summary-data', JSON.stringify(data));
}

// 保存データ読み込み
function loadSavedData() {
    const savedData = localStorage.getItem('paper-summary-data');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // 基本情報復元
            elements.title.value = data.title || '';
            elements.author.value = data.author || '';
            elements.year.value = data.year || '';
            
            // カテゴリ復元
            categories = data.categories || [];
            renderCategories();
            
            // 画像復元（複数画像対応）
            if (data.images) {
                uploadedImages = data.images;
                displayUploadedImages();
            } else if (data.image) {
                // 古い形式との互換性
                uploadedImages = [{
                    id: Date.now(),
                    src: data.image,
                    name: '画像1'
                }];
                displayUploadedImages();
            }
            
            // 選択された質問復元
            if (data.selectedQuestions) {
                selectedQuestions = data.selectedQuestions;
                // チェックボックスの状態を復元
                questionCheckboxes.forEach((checkbox, index) => {
                    checkbox.checked = selectedQuestions.includes(index + 1);
                });
            }
            
            // 質問復元
            if (data.questions) {
                data.questions.forEach((question, index) => {
                    if (questionLabels[index] && questionContents[index]) {
                        questionLabels[index].value = question.label || '';
                        questionContents[index].value = question.content || '';
                    }
                });
            }
            
            // UI状態の更新
            updateCharacterLimits();
            updateQuestionVisibility();
            updateSelectedCount();
            
            // 文字数カウント更新
            const currentLimits = charLimits[selectedQuestions.length];
            updateCharCount('title', elements.title.value.length, currentLimits.title);
            updateCharCount('author', elements.author.value.length, 100);
            questionContents.forEach((content, index) => {
                updateCharCount(`q${index + 1}`, content.value.length, currentLimits.content);
            });
            
        } catch (error) {
            console.error('保存データの読み込みに失敗しました:', error);
        }
    }
}

// 全データクリア
function clearAllData() {
    if (confirm('すべてのデータをクリアしますか？この操作は元に戻せません。')) {
        // フォームリセット
        elements.title.value = '';
        elements.author.value = '';
        elements.year.value = '';
        elements.categoryInput.value = '';
        
        // カテゴリクリア
        categories = [];
        renderCategories();
        
        // 画像クリア
        removeAllImages();
        
        // 選択質問リセット
        selectedQuestions = [1, 2, 3];
        questionCheckboxes.forEach((checkbox, index) => {
            checkbox.checked = selectedQuestions.includes(index + 1);
        });
        
        // 質問リセット
        questionLabels.forEach((label, index) => {
            const defaultLabels = [
                'どんなもの？',
                '先行研究と比べてどこがすごいの？',
                '技術や手法の"キモ"はどこにある？',
                'どうやって有効だと検証した？',
                '議論はあるか？',
                '次に読むべき論文はあるか？'
            ];
            label.value = defaultLabels[index] || '';
            questionContents[index].value = '';
        });
        
        // UI状態の更新
        updateCharacterLimits();
        updateQuestionVisibility();
        updateSelectedCount();
        
        // 文字数カウントリセット
        const currentLimits = charLimits[selectedQuestions.length];
        Object.keys(charCountElements).forEach(key => {
            const element = charCountElements[key];
            if (element) {
                let maxLength;
                if (key.includes('q')) {
                    maxLength = currentLimits.content;
                } else if (key === 'title') {
                    maxLength = currentLimits.title;
                } else {
                    maxLength = 100; // author
                }
                element.textContent = `0/${maxLength}`;
                element.classList.remove('warning', 'danger');
            }
        });
        
        // localStorage クリア
        localStorage.removeItem('paper-summary-data');
        
        // プレビュー更新
        updatePreview();
    }
}

// ブラウザ幅に応じたフォントサイズ調整
function updateFontSizes() {
    const previewContainer = document.querySelector('.paper-summary');
    if (!previewContainer) return;
    
    const containerWidth = previewContainer.offsetWidth;
    
    // 質問タイトルのフォントサイズ調整（1行に収まるように小さくする）
    const questionTitles = document.querySelectorAll('.question-title');
    questionTitles.forEach(title => {
        const fontSize = Math.max(6, Math.min(14, containerWidth * 0.014));
        title.style.fontSize = fontSize + 'px';
        
        const padding = Math.max(3, Math.min(10, containerWidth * 0.010));
        title.style.padding = padding + 'px';
    });
    
    // 質問回答のフォントサイズ調整
    const questionAnswers = document.querySelectorAll('.question-answer');
    questionAnswers.forEach(answer => {
        const fontSize = Math.max(7, Math.min(16, containerWidth * 0.015));
        answer.style.fontSize = fontSize + 'px';
        
        const padding = Math.max(2, Math.min(8, containerWidth * 0.008));
        answer.style.paddingTop = padding + 'px';
        answer.style.paddingBottom = padding + 'px';
    });
    
    // 論文タイトルのフォントサイズ調整（最小サイズを大きく保つ）
    const paperTitle = document.querySelector('.paper-title');
    if (paperTitle) {
        const fontSize = Math.max(18, Math.min(28, containerWidth * 0.025));
        paperTitle.style.fontSize = fontSize + 'px';
        // マージンとパディングを完全に削除
        paperTitle.style.margin = '0';
        paperTitle.style.padding = '0';
    }
    
    // 著者・年度のフォントサイズ調整
    const paperMeta = document.querySelector('.paper-meta');
    if (paperMeta) {
        const fontSize = Math.max(10, Math.min(16, containerWidth * 0.015));
        paperMeta.style.fontSize = fontSize + 'px';
        // 上マージンを完全に削除
        paperMeta.style.marginTop = '0';
    }
    
    // カテゴリタグのフォントサイズ調整
    const categories = document.querySelectorAll('.paper-categories .category');
    categories.forEach(category => {
        const fontSize = Math.max(8, Math.min(14, containerWidth * 0.012));
        category.style.fontSize = fontSize + 'px';
        
        const padding = Math.max(2, Math.min(6, containerWidth * 0.006));
        category.style.padding = `${padding}px ${padding * 1.5}px`;
    });
}

// ユーティリティ関数：グローバルスコープで関数を使用可能にする
window.removeCategory = removeCategory;
window.removeImage = removeImage;