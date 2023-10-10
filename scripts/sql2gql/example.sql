CREATE TABLE subscription_types (
    subscription_type text PRIMARY KEY
);

CREATE TABLE subscription_pricing (
    subscription_type text REFERENCES subscription_types(subscription_type)
);

COMMENT ON TABLE subscription_pricing IS '@omit create,update,delete';

comment on table subscription_pricing is E'@omit create,update,delete';

