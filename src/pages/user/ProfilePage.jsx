import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  getProfileRoadmaps,
  removeRoadmapFromProfile,
} from "../../api/profile";
import { getAllRoadmaps } from "../../api/roadmaps";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const ProfilePage = () => {
  const { user } = useAuth();
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRoadmaps = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profileRoadmaps, allRoadmaps] = await Promise.all([
        getProfileRoadmaps(user.id),
        getAllRoadmaps(),
      ]);
      const roadmapDetails = profileRoadmaps.map((profileRoadmap) => {
        const detail = allRoadmaps.find((r) => r.id === profileRoadmap.id);
        return { ...detail, ...profileRoadmap };
      });
      setMyRoadmaps(roadmapDetails);
    } catch (error) {
      console.error("Failed to fetch profile roadmaps:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyRoadmaps();
  }, [fetchMyRoadmaps]);

  const handleRemoveRoadmap = async (roadmapId) => {
    if (window.confirm("Are you sure you want to remove this roadmap?")) {
      try {
        await removeRoadmapFromProfile(user.id, roadmapId);
        fetchMyRoadmaps(); // Refresh the list
      } catch (error) {
        console.error("Failed to remove roadmap:", error);
        alert("Could not remove roadmap.");
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading profile...</p>;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">My Profile</h1>
      <Card>
        <h3>
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-muted">{user.email}</p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </Card>

      <hr className="my-5" />

      <h2>My Roadmaps</h2>
      {myRoadmaps.length > 0 ? (
        <div className="row g-4">
          {myRoadmaps.map((roadmap) => (
            <div className="col-md-6 col-lg-4" key={roadmap.id}>
              <Card>
                <div className="card-body">
                  <h5 className="card-title">{roadmap.name}</h5>
                  {/* FIX: Removed the description paragraph */}
                  <Link
                    to={`/roadmaps/${roadmap.id}`}
                    className="btn btn-primary me-2">
                    View
                  </Link>
                  <Button
                    onClick={() => handleRemoveRoadmap(roadmap.id)}
                    variant="outline-danger">
                    Remove
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't added any roadmaps to your profile yet.</p>
      )}
    </div>
  );
};

export default ProfilePage;
