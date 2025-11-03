<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class GroupController extends Controller
{
    /**
     * Display a listing of groups with search and pagination
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $query = Group::query()->withCount('users', 'rules');

        // Search functionality
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort by latest
        $query->orderBy('created_at', 'desc');

        // Paginate results
        $groups = $query->paginate($perPage);

        return response()->json($groups);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:groups,name',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
            'rule_ids' => 'sometimes|array',
            'rule_ids.*' => 'exists:rules,id',
        ]);

        $group = Group::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Attach rules if provided
        if (isset($validated['rule_ids'])) {
            $group->rules()->sync($validated['rule_ids']);
        }

        $group->load('rules');

        return response()->json([
            'message' => 'Group created successfully',
            'group' => $group,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group): JsonResponse
    {
        $group->load('rules', 'users');
        return response()->json($group);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Group $group): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('groups')->ignore($group->id),
            ],
            'description' => 'sometimes|nullable|string',
            'is_active' => 'sometimes|boolean',
            'rule_ids' => 'sometimes|array',
            'rule_ids.*' => 'exists:rules,id',
        ]);

        // Update group basic info
        $group->update(array_filter([
            'name' => $validated['name'] ?? $group->name,
            'description' => $validated['description'] ?? $group->description,
            'is_active' => $validated['is_active'] ?? $group->is_active,
        ]));

        // Sync rules if provided
        if (isset($validated['rule_ids'])) {
            $group->rules()->sync($validated['rule_ids']);
        }

        $group->load('rules');

        return response()->json([
            'message' => 'Group updated successfully',
            'group' => $group,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group): JsonResponse
    {
        // Check if group has users
        if ($group->users()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete group that has assigned users',
            ], 403);
        }

        $group->delete();

        return response()->json([
            'message' => 'Group deleted successfully',
        ]);
    }

    /**
     * Toggle group active status
     */
    public function toggleStatus(Group $group): JsonResponse
    {
        $group->is_active = !$group->is_active;
        $group->save();

        return response()->json([
            'message' => $group->is_active
                ? 'Group activated successfully'
                : 'Group deactivated successfully',
            'group' => $group,
        ]);
    }
}
