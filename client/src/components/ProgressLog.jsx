import React, { useEffect, useState } from "react";

function ProgressLog() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch('/logs')
            .then((r) => r.json())
            .then(setLogs);
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">My Progress Logs</h2>
            <ul>
                {logs.map((log, index) => (
                    <li key={index} className="mb-2 border-b pb-2">
                        <p><strong>Date:</strong> {log.date}</p>
                        <p><strong>Status:</strong> {log.status}</p>
                        <p><strong>Note:</strong> {log.note}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ProgressLog;