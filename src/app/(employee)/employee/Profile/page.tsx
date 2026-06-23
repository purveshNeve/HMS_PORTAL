
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { EmployeeProfile, ProfileCompletionData } from "@/types/profile";
import { calculateProfileCompletion } from "@/lib/profileUtils";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileCompletionBar from "@/components/profile/ProfileCompletionBar";
import PersonalInfoSection from "@/components/profile/PersonalInfoSection";
import EmploymentInfoSection from "@/components/profile/EmploymentInfoSection";
import EmergencyContactSection from "@/components/profile/EmergencyContactSection";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState<ProfileCompletionData | null>(
    null
  );

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setProfile(data);
      setCompletion(calculateProfileCompletion(data));
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updates: Partial<EmployeeProfile>) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();
      setProfile(data.data);
      setCompletion(calculateProfileCompletion(data.data));
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-50 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header with Photo and Name */}
      <ProfileHeader profile={profile} onProfileUpdate={handleProfileUpdate} />

      {/* Profile Completion Progress Bar */}
      {completion && <ProfileCompletionBar completion={completion} />}

      {/* Profile Sections */}
      <div className="grid grid-cols-1 gap-6">
        <PersonalInfoSection
          profile={profile}
          onUpdate={handleProfileUpdate}
        />
        <EmploymentInfoSection
          profile={profile}
          onUpdate={handleProfileUpdate}
        />
        <EmergencyContactSection
          profile={profile}
          onUpdate={handleProfileUpdate}
        />
      </div>
    </div>
  );
}
