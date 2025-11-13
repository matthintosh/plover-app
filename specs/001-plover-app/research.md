# Research & Technology Decisions: Plover Application

**Created**: 2025-01-27  
**Phase**: 0 - Outline & Research

## Research Tasks

### 1. Supabase Integration with React Native/Expo

**Task**: Research best practices for integrating Supabase with React Native and Expo Router applications.

**Decision**: Use `@supabase/supabase-js` with React Native-compatible configuration.

**Rationale**:
- Supabase JS client is the official and recommended client for React Native
- Works seamlessly with Expo's managed workflow
- Provides authentication, database, storage, and real-time capabilities
- TypeScript support with generated types from database schema
- Row Level Security (RLS) policies for data access control

**Alternatives Considered**:
- Direct REST API calls: More manual work, no built-in auth handling, no real-time support
- GraphQL with Hasura: Additional complexity, Supabase provides sufficient functionality
- Firebase: More vendor lock-in, Supabase offers more flexibility with PostgreSQL

**Implementation Notes**:
- Use `@supabase/supabase-js` version 2.x (latest stable)
- Configure Supabase client in `src/lib/supabase/client.ts`
- Use environment variables for Supabase URL and anon key
- Enable RLS policies for all tables to ensure data security
- Use Supabase Auth for periodontist authentication (email/password)
- Use Supabase Auth magic links for patient invitations
- Leverage Supabase Storage for article thumbnails and odontogram images
- Use Supabase Realtime for live updates (optional, can be added later)

**References**:
- Supabase React Native documentation
- Expo environment variables best practices

---

### 2. E2E Testing with Detox

**Task**: Research Detox setup and configuration for Expo/React Native applications.

**Decision**: Use Detox for E2E testing with Expo's managed workflow compatibility.

**Rationale**:
- Detox is the industry standard for React Native E2E testing
- Supports both iOS and Android
- Works with Expo managed workflow (with some limitations)
- Provides reliable, fast E2E tests with native app simulation
- Good integration with Jest

**Alternatives Considered**:
- Maestro: Newer tool, less mature ecosystem
- Appium: More complex setup, slower execution
- Manual testing only: Not scalable, not automatable

**Implementation Notes**:
- Use Detox version 20.x (latest stable)
- Configure for Expo managed workflow (may require custom native builds for full Detox support)
- Alternative: Use Expo's built-in testing tools for web E2E (Playwright/Cypress) if Detox setup is complex
- For initial MVP, focus on unit and integration tests; add E2E tests in later iterations
- If Detox proves difficult with Expo managed workflow, consider:
  - Using Expo Development Build for E2E testing
  - Using web-based E2E tools (Playwright) for web version
  - Manual testing for critical user flows initially

**Version**: Detox 20.x (to be confirmed during setup)

**References**:
- Detox documentation for Expo
- Expo Development Build documentation

---

### 3. Offline Support Patterns

**Task**: Research patterns for offline support in React Native applications with Supabase.

**Decision**: Implement optimistic UI updates with local storage and background sync.

**Rationale**:
- Daily check-ins are critical and must work offline
- Supabase doesn't have built-in offline support like Firebase
- Need to implement custom offline-first pattern
- Use AsyncStorage or Expo SecureStore for local data persistence
- Queue operations when offline, sync when connection restored

**Alternatives Considered**:
- WatermelonDB: Full offline database, adds significant complexity
- PouchDB/CouchDB: Overkill for this use case
- No offline support: Poor user experience, violates requirements

**Implementation Notes**:
- Use `@react-native-async-storage/async-storage` for local storage
- Implement a sync queue for offline operations
- Use Supabase Realtime subscriptions to detect when connection is restored
- Store daily check-ins locally first, then sync to Supabase
- Show clear indicators when app is offline
- Implement conflict resolution strategy (last-write-wins for check-ins)

**Pattern**:
1. User submits check-in → Save to local storage immediately
2. Show success feedback to user
3. Attempt to sync to Supabase in background
4. If offline, queue sync operation
5. When connection restored, process sync queue
6. Handle conflicts appropriately

**References**:
- React Native offline patterns
- Supabase offline strategies

---

### 4. Healthcare Data Compliance (HIPAA)

**Task**: Research HIPAA compliance considerations for Supabase and healthcare applications.

**Decision**: Implement security best practices and document compliance considerations.

**Rationale**:
- HIPAA compliance is complex and requires legal review
- Supabase can be HIPAA-compliant with proper configuration
- Need to implement additional security measures
- May require Business Associate Agreement (BAA) with Supabase
- Encryption, access controls, and audit logging are critical

**Alternatives Considered**:
- Self-hosted database: More control but significant operational overhead
- HIPAA-compliant cloud providers: More expensive, may be overkill for MVP
- Ignore HIPAA: Not acceptable for healthcare data

**Implementation Notes**:
- **Encryption**: Ensure all data encrypted in transit (HTTPS) and at rest (Supabase default)
- **Access Control**: Implement Row Level Security (RLS) policies for all tables
- **Authentication**: Use Supabase Auth with strong password requirements
- **Audit Logging**: Log all data access and modifications (Supabase audit logs)
- **Data Minimization**: Only collect necessary data
- **Backup & Recovery**: Ensure Supabase backups are configured
- **BAA**: Consult legal team about Business Associate Agreement with Supabase
- **User Consent**: Implement clear privacy policies and user consent flows
- **Data Retention**: Implement data retention policies per requirements

**Important**: This is a complex legal/regulatory area. Consult with legal and compliance teams before production deployment.

**References**:
- Supabase security documentation
- HIPAA compliance guidelines
- Healthcare data protection best practices

---

### 5. State Management and Data Fetching

**Task**: Research state management and data fetching patterns for React Native with Supabase.

**Decision**: Use React Query (TanStack Query) for server state management with Supabase.

**Rationale**:
- React Query provides excellent caching, synchronization, and offline support
- Works seamlessly with Supabase client
- Handles loading states, error states, and refetching automatically
- Supports optimistic updates
- Reduces boilerplate code significantly

**Alternatives Considered**:
- Redux: More complex, overkill for this application
- Zustand: Good for client state, but React Query better for server state
- SWR: Similar to React Query, but React Query has better React Native support
- Manual state management: Too much boilerplate, error-prone

**Implementation Notes**:
- Use `@tanstack/react-query` version 5.x
- Wrap app with QueryClientProvider
- Create custom hooks that use React Query for data fetching
- Use React Query mutations for create/update/delete operations
- Configure cache times appropriately (shorter for frequently changing data)
- Use React Query's offline support features

**References**:
- TanStack Query React Native documentation
- Supabase + React Query patterns

---

### 6. Image Storage and Optimization

**Task**: Research image storage and optimization for article thumbnails and odontogram images.

**Decision**: Use Supabase Storage with Expo Image for optimized image loading.

**Rationale**:
- Supabase Storage provides secure, scalable file storage
- Expo Image provides optimized image loading and caching
- Supports WebP format for better compression
- Automatic image optimization and caching

**Alternatives Considered**:
- Cloudinary: Additional service, more features than needed
- AWS S3: More complex setup, Supabase Storage is simpler
- Base64 encoding in database: Poor performance, not scalable

**Implementation Notes**:
- Store images in Supabase Storage buckets
- Use Expo Image component for optimized loading
- Implement image compression before upload
- Use WebP format when supported
- Implement lazy loading for article thumbnails
- Cache images locally for offline access

**References**:
- Supabase Storage documentation
- Expo Image documentation

---

## Summary of Technology Decisions

| Technology | Decision | Version | Rationale |
|------------|----------|---------|-----------|
| Backend | Supabase | Latest | Complete backend solution (auth, DB, storage, real-time) |
| Database | Supabase PostgreSQL | Managed | Secure, scalable, RLS support |
| Authentication | Supabase Auth | Built-in | Email/password + magic links |
| File Storage | Supabase Storage | Built-in | Secure, scalable file storage |
| State Management | React Query (TanStack Query) | 5.x | Excellent caching and offline support |
| E2E Testing | Detox | 20.x | Industry standard (may use Expo alternatives if needed) |
| Local Storage | AsyncStorage | Latest | Simple, reliable offline storage |
| Image Loading | Expo Image | Built-in | Optimized image loading and caching |

## Resolved Clarifications

1. ✅ **Detox E2E Testing**: Use Detox 20.x, but may need Expo Development Build or alternative web-based E2E tools if setup is complex with managed workflow.

2. ✅ **Offline Support**: Implement optimistic UI with AsyncStorage and background sync queue pattern.

3. ✅ **State Management**: Use React Query (TanStack Query) for server state management.

4. ✅ **Image Storage**: Use Supabase Storage with Expo Image for optimization.

5. ✅ **HIPAA Compliance**: Implement security best practices, RLS policies, encryption, and consult legal team for BAA.

## Next Steps

All NEEDS CLARIFICATION items have been resolved. Proceeding to Phase 1: Design & Contracts.

