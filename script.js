// Variable to track Yes button size
let yesSize = 1;
// Flag to track if user has reached the end
let hasReachedEnd = false;
// Flag to track if audio has been initialized
let audioInitialized = false;
// Falling hearts interval
let heartsInterval;
// Content hidden state for page 4
let isContentHidden = false;

// 1. Set the initial background
document.body.classList.add('bg-1');

// Set default volume
const allAudio = document.querySelectorAll('audio');
allAudio.forEach(audio => audio.volume = 0.5);

/* --- ENABLE AUDIO & FADE IN PAGE 1 --- */
document.getElementById('startPrompt').addEventListener('click', function() {
    this.classList.add('prompt-hidden');
    const song0 = document.getElementById('song0');
    song0.play().catch(e => console.log("Audio play failed:", e));
    audioInitialized = true;

    // FADE IN ELEMENTS SLOWLY
    const hiddenElements = document.querySelectorAll('#page1 .hidden-content');
    const volumeCtrl = document.getElementById('volumeControl');
    
    // Slight delay before fading in
    setTimeout(() => {
        hiddenElements.forEach(el => el.classList.add('fade-in'));
        volumeCtrl.classList.add('fade-in');
    }, 500);
});

/* --- VOLUME CONTROLLER --- */
function changeVolume(value) {
    allAudio.forEach(audio => {
        audio.volume = value;
    });
}

/* --- FALLING HEARTS LOGIC --- */
function createHeart(textures) {
    const heart = document.createElement('img');
    const randomTexture = textures[Math.floor(Math.random() * textures.length)];
    heart.src = randomTexture; 
    heart.classList.add('falling-heart');
    heart.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 40 + 20;
    heart.style.width = size + 'px';
    heart.style.height = 'auto';
    const duration = Math.random() * 5 + 3;
    heart.style.animationDuration = duration + 's';
    document.getElementById('heartsContainer').appendChild(heart);
    setTimeout(() => { heart.remove(); }, duration * 1000);
}

function startHearts(page) {
    let textures = [];
    if (page === 'page2') {
        textures = ['images/heart1.png', 'images/heart2.png', 'images/heart3.png', 'images/heart4.png', 'images/heart5.png', 'images/heart6.png', 'images/heart7.png'];
    } else if (page === 'page3') {
        textures = ['images/heart8.png', 'images/heart9.png', 'images/heart10.png', 'images/heart11.png', 'images/heart12.png', 'images/heart13.png', 'images/heart14.png'];
    } else { return; }

    if (heartsInterval) clearInterval(heartsInterval);
    heartsInterval = setInterval(() => { createHeart(textures); }, 300);
}

function stopHearts() {
    if (heartsInterval) { clearInterval(heartsInterval); heartsInterval = null; }
    document.getElementById('heartsContainer').innerHTML = '';
}

/* --- TOGGLE CONTENT ON PAGE 4 --- */
function togglePage4Content() {
    const content = document.getElementById('page4Content');
    const btnIcon = document.querySelector('#hideContentBtn i');
    
    if (isContentHidden) {
        // Show content
        content.classList.add('fade-in');
        btnIcon.className = 'fas fa-eye-slash';
        isContentHidden = false;
    } else {
        // Hide content
        content.classList.remove('fade-in');
        btnIcon.className = 'fas fa-eye';
        isContentHidden = true;
    }
}

/* --- NAVIGATION LOGIC --- */

function goToPage2() {
    document.getElementById('page1').classList.remove('active');
    document.getElementById('page2').classList.add('active');
    document.body.className = 'bg-2';
    
    const song0 = document.getElementById('song0');
    const song1 = document.getElementById('song1');
    if(!song0.paused) { song0.pause(); song0.currentTime = 0; }
    song1.play();
    
    startSlideshow();
    startHearts('page2');
}

function goBackToPage1() {
    document.getElementById('page2').classList.remove('active');
    document.getElementById('page1').classList.add('active');
    document.body.className = 'bg-1';
    
    const song0 = document.getElementById('song0');
    const song1 = document.getElementById('song1');
    song1.pause(); song1.currentTime = 0;
    if(audioInitialized) song0.play();
    
    stopHearts();
}

function goToPage3() {
    document.getElementById('page2').classList.remove('active');
    document.getElementById('page3').classList.add('active');
    document.body.className = 'bg-3';
    
    yesSize = 1;
    document.getElementById('yesBtn').style.transform = `scale(1)`;
    
    if (hasReachedEnd) {
        document.getElementById('page3Nav').classList.add('show-nav');
    }
    startHearts('page3');
}

function goBackToPage2() {
    document.getElementById('page3').classList.remove('active');
    document.getElementById('page2').classList.add('active');
    document.body.className = 'bg-2';
    startHearts('page2');
}

/* PAGE 3 to PAGE 4 (With Delay) */
function goToPage4() {
    document.getElementById('page3').classList.remove('active');
    document.getElementById('page4').classList.add('active');
    document.body.className = 'bg-4';
    
    hasReachedEnd = true;
    document.getElementById('song1').pause();
    document.getElementById('song2').play();
    
    stopHearts();

    // DELAY CONTENT APPEARANCE
    const content = document.getElementById('page4Content');
    content.classList.remove('fade-in');
    
    setTimeout(() => {
        content.classList.add('fade-in');
    }, 2500);
}

function goBackToPage3() {
    document.getElementById('page4').classList.remove('active');
    document.getElementById('page3').classList.add('active');
    document.body.className = 'bg-3';
    
    const song1 = document.getElementById('song1');
    const song2 = document.getElementById('song2');
    song2.pause(); song2.currentTime = 0;
    song1.play();
    
    yesSize = 1;
    document.getElementById('yesBtn').style.transform = `scale(1)`;
    document.getElementById('page3Nav').classList.add('show-nav');
    
    startHearts('page3');
}

/* --- SLIDESHOW & SMOOTH CAPTIONS LOGIC --- */
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const captionElement = document.getElementById('slideCaption');

// 67 CAPTIONS (Edit these!)
const slideCaptions = [
    "Ты домашняя", "Самая красивая", "Самая горячая", "Лучше всех красишься", "У тебя самые красивые глаза",
    "Ты самая чувственная", "Ты семейная", "Ты лучший врач", "У тебя самые пухлые губки", "Ты самая любящая",
    "Даришь самые милые подарки", "Ты самая милая", "Ты многокультурная", "Вкуснее всех готовишь", "Ты моя маленькая принцесса",
    "Самые мягкие пяточки", "Самая родная", "У тебя длинные ножки", "И самые красивые тоже", "Ты самая веселая",
    "Самая забавная", "Самая любимая", "Самая стильная", "С тобой не соскучишься", "Самая искренняя",
    "Ты сладкоежка", "Самая сексуальная", "Ты момо", "Ты шикарная", "Хозяйственная",
    "Лучше всех рисуешь", "Фанатка макана", "Ты ангел", "Ты славянка", "Хайпонутая",
    "Чуть-чуть армянка", "Ты мое солнышко", "Лучшая мама", "Похожа на Бибера", "Ты моя снежинка",
    "Самая нежная", "Ты моя радость", "Завозная", "У тебя лучшая фигура", "Ты богиня",
    "Ты моя девочка", "Моя мисс вселенная", "Ты мой мир", "Мой самый дорогой человек", "Моя любовь",
    "Самая серьезная", "Артистка", "Живописная", "Фотогеничная", "Готовишь самые вкусные роллы",
    "Косплеерша", "Делаешь лучшую пиццу", "Ты самая верная", "Немножко пикми", "Забивная",
    "Жизнерадостная", "Ты ИДЕАЛЬНАЯ", "Хорошо красишь потолки", "Работящая", "Волшебная",
    "Тебе идут очки", "У тебя самая красивая улыбка"
];

function updateCaption() {
    if(captionElement && slideCaptions[currentSlide]) {
        captionElement.innerText = slideCaptions[currentSlide];
    }
}

function startSlideshow() {
    if(slides.length > 0) {
        slides[0].classList.add('active');
        updateCaption(); // Set initial caption
    }
    if (window.slideInterval) clearInterval(window.slideInterval);
    window.slideInterval = setInterval(() => {
        // 1. Hide current slide
        slides[currentSlide].classList.remove('active');
        
        // 2. Hide current caption (Fade Out)
        captionElement.classList.add('fade-text-out');
        
        // 3. Wait 500ms (half the transition), then switch content
        setTimeout(() => {
            // Update Slide Index
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Show New Slide
            slides[currentSlide].classList.add('active');
            
            // Update Text
            updateCaption();
            
            // Show New Caption (Fade In)
            captionElement.classList.remove('fade-text-out');
        }, 500); // 500ms delay for smooth text transition
        
    }, 3000); 
}

function growYes() {
    yesSize += 0.2; 
    const yesBtn = document.getElementById('yesBtn');
    yesBtn.style.transform = `scale(${yesSize})`;
}
