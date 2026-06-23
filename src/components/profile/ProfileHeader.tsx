"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { EmployeeProfile } from "@/types/profile";
import Image from "next/image";

interface ProfileHeaderProps {
  profile: EmployeeProfile;
  onProfileUpdate: (updates: Partial<EmployeeProfile>) => Promise<void>;
}

export default function ProfileHeader({
  profile,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP files are allowed");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      await onProfileUpdate({ profileImage: data.imageUrl });
      setPreview(null);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const defaultAvatar =
    "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.userId;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-6">
        {/* Profile Picture */}
        <div className="relative">
          <div className="h-32 w-32 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={preview || profile.profileImage || defaultAvatar}
              alt="Profile picture"
              width={128}
              height={128}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {profile.name}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            ID: {profile.userId}
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">{profile.email}</p>
          <div className="mt-3 flex gap-4">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Department
              </p>
              <p className="text-zinc-900 dark:text-zinc-50">
                {profile.department || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Designation
              </p>
              <p className="text-zinc-900 dark:text-zinc-50">
                {profile.designation || "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Status */}
        {uploading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Uploading...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
