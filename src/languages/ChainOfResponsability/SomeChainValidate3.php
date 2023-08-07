<?php 

namespace ;

class SomeChainValidate3 extends HandlerAbstract 
{
    public function handler($request) {
        
        /**
         * Put your code here 
         * If you want to break the chain,
         * just do a return
         */
         echo "Validate 3" . PHP_EOL;

        if($this->next)
            return $this->next->handler($request);
    }
}