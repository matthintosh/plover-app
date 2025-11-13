---
alwaysApply: true
---
  You are an expert in JavaScript, React Native, Expo, and Mobile UI development.
  
  Code Style and Structure:
  - Write Clean, Readable Code: Ensure your code is easy to read and understand. Use descriptive names for variables and functions.
  - Use Functional Components: Prefer functional components with hooks (useState, useEffect, etc.) over class components.
  - Component Modularity: Break down components into smaller, reusable pieces. Keep components focused on a single responsibility.
  - Organize Files by Feature: Group related components, hooks, and styles into feature-based directories (e.g., user-profile, chat-screen).

  Naming Conventions:
  - Variables and Functions: Use camelCase for variables and functions (e.g., isFetchingData, handleUserInput).
  - Components: Use PascalCase for component names (e.g., UserProfile, ChatScreen).
  - Directories: Use lowercase and hyphenated names for directories (e.g., user-profile, chat-screen).

  JavaScript Usage:
  - Avoid Global Variables: Minimize the use of global variables to prevent unintended side effects.
  - Use ES6+ Features: Leverage ES6+ features like arrow functions, destructuring, and template literals to write concise code.
  - PropTypes: Use PropTypes for type checking in components if you're not using TypeScript.

  Performance Optimization:
  - Optimize State Management: Avoid unnecessary state updates and use local state only when needed.
  - Memoization: Use React.memo() for functional components to prevent unnecessary re-renders.
  - FlatList Optimization: Optimize FlatList with props like removeClippedSubviews, maxToRenderPerBatch, and windowSize.
  - Avoid Anonymous Functions: Refrain from using anonymous functions in renderItem or event handlers to prevent re-renders.

  UI and Styling:
  - Consistent Styling: Use StyleSheet.create() for consistent styling or Styled Components for dynamic styles.
  - Responsive Design: Ensure your design adapts to various screen sizes and orientations. Consider using responsive units and libraries like react-native-responsive-screen.
  - Optimize Image Handling: Use optimized image libraries like react-native-fast-image to handle images efficiently.

  Best Practices:
  - Follow React Native's Threading Model: Be aware of how React Native handles threading to ensure smooth UI performance.
  - Use Expo Tools: Utilize Expo's EAS Build and Updates for continuous deployment and Over-The-Air (OTA) updates.
  - Expo Router: Use Expo Router for file-based routing in your React Native app. It provides native navigation, deep linking, and works across Android, iOS, and web. Refer to the official documentation for setup and usage: https://docs.expo.dev/router/introduction/

  Clean Architecture:
  - Layer Separation: Organize code into distinct layers: Presentation (UI components), Domain (business logic), and Data (repositories, API calls, storage).
  - Dependency Rule: Dependencies should point inward - Presentation depends on Domain, Domain does not depend on Presentation or Data. Use dependency inversion for data access.
  - Feature-Based Structure: Organize features with clear boundaries. Each feature should have its own directory containing: components/, hooks/, services/, types/, and utils/.
  - Use Cases / Services: Extract business logic into dedicated service files or use case functions. Keep components focused on rendering and user interaction.
  - Repository Pattern: Abstract data access through repository interfaces. Implementations should be swappable (e.g., API repository, local storage repository, mock repository).
  - Dependency Injection: Use dependency injection for services and repositories. Pass dependencies as props or use React Context for shared dependencies.
  - Type Safety: Define clear interfaces and types for data models, service contracts, and component props. Keep types close to where they're used or in a shared types directory.
  - Separation of Concerns: Keep components "dumb" - they should only handle UI logic. Business logic, data fetching, and state management should live in hooks, services, or custom hooks.
  - Testability: Structure code so that business logic can be tested independently of UI. Services and repositories should be easily mockable.

  
    