var cdApp = {
    key: "reviewR-pada0008"
    , data: []
    , review_list: null
        /*---- model add ----*/
        
    , f_add_name: null
    , f_add_rating: null
    , f_add_rating_star: null
    , f_add_img: null
    , f_add_img_url: null
    , b_add_capture: null
    , b_add_close: null
    , b_add_add: null
        /*---- model edit ----*/
        
    , f_edit_id: 0
    , f_edit_name: null
    , f_edit_rating: null
    , f_edit_rating_star: null
    , f_edit_img: null
    , f_edit_img_url: null
    , b_edit_delete: null
    , b_edit_close: null
    , b_edit_update: null
    , flags_error: 0
    , data_id: null
    , edit_id: null
    , init: function () {
        if (!(localStorage.getItem(cdApp.key) === null)) {
            cdApp.data = localStorage.getItem(cdApp.key);
            cdApp.data = JSON.parse(cdApp.data);
        }
        cdApp.review_list = document.getElementById("review-list");
        /*---- model Add ----*/
        cdApp.f_add_img = document.getElementById("f-add-img");
        cdApp.f_add_name = document.getElementById("f-add-name");
        cdApp.f_add_rating_star = document.querySelectorAll('.add-star');
        cdApp.f_add_rating = 0;
        [].forEach.call(cdApp.f_add_rating_star, function (star, index) {
            star.addEventListener('click', (function (idx) {
                return function () {
                    cdApp.f_add_rating = idx + 1;
                    cdApp.setRatingAdd();
                }
            })(index));
        });
        cdApp.b_add_capture = document.getElementById("b-add-capture");
        cdApp.b_add_capture.addEventListener('touchend', cdApp.captureAdd);
        cdApp.b_add_close = document.getElementById("b-add-close");
        cdApp.b_add_close.addEventListener('touchend', cdApp.closeFormAdd);
        cdApp.b_add_add = document.getElementById("b-add-add");
        cdApp.b_add_add.addEventListener('touchend', cdApp.reviewAdd);
        cdApp.setUpFormAdd();
        var addAnchor = document.querySelector('#model-add header a');
        addAnchor.addEventListener('touchend', cdApp.setUpFormAdd);
        /*--- model edit ----*/
        cdApp.f_edit_img = document.getElementById("f-edit-img");
        cdApp.f_edit_name = document.getElementById("f-edit-name");
        cdApp.f_edit_rating_star = document.querySelectorAll('.edit-star');
        cdApp.f_edit_rating = 0;
        [].forEach.call(cdApp.f_edit_rating_star, function (star, index) {
            star.addEventListener('click', (function (idx) {
                return function () {
                    cdApp.f_edit_rating = idx + 1;
                    cdApp.setRatingEdit();
                }
            })(index));
        });
        cdApp.b_edit_delete = document.getElementById("b-edit-delete");
        cdApp.b_edit_delete.addEventListener('touchend', cdApp.reviewDelete);
        cdApp.b_edit_close = document.getElementById("b-edit-close");
        cdApp.b_edit_close.addEventListener('touchend', cdApp.closeFormEdit);
        cdApp.b_edit_update = document.getElementById("b-edit-update");
        cdApp.b_edit_update.addEventListener('touchend', cdApp.reviewAdd);
        /*---- draw list ----*/
        cdApp.drawItem();
    }
    , setUpFormAdd: function () {
        cdApp.f_add_img.classList.add("hide");
        cdApp.f_add_img.innerHTML = "";
        cdApp.f_add_name.value = "";
        cdApp.f_add_rating = 0;
        cdApp.setRatingAdd();
    }
    , setRatingAdd: function () {
        [].forEach.call(cdApp.f_add_rating_star, function (star, index) {
            if (cdApp.f_add_rating > index) {
                star.classList.add('rated');
            }
            else {
                star.classList.remove('rated');
            }
        });
    }
    , checkform: function () {
       cdApp.flags_error = 0;
        if (cdApp.f_edit_id > 0) {
            if (cdApp.f_edit_name.value == "") {
                cdApp.f_edit_name.parentElement.classList.add("err");
                cdApp.flags_error = 1;
            }
            else {
                cdApp.f_edit_name.parentElement.classList.remove("err");
            }
        }
        else {
            if (cdApp.f_add_name.value == "") {
                cdApp.f_add_name.parentElement.classList.add("err");
                cdApp.flags_error = 1;
            }
            else {
                cdApp.f_add_name.parentElement.classList.remove("err");
            }
            var rat = document.getElementById("star-lable-add");
            if (cdApp.f_add_rating == 0) {
                rat.classList.add("err");
                cdApp.flags_error = 1;
            }
            else {
                rat.classList.remove("err");
            }
//            if (cdApp.f_add_img_url == "" || cdApp.f_add_img_url == null) {
//                cdApp.f_add_img.classList.add("err");
//                cdApp.f_add_img.classList.remove("hide");
//                cdApp.f_add_img.innerHTML = " Take Picture !!";
//                cdApp.flags_error = 1;
//            }
//            else {
//                cdApp.f_add_img.classList.add("hide");
//                cdApp.f_add_img.classList.remove("err");
//                cdApp.f_add_img.innerHTML = "";
            }
        }
    }
    , captureAdd: function () {}
    , closeFormAdd: function () {
        var closelink = document.querySelector('#model-add header a');
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        closelink.dispatchEvent(myClick);
    }
    , reviewAdd: function () {
        cdApp.checkform();
        if (!cdApp.flags_error) {
            if (cdApp.f_edit_id > 0) {
                cdApp.data[cdApp.f_edit_id - 1].name = cdApp.f_edit_name.value;
                cdApp.data[cdApp.f_edit_id - 1].rating = cdApp.f_edit_rating;
                cdApp.f_edit_id = 0;
                cdApp.closeFormEdit();
            }
            else {
                var new_r = {
                    id: Math.random().toString(36).substring(7)
                    , name: cdApp.f_add_name.value
                    , rating: cdApp.f_add_rating
                    , img: ""
                }
                cdApp.data.push(new_r);
                cdApp.closeFormAdd();
            }
            cdApp.storeLocal();
            cdApp.drawItem();
        }
        else {
            console.log('Err: error in form.!!')
        }
    }
    , setUpFormEdit: function () {
        if (cdApp.f_edit_id) {
            var id = cdApp.f_edit_id - 1;
            cdApp.f_edit_img_url = cdApp.data[id].img;
            cdApp.f_edit_name.value = cdApp.data[id].name;
            cdApp.f_edit_rating = cdApp.data[id].rating;
            cdApp.setRatingEdit();
        }
        else {
            console.log('Err: no edit id get.!!')
        }
    }
    , setRatingEdit: function () {
        [].forEach.call(cdApp.f_edit_rating_star, function (star, index) {
            if (cdApp.f_edit_rating > index) {
                star.classList.add('rated');
            }
            else {
                star.classList.remove('rated');
            }
        });
    }
    , closeFormEdit: function () {
        var closelink = document.querySelector('#model-edit header a');
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        closelink.dispatchEvent(myClick);
    }
    , drawItem: function () {
        cdApp.review_list.innerHTML = '<center class="note">Add your Review !!</center>';
        if (cdApp.data.length) {
            cdApp.review_list.innerHTML = ""
                //                    for (var i = 0; i < cdApp.data.length; i++) {
            cdApp.data.forEach(function (item, i) {
                var li = document.createElement("li");
                li.className = "table-view-cell media";
                var a = document.createElement("a");
                a.className = "navigate-right";
                a.setAttribute("href", "#model-edit");
                var img = document.createElement("img");
                img.className = "media-object pull-left";
                img.setAttribute("src", "img/icon.camera.jpg");
                var div = document.createElement("div");
                div.className = "media-body";
                div.innerHTML = item.name;
                var rating = document.createElement('div');
                rating.classList = "input-row stars-list";
                for (var r = 0; r < item.rating; r++) {
                    var star = document.createElement("span");
                    star.className = "star rated";
                    rating.appendChild(star);
                }
                div.appendChild(rating);
                a.appendChild(img);
                a.appendChild(div);
                li.appendChild(a);
                cdApp.review_list.appendChild(li);
                a.addEventListener('touchend', function (index) {
                    return function () {
                        cdApp.f_edit_id = index + 1;
                        cdApp.setUpFormEdit();
                    }
                }(i));
            });
        }
    }
    , reviewDelete: function () {
        if (confirm("Are you sure want to delete this Review ?")) {
            cdApp.data.splice(cdApp.f_edit_id - 1, 1);
            cdApp.storeLocal();
            cdApp.f_edit_id = 0;
            cdApp.drawItem();
            cdApp.closeFormEdit();
        }
    }
    , storeLocal: function () {
        var d = JSON.stringify(cdApp.data);
        localStorage.removeItem(cdApp.key);
        localStorage.setItem(cdApp.key, d);
    }
}
document.addEventListener("deviceready", cdApp.init);