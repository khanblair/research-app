/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bibliography from "../bibliography.js";
import type * as books from "../books.js";
import type * as chatSessions from "../chatSessions.js";
import type * as contact from "../contact.js";
import type * as dashboard from "../dashboard.js";
import type * as extractedTexts from "../extractedTexts.js";
import type * as feedback from "../feedback.js";
import type * as highlights from "../highlights.js";
import type * as lib_utils from "../lib/utils.js";
import type * as lib_validators from "../lib/validators.js";
import type * as notes from "../notes.js";
import type * as paraphrasedTexts from "../paraphrasedTexts.js";
import type * as search from "../search.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  bibliography: typeof bibliography;
  books: typeof books;
  chatSessions: typeof chatSessions;
  contact: typeof contact;
  dashboard: typeof dashboard;
  extractedTexts: typeof extractedTexts;
  feedback: typeof feedback;
  highlights: typeof highlights;
  "lib/utils": typeof lib_utils;
  "lib/validators": typeof lib_validators;
  notes: typeof notes;
  paraphrasedTexts: typeof paraphrasedTexts;
  search: typeof search;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
