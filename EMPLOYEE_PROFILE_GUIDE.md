# Employee Profile Page - Complete Implementation Guide

## Overview
A production-quality Employee Profile Page for HRMS application with profile completion tracking, image uploads, and full CRUD operations.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── profile/
│   │       ├── route.ts (GET/PUT)
│   │       └── upload-image/
│   │           └── route.ts (POST)
│   └── (employee)/
│       └── employee/
│           └── Profile/
│               └── page.tsx
├── components/
│   └── profile/
│       ├── ProfileHeader.tsx (Photo + Basic Info)
│       ├── ProfileCompletionBar.tsx (Progress Tracking)
│       ├── PersonalInfoSection.tsx (Editable)
│       ├── EmploymentInfoSection.tsx (Editable)
│       └── EmergencyContactSection.tsx (Editable)
├── lib/
│   └── profileUtils.ts (Calculation Helpers)
├── models/
│   └── User.ts (Mongoose Schema - Enhanced)
└── types/
    └── profile.ts (TypeScript Interfaces)
```

## Database Schema

### User Model (Enhanced)
All fields are stored in MongoDB with proper data types:

**Authentication Fields:**
- `userId`: String (required, unique) - Employee ID
- `name`: String (required) - Full name
- `email`: String (required) - Email address
- `password`: String (required) - Hashed password
- `role`: String (enum: EMPLOYEE, MANAGER, ADMIN)

**Personal Information:**
- `phone`: String - Phone number
- `dateOfBirth`: Date - Date of birth
- `gender`: String (enum: Male, Female, Other)
- `maritalStatus`: String (enum: Single, Married, Divorced, Widowed)
- `address`: String - Address

**Employment Information:**
- `department`: String - Department name
- `designation`: String - Job title
- `joiningDate`: Date - Joining date
- `manager`: String - Manager name
- `employmentType`: String (enum: Full-time, Part-time, Contract, Intern)
- `workLocation`: String - Office location

**Emergency Contact:**
- `emergencyContactName`: String - Contact person name
- `emergencyContactRelationship`: String - Relationship
- `emergencyContactPhone`: String - Contact phone

**Profile Image:**
- `profileImage`: String - Image URL/path

**Timestamps:**
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

## Backend APIs

### GET /api/profile
**Description:** Fetch user's profile data
**Authentication:** Required (NextAuth)
**Response:**
```json
{
  "_id": "...",
  "userId": "EMP001",
  "name": "John Doe",
  "email": "john@company.com",
  ...all profile fields
}
```

### PUT /api/profile
**Description:** Update user's profile
**Authentication:** Required (NextAuth)
**Request Body:** Any profile fields to update (except userId, role, password)
**Response:**
```json
{
  "message": "Profile updated successfully",
  "data": {...updated profile}
}
```

### POST /api/profile/upload-image
**Description:** Upload and save profile image
**Authentication:** Required (NextAuth)
**Form Data:** 
- `file`: Image file (JPEG, PNG, WebP max 5MB)
**Response:**
```json
{
  "message": "Profile image uploaded successfully",
  "imageUrl": "/uploads/profiles/EMP001-timestamp.jpg",
  "data": {...updated profile}
}
```

## Frontend Components

### ProfileHeader
- Displays profile photo (with default avatar fallback)
- Shows employee name, ID, email
- Displays department and designation
- Upload button to change photo
- Image preview before saving
- File validation (type & size)

### ProfileCompletionBar
- Progress bar showing completion percentage
- Color-coded status (red < 40%, yellow 40-60%, blue 60-80%, green 80%+)
- Displays filled/total fields
- Shows list of missing fields
- Status text (Incomplete, Getting started, Good progress, Almost there, Complete)

### PersonalInfoSection
- Editable fields:
  - Phone Number
  - Date of Birth
  - Gender (select)
  - Marital Status (select)
  - Address (textarea)
- Read-only fields:
  - Employee ID
  - Full Name
  - Email
- Edit button toggles form mode
- Save/Cancel buttons with loading state

### EmploymentInfoSection
- Editable fields:
  - Department
  - Designation
  - Joining Date
  - Manager
  - Employment Type (select)
  - Work Location
- Edit/Save/Cancel functionality
- Same UI pattern as Personal Info

### EmergencyContactSection
- Editable fields:
  - Contact Name
  - Relationship (select with predefined options)
  - Phone Number
- Edit/Save/Cancel functionality
- Same UI pattern

## Features

### 1. Profile Completion Tracking
- Calculates completion based on 17 profile fields
- Dynamic percentage calculation
- Color-coded progress bar
- Shows missing fields to encourage completion
- Updates in real-time after saves

### 2. Image Upload
- Drag & drop and file select support
- Preview before upload
- Client-side validation (type & size)
- Server-side validation
- Local storage in `public/uploads/profiles/`
- Default avatar if no image (DiceBear API)

### 3. Edit Functionality
- Each section has independent Edit button
- Modal-style edit mode within same component
- Form validation on client-side
- Loading states during save
- Cancel reverts changes
- Toast notifications for feedback

### 4. Security
- NextAuth session required for all APIs
- User can only edit their own profile
- Password, userId, and role cannot be modified
- Image file validation (type & size)
- Database validation on save

### 5. UI/UX
- Modern card-based layout
- Responsive grid system (1 col mobile, 2 col tablet+)
- Dark mode support (Tailwind dark: classes)
- Loading spinners
- Toast notifications
- Professional typography and spacing
- Hover effects on interactive elements

## Setup Instructions

### 1. File System
```bash
# Create uploads directory
mkdir -p public/uploads/profiles

# Add to .gitignore
echo "public/uploads/" >> .gitignore
```

### 2. Database
The User model is already updated with all profile fields. Run migrations if needed.

### 3. Environment Variables
No new environment variables needed. Uses existing MongoDB connection and NextAuth setup.

### 4. Access Profile
1. Log in as employee
2. Navigate to Employee Portal
3. Click "Profile" in sidebar (if added)
4. View and edit profile information

## Usage Examples

### Fetch Profile
```typescript
const response = await fetch('/api/profile');
const profile = await response.json();
```

### Update Profile
```typescript
await fetch('/api/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+1-555-0123',
    department: 'Engineering'
  })
});
```

### Upload Image
```typescript
const formData = new FormData();
formData.append('file', imageFile);
const response = await fetch('/api/profile/upload-image', {
  method: 'POST',
  body: formData
});
```

## TypeScript Types

All types defined in `src/types/profile.ts`:
- `EmployeeProfile` - Full profile object
- `PersonalInfo` - Personal information subset
- `EmploymentInfo` - Employment information subset
- `EmergencyContactInfo` - Emergency contact subset
- `ProfileCompletionData` - Completion tracking data

## Production Deployment

### Image Storage Options

**Development (Current):**
- Local filesystem: `public/uploads/profiles/`
- Files served as static assets

**Production (Recommended):**
- **Cloudinary** (Recommended):
  ```typescript
  // Replace upload logic with Cloudinary
  const result = await cloudinary.uploader.upload(file);
  return result.secure_url;
  ```
- **AWS S3**:
  ```typescript
  // Use AWS SDK for upload
  const s3 = new AWS.S3();
  await s3.putObject(params).promise();
  ```
- **Google Cloud Storage**:
  Similar pattern with GCS SDK

### Migration Steps
1. Keep local uploads for backward compatibility during transition
2. New uploads go to cloud storage
3. Gradually migrate existing images
4. Update `profileImage` URLs in database

## Error Handling

All APIs include:
- Authentication checks
- Database error handling
- File validation
- User authorization checks
- Toast notifications for client feedback
- Console error logging
- Proper HTTP status codes

## Performance Optimizations

1. **Image Optimization**:
   - Max 5MB file size
   - Supported formats: JPEG, PNG, WebP
   - Next.js Image component with optimization

2. **Database**:
   - `.lean()` queries where possible
   - Indexed userId field
   - Timestamps for audit trail

3. **Frontend**:
   - Component-level loading states
   - Optimistic UI updates
   - Lazy loading of profile data

## Testing Checklist

- [ ] Register new employee
- [ ] Access profile page
- [ ] View profile completion percentage
- [ ] Upload profile picture
- [ ] Edit personal information
- [ ] Edit employment information
- [ ] Edit emergency contact
- [ ] Verify all fields update in database
- [ ] Test image validation (size, type)
- [ ] Verify profile completion updates dynamically
- [ ] Test offline behavior
- [ ] Verify security (can only edit own profile)

## Future Enhancements

1. **Document Upload**: Resume, certificates, etc.
2. **Activity Log**: Track profile edits
3. **Approvals**: Manager approval for certain fields
4. **Exports**: PDF profile download
5. **Integrations**: LinkedIn, external verification
6. **Notifications**: Profile completion reminders
7. **Bulk Operations**: Admin bulk profile updates
8. **Analytics**: Profile completion metrics

## Troubleshooting

**Images not uploading:**
- Check `public/uploads/profiles/` directory exists
- Verify file permissions
- Check console for error messages
- Validate file type and size

**Profile fields not updating:**
- Check NextAuth session is valid
- Verify database connection
- Check for validation errors
- Monitor API response

**Completion percentage not updating:**
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for errors
- Verify all fields are recognized

## Support Files

- Schema: `src/models/User.ts`
- Types: `src/types/profile.ts`
- Utilities: `src/lib/profileUtils.ts`
- Components: `src/components/profile/*`
- APIs: `src/app/api/profile/*`
- Page: `src/app/(employee)/employee/Profile/page.tsx`
