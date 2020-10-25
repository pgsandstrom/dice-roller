DROP TABLE IF EXISTS dice_event;
DROP TABLE IF EXISTS event_participant;

CREATE TABLE dice_event (
	id          TEXT PRIMARY KEY,
	name        TEXT NOT NULL,
	created     TIMESTAMP NOT NULL DEFAULT now(),
	raw         JSONB NOT NULL
);

CREATE TABLE event_participant (
	hash        TEXT PRIMARY KEY,
	event_id    TEXT NOT NULL,
	created     TIMESTAMP NOT NULL DEFAULT now(),
	raw         JSONB
);
