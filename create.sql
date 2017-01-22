
CREATE TABLE IF NOT EXISTS MemeLog (
    guildid NUMERIC,
    link TEXT,
    userid NUMERIC,
    sendtime TEXT
);

CREATE TABLE IF NOT EXISTS MemeStore (
    fetched TEXT,
    link TEXT,
    subreddit TEXT
);

