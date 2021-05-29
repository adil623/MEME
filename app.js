$("#myCarousel").carousel();

// Enable Carousel Indicators
$(".item").click(function () {
  $("#myCarousel").carousel(1);
});

// Enable Carousel Controls
$(".carousel-control-prev").click(function () {
  $("#myCarousel").carousel("prev");
});

const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.querySelector(".input_user").value;
  const email = document.querySelector(".input_email").value;
  const password = document.querySelector(".input_pass").value;
  const params = { username, email, password };
  const jsonObject = JSON.stringify(params);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/register', true);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onprogress = () => {
    if (xhr.readyState == 4) {
      document.querySelector('.loader').style.display = 'none';
      document.querySelector('.main-content').style.display = 'block';
    }
    document.querySelector('.loader').style.display = 'block';
    document.querySelector('.main-content').style.display = 'none';


  };
  xhr.onload = () => {
    if (xhr.status == 200) {

      firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        showSuccess('User registered Successfully!!');
        window.location.href = "details.html";
        signupForm.reset()
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          document.querySelector('.loader').style.display = 'none';
          document.querySelector('.main-content').style.display = 'block';
          alert('The password is too weak.');
        } else {
          document.querySelector('.loader').style.display = 'none';
          document.querySelector('.main-content').style.display = 'block';
          alert(errorMessage);
        }
        console.log(error);
      });
    } else if (xhr.status == 400) {
      document.querySelector('.loader').style.display = 'none';
      document.querySelector('.main-content').style.display = 'block';
      const msg = JSON.parse(xhr.responseText);
      console.log(msg)
      if (msg != null) {
        if (msg.errUsername) {
          showError(msg.errUsername);
        } else if (msg.errEmail) {
          showError(msg.errEmail);
        } else if (msg.errPassword) {
          showError(msg.errPassword);
        } else {
          showError('something wrong with credentionals')
        }

      }
    } else {

      showError("please retry");

    }
  };
  xhr.send(jsonObject);
});



function showSuccess(msg) {
  const successDiv = document.createElement('div')
  const card = document.querySelector('.card');
  const cardBody = document.querySelector('.card-body');

  successDiv.className = 'alert alert-success text-center';
  successDiv.appendChild(document.createTextNode(msg));
  card.insertBefore(successDiv, cardBody);
  setTimeout(clearerror, 3000);
}

function showError(err) {
  const errorDiv = document.createElement('div')
  const card = document.querySelector('.card');
  const cardBody = document.querySelector('.card-body');

  errorDiv.className = 'alert alert-danger text-center';
  errorDiv.appendChild(document.createTextNode(err));
  card.insertBefore(errorDiv, cardBody);
  setTimeout(clearerror, 3000);
}

function clearerror() {
  document.querySelector('.alert').remove();
}




