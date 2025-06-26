import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  preferredLanguage: text("preferred_language")
    .$defaultFn(() => "en")
    .notNull(),
  translationLanguage: text("translation_language")
    .$defaultFn(() => "en")
    .notNull(),
  learningLanguage: text("learning_language"),
  languageLevel: text("language_level"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  conversations: many(conversations),
}));

export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const conversationRelations = relations(
  conversations,
  ({ one, many }) => ({
    user: one(user, {
      fields: [conversations.userId],
      references: [user.id],
    }),
    messages: many(messages),
  })
);

export const senderTypeEnum = pgEnum("sender_type", ["user", "ai"]);

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderType: senderTypeEnum("sender_type").notNull(),
  originalMessage: text("original_message").notNull(),
  correctedMessage: text("corrected_message"),
  explanation: text("explanation"),
  audioUrl: text("audio_url"),
  hasErrors: boolean("has_errors").default(false),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const messageRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

// Sentence Mode Tables
export const difficultyEnum = pgEnum("difficulty", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const sentenceUnits = pgTable("sentence_units", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  difficulty: difficultyEnum("difficulty").notNull(),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const sentenceLessons = pgTable("sentence_lessons", {
  id: text("id").primaryKey(),
  unitId: text("unit_id")
    .notNull()
    .references(() => sentenceUnits.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const sentences = pgTable("sentences", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id")
    .notNull()
    .references(() => sentenceLessons.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  translation: text("translation").notNull(),
  difficulty: integer("difficulty").default(1),
  audioUrl: varchar("audio_url", { length: 255 }),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userSentenceProgress = pgTable("user_sentence_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  unitId: text("unit_id")
    .notNull()
    .references(() => sentenceUnits.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id")
    .notNull()
    .references(() => sentenceLessons.id, { onDelete: "cascade" }),
  sentenceId: text("sentence_id")
    .notNull()
    .references(() => sentences.id, { onDelete: "cascade" }),
  completed: boolean("completed").default(false),
  pronunciationScore: integer("pronunciation_score"),
  attempts: integer("attempts").default(0),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Relations for sentence mode
export const sentenceUnitsRelations = relations(sentenceUnits, ({ many }) => ({
  lessons: many(sentenceLessons),
  userProgress: many(userSentenceProgress),
}));

export const sentenceLessonsRelations = relations(
  sentenceLessons,
  ({ one, many }) => ({
    unit: one(sentenceUnits, {
      fields: [sentenceLessons.unitId],
      references: [sentenceUnits.id],
    }),
    sentences: many(sentences),
    userProgress: many(userSentenceProgress),
  })
);

export const sentencesRelations = relations(sentences, ({ one, many }) => ({
  lesson: one(sentenceLessons, {
    fields: [sentences.lessonId],
    references: [sentenceLessons.id],
  }),
  userProgress: many(userSentenceProgress),
}));

export const userSentenceProgressRelations = relations(
  userSentenceProgress,
  ({ one }) => ({
    user: one(user, {
      fields: [userSentenceProgress.userId],
      references: [user.id],
    }),
    unit: one(sentenceUnits, {
      fields: [userSentenceProgress.unitId],
      references: [sentenceUnits.id],
    }),
    lesson: one(sentenceLessons, {
      fields: [userSentenceProgress.lessonId],
      references: [sentenceLessons.id],
    }),
    sentence: one(sentences, {
      fields: [userSentenceProgress.sentenceId],
      references: [sentences.id],
    }),
  })
);
