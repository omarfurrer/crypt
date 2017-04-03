<?php

namespace App\Criteria;

use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class LessThanSecurityClearanceCriteriaCriteria
 * @package namespace App\Criteria;
 */
class EqualsUserIDCriteria implements CriteriaInterface {

    protected $user_id;

    public function __construct($user_id)
    {
        $this->user_id = $user_id;
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
        return $model->where('user_id', '=', $this->user_id);
    }

}
