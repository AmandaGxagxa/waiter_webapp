drop table if exists greet , countNames;

create table greet(
	id serial not null primary key,
	name text not null unique,
  language text not null
);



-- insert into greet(name, language) values('Amanda', 'english');
-- insert into greet(name, language) values('Yolisa', 'isiXhosa');

-- update greet set count=count +1 where name = 'Amanda';
