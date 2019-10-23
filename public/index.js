$(document).ready(function() {
    let urlParams = new URLSearchParams(window.location.search);
    let status = urlParams.get('status');
    
    let toast = $('.toast');

    // Fires right when show toast is called.
    toast.on('show.bs.toast', function() {
        if (status == 'success') {
            toast.addClass('success');
            $('.toast-body').text('Succesfully added database entry.');
        }
        if (status == 'error') {
            toast.addClass('error');
            $('.toast-body').text('Failed to add databes entry.');
        }
    });

    // Fires when toast is finished being hidden.
    toast.on('hidden.bs.toast', function() {
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
});