/**
 * Types Index - Export all types
 *
 * This file provides a centralized export for all types,
 * making it easy to import any type from a single location.
 *
 * Usage:
 * import { User, Event, Post } from '@/lib/types'
 */

export * from "./region"
export * from "./year-level"

export type { RegionOption } from "./region"
export type { YearLevelOption } from "./year-level"

/*
// User types
export * from "./user"

// Announcement table types
export * from "./announcement"

// Forum types
export * from "./forum"

// Event types
export * from "./event"

// Form types
export * from "./form"

// Form Question types
export * from "./form-question"

// Form Option types
export * from "./form-option"

// Form Response types
export * from "./form-response"

// Form Answer types
export * from "./form-answer"

export type { User, UserInsert, UserUpdate } from "./user"

export type {
  Announcement,
  AnnouncementInsert,
  AnnouncementUpdate,
  AnnouncementWithMetadata,
} from "./announcement"

export type { CreatePostData, ForumComment, ForumFilter, ForumPost, ForumTag } from "./forum"

export type { Event } from "./event"

export type { Form, FormInsert, FormUpdate } from "./form"

export type {
  FormQuestion,
  FormQuestionInsert,
  FormQuestionUpdate,
  FormQuestionWithOptions,
} from "./form-question"

export type { FormOption, FormOptionInsert, FormOptionUpdate } from "./form-option"

export type {
  FormResponse,
  FormResponseInsert,
  FormResponseUpdate,
  FormResponseWithUser,
} from "./form-response"

export type { FormAnswer, FormAnswerBatch, FormAnswerInsert, FormAnswerUpdate } from "./form-answer"

// Scale question constants
export const SCALE_MIN = 1
export const SCALE_MAX = 10
*/
