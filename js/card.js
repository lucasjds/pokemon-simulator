$(document).ready(function () {
    console.log("ready!");

    $.ajax({
        "url": "https://randomuser.me/api?results=25",
            "dataType": "json",
            "async": true,
            "success": function(data) {
                $.each(data.results, function (index, client) {
                    $cardItem = "<div class='col-sm-3' >";
                    $cardItem +=    "<div class='card'>";
                    $cardItem +=        "<canvas class='header-bg' width='250' height='70' id='header-blur'></canvas>";
                    $cardItem +=        "<div class='avatar'><img src='" + client.picture.large  + "'></div>";
                    $cardItem +=        "<div class='content'><p>" + client.name.first + ' ' + client.name.last + "</p></div>";
                    $cardItem +=    "</div>";
                    $cardItem += "</div>";
                    $('#row').append($cardItem);
                });
            },
            "error": function(request, status, error) {
                handleError(error);
            }
        });
});   
