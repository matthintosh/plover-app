# Quickstart Guide: Plover Application

**Created**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Overview

This guide provides a quick introduction to the Plover application architecture and how to get started with development.

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Supabase account and project
- Git

## Project Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd plover-app
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from Supabase dashboard
3. Create a `.env.local` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Set Up Database Schema

1. Run the database migrations (see `database/migrations/` directory)
2. Enable Row Level Security (RLS) on all tables
3. Create RLS policies (see `database/policies/` directory)

### 4. Start Development Server

```bash
npm start
```

This will start the Expo development server. You can:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Press `w` to open web browser
- Scan QR code with Expo Go app on your phone

## Architecture Overview

### Feature-Based Structure

The application follows a feature-based architecture where each feature is self-contained:

```
src/features/[feature-name]/
├── repository/     # Data access layer (Supabase client)
├── service/        # Business logic
├── hooks/          # React hooks for components
├── components/     # Feature-specific UI components
└── pages/          # Expo Router pages (if needed)
```

### Key Concepts

#### 1. Repository Pattern

Repositories abstract Supabase operations:

```typescript
// src/features/daily-check-in/repository/check-in.repository.interface.ts
export interface CheckInRepository {
  getCheckInByDate(patientId: string, date: string): Promise<DailyCheckIn | null>;
  createCheckIn(data: CheckInInput): Promise<DailyCheckIn>;
  updateCheckIn(id: string, data: Partial<CheckInInput>): Promise<DailyCheckIn>;
}

// src/features/daily-check-in/repository/check-in.repository.ts
export class SupabaseCheckInRepository implements CheckInRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async getCheckInByDate(patientId: string, date: string) {
    // Supabase query implementation
  }
}
```

#### 2. Service Layer

Services contain business logic and use repositories:

```typescript
// src/features/daily-check-in/service/check-in.service.ts
export class CheckInService {
  constructor(private repository: CheckInRepository) {}
  
  async createOrUpdateCheckIn(data: CheckInInput): Promise<DailyCheckIn> {
    // Business logic: validate, check for existing check-in, etc.
    const existing = await this.repository.getCheckInByDate(
      data.patientId,
      data.date
    );
    
    if (existing) {
      return this.repository.updateCheckIn(existing.id, data);
    }
    
    return this.repository.createCheckIn(data);
  }
}
```

#### 3. Custom Hooks

Hooks expose services to React components:

```typescript
// src/features/daily-check-in/hooks/useCheckIn.ts
export function useCheckIn() {
  const repository = useCheckInRepository();
  const service = useMemo(() => new CheckInService(repository), [repository]);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['checkIn', patientId, date],
    queryFn: () => service.getCheckInByDate(patientId, date),
  });
  
  const createMutation = useMutation({
    mutationFn: (data: CheckInInput) => service.createOrUpdateCheckIn(data),
  });
  
  return {
    checkIn: data,
    isLoading,
    error,
    createCheckIn: createMutation.mutate,
  };
}
```

#### 4. Components

Components use hooks to access data and business logic:

```typescript
// src/features/daily-check-in/components/DailyCheckInForm.tsx
export function DailyCheckInForm() {
  const { checkIn, createCheckIn, isLoading } = useCheckIn();
  
  const handleSubmit = (data: CheckInInput) => {
    createCheckIn(data);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      {/* Form fields */}
    </Form>
  );
}
```

## Key Features

### Authentication

- **Periodontists**: Email/password authentication via Supabase Auth
- **Patients**: Magic link authentication (no password required)

### Data Flow

1. User interacts with component
2. Component calls hook
3. Hook uses service
4. Service uses repository
5. Repository queries Supabase
6. Data flows back through the layers

### Offline Support

Daily check-ins support offline mode:
- Data is saved to local storage (AsyncStorage) when offline
- Operations are queued for sync
- Automatic sync when connection is restored

## Development Workflow

### Adding a New Feature

1. Create feature directory: `src/features/[feature-name]/`
2. Create repository interface and implementation
3. Create service with business logic
4. Create hooks for React components
5. Create components
6. Add Expo Router pages if needed
7. Write tests (unit, integration, component)

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npx tsc --noEmit
```

## Common Tasks

### Adding a New Entity

1. Create database table in Supabase
2. Generate TypeScript types: `npx supabase gen types typescript`
3. Create repository interface and implementation
4. Create service
5. Create hooks
6. Create components

### Adding a New API Endpoint

Since we use Supabase, "endpoints" are typically:
1. Database queries (via repositories)
2. Supabase Edge Functions (for complex operations)
3. RLS policies (for access control)

### Debugging

- Use React Native Debugger for React DevTools
- Use Supabase dashboard for database queries
- Check Expo logs: `npx expo start --clear`

## Project Structure Reference

```
src/
├── app/                    # Expo Router pages
├── features/               # Feature modules
├── components/             # Shared components
├── constants/              # Constants (theme, etc.)
├── hooks/                  # Shared hooks
├── lib/                    # Utilities and configs
│   └── supabase/          # Supabase client setup
└── types/                  # Shared TypeScript types

tests/
├── unit/                   # Unit tests
├── integration/            # Integration tests
└── e2e/                    # E2E tests
```

## Next Steps

1. Read the [Data Model](./data-model.md) to understand entities
2. Review [API Contracts](./contracts/api-contracts.md) for service interfaces
3. Check [Research](./research.md) for technology decisions
4. Follow the [Implementation Plan](./plan.md) for development phases

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

## Getting Help

- Check existing issues in the repository
- Review the constitution for coding standards
- Consult the feature specification for requirements
- Ask questions in team channels

