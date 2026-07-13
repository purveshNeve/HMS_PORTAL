export async function getDashboardStats() {
    const res = await fetch("/api/managerDashboard/staticCardFetch", {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch dashboard stats");
    }
    return res.json();
}