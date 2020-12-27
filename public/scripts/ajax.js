window.onload = () => {
    var form = document.getElementById('formId');
    var input = document.getElementById('urlInput');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var data = { url: input.value };
        check(data);
    });
};

function check(data) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function (event) {
        document.getElementById('btn').style.display = "none";
        document.getElementById('urlInput').style.display = "none";

        let label = document.getElementById('urlLabel');
        label.style.border = "3px solid black";
        label.style.borderRadius = "15px";
        label.style.padding = "20px";
        label.innerHTML = JSON.parse(request.responseText).message;
    });
    request.headers
    request.open("POST", "/");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(data));
}