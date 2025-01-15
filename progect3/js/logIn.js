const email_input = document.getElementById("email_input")
console.log(email_input);

const password_input = document.getElementById("password_input")


const form = document.getElementById("login_form");




    document.getElementById('login_form').addEventListener('submit', function (event) {

        event.preventDefault();



        // Get input values
        const email = document.getElementById('email_input').value.trim();
        const password = document.getElementById('password_input').value;



        // Retrieve existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the email and password match a user
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            alert(`Welcome, ${user.name}!`);
            // Save logged-in state to session storage
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = "./index.html";


        } else {
            alert('Invalid email or password!');
        }

    });
