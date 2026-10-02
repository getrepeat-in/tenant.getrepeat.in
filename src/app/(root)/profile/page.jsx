import Profile from "@/components/pages/profile";
import ProtectedRoute from "@/components/global/protected-route";

export default function Page() {
    return (
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    );
}
