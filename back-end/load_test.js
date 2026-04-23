// ============================================================
//  Load Test – Improved
// ============================================================

const TARGET_URL = 'https://api.voipelearning.shop/api/products/slug/samsung-s26-ultra';
const TOTAL_REQUESTS = 10000;
const CONCURRENCY = 10;   // max parallel requests at a time
const TIMEOUT_MS = 10_000; // per-request timeout
const RETRIES = 2;      // retry on network error (not 4xx/5xx)

// ── helpers ────────────────────────────────────────────────

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function percentile(sorted, p) {
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)];
}

function bar(ratio, width = 20) {
    const filled = Math.round(ratio * width);
    return '[' + '█'.repeat(filled) + '░'.repeat(width - filled) + ']';
}

// ── core request ───────────────────────────────────────────

async function sendRequest(id, attempt = 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const startTime = Date.now();

    try {
        const response = await fetch(TARGET_URL, { signal: controller.signal });
        const duration = Date.now() - startTime;
        clearTimeout(timer);
        return { id, success: true, status: response.status, duration, attempt };
    } catch (error) {
        clearTimeout(timer);
        const duration = Date.now() - startTime;
        const isTimeout = error.name === 'AbortError';
        const errorMsg = isTimeout ? 'TIMEOUT' : error.message;

        // retry on network / timeout errors only
        if (!isTimeout && attempt <= RETRIES) {
            await sleep(200 * attempt);
            return sendRequest(id, attempt + 1);
        }

        return { id, success: false, error: errorMsg, duration, attempt };
    }
}

// ── concurrency pool ──────────────────────────────────────

async function runPool(tasks, concurrency, onDone) {
    const results = [];
    let idx = 0;

    async function worker() {
        while (idx < tasks.length) {
            const current = idx++;
            const result = await tasks[current]();
            results[current] = result;
            onDone(result, current + 1);
        }
    }

    await Promise.all(Array.from({ length: concurrency }, worker));
    return results;
}

// ── progress bar ──────────────────────────────────────────

function makeProgressTracker(total) {
    let done = 0, successes = 0;
    return function update(result) {
        done++;
        if (result.success) successes++;
        const ratio = done / total;
        const pct = (ratio * 100).toFixed(1);
        const succeed = ((successes / done) * 100).toFixed(1);
        process.stdout.write(
            `\r  ${bar(ratio)} ${pct.padStart(5)}%  ` +
            `${String(done).padStart(String(total).length)}/${total}  ` +
            `✓ ${succeed}%`
        );
    };
}

// ── report ────────────────────────────────────────────────

function printReport(results, totalDuration) {
    const successes = results.filter(r => r.success);
    const failures = results.filter(r => !r.success);
    const durations = results.map(r => r.duration).sort((a, b) => a - b);
    const retried = results.filter(r => r.attempt > 1).length;

    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;

    // group status codes
    const statusMap = {};
    successes.forEach(r => { statusMap[r.status] = (statusMap[r.status] || 0) + 1; });

    // group error types
    const errorMap = {};
    failures.forEach(r => { errorMap[r.error] = (errorMap[r.error] || 0) + 1; });

    console.log('\n\n╔══════════════════════════════════════╗');
    console.log('║        LOAD TEST RESULTS              ║');
    console.log('╚══════════════════════════════════════╝');

    console.log('\n📊  Summary');
    console.log(`   Target URL    : ${TARGET_URL}`);
    console.log(`   Total Requests: ${TOTAL_REQUESTS}`);
    console.log(`   Concurrency   : ${CONCURRENCY}`);
    console.log(`   Timeout       : ${TIMEOUT_MS}ms`);
    console.log(`   Retries/req   : ${RETRIES}`);

    console.log('\n✅  Outcomes');
    console.log(`   Successes  : ${successes.length} (${((successes.length / TOTAL_REQUESTS) * 100).toFixed(1)}%)`);
    console.log(`   Failures   : ${failures.length}  (${((failures.length / TOTAL_REQUESTS) * 100).toFixed(1)}%)`);
    console.log(`   Retried    : ${retried}`);

    if (Object.keys(statusMap).length) {
        console.log('\n📋  HTTP Status Codes');
        Object.entries(statusMap)
            .sort(([a], [b]) => a - b)
            .forEach(([code, count]) => console.log(`   ${code} : ${count}`));
    }

    if (Object.keys(errorMap).length) {
        console.log('\n⚠️   Errors');
        Object.entries(errorMap)
            .sort(([, a], [, b]) => b - a)
            .forEach(([msg, count]) => console.log(`   ${String(count).padStart(4)}x  ${msg}`));
    }

    console.log('\n⏱️   Latency (ms)');
    console.log(`   Min   : ${durations[0]}`);
    console.log(`   p50   : ${percentile(durations, 50)}`);
    console.log(`   p90   : ${percentile(durations, 90)}`);
    console.log(`   p95   : ${percentile(durations, 95)}`);
    console.log(`   p99   : ${percentile(durations, 99)}`);
    console.log(`   Max   : ${durations[durations.length - 1]}`);
    console.log(`   Avg   : ${avg.toFixed(1)}`);

    const rps = (TOTAL_REQUESTS / (totalDuration / 1000)).toFixed(1);
    console.log('\n🚀  Throughput');
    console.log(`   Wall time : ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`   Req/sec   : ${rps}`);
    console.log('');
}

// ── main ──────────────────────────────────────────────────

async function runTest() {
    console.log(`\n🔥 Load Test Starting`);
    console.log(`   ${TOTAL_REQUESTS} requests  |  concurrency ${CONCURRENCY}  |  timeout ${TIMEOUT_MS}ms\n`);

    const progress = makeProgressTracker(TOTAL_REQUESTS);
    const tasks = Array.from({ length: TOTAL_REQUESTS }, (_, i) => () => sendRequest(i + 1));

    const startTime = Date.now();
    const results = await runPool(tasks, CONCURRENCY, progress);
    const totalDuration = Date.now() - startTime;

    printReport(results, totalDuration);
}

runTest().catch(err => {
    console.error('\nFatal error:', err);
    process.exit(1);
});