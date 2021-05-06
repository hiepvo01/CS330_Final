
var request = new XMLHttpRequest();
request.onreadystatechange= function () {
    if (request.readyState==2) {
        //handle response
        if(request.status==409) {
            alert("Email already exists");
        }else if(request.status ==200) {
            location.href="../login.html"
            alert("User Created")
        }
    }
    if (request.readyState == XMLHttpRequest.DONE) {

    }
}

async function register(){
    FD  = new FormData();
    let male = document.getElementById('male')
    let female = document.getElementById('female')

    // Push our data into our FormData object 
    if (document.getElementById('email').value && document.getElementById('name').value && document.getElementById('password').value) {
        let email = document.getElementById('email').value
        FD.append("email", email)
        let name = document.getElementById('name').value
        FD.append("name", name)
        let password = document.getElementById('password').value
        FD.append("password", password)
        if (male.checked) {
            FD.append("gender", "Male")
        } else if (female.checked) {
            FD.append("gender", "Female")
        }
    } else {
        alert("Please fill in all fields")
    }

    
    request.open("POST", "http://127.0.0.1:5000/register");
    request.send(FD);

}