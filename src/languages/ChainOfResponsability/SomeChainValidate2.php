<?php 

namespace ;

class SomeChainValidate2 extends HandlerAbstract 
{
    public function handler($request) {
        
        /**
         * Put your code here 
         * If you want to break the chain,
         * just do a return
         */
         echo "Validate 2" . PHP_EOL;
        
        if($this->next)
            return $this->next->handler($request);
    }
}