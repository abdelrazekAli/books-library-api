-- SCHEMA: bms

-- DROP SCHEMA bms ;

CREATE SCHEMA bms

-- Table: bms.book

-- DROP TABLE bms.book;

CREATE TABLE IF NOT EXISTS bms.book
(
    book_id integer NOT NULL DEFAULT nextval('bms.book_book_id_seq'::regclass),
    book_title character varying(300) COLLATE pg_catalog."default" NOT NULL,
    book_decription character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    book_author character varying(50) COLLATE pg_catalog."default" NOT NULL,
    book_category character varying(50) COLLATE pg_catalog."default" NOT NULL,
    book_publisher character varying(50) COLLATE pg_catalog."default" NOT NULL,
    book_img character varying(50) COLLATE pg_catalog."default" NOT NULL,
    book_price integer,
    book_pages integer,
    store_code character varying(5) COLLATE pg_catalog."default" NOT NULL,
    created_on timestamp without time zone NOT NULL,
    created_by character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT book_pkey PRIMARY KEY (book_id)
)

-- Table: bms.store

-- DROP TABLE bms.store;

-- Table: bms.store

-- DROP TABLE bms.store;

CREATE TABLE IF NOT EXISTS bms.store
(
    store_id integer NOT NULL DEFAULT nextval('bms.store_store_id_seq'::regclass),
    store_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    store_code character varying(5) COLLATE pg_catalog."default" NOT NULL,
    created_on timestamp without time zone NOT NULL,
    created_by character varying(50) COLLATE pg_catalog."default" NOT NULL,
    store_address character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT store_pkey PRIMARY KEY (store_id)
)
-- Table: bms.user

-- DROP TABLE bms."user";

CREATE TABLE IF NOT EXISTS bms."user"
(
    user_id integer NOT NULL DEFAULT nextval('bms.user_user_id_seq'::regclass),
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    full_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    user_img character varying(50) COLLATE pg_catalog."default",
    age integer,
    is_admin boolean,
    CONSTRAINT user_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_username_key UNIQUE (username),
    CONSTRAINT user_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE bms."user"
    OWNER to abdelrazekali;