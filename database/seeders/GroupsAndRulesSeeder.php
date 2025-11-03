<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\Rule;

class GroupsAndRulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Rules first
        $rules = [
            // User Management Rules
            ['name' => 'Create Users', 'resource' => 'users', 'action' => 'create', 'description' => 'Can create new users'],
            ['name' => 'Read Users', 'resource' => 'users', 'action' => 'read', 'description' => 'Can view users list'],
            ['name' => 'Update Users', 'resource' => 'users', 'action' => 'update', 'description' => 'Can edit user information'],
            ['name' => 'Delete Users', 'resource' => 'users', 'action' => 'delete', 'description' => 'Can delete users'],

            // Group Management Rules
            ['name' => 'Create Groups', 'resource' => 'groups', 'action' => 'create', 'description' => 'Can create new groups'],
            ['name' => 'Read Groups', 'resource' => 'groups', 'action' => 'read', 'description' => 'Can view groups list'],
            ['name' => 'Update Groups', 'resource' => 'groups', 'action' => 'update', 'description' => 'Can edit group information'],
            ['name' => 'Delete Groups', 'resource' => 'groups', 'action' => 'delete', 'description' => 'Can delete groups'],

            // Rule Management Rules
            ['name' => 'Create Rules', 'resource' => 'rules', 'action' => 'create', 'description' => 'Can create new rules'],
            ['name' => 'Read Rules', 'resource' => 'rules', 'action' => 'read', 'description' => 'Can view rules list'],
            ['name' => 'Update Rules', 'resource' => 'rules', 'action' => 'update', 'description' => 'Can edit rule information'],
            ['name' => 'Delete Rules', 'resource' => 'rules', 'action' => 'delete', 'description' => 'Can delete rules'],

            // Dashboard Rules
            ['name' => 'View Dashboard', 'resource' => 'dashboard', 'action' => 'read', 'description' => 'Can access dashboard'],
        ];

        $createdRules = [];
        foreach ($rules as $ruleData) {
            $rule = Rule::firstOrCreate(
                ['resource' => $ruleData['resource'], 'action' => $ruleData['action']],
                $ruleData
            );
            $createdRules[$ruleData['name']] = $rule->id;
        }

        // Create Groups
        $groups = [
            [
                'name' => 'Super Admin',
                'description' => 'Full access to all features',
                'is_active' => true,
                'rules' => array_values($createdRules), // All rules
            ],
            [
                'name' => 'Admin',
                'description' => 'Administrative access',
                'is_active' => true,
                'rules' => [
                    $createdRules['Read Users'],
                    $createdRules['Create Users'],
                    $createdRules['Update Users'],
                    $createdRules['Read Groups'],
                    $createdRules['Read Rules'],
                    $createdRules['View Dashboard'],
                ],
            ],
            [
                'name' => 'Manager',
                'description' => 'Can manage users',
                'is_active' => true,
                'rules' => [
                    $createdRules['Read Users'],
                    $createdRules['Create Users'],
                    $createdRules['Update Users'],
                    $createdRules['View Dashboard'],
                ],
            ],
            [
                'name' => 'User',
                'description' => 'Basic user access',
                'is_active' => true,
                'rules' => [
                    $createdRules['View Dashboard'],
                ],
            ],
        ];

        foreach ($groups as $groupData) {
            $ruleIds = $groupData['rules'];
            unset($groupData['rules']);

            $group = Group::firstOrCreate(
                ['name' => $groupData['name']],
                $groupData
            );

            // Sync rules
            $group->rules()->sync($ruleIds);
        }

        $this->command->info('Groups and Rules seeded successfully!');
    }
}
