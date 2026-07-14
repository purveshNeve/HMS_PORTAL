export async function getPendingRequests() {
    const res = await fetch("/api/managerDashboard/pendingApprovals", {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch requests");
    }
    return res.json()
}