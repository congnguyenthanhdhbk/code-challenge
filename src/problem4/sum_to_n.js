// Implementation A: Mathematical Formula (Optimal)
// Time Complexity: O(1) - Constant time
// Space Complexity: O(1) - Constant space
// Uses Gauss's arithmetic series formula: n(n+1)/2
// Best for: Production code, performance-critical applications
function sum_to_n_a(n) {
    // Handle edge case and negative numbers
    if (n === 0) return 0;

    // For negative n, compute sum of negative sequence
    if (n < 0) {
        const absN = Math.abs(n);
        return -(absN * (absN + 1)) / 2;
    }

    // Standard arithmetic series formula
    return (n * (n + 1)) / 2;
}

// Implementation B: Functional Array Approach
// Time Complexity: O(n) - Must process n elements
// Space Complexity: O(n) - Creates array of n elements
// Uses modern JavaScript functional programming paradigms
// Best for: Functional programming style, readability, one-liners
function sum_to_n_b(n) {
    if (n === 0) return 0;

    if (n > 0) {
        // Create array [1, 2, 3, ..., n] and sum with reduce
        return Array.from({ length: n }, (_, i) => i + 1)
            .reduce((sum, num) => sum + num, 0);
    } else {
        // Create array [-1, -2, -3, ..., n] and sum with reduce
        const absN = Math.abs(n);
        return Array.from({ length: absN }, (_, i) => -(i + 1))
            .reduce((sum, num) => sum + num, 0);
    }
}

// Implementation C: Bitwise and Mathematical Optimization
// Time Complexity: O(log n) - Uses bit manipulation techniques
// Space Complexity: O(1) - Constant space
// Uses bitwise operations for performance optimization
// Best for: Systems programming, embedded systems, bit manipulation practice
function sum_to_n_c(n) {
    if (n === 0) return 0;

    const absN = Math.abs(n);
    let result;

    // Use bitwise operations to compute n*(n+1)/2 more efficiently
    // This avoids potential overflow in intermediate multiplication
    if ((absN & 1) === 0) {
        // n is even: (n/2) * (n+1)
        result = (absN >> 1) * (absN + 1);
    } else {
        // n is odd: n * ((n+1)/2)
        result = absN * ((absN + 1) >> 1);
    }

    return n < 0 ? -result : result;
}

// Performance Testing Function
function performanceTest() {
    const testValue = 10000;

    console.log("Performance Test Results for n =", testValue);
    console.log("=====================================");

    // Test Implementation A (Mathematical)
    const startA = performance.now();
    const resultA = sum_to_n_a(testValue);
    const endA = performance.now();
    console.log(`Implementation A (Mathematical): ${resultA}`);
    console.log(`Time: ${(endA - startA).toFixed(4)}ms`);

    // Test Implementation B (Functional)
    const startB = performance.now();
    const resultB = sum_to_n_b(testValue);
    const endB = performance.now();
    console.log(`Implementation B (Functional): ${resultB}`);
    console.log(`Time: ${(endB - startB).toFixed(4)}ms`);

    // Test Implementation C (Bitwise)
    const startC = performance.now();
    const resultC = sum_to_n_c(testValue);
    const endC = performance.now();
    console.log(`Implementation C (Bitwise): ${resultC}`);
    console.log(`Time: ${(endC - startC).toFixed(4)}ms`);

    console.log("\nAll results match:", resultA === resultB && resultB === resultC);
}

// Correctness Test Cases
console.log("Correctness Tests:");
console.log("==================");

const testCases = [0, 1, 5, -5, 100, -100];

testCases.forEach(testCase => {
    const a = sum_to_n_a(testCase);
    const b = sum_to_n_b(testCase);
    const c = sum_to_n_c(testCase);

    console.log(`n=${testCase}: A=${a}, B=${b}, C=${c}, Match=${a === b && b === c}`);
});

// Run performance test
console.log("\n");
performanceTest();
