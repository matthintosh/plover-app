# API Contracts: Plover Application

**Created**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the API contracts for the Plover application. Since the application uses Supabase as the backend, most data operations are handled through Supabase's client SDK. This document defines the service layer interfaces and data contracts that abstract Supabase operations.

## Architecture Pattern

The application follows a repository pattern where:
- **Repositories** abstract Supabase client operations
- **Services** contain business logic and use repositories
- **Hooks** expose services to React components

All contracts are defined as TypeScript interfaces to ensure type safety.

---

## Authentication Contracts

### Periodontist Authentication

#### `authService.registerPeriodontist(data: RegisterPeriodontistInput): Promise<Periodontist>`

**Purpose**: Register a new periodontist account.

**Input**:
```typescript
interface RegisterPeriodontistInput {
  email: string;
  password: string;
  fullName: string;
  professionalCredentials?: string;
}
```

**Output**:
```typescript
interface Periodontist {
  id: string;
  email: string;
  fullName: string;
  professionalCredentials?: string;
  accountStatus: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}
```

**Errors**:
- `EMAIL_ALREADY_EXISTS`: Email is already registered
- `INVALID_EMAIL`: Email format is invalid
- `WEAK_PASSWORD`: Password doesn't meet requirements
- `NETWORK_ERROR`: Network request failed

---

#### `authService.loginPeriodontist(email: string, password: string): Promise<AuthSession>`

**Purpose**: Authenticate a periodontist and create a session.

**Input**: Email and password strings

**Output**:
```typescript
interface AuthSession {
  user: Periodontist;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}
```

**Errors**:
- `INVALID_CREDENTIALS`: Email or password is incorrect
- `ACCOUNT_INACTIVE`: Account is inactive or suspended
- `NETWORK_ERROR`: Network request failed

---

#### `authService.sendPatientInvitation(patientEmail: string): Promise<InvitationResult>`

**Purpose**: Send a magic link invitation to a patient.

**Input**: Patient email string

**Output**:
```typescript
interface InvitationResult {
  success: boolean;
  patientId: string;
  magicLinkToken: string;
  expiresAt: string;
}
```

**Errors**:
- `INVALID_EMAIL`: Email format is invalid
- `EMAIL_ALREADY_REGISTERED`: Patient email is already registered
- `NETWORK_ERROR`: Network request failed

---

#### `authService.validateMagicLink(token: string): Promise<PatientSession>`

**Purpose**: Validate a magic link token and create a patient session.

**Input**: Magic link token string

**Output**:
```typescript
interface PatientSession {
  patient: Patient;
  accessToken: string;
  expiresAt: string;
}
```

**Errors**:
- `INVALID_TOKEN`: Token is invalid or expired
- `TOKEN_EXPIRED`: Token has expired (48 hours)
- `NETWORK_ERROR`: Network request failed

---

## Patient Management Contracts

### `patientService.getPatientById(patientId: string): Promise<Patient>`

**Purpose**: Get patient details by ID.

**Input**: Patient ID (UUID)

**Output**:
```typescript
interface Patient {
  id: string;
  email: string;
  periodontistId: string;
  onboardingCompleted: boolean;
  accountStatus: 'pending' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
```

**Errors**:
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User doesn't have access to this patient
- `NETWORK_ERROR`: Network request failed

---

### `patientService.getPatientsByPeriodontist(): Promise<Patient[]>`

**Purpose**: Get all patients for the authenticated periodontist.

**Output**: Array of Patient objects

**Errors**:
- `UNAUTHORIZED`: User is not authenticated as periodontist
- `NETWORK_ERROR`: Network request failed

---

## Diagnosis Contracts

### `diagnosisService.getDiagnosisByPatientId(patientId: string): Promise<Diagnosis | null>`

**Purpose**: Get diagnosis for a patient.

**Input**: Patient ID (UUID)

**Output**:
```typescript
interface Diagnosis {
  id: string;
  patientId: string;
  type: 'gingivitis' | 'periodontitis';
  grade?: number; // 1-4, required if type is 'periodontitis'
  stage?: number; // 1-4, required if type is 'periodontitis'
  enteredBy: string; // Periodontist ID
  enteredAt: string;
  updatedAt: string;
}
```

**Errors**:
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User doesn't have access
- `NETWORK_ERROR`: Network request failed

---

### `diagnosisService.createOrUpdateDiagnosis(patientId: string, data: DiagnosisInput): Promise<Diagnosis>`

**Purpose**: Create or update a patient's diagnosis.

**Input**:
```typescript
interface DiagnosisInput {
  type: 'gingivitis' | 'periodontitis';
  grade?: number; // Required if type is 'periodontitis'
  stage?: number; // Required if type is 'periodontitis'
}
```

**Output**: Diagnosis object

**Errors**:
- `INVALID_DIAGNOSIS`: Missing required fields (grade/stage for periodontitis)
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User is not the patient's periodontist
- `NETWORK_ERROR`: Network request failed

---

## Risk Factor Contracts

### `riskFactorService.getRiskFactorsByPatientId(patientId: string): Promise<RiskFactor[]>`

**Purpose**: Get all risk factors for a patient.

**Input**: Patient ID (UUID)

**Output**:
```typescript
interface RiskFactor {
  id: string;
  patientId: string;
  type: 'diabetes' | 'tobacco_use' | 'cardiovascular_disease' | 'cancer_hormonotherapy';
  details?: {
    level?: 'below_10' | 'above_10'; // For tobacco_use
    [key: string]: unknown;
  };
  enteredBy: string; // Periodontist ID
  enteredAt: string;
  updatedAt: string;
}
```

**Errors**:
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User doesn't have access
- `NETWORK_ERROR`: Network request failed

---

### `riskFactorService.addRiskFactor(patientId: string, data: RiskFactorInput): Promise<RiskFactor>`

**Purpose**: Add a risk factor to a patient.

**Input**:
```typescript
interface RiskFactorInput {
  type: 'diabetes' | 'tobacco_use' | 'cardiovascular_disease' | 'cancer_hormonotherapy';
  details?: {
    level?: 'below_10' | 'above_10'; // Required for tobacco_use
    [key: string]: unknown;
  };
}
```

**Output**: RiskFactor object

**Errors**:
- `INVALID_RISK_FACTOR`: Missing required details (e.g., level for tobacco_use)
- `DUPLICATE_RISK_FACTOR`: Risk factor of this type already exists
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User is not the patient's periodontist
- `NETWORK_ERROR`: Network request failed

---

### `riskFactorService.removeRiskFactor(riskFactorId: string): Promise<void>`

**Purpose**: Remove a risk factor from a patient.

**Input**: Risk Factor ID (UUID)

**Errors**:
- `RISK_FACTOR_NOT_FOUND`: Risk factor doesn't exist
- `UNAUTHORIZED`: User is not authorized to remove this risk factor
- `NETWORK_ERROR`: Network request failed

---

## Onboarding Contracts

### `onboardingService.getOnboardingResponse(patientId: string): Promise<OnboardingResponse | null>`

**Purpose**: Get onboarding response for a patient.

**Input**: Patient ID (UUID)

**Output**:
```typescript
interface OnboardingResponse {
  id: string;
  patientId: string;
  age: number;
  diet: string;
  sleep: string;
  bruxismClenching: boolean;
  completedAt: string;
}
```

**Errors**:
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User doesn't have access
- `NETWORK_ERROR`: Network request failed

---

### `onboardingService.submitOnboardingResponse(data: OnboardingInput): Promise<OnboardingResponse>`

**Purpose**: Submit onboarding questionnaire response.

**Input**:
```typescript
interface OnboardingInput {
  age: number;
  diet: string;
  sleep: string;
  bruxismClenching: boolean;
}
```

**Output**: OnboardingResponse object

**Errors**:
- `INVALID_INPUT`: Missing required fields or invalid values
- `ALREADY_COMPLETED`: Onboarding already completed
- `UNAUTHORIZED`: User is not authenticated as patient
- `NETWORK_ERROR`: Network request failed

---

## Daily Check-in Contracts

### `checkInService.getCheckInByDate(patientId: string, date: string): Promise<DailyCheckIn | null>`

**Purpose**: Get check-in for a specific date.

**Input**: Patient ID (UUID) and date (ISO date string)

**Output**:
```typescript
interface DailyCheckIn {
  id: string;
  patientId: string;
  date: string; // ISO date string
  bleeding?: number; // 0-10
  pain?: number; // 0-10
  mouthFeeling?: string;
  interdentalBrushUsed: boolean;
  flossUsed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Errors**:
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User doesn't have access
- `NETWORK_ERROR`: Network request failed

---

### `checkInService.getCheckInsByDateRange(patientId: string, startDate: string, endDate: string): Promise<DailyCheckIn[]>`

**Purpose**: Get check-ins for a date range (for statistics).

**Input**: Patient ID (UUID), start date, end date (ISO date strings)

**Output**: Array of DailyCheckIn objects

**Errors**:
- `INVALID_DATE_RANGE`: Start date is after end date
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User doesn't have access
- `NETWORK_ERROR`: Network request failed

---

### `checkInService.createOrUpdateCheckIn(data: CheckInInput): Promise<DailyCheckIn>`

**Purpose**: Create or update a daily check-in.

**Input**:
```typescript
interface CheckInInput {
  date: string; // ISO date string (defaults to today)
  bleeding?: number; // 0-10
  pain?: number; // 0-10
  mouthFeeling?: string;
  interdentalBrushUsed?: boolean;
  flossUsed?: boolean;
}
```

**Output**: DailyCheckIn object

**Errors**:
- `INVALID_INPUT`: Invalid values (e.g., bleeding/pain out of range)
- `FUTURE_DATE`: Cannot create check-in for future date
- `UNAUTHORIZED`: User is not authenticated as patient
- `NETWORK_ERROR`: Network request failed
- `OFFLINE_QUEUED`: Request queued for sync when offline

---

## Statistics Contracts

### `statisticsService.getCheckInStatistics(patientId: string, startDate: string, endDate: string): Promise<CheckInStatistics>`

**Purpose**: Get aggregated statistics for check-ins in a date range.

**Input**: Patient ID (UUID), start date, end date (ISO date strings)

**Output**:
```typescript
interface CheckInStatistics {
  totalCheckIns: number;
  dateRange: {
    start: string;
    end: string;
  };
  averages: {
    bleeding?: number;
    pain?: number;
  };
  trends: {
    bleeding: TrendData[];
    pain: TrendData[];
    mouthFeeling: TrendData[];
    hygieneHabits: TrendData[];
  };
}

interface TrendData {
  date: string;
  value: number | string;
}
```

**Errors**:
- `INVALID_DATE_RANGE`: Start date is after end date
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User doesn't have access
- `NETWORK_ERROR`: Network request failed

---

## Oral Hygiene Recommendation Contracts

### `recommendationService.getRecommendationByPatientId(patientId: string): Promise<OralHygieneRecommendation | null>`

**Purpose**: Get oral hygiene recommendations for a patient.

**Input**: Patient ID (UUID)

**Output**:
```typescript
interface OralHygieneRecommendation {
  id: string;
  patientId: string;
  toothbrushType?: string;
  toothbrushBrand?: string;
  toothbrushModel?: string;
  odontogram?: Odontogram;
  enteredBy: string; // Periodontist ID
  enteredAt: string;
  updatedAt: string;
}

interface Odontogram {
  id: string;
  spaces: OdontogramSpace[];
}

interface OdontogramSpace {
  spaceId: string; // e.g., "1-2", "2-3"
  toolType: 'interdental_brush' | 'floss';
  brushSize?: string; // Required if toolType is 'interdental_brush'
}
```

**Errors**:
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User doesn't have access
- `NETWORK_ERROR`: Network request failed

---

### `recommendationService.createOrUpdateRecommendation(patientId: string, data: RecommendationInput): Promise<OralHygieneRecommendation>`

**Purpose**: Create or update oral hygiene recommendations.

**Input**:
```typescript
interface RecommendationInput {
  toothbrushType?: string;
  toothbrushBrand?: string;
  toothbrushModel?: string;
  odontogram?: {
    spaces: OdontogramSpace[];
  };
}
```

**Output**: OralHygieneRecommendation object

**Errors**:
- `INVALID_INPUT`: Invalid odontogram data
- `PATIENT_NOT_FOUND`: Patient doesn't exist
- `UNAUTHORIZED`: User is not the patient's periodontist
- `NETWORK_ERROR`: Network request failed

---

## Article Contracts

### `articleService.getPublishedArticles(limit?: number, offset?: number): Promise<Article[]>`

**Purpose**: Get published articles (paginated).

**Input**: Optional limit and offset for pagination

**Output**:
```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  thumbnailUrl?: string;
  category?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

**Errors**:
- `NETWORK_ERROR`: Network request failed

---

### `articleService.getArticleById(articleId: string): Promise<Article>`

**Purpose**: Get a specific article by ID.

**Input**: Article ID (UUID)

**Output**: Article object

**Errors**:
- `ARTICLE_NOT_FOUND`: Article doesn't exist or is not published
- `NETWORK_ERROR`: Network request failed

---

## Error Handling

All service methods return promises that reject with standardized error objects:

```typescript
interface ServiceError {
  code: string; // Error code (e.g., 'PATIENT_NOT_FOUND')
  message: string; // Human-readable error message
  details?: unknown; // Additional error details
}
```

Common error codes:
- `NETWORK_ERROR`: Network request failed
- `UNAUTHORIZED`: User is not authorized
- `NOT_FOUND`: Resource not found
- `INVALID_INPUT`: Invalid input data
- `VALIDATION_ERROR`: Data validation failed
- `OFFLINE_QUEUED`: Request queued for offline sync

---

## Offline Support

Services that support offline operations (e.g., `checkInService.createOrUpdateCheckIn`) will:
1. Attempt to save to Supabase
2. If offline, save to local storage (AsyncStorage)
3. Queue operation for sync when connection is restored
4. Return success immediately with `OFFLINE_QUEUED` status
5. Sync automatically when connection is restored

---

## Type Definitions

All TypeScript interfaces are defined in `src/types/` directory and exported for use across the application.

