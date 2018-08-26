document.getElementById("submit-signin").addEventListener("click", login);
document.getElementById("submit-signup").addEventListener("click", signup);

function signup() {
    var user = {
        id: makeid(),
        first_name: document.getElementById("first-name").value,
        last_name: document.getElementById("last-name").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        image: null
    }

    errors.innerHTML = '';
    success.innerHTML = '';
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    var format1 = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    var valid = true;

    if(user.first_name == "") {
        errors.innerHTML += '<article class="error-msg">&#9888; Please enter your name.</article>';
        valid = false;
    }
    if(user.last_name == "") {
        errors.innerHTML += '<article class="error-msg">&#9888; Please enter your last name.</article>';
        valid = false;
    }
    if(format.test(user.username)) {
        errors.innerHTML += '<article class="error-msg">&#9888; Username can\'t contain special characters.</article>';
        valid = false;
    }
    if(format.test(user.password)) {
        errors.innerHTML += '<article class="error-msg">&#9888; Password can\'t contain special characters.</article>';
        valid = false;
    }
    if(!(format1.test(user.email))) {
        errors.innerHTML += '<article class="error-msg">&#9888; Enter email in right format.</article>';
        valid = false;
    }
    if(user.username.length < 5 || user.username.length > 12) {
        errors.innerHTML += '<article class="error-msg">&#9888; Username must contain between 5 and 12 characters.</article>';
        valid = false;
    }
    if(user.password.length < 5 || user.password.length > 12) {
        errors.innerHTML += '<article class="error-msg">&#9888; Password must contain between 5 and 12 characters.</article>';
        valid = false;
    }
    if(valid) {
        user.password = md5(user.password);
        var http = new XMLHttpRequest();
        http.open('POST', 'php/add_user.php', true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                var data = JSON.parse(http.responseText);
                if(data.success != '') {
                    success.innerHTML = '<article class="success-msg">New user registered.</article>';
                }
            }
        }
        var data = JSON.stringify(user);
        http.send(data);
    }    
}

function login() {
    var user = {
        id: null,
        username: document.getElementById("login-username").value,
        password: document.getElementById("login-password").value
    }
    var error_div = document.getElementById('login-error');
    error_div.innerHTML = '';

    var http = new XMLHttpRequest();
    http.open('GET', 'php/get_users.php', true);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var data = JSON.parse(http.responseText);
            data.data.forEach(function(user_data) {
                if(user_data.username == user.username && user_data.password == md5(user.password)){
                    localStorage.setItem('user_id', user_data.id);
                    user.id = user_data.id;
                }
            });
            if(user.id != null) {
                document.location.replace('home.html');
            } else {
                error_div.innerHTML = '&#9888; Wrong username and password combination.';
            }
        }
    }
    http.send(null);
}