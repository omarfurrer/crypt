<?php

namespace App\Criteria;

use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class LessThanSecurityClearanceCriteriaCriteria
 * @package namespace App\Criteria;
 */
class EqualsFolderCriteria implements CriteriaInterface {

    protected $folder_id;

    public function __construct($folder_id)
    {
        $this->folder_id = $folder_id;
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
        return $model->where('folder_id', '=', $this->folder_id);
    }

}
