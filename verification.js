const sendEmail = document.getElementById('btn-email');
const verify = document.getElementById('btn-verify');

sendEmail.addEventListener('click', (e) => {
	e.preventDefault();
	const user = firebase.auth().currentUser;
	user.sendEmailVerification().then(function () {
		console.log("Email Sent");
		showSuccess('Email sent');
		
	}).catch(function (error) {
		// An error happened.
		console.log(error);
		showError('Enter Valid Email')
	});
})

verify.addEventListener('click' , (e) => {
	if (firebase.auth().currentUser.emailVerified) {
		window.location.href = 'index.html';
	} else {
		showError('Please Verify To Continue')
	}
})

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
  