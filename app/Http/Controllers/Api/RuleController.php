<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule as ValidationRule;

class RuleController extends Controller
{
    /**
     * Display a listing of rules with search and pagination
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $query = Rule::query()->withCount('groups');

        // Search functionality
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('resource', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort by resource then action
        $query->orderBy('resource', 'asc')->orderBy('action', 'asc');

        // Paginate results
        $rules = $query->paginate($perPage);

        return response()->json($rules);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:rules,name',
            'resource' => 'required|string|max:255',
            'action' => 'required|string|max:255|in:create,read,update,delete,manage',
            'description' => 'nullable|string',
        ]);

        // Check unique combination of resource + action
        $exists = Rule::where('resource', $validated['resource'])
            ->where('action', $validated['action'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'A rule with this resource and action combination already exists',
            ], 422);
        }

        $rule = Rule::create($validated);

        return response()->json([
            'message' => 'Rule created successfully',
            'rule' => $rule,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Rule $rule): JsonResponse
    {
        $rule->load('groups');
        return response()->json($rule);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rule $rule): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                ValidationRule::unique('rules')->ignore($rule->id),
            ],
            'resource' => 'sometimes|required|string|max:255',
            'action' => 'sometimes|required|string|max:255|in:create,read,update,delete,manage',
            'description' => 'sometimes|nullable|string',
        ]);

        // Check unique combination if resource or action changed
        if (isset($validated['resource']) || isset($validated['action'])) {
            $resource = $validated['resource'] ?? $rule->resource;
            $action = $validated['action'] ?? $rule->action;

            $exists = Rule::where('resource', $resource)
                ->where('action', $action)
                ->where('id', '!=', $rule->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'A rule with this resource and action combination already exists',
                ], 422);
            }
        }

        $rule->update($validated);

        return response()->json([
            'message' => 'Rule updated successfully',
            'rule' => $rule,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rule $rule): JsonResponse
    {
        $rule->delete();

        return response()->json([
            'message' => 'Rule deleted successfully',
        ]);
    }
}
