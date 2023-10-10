CREATE TABLE subscription_statuses (
    subscription_status text PRIMARY KEY
);

CREATE TABLE member_subscriptions (
    subscription_status text NOT NULL DEFAULT 'ACTIVE'::text REFERENCES subscription_statuses(subscription_status)
);

