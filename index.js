var store  = window.localStorage;
var list   = JSON.parse(store.getItem("master") || "[]");
var sortBy = store.getItem("sortBy") || "date";
var showdd = store.getItem("showdd") || "true";
var master = document.getElementById("master");
var ref    = new Firebase("https://scorching-inferno-470.firebaseio.com/");
var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var titleElem  = document.getElementById("title");
var courseElem = document.getElementById("course");
var dateElem   = document.getElementById("date");
var countElem  = document.getElementById("count");
var colorElem  = document.getElementById("color");
var nowElem    = document.getElementById("now");
var showddElem = document.getElementById("showdd");
if (showdd == "true") showddElem.appendChild(document.createTextNode("Hide Date Difference"));
else showddElem.appendChild(document.createTextNode("Show Date Difference"));
dateElem.valueAsDate = new Date();
countElem.removeChild(countElem.firstChild);
countElem.appendChild(document.createTextNode(list.length));

var now = new Date(); var d = [now.getFullYear(), now.getMonth()+1, now.getDate()];
nowElem.appendChild(document.createTextNode(d.join("-") + " " + weekdays[now.getDay()]))

function parseDate(str) {
    var dates = str.split("-");
    return new Date(dates[0], dates[1]-1, dates[2]);
}

function datestrToWeekday(str) {
    return weekdays[parseDate(str).getDay()];
}

function datediff(str) {
    var diff = Math.floor((parseDate(str) - now) / 86400000) + 1; 
    if (diff < 0) return [ (-diff) + " days past", "label-default" ];
    else if (diff == 0) return [ ">TODAY<", "label-danger" ];
    else if (diff == 1) return [ "Tomorrow", "label-warning" ];
    else return [diff + " days left", "label-info" ];
}

function itemToElemInto(item, liElem) {
    var dateTxt = document.createTextNode(item.date + " " + datestrToWeekday(item.date));
    var dateElem = document.createElement("span");
    dateElem.className = "label label-default";
    dateElem.appendChild(dateTxt);
    var ddiff = datediff(item.date);
    var leftTxt = document.createTextNode(ddiff[0]);
    var leftElem = document.createElement("span");
    leftElem.className = "label " + ddiff[1];
    leftElem.appendChild(leftTxt);
    var courseElem = document.createElement("span");
    var courseTxt = document.createTextNode(item.course);
    courseElem.className = "label " + item.color;
    courseElem.appendChild(courseTxt);
    var restTxt = document.createTextNode(" " + item.title + " ");
    if (showdd == "true") {
        liElem.appendChild(leftElem);
        liElem.appendChild(document.createTextNode(" "));
    }
    liElem.appendChild(dateElem);
    liElem.appendChild(document.createTextNode(" "));
    liElem.appendChild(courseElem);
    liElem.appendChild(restTxt);
}

function update() {
    store.setItem("master", JSON.stringify(list));
    window.location.reload();
}

function renderItem(item, index) {
    var liElem = document.createElement("li");
    itemToElemInto(item, liElem);
    var btnElem = document.createElement("button");
    var btnTxt  = document.createTextNode("×");
    btnElem.appendChild(btnTxt);
    btnElem.addEventListener("click", function (event) {
        list.splice(index, 1); update();
    });
    btnElem.className = "btn btn-default btn-xs";
    liElem.appendChild(btnElem);
    liElem.className = "list-group-item";
    master.appendChild(liElem);
}

list.sort(function (a, b) {
    if (a[sortBy] > b[sortBy])
        return 1;
    else if (a[sortBy] < b[sortBy])
        return -1;
    else return 0;
})

for (var i = 0; i < list.length; i++) {
    renderItem(list[i], i);
}

document.getElementById("add").addEventListener("click", function (event) {
    if (!titleElem.value || !courseElem.value || !dateElem.value || !colorElem.value) return;
    list.push({ title: titleElem.value, date: dateElem.value, course: courseElem.value, color: colorElem.value }); update();
});

var sortByElems = document.getElementsByClassName("sort");
for (var i = 0; i < sortByElems.length; i++) {
    sortByElems[i].addEventListener("click", function (event) {
        store.setItem("sortBy", this.dataset.value); update();
    });
}

function getId() {
    while (!id) var id = prompt("Please enter some id that only you know");
    return id;
}

document.getElementById("save").addEventListener("click", function () {
    var config = {};
    config[getId()] = JSON.stringify(list);
    ref.set(config);
    alert("DONE!");
});
document.getElementById("load").addEventListener("click", function () {
    ref.child(getId()).on("value", function (snapshot) {
        store.setItem("master", snapshot.val() || "[]");
        window.location.reload();
    });
});

showddElem.addEventListener("click", function () {
    store.setItem("showdd", (showdd == "true") ? "false" : "true");
    update();
});
