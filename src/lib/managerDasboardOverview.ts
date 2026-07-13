export async function getManagerEmployees() {
    const res = await fetch("/api/managerDashboard/teamOverviewFetch", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch employees");
    }
    return res.json();
}