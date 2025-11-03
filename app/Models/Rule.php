<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Rule extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'resource',
        'action',
        'description',
    ];

    /**
     * Get the groups that have this rule.
     */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'group_rule')
            ->withTimestamps();
    }
}
