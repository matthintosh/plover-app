# Data Model: Plover Application

**Created**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data model for the Plover application, including all entities, their attributes, relationships, validation rules, and state transitions. The model is designed for implementation in Supabase PostgreSQL with Row Level Security (RLS) policies.

## Entity Relationship Diagram

```
Periodontist (1) ──< (N) Patient
Patient (1) ──< (1) Diagnosis
Patient (1) ──< (N) RiskFactor
Patient (1) ──< (1) OnboardingResponse
Patient (1) ──< (N) DailyCheckIn
Patient (1) ──< (1) OralHygieneRecommendation
OralHygieneRecommendation (1) ──< (1) Odontogram
Article (N) ──< (N) Patient (many-to-many via views/access)
```

## Entities

### 1. Periodontist

**Purpose**: Represents a healthcare provider using the platform.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier
- `email` (String, Unique, Not Null): Email address for authentication
- `password_hash` (String, Not Null): Hashed password (managed by Supabase Auth)
- `professional_credentials` (String, Nullable): Professional license/credentials
- `full_name` (String, Not Null): Full name of periodontist
- `created_at` (Timestamp, Not Null): Account creation timestamp
- `updated_at` (Timestamp, Not Null): Last update timestamp
- `account_status` (Enum: 'active' | 'inactive' | 'suspended', Default: 'active'): Account status

**Relationships**:
- Has many `Patient` records

**Validation Rules**:
- Email must be valid email format
- Email must be unique across all periodontists
- Full name must be at least 2 characters
- Professional credentials optional but recommended

**State Transitions**:
- `active` → `inactive`: Periodontist can deactivate account
- `active` → `suspended`: Admin action (future feature)
- `inactive` → `active`: Periodontist can reactivate account

**RLS Policies**:
- Periodontists can only read/update their own record
- Periodontists can read all their associated patients

---

### 2. Patient

**Purpose**: Represents an end user receiving periodontal care.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier that references `auth.users(id)` - managed by Supabase Auth
- `periodontist_id` (UUID, Foreign Key → Periodontist, Not Null): Associated periodontist
- `email` (String, Unique, Not Null): Email address (used for Supabase Auth magic link)
- `onboarding_completed` (Boolean, Default: false): Whether onboarding questionnaire is completed
- `created_at` (Timestamp, Not Null): Account creation timestamp
- `updated_at` (Timestamp, Not Null): Last update timestamp
- `account_status` (Enum: 'pending' | 'active' | 'inactive', Default: 'pending'): Account status

**Relationships**:
- Belongs to one `Periodontist`
- References one `auth.users` record (via id)
- Has one `Diagnosis`
- Has many `RiskFactor` records
- Has one `OnboardingResponse`
- Has many `DailyCheckIn` records
- Has one `OralHygieneRecommendation`

**Validation Rules**:
- Email must be valid email format
- Email must be unique across all patients
- `id` must match the corresponding `auth.users.id` (created via Supabase Auth invite)
- Magic link functionality is handled entirely by Supabase Auth (no custom token storage needed)

**State Transitions**:
- `pending` → `active`: After patient completes onboarding
- `active` → `inactive`: Patient can deactivate or periodontist can deactivate
- `inactive` → `active`: Can be reactivated

**RLS Policies**:
- Patients can only read/update their own record
- Periodontists can read/update all their associated patients
- Patients can read their own related data (diagnosis, check-ins, etc.)

---

### 3. Diagnosis

**Purpose**: Represents a patient's periodontal condition.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier
- `patient_id` (UUID, Foreign Key → Patient, Unique, Not Null): Associated patient
- `type` (Enum: 'gingivitis' | 'periodontitis', Not Null): Diagnosis type
- `grade` (Integer, Nullable): Grade (1-4, required if type is 'periodontitis')
- `stage` (Integer, Nullable): Stage (1-4, required if type is 'periodontitis')
- `entered_by` (UUID, Foreign Key → Periodontist, Not Null): Periodontist who entered diagnosis
- `entered_at` (Timestamp, Not Null): When diagnosis was entered
- `updated_at` (Timestamp, Not Null): Last update timestamp

**Relationships**:
- Belongs to one `Patient`
- Belongs to one `Periodontist` (entered_by)

**Validation Rules**:
- If `type` is 'periodontitis', both `grade` and `stage` are required
- If `type` is 'gingivitis', `grade` and `stage` must be null
- `grade` must be between 1 and 4 if provided
- `stage` must be between 1 and 4 if provided

**State Transitions**:
- Diagnosis can be updated by periodontist
- History can be maintained (future: add diagnosis_history table)

**RLS Policies**:
- Patients can read their own diagnosis
- Periodontists can read/update diagnoses for their patients

---

### 4. RiskFactor

**Purpose**: Represents factors that may affect periodontal health.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier
- `patient_id` (UUID, Foreign Key → Patient, Not Null): Associated patient
- `type` (Enum: 'diabetes' | 'tobacco_use' | 'cardiovascular_disease' | 'cancer_hormonotherapy', Not Null): Risk factor type
- `details` (JSONB, Nullable): Additional details (e.g., tobacco use level: 'below_10' | 'above_10')
- `entered_by` (UUID, Foreign Key → Periodontist, Not Null): Periodontist who entered risk factor
- `entered_at` (Timestamp, Not Null): When risk factor was entered
- `updated_at` (Timestamp, Not Null): Last update timestamp

**Relationships**:
- Belongs to one `Patient`
- Belongs to one `Periodontist` (entered_by)

**Validation Rules**:
- `type` must be one of the defined enum values
- If `type` is 'tobacco_use', `details` must contain 'level' field with value 'below_10' or 'above_10'
- Patient can have multiple risk factors of different types
- Patient should not have duplicate risk factors of the same type (enforce at application level)

**State Transitions**:
- Risk factors can be added or removed by periodontist
- Risk factors can be updated (e.g., changing tobacco use level)

**RLS Policies**:
- Patients can read their own risk factors
- Periodontists can create/read/update/delete risk factors for their patients

---

### 5. OnboardingResponse

**Purpose**: Represents a patient's onboarding questionnaire answers.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier
- `patient_id` (UUID, Foreign Key → Patient, Unique, Not Null): Associated patient
- `age` (Integer, Not Null): Patient age
- `diet` (String, Not Null): Diet information (free text or structured)
- `sleep` (String, Not Null): Sleep information (free text or structured)
- `bruxism_clenching` (Boolean, Not Null): Whether patient has bruxism/clenching signs
- `completed_at` (Timestamp, Not Null): When questionnaire was completed

**Relationships**:
- Belongs to one `Patient`

**Validation Rules**:
- `age` must be a positive integer (reasonable range: 1-150)
- `diet` must not be empty
- `sleep` must not be empty
- All fields are required
- Patient can only have one onboarding response

**State Transitions**:
- Created once when patient completes onboarding
- Can be updated if needed (rare case)

**RLS Policies**:
- Patients can read/update their own onboarding response
- Periodontists can read onboarding responses for their patients

---

### 6. DailyCheckIn

**Purpose**: Represents a patient's daily symptom and habit log.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier
- `patient_id` (UUID, Foreign Key → Patient, Not Null): Associated patient
- `date` (Date, Not Null): Date of check-in (timezone-aware)
- `bleeding` (Integer, Nullable): Bleeding level (0-10 scale or similar)
- `pain` (Integer, Nullable): Pain level (0-10 scale)
- `mouth_feeling` (String, Nullable): Overall mouth feeling (free text or enum)
- `interdental_brush_used` (Boolean, Default: false): Whether interdental brush was used
- `floss_used` (Boolean, Default: false): Whether floss was used
- `created_at` (Timestamp, Not Null): When check-in was created
- `updated_at` (Timestamp, Not Null): Last update timestamp

**Relationships**:
- Belongs to one `Patient`

**Validation Rules**:
- `date` must be a valid date
- `bleeding` must be between 0 and 10 if provided
- `pain` must be between 0 and 10 if provided
- Only one check-in per patient per date (enforce unique constraint on patient_id + date)
- Check-in can be updated on the same day

**State Transitions**:
- Created when patient submits daily check-in
- Can be updated on the same day
- Cannot be deleted (maintain history)

**RLS Policies**:
- Patients can create/read/update their own check-ins
- Periodontists can read check-ins for their patients
- Check-ins cannot be deleted (soft delete if needed in future)

---

### 7. OralHygieneRecommendation

**Purpose**: Represents periodontist-prescribed oral hygiene materials.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier
- `patient_id` (UUID, Foreign Key → Patient, Unique, Not Null): Associated patient
- `toothbrush_type` (String, Nullable): Type of toothbrush recommended
- `toothbrush_brand` (String, Nullable): Brand of toothbrush
- `toothbrush_model` (String, Nullable): Model of toothbrush
- `entered_by` (UUID, Foreign Key → Periodontist, Not Null): Periodontist who entered recommendation
- `entered_at` (Timestamp, Not Null): When recommendation was entered
- `updated_at` (Timestamp, Not Null): Last update timestamp

**Relationships**:
- Belongs to one `Patient`
- Belongs to one `Periodontist` (entered_by)
- Has one `Odontogram`

**Validation Rules**:
- At least one field must be provided (toothbrush or odontogram data)
- Patient can only have one active recommendation set

**State Transitions**:
- Created when periodontist enters recommendations
- Can be updated by periodontist
- History can be maintained (future: add recommendation_history table)

**RLS Policies**:
- Patients can read their own recommendations
- Periodontists can create/read/update recommendations for their patients

---

### 8. Odontogram

**Purpose**: Represents a visual diagram of the mouth showing recommended tools per interdental space.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier
- `oral_hygiene_recommendation_id` (UUID, Foreign Key → OralHygieneRecommendation, Unique, Not Null): Associated recommendation
- `spaces` (JSONB, Not Null): Array of space recommendations
  - Each space object contains:
    - `space_id` (String): Identifier for the interdental space (e.g., "1-2", "2-3")
    - `tool_type` (Enum: 'interdental_brush' | 'floss'): Recommended tool
    - `brush_size` (String, Nullable): Interdental brush size if tool_type is 'interdental_brush'
- `created_at` (Timestamp, Not Null): When odontogram was created
- `updated_at` (Timestamp, Not Null): Last update timestamp

**Relationships**:
- Belongs to one `OralHygieneRecommendation`

**Validation Rules**:
- `spaces` must be a valid JSON array
- Each space must have valid `space_id` and `tool_type`
- If `tool_type` is 'interdental_brush', `brush_size` must be provided
- If `tool_type` is 'floss', `brush_size` must be null
- Space IDs should follow standard dental numbering (32 teeth = 31 interdental spaces)

**State Transitions**:
- Created when periodontist enters odontogram data
- Can be updated when recommendations change

**RLS Policies**:
- Patients can read odontogram for their recommendations
- Periodontists can create/read/update odontograms for their patients

---

### 9. Article

**Purpose**: Represents educational content available to patients.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier
- `title` (String, Not Null): Article title
- `content` (Text, Not Null): Article content (markdown or HTML)
- `thumbnail_url` (String, Nullable): URL to thumbnail image (stored in Supabase Storage)
- `category` (String, Nullable): Article category (e.g., "prevention", "treatment", "lifestyle")
- `published_at` (Timestamp, Nullable): Publication date
- `created_at` (Timestamp, Not Null): When article was created
- `updated_at` (Timestamp, Not Null): Last update timestamp
- `status` (Enum: 'draft' | 'published' | 'archived', Default: 'draft'): Article status

**Relationships**:
- Available to all patients (no direct relationship, accessed via queries)

**Validation Rules**:
- `title` must not be empty
- `content` must not be empty
- `thumbnail_url` must be valid URL if provided
- Only published articles are visible to patients

**State Transitions**:
- `draft` → `published`: Article is published
- `published` → `archived`: Article is archived
- `archived` → `published`: Article can be republished

**RLS Policies**:
- All authenticated patients can read published articles
- Periodontists can read all articles
- Only admins can create/update/delete articles (future: admin role)

---

## Database Schema Considerations

### Indexes

- `periodontist.email`: Unique index for fast lookups
- `patient.email`: Unique index for fast lookups
- `patient.periodontist_id`: Index for periodontist's patient queries
- `patient.magic_link_token`: Unique index for magic link lookups
- `daily_check_in.patient_id + date`: Unique composite index for one-per-day constraint
- `daily_check_in.date`: Index for date range queries (statistics)

### Constraints

- Unique constraint on `patient_id + date` for `daily_check_in` table
- Foreign key constraints on all relationship fields
- Check constraints for enum values and ranges (age, pain/bleeding scales)

### Triggers

- `updated_at` timestamp auto-update trigger on all tables
- Soft delete triggers (if implemented in future)

### Row Level Security (RLS)

All tables must have RLS enabled with policies that:
- Allow periodontists to access their own data and their patients' data
- Allow patients to access only their own data
- Prevent unauthorized access
- Enforce data isolation between different periodontists' patients

---

## Data Migration Strategy

1. Create tables in order of dependencies (Periodontist → Patient → related entities)
2. Enable RLS on all tables
3. Create indexes after table creation
4. Set up foreign key constraints
5. Create RLS policies
6. Seed initial data (articles, if any)

---

## Future Considerations

- **Audit Logging**: Add audit log table to track all data changes for compliance
- **Soft Deletes**: Implement soft delete pattern for data retention
- **Data Archival**: Strategy for archiving old check-in data
- **Diagnosis History**: Track diagnosis changes over time
- **Recommendation History**: Track recommendation changes
- **Patient Notes**: Allow periodontists to add private notes about patients

