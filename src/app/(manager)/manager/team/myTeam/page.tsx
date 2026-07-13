import MyTeamDetails from "@/components/MyTeamDetails/fetchDetails";
import { UpcomingMeetings } from "@/components/managerDashboard/UpcomingMeetings";
export default function myTeam() {
    return (
        <>
            <div>
                <MyTeamDetails />
            </div>
            <div>
                <UpcomingMeetings>
                    
                </UpcomingMeetings>
            </div>
        </>
    )
}