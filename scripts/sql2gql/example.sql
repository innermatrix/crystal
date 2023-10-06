create type e as enum ('E1');
comment on type e is '@name f';

create table t(c1 e);