import { relations } from "drizzle-orm/relations";
import { user, session, account, conversations, messages, sentenceUnits, sentenceLessons, sentences, userSentenceProgress, callSessions, userStats, subscriptions } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
	conversations: many(conversations),
	userSentenceProgresses: many(userSentenceProgress),
	callSessions: many(callSessions),
	userStats: many(userStats),
	subscriptions: many(subscriptions),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const conversationsRelations = relations(conversations, ({one, many}) => ({
	user: one(user, {
		fields: [conversations.userId],
		references: [user.id]
	}),
	messages: many(messages),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id]
	}),
}));

export const sentenceLessonsRelations = relations(sentenceLessons, ({one, many}) => ({
	sentenceUnit: one(sentenceUnits, {
		fields: [sentenceLessons.unitId],
		references: [sentenceUnits.id]
	}),
	sentences: many(sentences),
	userSentenceProgresses: many(userSentenceProgress),
}));

export const sentenceUnitsRelations = relations(sentenceUnits, ({many}) => ({
	sentenceLessons: many(sentenceLessons),
	userSentenceProgresses: many(userSentenceProgress),
}));

export const sentencesRelations = relations(sentences, ({one, many}) => ({
	sentenceLesson: one(sentenceLessons, {
		fields: [sentences.lessonId],
		references: [sentenceLessons.id]
	}),
	userSentenceProgresses: many(userSentenceProgress),
}));

export const userSentenceProgressRelations = relations(userSentenceProgress, ({one}) => ({
	user: one(user, {
		fields: [userSentenceProgress.userId],
		references: [user.id]
	}),
	sentenceUnit: one(sentenceUnits, {
		fields: [userSentenceProgress.unitId],
		references: [sentenceUnits.id]
	}),
	sentenceLesson: one(sentenceLessons, {
		fields: [userSentenceProgress.lessonId],
		references: [sentenceLessons.id]
	}),
	sentence: one(sentences, {
		fields: [userSentenceProgress.sentenceId],
		references: [sentences.id]
	}),
}));

export const callSessionsRelations = relations(callSessions, ({one}) => ({
	user: one(user, {
		fields: [callSessions.userId],
		references: [user.id]
	}),
}));

export const userStatsRelations = relations(userStats, ({one}) => ({
	user: one(user, {
		fields: [userStats.userId],
		references: [user.id]
	}),
}));

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
	user: one(user, {
		fields: [subscriptions.userId],
		references: [user.id]
	}),
}));