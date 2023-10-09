document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const darkModeToggle = document.getElementById('night-mode-toggle'); // assuming you have a button with this id
    const lightModePic = document. getElementById('LightModePic');
    const darkModePic = document. getElementById('NightModePic');

    
    // Check user's preference from local storage or other mechanisms
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Function to set the theme
    const setTheme = (isDarkMode) => {
        body.style.setProperty('--bg-color', isDarkMode ? 'var(--bg-color-dark)' : 'var(--bg-color-light)');
        body.style.setProperty('--second-bg-color', isDarkMode ? 'var(--second-bg-color-dark)' : 'var(--second-bg-color-light)');
        body.style.setProperty('--text-color', isDarkMode ? 'var(--text-color-dark)' : 'var(--text-color-light)');
        body.style.setProperty('--main-color', isDarkMode ? 'var(--main-color-dark)' : 'var(--main-color-light)');
        body.style.setProperty('--second-main-color', isDarkMode ? 'var(--second-main-color-dark)' : 'var(--second-main-color-light)');


        // Save the user's preference
        localStorage.setItem('darkMode', isDarkMode);

        darkModeToggle.textContent = isDarkMode ? 'Night Mode' : 'Light Mode';

        // Toggle visibility of images based on mode
        if (lightModePic !== null) {
            lightModePic.style.display = isDarkMode ? 'none' : 'block';
            darkModePic.style.display = isDarkMode ? 'block' : 'none';
        }
        
    };

    var card = document.getElementById('card');

    if (card !== null) {
        card.addEventListener( 'click', function() {
            card.classList.toggle('is-flipped');
        });
    }
   


    // Initial setup based on user preference
    setTheme(isDarkMode);

    // Event listener for dark mode toggle button
    darkModeToggle.addEventListener('click', function () {
        isDarkMode = !isDarkMode;
        setTheme(isDarkMode);
    });

    //Navbar
    let menuIcon = document.getElementById('menu-icon');
    let Navbar = document.getElementById('navbar');

    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        Navbar.classList.toggle('active');
    }

});

function addQuestionMark() {
    // Get the value of the question input
    const questionInput = document.getElementById('newQuestion');
    const questionValue = questionInput.value.trim();

    // Check if the question doesn't already end with a question mark
    if (questionValue.length > 0 && !questionValue.endsWith('?')) {
        // Append a question mark to the question input
        questionInput.value = questionValue + '?';
    }

    // Continue with the form submission
    return true;
}

