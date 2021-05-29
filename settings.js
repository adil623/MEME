firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        firebase.auth().currentUser.getIdToken().then((token) => {
            console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/user', 'with ID token in Authorization header.');
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/user/${user.email}`, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = async () => {
                if (xhr.status == 200) {
                    const resObject = JSON.parse(xhr.responseText);
                    document.querySelector(".profile-img").src = resObject.imageURL;
                } else if (xhr.status == 400) {
                    const msg = "no valid user logged in";
                    windows.location.href = "index.html?error=" + msg;



                } else {
                    const msg = "no user found";
                    windows.location.href = "index.html?error=" + msg;

                }
            };
            xhr.send();
        });
    }
    });


const changePassword = document.getElementById('change-password');
changePassword.addEventListener('submit', (e) => {
    e.preventDefault();
    const oldPassword = document.getElementById('opassword').value;
    let newPassword = document.getElementById('new-pwd').value;
    const confirmPassword = document.getElementById('confirm-pwd').value;
    const user = firebase.auth().currentUser;
    var credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
    if (newPassword === confirmPassword && newPassword != oldPassword) {
        newPassword = confirmPassword;
        user.reauthenticateWithCredential(credential).then(function () {
            // User re-authenticated.
            user.updatePassword(newPassword).then(function () {
                window.location.href = 'settingPage.html?success=' + "password change successful";
            }).catch(function (error) {
                // An error happened.
                window.location.href = 'settingPage.html?success=' + "could not update password";
            });
        }).catch(function (error) {
            // An error happened.
            window.location.href = 'settingPage.html?success=' + "could not reauthenticiate old password";
        });
    } else {
        window.location.href = 'settingPage.html?error=' + "your new and old password doesnot match";
    }
    


});









const profile = document.getElementById('profile');
profile.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.location.href = "profile.html?email=" + user.email;
        } else {
            const msg = "no user logged in";
            windows.location.href = "login.html?error=" + msg;
        }
    });
});
const search = document.getElementById('myInput');
const searchUl = document.getElementById('searchUl');
search.addEventListener('keyup', (e) => {
    e.preventDefault();
    const searchValue = search.value;
    if (firebase.auth().currentUser) {
        firebase.auth().currentUser.getIdToken().then((token) => {
            console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/user', 'with ID token in Authorization header.');
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/user/username/${searchValue}`, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = async () => {
                if (xhr.status == 200) {
                    const resObject = JSON.parse(xhr.responseText);
                    emptySearch();
                    displaySearch(resObject);


                } else if (xhr.status == 400) {
                    emptySearch();


                } else {
                    console.log('something went wrong');

                }
            };
            xhr.send();
        });

    }

})

function displaySearch(resObject) {
    const searchEmail = resObject[0].email;
    const searchUser = resObject[0].fullName;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('id', 'searchLink')
    a.style.cursor = 'pointer';
    a.innerHTML = searchUser;
    li.appendChild(a);
    searchUl.appendChild(li);
    a.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "other.html?email=" + searchEmail;
    })
}

function emptySearch() {
    const searchUl = document.getElementById('searchUl');
    const li = searchUl.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
        li[i].remove();
    }

}

const refresh = document.getElementById('refresh');
refresh.addEventListener('click', (e) => {
    window.location.reload();
});

const home = document.getElementById('home');
home.addEventListener('click', (e) => {
    console.log('hi');
    window.location.href = "index.html"
});

const postBtn = document.getElementById('post-btn');
postBtn.addEventListener('click', (e) => {
    console.log('hi');
    const desPost = document.getElementById('des-post').value;
    const desTags = document.querySelectorAll('.des-tag');
    const tags = [];
    for (i = 0; i < desTags.length; i++) {
        if (desTags[i].value != "")
            tags.push(desTags[i].value);
    }
    const postImg = base64Image;
    let Email = '';
    if (firebase.auth().currentUser) {
        Email = firebase.auth().currentUser.email;
    }
    const category = document.querySelector('.catagories').value;
    const params = {
        email: Email,
        description: desPost,
        tags: tags,
        category: category,
        image: postImg,
    }
    const jsonObject = JSON.stringify(params);
    firebase.auth().currentUser.getIdToken().then((token) => {
        console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/', 'with ID token in Authorization header.');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = async () => {
            if (xhr.status == 200) {
                const msg = JSON.parse(xhr.responseText);
                console.log(msg);
            } else if (xhr.status == 400) {
                const msg = JSON.parse(xhr.responseText);
                console.log(msg);

            } else {
                //showError('something went wrong');
            }
        };
        xhr.send(jsonObject);
    });



});

let base64Image = '';
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onloadend = function (e) {

            const confirmPost = document.getElementById('confirm-post');
            confirmPost.addEventListener('click', (e) => {
                e.preventDefault();
                base64Image = reader.result;

            })
            //img.setAttribute('src', e.target.result);
            //img.style.width = "150px";
            //img.style.height = "200px";
            /*$('#blah')
                .attr('src', e.target.result)
                .width(150)
                .height(200);*/
        };

        reader.readAsDataURL(input.files[0]);
    }
};


    const darkMode = document.getElementById('dark-mode');
    darkMode.addEventListener('click', (e) => {
        e.preventDefault();
        const sideBar = document.querySelector(".sidebar");
        const sideLinks = document.querySelectorAll('.side-links');
        const postCards = document.querySelectorAll(".post-body");
        document.body.style.backgroundColor = 'black';
        document.body.style.color = "white";
        sideBar.style.backgroundColor = "black";
        sideBar.style.color = "white";
        console.log(sideLinks);
        for (i = 0; i < sideLinks.length; i++) {
            sideLinks[i].style.color = "white";
        }
        for (i = 0; i < postCards.length; i++) {
            postCards[i].style.backgroundColor = "black";
            postCards[i].style.color = "white";
        }


    });
    const sideBarWrap = document.querySelector('.sidebar-wrap');
    sideBarWrap.addEventListener('click', (e) => {
        e.preventDefault();
        const categoryName = e.target.text;
        const strCategoryName = categoryName.toString();
        if (strCategoryName.includes("Hot")) {
            window.location.href = 'index.html';
        }else if (strCategoryName.includes("Latest")) {
            window.location.href = "latest.html";
        }else {
            console.log("coming here");
           window.location.href = "catagories.html?category=" + categoryName;

        }
        

    });

 const logout = document.getElementById('logout');
 logout.addEventListener('click' , (e) => {
     e.preventDefault()
     firebase.auth().signOut().then(function() {
        window.location.href = 'login.html';
      }).catch(function(error) {
        console.log('some thing went wrong');
      });
 })

 const settingPage = document.getElementById('setting-page');
 settingPage.addEventListener('click' , (e) => {
     e.preventDefault();
     window.location.href = 'settingPage.html';
 })


