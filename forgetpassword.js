const form = document.getElementById('register-form');
form.addEventListener('submit' , (e) => {
    e.preventDefault();
var auth = firebase.auth();
console.log('hi');
const email = document.getElementById('email');
console.log(email.value);
var emailAddress = email.value; 
auth.sendPasswordResetEmail(emailAddress).then(function() {
  window.location.href = 'login.html';
}).catch(function(error) {
  window.location.href = 'forgetPassword.html?error=' + error;
});
})