import { describe, expect, test } from "vitest";
import schema from "./schema";

type ExportedIndex = {
  indexDescriptor: string;
  fields: string[];
};

type ExportedTable = {
  tableName: string;
  indexes: ExportedIndex[];
};

const exportedSchema = JSON.parse(schema.export()) as {
  tables: ExportedTable[];
};

const tableByName = new Map(
  exportedSchema.tables.map((table) => [table.tableName, table]),
);

const expectedDomainTables = [
  "users",
  "userDevices",
  "userBlocks",
  "clubs",
  "clubPeriods",
  "clubMembers",
  "clubInvites",
  "clubJoinRequests",
  "tasks",
  "submissions",
  "submissionVersions",
  "submissionReactions",
  "submissionVotes",
  "comments",
  "chatMessages",
  "chatReactions",
  "memberStats",
  "clubStats",
  "templates",
  "notifications",
  "scheduledEvents",
  "media",
  "wrappedSnapshots",
  "reports",
  "moderationActions",
  "auditLogs",
  "idempotencyRecords",
];

const expectedIndexes: Record<string, Record<string, string[]>> = {
  users: {
    by_clerk_user_id: ["clerkUserId"],
    by_username_normalized: ["usernameNormalized"],
    by_status: ["status"],
  },
  clubMembers: {
    by_user_status: ["userId", "status"],
    by_club_user: ["clubId", "userId"],
  },
  submissions: {
    by_club_created: ["clubId", "createdAt"],
    by_club_status_created: ["clubId", "status", "createdAt"],
    by_user_request: ["userId", "clientRequestId"],
  },
  chatMessages: {
    by_club_created: ["clubId", "createdAt"],
    by_user_request: ["senderUserId", "clientRequestId"],
  },
  media: {
    by_object_key: ["objectKey"],
    by_status_created: ["status", "createdAt"],
  },
  wrappedSnapshots: {
    by_generation_key: ["generationKey"],
    by_club_member: ["clubId", "memberId"],
  },
  idempotencyRecords: {
    by_user_scope_key: ["userId", "scope", "key"],
    by_expiry: ["expiresAt"],
  },
};

describe("Convex schema contract", () => {
  test("defines the Tiny Clubs domain tables from the database ADR", () => {
    expect([...tableByName.keys()].sort()).toEqual(
      [...expectedDomainTables, "products", "profiles"].sort(),
    );
  });

  test("defines the indexes required by primary query paths", () => {
    for (const [tableName, indexes] of Object.entries(expectedIndexes)) {
      const table = tableByName.get(tableName);
      expect(table, `${tableName} should be defined`).toBeDefined();

      const actualIndexes = new Map(
        table?.indexes.map((index) => [index.indexDescriptor, index.fields]) ??
          [],
      );

      for (const [indexName, fields] of Object.entries(indexes)) {
        expect(actualIndexes.get(indexName), `${tableName}.${indexName}`).toEqual(
          fields,
        );
      }
    }
  });
});
