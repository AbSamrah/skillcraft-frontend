import React from "react";
import useAuth from "../../hooks/useAuth";
import Card from "../../components/ui/Card";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">My Profile</h1>
      <Card>
        <div className="row">
          <div className="col-md-8">
            <h3>
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-muted">{user.email}</p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            {/* Add more profile information here in the future */}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
