function addToDo() {

    listToDo.innerHTML += "<li> <input type=\"checkbox\">" + inputToDo.value + "</li>";
    inputToDo.value = "";
}