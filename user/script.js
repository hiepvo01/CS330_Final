async function Search(){
    s = document.getElementById('search')
    localStorage.setItem('search', s.value)
    window.location.replace("../index.html");
}

async function Login(){
    email = document.getElementById('email').value
    password = document.getElementById('password').value

    let url = 'https://hiepvo01.pythonanywhere.com//login'
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (document.getElementById('login-alert')) {
            let myobj = document.getElementById("login-alert");
            myobj.remove();
        }
        if (xhr.readyState == XMLHttpRequest.DONE) {
            alert = document.createElement('div')
            alert.classList.add('alert')
            alert.setAttribute('id', 'login-alert')
            if (JSON.parse(xhr.responseText).message == 'Login Successful') {
                alert.classList.add('alert-success')
                localStorage.setItem('email', email)
            } else {
                alert.classList.add('alert-danger')
            }
            console.log(xhr.responseText)
            alert.innerHTML = JSON.parse(xhr.responseText).message
            form = document.getElementById('login-form')
            form.appendChild(alert)

            if (JSON.parse(xhr.responseText).message == 'Login Successful') {
                localStorage.setItem('access_token', JSON.parse(xhr.responseText).access_token);
                location.href = '../index.html';
            }
        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        email: email,
        password: password
    }));
}