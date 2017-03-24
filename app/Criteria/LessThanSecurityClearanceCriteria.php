<?php

namespace App\Criteria;

use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class LessThanSecurityClearanceCriteriaCriteria
 * @package namespace App\Criteria;
 */
class LessThanSecurityClearanceCriteria implements CriteriaInterface {

    protected $securityClearance;

    public function __construct($securityClearance)
    {
        $this->security_clearance = $securityClearance;
    }

    /**
     * Apply criteria in query repository
     *
     * @param                     $model
     * @param RepositoryInterface $repository
     *
     * @return mixed
     */
    public function apply($model, RepositoryInterface $repository)
    {
        return $model->where('security_clearance', '<=',
                             $this->security_clearance);
    }

}
