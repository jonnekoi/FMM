## Getting started with project


**1. Clone the backend code**
```sh
git clone https://github.com/jonnekoi/FMM.git
```

**2. Run following commands**
```sh
npm install
```

**3. Follow the steps and create database
After database start the app
```sh
npm run dev
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
create table matches
(
    id         int auto_increment
        primary key,
    match_id   varchar(255) not null,
    matchday   datetime     not null,
    home_team  varchar(255) not null,
    away_team  varchar(255) not null,
    home_score int          null,
    away_score int          null
);

create table users
(
    id       int auto_increment
        primary key,
    name     text null,
    username text null,
    password text null,
    access   text null,
    email    text null
);

create table points
(
    id      int auto_increment
        primary key,
    user_id int null,
    points  int not null,
    constraint points_ibfk_1
        foreign key (user_id) references users (id)
);

create index user_id
    on points (user_id);
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

