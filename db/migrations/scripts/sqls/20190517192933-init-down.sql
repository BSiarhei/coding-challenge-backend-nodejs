DROP TABLE IF EXISTS "public".Event CASCADE;
DROP TABLE IF EXISTS "public".Officer CASCADE;
DROP TABLE IF EXISTS "public".OfficerPool CASCADE;

DROP TYPE IF EXISTS BIKE_TYPE;
DROP TYPE IF EXISTS EVENT_STATUS_TYPE;

DROP PROCEDURE IF EXISTS "public"."assignOfficerToEvent";
