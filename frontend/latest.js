// display latest posts
let LatestId = ''
let scrollTimeFunctionId = null;
let postArray = [];
let postCount = 0;


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
        //const main = document.getElementById('main-content');

        //let LatestPost = [];
        latestPost()


        window.onscroll = function (ev) {
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                if (scrollTimeFunctionId == null) {
                    //alert("you're at the bottom of the page");
                    scrollTimeFunctionId = setTimeout(() => {

                        scrollTimeFunctionId = null;

                        latestPost()
                    }, 1000);
                }
            }
        };

        /* if (element.scrollHeight - element.scrollTop === element.clientHeight) {
             console.log('scrolled');
         }*/



    } else {
        // No user is signed in.
    }
});
function latestPost() {

    // console.log(user.email);
    const params = {
        postId: LatestId
    };
    const jsonObject = JSON.stringify(params);
    console.log(jsonObject);
    firebase.auth().currentUser.getIdToken().then((token) => {
        console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/', 'with ID token in Authorization header.');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/latest', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = async () => {
            if (xhr.status == 200) {
                const resObject = JSON.parse(xhr.responseText);
                console.log(resObject);
                const length = resObject.length;
                if (length > 0) {
                    LatestId = resObject[resObject.length - 1].postId;
                    for (i = 0; i < resObject.length; i++) {
                        //if( i === resObject.length - 1){
                        //    LatestId = resObject[i].postId;
                        // }

                        displayPost(resObject[i].postData);
                    }
                }
            } else if (xhr.status == 400) {


            } else {

            }
        };
        xhr.send(jsonObject);
    });

}
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

// function to display post in browser
function displayPost(resObject) {
    //console.log(resObject.userProfilePictureURL);
    // console.log(resObject.timeCreated);
    //const checkLike =  db.collection('postUpvotes').where('postId', '==' ,  resObject.id).where('email', '==', firebase.auth().currentUser.email);
    //    console.log(checkLike.doc.data());
    postArray.push(resObject);
    postCount = postCount + 1;
    const timeCreated = resObject.timeCreated;
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

    // console.log(timeZone);

    const section = document.querySelector('.post-section');
    const card = document.createElement('div');
    const cardBody = document.createElement('div');
    const userImg = document.createElement('img');
    const usernTime = document.createElement('span');
    const saveBtn = document.createElement('button');
    const postImg = document.createElement('img');
    const tags = document.createElement('div');
    const imageContainer = document.createElement('div');
    const hiddenpara = document.createElement('p');
    const dropdown = document.createElement('div');
    const dropdownMenu = document.createElement('div');
    const savePost = document.createElement('a');
    const removePost = document.createElement('a');
    const paraEmail = document.createElement('p');
    paraEmail.hidden = true;
    paraEmail.textContent = resObject.email;
    paraEmail.setAttribute('class' , 'paraEmail');
    savePost.classList.add("dropdown-item");
    savePost.setAttribute('id' , 'post-save');
    removePost.setAttribute('id' , 'post-remove');
    removePost.classList.add("dropdown-item");
    savePost.textContent = "save post";
    removePost.textContent = "remove post";
    dropdownMenu.setAttribute("class" , "dropdown-menu");
    dropdownMenu.setAttribute("aria-labelledby" , "dropdownMenuButton");
    saveBtn.setAttribute("id" , "dropdownMenuButton");
    saveBtn.setAttribute('data-toggle' , "dropdown");
    dropdown.classList.add("dropdown" , "d-inline", 'float-right' , 'mt-0');
    dropdown.appendChild(saveBtn);
    dropdownMenu.appendChild(savePost);
    dropdownMenu.appendChild(removePost);
    dropdown.appendChild(dropdownMenu);
    // const position = document.createTextNode(postCount);
    hiddenpara.innerHTML = postCount;
    const postTags = [];
    for (let i = 0; i < resObject.tags.length; i++) {
        if (resObject.tags[i] != "") {
            postTags[i] = document.createElement('a');
            postTags[i].classList.add("btn", "btn-light", "btn-outline-dark", "post-tags", "btn-sm");
            postTags[i].innerHTML = resObject.tags[i];
            tags.appendChild(postTags[i]);
        }


    }
    const btns = document.createElement('div');
    const btnLike = document.createElement('button');
    const btnDislike = document.createElement('button');
    const comments = document.createElement('button');
    const download = document.createElement('a');
    //  const downloadLink = document.createElement('a');
    const userTextnode = document.createTextNode(" " + resObject.username + "  ");
    const description = document.createElement('p');
    description.style.marginTop = '1rem';
    description.style.marginTop = '5px';
    const userIcon = document.createElement('i');
    const saveIcon = document.createElement('i');
    const likeIcon = document.createElement('i');
    const dislikeIcon = document.createElement('i');
    const commentIcon = document.createElement('i');
    const downloadIcon = document.createElement('i');
    const postTime = document.createTextNode("  " + dayName + " " + hour + ":" + miniutes + " " + timeZone);
    const downloadCont = document.createTextNode('download');
    const commentCont = document.createTextNode(resObject.numberOfComments);
    const dislikeCont = document.createTextNode(resObject.numberOfDownvotes);
    const likeCont = document.createTextNode(resObject.numberOfUpvotes);
    // likeCont.innerHTML = resObject.numberOfUpvotes;
    // likeCont.setAttribute('class' , "numberOfLike")
    // const likeCont = document.createTextNode(resObject.numberOfUpvotes);
    card.classList.add('card', 'post-container', 'mb-3');
    //card.setAttribute('class' , 'post-container');
    //card.setAttribute('class' , 'mb-3');
    cardBody.classList.add('card-body', 'post-body');
    //cardBody.setAttribute('class' , 'post-body');
    userImg.classList.add('rounded-circle', 'user-img');
    //userImg.setAttribute('class' , 'user-img');
    userImg.setAttribute('src', resObject.userProfilePictureURL);
    usernTime.classList.add('text-capitalize');
    usernTime.setAttribute('id', 'usernTime');
    userIcon.classList.add('fas', 'fa-circle', 'fa-xs');
    //userIcon.setAttribute('class' , 'fa-circle');
    //userIcon.setAttribute('class' , 'fa-xs');
    saveIcon.classList.add('fas', 'fa-ellipsis-v');
    //saveIcon.setAttribute('class' , 'fa-ellipsis-v');
    saveBtn.classList.add('btn', 'save-btn');
    //saveBtn.setAttribute('class' , 'save-btn');
    postImg.classList.add('mb-3', 'mt-3', 'image');
    //postImg.setAttribute('class' , 'image');
    //postImg.setAttribute('class' , 'mb-3');
    postImg.setAttribute('id', 'post-image');
    postImg.setAttribute('src', resObject.imageURL);
    download.setAttribute('href', resObject.imageURL);
    download.classList.add('btn-download');
    download.download = "meme";
    hiddenpara.hidden = true;
    //download.setAttribute('target' , "_blank");
    // download.download = true;
    tags.classList.add('tag');
    btns.classList.add('buttons');
    btnLike.classList.add('btn', 'likes', 'like-btn');
    btnLike.nodeValue = resObject.numberOfUpvotes;
    btnDislike.classList.add('likes', 'btn', 'dislike-btn');
    btnDislike.nodeValue = resObject.numberOfDownvotes

    //  likeIcon.nodeValue = '0';
    comments.classList.add('likes', 'btn');
    download.classList.add('likes', 'btn');
    const likeCheck = () => {
        const postRef = db.collection('postUpvotes');
        postRef.where('postId', '==', resObject.id).where('email', '==', firebase.auth().currentUser.email).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    if (doc.data().postId === resObject.id && doc.data().email === firebase.auth().currentUser.email) {
                        likeIcon.classList.remove('far', 'fa-laugh-squint', 'like-icon');
                        likeIcon.classList.add('fas', 'fa-laugh-squint', 'like-dark-icon');

                    }


                })
            }).catch((error) => {
                console.log(error);
            })
    };
    likeIcon.classList.add('far', 'fa-laugh-squint', 'like-icon');
    likeCheck();
    const dislikeCheck = () => {
        const postRef = db.collection('postDownvotes');
        postRef.where('postId', '==', resObject.id).where('email', '==', firebase.auth().currentUser.email).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    if (doc.data().postId === resObject.id && doc.data().email === firebase.auth().currentUser.email) {
                        dislikeIcon.classList.remove('far', 'fa-tired', 'dislike-icon');
                        dislikeIcon.classList.add('fas', 'fa-tired', 'dislike-dark-icon');

                    }


                })
            }).catch((error) => {
                console.log(error);
            });
        }

        dislikeIcon.classList.add('far', 'fa-tired', 'dislike-icon');
        dislikeCheck();
  
        commentIcon.classList.add('fas', 'fa-comments');
        downloadIcon.classList.add('fas', 'fa-download');
        description.textContent = resObject.description;
        download.appendChild(downloadIcon);
        download.appendChild(downloadCont);
        comments.appendChild(commentIcon);
        comments.appendChild(commentCont);
        btnDislike.appendChild(dislikeIcon);
        btnDislike.appendChild(dislikeCont);
        btnLike.appendChild(likeIcon);
        btnLike.appendChild(likeCont);
        btns.appendChild(btnLike);
        btns.appendChild(btnDislike);
        btns.appendChild(comments);
        //btns.appendChild(downloadLink);
        btns.appendChild(download);
        imageContainer.appendChild(postImg);
        saveBtn.appendChild(saveIcon);
        usernTime.appendChild(userTextnode);
        usernTime.appendChild(userIcon);
        usernTime.appendChild(postTime);
        cardBody.appendChild(hiddenpara);
        cardBody.appendChild(paraEmail);
        cardBody.appendChild(userImg);  
        cardBody.appendChild(usernTime);
        cardBody.appendChild(dropdown);
        cardBody.appendChild(description);
        cardBody.appendChild(imageContainer);
        cardBody.appendChild(tags);
        cardBody.appendChild(btns);
        card.appendChild(cardBody);
        section.appendChild(card);







    }

    const postSection = document.querySelector('.post-section');
    postSection.addEventListener('click', (e) => {
        e.preventDefault();
        //const childnodes = postSection.childNodes;
        const clickedNode = e.target;
        console.log(clickedNode)
        const clickedParent = clickedNode.parentNode;
        let clickedPreSibling = "";
        let clickedSibling = "";
        if(clickedNode.classList.contains("dislike-dark-icon") || clickedNode.classList.contains("dislike-icon") ) {
            console.log(clickedNode.parentNode.previousSibling.childNodes[0]);
            clickedPreSibling = clickedNode.parentNode.previousSibling.childNodes[0];
            clickedSibling = clickedNode.parentNode.nextSibling.childNodes[0];
        }
        //const clickedSibling = clickedNode.parentNode.nextSibling.childNodes[0];
       
        if (clickedNode.classList.contains("like-icon") && clickedNode.parentNode.nextSibling.childNodes[0].classList.contains("dislike-dark-icon")) {
            if (clickedNode.matches(".fa-laugh-squint") && clickedNode.parentNode.nextSibling.childNodes[0].matches(".fa-tired")) {
                clickedNode.parentNode.nextSibling.childNodes[0].classList.remove('fas', 'fa-tired', 'dislike-dark-icon');
                clickedNode.parentNode.nextSibling.childNodes[0].classList.add('far', 'fa-tired', 'dislike-icon');
                clickedNode.classList.remove('far', 'fa-laugh-squint', 'like-icon');
                clickedNode.classList.add('fas', 'fa-laugh-squint', 'like-dark-icon');
                const position = clickedNode.parentNode.parentNode.parentNode.childNodes[0];
                const indexnode = position.innerHTML;
                const indexNo = parseInt(indexnode);
                const likePost = postArray[indexNo - 1];
                console.log(likePost.numberOfUpvotes);
                let upvote = parseInt(clickedParent.childNodes[1].nodeValue) + 1;
                let downvote = parseInt(clickedNode.parentNode.nextSibling.childNodes[0].parentNode.childNodes[1].nodeValue) - 1;
                if (downvote < 0) {
                    downvote = 0;
                }
                const textnode = document.createTextNode(upvote);
                const dtextnode = document.createTextNode(downvote);
                clickedParent.replaceChild(textnode, clickedParent.childNodes[1]);
                clickedNode.parentNode.nextSibling.childNodes[0].parentNode.replaceChild(dtextnode, clickedNode.parentNode.nextSibling.childNodes[0].parentNode.childNodes[1]);
                dislikeReq(firebase.auth().currentUser.email, likePost.id);
                likeReq(firebase.auth().currentUser.email, likePost.id);
            }

        } else if (clickedNode.classList.contains("like-icon") && clickedNode.parentNode.nextSibling.childNodes[0].classList.contains("dislike-icon")) {
            if (clickedNode.matches(".fa-laugh-squint")) {
                clickedNode.classList.remove('far', 'fa-laugh-squint', 'like-icon');
                clickedNode.classList.add('fas', 'fa-laugh-squint', 'like-dark-icon');
                const position = clickedNode.parentNode.parentNode.parentNode.childNodes[0];
                const indexnode = position.innerHTML;
                const indexNo = parseInt(indexnode);
                const likePost = postArray[indexNo - 1];
                console.log(likePost.numberOfUpvotes);
                console.log(parseInt(clickedParent.childNodes[1].nodeValue));
                let upvote = parseInt(clickedParent.childNodes[1].nodeValue) + 1;
                const textnode = document.createTextNode(upvote);
                clickedParent.replaceChild(textnode, clickedParent.childNodes[1]);
                likeReq(firebase.auth().currentUser.email, likePost.id);

            }

        }
        else if (clickedNode.classList.contains("like-dark-icon")) {
            if (clickedNode.matches(".fa-laugh-squint")) {
                clickedNode.classList.remove('fas', 'fa-laugh-squint', 'like-dark-icon');
                clickedNode.classList.add('far', 'fa-laugh-squint', 'like-icon');
                //clickedNode.classList.toggle('fas');
                const position = clickedNode.parentNode.parentNode.parentNode.childNodes[0];
                const likenode = document.querySelector(".numberOfLike");
                const indexnode = position.innerHTML;
                const indexNo = parseInt(indexnode);
                const likePost = postArray[indexNo - 1];
                console.log(likePost.numberOfUpvotes);
                let upvote = parseInt(clickedParent.childNodes[1].nodeValue) - 1;
                if (upvote < 0) {
                    upvote = 0;
                }
                const textnode = document.createTextNode(upvote);
                clickedParent.replaceChild(textnode, clickedParent.childNodes[1]);

                likeReq(firebase.auth().currentUser.email, likePost.id);
               

            }



        } else if (clickedNode.classList.contains("dislike-icon") && clickedPreSibling.classList.contains("like-icon")) {
            if(clickedNode.matches(".fa-tired")) {
                clickedNode.classList.remove('far' , 'fa-tired' , 'dislike-icon');
                clickedNode.classList.add('fas' , 'fa-tired' , 'dislike-dark-icon');
                const position = clickedNode.parentNode.parentNode.parentNode.childNodes[0];
                const indexnode = position.innerHTML;
                const indexNo = parseInt(indexnode);
                const likePost = postArray[indexNo - 1];
                let downvote =  parseInt(clickedParent.childNodes[1].nodeValue) + 1;
                const textnode = document.createTextNode(downvote);
                clickedParent.replaceChild(textnode, clickedParent.childNodes[1]);
                dislikeReq(firebase.auth().currentUser.email, likePost.id);
            }

        }else if (clickedNode.classList.contains("dislike-icon") && clickedPreSibling.classList.contains("like-dark-icon") ) {
            if (clickedNode.matches(".fa-tired") && clickedPreSibling.matches(".fa-laugh-squint")) {
                console.log('hi');
                clickedPreSibling.classList.remove('fas', 'fa-laugh-squint', 'like-dark-icon');
                clickedPreSibling.classList.add('far', 'fa-laugh-squint', 'like-icon');
                clickedNode.classList.remove('far', 'fa-tired', 'dislike-icon');
                clickedNode.classList.add('fas', 'fa-tired', 'dislike-dark-icon');
                const position = clickedNode.parentNode.parentNode.parentNode.childNodes[0];
                const indexnode = position.innerHTML;
                const indexNo = parseInt(indexnode);
                const likePost = postArray[indexNo - 1];
                console.log(clickedPreSibling.parentNode.childNodes[1].nodeValue);
                let upvote = parseInt(clickedPreSibling.parentNode.childNodes[1].nodeValue) - 1;
                let downvote =  parseInt(clickedParent.childNodes[1].nodeValue) + 1;
                console.log(upvote);
                console.log(downvote);

                if (upvote < 0) {
                    upvote = 0;
                }
                const textnode = document.createTextNode(upvote);
                const dtextnode = document.createTextNode(downvote);
                clickedParent.replaceChild(dtextnode, clickedParent.childNodes[1]);
                clickedPreSibling.parentNode.replaceChild(textnode, clickedPreSibling.parentNode.childNodes[1]);
                dislikeReq(firebase.auth().currentUser.email, likePost.id);
                likeReq(firebase.auth().currentUser.email, likePost.id);










            }

        } else if (clickedNode.classList.contains("dislike-dark-icon")){
            if (clickedNode.matches(".fa-tired")) {
                clickedNode.classList.remove('fas', 'fa-tired', 'dislike-dark-icon');
                clickedNode.classList.add('far', 'fa-tired', 'dislike-icon');
                //clickedNode.classList.toggle('fas');
                const position = clickedNode.parentNode.parentNode.parentNode.childNodes[0];
                const likenode = document.querySelector(".numberOfLike");
                const indexnode = position.innerHTML;
                const indexNo = parseInt(indexnode);
                const likePost = postArray[indexNo - 1];
                console.log(likePost.numberOfUpvotes);
                let downvote = parseInt(clickedPreSibling.parentNode.childNodes[1].nodeValue) - 1;
                if (downvote < 0) {
                    downvote = 0;
                }
                const textnode = document.createTextNode(downvote);
                clickedParent.replaceChild(textnode, clickedParent.childNodes[1]);
                dislikeReq(firebase.auth().currentUser.email, likePost.id);

        }  
    }  else if (clickedNode.hasAttribute('id') && clickedNode.id == 'post-save'){
        
        const position = clickedNode.parentNode.parentNode.parentNode.childNodes[0];
        const indexnode = position.innerHTML;
        const indexNo = parseInt(indexnode);
        const likePost = postArray[indexNo - 1];
        savePost(likePost.id , firebase.auth().currentUser.email);
    
    }else if (clickedNode.hasAttribute('id') && clickedNode.id == 'post-remove' ){
        console.log("we here");
        const position = clickedNode.parentNode.parentNode.parentNode.childNodes[0];
        const indexnode = position.innerHTML;
        const indexNo = parseInt(indexnode);
        const likePost = postArray[indexNo - 1];
        removePost(likePost.id , firebase.auth().currentUser.email);
       
    }else if (clickedNode.classList.contains("post-tags")) {
        console.log(clickedNode.text);
        window.location.href = "hotTags.html?tag=" + clickedNode.text;   
    }else if (clickedNode.classList.contains('fa-comments')) {
        const position = clickedNode.parentNode.parentNode.parentNode.childNodes[0];
        const indexnode = position.innerHTML;
        const indexNo = parseInt(indexnode);
        const likePost = postArray[indexNo - 1];
        window.location.href = 'comment.html?postId=' + likePost.id;

        
        
    }else if (clickedNode.classList.contains('user-img')){
        const Email = clickedNode.previousSibling.textContent;
        window.location.href = 'other.html?email=' + Email;
    }

    else {
        console.log('nothing clicked');
    }



    });

    function removePost(id, Email) {
        const params = {
            postId: id,
            email: Email
        }
        const jsonObject = JSON.stringify(params);
        if (firebase.auth().currentUser) {

            firebase.auth().currentUser.getIdToken().then((token) => {
                console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/', 'with ID token in Authorization header.');
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/delete', true);
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

    function savePost (postId , Email ) {
        const params = {
            postId: postId,
            email: Email
        }
        const jsonObject = JSON.stringify(params);
        if (firebase.auth().currentUser) {

            firebase.auth().currentUser.getIdToken().then((token) => {
                console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/', 'with ID token in Authorization header.');
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/save', true);
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

    function dislikeReq (Email , id) {
        const params = {
            postId: id,
            email: Email
        }
        const jsonObject = JSON.stringify(params);
        if (firebase.auth().currentUser) {

            firebase.auth().currentUser.getIdToken().then((token) => {
                console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/', 'with ID token in Authorization header.');
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/downvote', true);
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

    function likeReq(Email, id) {

        const params = {
            postId: id,
            email: Email
        }
        const jsonObject = JSON.stringify(params);
        if (firebase.auth().currentUser) {

            firebase.auth().currentUser.getIdToken().then((token) => {
                console.log('sending request to', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/', 'with ID token in Authorization header.');
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://us-central1-meme-project-0.cloudfunctions.net/webApi/api/post/upvote', true);
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



