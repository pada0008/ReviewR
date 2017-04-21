var jReviewR = {
    key: "reviewR-pada0008"
    , data: []
    , cameraImg: ""
    , rating1Count: 0
    , rating2Count: 0
    , form1error: 0
    , form2error: 0
    , form2id: 0
}

function appInit() {
    if (!(localStorage.getItem(jReviewR.key) === null)) {
        jReviewR.data = localStorage.getItem(jReviewR.key);
        jReviewR.data = JSON.parse(jReviewR.data);
    }
    var img1 = document.getElementById("img1");
    var title1 = document.getElementById("title1");
    var rating1 = document.querySelectorAll('.star1');
        [].forEach.call(rating1, function (star, index) {
        star.addEventListener('click', (function (idx) {
            return function () {
                jReviewR.rating1Count = idx + 1;
                form1Ratingset();
            }
        })(index));
    });
    var capture1 = document.getElementById("capture1");
    capture1.addEventListener('touchend', camaraClick);
    var close1 = document.getElementById("close1");
    close1.addEventListener('touchend', form1close);
    var add1 = document.getElementById("add1");
    add1.addEventListener('touchend', formsave);
    var form1Anchor = document.querySelector('#addmodel header a');
    form1Anchor.addEventListener('touchend', form1set);
    var img2 = document.getElementById("img2");
    var title2 = document.getElementById("title2");
    var rating2 = document.querySelectorAll('.star2');
    jReviewR.rating2Count = 0;
        [].forEach.call(rating2, function (star, index) {
        star.addEventListener('click', (function (idx) {
            return function () {
                jReviewR.rating2Count = idx + 1;
                form2Ratingset();
            }
        })(index));
    });
    var delete2 = document.getElementById("delete2");
    delete2.addEventListener('touchend', datadelete);
    var close2 = document.getElementById("close2");
    close2.addEventListener('touchend', form2close);
    var update2 = document.getElementById("update2");
    update2.addEventListener('touchend', formsave);
    var form2Anchor = document.querySelector('#editmodel header a');
    form2Anchor.addEventListener('touchend', form2set);
    drawList();
}

function form1set() {
    var img1 = document.getElementById("img1");
    var title = document.getElementById("title1");
    var rating1 = document.querySelectorAll('.star1');
        [].forEach.call(rating1, function (star, index) {
        star.addEventListener('click', (function (idx) {
            return function () {
                jReviewR.rating1Count = idx + 1;
                form1Ratingset();
            }
        })(index));
    });
    img1.classList.add("hide");
    img1.innerHTML = "";
    title.value = "";
    jReviewR.rating1Count = 0;
    form1Ratingset();
}

function form1Ratingset() {
    var rating1 = document.querySelectorAll('.star1');
        [].forEach.call(rating1, function (star, index) {
        if (jReviewR.rating1Count > index) {
            star.classList.add('rated');
        }
        else {
            star.classList.remove('rated');
        }
    });
}

function formcheck() {
    jReviewR.form1error = 0;
    jReviewR.form2error = 0;
    if (jReviewR.form2id > 0) {
        var title2 = document.getElementById("title2");
        if (title2.value == "") {
            title2.parentElement.classList.add("err");
            jReviewR.form2error = 1;
        }
        else {
            title2.parentElement.classList.remove("err");
        }
    }
    else {
        var title1 = document.getElementById("title1");
        if (title1.value == "") {
            title1.parentElement.classList.add("err");
            jReviewR.form1error = 1;
        }
        else {
            title1.parentElement.classList.remove("err");
        }
        var rating1 = document.querySelectorAll('.star1');
        if (jReviewR.rating1Count == 0) {
            rating1[0].parentElement.classList.add("err");
            jReviewR.form1error = 1;
        }
        else {
            rating1[0].parentElement.classList.remove("err");
        }
    }
}

function camaraClick() {
    navigator.camera.getPicture(OnSuccess, Onfail, {
        destinationType: Camera.DestinationType.FILE_URI
        , quality: 50
        , encodingType: Camera.EncodingType.JPEG
        , mediaType: Camera.MediaType.PICTURE
        , allowEdit: true
        , correctOrientation: true //Corrects Android orientation quirks
    });
}

function OnSuccess(imageData) {
    var img1 = document.getElementById("img1");
    var img = document.createElement('img');
    img.src = imageData;
    jReviewR.cameraImg = imageData;
    img1.innerHTML = "";
    img1.appendChild(img);
    img1.classList.remove('hide');
}

function Onfail(message) {
    alert('Camera Failed because: ' + message);
}

function form1close() {
    var closelink = document.querySelector('#addmodel header a');
    var myClick = new CustomEvent('touchend', {
        bubbles: true
        , cancelable: true
    });
    closelink.dispatchEvent(myClick);
}

function formsave() {
    formcheck();
    if (jReviewR.form2id > 0) {
        if (!jReviewR.form2error) {
            jReviewR.data[jReviewR.form2id - 1].title = title2.value;
            jReviewR.data[jReviewR.form2id - 1].rating = jReviewR.rating2Count;
            jReviewR.form2id = 0;
            form2close();
            storeLocal();
            drawList();
        }
        else {
            console.log('Err: error in form.!!')
        }
    }
    else {
        if (!jReviewR.form1error) {
            var title = document.getElementById("title1");
            var datanew = {
                id: Math.random().toString(36).substring(7)
                , title: title.value
                , rating: jReviewR.rating1Count
                , img: jReviewR.cameraImg
            }
            jReviewR.data.push(datanew);
            form1close();
            storeLocal();
            drawList();
        }
        else {
            console.log('Err: error in form.!!')
        }
    }
}

function form2set() {
    var img2 = document.getElementById("img2");
    var title2 = document.getElementById("title2");
    jReviewR.rating2Count = 0;
    if (jReviewR.form2id) {
        var id = jReviewR.form2id - 1;
        var img = document.createElement('img');
        img.src = jReviewR.data[id].img;
        img2.innerHTML = "";
        img2.appendChild(img);
        title2.value = jReviewR.data[id].title;
        jReviewR.rating2Count = jReviewR.data[id].rating;
        form2Ratingset();
    }
    else {
        console.log('Err: no edit id get.!!')
    }
}

function form2Ratingset() {
    var rating2 = document.querySelectorAll('.star2');
        [].forEach.call(rating2, function (star, index) {
        if (jReviewR.rating2Count > index) {
            star.classList.add('rated');
        }
        else {
            star.classList.remove('rated');
        }
    });
}

function form2close() {
    var closelink = document.querySelector('#editmodel header a');
    var myClick = new CustomEvent('touchend', {
        bubbles: true
        , cancelable: true
    });
    closelink.dispatchEvent(myClick);
}

function drawList() {
    var li_list = document.getElementById("review-list");
    if (jReviewR.data.length) {
        li_list.innerHTML = ""
        jReviewR.data.forEach(function (item, i) {
            var li = document.createElement("li");
            li.classList = "table-view-cell media";
            var a = document.createElement("a");
            a.classList = "navigate-right";
            a.setAttribute("href", "#editmodel");
            var img = document.createElement("img");
            img.classList = "media-object pull-left";
            if (item.img == "") {
                img.setAttribute("src", "img/logo.png");
            }
            else {
                img.setAttribute("src", item.img);
            }
            var div = document.createElement("div");
            div.classList = "media-body";
            div.innerHTML = item.title;
            var rating = document.createElement('div');
            rating.classList = "input-row stars-list";
            for (var r = 0; r < item.rating; r++) {
                var star = document.createElement("span");
                star.classList = "star rated";
                rating.appendChild(star);
            }
            div.appendChild(rating);
            a.appendChild(img);
            a.appendChild(div);
            li.appendChild(a);
            li_list.appendChild(li);
            a.addEventListener('touchend', function (index) {
                return function () {
                    jReviewR.form2id = index + 1;
                    form2set();
                }
            }(i));
        });
    }
    else {
        li_list.innerHTML = "";
    }
}

function datadelete() {
    if (confirm("Are you sure want to delete this Review ?")) {
        jReviewR.data.splice(jReviewR.form2id - 1, 1);
        storeLocal();
        jReviewR.form2id = 0;
        form2close();
        drawList();
    }
}

function storeLocal() {
    var d = JSON.stringify(jReviewR.data);
    localStorage.removeItem(jReviewR.key);
    localStorage.setItem(jReviewR.key, d);
}
document.addEventListener("deviceready", appInit);