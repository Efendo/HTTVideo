$("button").click( () => {
    $.post(`/delete?passwrd=${prompt("Admin Password")}`, (data, status) => {
        $("#log").append(`<br>Delete:${status}:${data}`);
        if(status == "success"){window.location = "/"};
    } );
} );