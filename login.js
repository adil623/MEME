const loginForm = document.getElementById('loginForm');
 loginForm.addEventListener('submit' , (e) => {
     e.preventDefault();
     const email = document.querySelector('.input_email').value;
     const password = document.querySelector('.input_pass').value;
     const params = {email , password};
     const jsonObject = JSON.stringify(params);
     const xhr = new XMLHttpRequest();
     xhr.open('POST' , 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/login', true);
     xhr.setRequestHeader('content-type' , 'application/json');
     xhr.onload = () => {
         
         if(xhr.status == 200 ) {
            firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
                window.location.href = "index.html";

            }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            showError('Wrong password.');
          } else {
            showError(errorMessage);
          }
          console.log(error);
        });
         }else if (xhr.status == 400) {
              const msg = JSON.parse(xhr.responseText);
              if(msg != null) {
                showError('username or password incorrect')
              }
        }
     }
     xhr.send(jsonObject);
    });


 function showSuccess(msg) {
    const successDiv = document.createElement('div')
   const card = document.querySelector('.card');
   const cardBody = document.querySelector('.card-body');

    successDiv.className= 'alert alert-success';
    successDiv.appendChild(document.createTextNode(msg));
    card.insertBefore(successDiv, cardBody);
    setTimeout(clearerror, 3000);
}

function showError(err) {
    const errorDiv = document.createElement('div')
   const card = document.querySelector('.card');
   const cardBody = document.querySelector('.card-body');

    errorDiv.className= 'alert alert-danger text-center';
    errorDiv.appendChild(document.createTextNode(err));
    card.insertBefore(errorDiv, cardBody);
    setTimeout(clearerror, 3000);
}

function clearerror(){
    document.querySelector('.alert').remove();
}

const forgetPassword = document.getElementById('forget-password');
forgetPassword.addEventListener('click' , (e) => {
  window.location.href = 'forgetPassword.html';
});

const registerPage = document.getElementById('register-page');
registerPage.addEventListener('click' , (e) => {
  e.preventDefault();
  window.location.href = 'register.html';
})