let params = new URLSearchParams(location.search);
const commentId = params.get('commentId');
const postId = params.get('postId');

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


db.collection("comments").where("parent", "==", commentId).orderBy('timeCreated', 'asc')
    .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === "added" ) {
                console.log(change.doc.data(), change.doc.id);
                console.log(change.doc.id);
                displayComments(change.doc.data(), change.doc.id);
            }

        });
    });





function displayComments(resComments, commentId) {
    const timeCreated = resComments.timeCreated;
    const date = timeCreated.split("/");
    const day = date[0];
    const month = date[1];
    const year = date[2];
    const time = date[3].split(":");
    const hour = time[0];
    const miniutes = time[1];
    const seconds = time[2];
    const dayName = date[4];



    let timeZone = '';
    if (hour >= '00' && hour < '12') {
        timeZone = 'AM';
    } else {
        timeZone = 'PM';
    }
    const section = document.querySelector('.post-section');
    const card = document.createElement('div');
    const cardBody = document.createElement('div');
    const commentWrap = document.createElement('div');
    const pHidden = document.createElement('p');
    pHidden.textContent = commentId;
    pHidden.hidden = true;
    const row = document.createElement('div');
    const colThree = document.createElement('div');
    const userImg = document.createElement('img');
    db.collection("users").where("email", "==", resComments.email)
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added" || change.type === "modified") {
                userImg.setAttribute('src', change.doc.data().imageURL);
            }
            
        });
    });
  //  userImg.setAttribute('src', resComments.userProfilePictureURL);
    const userTime = document.createElement('p');
    const timeText = document.createTextNode(dayName + " " + hour + ":" + miniutes + " " + timeZone)
    userTime.appendChild(timeText);
    const colNine = document.createElement('div');
    const userPara = document.createElement('p');
    const userProfileLink = document.createElement('a');
    const UserName = document.createElement('strong');
    UserName.textContent = resComments.username;
    const comment = document.createElement('p');
    comment.textContent = resComments.comment
    userProfileLink.appendChild(UserName);
    userPara.appendChild(userProfileLink);
    const paraIcons = document.createElement('p');
    const replyLink = document.createElement('a');
    const upvoteLink = document.createElement('a');
    const downVote = document.createElement('a');
    const removeLink = document.createElement('a');
    const replyIcon = document.createElement('i');
    const upvoteIcon = document.createElement('i');
    const downvoteIcon = document.createElement('i');
    const removeIcon = document.createElement('i');
    const dislikeCont = document.createTextNode(resComments.numberOfDownvotes);
    const likeCont = document.createTextNode(resComments.numberOfUpvotes);
    card.classList.add('card', 'post-container', 'mb-3');
    cardBody.classList.add('card-body', 'post-body');
    row.classList.add('row');
    commentWrap.classList.add('comment-wrap', 'mb-3');
    colThree.classList.add('col-md-3');
    userImg.classList.add('img', 'img-rounded', 'img-fluid', 'comment-img');
    userTime.classList.add("text-secondary", 'text-center', 'mt-1');
    colNine.classList.add('col-md-9');
    userPara.classList.add('user-para');
    userProfileLink.classList.add('profile-link');
    UserName.classList.add('username');
    comment.classList.add('comment');
   // replyLink.classList.add('float-right', 'ml-2', 'reply');
   // replyIcon.classList.add('fa', 'fa-reply');
    upvoteLink.classList.add('float-right', 'ml-2');
    const likeCheck = () => {
        const commentRef = db.collection('commentUpvotes');
        commentRef.where('commentId', '==', commentId).where('email', '==', firebase.auth().currentUser.email).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    if (doc.data().commentId == commentId && doc.data().email == firebase.auth().currentUser.email) {
                        upvoteIcon.classList.remove('far', 'fa-laugh-squint', 'like-icon');
                        upvoteIcon.classList.add('fas', 'fa-laugh-squint', 'like-dark-icon');

                    }


                })
            }).catch((error) => {
                console.log(error);
            })
    };
    upvoteIcon.classList.add('far', 'fa-laugh-squint' , 'like-icon');
    likeCheck();
    const dislikeCheck = () => {
        const commentRef = db.collection('commentDownvotes');
        commentRef.where('commentId', '==', commentId).where('email', '==', firebase.auth().currentUser.email).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    if (doc.data().commentId === commentId && doc.data().email === firebase.auth().currentUser.email) {
                        downvoteIcon.classList.remove('far', 'fa-tired', 'dislike-icon');
                        downvoteIcon.classList.add('fas', 'fa-tired', 'dislike-dark-icon');

                    }


                })
            }).catch((error) => {
                console.log(error);
            });
        } 
    downVote.classList.add('float-right', 'ml-2');
    downvoteIcon.classList.add('far', 'fa-tired' , 'dislike-icon');
    dislikeCheck();
    removeLink.classList.add('float-right', 'ml-2', 'remove-comment');
    removeIcon.classList.add('fa', 'fa-times');
    //replyLink.appendChild(replyIcon);
    upvoteLink.appendChild(upvoteIcon);
    upvoteLink.appendChild(likeCont);
    downVote.appendChild(downvoteIcon);
    downVote.appendChild(dislikeCont);
    removeLink.appendChild(removeIcon);
   // paraIcons.appendChild(replyLink);
    paraIcons.appendChild(downVote);
    paraIcons.appendChild(upvoteLink);
    paraIcons.appendChild(removeLink);
    colNine.appendChild(pHidden);
    colNine.appendChild(userPara);
    colNine.appendChild(comment);
    colNine.appendChild(paraIcons);
    colThree.appendChild(userImg);
    colThree.appendChild(userTime);
    row.appendChild(colThree);
    row.appendChild(colNine);
    commentWrap.appendChild(row);
    cardBody.appendChild(commentWrap);
    card.appendChild(cardBody);
    section.appendChild(card);
}

const commentform = document.getElementById('comment-form');
commentform.addEventListener('submit' , (e) => {
    e.preventDefault();
    const inputComment = document.getElementById('input-comment');
    const comment = inputComment.value;
    const email = firebase.auth().currentUser.email;
    const params = {
        comment: comment,
        email: email,
        parent: commentId,
        postId: postId

    }
    const jsonObject = JSON.stringify(params);
    firebase.auth().currentUser.getIdToken().then((token) => {
        console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/comment/', 'with ID token in Authorization header.');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/comment/', true);
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
  





})




const postSection = document.querySelector('.post-section');
postSection.addEventListener('click', (e) => {
    e.preventDefault();
    const clickedNode = e.target;
    const commentId = clickedNode.parentNode.parentNode.parentNode.childNodes[0].textContent;
     const postId = clickedNode.parentNode.parentNode.parentNode.childNodes[1].textContent;
    console.log(e.target);
    const clickedParent = clickedNode.parentNode;
    let clickedPreSibling = "";
    let clickedSibling = "";
    if(clickedNode.classList.contains("dislike-dark-icon") || clickedNode.classList.contains("dislike-icon") ) {
       // console.log(clickedNode.parentNode.previousSibling.childNodes[0]);
    //    clickedPreSibling = clickedNode.parentNode.previousSibling.childNodes[0];
        clickedSibling = clickedNode.parentNode.nextSibling.childNodes[0];
    }

    if (clickedNode.classList.contains("fa-reply")) { 
        const commentId = clickedNode.parentNode.parentNode.parentNode.childNodes[0].textContent;
     const postId = clickedNode.parentNode.parentNode.parentNode.childNodes[1].textContent;
       window.location.href = 'reply.html?commentId=' + commentId + "&postId=" + postId;
    } else if (clickedNode.classList.contains("fa-times")) {
        const commentId = clickedNode.parentNode.parentNode.parentNode.childNodes[0].textContent;
        const postId = clickedNode.parentNode.parentNode.parentNode.childNodes[1].textContent;
        const email = firebase.auth().currentUser.email;

        removeComment(commentId , email);


    } else if (clickedNode.classList.contains("like-icon") && clickedNode.parentNode.previousSibling.childNodes[0].classList.contains("dislike-dark-icon")) {
        if (clickedNode.matches(".fa-laugh-squint") && clickedNode.parentNode.previousSibling.childNodes[0].matches(".fa-tired")) {
            clickedNode.parentNode.previousSibling.childNodes[0].classList.remove('fas', 'fa-tired', 'dislike-dark-icon');
            clickedNode.parentNode.previousSibling.childNodes[0].classList.add('far', 'fa-tired', 'dislike-icon');
            clickedNode.classList.remove('far', 'fa-laugh-squint', 'like-icon');
            clickedNode.classList.add('fas', 'fa-laugh-squint', 'like-dark-icon');
            const commentId = clickedNode.parentNode.parentNode.parentNode.childNodes[0].textContent;
           // const indexnode = position.innerHTML;
           // const indexNo = parseInt(indexnode);
           // const likePost = postArray[indexNo - 1];
            console.log(commentId);
            let upvote = parseInt(clickedParent.childNodes[1].nodeValue) + 1;
            let downvote = parseInt(clickedNode.parentNode.previousSibling.childNodes[1].nodeValue) - 1;
            if (downvote < 0) {
                downvote = 0;
            }
            const textnode = document.createTextNode(upvote);
            const dtextnode = document.createTextNode(downvote);
            clickedParent.replaceChild(textnode, clickedParent.childNodes[1]);
            console.log(clickedNode.parentNode.previousSibling.childNodes[1].nodeValue)
            clickedNode.parentNode.previousSibling.replaceChild(dtextnode, clickedNode.parentNode.previousSibling.childNodes[1]);
            dislikeReq(firebase.auth().currentUser.email, commentId);
            likeReq(firebase.auth().currentUser.email, commentId);
        }
        
        
    } else if (clickedNode.classList.contains("like-icon") && clickedNode.parentNode.previousSibling.childNodes[0].classList.contains("dislike-icon")) {
        if (clickedNode.matches(".fa-laugh-squint")) {
            clickedNode.classList.remove('far', 'fa-laugh-squint', 'like-icon');
            clickedNode.classList.add('fas', 'fa-laugh-squint', 'like-dark-icon');
            const commentId = clickedNode.parentNode.parentNode.parentNode.childNodes[0].textContent;
            console.log(parseInt(clickedParent.childNodes[1].nodeValue));
            let upvote = parseInt(clickedParent.childNodes[1].nodeValue) + 1;
            console.log(upvote);
            const textnode = document.createTextNode(upvote);
            clickedParent.replaceChild(textnode, clickedParent.childNodes[1]);
            likeReq(firebase.auth().currentUser.email, commentId);

        }

    }else if (clickedNode.classList.contains("like-dark-icon")) {
        if (clickedNode.matches(".fa-laugh-squint")) {
            clickedNode.classList.remove('fas', 'fa-laugh-squint', 'like-dark-icon');
            clickedNode.classList.add('far', 'fa-laugh-squint', 'like-icon');
            //clickedNode.classList.toggle('fas');
            const commentId = clickedNode.parentNode.parentNode.parentNode.childNodes[0].textContent;
            let upvote = parseInt(clickedParent.childNodes[1].nodeValue) - 1;
            if (upvote < 0) {
                upvote = 0;
            }
            const textnode = document.createTextNode(upvote);
            clickedParent.replaceChild(textnode, clickedParent.childNodes[1]);

            likeReq(firebase.auth().currentUser.email, commentId);
           

        }
    } else if (clickedNode.classList.contains("dislike-icon") && clickedSibling.classList.contains("like-icon")) {
        if(clickedNode.matches(".fa-tired")) {
            clickedNode.classList.remove('far' , 'fa-tired' , 'dislike-icon');
            clickedNode.classList.add('fas' , 'fa-tired' , 'dislike-dark-icon');
            const commentId = clickedNode.parentNode.parentNode.parentNode.childNodes[0].textContent;
            let downvote =  parseInt(clickedParent.childNodes[1].nodeValue) + 1;
            const textnode = document.createTextNode(downvote);
            clickedParent.replaceChild(textnode, clickedParent.childNodes[1]);
            dislikeReq(firebase.auth().currentUser.email, commentId);
        }

    } else if (clickedNode.classList.contains("dislike-icon") && clickedSibling.classList.contains("like-dark-icon") ) {
        if (clickedNode.matches(".fa-tired") && clickedSibling.matches(".fa-laugh-squint")) {
            console.log('hi');
            clickedSibling.classList.remove('fas', 'fa-laugh-squint', 'like-dark-icon');
            clickedSibling.classList.add('far', 'fa-laugh-squint', 'like-icon');
            clickedNode.classList.remove('far', 'fa-tired', 'dislike-icon');
            clickedNode.classList.add('fas', 'fa-tired', 'dislike-dark-icon');
            const commentId = clickedNode.parentNode.parentNode.parentNode.childNodes[0].textContent;
            
            //console.log(clickedPreSibling.parentNode.childNodes[1].nodeValue);
            let upvote = parseInt(clickedSibling.parentNode.childNodes[1].nodeValue) - 1;
            let downvote =  parseInt(clickedParent.childNodes[1].nodeValue) + 1;
            console.log(upvote);
            console.log(downvote);

            if (upvote < 0) {
                upvote = 0;
            }
            const textnode = document.createTextNode(upvote);
            const dtextnode = document.createTextNode(downvote);
            clickedParent.replaceChild(dtextnode, clickedParent.childNodes[1]);
            clickedSibling.parentNode.replaceChild(textnode, clickedSibling.parentNode.childNodes[1]);
            dislikeReq(firebase.auth().currentUser.email, commentId);
            likeReq(firebase.auth().currentUser.email, commentId);










        }

    }else if (clickedNode.classList.contains("dislike-dark-icon")){
        if (clickedNode.matches(".fa-tired")) {
            clickedNode.classList.remove('fas', 'fa-tired', 'dislike-dark-icon');
            clickedNode.classList.add('far', 'fa-tired', 'dislike-icon');
            //clickedNode.classList.toggle('fas');
            const commentId = clickedNode.parentNode.parentNode.parentNode.childNodes[0].textContent;
            console.log(clickedSibling.parentNode.childNodes[1])
            let downvote = parseInt(clickedNode.parentNode.childNodes[1].nodeValue) - 1;
            if (downvote < 0) {
                downvote = 0;
            }
            const textnode = document.createTextNode(downvote);
            clickedParent.replaceChild(textnode, clickedParent.childNodes[1]);
            dislikeReq(firebase.auth().currentUser.email, commentId);

    }  
}else {
        console.log("nothing clicked");
    }
});


function dislikeReq (email , commentId) {
    const params = {
        email: email,
        commentId: commentId
    }
    const jsonObject = JSON.stringify(params);
    if (firebase.auth().currentUser) {

        firebase.auth().currentUser.getIdToken().then((token) => {
            console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/comment/', 'with ID token in Authorization header.');
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/comment/downvote', true);
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

    }


}

function likeReq (email , commentId) {
    console.log(commentId);

    const params = {
        email: email,
        commentId: commentId
    }
    const jsonObject = JSON.stringify(params);
    if (firebase.auth().currentUser) {

        firebase.auth().currentUser.getIdToken().then((token) => {
            console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/comment/', 'with ID token in Authorization header.');
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/comment/upvote', true);
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

    }

}


function removeComment(commentId , email) {
    const params = {
        commentId: commentId,
        email: email
    }
    const jsonObject = JSON.stringify(params);
    if (firebase.auth().currentUser) {

        firebase.auth().currentUser.getIdToken().then((token) => {
            console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/', 'with ID token in Authorization header.');
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/comment/delete', true);
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

}
}

const sideBarWrap = document.querySelector('.sidebar-wrap');
sideBarWrap.addEventListener('click', (e) => {
    e.preventDefault();
    const categoryName = e.target.text;
    const strCategoryName = categoryName.toString();
    if (strCategoryName.includes("Hot")) {
        window.location.href = "index.html";
       
    }else if (strCategoryName.includes("Latest")) {
        
        window.location.href = 'latest.html';
    }else {
        console.log("coming here");
       window.location.href = "catagories.html?category=" + categoryName;

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
const logout = document.getElementById('logout');
 logout.addEventListener('click' , (e) => {
     e.preventDefault()
     firebase.auth().signOut().then(function() {
        window.location.href = 'login.html';
      }).catch(function(error) {
        console.log('some thing went wrong');
      });
 })
