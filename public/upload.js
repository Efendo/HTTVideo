$("#uploadForm").on('submit', function(e) {
    
    e.preventDefault();
    
    var name = $("#name").val();
    var formData = new FormData(this);
    
    $("svg").removeClass("hidden");
    $.ajax({
        url: `/upload/?name=${name}`,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            $("svh").addClass("animate-spin");
            console.log(`%cUpload success: ${data}`, 'color: green;');
            $("#uploadForm").append("<label style='color: green'>Success! Redirecting...</label>");
            location = "/";
        },
        
        error: function(data) {
            $("svg").addClass("animate-spin");
            $("#uploadForm").append("<label style='color: red'>An error has happened! Try again</label>");
            console.error('Upload error: ', data);
            location = "/new.html";
        }
    },);
});