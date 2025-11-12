// Function to show modal with a message and optional redirect
function showModal(message, redirectUrl = null) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    if (modalMessage) {
        modalMessage.textContent = message;
    }
    modal.style.display = 'block';

    if (redirectUrl) {
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 3000);
    }
}

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active'); // Toggle the active class
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Add event listener to close the modal when the user clicks on <span> (x)
const closeSpan = document.getElementsByClassName('close')[0];
if (closeSpan) {
    closeSpan.addEventListener('click', closeModal);
}

// Close the modal when clicking outside of the modal
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Update your logout functionality in script.js
document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Clear all auth-related data
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem('selectedMovieId');
            localStorage.removeItem('pname'); // Clear user's name
            localStorage.removeItem('pemail'); // Clear user's email
            localStorage.removeItem('userEmail'); // Clear user email for password reset
            localStorage.removeItem('pto'); // Clear OTP
            localStorage.removeItem('exp'); // Clear OTP expiration time
            
            // showModal('Successfully logged out. Thank you!');
            
            // Replace the current history state
            window.history.replaceState(null, '', 'index.html');
            
            // Clear browser history and redirect
            window.location.replace('index.html');
            
        });
    }
});



// Prevent back navigation to protected pages after logout
window.addEventListener('popstate', function(event) {
    const protectedPaths = ['/home.html', '/player.html', '/about.html','/kannada.html','/telugu.html','/tamil.html','/hindi.html','/english.html'];
    const currentPath = window.location.pathname;

    // Check if trying to access protected page without valid token
    const token = localStorage.getItem('authToken');
    const expirationTime = localStorage.getItem('tokenExpiration');

    if (protectedPaths.some(path => currentPath.includes(path))) {
        if (!token || (expirationTime && Date.now() > expirationTime)) {
            window.location.replace('home.html'); // Redirect to login
        }
    }
});

//this meta tag to your HTML files to prevent caching of protected pages
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.match(/(home|player|about)\.html/)) {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'Cache-Control');
        meta.setAttribute('content', 'no-cache, no-store, must-revalidate');
        document.head.appendChild(meta);
    }
});



// Login function
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from submitting the traditional way

         // Get the button element and disable it
        const loginButton = document.getElementById('loginButton');
        loginButton.disabled = true; // Disable the login button to prevent multiple submissions
        loginButton.textContent = 'Logging in...'; // Change button text for feedback

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://filmyadda.sudeepbro.works/.netlify/functions/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('pname', data.name); // Store the user's name
            localStorage.setItem('pemail', data.email); // Store the user's email

            localStorage.setItem('authToken', data.token); // Store the token
             // Set expiration time for the token (5 hours in milliseconds)
             const expirationTime = Date.now() + (5 * 60 * 60 * 1000);
             localStorage.setItem('tokenExpiration', expirationTime);
            showModal('Login successful! Redirecting to home...', 'home.html');
        } else {
            showModal('Invalid username or password.');
        }
    } catch (error) {
        console.log('Login Error:', error);
        showModal('Server Down Contact Develpoer or Try Again Later');
    } finally {
        loginButton.disabled = false; // Re-enable the login button
        loginButton.textContent = 'Login'; // Reset button text
    }
});
}

// Register function
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from submitting the traditional way
       
        // Get the button element and disable it
        const registerButton = document.getElementById('registerButton');
        registerButton.disabled = true; // Disable the button
        registerButton.textContent = 'Registering...'; // Change button text for feedback
       
        const fullname = document.getElementById('fullname').value; // Ensure you have this input in your HTML
        const email = document.getElementById('email').value; // Ensure you have this input in your HTML
        const username = document.getElementById('username').value; // Ensure you have this input in your HTML
        const password = document.getElementById('password').value; // Ensure you have this input in your HTML

          // Password validation rule: Minimum 8 characters and at least 1 special symbol
          const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;

        if (!passwordRegex.test(password)) {
            passwordError.innerHTML = "<span style='color: red;'>Invalid Password <br>  * Mim 8 characters <br> * One special symbol (!@#$%^&*).</span>";
            hasError = true;`1`
            registerButton.disabled = false; // Re-enable the button if validation fails
            registerButton.textContent = 'Register'; // Reset button text
            return;
        }else {
            passwordError.innerHTML = ""; // Clear password error if valid
        }
        

    try {
        const response = await fetch('https://filmyadda.sudeepbro.works/.netlify/functions/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, fullname, email })
        });

        if (response.ok) {
            showModal('Registration successful! Redirecting to login...', 'login.html');
        } else {
            const error = await response.text();
            showModal(`Registration failed:
                Username, fullname, or email already exists`);
        }
    } catch (error) {
        console.error('Registration Error:', error);
        showModal('Server Down Contact Develpoer or Try Again Later');
    }finally {
        // Re-enable the button after the request is complete
        registerButton.disabled = false; // Re-enable the button
        registerButton.textContent = 'Register'; // Reset button text
    }
});
}

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeSpan = document.getElementsByClassName('close')[3];

    // Close the modal when the close button is clicked
    if (closeSpan) {
        closeSpan.onclick = function () {
            modal.style.display = 'none';
        }
    }

    // Close the modal when clicking outside of the modal
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});

// Function to fetch the movie details from the backend

function selectMovie(movieId) {
    // Store the selected movie ID in localStorage
    localStorage.setItem('selectedMovieId', movieId);
    
    // Redirect to the player page
    window.location.href = 'player.html';
}

// Function to fetch the movie details from the backend
async function fetchMovieDetails() {
    const movieId = localStorage.getItem('selectedMovieId');
    
    if (!movieId) {
        showModal('Server Down Contact Develpoer or Try Again Later');
        return;
    }

    try {
        const response = await fetch('https://filmyadda.sudeepbro.works/.netlify/functions/getVideoDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: parseInt(movieId) }) // Ensure movieId is sent as a number
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Update the video player
        const movieTitle = document.getElementById('movieTitle');
        const videoSource = document.getElementById('videoSource');
        const videoPlayer = document.getElementById('videoPlayer');

        if (movieTitle && data.title) {
            movieTitle.textContent = data.title;
        }

        if (videoSource && videoPlayer && data.source) {
            videoSource.src = data.source;
            videoPlayer.load(); // Reload the video player with new source
            videoPlayer.play();
        }

    } catch (error) {
        console.log('Error fetching movie details:', error);
        showModal(`Server Down Contact Develpoer or Try Again Later`);
    }
}
// Call fetchMovie Details only on the player.html page
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.endsWith('player.html')) {
        fetchMovieDetails(); 
    }
});



// Title bar auto heading
document.addEventListener('DOMContentLoaded', function () {
    var movieTitleElement = document.getElementById('movieTitle');
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                document.title = movieTitleElement.innerText; // Update document title
            }
        });
    });
    observer.observe(movieTitleElement, { childList: true });
});

// Video player functionality
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('videoPlayer');
    const playPauseButton = document.getElementById('playPauseButton');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const controls = document.querySelector('.controls');
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    const seekBar = document.getElementById('seekBar');
    const volumeControl = document.getElementById('volumeControl');
    let controlsTimeout;

    // Function to show/hide controls
    function showControls() {
        controls.classList.add('visible'); // Show controls
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }
        controlsTimeout = setTimeout(() => {
            controls.classList.remove('visible'); // Hide after timeout
        }, 4000);
    }

    // Function to toggle play/pause
    function togglePlayPause() {
        if (video.paused) {
            video.play();
        } else if (!video.paused) {
            video.pause();
        }
    }

    // Hide default controls
    video.controls = false; // Disable default controls

    video.addEventListener('play', () => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
    });

    video.addEventListener('pause', () => {
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
    });

    video.addEventListener('click', togglePlayPause);

    playPauseButton.addEventListener('click', togglePlayPause);

    video.addEventListener('mousemove', showControls);
    controls.addEventListener('mousemove', showControls);

    fullScreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            video.requestFullscreen(); 
            showControls();
            controls.classList.add('visible'); // Ensure controls are visible in full-screen
        } else {
            document.exitFullscreen();
            controls.classList.remove('visible'); // Hide controls when exiting full-screen
        }
    });

   


    // Update the seek bar as the video plays
    video.addEventListener('timeupdate', () => {
        const percentage = (video.currentTime / video.duration) * 100;
        seekBar.value = percentage || 0;
    });

    // Seek the video when the seek bar value changes
    seekBar.addEventListener('input', () => {
        const seekTime = (seekBar.value / 100) * video.duration;
        video.currentTime = seekTime;
    });

    // Spacebar for play/pause and arrow keys for seek
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // Prevent scrolling the page
            togglePlayPause();
        }
        if (event.code === 'ArrowLeft') {
            video.currentTime = Math.max(0, video.currentTime - 10);
        }
        if (event.code === 'ArrowRight') {
            video.currentTime = Math.min(video.duration, video.currentTime + 10);
        }
        // Toggle full screen with "F" key
        if (event.code === 'KeyF') {
            if (!document.fullscreenElement) {
                video.requestFullscreen();
                controls.classList.add('visible'); // Ensure controls are visible in full-screen
            } else {
                document.exitFullscreen();
                controls.classList.remove('visible'); // Hide controls when exiting full-screen
            }
        }
    });

    // Handle volume control
    volumeControl.addEventListener('input', () => {
        video.volume = volumeControl.value / 100; // Set volume as a percentage
    });

    showControls(); // Show controls when the page loads
});


let movieList = [];

// Load movies from movies.json
async function loadMovies() {
    try {
        const response = await fetch('movies.json'); // Ensure the path is correct
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        movieList = await response.json();
        console.log('Movies loaded:', movieList); // Log loaded movies for debugging
    } catch (error) {
        console.error('Error loading movie list:', error);
    }
}

// Filter movies based on user input
function filterMovies() {
    const searchInput = document.getElementById('search-Input').value.toLowerCase();
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = ''; // Clear previous results

    // Filter the movie list
    const filteredMovies = movieList.filter(movie => 
        movie.title.toLowerCase().includes(searchInput)
    );

    console.log('Filtered Movies:', JSON.stringify(filteredMovies, null, 2)); // Pretty print the movies
   
    if (filteredMovies.length > 0) {
   // Display filtered results
        filteredMovies.forEach(movie => {
            const resultItem = document.createElement('div');
            resultItem.textContent = movie.title; // Display movie title
            resultItem.classList.add('suggestion-item');

            // Add click event for movie selection
            resultItem.addEventListener('click', () => {
                localStorage.setItem('selectedMovieId', movie.id); // Store movie ID in local storage
                selectMovie(movie.id); // Call selectMovie function to navigate to player page
            });
            searchResults.appendChild(resultItem);
        });
    } else {
        // If no results found, display a message
        const noResultsItem = document.createElement('div');
        noResultsItem.textContent = 'No results found'; // Message for no results
        noResultsItem.classList.add('no-results'); // Add the no-results class for styling
        searchResults.appendChild(noResultsItem);
    }

    // Show or hide results based on matches
    searchResults.style.display = 'block' ;
}


document.addEventListener('DOMContentLoaded', function() {
    loadMovies(); // Load movies when the DOM is ready

    // Add event listener for search input
    const searchInput = document.getElementById('search-Input');
    if (searchInput) {
        searchInput.addEventListener('input', filterMovies); // Call filterMovies on input
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadMovies(); // Load movies when the DOM is ready

    // Add event listener for search input
    const searchInput = document.getElementById('search-Input');
    const searchResults = document.getElementById('search-results');
    let debounceTimer;

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(filterMovies, 300); // Delay of 300ms
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!searchResults.contains(event.target) && event.target !== searchInput) {
                searchResults.style.display = 'none'; // Hide the dropdown if clicked outside
            }
        });
    }
});


// Function to select the movie and redirect
function selectMovie(movieId) {
    localStorage.setItem('selectedMovieId', movieId); // Store selected movie ID
    window.location.href = 'player.html'; // Redirect to the player page
}





// send OTP
document.getElementById('SendLink').addEventListener('click', async function (e) {
    e.preventDefault();
    const button = e.target;
    const email = document.getElementById('Email').value.trim();

    if (!email) {
        showModal('Please enter a valid email.');
        return;
    }

    // Disable button and show loading text
    button.disabled = true;
    button.innerText = 'Sending OTP...';

    try {
        const response = await fetch('https://filmyadda.sudeepbro.works/.netlify/functions/sendResetEmail?action=forgotPassword',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem ("userEmail", email); // Store email in local storage
            // Show success message and redirect to login.html after 3 seconds
            showModal('Email sent successfully! Please check your inbox.', 'otp.html');
        } else {
            showModal(data.message || 'An error occurred. Try again.');
        }
    } catch (error) {
        showModal('Failed to send reset link. Please try again.');
    } finally {
        // Re-enable button
        button.disabled = false;
        button.innerText = 'Send Link';
    }
});



// send OTP
document.getElementById('SendLink').addEventListener('click', async function (e) {
    e.preventDefault();
    const button = e.target;
    const email = document.getElementById('Email').value.trim();

    if (!email) {
        showModal('Please enter a valid email.');
        return;
    }

    // Disable button and show loading text
    button.disabled = true;
    button.innerText = 'Sending OTP...';

    try {
        const response = await fetch('https://filmyadda.sudeepbro.works/.netlify/functions/sendResetEmail?action=forgotPassword',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
        
                const { otp, expiresAt } = data;  // Extract from response
                
                localStorage.setItem("userEmail", email);
                localStorage.setItem("pto", otp);
                localStorage.setItem("exp", expiresAt);
                

                showModal('Email sent successfully! Please check your inbox.', 'otp.html');
        } else {
            showModal(data.message || 'An error occurred. Try again.');
        }
    } catch (error) {
        showModal('Failed to send reset link. Please try again.');
    } finally {
        // Re-enable button
        button.disabled = false;
        button.innerText = 'Send Link';
    }
});


// OTP verification
const otpForm = document.getElementById('otpForm');
if (otpForm) {
    otpForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form submission

        const verifyButton = document.getElementById('verify');
        const userotp = document.getElementById('otpInput').value.trim();
        const storedOtp = localStorage.getItem('pto');
        const expiryTime = localStorage.getItem('exp');

        verifyButton.disabled = true;
        verifyButton.textContent = 'Verifying...';

        if (!userotp) {
            showModal('Please enter the OTP.');
            resetButton();
            return;
        }

        if (!storedOtp || !expiryTime) {
            showModal('OTP not found. Please request a new one.');
            resetButton();
            return;
        }

        const currentTime = Date.now();

        if (currentTime > parseInt(expiryTime)) {
            showModal('OTP has expired. Please request a new one.');
            // Clear expired OTP
            localStorage.removeItem('pto');
            localStorage.removeItem('exp');
            resetButton();
            return;
        }

        if (userotp === storedOtp) {
            showModal('OTP verified successfully! Redirecting...', 'reset.html');
            // Clear OTP after successful verification
            localStorage.removeItem('pto');
            localStorage.removeItem('exp');
        } else {
            showModal('Invalid OTP. Please try again.');
            resetButton();
        }

        function resetButton() {
            verifyButton.disabled = false;
            verifyButton.textContent = 'Verify';
        }
    });
}


