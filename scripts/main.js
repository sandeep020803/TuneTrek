document.addEventListener('DOMContentLoaded', function() {
    // ==================== AUTHENTICATION SECTION ====================
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
        window.location.href = 'login.html';
        return; // Stop execution if redirecting to login
    }

    // Update user profile in the header
    if (currentUser) {
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.querySelector('img').src = currentUser.profilePic || 'assets/images/profile.jpg';
            const usernameSpan = userProfile.querySelector('span');
            if (usernameSpan) {
                usernameSpan.textContent = currentUser.username || 'User';
            }
        }
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // ==================== MUSIC PLAYER SECTION ====================
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.querySelector('.fa-pause-circle');
    const progressBar = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-container');
    const currentTimeEl = document.querySelector('.time:first-child');
    const durationEl = document.querySelector('.time:last-child');
    const volumeBar = document.querySelector('.volume-progress');
    const volumeContainer = document.querySelector('.volume-bar');
    const prevBtn = document.querySelector('.fa-step-backward');
    const nextBtn = document.querySelector('.fa-step-forward');
    const randomBtn = document.querySelector('.fa-random');
    const repeatBtn = document.querySelector('.fa-redo');
    const songTitle = document.querySelector('.song-details h4');
    const songArtist = document.querySelector('.song-details p');
    const songCover = document.querySelector('.song-info img');
    const heartIcon = document.querySelector('.far.fa-heart');
    
    // Song data
    const songs = [
        {
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            cover: 'assets/images/cover1.jpg',
            audio: 'assets/audio/song1.mp3'
        },
        {
            title: 'Save Your Tears',
            artist: 'The Weeknd',
            cover: 'assets/images/cover2.jpg',
            audio: 'assets/audio/song2.mp3'
        },
        {
            title: 'Starboy',
            artist: 'The Weeknd, Daft Punk',
            cover: 'assets/images/cover3.jpg',
            audio: 'assets/audio/song3.mp3'
        },
        {
            title: 'Sajni Re',
            artist: 'Arijit Singh',
            cover: 'assets/images/cover4.jpeg',
            audio: 'assets/audio/song4.mp3'
        },
        {
            title: 'Chool lo',
            artist: 'The Local Train',
            cover: 'assets/images/cover5.jpeg',
            audio: 'assets/audio/song5.mp3'
        }
    ];
    
    let currentSongIndex = 0;
    let isPlaying = false;
    let isRandom = false;
    let isRepeat = false;
    
    // Initialize player
    function loadSong(song) {
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        songCover.src = song.cover;
        audioPlayer.src = song.audio;
    }
    
    // Play song
    function playSong() {
        isPlaying = true;
        playPauseBtn.classList.replace('fa-play-circle', 'fa-pause-circle');
        audioPlayer.play();
    }
    
    // Pause song
    function pauseSong() {
        isPlaying = false;
        playPauseBtn.classList.replace('fa-pause-circle', 'fa-play-circle');
        audioPlayer.pause();
    }
    
    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(songs[currentSongIndex]);
        if (isPlaying) {
            playSong();
        }
    }
    
    // Next song
    function nextSong() {
        if (isRandom) {
            const randomIndex = Math.floor(Math.random() * songs.length);
            currentSongIndex = randomIndex;
        } else {
            currentSongIndex++;
            if (currentSongIndex > songs.length - 1) {
                currentSongIndex = 0;
            }
        }
        loadSong(songs[currentSongIndex]);
        if (isPlaying) {
            playSong();
        }
    }
    
    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update time display
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`;
        }
        
        if (duration) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
        
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`;
        }
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }
    
    // Set progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }
    
    // Set volume
    function setVolume(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const volume = clickX / width;
        audioPlayer.volume = volume;
        volumeBar.style.width = `${volume * 100}%`;
        
        // Update volume icon
        const volumeIcon = document.querySelector('.volume-control i');
        if (volume === 0) {
            volumeIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
        } else {
            volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
        }
    }
    
    // Toggle random
    function toggleRandom() {
        isRandom = !isRandom;
        randomBtn.style.color = isRandom ? '#1db954' : '#b3b3b3';
    }
    
    // Toggle repeat
    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatBtn.style.color = isRepeat ? '#1db954' : '#b3b3b3';
        audioPlayer.loop = isRepeat;
    }
    
    // Toggle like
    function toggleLike() {
        heartIcon.classList.toggle('far');
        heartIcon.classList.toggle('fas');
        heartIcon.style.color = heartIcon.classList.contains('fas') ? '#1db954' : '#b3b3b3';
    }
    
    // Event listeners
    playPauseBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });
    
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    randomBtn.addEventListener('click', toggleRandom);
    repeatBtn.addEventListener('click', toggleRepeat);
    heartIcon.addEventListener('click', toggleLike);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    progressContainer.addEventListener('click', setProgress);
    volumeContainer.addEventListener('click', setVolume);
    
    // Load first song
    loadSong(songs[currentSongIndex]);
    
    // Play playlist cards on click
    const playlistCards = document.querySelectorAll('.playlist-card, .album-card');
    playlistCards.forEach(card => {
        card.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * songs.length);
            currentSongIndex = randomIndex;
            loadSong(songs[currentSongIndex]);
            playSong();
        });
    });

    // ==================== SIDEBAR NAVIGATION SECTION ====================
    // Sidebar navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the section name
            const section = this.querySelector('span').textContent.trim();
            
            // Show/hide sections based on selection
            const sections = document.querySelectorAll('.content > section');
            sections.forEach(sec => {
                sec.style.display = 'none';
            });
            
            if (section === 'Home') {
                document.querySelector('.greeting').style.display = 'block';
                document.querySelector('.recently-played').style.display = 'block';
            } else if (section === 'Search') {
                const searchSection = document.createElement('section');
                searchSection.className = 'search-section';
                searchSection.innerHTML = `
                    <h2>Search</h2>
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="What do you want to listen to?">
                    </div>
                    <div class="search-results">
                        <!-- Search results would go here -->
                    </div>
                `;
                document.querySelector('.content').appendChild(searchSection);
                searchSection.style.display = 'block';
            } else if (section === 'Your Library') {
                const librarySection = document.createElement('section');
                librarySection.className = 'library-section';
                librarySection.innerHTML = `
                    <h2>Your Library</h2>
                    <div class="library-content">
                        <p>Your saved songs and playlists will appear here</p>
                    </div>
                `;
                document.querySelector('.content').appendChild(librarySection);
                librarySection.style.display = 'block';
            }
        });
    });

    // Playlist creation functionality
    const createPlaylist = document.querySelector('.create-playlist');
    if (createPlaylist) {
        createPlaylist.addEventListener('click', function() {
            const playlistName = prompt('Enter playlist name:');
            if (playlistName) {
                const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
                playlists.push({
                    name: playlistName,
                    songs: []
                });
                localStorage.setItem('playlists', JSON.stringify(playlists));
                
                // Update the UI
                const playlistList = document.querySelector('.user-playlists ul');
                const newPlaylist = document.createElement('li');
                newPlaylist.textContent = playlistName;
                playlistList.appendChild(newPlaylist);
            }
        });
    }

    // Liked songs functionality
    const likedSongs = document.querySelector('.liked-songs');
    if (likedSongs) {
        likedSongs.addEventListener('click', function() {
            alert('Showing your liked songs');
        });
    }
});