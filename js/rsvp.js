var formRoutes = {
    '#rsvp-names': {
        'next': '#rsvp-attending'
    },
    '#rsvp-attending': {
        'next': {
            'yes': '#rsvp-dietaryRequirements',
            'no': '#rsvp-excuses'
        },
        'previous': '#rsvp-names'
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
        'previous': '#rsvp-songs',
        'next': '#rsvp-complete'
    },
    '#rsvp-excuses': {
        'previous': '#rsvp-attending',
        'next': '#rsvp-yourLoss'
    },
    '#rsvp-yourLoss': {
        'previous': '#rsvp-excuses'
    },
    '#rsvp-complete': {
        'previous': '#rsvp-messages',
    }
};

// TODO: Switch off Enter key as submit
var currentStepId = '#rsvp-names';

// Change formspree _next target
$('input[name=_next]').val(window.location.href.replace('/rsvp', ''));

////////////////////////////////////////////////////////////////////////////////
// Helper functions
////////////////////////////////////////////////////////////////////////////////

function gotoStep(newStepId) {
    $(currentStepId).addClass('hidden');
    currentStepId = newStepId;
    if ('next' in formRoutes[currentStepId]) {
        $('.js-next').removeClass('hidden');
        $('.js-submit').addClass('hidden');
    } else {
        $('.js-next').addClass('hidden');
        $('.js-submit').removeClass('hidden');
    }
    if ('previous' in formRoutes[currentStepId]) {
        $('.js-previous').removeClass('hidden');
    } else {
        $('.js-previous').addClass('hidden');
    }
    $(currentStepId).removeClass('hidden');
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

function displayErrorMessage(message) {
    $('.js-rsvp-error-message').text(message);
    $('.js-rsvp-error').addClass('in');
    setTimeout(function() {
        $('.js-rsvp-error').removeClass('in');
    }, 3000);
}

function refreshPersonalFormSteps() {
    // Clear the personal form steps
    $('#rsvp-dietaryRequirements .form-group').remove();
    $('#rsvp-songs .form-group').remove();
    $('#rsvp-alcohol .checkbox').remove();

    // Add fields for all confirmed people to the personal form steps
    $('#rsvp-names input').each(function() {
        var name = $(this).val();
        var markup = '<div class="form-group">' +
            '<label for="dietaryRequirements[' + name + ']">' + name + '</label>' +
            '<input type="text" class="form-control" id="dietaryRequirements[' + name + ']" name="dietaryRequirements[' + name + ']"  placeholder="Dessicated coconut because it is icky">' +
        '</div>';
        $('#rsvp-dietaryRequirements').append(markup);
        var markup = '<div class="form-group">' +
            '<label for="songs[' + name + ']">' + name + '</label>' +
            '<input type="text" class="form-control" id="songs[' + name + ']" name="songs[' + name + ']" placeholder="R. Kelly - Bump and Grind">' +
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
    gotoStep(newStepId);
});

// Hook up the previous button to go to the previous step in the form
$('.js-previous').on('click', function() {
    var newStepId = formRoutes[currentStepId]['previous'];
    gotoStep(newStepId);
});

// Hook up the add person button
$('.js-addPerson').on('click', function() {
    var markup = '<div class="form-group">' +
        '<div class="input-group">' +
            '<input type="text" class="form-control" name="person[]" placeholder="Another name here">' +
            '<div class="input-group-addon js-removePerson">' +
                '<button type="button" class="btn btn-xs btn-no-style"><i class="glyphicon glyphicon-trash"></i></button>' +
            '</div>' +
        '</div>' +
    '</div>';
    $('#rsvp-names-list').append(markup);
});

// Hook up the delete button on the name form elements
$('#rsvp-names').on('click', '.js-removePerson', function() {
    $(this).closest('.form-group').remove();
});
