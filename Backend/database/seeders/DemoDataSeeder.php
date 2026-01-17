<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');

        if (Schema::hasTable('company_profiles') && DB::table('company_profiles')->count() === 0) {
            DB::table('company_profiles')->insert([
                'description' => 'JA Bordir melayani bordir custom dengan fokus kualitas dan ketelitian.',
                'address' => 'Semarang, Jawa Tengah',
                'google_maps_link' => 'https://maps.google.com',
                'phone' => '081234567890',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if (Schema::hasTable('embroidery_types') && DB::table('embroidery_types')->count() === 0) {
            DB::table('embroidery_types')->insert([
                ['name' => 'Bordir Biasa', 'description' => 'Bordir standar', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Bordir 3D', 'description' => 'Efek timbul', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Bordir 5 Warna', 'description' => 'Kombinasi warna', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        if (Schema::hasTable('embroidery_sizes') && DB::table('embroidery_sizes')->count() === 0) {
            DB::table('embroidery_sizes')->insert([
                ['label' => '10-15 CM', 'size_cm' => 12.5, 'created_at' => now(), 'updated_at' => now()],
                ['label' => '20-24 CM', 'size_cm' => 22.0, 'created_at' => now(), 'updated_at' => now()],
                ['label' => '25-30 CM', 'size_cm' => 27.5, 'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        if (Schema::hasTable('products') && Product::count() === 0) {
            $products = [
                ['name' => 'Bordir Seragam', 'category' => 'Seragam', 'price' => 50000, 'stock' => 100],
                ['name' => 'Bordir Emblem', 'category' => 'Emblem', 'price' => 35000, 'stock' => 120],
                ['name' => 'Bordir Topi', 'category' => 'Topi', 'price' => 40000, 'stock' => 80],
                ['name' => 'Bordir Jaket', 'category' => 'Jaket', 'price' => 75000, 'stock' => 60],
                ['name' => 'Bordir Tas', 'category' => 'Tas', 'price' => 65000, 'stock' => 90],
            ];
            foreach ($products as $product) {
                Product::create($product + [
                    'description' => $faker->sentence(8),
                ]);
            }
        }

        $existingUserCount = User::where('role', 'user')->count();
        if ($existingUserCount < 10) {
            for ($i = 0; $i < 15; $i++) {
                User::create([
                    'name' => $faker->name,
                    'email' => $faker->unique()->safeEmail,
                    'password' => Hash::make('password'),
                    'role' => 'user',
                    'alamat' => $faker->address,
                    'no_telpon' => $faker->phoneNumber,
                ]);
            }
        }

        if (!Schema::hasTable('orders') || !Schema::hasTable('transactions')) {
            return;
        }

        $users = User::where('role', 'user')->get();
        $products = Product::all();
        if ($users->isEmpty() || $products->isEmpty()) {
            return;
        }

        $serviceTypes = ['seragam', 'topi', 'emblem', 'jaket', 'tas'];
        $embroideryTypes = ['3d', 'computer'];
        $shippingMethods = ['jnt', 'jne'];
        $orderStatuses = ['pending', 'processing', 'confirmed'];
        $paymentMethods = ['transfer', 'cash', 'ewallet'];

        $orderColumns = Schema::getColumnListing('orders');

        for ($i = 0; $i < 30; $i++) {
            $user = $users->random();
            $payload = [
                'user_id' => $user->id,
                'total_price' => 0,
                'status' => $faker->randomElement($orderStatuses),
            ];

            if (in_array('service_type', $orderColumns, true)) {
                $payload['service_type'] = $faker->randomElement($serviceTypes);
            }
            if (in_array('embroidery_type', $orderColumns, true)) {
                $payload['embroidery_type'] = $faker->randomElement($embroideryTypes);
            }
            if (in_array('size_cm', $orderColumns, true)) {
                $payload['size_cm'] = $faker->randomFloat(2, 10, 30);
            }
            if (in_array('quantity', $orderColumns, true)) {
                $payload['quantity'] = $faker->numberBetween(1, 20);
            }
            if (in_array('shipping_method', $orderColumns, true)) {
                $payload['shipping_method'] = $faker->randomElement($shippingMethods);
            }
            if (in_array('shipping_address', $orderColumns, true)) {
                $payload['shipping_address'] = $user->alamat ?? $faker->address;
            }
            if (in_array('order_type', $orderColumns, true)) {
                $payload['order_type'] = 'now';
            }
            if (in_array('notes', $orderColumns, true)) {
                $payload['notes'] = $faker->boolean(30) ? $faker->sentence(6) : null;
            }
            if (in_array('order_number', $orderColumns, true)) {
                $payload['order_number'] = Order::generateUniqueOrderNumber();
            }

            $order = Order::create($payload);

            $itemsCount = $faker->numberBetween(1, 3);
            $orderTotal = 0;
            for ($j = 0; $j < $itemsCount; $j++) {
                $product = $products->random();
                $qty = $faker->numberBetween(1, 5);
                $price = $product->price;
                $orderTotal += $qty * $price;
                if (Schema::hasTable('order_items')) {
                    DB::table('order_items')->insert([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $qty,
                        'price' => $price,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            $order->update(['total_price' => $orderTotal]);

            $status = $faker->randomElement(['pending', 'paid', 'failed']);
            $paidAt = $status === 'paid' ? now()->subDays($faker->numberBetween(0, 30)) : null;
            Transaction::create([
                'order_id' => $order->id,
                'payment_method' => $faker->randomElement($paymentMethods),
                'status' => $status,
                'paid_at' => $paidAt,
            ]);
        }
    }
}
