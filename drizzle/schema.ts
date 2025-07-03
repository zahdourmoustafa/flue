import { pgTable, text, timestamp, foreignKey, unique, varchar, integer, boolean, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const difficulty = pgEnum("difficulty", ['beginner', 'intermediate', 'advanced'])
export const senderType = pgEnum("sender_type", ['user', 'ai'])
export const subscriptionStatus = pgEnum("subscription_status", ['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid'])


export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const sentenceUnits = pgTable("sentence_units", {
	id: text().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	difficulty: difficulty().notNull(),
	orderIndex: integer("order_index").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
});

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const conversations = pgTable("conversations", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	title: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "conversations_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const messages = pgTable("messages", {
	id: text().primaryKey().notNull(),
	conversationId: text("conversation_id").notNull(),
	senderType: senderType("sender_type").notNull(),
	originalMessage: text("original_message").notNull(),
	correctedMessage: text("corrected_message"),
	explanation: text(),
	audioUrl: text("audio_url"),
	hasErrors: boolean("has_errors").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.conversationId],
			foreignColumns: [conversations.id],
			name: "messages_conversation_id_conversations_id_fk"
		}).onDelete("cascade"),
]);

export const sentenceLessons = pgTable("sentence_lessons", {
	id: text().primaryKey().notNull(),
	unitId: text("unit_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	orderIndex: integer("order_index").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [sentenceUnits.id],
			name: "sentence_lessons_unit_id_sentence_units_id_fk"
		}).onDelete("cascade"),
]);

export const sentences = pgTable("sentences", {
	id: text().primaryKey().notNull(),
	lessonId: text("lesson_id").notNull(),
	text: text().notNull(),
	translation: text().notNull(),
	difficulty: integer().default(1),
	audioUrl: varchar("audio_url", { length: 255 }),
	orderIndex: integer("order_index").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [sentenceLessons.id],
			name: "sentences_lesson_id_sentence_lessons_id_fk"
		}).onDelete("cascade"),
]);

export const userSentenceProgress = pgTable("user_sentence_progress", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	unitId: text("unit_id").notNull(),
	lessonId: text("lesson_id").notNull(),
	sentenceId: text("sentence_id").notNull(),
	completed: boolean().default(false),
	pronunciationScore: integer("pronunciation_score"),
	attempts: integer().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_sentence_progress_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [sentenceUnits.id],
			name: "user_sentence_progress_unit_id_sentence_units_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [sentenceLessons.id],
			name: "user_sentence_progress_lesson_id_sentence_lessons_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.sentenceId],
			foreignColumns: [sentences.id],
			name: "user_sentence_progress_sentence_id_sentences_id_fk"
		}).onDelete("cascade"),
]);

export const callSessions = pgTable("call_sessions", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	duration: integer().notNull(),
	languageUsed: text("language_used").notNull(),
	correctionsMade: integer("corrections_made").default(0),
	topicsCovered: text("topics_covered").array(),
	aiFeedback: text("ai_feedback"),
	userSatisfaction: integer("user_satisfaction"),
	pronunciationScore: integer("pronunciation_score"),
	wordsSpoken: integer("words_spoken").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "call_sessions_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const userStats = pgTable("user_stats", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	currentLevel: integer("current_level").default(1).notNull(),
	nextLevel: integer("next_level").default(2).notNull(),
	minutesLeft: integer("minutes_left").default(0).notNull(),
	progressPercentage: integer("progress_percentage").default(0).notNull(),
	totalMinutes: integer("total_minutes").default(0).notNull(),
	achievements: integer().default(0).notNull(),
	streakDays: integer("streak_days").default(0).notNull(),
	lessonsCompleted: integer("lessons_completed").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_stats_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("user_stats_user_id_unique").on(table.userId),
]);

export const subscriptions = pgTable("subscriptions", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	stripeCustomerId: text("stripe_customer_id").notNull(),
	stripeSubscriptionId: text("stripe_subscription_id"),
	stripePriceId: text("stripe_price_id"),
	status: subscriptionStatus().default('incomplete').notNull(),
	currentPeriodStart: timestamp("current_period_start", { mode: 'string' }),
	currentPeriodEnd: timestamp("current_period_end", { mode: 'string' }),
	canceledAt: timestamp("canceled_at", { mode: 'string' }),
	cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
	trialStart: timestamp("trial_start", { mode: 'string' }),
	trialEnd: timestamp("trial_end", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "subscriptions_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("subscriptions_user_id_unique").on(table.userId),
	unique("subscriptions_stripe_customer_id_unique").on(table.stripeCustomerId),
	unique("subscriptions_stripe_subscription_id_unique").on(table.stripeSubscriptionId),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	preferredLanguage: text("preferred_language").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	learningLanguage: text("learning_language"),
	languageLevel: text("language_level"),
	translationLanguage: text("translation_language").notNull(),
	stripeCustomerId: text("stripe_customer_id"),
	stripeSubscriptionId: text("stripe_subscription_id"),
	stripePriceId: text("stripe_price_id"),
	stripeCurrentPeriodEnd: timestamp("stripe_current_period_end", { mode: 'string' }),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);
