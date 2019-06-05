CREATE TYPE BIKE_TYPE AS ENUM ('sport', 'general');
CREATE TYPE EVENT_STATUS_TYPE AS ENUM ('new', 'inProgress', 'done');

CREATE TABLE "public".Officer (
    "officerId" SERIAL PRIMARY KEY,
    "firstName" VARCHAR(64) NOT NULL,
    "lastName" VARCHAR(64) NOT NULL,
    "isDeleted" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE "public".Event (
    "eventId" SERIAL PRIMARY KEY,
    "status" EVENT_STATUS_TYPE DEFAULT 'new',
    "eventDate" TIMESTAMPTZ(6) NOT NULL,
    "description" VARCHAR(512),
    "licenseNumber" VARCHAR(12) UNIQUE  NOT NULL,
    "color" VARCHAR(12),
    "type" BIKE_TYPE NOT NULL,
    "ownerFirstName" VARCHAR(64) NOT NULL,
    "ownerLastName" VARCHAR(64) NOT NULL,
    "officerId" integer REFERENCES "public".Officer ("officerId"),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE UNIQUE INDEX uq_event_officer_id ON "public".Event ("officerId") WHERE "status" = 'inProgress';

CREATE TABLE "public".OfficerPool (
    "officerPoolId" SERIAL PRIMARY KEY,
    "officerId" integer REFERENCES "public".Officer ("officerId") UNIQUE,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE OR REPLACE PROCEDURE "public"."assignOfficerToEvent"()
AS $$
DECLARE eventId INT := NULL;
DECLARE officerId INT := NULL;
DECLARE officerPoolId INT := NULL;
BEGIN
    SELECT "public".Event."eventId" INTO eventId FROM "public".Event WHERE "public".Event."status" = 'new'
    ORDER BY "public".Event."createdAt"
    LIMIT 1
    FOR UPDATE;

	IF eventId IS NULL THEN
		RAISE EXCEPTION 'noNewEvent';
	END IF;

	SELECT "public".OfficerPool."officerId", "public".OfficerPool."officerPoolId" INTO officerId, officerPoolId FROM "public".OfficerPool
	ORDER BY "public".OfficerPool."createdAt"
	LIMIT 1
	FOR UPDATE;

	IF officerId IS NULL THEN
		RAISE EXCEPTION 'noFreeOfficer';
	END IF;

	UPDATE "public".Event SET ("officerId", "status", "updatedAt") = (officerId, 'inProgress', DEFAULT) WHERE "public".Event."eventId" = eventId;

	DELETE FROM "public".OfficerPool WHERE "public".OfficerPool."officerPoolId" = officerPoolId;
END
$$ LANGUAGE plpgsql;
