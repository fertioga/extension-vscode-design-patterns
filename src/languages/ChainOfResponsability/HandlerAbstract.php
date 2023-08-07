<?php 

namespace ;

use \Interfaces\HandlerContract;

abstract class HandlerAbstract implements HandlerContract
{
    protected ?HandlerContract $next ;

    public function __construct(?HandlerContract $next)
    {
        $this->next = $next;
    }

    abstract public function handler($request);

}