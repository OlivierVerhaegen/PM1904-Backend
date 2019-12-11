var users;
var products;
var orders;

$(document).ready(function () {
    function statusUpdate() {
        fetch('/orders')
            .then(response => {
                return response.json()
            })
            .then(data => {

                orders = data;
                var tr;

                var lookup = {};
                var items = data;
                var result = [];
                for (var item, i = 0; item = items[i++];) {
                    var orderId = item.orderId;
                    if (!(orderId in lookup)) {
                        lookup[orderId] = 1;
                        result.push({ orderId: item.orderId, status: item.status });
                    }
                }
                $(".orderTable-preparing tr").remove(); 
                $(".orderTable-done tr").remove(); 
                for (var i = 0; i < result.length; i++) {
                    tr = $('<tr/>');
                    if (result[i].status == 'busy') {
                        tr.append("<td>" + result[i].orderId + "</td>");
                    }
                    $('.orderTable-preparing').append(tr);
                }

                for (var i = 0; i < result.length; i++) {
                    tr = $('<tr/>');
                    if (result[i].status == 'ready') {
                        tr.append("<td>" + result[i].orderId + "</td>");
                    }
                    $('.orderTable-done').append(tr);
                }

                console.log(result)

            })
            .catch(err => { });

    }
    statusUpdate();
    setInterval(statusUpdate, 1000);
});


