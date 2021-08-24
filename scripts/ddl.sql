-- Table: bms.user

CREATE TABLE IF NOT EXISTS bms."user"
(
    user_id serial NOT NULL ,
    username character varying(50)  NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(255)  NOT NULL,
    full_name character varying(100)  NOT NULL,
    user_img character varying(50) ,
    age integer,
    is_admin boolean,
    CONSTRAINT user_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_email_key UNIQUE (email)
)

-- Table: bms.book

CREATE TABLE IF NOT EXISTS bms.book
(
    book_id serial NOT NULL ,
    book_title character varying(50) NOT NULL,
    book_description character varying(1000)  NOT NULL,
    book_author character varying(50)  NOT NULL,
    book_publisher character varying(50)  NOT NULL,
    book_pages integer,
    store_code character varying(5)  NOT NULL,
    created_on timestamp without time zone NOT NULL,
    created_by character varying(50)  NOT NULL,
    book_category character varying(50)  NOT NULL,
    book_price integer NOT NULL,
    book_img character varying(50)  NOT NULL,
    CONSTRAINT book_pkey PRIMARY KEY (book_id)
)

-- Table: bms.store

CREATE TABLE IF NOT EXISTS bms.store
(
    store_id integer NOT NULL,
    store_name character varying(100) NOT NULL,
    store_code character varying(5) NOT NULL,
    created_on timestamp without time zone NOT NULL,
    created_by character varying(50) NOT NULL,
    store_address character varying(200) NOT NULL,
    CONSTRAINT store_pkey PRIMARY KEY (store_id)
)
