## Getting started with project


**1. Clone the backend code**
```sh
git clone https://github.com/jonnekoi/FMM.git
```

**2. Run following commands**
```sh
npm install
```

**3. Follow the steps and create database,
After database start the app**
```sh
npm run nodemon
```


## Getting started with database

**1. Create database**
```sh
create database fmm;
```

**2. Select the database**
```sh
use fmm;
```

**3. Create needed tables**
```sh
create or replace table leaguenames
(
    id          int auto_increment
        primary key,
    league_name varchar(255) not null
);

create or replace table teams
(
    id        int auto_increment
        primary key,
    team_name varchar(255) not null
);

create or replace table matches
(
    id         int auto_increment
        primary key,
    matchday   datetime not null,
    home_team  int      not null,
    away_team  int      not null,
    home_score int      null,
    away_score int      null,
    inLeague   int      null,
    constraint fk_inLeague
        foreign key (inLeague) references leaguenames (id),
    constraint matches_ibfk_1
        foreign key (home_team) references teams (id),
    constraint matches_ibfk_2
        foreign key (away_team) references teams (id)
);

create or replace table players
(
    id      int auto_increment
        primary key,
    name    varchar(255) not null,
    team_id int          not null,
    constraint players_ibfk_1
        foreign key (team_id) references teams (id)
);

create or replace table users
(
    id       int auto_increment
        primary key,
    name     text null,
    username text null,
    password text null,
    access   text null,
    email    text null
);

create or replace table leagues
(
    id         int auto_increment
        primary key,
    name       varchar(255) not null,
    isPublic   tinyint(1)   not null,
    owner      int          null,
    maxPlayers int          null,
    leagueKey  varchar(255) null,
    StartDate  date         null,
    EndDate    date         null,
    desci      text         null,
    baseLeague int          not null,
    constraint fk_baseleague
        foreign key (baseLeague) references leaguenames (id),
    constraint leagues_ibfk_1
        foreign key (owner) references users (id)
);

create or replace table matchguesses
(
    guess_id         int auto_increment
        primary key,
    user_id          int null,
    match_id         int null,
    home_score_guess int null,
    scorer           int null,
    away_score_guess int null,
    constraint matchguesses_ibfk_1
        foreign key (user_id) references users (id),
    constraint matchguesses_ibfk_2
        foreign key (match_id) references matches (id)
);

create or replace index match_id
    on matchguesses (match_id);

create or replace index user_id
    on matchguesses (user_id);

create or replace table points
(
    id        int auto_increment
        primary key,
    user_id   int null,
    points    int not null,
    league_id int null,
    constraint fk_league_id
        foreign key (league_id) references leagues (id),
    constraint points_ibfk_1
        foreign key (user_id) references users (id)
);

create or replace index user_id
    on points (user_id);

create or replace table userleagues
(
    id        int auto_increment
        primary key,
    user_id   int not null,
    league_id int not null,
    constraint userLeagues_ibfk_1
        foreign key (user_id) references users (id),
    constraint userLeagues_ibfk_2
        foreign key (league_id) references leagues (id)
);


```
**4. Create .env file**

Create .env named file to project root and fill in with you details.

```sh
DB_HOST={database host if on local computer use 'localhost}
DB_USER={your database username}
DB_PASSWORD={your database password}
DB_NAME=FMM
JWT_SECRET={your secret code}
```

