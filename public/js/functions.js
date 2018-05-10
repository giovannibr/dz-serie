'use strict';

var currQuestion = 0;
var currQuestionID;
var animating = false;

function changeSection(currentElem, nextElement) {
	if (!animating) {
		animating = true;
		$(currentElem).addClass('showed');
		setTimeout(function () {
			$(currentElem).addClass('d-none');
			$(nextElement).removeClass('d-none');
			setTimeout(function () { $(nextElement).removeClass('waiting'); }, 10);
			setTimeout(function () { animating = false; }, 600);
		}, 600);

		return true;
	} else {
		return false;
	}
}

function validadeAnswer(buttonClicked) {
	currQuestionID = $(buttonClicked).closest('.js-quiz-question').attr('id');
	if ($('input[name="' + currQuestionID + '"]:checked').length === 0) {
		$('#error-alert').modal('show');
		return false;
	}

	return true;
}

$(function() {

	$('#quiz-start').on('click', function(e) {
		e.preventDefault();

		changeSection($('#welcome'), $('#question_0'));
	});

	$('.js-next').on('click', function(e) {
		e.preventDefault();

		if (validadeAnswer($(this))) {
			if (changeSection($('#' + currQuestionID), $('#' + currQuestionID).next())) {
				currQuestion++;
			}
		}
	});

	$('#form').on('submit', function(e) {
		e.preventDefault();

		if (validadeAnswer($('#quiz-submit'))) {
			if (!animating) {
				animating = true;
				$('#loading-alert').modal('show');
				$('#' + currQuestionID).addClass('showed');
				setTimeout(function () {
					$.post($('#form').attr('action'), $('#form').serialize()).done(function (data) {
						animating = false;
						$('#loading-alert').modal('hide');
						$('#' + currQuestionID).addClass('d-none');
						$('#result').html(data);
						$('#result').find('.card').addClass('show');
					});
				}, 600);
			}
		}
	});

	$(document).on('click', '.js-reload', function(e) {
		e.preventDefault();
		location.reload(true);
	});

});