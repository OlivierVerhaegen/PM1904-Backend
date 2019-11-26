$(document).ready(function () {
    let urlParams = new URLSearchParams(window.location.search);
    let status = urlParams.get('status');

    let toast = $('.toast');

    // Fires right when show toast is called.
    toast.on('show.bs.toast', function () {
        if (status == 'success') {
            toast.addClass('success');
            $('.toast-body').text('Successfully added database entry.');
        }
        if (status == 'error') {
            toast.addClass('error');
            $('.toast-body').text('Failed to add database entry.');
        }
        if (status == 'success-login') {
            toast.addClass('success');
            $('.toast-body').text('User logged in.');
        }
        if (status == 'error-login') {
            toast.addClass('error');
            $('.toast-body').text('Incorrect username and/or password!');
        }
        if (status == 'error-empty-login') {
            toast.addClass('error');
            $('.toast-body').text('Please enter username and password.');
        }
    });

    // Fires when toast is finished being hidden.
    toast.on('hidden.bs.toast', function () {
        if (toast.hasClass('success')) {
            toast.removeClass('success');
        }
        if (toast.hasClass('error')) {
            toast.removeClass('error');
        }
    });

    if (status != null) {
        toast.toast('show');
    }



    //-----------------------------------------------------------------------------------
    //                          fetch requests for product list
    //-----------------------------------------------------------------------------------


    fetch('/orders')
        .then(response => {
            return response.json()
        })
        .then(data => {

            var tr;
            for (var i = 0; i < data.length; i++) {
                tr = $('<tr/>');


                tr.append("<td>" + data[i].id + "</td>");
                tr.append("<td>" + data[i].orderId + "</td>");
                tr.append("<td>" + data[i].productId + "</td>");
                tr.append("<td>" + data[i].userId + "</td>");
                tr.append("<td>" + data[i].dateTime + "</td>");
                tr.append("<td>" + data[i].status + "</td>");
                tr.append("<td>" + data[i].quantity + "</td>");
                tr.append("<td>" + data[i].price + "</td>");
                tr.append("<td>" + `<button onclick="orderReady('${data[i].orderId}')" type="button" class="btn btn-success">Ready</button>`+
                `<button onclick="orderDelete(${data[i].id})" type="button" class="btn btn-danger">&times;</button>` + "</td>");
                
                $('.orderTable').append(tr);
            }

            console.log(data)
        })
        .catch(err => { });


    fetch('/user')
        .then(response => {
            return response.json()
        })
        .then(data => {

            var tr;
            for (var i = 0; i < data.length; i++) {
                tr = $('<tr/>');


                tr.append("<td>" + data[i].id + "</td>");
                tr.append("<td>" + data[i].name + "</td>");
                tr.append("<td>" + data[i].studentNumber + "</td>");
                tr.append("<td>" + `<button onclick="userDelete(${data[i].id})" type="button" class="btn btn-danger">&times;</button>` + "</td>");


                $('.userTable').append(tr);
            }

            console.log(data)
        })
        .catch(err => { });




    fetch('/products')
        .then(response => {
            return response.json()
        })
        .then(data => {

            var tr;
            for (var i = 0; i < data.length; i++) {
                tr = $('<tr/>');

                tr.append("<td>" + `<img src="${data[i].photoUrl}" alt="">` + "</td>");
                tr.append("<td>" + data[i].id + "</td>");
                tr.append("<td>" + data[i].name + "</td>");
                tr.append("<td>" + data[i].allergens + "</td>");
                tr.append("<td>" + `<button onclick="productDelete(${data[i].id})" type="button" class="btn btn-danger">&times;</button>` + "</td>");

                $('.productTable').append(tr);
            }

            console.log(data)
        })
        .catch(err => { });
});

function orderReady(orderId) {
    fetch(`/orders/complete/${orderId}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
    }).then(() => {
        window.location.replace("/?status=success");
    }).catch((err) => {
        window.location.replace("/?status=error");
    });
}

function userDelete(userId){
    fetch(`/user/${userId}`,{
        method:'DELETE'
    }).then(() => {
        window.location.replace("/?status=succes");
    }).catch((err)=>{
        window.location.replace("/?status=error");
    });
}


function productDelete(productId){
    fetch(`/products/${productId}`,{
        method:'DELETE'
    }).then(() => {
        window.location.replace("/?status=succes");
    }).catch((err)=>{
        window.location.replace("/?status=error");
    });
}

function orderDelete(orderId){
    fetch(`/orders/${orderId}`,{
        method:'DELETE'
    }).then(() => {
        window.location.replace("/?status=succes");
    }).catch((err)=>{
        window.location.replace("/?status=error");
    });
}