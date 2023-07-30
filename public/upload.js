$("#uploadForm").on('submit', function(e) {
    
    e.preventDefault();
    
    var name = $("#name").val();
    var formData = new FormData(this);
    
    $("svg").removeClass("hidden");
    $.ajax({
        url: `/upload?name=${name}`,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            $("svg").addClass("hidden");
            console.log(`%cUpload success: ${data}`, 'color: green;');
            $("#uploadForm").append("<label class='text-green-500 font-black'>Success! Redirecting...</label>");
            location = "/";
        },
        
        error: function(data) {
            $("svg").addClass("hidden");
            $("#uploadForm").append("<label class='text-rose-500 font-black'>An error has happened! Try again</label>");
            console.error('Upload error: ', data);
            location = "/new.html";
        }
    },);
});