--
-- PostgreSQL database dump
--

\restrict 8Z7Plq6JBaKN7Xvi4M69VBScvu1O4J55A98Ya2GcJjurG6jjbh3nzmzzqc2A0Eg

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
-- Data for Name: t_points_vente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.t_points_vente VALUES ('PV010', 'Pharmacie Sahélienne', '90000010', 'Avenue du Sahel, Zinder', 13.8100, 8.9950, '2025-10-08 09:08:15');
INSERT INTO public.t_points_vente VALUES ('PV011', 'Pharmacie Vide', '90000011', 'Rue Vide, Tillabéri', 14.2000, 0.8000, '2025-10-08 09:08:15');
INSERT INTO public.t_points_vente VALUES ('PV001', 'Pharmacie Centrale', '90000001', 'Avenue de la Santé, Niamey', 13.5116, 2.1254, '2025-10-09 19:56:37.232525');
INSERT INTO public.t_points_vente VALUES ('PV002', 'Pharmacie Espoir', '90000002', 'Rue du Marché, Maradi', 13.5020, 7.1257, '2025-10-09 19:56:37.232525');
INSERT INTO public.t_points_vente VALUES ('PV003', 'Pharmacie Horizon', '90000003', 'Quartier Plateau, Zinder', 13.8082, 8.9886, '2025-10-09 19:56:37.232525');
INSERT INTO public.t_points_vente VALUES ('PV004', 'Pharmacie du Lac', '90000004', 'Quartier Lac, Niamey', 13.5260, 2.1050, '2025-10-09 19:56:37.232525');
INSERT INTO public.t_points_vente VALUES ('PV005', 'Pharmacie du Centre Commercial', '90000005', 'Centre Commercial, Tahoua', 14.8968, 5.2633, '2025-10-09 19:56:37.232525');
INSERT INTO public.t_points_vente VALUES ('PV006', 'Pharmacie Sainte-Marie', '90000006', 'Rue Principale, Dosso', 13.0512, 3.1964, '2025-10-09 19:56:37.232525');
INSERT INTO public.t_points_vente VALUES ('PV007', 'Pharmacie du Marché Nord', '90000007', 'Marché Nord, Agadez', 16.3571, 7.9881, '2025-10-09 19:56:37.232525');
INSERT INTO public.t_points_vente VALUES ('PV008', 'Pharmacie Solidarité', '90000008', 'Boulevard Victor, Maradi', 13.5045, 7.1289, '2025-10-09 19:56:37.232525');
INSERT INTO public.t_points_vente VALUES ('PV009', 'Pharmacie de Quartier', '90000009', 'Cité Lafiabougou, Niamey', 13.5130, 2.1300, '2025-10-09 19:56:37.232525');
INSERT INTO public.t_points_vente VALUES ('PV012', 'Pharmacie Francophonie', '96857412', 'Quartier Francophonie', 14.2000, 8.9950, '2025-10-11 21:12:29');


--
-- PostgreSQL database dump complete
--

\unrestrict 8Z7Plq6JBaKN7Xvi4M69VBScvu1O4J55A98Ya2GcJjurG6jjbh3nzmzzqc2A0Eg

