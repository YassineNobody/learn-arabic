import { DashboardAdmin } from "../../components/Admin/DashboardAdmin";
import { InfosUserSimple } from "../../components/User/Infos/InfosUserSimple";
import { UserProgressDashboard } from "../../components/User/UserProgress/UserProgress";
import { useAuth } from "../../hooks/useAuth";
import { useProgression } from "../../hooks/useProgression";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { isClient, progression } = useProgression();
  return (
    <div className="flex-1 flex flex-col py-2">
      {user && (
        <div className="flex-1 flex flex-col py-3">
          <InfosUserSimple key={user.id} />
          {user.role === "ADMIN" && <DashboardAdmin key={user.id} />}
          {isClient && progression && (
            <UserProgressDashboard progression={progression} />
          )}
        </div>
      )}
    </div>
  );
};
