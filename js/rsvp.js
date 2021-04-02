var formRoutes = {
    '#rsvp-names': {
        'next': '#rsvp-email'
    },
    '#rsvp-email': {
        'previous': '#rsvp-names',
        'next': '#rsvp-attending'
    },
    '#rsvp-attending': {
        'next': {
            'yes': '#rsvp-dietaryRequirements',
            'no': '#rsvp-excuses'
        },
        'previous': '#rsvp-email'
    },
    '#rsvp-dietaryRequirements': {
        'previous': '#rsvp-attending',
        'next': '#rsvp-songs'
    },
    '#rsvp-songs': {
        'previous': '#rsvp-dietaryRequirements',
        'next': '#rsvp-alcohol'
    },
    '#rsvp-alcohol': {
        'previous': '#rsvp-songs',
        'next': '#rsvp-messages'
    },
    '#rsvp-messages': {
        'previous': '#rsvp-songs'
    },
    '#rsvp-excuses': {
        'previous': '#rsvp-attending'
    }
};

// TODO: Switch off Enter key as submit
var currentStepId = '#rsvp-names';

// Change formspree _next target
$('input[name=_next]').val(window.location.href.replace('/rsvp', '/thanks'));

////////////////////////////////////////////////////////////////////////////////
// Helper functions
////////////////////////////////////////////////////////////////////////////////

function gotoStep(newStepId) {
    $(currentStepId).addClass('visually-hidden');
    currentStepId = newStepId;
    if ('next' in formRoutes[currentStepId]) {
        $('.js-next').removeClass('visually-hidden');
        $('.js-submit').addClass('visually-hidden');
    } else {
        $('.js-next').addClass('visually-hidden');
        $('.js-submit').removeClass('visually-hidden');
    }
    if ('previous' in formRoutes[currentStepId]) {
        $('.js-previous').removeClass('visually-hidden');
    } else {
        $('.js-previous').addClass('visually-hidden');
    }
    $(currentStepId).removeClass('visually-hidden');
}

function namesAreValid() {
    var isValid = true;
    $('#rsvp-names input').each(function() {
        if ($(this).val() == "") {
            isValid = false;
        }
    });
    if (!isValid) {
        displayErrorMessage("Please fill in all name fields (delete any if you added too many!)");
    }
    return isValid;
}

function emailIsValid() {
    var isValid = $('#rsvp-email input').val() != "";

    if (!isValid) {
        displayErrorMessage("Please fill in the email field");
    }
    return isValid;
}

function displayErrorMessage(message) {
    var messageId = Date.now();
    var markup = '<div class="alert alert-danger fade" id="' + messageId + '" role="alert">' +
        '<span class="fa fa-exclamation-circle" aria-hidden="true"></span> ' + message +
        '</div>';
    $('.js-alerts').append(markup);
    $('.js-alerts').find('#' + messageId).addClass('show active');
    setTimeout(function() {
        $('.js-alerts').find('#' + messageId).removeClass('show active');
    }, 3000);
    setTimeout(function() {
        $('.js-alerts').find('#' + messageId).remove();
    }, 3500);
}

function refreshPersonalFormSteps() {
    // Clear the personal form steps
    $('#rsvp-dietaryRequirements div').remove();
    $('#rsvp-songs div').remove();
    $('#rsvp-alcohol .checkbox').remove();

    // Add fields for all confirmed people to the personal form steps
    $('#rsvp-names input').each(function() {
        var name = $(this).val();
        var markup = '<div class="mb-3">' +
            '<label for="dietaryRequirements[' + name + ']">' + name + '</label>' +
            '<input type="text" class="form-control" id="dietaryRequirements[' + name + ']" name="dietaryRequirements[' + name + ']">' +
            '</div>';
        $('#rsvp-dietaryRequirements').append(markup);
        var markup = '<div class="mb-3">' +
            '<label for="songs[' + name + ']">' + name + '</label>' +
            '<input type="text" class="form-control" id="songs[' + name + ']" name="songs[' + name + ']" placeholder="Artist / Title">' +
            '</div>';
        $('#rsvp-songs').append(markup);
        var markup = '<div class="checkbox">' +
            '<label>' +
            '<input type="checkbox" name="alcohol[' + name + ']" value="yes" checked> ' + name +
            '</label>' +
            '</div>';
        $('#rsvp-alcohol').append(markup);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Event hookups
////////////////////////////////////////////////////////////////////////////////

// Hook up the next button to go to the next step in the form
$('.js-next').on('click', function() {
    if (currentStepId === '#rsvp-attending') {
        var attending = $(currentStepId + ' input[name=attending]:checked').val();
        var newStepId = formRoutes['#rsvp-attending']['next'][attending];
    } else {
        var newStepId = formRoutes[currentStepId]['next'];
    }

    // Validate the names
    if (currentStepId === '#rsvp-names') {
        if (!namesAreValid()) {
            return;
        }

        refreshPersonalFormSteps();
    }

    // Validate the email
    if (currentStepId === '#rsvp-email') {
        if (!emailIsValid()) {
            return;
        }
    }

    gotoStep(newStepId);
});

// Hook up the previous button to go to the previous step in the form
$('.js-previous').on('click', function() {
    var newStepId = formRoutes[currentStepId]['previous'];
    gotoStep(newStepId);
});

// Hook up the add person button
$('.js-addPerson').on('click', function() {
    var markup = '<div class="input-group mb-3">' +
        '<input type="text" class="form-control" name="person[]" placeholder="Another name here">' +
        '<button type="button" class="btn btn-outline-secondary js-removePerson"><i class="fa fa-trash"></i></button>' +
        '</div>';
    $('#rsvp-names-list').append(markup);
});

// Hook up the delete button on the name form elements
$('#rsvp-names').on('click', '.js-removePerson', function() {
    $(this).closest('div').remove();
});

// Prevent submissions by using the enter key
$('body').on('keydown', 'input', function(event) {
    var x = event.which;
    if (x === 13) {
        event.preventDefault();
        console.log("https://www.youtube.com/watch?v=cQ_b4_lw0Gg");
    }
});