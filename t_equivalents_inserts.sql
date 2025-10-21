--
-- PostgreSQL database dump
--

\restrict JbQl5b2uSC9agKpHdw5uAQrB3fTwjEu0Fxo9opbXCFAb3fiLn9abcHOMxezW06g

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: t_equivalents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.t_equivalents VALUES (17, 'PRD001', 'PRD007');
INSERT INTO public.t_equivalents VALUES (18, 'PRD004', 'PRD007');
INSERT INTO public.t_equivalents VALUES (19, 'PRD002', 'PRD008');
INSERT INTO public.t_equivalents VALUES (20, 'PRD005', 'PRD008');
INSERT INTO public.t_equivalents VALUES (21, 'PRD013', 'PRD001');
INSERT INTO public.t_equivalents VALUES (22, 'PRD019', 'PRD001');
INSERT INTO public.t_equivalents VALUES (29, 'PRD050', 'PRD051');
INSERT INTO public.t_equivalents VALUES (30, 'PRD060', 'PRD062');
INSERT INTO public.t_equivalents VALUES (31, 'PRD059', 'PRD080');
INSERT INTO public.t_equivalents VALUES (32, 'PRD080', 'PRD059');


--
-- Name: t_equivalents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_equivalents_id_seq', 32, true);


--
-- PostgreSQL database dump complete
--

\unrestrict JbQl5b2uSC9agKpHdw5uAQrB3fTwjEu0Fxo9opbXCFAb3fiLn9abcHOMxezW06g

