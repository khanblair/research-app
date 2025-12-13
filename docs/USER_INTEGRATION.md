# Clerk + Convex User Integration

## Overview

This integration syncs users from Clerk authentication to Convex database, enabling user-specific data storage and retrieval.

## Schema Changes

### New `users` Table

```typescript
users: {
  clerkId: string,
  email: string,
  username?: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string,
  createdAt: number,
  updatedAt: number,
}
```

**Indexes:**
- `by_clerk_id` - Primary lookup by Clerk user ID
- `by_email` - Lookup by email address
- `by_username` - Lookup by username

### Updated Tables with User Links

All major tables now include `userId: v.id("users")`:

1. **books** - Each book belongs to a user
   - Added `by_user` index
   - Updated `search_books` to filter by userId

2. **notes** - User-specific notes
   - Added `by_user` index
   - Updated search to filter by userId

3. **chatSessions** - User's AI chat sessions
   - Added `by_user` index

4. **highlights** - User's PDF highlights
   - Added `by_user` index

5. **citations** - User's bibliography
   - Added `by_user` index

6. **paraphrasedTexts** - User's paraphrased content
   - Added `by_user` index

## Convex Functions

### `convex/users.ts`

#### Mutations
- `syncUser` - Sync/create user from Clerk (called automatically)
- `updateProfile` - Update user profile information
- `deleteUser` - Delete user and all associated data (cascade delete)

#### Queries
- `getByClerkId` - Get user by Clerk ID
- `getByEmail` - Get user by email
- `getByUsername` - Get user by username
- `getById` - Get user by Convex ID

## React Hooks

### `useSyncUser()`
**Location:** `hooks/use-sync-user.ts`

Automatically syncs the current Clerk user with Convex. Should be called in the dashboard layout or a provider component.

```typescript
import { useSyncUser } from "@/hooks/use-sync-user";

function DashboardLayout() {
  useSyncUser(); // Syncs user on mount and updates
  // ...
}
```

### `useConvexUser()`
**Location:** `hooks/use-convex-user.ts`

Get the current Convex user object based on the logged-in Clerk user.

```typescript
import { useConvexUser } from "@/hooks/use-convex-user";

function MyComponent() {
  const { user, isLoading, clerkUser } = useConvexUser();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Welcome {user.firstName}!</div>;
}
```

## Usage Examples

### Creating a Book with User Link

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexUser } from "@/hooks/use-convex-user";

function BookUploader() {
  const { user } = useConvexUser();
  const createBook = useMutation(api.books.create);
  
  const handleUpload = async (bookData) => {
    if (!user) return;
    
    await createBook({
      userId: user._id,
      title: bookData.title,
      authors: bookData.authors,
      // ... other fields
    });
  };
}
```

### Querying User-Specific Books

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexUser } from "@/hooks/use-convex-user";

function MyBooks() {
  const { user } = useConvexUser();
  const books = useQuery(
    api.books.list,
    user ? { userId: user._id } : "skip"
  );
  
  return (
    <div>
      {books?.map(book => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
}
```

## Migration Notes

⚠️ **Important:** Existing data in the database will need to be updated with `userId` references.

If you have existing books/notes/etc., you'll need to either:
1. Clear the database and start fresh
2. Run a migration script to assign existing data to a user

For development, the simplest approach is to clear existing data:
```bash
# Use Convex dashboard to clear tables
# Or delete and recreate the deployment
```

## Data Privacy & Security

- Each user can only access their own data
- All queries should filter by `userId`
- User deletion cascades to all associated data
- Consider adding Convex functions with proper authentication checks

## Next Steps

1. ✅ Schema updated with users table
2. ✅ User sync hooks created
3. ✅ Dashboard layout syncs users
4. 🔄 Update all components to use `useConvexUser()` and filter by userId
5. 🔄 Add authentication checks in Convex functions
6. 🔄 Update BookUploader and other components to pass userId

## Security Recommendations

Consider adding authentication checks to Convex functions:

```typescript
import { getCurrentUser } from "./lib/auth";

export const createBook = mutation({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");
    
    // Verify the userId matches the authenticated user
    if (args.userId !== user._id) {
      throw new Error("Cannot create books for other users");
    }
    
    // ... rest of handler
  },
});
```
