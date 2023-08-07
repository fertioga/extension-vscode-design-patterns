<?php 

require ''; // <-- verify autoload path

use \SomeChainValidate1;
use \SomeChainValidate2;
use \SomeChainValidate3;

$request = [];

$test = new SomeChainValidate1( // <-- first step to validation
            new SomeChainValidate2( // <-- secound step to validation
               new SomeChainValidate3(null) // <-- last step to validation (pass null when the last one)
            )
        );
$test->handler($request);
