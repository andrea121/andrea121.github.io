
function refreshPage() {
    location.reload();
}

function sortFeeds() {
    feed_list.sort(function(x, y){
        return y.timestamp - x.timestamp;
    });
    if((image_loaded || status_loaded) && users_loaded) {
        displayFeeds();
    }
}

function sortComments() {
    comment_list.sort(function(x, y){
        return x.timestamp - y.timestamp;
    });
    if(comments_loaded) {
        displayComments();
    }
}

function getDateTime() {
    var currentdate = new Date(); 
    return currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/" 
            + currentdate.getFullYear() + " "  
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes();
}

function getTimestamp() {
    return new Date().getTime();
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function logout() {
    localStorage.removeItem('user_id');
    document.location.replace('index.html');
}

function checkLogin(){
    if(user_id == null) {
        document.location.replace('index.html');
    } else {
        document.getElementById('navbar').innerHTML += '<a href="#" onclick="logout()">Logout</a>';
    }
}