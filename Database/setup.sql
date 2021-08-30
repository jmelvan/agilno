CREATE TABLE public."user"
(
    name text COLLATE pg_catalog."default",
    surname text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    hash text COLLATE pg_catalog."default" NOT NULL,
    salt text COLLATE pg_catalog."default" NOT NULL,
    saldo real DEFAULT 0,
    validate_hash text COLLATE pg_catalog."default",
    validated boolean NOT NULL DEFAULT false,
    role text COLLATE pg_catalog."default" DEFAULT 'user'::text,
    CONSTRAINT user_pkey PRIMARY KEY (email)
);

CREATE TABLE public.betslip
(
    id serial NOT NULL,
    stake integer,
    user_email text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    status text COLLATE pg_catalog."default" DEFAULT 'unprocessed'::text,
    CONSTRAINT "Betslip_pkey" PRIMARY KEY (id),
    CONSTRAINT betslip_user_email FOREIGN KEY (user_email)
        REFERENCES public."user" (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE INDEX fki_betslip_user_email
    ON public.betslip USING btree
    (user_email COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


CREATE TABLE IF NOT EXISTS public.sport
(
    name text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL DEFAULT 'team'::text,
    result json DEFAULT '[1,2,"x"]'::json,
    CONSTRAINT sport_pkey PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS public.team
(
    id serial NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    img text COLLATE pg_catalog."default",
    sport_name text COLLATE pg_catalog."default",
    type text COLLATE pg_catalog."default" NOT NULL,
    country text COLLATE pg_catalog."default",
    CONSTRAINT "Club_pkey" PRIMARY KEY (id),
    CONSTRAINT club_sport_name FOREIGN KEY (sport_name)
        REFERENCES public.sport (name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE INDEX fki_club_sport_name
    ON public.team USING btree
    (sport_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


CREATE TABLE IF NOT EXISTS public.player
(
    id serial NOT NULL,
    name text COLLATE pg_catalog."default",
    surname text COLLATE pg_catalog."default",
    team_id integer,
    sport_name text COLLATE pg_catalog."default",
    country text COLLATE pg_catalog."default",
    img text COLLATE pg_catalog."default",
    CONSTRAINT "Player_pkey" PRIMARY KEY (id),
    CONSTRAINT player_sport_name FOREIGN KEY (sport_name)
        REFERENCES public.sport (name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT player_team_id FOREIGN KEY (team_id)
        REFERENCES public.team (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE INDEX fki_player_club_id
    ON public.player USING btree
    (team_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX fki_player_sport_name
    ON public.player USING btree
    (sport_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.competition
(
    id serial NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    sport_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT competition_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.event
(
    id serial NOT NULL,
    host_id integer NOT NULL,
    guest_id integer NOT NULL,
    win text COLLATE pg_catalog."default",
    competition_id integer,
    start_time bigint NOT NULL,
    end_time bigint,
    CONSTRAINT "Event_pkey" PRIMARY KEY (id),
    CONSTRAINT event_competition_id FOREIGN KEY (competition_id)
        REFERENCES public.competition (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE INDEX fki_event_competition_id
    ON public.event USING btree
    (competition_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE TABLE public.quota
(
    id serial NOT NULL,
    event_id integer NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    value real NOT NULL,
    CONSTRAINT "Quota_pkey" PRIMARY KEY (id),
    CONSTRAINT quota_event_id FOREIGN KEY (event_id)
        REFERENCES public.event (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE INDEX fki_quota_event_id
    ON public.quota USING btree
    (event_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.betslip_bet
(
    betslip_id integer NOT NULL,
    quota_id integer NOT NULL,
    stake integer,
    status text COLLATE pg_catalog."default",
    CONSTRAINT betslipbet_betslip_id FOREIGN KEY (betslip_id)
        REFERENCES public.betslip (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT betslipbet_quota_id FOREIGN KEY (quota_id)
        REFERENCES public.quota (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE INDEX fki_betslipbet_quota_id
    ON public.betslip_bet USING btree
    (quota_id ASC NULLS LAST)
    TABLESPACE pg_default;