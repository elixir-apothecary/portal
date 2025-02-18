import React, { useEffect, useRef, useState } from 'react';
import * as duckdb from '@duckdb/duckdb-wasm';

export default function DuckDBComponent() {
    const [queryResult, setQueryResult] = useState<string | null>(null);

    useEffect(() => {
        async function loadDuckDB() {
            const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
            const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
            const worker_url = URL.createObjectURL(
                new Blob([`importScripts("${bundle.mainWorker!}");`], { type: 'text/javascript' })
            );
            const worker = new Worker(worker_url);
            const logger = new duckdb.ConsoleLogger();
            const db = new duckdb.AsyncDuckDB(logger, worker);

            await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

            const connection = await db.connect();
            const result = await connection.query("SELECT 'Hello, DuckDB!' AS message");
            const rows = await result.toArray();
            setQueryResult(rows[0].message);
        }

        loadDuckDB();
    }, []);

    return (
        <div>
            {queryResult ? <p>{queryResult}</p> : <p>Loading...</p>}
        </div>
    );
}
