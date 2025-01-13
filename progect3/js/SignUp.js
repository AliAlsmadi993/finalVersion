const userName_input = document.getElementById("userName_input")
const email_input = document.getElementById("email_input")
const password_input = document.getElementById("password_input")
const confirm_Password_input = document.getElementById("confirm_Password_input")
const SignUp_btn = document.getElementById("SignUp_btn")
const SignUp_form = document.getElementById('SignUp_form')





    userName_input.addEventListener("input", function () {
    

    const regexuserName = /^[a-zA-Z0-9_]{3,15}$/
    if (!regexuserName.test(userName_input.value) && !userName_input.value == "") {
        let email_message_validate = document.getElementById("userName_message_validate")
        email_message_validate.innerHTML = "Username must be 3-15 chars (letters, numbers, underscores)."
        
    } else{
        let email_message_validate = document.getElementById("userName_message_validate")
        email_message_validate.innerHTML = ""
        
    }
    
    })

    
    email_input.addEventListener("input", function () {
    

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!regexEmail.test(email_input.value) && !email_input.value == "") {
        let email_message_validate = document.getElementById("email_message_validate")
        email_message_validate.innerHTML = "Invalid email address."
        
    } else{
        let email_message_validate = document.getElementById("email_message_validate")
        email_message_validate.innerHTML = ""
        
    }
    
    })



    password_input.addEventListener("input", function () {
    

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/
    if (!regexPassword.test(password_input.value) && !password_input.value == "") {
        let password_message_validate = document.getElementById("password_message_validate")
        password_message_validate.innerHTML = "Password must have 8+ chars, 1 uppercase, 1 number, 1 special char."
        
    } else {

      let password_message_validate = document.getElementById("password_message_validate")
        password_message_validate.innerHTML = ""
        
    }
    
    })


    confirm_Password_input.addEventListener("input", function () {
    

    if (password_input.value != confirm_Password_input.value && confirm_Password_input.value != "") {
        let confirm_password_message_validate = document.getElementById("confirm_password_message_validate")
        confirm_password_message_validate.innerHTML = "Passwords do not match. "
        
    } else  {

      let confirm_password_message_validate = document.getElementById("confirm_password_message_validate")
      confirm_password_message_validate.innerHTML = ""
        
    }
    
    })



    confirm_Password_input.addEventListener("input", function () {
    

    if (password_input.value != confirm_Password_input.value && confirm_Password_input.value != "") {
        let confirm_password_message_validate = document.getElementById("confirm_password_message_validate")
        confirm_password_message_validate.innerHTML = "Passwords do not match. "
        
    } else  {

      let confirm_password_message_validate = document.getElementById("confirm_password_message_validate")
      confirm_password_message_validate.innerHTML = ""
        
    }
    
    })

    debugger
  
    SignUp_form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
    
        // Get input values
        const name = document.getElementById('userName_input').value.trim();
        const email = document.getElementById('email_input').value.trim();
        const password = document.getElementById('password_input').value;
    
        // Retrieve existing users or initialize empty array
        const users = JSON.parse(localStorage.getItem('users')) || [];
    
        // Check if email already exists
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            alert('Email is already registered!');
            return; // Stop further execution if the email exists
        }
    
        // Add new user
        const newUser = { name, email, password };
        users.push(newUser);
    
        // Save users back to local storage
        localStorage.setItem('users', JSON.stringify(users));
    
        // Redirect to login page after successful registration
        window.location.href = "./logIn.html";
    });
    
