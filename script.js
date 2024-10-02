function startQuiz() {
    const loggedIn = localStorage.getItem('loggedIn'); // Check login status
    if (loggedIn) {
        window.location.href = 'quiz.html'; // Redirect to quiz page
    } else {
        window.location.href = 'login.html'; // Redirect to login page
    }
}
function Profileopen() {
    const loggedIn = localStorage.getItem('loggedIn'); // Check login status
    if (loggedIn) {
        window.location.href = 'profile.html'; // Redirect to quiz page
    } else {
        window.location.href = 'login.html'; // Redirect to login page
    }
}
