$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].summary + "</p>")
    }
});


$(document).on("click", "p", function () {
    $("#comment").empty();
    var dataId = $(this).attr("data-id");

    $.ajax({
            method: "GET",
            url: "/articles/" + dataId
        }).then(function (data) {
            console.log(data);

            $("#comment").append("<h2>" + data.title + "</h2>");
            $("#comment").append("<input id='titleinput' name='title' >");
            $("#comment").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#comment").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");


            if (data.comment) {
                $("#titleinput").val(data.comment.commentTitle);
                $("#bodyinput").val(data.comment.commentText);
            }
        });
});


$(document).on("click", "#savenote", function () {
    var dataId = $(this).attr("data-id");
    console.log(dataId)

    $.ajax({
            method: "POST",
            url: "/articles/" + dataId,
            data: {
                commentTitle: $("#titleinput").val(),
                commentText: $("#bodyinput").val()
            }
        }).then(function (data) {
            console.log(data);
            $("#comment").empty();
        });
    $("#titleinput").val("");
    $("#bodyinput").val("");
});