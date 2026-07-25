import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// -----------------------------------------------------------------------------
// Shared enum validators
// -----------------------------------------------------------------------------

const platformValidator = v.union(
  v.literal("ios"),
  v.literal("android")
);

const userStatusValidator = v.union(
  v.literal("active"),
  v.literal("suspended"),
  v.literal("deletion_pending"),
  v.literal("deleted")
);

const clubStatusValidator = v.union(
  v.literal("draft"),
  v.literal("waiting"),
  v.literal("active"),
  v.literal("completed"),
  v.literal("archived"),
  v.literal("deletion_pending"),
  v.literal("deleted")
);

const clubCategoryValidator = v.union(
  v.literal("fun"),
  v.literal("fitness"),
  v.literal("learning"),
  v.literal("creativity"),
  v.literal("travel"),
  v.literal("habits"),
  v.literal("other")
);

const participationModeValidator = v.union(
  v.literal("competitive"),
  v.literal("collaborative"),
  v.literal("parallel")
);

const endingTypeValidator = v.union(
  v.literal("time"),
  v.literal("goal")
);

const startConditionValidator = v.union(
  v.literal("immediate"),
  v.literal("scheduled"),
  v.literal("member_threshold")
);

const memberRoleValidator = v.union(
  v.literal("owner"),
  v.literal("co_creator"),
  v.literal("member")
);

const membershipStatusValidator = v.union(
  v.literal("pending"),
  v.literal("active"),
  v.literal("muted"),
  v.literal("suspended"),
  v.literal("removed"),
  v.literal("left")
);

const proofTypeValidator = v.union(
  v.literal("none"),
  v.literal("text"),
  v.literal("photo"),
  v.literal("video"),
  v.literal("numeric")
);

const taskReviewRuleValidator = v.union(
  v.literal("instant"),
  v.literal("creator_approval"),
  v.literal("simple_completion")
);

const taskStatusValidator = v.union(
  v.literal("active"),
  v.literal("archived"),
  v.literal("deleted")
);

const submissionStatusValidator = v.union(
  v.literal("draft"),
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("resubmission_requested"),
  v.literal("withdrawn"),
  v.literal("invalidated")
);

const reactionTypeValidator = v.union(
  v.literal("like"),
  v.literal("love"),
  v.literal("laugh"),
  v.literal("fire"),
  v.literal("clap"),
  v.literal("wow"),
  v.literal("support")
);

const contentStatusValidator = v.union(
  v.literal("active"),
  v.literal("edited"),
  v.literal("deleted_by_author"),
  v.literal("removed_by_moderator")
);

const mediaStatusValidator = v.union(
  v.literal("preparing"),
  v.literal("uploading"),
  v.literal("processing"),
  v.literal("ready"),
  v.literal("failed"),
  v.literal("quarantined"),
  v.literal("deleted")
);

const moderationStatusValidator = v.union(
  v.literal("not_checked"),
  v.literal("pending"),
  v.literal("approved"),
  v.literal("flagged"),
  v.literal("rejected")
);

const mediaPurposeValidator = v.union(
  v.literal("profile"),
  v.literal("club_cover"),
  v.literal("submission"),
  v.literal("chat"),
  v.literal("comment"),
  v.literal("template_cover"),
  v.literal("wrapped_export"),
  v.literal("thumbnail")
);

const notificationPushStateValidator = v.union(
  v.literal("not_requested"),
  v.literal("queued"),
  v.literal("sent_to_expo"),
  v.literal("delivered_unknown"),
  v.literal("failed"),
  v.literal("skipped")
);

const wrappedStateValidator = v.union(
  v.literal("not_started"),
  v.literal("queued"),
  v.literal("generating"),
  v.literal("ready"),
  v.literal("failed")
);

// -----------------------------------------------------------------------------
// Shared object validators
// -----------------------------------------------------------------------------

const coCreatorPermissionsValidator = v.object({
  manageTasks: v.boolean(),
  reviewSubmissions: v.boolean(),
  adjustPoints: v.boolean(),
  manageMembers: v.boolean(),
  postAnnouncements: v.boolean(),
  editClubDetails: v.boolean(),
  manageReminders: v.boolean(),
  moderateContent: v.boolean(),
  manageInvites: v.boolean(),
});

const notificationPreferencesValidator = v.object({
  chatMessages: v.boolean(),
  mentionsAndReplies: v.boolean(),
  comments: v.boolean(),
  reactionsAndVotes: v.boolean(),
  submissionReviews: v.boolean(),
  scoreChanges: v.boolean(),
  taskDeadlines: v.boolean(),
  dailyReminders: v.boolean(),
  announcements: v.boolean(),
  wrappedReady: v.boolean(),
  quietHoursEnabled: v.boolean(),
  quietHoursStartMinutes: v.optional(v.number()),
  quietHoursEndMinutes: v.optional(v.number()),
});

const memberReminderOverridesValidator = v.object({
  useClubDefaults: v.boolean(),
  dailyProgressEnabled: v.optional(v.boolean()),
  dailyProgressMinutes: v.optional(v.number()),
  taskDeadlinesEnabled: v.optional(v.boolean()),
  endingSoonEnabled: v.optional(v.boolean()),
  announcementsEnabled: v.optional(v.boolean()),
  sharedMilestonesEnabled: v.optional(v.boolean()),
});

const clubReminderDefaultsValidator = v.object({
  clubStartingSoon: v.boolean(),
  dailyProgress: v.boolean(),
  dailyProgressMinutes: v.optional(v.number()),
  taskDeadlineOneDay: v.boolean(),
  taskDeadlineOneHour: v.boolean(),
  clubEndingSoon: v.boolean(),
  announcements: v.boolean(),
  sharedGoalMilestones: v.boolean(),
  minimumMemberReached: v.boolean(),
});

const clubThemeValidator = v.object({
  accentColor: v.string(),
  secondaryColor: v.optional(v.string()),
  iconKey: v.string(),
  illustrationKey: v.optional(v.string()),
});

const clubChatSettingsValidator = v.object({
  enabled: v.boolean(),
  membersCanPostMedia: v.boolean(),
  membersCanMentionEveryone: v.boolean(),
  allowChatAfterCompletion: v.boolean(),
  locked: v.boolean(),
});

const clubScoringSettingsValidator = v.object({
  pointsEnabled: v.boolean(),
  memberVotingEnabled: v.boolean(),
  creatorBonusPointsEnabled: v.boolean(),
  leaderboardVisibleBeforeCompletion: v.boolean(),
  rankingMetric: v.union(
    v.literal("points"),
    v.literal("tasks_completed"),
    v.literal("vote_score"),
    v.literal("completion_percentage")
  ),
});

const goalConfigurationValidator = v.object({
  target: v.number(),
  unit: v.string(),
  aggregation: v.union(v.literal("shared"), v.literal("individual")),
  contributionMode: v.union(
    v.literal("completion_count"),
    v.literal("task_value"),
    v.literal("manual_value")
  ),
});

const votingSettingsValidator = v.object({
  enabled: v.boolean(),
  mode: v.union(v.literal("upvote"), v.literal("best_submission")),
  maxVotesPerMember: v.number(),
  affectsPoints: v.boolean(),
  pointsPerVote: v.number(),
});

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------

export default defineSchema({
  profiles: defineTable({
    clerkSubject: v.string(),
    displayName: v.optional(v.string()),
    email: v.optional(v.string()),
    isComplete: v.boolean(),
    tokenIdentifier: v.string(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  products: defineTable({
    product: v.string(),
    price: v.number(),
    quantity: v.number(),
    emoji: v.string(),
    category: v.string(),
  }),

  // ---------------------------------------------------------------------------
  // Identity and devices
  // ---------------------------------------------------------------------------

  users: defineTable({
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    displayName: v.string(),
    username: v.string(),
    usernameNormalized: v.string(),
    profileMediaId: v.optional(v.id("media")),
    timezone: v.string(),
    locale: v.optional(v.string()),
    status: userStatusValidator,
    notificationPreferences: notificationPreferencesValidator,
    hideIdentityOnWrappedExportsByDefault: v.boolean(),
    allowFaceOnWrappedExportsByDefault: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastActiveAt: v.number(),
    deletionRequestedAt: v.optional(v.number()),
    deletionScheduledFor: v.optional(v.number()),
  })
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_username_normalized", ["usernameNormalized"])
    .index("by_status", ["status"]),

  userDevices: defineTable({
    userId: v.id("users"),
    platform: platformValidator,
    deviceIdHash: v.string(),
    expoPushToken: v.string(),
    tokenStatus: v.union(
      v.literal("active"),
      v.literal("invalid"),
      v.literal("disabled")
    ),
    appVersion: v.optional(v.string()),
    pushFailureCount: v.number(),
    lastSeenAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_push_token", ["expoPushToken"])
    .index("by_user_status", ["userId", "tokenStatus"]),

  userBlocks: defineTable({
    blockerUserId: v.id("users"),
    blockedUserId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_blocker", ["blockerUserId"])
    .index("by_blocked", ["blockedUserId"])
    .index("by_blocker_blocked", ["blockerUserId", "blockedUserId"]),

  // ---------------------------------------------------------------------------
  // Clubs, periods, membership, and invites
  // ---------------------------------------------------------------------------

  clubs: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    description: v.string(),
    category: clubCategoryValidator,
    coverMediaId: v.optional(v.id("media")),
    theme: clubThemeValidator,

    status: clubStatusValidator,
    participationMode: participationModeValidator,
    endingType: endingTypeValidator,
    startCondition: startConditionValidator,

    scheduledStartAt: v.optional(v.number()),
    minimumMembersToStart: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    endAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    archivedAt: v.optional(v.number()),

    goal: v.optional(goalConfigurationValidator),
    memberLimit: v.number(),
    joinApprovalRequired: v.boolean(),

    chatSettings: clubChatSettingsValidator,
    scoringSettings: clubScoringSettingsValidator,
    reminderDefaults: clubReminderDefaultsValidator,

    currentPeriodId: v.optional(v.id("clubPeriods")),
    currentPeriodSequence: v.number(),

    memberCount: v.number(),
    activeMemberCount: v.number(),
    taskCount: v.number(),

    wrappedState: wrappedStateValidator,
    wrappedFormulaVersion: v.optional(v.string()),

    publishedAt: v.optional(v.number()),
    deletionRequestedAt: v.optional(v.number()),
    deletionScheduledFor: v.optional(v.number()),
    version: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner_status", ["ownerId", "status"])
    .index("by_status", ["status"])
    .index("by_status_scheduled_start", ["status", "scheduledStartAt"])
    .index("by_status_end_at", ["status", "endAt"])
    .index("by_deletion_state", ["status", "deletionScheduledFor"]),

  clubPeriods: defineTable({
    clubId: v.id("clubs"),
    sequence: v.number(),
    periodType: v.union(v.literal("original"), v.literal("reopened")),
    status: v.union(
      v.literal("scheduled"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    startedAt: v.optional(v.number()),
    scheduledEndAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    createdByUserId: v.id("users"),
    reason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_club_sequence", ["clubId", "sequence"])
    .index("by_club_status", ["clubId", "status"])
    .index("by_status_end", ["status", "scheduledEndAt"]),

  clubMembers: defineTable({
    clubId: v.id("clubs"),
    userId: v.id("users"),
    role: memberRoleValidator,
    status: membershipStatusValidator,
    permissions: coCreatorPermissionsValidator,
    invitedByUserId: v.optional(v.id("users")),
    joinedAt: v.optional(v.number()),
    leftAt: v.optional(v.number()),
    removedAt: v.optional(v.number()),
    suspendedAt: v.optional(v.number()),
    mutedUntil: v.optional(v.number()),
    muteAllNotifications: v.boolean(),
    reminderOverrides: memberReminderOverridesValidator,
    wrappedExportOptOut: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_club", ["clubId"])
    .index("by_user", ["userId"])
    .index("by_club_user", ["clubId", "userId"])
    .index("by_club_role_status", ["clubId", "role", "status"])
    .index("by_user_status", ["userId", "status"]),

  clubInvites: defineTable({
    clubId: v.id("clubs"),
    createdByUserId: v.id("users"),
    codeHash: v.string(),
    codeHint: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("disabled"),
      v.literal("expired"),
      v.literal("exhausted")
    ),
    expiresAt: v.optional(v.number()),
    maximumUses: v.optional(v.number()),
    useCount: v.number(),
    requiresApproval: v.boolean(),
    disabledAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code_hash", ["codeHash"])
    .index("by_club_status", ["clubId", "status"])
    .index("by_status_expiry", ["status", "expiresAt"]),

  clubJoinRequests: defineTable({
    clubId: v.id("clubs"),
    userId: v.id("users"),
    inviteId: v.id("clubInvites"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled")
    ),
    message: v.optional(v.string()),
    reviewedByUserId: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_club_status", ["clubId", "status"])
    .index("by_user_status", ["userId", "status"])
    .index("by_club_user", ["clubId", "userId"]),

  // ---------------------------------------------------------------------------
  // Tasks and submissions
  // ---------------------------------------------------------------------------

  tasks: defineTable({
    clubId: v.id("clubs"),
    createdByUserId: v.id("users"),
    title: v.string(),
    instructions: v.string(),
    sortOrder: v.number(),
    status: taskStatusValidator,

    points: v.number(),
    allowedProofTypes: v.array(proofTypeValidator),
    reviewRule: taskReviewRuleValidator,
    voting: votingSettingsValidator,

    deadlineAt: v.optional(v.number()),
    completionLimitPerMember: v.number(),
    goalContributionValue: v.optional(v.number()),
    allowCaption: v.boolean(),

    createdAt: v.number(),
    updatedAt: v.number(),
    archivedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    version: v.number(),
  })
    .index("by_club_order", ["clubId", "sortOrder"])
    .index("by_club_status_order", ["clubId", "status", "sortOrder"])
    .index("by_club_deadline", ["clubId", "deadlineAt"]),

  submissions: defineTable({
    clubId: v.id("clubs"),
    taskId: v.id("tasks"),
    periodId: v.id("clubPeriods"),
    memberId: v.id("clubMembers"),
    userId: v.id("users"),

    clientRequestId: v.string(),
    proofTypes: v.array(proofTypeValidator),
    text: v.optional(v.string()),
    caption: v.optional(v.string()),
    manualValue: v.optional(v.number()),
    mediaIds: v.array(v.id("media")),

    status: submissionStatusValidator,
    pointsAwarded: v.number(),
    voteScore: v.number(),
    reactionCount: v.number(),
    commentCount: v.number(),

    reviewedByMemberId: v.optional(v.id("clubMembers")),
    reviewedAt: v.optional(v.number()),
    reviewReason: v.optional(v.string()),

    version: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    withdrawnAt: v.optional(v.number()),
    invalidatedAt: v.optional(v.number()),
  })
    .index("by_club_created", ["clubId", "createdAt"])
    .index("by_period_created", ["periodId", "createdAt"])
    .index("by_task_created", ["taskId", "createdAt"])
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_member_created", ["memberId", "createdAt"])
    .index("by_club_status_created", ["clubId", "status", "createdAt"])
    .index("by_task_member_created", ["taskId", "memberId", "createdAt"])
    .index("by_user_request", ["userId", "clientRequestId"]),

  submissionVersions: defineTable({
    submissionId: v.id("submissions"),
    version: v.number(),
    createdByUserId: v.id("users"),
    changeReason: v.optional(v.string()),
    proofTypes: v.array(proofTypeValidator),
    text: v.optional(v.string()),
    caption: v.optional(v.string()),
    manualValue: v.optional(v.number()),
    mediaIds: v.array(v.id("media")),
    createdAt: v.number(),
  })
    .index("by_submission_version", ["submissionId", "version"])
    .index("by_submission_created", ["submissionId", "createdAt"]),

  submissionReactions: defineTable({
    clubId: v.id("clubs"),
    submissionId: v.id("submissions"),
    userId: v.id("users"),
    reactionType: reactionTypeValidator,
    createdAt: v.number(),
  })
    .index("by_submission", ["submissionId"])
    .index("by_submission_user", ["submissionId", "userId"])
    .index("by_submission_user_type", [
      "submissionId",
      "userId",
      "reactionType",
    ])
    .index("by_club_created", ["clubId", "createdAt"]),

  submissionVotes: defineTable({
    clubId: v.id("clubs"),
    taskId: v.id("tasks"),
    submissionId: v.id("submissions"),
    voterUserId: v.id("users"),
    value: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_submission", ["submissionId"])
    .index("by_submission_voter", ["submissionId", "voterUserId"])
    .index("by_task_voter", ["taskId", "voterUserId"])
    .index("by_club_created", ["clubId", "createdAt"]),

  comments: defineTable({
    clubId: v.id("clubs"),
    submissionId: v.id("submissions"),
    authorUserId: v.id("users"),
    parentCommentId: v.optional(v.id("comments")),
    text: v.string(),
    mediaIds: v.array(v.id("media")),
    status: contentStatusValidator,
    reactionCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
    moderatedByUserId: v.optional(v.id("users")),
    moderationReason: v.optional(v.string()),
  })
    .index("by_submission_created", ["submissionId", "createdAt"])
    .index("by_parent_created", ["parentCommentId", "createdAt"])
    .index("by_club_created", ["clubId", "createdAt"])
    .index("by_author_created", ["authorUserId", "createdAt"]),

  // ---------------------------------------------------------------------------
  // Chat
  // ---------------------------------------------------------------------------

  chatMessages: defineTable({
    clubId: v.id("clubs"),
    periodId: v.optional(v.id("clubPeriods")),
    senderUserId: v.id("users"),
    clientRequestId: v.string(),

    messageType: v.union(
      v.literal("text"),
      v.literal("media"),
      v.literal("gif"),
      v.literal("announcement"),
      v.literal("system")
    ),
    text: v.optional(v.string()),
    mediaIds: v.array(v.id("media")),
    gifUrl: v.optional(v.string()),
    replyToMessageId: v.optional(v.id("chatMessages")),

    status: contentStatusValidator,
    reactionCount: v.number(),
    isPinned: v.boolean(),
    pinnedByUserId: v.optional(v.id("users")),
    pinnedAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
    editedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    moderatedByUserId: v.optional(v.id("users")),
    moderationReason: v.optional(v.string()),
  })
    .index("by_club_created", ["clubId", "createdAt"])
    .index("by_club_period_created", ["clubId", "periodId", "createdAt"])
    .index("by_sender_created", ["senderUserId", "createdAt"])
    .index("by_user_request", ["senderUserId", "clientRequestId"])
    .index("by_club_pinned", ["clubId", "isPinned", "pinnedAt"]),

  chatReactions: defineTable({
    clubId: v.id("clubs"),
    messageId: v.id("chatMessages"),
    userId: v.id("users"),
    reactionType: reactionTypeValidator,
    createdAt: v.number(),
  })
    .index("by_message", ["messageId"])
    .index("by_message_user", ["messageId", "userId"])
    .index("by_message_user_type", ["messageId", "userId", "reactionType"])
    .index("by_club_created", ["clubId", "createdAt"]),

  // ---------------------------------------------------------------------------
  // Denormalised progress read models
  // ---------------------------------------------------------------------------

  memberStats: defineTable({
    clubId: v.id("clubs"),
    memberId: v.id("clubMembers"),
    userId: v.id("users"),
    scope: v.union(v.literal("lifetime"), v.literal("period")),
    periodId: v.optional(v.id("clubPeriods")),

    totalPoints: v.number(),
    tasksCompleted: v.number(),
    submissionsApproved: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    contributionAmount: v.number(),
    voteScoreReceived: v.number(),
    reactionsReceived: v.number(),
    commentsGiven: v.number(),
    helpfulInteractions: v.number(),

    currentRank: v.optional(v.number()),
    previousRank: v.optional(v.number()),
    lastCompletionDateKey: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_club_member_scope", ["clubId", "memberId", "scope"])
    .index("by_club_user_scope", ["clubId", "userId", "scope"])
    .index("by_club_scope_points", ["clubId", "scope", "totalPoints"])
    .index("by_period_points", ["periodId", "totalPoints"]),

  clubStats: defineTable({
    clubId: v.id("clubs"),
    scope: v.union(v.literal("lifetime"), v.literal("period")),
    periodId: v.optional(v.id("clubPeriods")),

    totalSubmissions: v.number(),
    approvedSubmissions: v.number(),
    totalTaskCompletions: v.number(),
    sharedGoalProgress: v.number(),
    activeMemberCount: v.number(),
    totalReactions: v.number(),
    totalComments: v.number(),
    completionPercentage: v.number(),
    leaderboardVersion: v.number(),
    lastActivityAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_club_scope", ["clubId", "scope"])
    .index("by_club_period", ["clubId", "periodId"]),

  // ---------------------------------------------------------------------------
  // Templates
  // ---------------------------------------------------------------------------

  templates: defineTable({
    ownerUserId: v.optional(v.id("users")),
    visibility: v.union(v.literal("official"), v.literal("private")),
    status: v.union(v.literal("active"), v.literal("archived")),

    name: v.string(),
    description: v.string(),
    category: clubCategoryValidator,
    coverMediaId: v.optional(v.id("media")),
    theme: clubThemeValidator,
    participationMode: participationModeValidator,
    endingType: endingTypeValidator,

    suggestedDurationDays: v.optional(v.number()),
    goal: v.optional(goalConfigurationValidator),
    scoringSettings: clubScoringSettingsValidator,
    chatSettings: clubChatSettingsValidator,
    reminderDefaults: clubReminderDefaultsValidator,

    taskBlueprints: v.array(
      v.object({
        blueprintKey: v.string(),
        title: v.string(),
        instructions: v.string(),
        sortOrder: v.number(),
        points: v.number(),
        allowedProofTypes: v.array(proofTypeValidator),
        reviewRule: taskReviewRuleValidator,
        voting: votingSettingsValidator,
        completionLimitPerMember: v.number(),
        goalContributionValue: v.optional(v.number()),
        suggestedDeadlineOffsetMinutes: v.optional(v.number()),
        allowCaption: v.boolean(),
      })
    ),

    version: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    archivedAt: v.optional(v.number()),
  })
    .index("by_visibility_status", ["visibility", "status"])
    .index("by_owner_status", ["ownerUserId", "status"])
    .index("by_owner_updated", ["ownerUserId", "updatedAt"]),

  // ---------------------------------------------------------------------------
  // Notifications and scheduled work
  // ---------------------------------------------------------------------------

  notifications: defineTable({
    recipientUserId: v.id("users"),
    clubId: v.optional(v.id("clubs")),
    actorUserId: v.optional(v.id("users")),

    type: v.string(),
    title: v.string(),
    body: v.string(),
    deepLink: v.optional(v.string()),
    groupKey: v.optional(v.string()),

    relatedEntityType: v.optional(v.string()),
    relatedEntityId: v.optional(v.string()),

    readAt: v.optional(v.number()),
    pushState: notificationPushStateValidator,
    pushAttemptCount: v.number(),
    expoReceiptId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_recipient_created", ["recipientUserId", "createdAt"])
    .index("by_recipient_read_created", ["recipientUserId", "readAt", "createdAt"])
    .index("by_push_state_created", ["pushState", "createdAt"])
    .index("by_recipient_group", ["recipientUserId", "groupKey"]),

  scheduledEvents: defineTable({
    eventKey: v.string(),
    clubId: v.optional(v.id("clubs")),
    recipientUserId: v.optional(v.id("users")),
    type: v.string(),
    state: v.union(
      v.literal("scheduled"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    scheduledFor: v.number(),
    attemptCount: v.number(),
    payload: v.optional(v.any()),
    lastError: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_event_key", ["eventKey"])
    .index("by_state_scheduled", ["state", "scheduledFor"])
    .index("by_club_state", ["clubId", "state"]),

  // ---------------------------------------------------------------------------
  // Private media metadata
  // ---------------------------------------------------------------------------

  media: defineTable({
    ownerUserId: v.id("users"),
    clubId: v.optional(v.id("clubs")),
    purpose: mediaPurposeValidator,

    provider: v.literal("r2"),
    bucket: v.string(),
    objectKey: v.string(),
    thumbnailMediaId: v.optional(v.id("media")),

    originalFilename: v.optional(v.string()),
    mimeType: v.string(),
    sizeBytes: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    checksum: v.optional(v.string()),

    status: mediaStatusValidator,
    moderationStatus: moderationStatusValidator,
    moderationReason: v.optional(v.string()),
    referenceCount: v.number(),

    createdAt: v.number(),
    updatedAt: v.number(),
    readyAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
  })
    .index("by_object_key", ["objectKey"])
    .index("by_owner_created", ["ownerUserId", "createdAt"])
    .index("by_club_created", ["clubId", "createdAt"])
    .index("by_status_created", ["status", "createdAt"])
    .index("by_moderation_status", ["moderationStatus", "createdAt"]),

  // ---------------------------------------------------------------------------
  // Wrapped snapshots
  // ---------------------------------------------------------------------------

  wrappedSnapshots: defineTable({
    clubId: v.id("clubs"),
    periodId: v.optional(v.id("clubPeriods")),
    memberId: v.optional(v.id("clubMembers")),
    scope: v.union(v.literal("group"), v.literal("personal")),
    state: wrappedStateValidator,

    generationKey: v.string(),
    formulaVersion: v.string(),
    metrics: v.any(),
    awards: v.array(
      v.object({
        key: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        memberId: v.optional(v.id("clubMembers")),
        submissionId: v.optional(v.id("submissions")),
        numericValue: v.optional(v.number()),
        textValue: v.optional(v.string()),
      })
    ),
    selectedMediaIds: v.array(v.id("media")),

    exportPrivacy: v.object({
      hideClubNameByDefault: v.boolean(),
      hideMemberNamesByDefault: v.boolean(),
      hideFacesByDefault: v.boolean(),
      optedOutMemberIds: v.array(v.id("clubMembers")),
    }),

    generatedAt: v.optional(v.number()),
    failureReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_generation_key", ["generationKey"])
    .index("by_club_scope", ["clubId", "scope"])
    .index("by_club_member", ["clubId", "memberId"])
    .index("by_state_created", ["state", "createdAt"]),

  // ---------------------------------------------------------------------------
  // Safety, moderation, auditing, and idempotency
  // ---------------------------------------------------------------------------

  reports: defineTable({
    reporterUserId: v.id("users"),
    clubId: v.optional(v.id("clubs")),
    reportedUserId: v.optional(v.id("users")),
    contentType: v.union(
      v.literal("submission"),
      v.literal("comment"),
      v.literal("chat_message"),
      v.literal("profile"),
      v.literal("club")
    ),
    contentId: v.string(),
    reason: v.union(
      v.literal("spam"),
      v.literal("harassment"),
      v.literal("unsafe_content"),
      v.literal("privacy"),
      v.literal("impersonation"),
      v.literal("other")
    ),
    details: v.optional(v.string()),
    status: v.union(
      v.literal("open"),
      v.literal("reviewing"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    assignedToUserId: v.optional(v.id("users")),
    resolution: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_status_created", ["status", "createdAt"])
    .index("by_club_status", ["clubId", "status"])
    .index("by_reporter_created", ["reporterUserId", "createdAt"])
    .index("by_reported_user", ["reportedUserId", "createdAt"]),

  moderationActions: defineTable({
    actorUserId: v.id("users"),
    clubId: v.optional(v.id("clubs")),
    reportId: v.optional(v.id("reports")),
    targetUserId: v.optional(v.id("users")),
    targetType: v.string(),
    targetId: v.optional(v.string()),
    action: v.union(
      v.literal("content_removed"),
      v.literal("comments_disabled"),
      v.literal("member_muted"),
      v.literal("member_suspended"),
      v.literal("member_removed"),
      v.literal("chat_locked"),
      v.literal("user_suspended"),
      v.literal("no_action")
    ),
    reason: v.string(),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_club_created", ["clubId", "createdAt"])
    .index("by_target_user_created", ["targetUserId", "createdAt"])
    .index("by_report", ["reportId"]),

  auditLogs: defineTable({
    clubId: v.optional(v.id("clubs")),
    actorUserId: v.optional(v.id("users")),
    actorMemberId: v.optional(v.id("clubMembers")),
    action: v.string(),
    targetType: v.string(),
    targetId: v.optional(v.string()),
    previousValue: v.optional(v.any()),
    nextValue: v.optional(v.any()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_club_created", ["clubId", "createdAt"])
    .index("by_actor_created", ["actorUserId", "createdAt"])
    .index("by_action_created", ["action", "createdAt"]),

  idempotencyRecords: defineTable({
    userId: v.id("users"),
    scope: v.string(),
    key: v.string(),
    state: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    resultType: v.optional(v.string()),
    resultId: v.optional(v.string()),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_scope_key", ["userId", "scope", "key"])
    .index("by_expiry", ["expiresAt"]),
});
