routine is similar to the post 
activity is similar to a tag but a subcategory of a posts.


id SERIAL PRIMARY KEY,
fitness-dev(#     "creatorId" INTEGER References users(id),
fitness-dev(#     public BOOLEAN DEFAULT false,
fitness-dev(#     name VARCHAR(255) UNIQUE NOT NULL,
fitness-dev(#     goal TEXT NOT NULL
(# );

CREATE TABLE routines (
    id SERIAL PRIMARY KEY,
    "creatorId" INTEGER REFERENCES users(id),
    public BOOLEAN DEFAULT false,
    name VARCHAR(255) UNIQUE NOT NULL,
    goal TEXT NOT NULL
);
 CREATE TABLE routine_activities (
    id SERIAL PRIMARY KEY,
    "routineId" INTEGER REFERENCES routines(id),
    "activityId" INTEGER REFERENCES activities(id),
    UNIQUE("routineId", "activityId"),
    duration INTEGER,
    count INTEGER
);