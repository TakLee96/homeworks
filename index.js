var store  = window.localStorage;
var list   = JSON.parse(store.getItem("master") || "[]");
var sortBy = store.getItem("sortBy") || "date";
var master = document.getElementById("master");
var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var titleElem  = document.getElementById("title");
var courseElem = document.getElementById("course");
var dateElem   = document.getElementById("date");
var countElem  = document.getElementById("count");
var colorElem  = document.getElementById("color");
var nowElem    = document.getElementById("now");
dateElem.valueAsDate = new Date();
countElem.removeChild(countElem.firstChild);
countElem.appendChild(document.createTextNode(list.length));

var now = new Date(); var d = [now.getFullYear(), now.getMonth()+1, now.getDate()];
nowElem.appendChild(document.createTextNode(d.join("-") + " " + weekdays[now.getDay()]))

function datestrToWeekday(str) {
    var dates = str.split("-");
    var dateObj = new Date(dates[0], dates[1]-1, dates[2]);
    return weekdays[dateObj.getDay()];
}

function itemToElemInto(item, liElem) {
    var dateTxt = document.createTextNode(item.date + " " + datestrToWeekday(item.date));
    var dateElem = document.createElement("span");
    dateElem.className = "label label-default";
    dateElem.appendChild(dateTxt);
    var courseElem = document.createElement("span");
    var courseTxt = document.createTextNode(item.course);
    courseElem.className = "label " + item.color;
    courseElem.appendChild(courseTxt);
    var restTxt = document.createTextNode(" " + item.title + " ");
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
    if (!titleElem.value || !courseElem.value) return;
    list.push({ title: titleElem.value, date: dateElem.value, course: courseElem.value, color: colorElem.value }); update();
});

var sortByElems = document.getElementsByClassName("sort");
for (var i = 0; i < sortByElems.length; i++) {
    sortByElems[i].addEventListener("click", function (event) {
        store.setItem("sortBy", this.dataset.value); update();
    });
}
