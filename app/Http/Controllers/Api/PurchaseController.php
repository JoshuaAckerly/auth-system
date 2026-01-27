<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function list(Request $request)
    {
        $purchases = $request->user()->purchases ?? [];
        return response()->json($purchases);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'paypal_transaction_id' => 'nullable|string|max:255',
        ]);

        $purchase = $request->user()->purchases()->create([
            'item' => $validated['item'],
            'amount' => $validated['amount'],
            'paypal_transaction_id' => $validated['paypal_transaction_id'] ?? null,
        ]);

        return response()->json($purchase, 201);
    }
}
