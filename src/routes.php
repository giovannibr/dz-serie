<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Routes

$app->get('/', function (Request $request, Response $response, array $args) {

    $questions = require __DIR__ . '/resources/questions.php';

    return $this->renderer->render($response, 'index.phtml', [
    	'questions'			=> $questions,
    	'totalQuestions'	=> count($questions)
    ]);
});

$app->post('/result', function (Request $request, Response $response, array $args) {
    
    if (!$request->isXhr()) {
    	return $response->withStatus(403);
    }

    $count = [];
    $answers = $request->getParsedBody();
    $i = 0;
    foreach ($answers as $key => $answer) {
    	if (!array_key_exists($answer, $count)) {
    		$count[$answer] = 0;
    	}
    	$value = floatval('1.' . str_pad(pow(2, $i), 3, '0', STR_PAD_LEFT));
    	$count[$answer] += $value;
    	$i++;
    }

    arsort($count, SORT_NUMERIC);
    $answersKeys = array_keys($count);
    $result = array_shift($answersKeys);

    $series = require __DIR__ . '/resources/series.php';

    return $this->renderer->render($response, 'card.phtml', [
    	'key'	=> $result,
    	'serie' => $series[$result]
    ]);
});
