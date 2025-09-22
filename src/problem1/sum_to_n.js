"use strict";

/**
 * Sum integers from 1 to n (inclusive).
 * Assumes the mathematical series result is <= Number.MAX_SAFE_INTEGER.
 * For n <= 0, returns 0.
 */

// Implementation A: classic iterative for-loop accumulation.
var sum_to_n_a = function (n) {
  if (!Number.isInteger(n) || n <= 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// Implementation B: arithmetic series closed-form formula.
var sum_to_n_b = function (n) {
  if (!Number.isInteger(n) || n <= 0) return 0;
  return (n * (n + 1)) / 2;
};

// Implementation C: recursion, but for very large n, recursion depth may exceed the call stack limits
var sum_to_n_c = function (n) {
  if (!Number.isInteger(n) || n <= 0) return 0;
  if (n === 1) return 1;
  return n + sum_to_n_c(n - 1);
};

console.log(sum_to_n_a(15), sum_to_n_b(15), sum_to_n_c(15)); // 15 15 15
