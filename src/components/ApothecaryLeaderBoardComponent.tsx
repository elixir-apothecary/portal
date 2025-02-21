import React, { useEffect, useRef, useState } from 'react';
import * as duckdb from '@duckdb/duckdb-wasm';
import { useVirtualizer } from '@tanstack/react-virtual';

type LeaderBoardItem = {
    date: string;
    name: string;
    chest?: boolean;
    total: number;
    total_points_earned_by_tvl: number;
    total_tvl_usd: number;
    total_direct_referrals?: number;
    total_indirect_referrals?: number;
    total_points_earned_by_referrals?: number;
    rank: number;
}

type DescribeResult = {
    column_name: string;
    column_type: string;
}

type Props = {
    i18n: {
        warning_sql_limit_message: string;
        introduction_duckdb: string;
    }
}

export default function ApothecaryLeaderBoardComponent({ i18n }: Props) {
    const sqlPlaceholder = `SELECT * FROM leaderboard WHERE name = 'your_apothecary_name'`;
    const [loading, setLoading] = useState<boolean>(true);
    const [describeResult, setDescribeResult] = useState<DescribeResult[]>([]);
    const [sqlQuery, setSqlQuery] = useState<string>(sqlPlaceholder);
    const [queryResult, setQueryResult] = useState<any[]>([]);
    const dbConnectionRef = useRef<duckdb.AsyncDuckDBConnection | null>(null);
    const [rowCount, setRowCount] = useState<number>(0);
    const parentRef = useRef<HTMLDivElement>(null);
    const [totalSum, setTotalSum] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);

    const MAX_LIMIT = 10000;
    const ROW_HEIGHT = 40;
    const MAX_TABLE_HEIGHT = 400;

    const virtualizer = useVirtualizer({
        count: queryResult.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 5,
    });

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
            await connection.query("CREATE TABLE leaderboard AS SELECT * FROM read_json_auto('https://raw.githubusercontent.com/elixir-apothecary/data/refs/heads/main/apothecary/leaderboard/leaderboard.json')");

            const describes = await connection.query("DESCRIBE leaderboard");
            const arr: DescribeResult[] = await describes.toArray();

            const result = await connection.query("SELECT SUM(total) as total_sum, COUNT(*) as total_users FROM leaderboard");
            const row = await result.toArray();
            setTotalSum(parseInt(row[0].total_sum));
            setTotalUsers(parseInt(row[0].total_users));

            dbConnectionRef.current = connection;
            setLoading(false);
            setDescribeResult(arr);
        }

        loadDuckDB();
    }, []);

    const executeQuery = async () => {
        if (!dbConnectionRef.current) return;

        setIsExecuting(true);
        try {
            // SQLクエリを正規化（大文字小文字の違いを無視）
            const normalizedQuery = sqlQuery.toLowerCase();
            let finalQuery = sqlQuery;

            // LIMITが含まれているかチェック
            if (!normalizedQuery.includes('limit')) {
                finalQuery = `${sqlQuery} LIMIT ${MAX_LIMIT}`;
            } else {
                // LIMIT句の値を抽出して検証
                const limitMatch = normalizedQuery.match(/limit\s+(\d+)/);
                if (limitMatch && parseInt(limitMatch[1]) > MAX_LIMIT) {
                    finalQuery = sqlQuery.replace(/limit\s+\d+/i, `LIMIT ${MAX_LIMIT}`);
                }
            }

            const result = await dbConnectionRef.current.query(finalQuery);
            const rows = await result.toArray();
            setQueryResult(rows);
            setRowCount(rows.length);
        } catch (error) {
            console.error('Query error:', error);
            setQueryResult([{ error: 'Query execution failed' }]);
            setRowCount(0);
        } finally {
            setIsExecuting(false);
        }
    };

    const renderTable = () => {
        if (queryResult.length === 0) return null;

        const columns = Object.keys(queryResult[0]);

        return (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="min-w-full">
                    <div className="bg-gray-50 dark:bg-gray-800 flex divide-x divide-gray-200 dark:divide-gray-700">
                        {columns.map((key) => (
                            <div key={key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex-1 min-w-[100px]">
                                {key}
                            </div>
                        ))}
                    </div>

                    <div
                        ref={parentRef}
                        className="divide-y divide-gray-200 dark:divide-gray-700"
                        style={{
                            height: `${Math.min(queryResult.length * ROW_HEIGHT, MAX_TABLE_HEIGHT)}px`,
                            overflow: 'auto',
                        }}
                    >
                        <div
                            style={{
                                height: `${virtualizer.getTotalSize()}px`,
                                width: '100%',
                                position: 'relative',
                            }}
                        >
                            {virtualizer.getVirtualItems().map((virtualRow) => (
                                <div
                                    key={virtualRow.key}
                                    data-index={virtualRow.index}
                                    className="flex divide-x divide-gray-200 dark:divide-gray-700 absolute top-0 left-0 w-full"
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {Object.values(queryResult[virtualRow.index]).map((value: any, j) => (
                                        <div key={j} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 flex-1 min-w-[100px] truncate">
                                            {typeof value === 'object' ? JSON.stringify(value) : value}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderQueryResult = () => {
        if (isExecuting) {
            return (
                <div className="text-center p-4 text-gray-600 dark:text-gray-400">
                    <p>Executing query...</p>
                </div>
            );
        }

        if (queryResult.length === 0) {
            return (
                <div className="text-center p-4 text-gray-600 dark:text-gray-400">
                    <p>No results found</p>
                </div>
            );
        }

        return renderTable();
    };

    return (
        <div className="space-y-4">
            {loading ? (
                <p className="text-lg">Loading DuckDB...</p>
            ) : (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-6">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Total Potions: <span className="font-mono">{totalSum.toLocaleString()}</span>
                        </p>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Total Users: <span className="font-mono">{totalUsers.toLocaleString()}</span>
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">table schema</p>
                        <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                            {describeResult.map((item, index) => (
                                <li key={index} className="text-sm">
                                    <span className="font-medium">{item.column_name}</span>:
                                    <span className="text-gray-500 dark:text-gray-400">{item.column_type}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{i18n.introduction_duckdb}</p>
                        <a
                            href="https://duckdb.org/docs/sql/statements/overview.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            DuckDB SQL Documentation
                        </a>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <textarea
                                value={sqlQuery}
                                onChange={(e) => setSqlQuery(e.target.value)}
                                className="w-full p-4 text-sm font-mono bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                                         rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
                                         transition-all duration-200 resize-y min-h-[120px]"
                                placeholder={sqlPlaceholder}
                                spellCheck="false"
                            />
                            <div className="mt-2 space-y-1">
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    {i18n.warning_sql_limit_message}
                                </p>
                                {rowCount > 0 && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        result count: {rowCount.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={executeQuery}
                            disabled={isExecuting}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium 
                                     rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 
                                     transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isExecuting ? (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            )}
                            {isExecuting ? 'Executing...' : 'Run'}
                        </button>
                    </div>

                    {renderQueryResult()}
                </div>
            )}
        </div>
    );
}
