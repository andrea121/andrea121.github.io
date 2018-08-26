document.getElementById("change-img-btn").addEventListener("click", changeProfileImage);
document.getElementById("add-status-btn").addEventListener("click", addStatus);
document.getElementById("add-img-btn").addEventListener("click", addImage);

function getUserProfile() {
    var user_profile = {};
    var user_image_div = document.getElementById('user-image');
    var username_div = document.getElementById('username');
    var http = new XMLHttpRequest();
    http.open('GET', 'php/get_users.php', true);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var data = JSON.parse(http.responseText);
            if(data.data != '') {
                data.data.forEach(function(user_data) {
                    if(user_data.id == user_id){              
                        user_profile = user_data;
                    }
                });                
                if(user_profile.image != null) {
                    user_image_div.innerHTML = '<img src="img/'+user_profile.image+'" />';
                } else {
                    user_image_div.innerHTML = '<img src="img/no-img.png" />';
                }
                username_div.innerHTML = user_profile.username;
            }
        }
    }
    http.send(null);
}

function getStatuses(statuses_for_user = null) {
    var http = new XMLHttpRequest();
    http.open('GET', 'php/get_statuses.php', true);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var data = JSON.parse(http.responseText);
            if(data.data != '') {
                data.data.forEach(function(status) {
                    var item = {
                        id: status.id,
                        type: 'status',
                        datetime: status.created_at.replace("_"," "),
                        author: status.user_id,
                        content: status.status.split("_").join(" "),
                        timestamp: status.timestamp,
                        private: false
                    }
                    if(statuses_for_user != null) {
                        if(status.user_id == statuses_for_user) {                            
                            feed_list.push(item);
                        }
                    } else {
                        feed_list.push(item);
                    }
                    
                });
                status_loaded = true;
                sortFeeds();
            }
        }
    }
    http.send(null);
}

function getImages(statuses_for_user = null) {
    var http = new XMLHttpRequest();
    http.open('GET', 'php/get_images.php', true);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var data = JSON.parse(http.responseText);
            if(data.data != '') {
                data.data.forEach(function(image) {
                    var item = {
                        id: image.id,
                        type: 'image',
                        datetime: image.date_uploaded.replace("_", " "),
                        author: image.user_id,
                        content: image.name,
                        timestamp: image.timestamp,
                        private: image.private
                    }
                    
                    if(statuses_for_user != null) {
                        if(image.user_id == statuses_for_user && image.private != true) {                            
                            feed_list.push(item);
                        }
                    } else {
                        feed_list.push(item);
                    }
                });                
                image_loaded = true;
                sortFeeds();
            }
        }
    }
    http.send(null);
}

function getUsers(get_user = false) {
    user_list = [];
    var http = new XMLHttpRequest();
    http.open('GET', 'php/get_users.php', true);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var data = JSON.parse(http.responseText);
            if(data.data != '') {
                data.data.forEach(function(user) {
                    var item = {
                        id: user.id,
                        name: user.first_name + ' ' + user.last_name,
                        image: user.image
                    }
                    user_list.push(item);
                });
                users_loaded = true;
                if(get_user) {
                    displayUser();
                } else {
                    sortFeeds();    
                }
            }
        }
    }
    http.send(null);
}

function loadData() {
    getStatuses();
    getImages();
    getUsers();
    getUserProfile();
}

function displayFeeds() {
    status_div.innerHTML = '';
    feed_list.forEach(function(feed) {
        if(feed.private && feed.author != user_id) {
            console.log(feed);
        } else {
            var feed_content = '<section class="feed-content">';        
            user_list.forEach(function(user) {
                if(user.id == feed.author) {
                    feed_content += '<section class="feed-author"><a href="users.html?id=' + user.id + '">';
                    if(user.image == null){
                        feed_content += '<img src="img/no-img.png" />';
                    } else {
                        feed_content += '<img src="img/' + user.image + '" />';
                    }
                    feed_content += '</a>' + user.name + '</section>';
                }
            });
            feed_content += '<section class="feed-body">';
            if(feed.type == 'image') {
                feed_content += '<a href="image.html?id=' + feed.id + '"><img title="Click to add comment" src="img/' + feed.content + '" /></a>';
            } else {
                feed_content += '<p class="feed-status">' + feed.content + '</p>';
            }
            feed_content += '<p class="created">' + feed.datetime + '</p></section></section>';
            status_div.innerHTML += feed_content;
        }
    });
}

function addStatus() {
    var valid = true;
    var status_content = document.getElementById("status").value;
    if(status_content == "") {
        errors.innerHTML += '<article class="error-msg">&#9888; Input field empty. Please type something first. </article>';
        valid = false;
    }
    if(valid) {
        var status = {
            id: makeid(),
            user_id: user_id,
            status: status_content,
            created_at: getDateTime(),
            timestamp: getTimestamp()
        }

        errors.innerHTML = '';
        success.innerHTML = '';

        var http = new XMLHttpRequest();
        http.open('POST', 'php/add_status.php', true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                var data = JSON.parse(http.responseText);
                if(data.success != '') {
                    success.innerHTML = '<article class="success-msg">New status created.</article>';
                    setTimeout(refreshPage, 1000);
                }
            }
        }
        var data = JSON.stringify(status);
        http.send(data);
    }
}

function addImage() {
    var image = document.getElementById('image').files[0];
    var checkbox = document.getElementById('private');
    var private = false;
    if(checkbox.checked == true) {
        private = true;
    }
    if(image != undefined) {
        var url = 'php/upload.php?user_id=' + user_id + '&private=' + private + '&timestamp=' + getTimestamp();
    
        var formData = new FormData();
        formData.append('image', image);

        fetch(url, {
            method: 'POST',
            body: formData
        }).then(response => {
            errors.innerHTML = '';
            success.innerHTML = '';

            if(response.status == 200) {
                success.innerHTML = '<article class="success-msg">New image created.</article>';
                setTimeout(refreshPage, 1000);
            } else {
                errors.innerHTML = '<article class="error-msg">&#9888; Error during image upload.</article>';
            }
        });
    } else {
        errors.innerHTML = '<article class="error-msg">&#9888; Please choose image.</article>';
    }
}

function changeProfileImage() {
    errors.innerHTML = '';
    success.innerHTML = '';
    var profile_image = document.getElementById('profile-image').files[0];
    if(profile_image != undefined) {
        var url = 'php/profile_image_upload.php?user_id=' + user_id;
    
        var formData = new FormData();
        formData.append('image', profile_image);

        fetch(url, {
            method: 'POST',
            body: formData
        }).then(response => {            
            if(response.status == 200) {
                success.innerHTML = '<article class="success-msg">User profile image updated.</article>';
                setTimeout(refreshPage, 1000);
            } else {
                errors.innerHTML = '<article class="error-msg">&#9888; Error during image upload.</article>';
            }
        });
    } else {
        errors.innerHTML = '<article class="error-msg">&#9888; Please select image.</article>';
    }
}