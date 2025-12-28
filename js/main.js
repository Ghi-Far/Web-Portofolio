/* ==========================================================================
   1. GLOBAL VARIABLES (PLAYLIST SYSTEM)
   ========================================================================== */
let playlistAudio = null;
let playlistBtn = null;


/* ==========================================================================
   2. SCROLLSPY SYSTEM
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                const activeLink = document.querySelector(`.sidebar a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3 
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});


/* ==========================================================================
   3. MEDIA NAVIGATION SYSTEM (VIDEO, GAMBAR, MUSIK)
   ========================================================================== */
function openMedia(type) {
    const navContainer = document.getElementById('mediaNav');
    const navItems = document.querySelectorAll('.nav-item');
    const contentWrapper = document.getElementById('mediaContent');
    const backButton = document.getElementById('backButton');
    
    const videoPanel = document.getElementById('content-video');
    const fotoPanel = document.getElementById('content-foto');
    const musikPanel = document.getElementById('content-musik');

    if (navContainer) navContainer.classList.add('active-mode');

    navItems.forEach(item => {
        if(item.getAttribute('data-type') === type) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });

    if (contentWrapper) contentWrapper.classList.add('show-content');
    
    if(videoPanel) videoPanel.style.display = 'none';
    if(fotoPanel) fotoPanel.style.display = 'none';
    if(musikPanel) musikPanel.style.display = 'none';

    if (type === 'video' && videoPanel) videoPanel.style.display = 'block';
    if (type === 'foto' && fotoPanel) fotoPanel.style.display = 'block';
    if (type === 'musik' && musikPanel) musikPanel.style.display = 'block';

    if (backButton) backButton.classList.add('show');
}

function closeMedia() {
    const navContainer = document.getElementById('mediaNav');
    const navItems = document.querySelectorAll('.nav-item');
    const contentWrapper = document.getElementById('mediaContent');
    const backButton = document.getElementById('backButton');

    if (playlistAudio) {
        playlistAudio.pause();
        playlistAudio.currentTime = 0;
        resetPlaylistUI();
    }

    if (navContainer) navContainer.classList.remove('active-mode');

    navItems.forEach(item => {
        item.classList.remove('selected');
    });

    if (contentWrapper) contentWrapper.classList.remove('show-content');
    if (backButton) backButton.classList.remove('show');
}


/* ==========================================================================
   4. PLAYLIST AUDIO PLAYER (MEDIA > MUSIK)
   ========================================================================== */
function playAudio(element, filePath, displayName) {
    const vizContainer = document.querySelector('.viz-screen');
    const icon = element.querySelector('.track-icon');
    const titleDisplay = document.getElementById('currentTrackName');

    if (playlistBtn === element) {
        if (playlistAudio.paused) {
            playlistAudio.play();
            vizContainer.classList.add('playing');
            icon.innerText = '||'; 
            pauseBGM(); 
        } else {
            playlistAudio.pause();
            vizContainer.classList.remove('playing');
            icon.innerText = '▶';
            playBGM(); 
        }
        return;
    }

    if (playlistAudio) {
        playlistAudio.pause();
        playlistAudio.currentTime = 0;
    }
    
    if (playlistBtn) {
        playlistBtn.classList.remove('active');
        playlistBtn.querySelector('.track-icon').innerText = '▶';
    }

    playlistAudio = new Audio(filePath);
    playlistBtn = element;

    const volSlider = document.getElementById('volumeSlider');
    if(volSlider) {
        playlistAudio.volume = volSlider.value;
    }

    element.classList.add('active');
    titleDisplay.innerText = displayName ? displayName : filePath;
    icon.innerText = '||'; 
    
    vizContainer.classList.add('playing');
    
    pauseBGM();

    playlistAudio.play().catch(error => {
        console.error("Gagal memutar audio playlist:", error);
    });

    playlistAudio.onended = function() {
        resetPlaylistUI();
        playBGM();
    };
}

function setVolume(value) {
    if (playlistAudio) {
        playlistAudio.volume = value;
    }
    const percent = Math.round(value * 100) + "%";
    const volValue = document.getElementById('volValue');
    if (volValue) volValue.innerText = percent;
}

function resetPlaylistUI() {
    const vizContainer = document.querySelector('.viz-screen');
    const titleDisplay = document.getElementById('currentTrackName');
    
    if (vizContainer) vizContainer.classList.remove('playing');
    if (titleDisplay) titleDisplay.innerText = "NO_AUDIO_SELECTED";
    
    if (playlistBtn) {
        playlistBtn.classList.remove('active');
        playlistBtn.querySelector('.track-icon').innerText = '▶';
        playlistBtn = null;
    }
    playlistAudio = null;
}


/* ==========================================================================
   5. PORTFOLIO SYSTEM (FILTER & LIGHTBOX)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const karyaItems = document.querySelectorAll('.karya-item');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                karyaItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    
    if (lightbox) {
        karyaItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.karya-img');
                const title = item.querySelector('.karya-item-title').textContent;
                
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxCaption.textContent = title;
                    lightbox.classList.add('active');
                }
            });
        });
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
});


/* ==========================================================================
   6. BACKGROUND MUSIC (BGM) SYSTEM
   ========================================================================== */
const bgmAudio = document.getElementById("bg-music");
const bgmStatusText = document.getElementById("music-status");
const bgmEqualizer = document.querySelector(".equalizer");
let isBgmPlaying = false;

function playBGM() {
    if (bgmAudio && bgmAudio.paused) {
        bgmAudio.volume = 0.3;
        bgmAudio.play().then(() => {
            isBgmPlaying = true;
            updateBgmUI(true);
        }).catch(e => console.log("BGM menunggu interaksi user"));
    }
}

function pauseBGM() {
    if (bgmAudio && !bgmAudio.paused) {
        bgmAudio.pause();
        isBgmPlaying = false;
        updateBgmUI(false);
    }
}

function updateBgmUI(isPlaying) {
    if (!bgmStatusText || !bgmEqualizer) return;
    
    if (isPlaying) {
        bgmStatusText.innerText = "BGM // ONLINE";
        bgmEqualizer.classList.add("animating");
        bgmStatusText.style.color = "#ffcc00";
    } else {
        bgmStatusText.innerText = "BGM // PAUSED";
        bgmEqualizer.classList.remove("animating");
        bgmStatusText.style.color = "#666";
    }
}

function toggleMusic() {
    if (isBgmPlaying) {
        pauseBGM();
    } else {
        if (playlistAudio) {
            playlistAudio.pause();
            resetPlaylistUI();
        }
        playBGM();
    }
}

window.addEventListener('load', function() {
    if (!bgmAudio) return;

    bgmAudio.volume = 0.3;

    let promise = bgmAudio.play();

    if (promise !== undefined) {
        promise.then(_ => {
            isBgmPlaying = true;
            updateBgmUI(true);
        }).catch(error => {
            document.body.addEventListener('click', function() {
                if(!isBgmPlaying && (!playlistAudio || playlistAudio.paused)){
                    playBGM();
                }
            }, { once: true });
        });
    }
});


/* ==========================================================================
   7. HYBRID SIDEBAR SYSTEM
   ========================================================================== */
function toggleSidebar() {
    const sidebar = document.getElementById('mainSidebar');
    const toggleBtn = document.getElementById('menuToggle');
    const overlay = document.getElementById('menuOverlay');
    
    sidebar.classList.toggle('mobile-active');
    toggleBtn.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeSidebarOnMobile() {
    if (window.innerWidth <= 900) {
        const sidebar = document.getElementById('mainSidebar');
        const toggleBtn = document.getElementById('menuToggle');
        const overlay = document.getElementById('menuOverlay');
        
        sidebar.classList.remove('mobile-active');
        toggleBtn.classList.remove('active');
        overlay.classList.remove('active');
    }
}