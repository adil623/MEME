const detailsForm = document.getElementById('detailsForm');
detailsForm.addEventListener('submit' , (e) => {
    e.preventDefault();
    const fullName = document.querySelector('.fulluserName').value;
    const location = document.querySelector('.country').value;
    const gender = document.querySelector('.gender').value;
    const dob = document.querySelector('.dob').value;
    const description = document.querySelector('.description').value;
    const user = firebase.auth().currentUser;
    let email = '';
    if(user != null) {
        email = user.email;
    }
    const params = {
        email: email,
        description: description,
        fullName: fullName,
        dob: dob,
        gender: gender,
        location: location
    };
    const jsonObject = JSON.stringify(params);
    firebase.auth().currentUser.getIdToken().then((token) => {
        console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/user' , 'with ID token in Authorization header.' );
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/user',true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onprogress = () => {
            if (xhr.readyState == 4) {
              document.querySelector('.loader').style.display = 'none';
              document.querySelector('.main-content').style.display = 'block';
            }
            document.querySelector('.loader').style.display = 'block';
            document.querySelector('.main-content').style.display = 'none';
        
        
          };  
        xhr.onload = async () => {
            if(xhr.status == 200){
                await firebase.auth().currentUser.updateProfile({
                    displayName: fullName
                });
                window.location.href = "verification.html";

            }else if (xhr.status == 400) {
              document.querySelector('.loader').style.display = 'none';
              document.querySelector('.main-content').style.display = 'block';
                const msg = JSON.parse(xhr.responseText);
                if(msg != null){
                    if(msg.errFullName) {
                        showError(msg.errFullName);

                    }else if (msg.errLocation) {
                        showError(msg.errLocation);

                    }else if (msg.errGender) {
                        showError(msg.errGender);

                    }else if (msg.errDOB) {
                        showError(msg.err.DOB);

                    }else {
                        showError('something went wrong please retry')

                    }
                 
                    
            }

            }else {
                showError('Please retry');
            }
        };
        xhr.send(jsonObject);
    });
});

function showError(err) {
    document.querySelector('.main-content').style.display = 'block';
    document.querySelector('.loader').style.display = 'none';
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
