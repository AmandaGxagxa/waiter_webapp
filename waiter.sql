DROP table waiter , weekdays,shifts;

create table waiter (
	id serial not null primary key,
    names text not null
	
);

create table weekdays(
	id serial not null primary key,
	Weekdays text not null
);

create table shifts (
	id serial not null primary key,
    names_id int,
	foreign key (names_id) references waiter(id),
    weekdays_id int,
    foreign key (weekdays_id) references weekdays(id)
);


insert into weekdays(Weekdays) values('Sunday');
insert into weekdays(Weekdays) values('Monday');
insert into weekdays(Weekdays) values('Tuesday');
insert into weekdays(Weekdays) values('Wednesday');
insert into weekdays(Weekdays) values('Thursday');
insert into weekdays(Weekdays) values('Friday');
insert into weekdays(Weekdays) values('Saturday');