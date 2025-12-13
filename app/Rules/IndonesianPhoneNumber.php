<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class IndonesianPhoneNumber implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Regex untuk nomor telepon Indonesia:
        // Dimulai dengan +62 atau 0
        // Diikuti oleh 8
        // Lalu angka 1-9 (untuk operator seluler)
        // Diikuti oleh 6 sampai 9 digit angka lainnya (total 7-10 digit setelah 0/62)
        if (!preg_match('/^(\+62|0)8[1-9][0-9]{6,9}$/', $value)) {
            $fail('Format nomor telepon tidak valid. Gunakan format +628... atau 08...');
        }
    }
}
