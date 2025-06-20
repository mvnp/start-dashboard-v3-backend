--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, password, email, created_at, updated_at, deleted_at) FROM stdin;
449	j5lgwx3g	programadora01@gmail.com	2025-06-17 02:57:55.057015	2025-06-17 02:57:55.057015	\N
1	Marcos$1986	mvnpereira@gmail.com	2025-06-10 12:01:52.202164	2025-06-10 12:04:38.128196	\N
450	4kzvnxzp	anthonella@gmail.com	2025-06-17 11:28:51.277044	2025-06-17 11:28:51.277044	\N
451	wjf5nqkg5pxon8ln	merchant@business.com	2025-06-17 11:49:50.631667	2025-06-17 11:51:40.590366	\N
453	zlz95gwbkvzgvxls	merchant@staff2.com.br	2025-06-17 11:57:26.653299	2025-06-17 11:57:26.653299	\N
452	99zak60t1puihr9m	merchant@client.com.br	2025-06-17 11:56:00.830946	2025-06-17 11:57:48.971878	\N
454	4uzequfactvx0r4t	staff1@barbar.com.br	2025-06-17 13:03:44.161236	2025-06-17 13:03:44.161236	\N
455	dub8oevw3qwoe0oc	staff2@barbar.com.br	2025-06-17 13:04:37.486287	2025-06-17 13:04:37.486287	\N
456	mx0w4gqk8amm5p8r	staff@barberquinta.com.br	2025-06-17 13:06:43.931221	2025-06-17 13:06:43.931221	\N
458	nsn7yvacnt070mfb	staff3@barberquinta.com.br	2025-06-17 13:09:13.166344	2025-06-17 13:09:13.166344	\N
459	ei939adlc0pphq1j	staff4@barberquinta.com.br	2025-06-17 13:20:31.826577	2025-06-17 13:20:31.826577	\N
457	9ry45ns54rmcotel	staff2@barberquinta.com.br	2025-06-17 13:07:45.967773	2025-06-17 13:21:21.842751	\N
460	k92jby89	client@afterfixapi.com.br	2025-06-17 13:35:56.889483	2025-06-17 13:35:56.889483	\N
461	0d81nasw	customer@afterfixapiv2.com.br	2025-06-17 13:39:46.111044	2025-06-17 13:39:46.111044	\N
462	q5i5g79g54l1nplw	merchant@thirdbusiness.com.br	2025-06-17 13:45:01.046896	2025-06-17 13:46:28.808029	\N
463	xg6x2knn	firstclient@ofthirdmerchant.com	2025-06-17 13:58:45.997509	2025-06-17 13:58:45.997509	\N
464	zmoco9vy	second@ofthirdmerchant.com	2025-06-17 14:02:44.571897	2025-06-17 14:02:44.571897	\N
465	sy24zzqe	client@merchant2.com	2025-06-17 14:05:19.741294	2025-06-17 14:05:19.741294	\N
466	f7pqfera	clientv4@merchant2.com	2025-06-17 14:06:10.929402	2025-06-17 14:06:10.929402	\N
467	7a8zl36j	clientv5@merchant2.com	2025-06-17 14:06:16.225365	2025-06-17 14:06:16.225365	\N
468	var59coc	clientv6@merchant2.com	2025-06-17 14:06:19.508804	2025-06-17 14:06:19.508804	\N
469	0qtqzktv	clientv007@merchant2.com	2025-06-17 14:06:23.685703	2025-06-17 14:07:02.575762	\N
470	23cpt0ys	clientv7@merchant2.com	2025-06-17 14:08:00.819977	2025-06-17 14:08:00.819977	\N
471	z6yqvr9wpnmm16re	thirdbusiness@staffsaas.com	2025-06-17 14:26:13.153485	2025-06-17 14:27:01.072176	\N
472	o2q6exo6	testclient@example.com	2025-06-17 14:30:37.058676	2025-06-17 14:30:37.058676	\N
473	5dp9v1dv	try@merchant.com.br	2025-06-17 14:35:40.818895	2025-06-17 14:35:40.818895	\N
474	3em0nx2j	trymerchat@id2.com.br	2025-06-17 14:38:09.010825	2025-06-17 14:38:09.010825	\N
475	u1n0m3ve	newclient@test.com	2025-06-18 02:27:30.635208	2025-06-18 02:27:30.635208	\N
476	wo9ztgiq	18062023_1@id2.com.br	2025-06-18 02:29:55.784241	2025-06-18 02:29:55.784241	\N
477	019ss5ec	18062023_2@id2.com.br	2025-06-18 02:30:04.173565	2025-06-18 02:30:04.173565	\N
478	ok5jm64c	18062023_3@id2.com.br	2025-06-18 02:30:13.803111	2025-06-18 02:30:13.803111	\N
479	4c2e3o6u	18062023_4@id2.com.br	2025-06-18 02:30:39.083499	2025-06-18 02:30:39.083499	\N
480	vrs5ibhw	18062023_5@id2.com.br	2025-06-18 02:30:46.249089	2025-06-18 02:30:46.249089	\N
481	hyqpeoes	18062023_6@id2.com.br	2025-06-18 02:30:49.906925	2025-06-18 02:30:49.906925	\N
482	k2i7linn	18062023_7@id2.com.br	2025-06-18 02:30:55.156802	2025-06-18 02:30:55.156802	\N
483	uh7220wi96fy7cya	tjfjejdjdtjej@gmail.com	2025-06-20 00:59:10.85081	2025-06-20 00:59:10.85081	\N
484	uljlan9ouf0wvyxu	clientevip@daempresa.com.br	2025-06-20 01:05:07.334021	2025-06-20 01:05:07.334021	\N
485	0tja8r4m	clientevip3@daempresa.com.br	2025-06-20 01:07:20.648324	2025-06-20 01:07:20.648324	\N
486	lp29yx0k	clientevip5@daempresa.com.br	2025-06-20 01:08:25.248442	2025-06-20 01:08:25.248442	\N
487	e6dbybic	clientevip7@daempresa.com.br	2025-06-20 01:08:58.08008	2025-06-20 01:08:58.08008	\N
\.


--
-- Data for Name: businesses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.businesses (id, name, description, address, phone, email, tax_id, created_at, updated_at, user_id) FROM stdin;
1	Barber Men's Shopping	Premium barbershop services	123 Main Street	5548995212541	contact@elitebarbershop.com	\N	2025-06-10 12:01:45.194071	2025-06-11 11:43:36.828794	1
17	Residencial Quinta do Cambirela	Condomínio Residencial Quinta do Cambirela	Rua José Onófre Pereira 1105	48910261680	condominio@cambirella.com.br	33240999000104	2025-06-17 02:56:39.282968	2025-06-17 13:02:01.239609	451
18	Third Business Food	Third Business Food	Rua Padova, 175	48993215165	contact@thirdbusiness.com.br	91604699100350	2025-06-17 13:46:15.43103	2025-06-17 13:46:15.43103	462
19	Second Business	Second Business	Second Business	48993165315	second@business.com.br	33240999000110	2025-06-18 20:59:05.569004	2025-06-18 20:59:05.569004	451
\.


--
-- Data for Name: accounting_transaction_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accounting_transaction_categories (id, description, business_id) FROM stdin;
11	Supply Costs	1
1	Services Revenue	1
2	Product Sales	1
5	Supply Costs	1
3	Consultation Fees	1
9	Professional Services	1
7	Rent & Facilities	1
10	Other Expenses	1
6	Utility Bills	1
4	Equipment Purchase	1
8	Marketing & Advertising	1
23	Supply Costs	17
22	Supply Costs	18
\.


--
-- Data for Name: accounting_transactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accounting_transactions (id, type, description, amount, payment_method, reference_number, transaction_date, notes, is_recurring, created_at, updated_at, client_id, staff_id, business_id, category_id) FROM stdin;
16	revenue	Haircut Service - Customer A	50.00	Cash	REV001	2025-06-18	\N	f	2025-06-18 02:11:05.038179	2025-06-18 02:11:05.038179	\N	\N	17	1
17	revenue	Beard Trim Service - Customer B	75.00	Card	REV002	2025-06-18	\N	f	2025-06-18 02:11:12.322987	2025-06-18 02:11:12.322987	\N	\N	17	1
18	revenue	Haircut Service - Yesterday	110.00	Cash	REV003	2025-06-17	\N	f	2025-06-18 02:11:19.021022	2025-06-18 02:11:19.021022	\N	\N	17	1
19	revenue	Yesterday Revenue	110.00	Cash	REV003	2025-06-17	\N	f	2025-06-18 02:11:32.192534	2025-06-18 02:11:32.192534	\N	\N	17	1
20	expense	Compra do monitor 32 polegadas Odyssey da Samsung	59.90	cash	MONITOR-SAMSUNG	2025-06-18	Additional Notes	t	2025-06-18 02:18:04.217091	2025-06-18 02:18:04.217091	472	469	17	23
21	expense	Compra do monitor 32 polegadas Odyssey da Samsung	69.90	cash	MONITOR-SAMSUNG	2025-06-18	Additional Notes	t	2025-06-18 02:18:14.887364	2025-06-18 02:18:14.887364	472	469	17	23
22	expense	Compra do monitor 32 polegadas Odyssey da Samsung	95.00	cash	MONITOR-SAMSUNG	2025-06-18	Additional Notes	t	2025-06-18 02:18:38.554046	2025-06-18 02:18:38.554046	472	469	17	23
23	revenue	Compra do monitor 32 polegadas Odyssey da Samsung	95.00	cash	MONITOR-SAMSUNG	2025-06-18	Additional Notes	t	2025-06-18 02:20:39.505186	2025-06-18 02:20:39.505186	472	469	17	23
24	revenue	Compra do monitor 32 polegadas Odyssey da Samsung	100.00	cash	MONITOR-SAMSUNG	2025-06-18	Additional Notes	t	2025-06-18 02:21:03.095626	2025-06-18 02:21:03.095626	472	469	17	23
14	expense	Compra do monitor 32 polegadas Odyssey da Samsung	2600.00	cash	MONITOR-SAMSUNG	2025-06-17	Additional Notes	t	2025-06-17 16:27:08.829429	2025-06-17 16:27:08.829429	472	469	17	23
15	expense	Compra do monitor 32 polegadas Odyssey da Samsung	2600.45	cash	MONITOR-SAMSUNG	2025-06-17	Additional Notes	t	2025-06-17 16:27:25.912038	2025-06-17 16:27:25.912038	472	469	17	23
\.


--
-- Data for Name: persons; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.persons (id, first_name, last_name, phone, tax_id, hire_date, salary, created_at, updated_at, deleted_at, user_id, address) FROM stdin;
1	Marcos Staff	Pereira	5548991893313	02039326170	2024-01-15	120000.00	2025-06-10 12:01:52.339372	2025-06-12 00:00:15.796553	\N	1	\N
461	Sirleii	Roberto	48991893313	91604699195	\N	\N	2025-06-17 02:57:55.112998	2025-06-17 02:57:55.112998	\N	449	Rua José Onofre Pereira
463	Merchant	Business	48963415341	91604699100355	2025-06-17	150000.00	2025-06-17 11:49:50.698206	2025-06-17 11:51:40.827045	\N	451	\N
464	Merchant	Client	48991893314	91604699156	2025-06-17	120000.00	2025-06-17 11:56:00.880338	2025-06-17 11:56:18.104164	\N	452	\N
465	Merchant	Staff	4891354515	02039326170	2025-06-17	100000.00	2025-06-17 11:57:26.697199	2025-06-17 11:57:26.697199	\N	453	\N
466	Staff	Barber I	4798525115	91604699170	2025-06-17	100000.00	2025-06-17 13:03:44.241033	2025-06-17 13:03:44.241033	\N	454	\N
467	Staff	Barber II	47982257522	02039326152	2025-06-17	100000.00	2025-06-17 13:04:37.547086	2025-06-17 13:04:37.547086	\N	455	\N
468	Staff	Barber Quinta	46454646876	02039326141	2025-06-17	80000.00	2025-06-17 13:06:43.980172	2025-06-17 13:06:43.980172	\N	456	\N
471	Staff	Barber Quinta 4	46454646876	02039326141	2025-06-17	90000.00	2025-06-17 13:20:31.891963	2025-06-17 13:20:31.891963	\N	459	\N
469	Staff	Barber Quinta 2v	46454646876	02039326141	2025-06-17	125000.00	2025-06-17 13:07:46.014026	2025-06-17 13:21:22.078991	\N	457	\N
472	Customer	After FIx API	48911651655	91604699193	\N	\N	2025-06-17 13:35:56.960296	2025-06-17 13:35:56.960296	\N	460	Rua Padova, 175
473	Customer	After Fix API v2	48991321533	91604699173	\N	\N	2025-06-17 13:39:46.155452	2025-06-17 13:39:46.155452	\N	461	Rua Padova, 175
474	Merchant	Third Business	48996540525	02039326133	2025-06-17	250000.00	2025-06-17 13:45:01.115167	2025-06-17 13:46:29.073516	\N	462	\N
475	First Client	Of Third Merchant	48993151651	91604699113	\N	\N	2025-06-17 13:58:46.063528	2025-06-17 14:00:23.663295	\N	463	Rua Padova, 175
476	Second Client	Of Third Merchant	489918952855	91604699189	\N	\N	2025-06-17 14:02:44.669664	2025-06-17 14:02:44.669664	\N	464	Rua Padova, 175
478	Customer	After Fix API v4	48991895375	02039326169	\N	\N	2025-06-17 14:06:10.97809	2025-06-17 14:06:10.97809	\N	466	Rua Padova, 175
480	Customer	After Fix API v4	48991895375	02039326169	\N	\N	2025-06-17 14:06:19.557986	2025-06-17 14:06:19.557986	\N	468	Rua Padova, 175
482	Customer	After Fix API v4	48991895375	02039326169	\N	\N	2025-06-17 14:08:00.868414	2025-06-17 14:08:00.868414	\N	470	Rua Padova, 175
483	Marcos Staff	Pereira	4891026168	91604699195	2025-06-17	100000.00	2025-06-17 14:26:13.214452	2025-06-17 14:27:01.321709	\N	471	\N
484	Test	Client	1234567890	\N	\N	\N	2025-06-17 14:30:37.179706	2025-06-17 14:30:37.179706	\N	472	\N
485	Try Client	From Third Merchant	48993216354	02039326182	\N	\N	2025-06-17 14:35:40.869329	2025-06-17 14:36:13.569485	\N	473	Rua Padova, 175
486	Try Merchant	Client ID 2025	48993216515	91604699100375	\N	\N	2025-06-17 14:38:09.060643	2025-06-17 16:16:14.811354	\N	474	Rua Padova, 175
487	New	Client Today	555-0123	\N	\N	\N	2025-06-18 02:27:30.700846	2025-06-18 02:27:30.700846	\N	475	Test Address
488	Try Merchant	Client ID 18062023 1	48993216515	91604699100375	\N	\N	2025-06-18 02:29:55.831074	2025-06-18 02:29:55.831074	\N	476	Rua Padova, 175
489	Try Merchant	Client ID 18062023 2	48993216515	91604699100375	\N	\N	2025-06-18 02:30:04.220223	2025-06-18 02:30:04.220223	\N	477	Rua Padova, 175
490	Try Merchant	Client ID 18062023 3	48993216515	91604699100375	\N	\N	2025-06-18 02:30:13.84937	2025-06-18 02:30:13.84937	\N	478	Rua Padova, 175
491	Try Merchant	Client ID 18062023 4	48993216515	91604699100375	\N	\N	2025-06-18 02:30:39.135403	2025-06-18 02:30:39.135403	\N	479	Rua Padova, 175
492	Try Merchant	Client ID 18062023 4	48993216515	91604699100375	\N	\N	2025-06-18 02:30:46.296695	2025-06-18 02:30:46.296695	\N	480	Rua Padova, 175
493	Try Merchant	Client ID 18062023 4	48993216515	91604699100375	\N	\N	2025-06-18 02:30:49.954318	2025-06-18 02:30:49.954318	\N	481	Rua Padova, 175
494	Try Merchant	Client ID 18062023 4	48993216515	91604699100375	\N	\N	2025-06-18 02:30:55.201946	2025-06-18 02:30:55.201946	\N	482	Rua Padova, 175
495	sdfgdsfgdsfgdfg	sdfgdsfgdsfg	48910261685	91604699176	2025-06-19	122000.00	2025-06-20 00:59:10.914262	2025-06-20 00:59:10.914262	\N	483	\N
496	Cliente VIP	da Empresa 1	48925161651	91604696545	2025-06-19	180000.00	2025-06-20 01:05:07.383415	2025-06-20 01:05:07.383415	\N	484	\N
497	Cliente VIP	da Empresa 1	48925161651	91604696545	\N	\N	2025-06-20 01:07:20.715251	2025-06-20 01:07:20.715251	\N	485	\N
498	Cliente VIP	da Empresa 1	48925161651	91604696545	\N	\N	2025-06-20 01:08:25.29395	2025-06-20 01:08:25.29395	\N	486	\N
499	Cliente VIP	da Empresa 1	48925161651	91604696545	\N	\N	2025-06-20 01:08:58.124998	2025-06-20 01:08:58.124998	\N	487	\N
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.services (id, name, description, duration, price, is_active, created_at, updated_at, business_id) FROM stdin;
189	Corte de cabelo	Corte de cabelo masculino	35	49.90	t	2025-06-17 14:15:53.254822	2025-06-17 14:15:53.254822	18
187	Corte de cabelo	Corte de cabelo masculino	35	49.90	t	2025-06-17 11:00:45.346249	2025-06-17 14:15:53.531668	1
190	TEST		30	90.00	t	2025-06-17 14:41:11.580545	2025-06-17 14:41:11.580545	18
192	Service 2		30	50.90	t	2025-06-17 14:49:45.925667	2025-06-17 14:49:45.925667	17
191	Service 1		30	97.90	t	2025-06-17 14:48:18.615425	2025-06-17 14:51:09.527852	18
188	Service 777		30	97.90	t	2025-06-17 12:01:05.997116	2025-06-17 16:16:59.795147	17
194	Service 8		30	49.90	t	2025-06-17 14:51:53.2488	2025-06-20 00:45:30.799222	19
195	Service 9		30	49.90	t	2025-06-17 14:52:33.601871	2025-06-20 00:45:30.801095	19
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.appointments (id, appointment_date, appointment_time, status, notes, created_at, updated_at, deleted_at, user_id, business_id, service_id, client_id) FROM stdin;
281	2025-06-17	09:00:00	Confirmed		2025-06-17 11:23:11.78189	2025-06-17 11:27:48.987168	\N	1	1	187	461
286	2025-06-17	13:00:00	Confirmed		2025-06-17 12:16:36.919352	2025-06-17 12:21:58.825245	\N	465	1	188	464
284	2025-06-17	12:00:00	Confirmed		2025-06-17 12:15:17.739069	2025-06-17 13:36:39.727972	\N	469	17	188	472
293	2025-06-17	18:00:00	Scheduled		2025-06-17 14:22:29.810037	2025-06-17 14:22:29.810037	\N	474	18	189	475
294	2025-06-17	20:00:00	Confirmed		2025-06-17 14:23:16.104757	2025-06-17 14:24:20.153906	\N	474	18	189	475
295	2025-06-17	10:00:00	Completed		2025-06-17 16:54:32.516257	2025-06-17 16:54:55.090892	\N	471	17	195	472
291	2025-07-18	12:30:00	Completed		2025-06-17 13:37:22.830868	2025-06-18 02:50:19.84814	\N	468	17	188	472
300	2025-06-17	21:00:00	Completed		2025-06-18 02:10:25.097057	2025-06-18 02:50:40.480203	\N	471	17	195	472
302	2025-06-17	10:00:00	Completed		2025-06-18 11:00:43.824381	2025-06-18 11:00:43.824381	\N	471	17	194	480
297	2025-06-18	18:00:00	Completed		2025-06-18 02:10:08.993382	2025-06-18 11:03:06.534693	\N	469	17	195	482
301	2025-06-18	18:00:00	Completed		2025-06-18 02:50:02.708405	2025-06-18 11:03:19.480465	\N	471	17	195	480
296	2025-06-18	17:00:00	Completed		2025-06-18 02:10:05.07327	2025-06-18 11:03:33.953811	\N	468	17	195	482
298	2025-06-18	19:00:00	Completed		2025-06-18 02:10:12.340765	2025-06-18 11:03:48.719621	\N	471	17	188	478
299	2025-06-18	20:00:00	Completed		2025-06-18 02:10:18.665586	2025-06-18 11:04:00.619338	\N	468	17	188	482
303	2025-06-17	21:00:00	Completed		2025-06-18 11:10:34.835975	2025-06-18 11:10:34.835975	\N	474	17	189	475
304	2025-06-17	22:00:00	Completed		2025-06-18 11:10:37.245046	2025-06-18 11:10:37.245046	\N	474	17	189	475
305	2025-06-17	23:00:00	Completed		2025-06-18 11:10:40.966435	2025-06-18 11:10:40.966435	\N	474	17	189	475
306	2025-06-17	23:30:00	Completed		2025-06-18 11:10:43.595865	2025-06-20 00:44:36.198775	\N	474	19	189	475
307	2025-06-17	23:30:00	Completed		2025-06-20 01:00:33.217741	2025-06-20 01:00:33.217741	\N	474	19	189	475
308	2025-06-17	23:30:00	Completed		2025-06-20 01:01:32.28089	2025-06-20 01:01:32.28089	\N	474	19	189	475
\.


--
-- Data for Name: barber_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.barber_plans (id, title, subtitle, benefits, image1, image2, price1m, price3m, price12m, payment_link, created_at, updated_at, business_id) FROM stdin;
1	Basic Plan	Perfect for starting barbershops	{"Up to 50 appointments per month","Basic appointment scheduling","Client contact management","Email notifications","Mobile-friendly interface","Basic reporting dashboard"}	\N	\N	5790.00	14370.00	45480.00	https://mpago.li/1djgXG4	2025-06-11 11:43:41.306837	2025-06-11 12:38:58.776486	1
3	Gold Plan	Premium solution for established shops	{"Unlimited appointments","Multi-location management","Advanced payment integration","Custom branding and themes","Priority customer support","Advanced inventory tracking"}	\N	\N	9990.00	20370.00	69480.00	https://mpago.li/1djgXG4	2025-06-11 11:43:41.306837	2025-06-11 12:38:58.785806	1
2	Silver Plan	Ideal for growing businesses	{"Up to 200 appointments per month","Advanced scheduling with time slots","SMS and WhatsApp notifications","Multi-staff management","Detailed analytics and reports","Custom service catalog"}	\N	\N	5990.00	17370.00	57480.00	https://mpago.li/1djgXG4	2025-06-11 11:43:41.306837	2025-06-11 12:38:59.463559	1
4	New Style	Barber New Style 2026	{"Benefit 1","Benefit 2","Benefit 3","Benefit 4","Benefit 5"}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	99.90	199.90	499.90	https://pagbank.com.br	2025-06-17 15:13:39.506389	2025-06-17 15:13:39.506389	18
5	Stylist 2026	Best Cut of 2026	{"Benefit 1","Benefit 2","Benefit 3","Benefit 4","Benefit 5"}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	99.90	299.90	499.90	https://pagbank.com.br	2025-06-17 15:21:22.644784	2025-06-17 15:21:22.644784	17
6	Premium Style	Best Cut Premium 2026	{"Premium Benefit 1","Premium Benefit 2"}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	99.90	299.90	499.90	https://pagbank.com.br	2025-06-17 15:27:49.145902	2025-06-17 15:27:49.145902	17
7	Deluxe Style	Deluxe Cut 2026	{"Deluxe Benefit 1","Deluxe Benefit 2"}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	149.90	399.90	699.90	https://pagbank.com.br	2025-06-17 15:28:01.817074	2025-06-17 15:28:01.817074	17
8	Plan Barber Plan	Plan Barber Plan Subtitle	{"Benefit 1","Benefit 2","Benefit 3","Benefit 4","Benefit 5"}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	99.00	199.00	299.00	https://pagbank.com.br	2025-06-17 15:46:00.614989	2025-06-17 15:46:00.614989	17
9	dsfgdsfg	dsfgdsfgdfg	{gfjgf,gfjgf,fgjgffgfgj,fgjgfh}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	99.00	999.00	9999.00	https://pagbank.com.br	2025-06-17 15:52:24.377965	2025-06-17 15:52:24.377965	17
10	Debug Test	Testing business ID parsing	{test}	\N	\N	99.00	999.00	9999.00	\N	2025-06-17 15:56:18.558311	2025-06-17 15:56:18.558311	17
11	dsfgdsfg	dsfgdsfgdfg	{gfjgf,gfjgf,fgjgffgfgj,fgjgfh}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	99.00	999.00	9999.00	https://pagbank.com.br	2025-06-17 15:56:42.539658	2025-06-17 15:56:42.539658	17
12	dsfgdsfg	dsfgdsfgdfg	{gfjgf,gfjgf,fgjgffgfgj,fgjgfh}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	99.90	999.00	9999.00	https://pagbank.com.br	2025-06-17 15:56:52.479813	2025-06-17 15:56:52.479813	17
13	dsfgdsfg	dsfgdsfgdfg	{gfjgf,gfjgf,fgjgffgfgj,fgjgfh}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	99.90	999.90	9999.90	https://pagbank.com.br	2025-06-17 15:57:11.087811	2025-06-17 15:57:11.087811	17
15	dsfgdsfg	dsfgdsfgdfg	{gfjgf,gfjgf,fgjgffgfgj,fgjgfh}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	99.90	999.90	9999.90	https://pagbank.com.br	2025-06-17 16:12:16.17001	2025-06-17 16:12:16.17001	17
14	Modal Styled Cut Hair	Styled Cut Hair 2026	{"Benefit 1","Benefit 2","Benefit 3"}	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	https://img001.prntscr.com/file/img001/HeHaNvqcTy2uazus5DW5EA.png	125.00	1230.00	12340.00	https://pagbank.com.br	2025-06-17 15:58:03.268189	2025-06-17 16:15:49.52778	17
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.faqs (id, question, answer, category, is_published, order_index, created_at, updated_at) FROM stdin;
4	Do I need to install anything to use a SaaS product?	No. SaaS products are web-based, so you can use them directly in your browser without any downloads or installations.	General	t	0	2025-06-18 11:17:29.787118	2025-06-18 11:17:29.787118
5	Is my data safe with a SaaS provider?	Reputable SaaS providers use industry-standard security practices, including encryption, regular backups, and secure data centers. Always choose providers that are transparent about their security protocols and compliance certifications.	General	t	0	2025-06-18 11:17:46.579864	2025-06-18 11:17:46.579864
6	Can I access the SaaS platform from any device?	Yes. Most SaaS platforms are responsive and accessible via desktop, tablet, and smartphone as long as you have an internet connection.	General	t	0	2025-06-18 11:18:02.430688	2025-06-18 11:18:02.430688
7	What happens to my data if I cancel my subscription?	Most providers allow you to export your data before canceling. Some may store it for a limited time in case you return. Always review the data retention and export policy before subscribing.	General	t	0	2025-06-18 11:18:21.02216	2025-06-18 11:18:21.02216
8	How often are updates or new features released?	Updates are typically rolled out automatically by the provider. Frequency depends on the company, but most SaaS platforms update frequently without user intervention.	General	t	0	2025-06-18 11:18:35.436841	2025-06-18 11:18:35.436841
9	Is SaaS cost-effective for small businesses?	Absolutely. SaaS reduces the need for in-house IT infrastructure, minimizes upfront costs, and provides scalable plans tailored to small business needs.	General	t	0	2025-06-18 11:24:03.494306	2025-06-18 11:24:03.494306
10	Can I customize a SaaS product to fit my business needs?	Many SaaS platforms offer customization through settings, modules, and integrations. Some also support API access for more advanced customizations.	General	t	0	2025-06-18 11:24:19.847783	2025-06-18 11:24:19.847783
11	What if I need help or run into a problem?	Most SaaS providers offer customer support via chat, email, or phone. Some also provide help centers, tutorials, and community forums for self-service support.	General	t	0	2025-06-18 11:24:35.108592	2025-06-18 11:24:35.108592
12	How can I test the FAQ system? (Updated)	You can test the FAQ system by using the API endpoints with proper JWT authentication. Super Admin users (Role ID 1) can create, update, and delete FAQs, while all other authenticated users can only view them.	Testing & Security	t	1	2025-06-18 11:35:37.729599	2025-06-18 11:36:18.544535
2	What is SaaS? (Software as a Service)	SaaS stands for Software as a Service. It is a cloud-based solution where software is accessed via the internet instead of being installed locally. Users pay a subscription to use the software, which is hosted and maintained by the provider. This model offers benefits like automatic updates, scalability, and reduced IT overhead.	General	t	1	2025-06-18 11:16:56.065893	2025-06-18 11:45:02.67211
3	How is SaaS different from traditional software?	Unlike traditional software that requires installation, SaaS applications run in the cloud and are accessed through a web browser. This means no setup, lower upfront costs, automatic updates, and access from any device with internet.	General	t	0	2025-06-18 11:17:12.858671	2025-06-18 12:09:24.904389
\.


--
-- Data for Name: payment_gateway_types; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payment_gateway_types (id, description) FROM stdin;
1	PIX
2	Credit Card
3	PayPal
4	Stripe
5	PagSeguro
6	Mercado Pago
\.


--
-- Data for Name: payment_gateways; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payment_gateways (id, name, api_url, api_key, token, email, is_active, created_at, updated_at, business_id, type_id, type, staff_id) FROM stdin;
1	Mercado Pago	https://api.mercadopago.com	b3f6e84c-1fd9-4fd1-9eaa-9ab9d3bced54	2d07351b-ad6f-4271-90f0-b8c4f36a796d	mvnpereira@gmail.com	t	2025-06-12 11:53:47.221791	2025-06-19 22:25:06.484718	\N	\N	Mercado Pago	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (id, type, description) FROM stdin;
1	super-admin	Super Admin
4	client	Customer
3	employee	Employee
2	merchant	Merchant
5	financials	Financials
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.settings (id, language, timezone, currency, created_at, updated_at, business_id) FROM stdin;
1	pt	America/Sao_Paulo	BRL	2025-06-18 12:32:24.04	2025-06-19 22:08:40.711	17
4	pt	UTC	USD	2025-06-19 21:05:21.340051	2025-06-20 10:57:41.11	18
3	en	UTC	USD	2025-06-18 21:05:13.429169	2025-06-20 11:11:50.64	19
2	pt	UTC	USD	2025-06-18 13:08:27.521689	2025-06-20 11:32:13.362	1
\.


--
-- Data for Name: support_ticket_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.support_ticket_categories (id, title, description) FROM stdin;
1	Technical	Technical support issues
2	Billing	Billing and payment related issues
3	General	General inquiries
4	Feature Request	New feature requests
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.support_tickets (id, title, description, priority, status, category, client_email, client_name, resolution_notes, created_at, updated_at, resolved_at, deleted_at, assigned_user_id, ticket_open_user_id, business_id) FROM stdin;
\.


--
-- Data for Name: traductions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.traductions (id, string, created_at, updated_at) FROM stdin;
28	123 Business Avenue, Suite 500, New York, NY 10001	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
29	12 Month Price (cents)	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
30	12 Months	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
31	+1 (555) 123-4567	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
32	1M+	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
33	1 Month	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
34	1 Month Price (cents)	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
35	© 2025 BarberPro. All rights reserved.	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
36	3 Month Price (cents)	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
37	3 Months	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
38	404 Page Not Found	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
39	5K+	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
40	About	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
41	About BarberPro	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
42	About Us	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
43	Accounting Transactions	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
44	Account Issue	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
45	Actions	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
46	Active Barbershops	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
47	Add Benefit	2025-06-19 16:42:37.785862	2025-06-19 16:42:37.785862
48	Add Business	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
49	Add Client	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
50	Add First Client	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
51	Add First Staff Member	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
52	Add First Transaction	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
53	Add New Staff Member	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
54	Add Payment Gateway	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
55	Address	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
56	Address:	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
57	Add Revenue or Expense	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
58	Add Staff Member	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
59	Add Transaction	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
60	All Categories	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
61	All Priorities	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
62	All Status	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
63	All Statuses	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
64	Amount	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
65	Amount *	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
66	Analytics & Reports	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
67	annually	2025-06-19 16:42:47.018078	2025-06-19 16:42:47.018078
68	Annual Salary (USD) *	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
69	Answer *	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
70	Answers:	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
71	API Documentation	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
72	API Key	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
73	API URL	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
74	Appointment Date	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
75	Appointment deleted successfully	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
76	Appointment Information	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
77	appointments	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
78	Appointments	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
79	Appointments Booked	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
80	Appointment Time	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
81	Are you sure you want to delete this appointment? This action cannot be undone.	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
82	Are you sure you want to delete this barber plan? This action cannot be undone.	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
83	Are you sure you want to delete this payment gateway? This action cannot be undone.	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
84	Are you sure you want to delete this service? This action cannot be undone.	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
85	Are you sure you want to sign out of your account?	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
86	Asaas	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
87	Assigned Staff	2025-06-19 16:42:53.876557	2025-06-19 16:42:53.876557
88	Attached Files:	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
89	Attachments	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
90	Attachments (Optional)	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
91	Automated appointment booking with real-time availability and conflict prevention	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
92	Available 24/7	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
93	Average Response	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
94	Back to Appointments	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
95	Back to Businesses	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
96	Back to Clients	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
97	Back to FAQs	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
98	Back to Payment Gateways	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
99	Back to Plans	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
100	Back to Services	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
101	Back to Staff	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
102	Back to Support Tickets	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
103	Back to Transactions	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
104	Back to WhatsApp Instances	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
105	BarberPro	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
106	Before submitting:	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
107	Billing Question	2025-06-19 16:42:59.173274	2025-06-19 16:42:59.173274
108	Browse and export database tables	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
109	Bug Report	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
110	Business *	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
111	Business Currency	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
112	Business Hours	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
113	Business Information	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
114	Business is required	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
115	Business Name *	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
116	Business owner - can manage their business data	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
117	Business Timezone	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
118	call our emergency line available 24/7.	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
119	Cancel	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
120	Can I cancel my subscription anytime?	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
121	Can I export my appointment data?	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
122	Careers	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
123	Categories	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
124	Categories:	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
125	Category	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
126	Category *	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
127	Category:	2025-06-19 16:43:04.493402	2025-06-19 16:43:04.493402
128	• Check our FAQ section for common issues	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
129	Choose Your Plan	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
130	Clear Filters	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
131	Click on "Forgot Password" on the login page and follow the instructions sent to your email.	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
132	Client	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
133	Client Email *	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
134	Client Information	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
135	Client Management	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
136	Client Name *	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
137	Client Not Found	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
138	Clients	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
139	Closed	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
140	Collaborator	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
141	Community	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
142	Community Forum	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
143	Company	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
144	Complaint	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
145	Comprehensive client profiles with visit history and preferences tracking	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
146	comunidade@barberpro.com	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
147	Connect	2025-06-19 16:43:10.279122	2025-06-19 16:43:10.279122
148	Connected	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
149	Connecting	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
150	Connection Status	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
151	Contact	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
152	Contact Us	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
153	Contact your administrator	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
154	Continue with Selected Business	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
155	Cookies	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
156	Create a new frequently asked question	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
157	Create a new WhatsApp business instance	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
158	Created:	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
159	Create Gateway	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
160	Create Instance	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
161	Create New Appointment	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
162	Create New Plan	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
163	Create New Service	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
164	Create Service	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
165	Create Ticket	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
166	Credentials copied	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
167	Current User	2025-06-19 16:43:19.982128	2025-06-19 16:43:19.982128
168	Edit	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
169	Edit Appointment	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
170	Edit Business	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
171	Edit Client	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
172	Edit FAQ	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
173	Edit Gateway	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
174	Edit Instance	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
175	Edit Plan	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
176	Edit Service	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
177	Edit Staff Member	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
178	Edit Support Ticket	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
179	Edit Transaction	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
180	Email	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
181	Email *	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
182	Employee	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
183	Error	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
184	Expense	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
185	Expenses	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
186	Expense Description	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
187	FAQ	2025-06-19 16:43:30.269085	2025-06-19 16:43:30.269085
188	FAQs	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
189	Features	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
190	First Name *	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
191	Full system access - can see all businesses and data	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
192	Gateway Type	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
193	Get Started	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
194	High	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
195	Home	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
196	Hours	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
197	How do I reset my password?	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
198	ID	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
199	In Progress	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
200	Is my data secure?	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
201	Landing Page	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
202	Language	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
203	Last Name *	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
204	Last seen:	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
205	Learn More	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
206	Loading...	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
207	Login	2025-06-19 16:43:35.474294	2025-06-19 16:43:35.474294
208	Logout	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
209	Low	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
210	Manage FAQs	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
211	Manage payment gateway integrations	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
212	Manage your WhatsApp business instances	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
213	Medium	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
214	Merchant	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
215	Message	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
216	monthly	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
217	Name	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
218	Name *	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
219	New Appointment	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
220	New Service	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
221	No	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
222	No appointments found	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
223	No clients found	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
224	No FAQs found	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
225	No payment gateways found	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
226	No services found	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
227	No staff members found	2025-06-19 16:43:40.348996	2025-06-19 16:43:40.348996
228	No support tickets found	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
229	No transactions found	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
230	No WhatsApp instances found	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
231	Open	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
232	Password	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
233	Payment Gateways	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
234	Phone	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
235	Phone *	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
236	Plans	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
237	Price	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
238	Price *	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
239	Priority	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
240	Priority *	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
241	Question *	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
242	Recent Appointments	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
243	Resolved	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
244	Revenue	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
245	Role	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
246	Save	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
247	Search	2025-06-19 16:44:08.060843	2025-06-19 16:44:08.060843
248	Select Business	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
249	Select Your Active Business	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
250	Service	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
251	Service Name *	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
252	Services	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
253	Services Completed	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
254	Settings	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
255	Sign Out	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
256	Staff	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
257	Staff member - limited access to business operations	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
258	Status	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
259	Status *	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
260	Support	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
261	Support Tickets	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
340	Business Address	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
262	System user with specific permissions	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
263	Tax ID	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
264	Ticket Information	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
265	Time	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
266	Title	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
267	Title *	2025-06-19 16:44:13.186102	2025-06-19 16:44:13.186102
268	Today's Appointments	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
269	Today's Schedule	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
270	Token	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
271	Total Clients	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
272	Total Expenses	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
273	Total Instances	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
274	Total Revenue	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
275	Total Tickets	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
276	Total Transactions	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
277	Type	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
278	Type *	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
279	Update	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
280	Update Instance	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
281	Update Service	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
282	Update Ticket	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
283	Urgent	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
284	View All	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
285	Welcome back! Here's what's happening at your barbershop today.	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
286	WhatsApp Instances	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
287	Yes	2025-06-19 16:44:18.351094	2025-06-19 16:44:18.351094
288	Barber Plans	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
289	Quick Actions	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
290	You have access to multiple businesses. Please select one to continue.	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
291	Businesses	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
292	Create New FAQ	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
293	Create New Support Ticket	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
294	Saving...	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
295	Business Language	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
296	Gateway deleted successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
297	Service deleted successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
298	WhatsApp instance deleted successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
299	Support ticket created successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
300	FAQ created successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
301	Transaction created successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
302	Client created successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
303	Staff member created successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
304	Business created successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
305	Service created successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
306	Payment gateway created successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
307	Appointment created successfully	2025-06-19 16:44:23.826585	2025-06-19 16:44:23.826585
308	Transaction Date *	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
309	Transaction Details	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
310	Updated:	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
311	Upload Files	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
312	Use a QR code scanner or WhatsApp's "Link Device" feature	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
313	Webhook URL	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
314	Welcome to BarberPro	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
315	Welcome to BarberPro Dashboard	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
316	What payment methods do you accept?	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
317	We accept all major credit cards, PayPal, and bank transfers for subscription payments.	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
318	Yes, we use enterprise-grade encryption and security measures to protect your business data.	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
319	Yes, you can cancel your subscription at any time from your account settings.	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
320	Yes, you can export your data from the Reports section in CSV or PDF format.	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
321	You have been signed out of your account	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
322	QR Code Ready	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
323	Scan the QR code with WhatsApp	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
324	Instance Name *	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
325	WhatsApp instance has been successfully connected.	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
326	Connection Details	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
327	Active	2025-06-19 16:44:37.38423	2025-06-19 16:44:37.38423
328	Inactive	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
329	Gateway Configuration	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
330	Business Plan Information	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
331	Plan Name *	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
332	Monthly Price *	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
333	Benefits	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
334	Benefit Description	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
335	Add New Business	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
336	Edit Business Information	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
337	Business Description	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
338	Business Phone	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
339	Business Email	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
538	Reload	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
341	Operating Hours	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
342	Monday	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
343	Tuesday	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
344	Wednesday	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
345	Thursday	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
346	Friday	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
347	Saturday	2025-06-19 16:44:41.912571	2025-06-19 16:44:41.912571
348	Sunday	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
350	Open 24/7	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
351	Staff Management	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
352	Position	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
353	Position *	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
354	Salary	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
355	Hire Date	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
356	Performance Rating	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
357	Excellent	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
358	Good	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
359	Average	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
360	Poor	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
361	Pending	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
362	Confirmed	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
363	Cancelled	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
364	Completed	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
365	No Show	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
366	Appointment Status	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
367	Client Details	2025-06-19 16:44:46.744391	2025-06-19 16:44:46.744391
368	Service Information	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
369	Service Duration	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
370	Service Price	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
371	Service Category	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
372	Haircut	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
373	Beard Trim	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
374	Hair Wash	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
375	Styling	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
376	Special Services	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
377	Package Deal	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
378	Appointment Notes	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
379	Client Preferences	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
380	Payment Method	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
381	Cash	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
382	Credit Card	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
383	Debit Card	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
384	Digital Payment	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
385	Transaction Type	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
386	Income	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
387	Other	2025-06-19 16:44:51.319785	2025-06-19 16:44:51.319785
388	Success	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
389	Failed	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
390	Try Again	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
391	Operation completed successfully	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
392	Operation failed	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
393	Invalid input	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
394	Required field	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
395	Email is required	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
396	Phone is required	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
397	Name is required	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
398	Price is required	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
399	Duration is required	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
400	Date is required	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
401	Time is required	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
402	Service is required	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
403	Client is required	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
404	Staff is required	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
405	Invalid email format	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
406	Invalid phone format	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
407	Invalid date format	2025-06-19 16:44:55.788139	2025-06-19 16:44:55.788139
408	Advanced	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
409	Basic	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
410	Premium	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
411	Professional	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
412	Enterprise	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
413	Starter	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
414	Popular	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
415	Recommended	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
416	Best Value	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
417	Most Popular	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
418	Contact Sales	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
419	Free Trial	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
420	14 Days Free	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
421	30 Days Free	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
422	No Credit Card Required	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
423	Cancel Anytime	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
424	Upgrade	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
425	Downgrade	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
426	Change Plan	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
427	Current Plan	2025-06-19 16:45:20.409676	2025-06-19 16:45:20.409676
428	Unlimited Appointments	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
429	Unlimited Clients	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
430	Unlimited Services	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
431	24/7 Support	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
432	Priority Support	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
433	Email Support	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
434	Phone Support	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
435	Live Chat	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
436	Online Booking	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
437	Mobile App	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
438	SMS Notifications	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
439	Email Notifications	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
539	Retry	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
440	Calendar Integration	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
441	Payment Processing	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
442	Inventory Management	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
443	Staff Scheduling	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
444	Client Profiles	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
445	Service History	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
446	Analytics Dashboard	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
447	Custom Reports	2025-06-19 16:45:25.30059	2025-06-19 16:45:25.30059
448	Data Export	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
449	Data Import	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
450	Backup & Restore	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
451	Multi-Location	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
452	Team Management	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
453	Role-Based Access	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
454	Security Features	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
455	Two-Factor Authentication	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
456	SSL Encryption	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
457	GDPR Compliant	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
458	API Access	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
459	Third-Party Integrations	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
460	Custom Branding	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
461	White Label	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
462	Training Included	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
463	Setup Assistance	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
464	Data Migration	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
465	Onboarding Support	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
466	Video Tutorials	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
467	Knowledge Base	2025-06-19 16:45:30.295964	2025-06-19 16:45:30.295964
468	Documentation	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
469	User Guide	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
470	Getting Started	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
471	Quick Start	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
472	Setup Guide	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
473	Tutorial	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
474	Walkthrough	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
475	Demo	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
476	Preview	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
477	Overview	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
478	Summary	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
479	Details	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
480	Information	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
481	Configuration	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
482	Preferences	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
483	Options	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
484	Advanced Settings	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
485	General Settings	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
486	Account Settings	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
487	Profile Settings	2025-06-19 16:45:34.843052	2025-06-19 16:45:34.843052
488	Privacy Settings	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
489	Security Settings	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
490	Notification Settings	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
491	Display Settings	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
492	Language Settings	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
493	Timezone Settings	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
494	Currency Settings	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
495	Import/Export	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
496	System Status	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
497	Health Check	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
498	Performance	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
499	Maintenance	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
500	Updates Available	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
501	System Update	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
502	Restart Required	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
503	Scheduled Maintenance	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
504	Service Unavailable	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
505	Connection Lost	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
506	Reconnecting	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
507	Online	2025-06-19 16:45:39.362319	2025-06-19 16:45:39.362319
508	Offline	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
509	Synchronized	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
510	Synchronizing	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
511	Last Sync	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
512	Auto-Save	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
513	Manual Save	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
514	Draft Saved	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
515	Changes Saved	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
516	Unsaved Changes	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
517	Discard Changes	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
518	Keep Editing	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
519	Exit Without Saving	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
520	Save and Exit	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
521	Continue	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
522	Previous	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
523	Next	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
524	First	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
525	Last	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
526	Page	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
527	Items per page	2025-06-19 16:45:43.860877	2025-06-19 16:45:43.860877
528	Show more	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
529	Show less	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
530	Expand all	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
531	Collapse all	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
532	Select all	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
533	Deselect all	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
534	Clear selection	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
535	Apply	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
536	Reset	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
537	Refresh	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
540	Undo	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
541	Redo	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
542	Copy	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
543	Paste	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
544	Cut	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
545	Duplicate	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
546	Move	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
547	Archive	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
548	Restore	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
549	Export	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
550	Import	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
551	Download	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
552	Upload	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
553	Share	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
554	Print	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
555	Send	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
556	Receive	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
557	Submit	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
558	Process	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
559	Complete	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
560	Finish	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
561	Start	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
562	Stop	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
563	Pause	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
564	Resume	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
565	Play	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
566	Record	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
567	Capture	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
568	Scan	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
569	Generate	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
570	Create	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
571	Build	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
572	Deploy	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
573	Publish	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
574	Unpublish	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
575	Enable	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
576	Disable	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
577	Activate	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
578	Deactivate	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
579	Lock	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
580	Unlock	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
581	Approve	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
582	Reject	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
583	Accept	2025-06-19 16:45:59.107131	2025-06-19 16:45:59.107131
584	Scheduled	2025-06-19 16:55:56.202044	2025-06-19 16:55:56.202044
585	End Date	2025-06-19 16:55:56.202044	2025-06-19 16:55:56.202044
586	Filters	2025-06-19 16:55:56.202044	2025-06-19 16:55:56.202044
588	Quick Filters	2025-06-19 16:55:56.202044	2025-06-19 16:55:56.202044
589	Start Date	2025-06-19 16:55:56.202044	2025-06-19 16:55:56.202044
590	Manage customer appointments	2025-06-19 16:55:56.202044	2025-06-19 16:55:56.202044
591	Showing	2025-06-19 16:55:56.202044	2025-06-19 16:55:56.202044
592	of	2025-06-19 16:55:56.202044	2025-06-19 16:55:56.202044
595	No appointments found matching your criteria	2025-06-19 16:55:56.202044	2025-06-19 16:55:56.202044
596	Translation Management	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
597	Manage translations for different languages	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
598	Language Selection	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
599	Select a language to translate	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
600	Translating to	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
601	Translations	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
602	strings	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
603	Press Enter to save a translation	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
604	English (Source)	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
605	Translation	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
606	Enter translation...	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
607	No Language Selected	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
608	Please select a language above to start managing translations	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
609	Translation saved	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
610	The translation has been updated successfully	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
611	Error saving translation	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
612	Failed to save translation	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
613	Traductions	2025-06-19 17:29:59.190178	2025-06-19 17:29:59.190178
614	Add New English String	2025-06-19 18:17:56.106531	2025-06-19 18:17:56.106531
615	Enter a new English string to add to the translation database. Press Enter to save.	2025-06-19 18:17:56.106531	2025-06-19 18:17:56.106531
616	Adding...	2025-06-19 18:17:56.106531	2025-06-19 18:17:56.106531
617	Dashboard	2025-06-19 18:18:36.259279	2025-06-19 18:18:36.259279
636	Accounting	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
677	Are you sure you want to delete	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
705	Billed	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
715	Business Management	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
720	Canceled	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
770	Customer	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
771	Customers	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
773	Daily	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
774	Database Viewer	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
775	Date	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
776	Date:	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
777	Delete	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
778	Delete FAQ	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
779	Delete Gateway	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
780	Delete Instance	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
781	Delete Plan	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
782	Delete Service	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
783	Delete Staff Member	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
784	Delete Ticket	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
785	Department	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
786	Department *	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
787	Description	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
788	Description *	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
789	Description:	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
791	Disconnected	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
792	Display Language	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
793	documentation	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
794	Duration (minutes) *	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
806	Edition Mode	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
809	Email:	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
813	Enter Portuguese translation...	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
814	Events	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
815	Experience modern barbershop management with BarberPro	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
818	Feature Request	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
819	Files	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
820	Filter by Business	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
821	Filter by Category	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
822	Filter by Client	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
823	Filter by Priority	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
824	Filter by Service	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
825	Filter by Staff	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
826	Filter by Status	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
827	Filter by Type	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
828	Find answers to common questions	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
829	Frequently Asked Questions	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
833	How can I reset my password?	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
834	How do I add staff members?	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
835	How do I book appointments?	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
836	How secure is my data?	2025-06-19 18:57:52.761422	2025-06-19 18:57:52.761422
837	If urgency is HIGH and it's outside business hours,	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
839	Installation Guide	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
841	Is your data secure?	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
842	Key Features	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
846	Legal	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
847	Live Demo	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
848	Loading appointments...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
849	Loading businesses...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
850	Loading clients...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
851	Loading staff...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
855	Manage all your business locations from one dashboard	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
856	Manage business information and users	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
857	Manage client information and appointments	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
858	Manage FAQs and help documentation	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
859	Manage payment processing settings	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
860	Manage revenues and expenses	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
861	Manage service offerings and pricing	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
862	Manage staff schedules and roles	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
863	Manage subscription plans and billing	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
864	Manage support tickets and customer inquiries	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
866	Manage WhatsApp integrations and messaging	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
867	Management	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
870	Message *	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
871	Message:	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
872	Monthly	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
875	Name:	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
876	Net Income	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
877	New	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
879	New Business	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
880	New Client	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
881	New FAQ	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
882	New Gateway	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
883	New Instance	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
884	New Plan	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
886	New Staff Member	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
887	New Ticket	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
888	New Transaction	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
890	No businesses found	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
893	No gateways found	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
894	No instances found	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
896	No plans found	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
897	No results found	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
899	No staff found	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
900	No tickets found	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
902	Not Found	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
903	Notes	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
904	Notes (Optional)	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
905	Notes:	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
910	Password *	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
915	Phone:	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
916	Please provide as much detail as possible	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
917	Please select a business above to start managing translations	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
923	Price ($) *	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
926	Priority:	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
927	Privacy	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
928	Privacy Policy	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
929	Product	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
930	QR Code	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
931	Question	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
933	Question:	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
935	Ready to Transform Your Barbershop?	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
936	Recent Transactions	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
937	Resources	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
938	Response	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
941	Role *	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
944	Save Settings	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
945	Scan the QR code below with your phone to connect WhatsApp:	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
947	Search appointments...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
948	Search businesses...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
949	Search clients...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
950	Search FAQs...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
951	Search gateways...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
952	Search instances...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
953	Search plans...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
954	Search services...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
955	Search staff...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
956	Search tickets...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
957	Search transactions...	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
959	Select Client	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
960	Select Service	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
961	Select Staff	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
964	Service Management	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
969	Show Password	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
970	Sign In to Your Account	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
974	Staff Member	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
975	Staff Member Information	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
976	Staff Member Name *	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
977	Standard	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
978	Start Free Trial	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
979	Started	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
982	Status:	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
984	Subject	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
985	Subject *	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
986	Subject:	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
988	Submit Ticket	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
991	Technical Issue	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
992	Terms	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
993	Terms of Service	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
995	Time:	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
998	Today's Revenue	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
1002	Total Services	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
1003	Total Staff	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
1013	Try adjusting your search or filters	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
1016	Unknown	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
1017	Unknown Staff	2025-06-19 18:58:12.129419	2025-06-19 18:58:12.129419
1019	Update FAQ details	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1020	Update Gateway	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1022	Update instance details	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1024	Update staff member information	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1028	Urgent - System down	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1030	Use draft status to prepare FAQs before making them visible to customers.	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1031	vendas@barberia.com.br	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1034	View Ticket	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1035	Watch Demo	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1037	Webhook:	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1041	We'll get back to you within 24 hours based on your urgency level.	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1042	We're preparing amazing subscription options for your barbershop.	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1043	We understand the unique challenges of running a modern barbershop. That's why we created BarberPro - a comprehensive management platform designed specifically for barbershop owners who want to focus on their craft while growing their business.	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1047	With over 5 years of experience in the industry, we've helped thousands of barbershops streamline their operations, increase revenue, and provide exceptional customer service.	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1048	Write questions from the customer's perspective. Use clear, simple language.	2025-06-19 18:58:25.232438	2025-06-19 18:58:25.232438
1054	Rows per page	2025-06-19 19:06:30.392592	2025-06-19 19:06:30.392592
1056	to	2025-06-19 19:06:30.392592	2025-06-19 19:06:30.392592
1058	entries	2025-06-19 19:06:30.392592	2025-06-19 19:06:30.392592
1061	Business Settings	2025-06-19 19:16:00.093892	2025-06-19 19:16:00.093892
1066	Manage your business locations and details	2025-06-19 19:30:56.286512	2025-06-19 19:30:56.286512
1067	Manage your barbershop team members	2025-06-19 19:32:17.418844	2025-06-19 19:32:17.418844
1068	Manage your barbershop clients	2025-06-19 19:32:50.556805	2025-06-19 19:32:50.556805
1070	Settings updated	2025-06-19 21:15:17.708845	2025-06-19 21:15:17.708845
1071	Add a new payment processing system	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1072	Add a new service to your barbershop	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1073	Appointment date is required	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1074	Appointment time is required	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1075	Appointment updated successfully	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1076	Are you sure you want to delete this business?	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1077	Barber plan created successfully	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1078	Barber plan deleted successfully	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1079	Barber plan updated successfully	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1080	Business deleted successfully	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1081	Business Selected	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1082	Business Selection Required	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1083	Cannot Delete Client	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1084	Cannot delete client with existing appointments	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1085	Client created	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1086	Client deleted	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1087	Client updated	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1088	created	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1089	Create New Payment Gateway	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1090	Daily Revenue	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1091	Delete Appointment	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1092	Delete Barber Plan	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1093	Delete Client	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1094	Delete Payment Gateway	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1095	Detailed insights into your business performance and revenue trends	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1096	Did you forget to add the page to the router?	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1097	Display Order	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1098	Don't have an account?	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1099	Draft	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1100	Duration (minutes)	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1101	Duration must be at least 1 minute	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1102	Edit Ticket	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1103	Email address	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1104	Email Address *	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1105	Email already exists	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1106	Email exists on database	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1107	Emergency Support	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1108	English string added	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1109	Enter details for the new team member	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1110	Enter the details for this business location	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1111	Error adding English string	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1112	Error Loading WhatsApp Instances	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1113	Everything You Need to Run Your Barbershop	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1114	Export CSV	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1115	Failed to add English string	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1116	Failed to connect the instance. Please try again.	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1117	Failed to create appointment	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1118	Failed to create barber plan	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1119	Failed to create payment gateway	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1120	Failed to create service	2025-06-19 21:18:32.093614	2025-06-19 21:18:32.093614
1121	Failed to create staff member	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1122	Failed to create support ticket	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1123	Failed to delete appointment	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1124	Failed to delete barber plan	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1125	Failed to delete client	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1126	Failed to delete payment gateway	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1127	Failed to delete service	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1128	Failed to delete staff member	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1129	Failed to delete support ticket	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1130	Failed to update appointment	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1131	Failed to update barber plan	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1132	Failed to update business	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1133	Failed to update client	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1134	Failed to update payment gateway	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1135	Failed to update service	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1136	Failed to update staff member	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1137	Failed to update support ticket	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1138	Failed to update transaction	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1139	FAQ updated successfully	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1140	For immediate support during emergencies	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1141	Gateway updated successfully	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1142	Get in Touch	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1143	Get Personalized Demo	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1144	Global Settings	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1145	I would like to see how BarberPro can help my barbershop grow.	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1146	I'm interested in learning more about BarberPro's features and pricing for my barbershop.	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1147	image_1750261624758.png	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1148	Integrated WhatsApp messaging for appointment confirmations and customer communication	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1149	Invalid email address	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1150	Invalid phone number	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1151	Length	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1152	Let's get your barbershop set up for success.	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1153	Manager	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1154	Monthly Active Users	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1155	New English String	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1156	No gateway found	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1157	No instances available	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1158	No page content available	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1159	No service found	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1160	No settings found for this business	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1161	No support tickets available	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1162	No translation found	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1163	Only one business available	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1164	Operational Information	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1165	Our Barbershop Locations	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1166	Page not found	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1167	Payment gateway deleted successfully	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1168	Payment gateway updated successfully	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1169	Please create settings for this business first.	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1170	Please enter a valid amount	2025-06-19 21:19:00.545948	2025-06-19 21:19:00.545948
1171	Please enter a valid email address	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1172	Please enter a valid phone number	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1173	Please enter appointment date	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1174	Please enter appointment time	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1175	Please enter duration	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1176	Please provide some notes	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1177	Please provide the barber plan description	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1178	Please provide the business description	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1179	Please provide the service description	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1180	Please select a business to manage settings	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1181	Please select a business to view and manage settings	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1182	Please select a category	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1183	Please select a client	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1184	Please select a language	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1185	Please select a priority	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1186	Please select a service	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1187	Please select a staff member	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1188	Please select a status	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1189	Please select a transaction type	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1190	Please select at least one client	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1191	Please select business to view settings	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1192	Please select language to start translating	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1193	Please specify the business address	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1194	Please specify the business email	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1195	Please specify the business name	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1196	Please specify the business phone	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1197	Please specify the category	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1198	Please specify the client name	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1199	Please specify the email address	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1200	Please specify the payment method	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1201	Please specify the plan name	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1202	Please specify the service name	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1203	Please specify the staff member name	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1204	Please specify the subject	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1205	Please specify the transaction amount	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1206	Please specify the transaction description	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1207	Please specify your message	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1208	Position is required	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1209	Portuguese	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1210	Professional appointment management system with calendar integration	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1211	Publishing Management	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1212	Quickly access important barbershop management functions	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1213	Request Demo	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1214	Salary is required	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1215	Schedule new client appointments	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1216	Service deleted	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1217	Service updated successfully	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1219	Settings created successfully	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1220	Settings saved successfully	2025-06-19 21:19:12.965339	2025-06-19 21:19:12.965339
1221	Settings updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1222	Staff member deleted successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1223	Staff member updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1224	Staff not found	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1225	Subscription Plans	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1226	Support ticket deleted successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1227	Support ticket updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1228	The appointment was successfully updated	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1229	The business has been deleted successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1230	The business has been successfully updated	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1231	The business information has been updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1232	The client has been deleted successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1233	The client has been updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1234	The client was successfully updated	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1235	The new English string has been added successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1236	The page you're looking for doesn't exist.	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1237	The service has been deleted successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1238	The service has been updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1239	The staff member has been deleted successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1240	The staff member has been updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1241	The staff member was successfully updated	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1242	The support ticket has been deleted successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1243	The support ticket has been updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1244	The transaction has been updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1245	This will permanently delete the appointment and cannot be undone.	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1246	This will permanently delete the barber plan and cannot be undone.	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1247	This will permanently delete the business and all associated data. This action cannot be undone.	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1248	This will permanently delete the client and cannot be undone.	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1249	This will permanently delete the payment gateway and cannot be undone.	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1250	This will permanently delete the service and cannot be undone.	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1251	This will permanently delete the staff member and cannot be undone.	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1252	Total Barbershops Managed	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1253	Transaction deleted successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1254	Transaction updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1255	translated	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1256	Trusted by 1,000+ barbershops worldwide	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1257	updated	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1258	View complete appointment schedule	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1259	Visit FAQ	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1260	Welcome to BarberPro Support	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1261	What are your business hours?	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1262	What makes BarberPro different from other salon software?	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1263	What services do you offer?	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1264	WhatsApp Connectivity	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1265	WhatsApp instance created successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1266	WhatsApp instance updated successfully	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1267	Working Hours	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1268	Yearly	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1269	You can add staff members from the Staff section in your dashboard.	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1270	You can book appointments through your dashboard's appointment calendar or mobile app.	2025-06-19 21:19:26.615959	2025-06-19 21:19:26.615959
1271	You can reset your password by clicking "Forgot Password" on the login page.	2025-06-19 21:19:32.169566	2025-06-19 21:19:32.169566
1272	You don't have access to this page.	2025-06-19 21:19:32.169566	2025-06-19 21:19:32.169566
1273	You have pending changes. Are you sure you want to leave without saving?	2025-06-19 21:19:32.169566	2025-06-19 21:19:32.169566
1274	You need to select a business first	2025-06-19 21:19:32.169566	2025-06-19 21:19:32.169566
1275	Your business hours help clients know when you're available for appointments.	2025-06-19 21:19:32.169566	2025-06-19 21:19:32.169566
1276	Your settings have been saved successfully	2025-06-19 21:19:32.169566	2025-06-19 21:19:32.169566
1277	Deleting...	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1278	Edit Payment Gateway	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1279	Edit WhatsApp Instance	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1280	Failed to create the FAQ. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1281	Failed to create the ticket. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1282	Failed to create the WhatsApp instance. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1283	Failed to create transaction	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1284	Failed to delete business	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1285	Failed to delete client. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1286	Failed to delete staff member. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1287	Failed to delete the FAQ. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1288	Failed to delete the ticket. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1289	Failed to delete the WhatsApp instance. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1290	Failed to delete transaction	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1291	Failed to fetch settings	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1292	Failed to generate QR code. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1293	Failed to load transaction data	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1294	Failed to save translation.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1295	Failed to update settings	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1296	Failed to update the FAQ. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1297	Failed to update the ticket. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1298	Failed to update the WhatsApp instance. Please try again.	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1300	Loading translations...	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1301	Pix	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1302	QR code generated successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1303	The FAQ has been created successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1304	The FAQ has been deleted successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1305	The FAQ has been updated successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1306	The ticket has been created successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1307	The ticket has been deleted successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1308	The ticket has been updated successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1309	The transaction has been created successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1310	The transaction has been deleted successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1311	The WhatsApp instance has been created successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1312	The WhatsApp instance has been deleted successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1313	The WhatsApp instance has been updated successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1314	Translation deleted successfully	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1315	Unable to load settings	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1316	Update Payment Gateway	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1317	Update WhatsApp Instance	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1318	Updating...	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1319	creating	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1320	deleting	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1321	image_1750294701021.png	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1322	image_1750351751266.png	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1323	image_1750356087323.png	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1324	image_1750356329028.png	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1325	image_1750356874754.png	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1326	image_1750358477092.png	2025-06-19 21:21:07.109078	2025-06-19 21:21:07.109078
1329	FAQ created	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1330	FAQ deleted	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1331	FAQ Details	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1332	FAQ updated	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1333	Fill out the form below and our support team will get back to you as soon as possible.	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1334	First name is required	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1335	Flexible pricing options to grow with your barbershop business	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1336	For general inquiries and documentation	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1337	Forgot your password?	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1338	For system outages or critical issues affecting your business operations,	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1339	For urgent issues and live assistance	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1340	From:	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1341	From appointment scheduling to client management, we've got you covered	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1342	Full Name *	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1343	Gateway Information	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1344	Gateway is active	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1345	Gateway Name	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1346	General	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1347	General Inquiry	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1348	Get a personalized demo and pricing	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1349	Get started by creating your first business.	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1350	Get started by creating your first FAQ	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1351	Get started by creating your first support ticket	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1352	Get started by creating your first WhatsApp instance	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1353	Get Started Today	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1354	Get the support you need from our expert team. We're here to help entrepreneurs and collaborators succeed.	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1355	Go to home	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1356	Group related questions together. Common categories include appointments, services, pricing, and policies.	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1357	Have questions? We're here to help you get started with BarberPro	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1358	Help Center	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1359	High - Business critical	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1360	Hired:	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1361	Hire Date *	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1362	Hire date is required	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1363	How can we help you today?	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1364	How do I add new staff members?	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1365	ID:	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1366	Include country code (e.g., +1 for US, +55 for Brazil)	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1367	• Include relevant screenshots or error messages	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1368	Instance connected	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1369	Instance created	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1370	Instance deleted	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1371	Instance Details	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1372	Instance updated	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1373	Integrated payment solutions with invoicing and receipt management	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1374	Integrations	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1375	{item.name}	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1376	Join our barbershop community	2025-06-19 21:21:49.599491	2025-06-19 21:21:49.599491
1377	Join thousands of barbershops that trust BarberPro for their daily operations	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1378	Key:	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1379	Last name is required	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1380	Loading table data...	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1381	Loading transaction data...	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1382	Loading transactions...	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1383	Loading your businesses...	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1384	Location	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1385	Logged out	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1386	Logged out successfully	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1387	Login failed	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1388	Login successful	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1389	Lower numbers appear first (0 = highest priority)	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1390	Low - General inquiry	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1391	Make this FAQ visible to customers	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1392	Manage barber schedules, services, and performance tracking	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1393	Manage barbershop appointments	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1394	Manage customer support requests and inquiries	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1395	Manage frequently asked questions	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1396	Manage payment processing systems	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1397	Manage subscription plans for barbershops	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1398	Manage your barbershop services	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1399	Mark this as a recurring transaction	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1400	Medium - Issue affecting work	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1401	• Mention your operating system and browser version	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1402	Mercado Pago	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1403	Missing credentials	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1404	Monday - Friday: 8:00 AM - 8:00 PM EST	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1405	/month	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1406	Name must be at least 2 characters	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1407	Navigate to Staff Management and click "Add New Staff" to create profiles for your team.	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1408	New form data being set:	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1409	New Support Ticket	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1410	New WhatsApp Instance	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1411	No data found in this table	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1412	Not specified	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1413	Optional: URL to receive WhatsApp messages and events	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1414	Order:	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1415	Organize and manage your services with pricing and duration settings	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1416	Owner *	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1417	Owner ID:	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1418	Pagbank	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1419	Pay	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1420	Payment	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1421	Payment Link	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1422	Payment Method *	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1423	Phone Number *	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1424	Phone number is required	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1425	Plan Benefits	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1426	Plan Information	2025-06-19 21:22:01.954857	2025-06-19 21:22:01.954857
1427	Plan Subtitle	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1428	Plan Title	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1429	Please enter both email and password	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1430	Please provide a detailed description (minimum 20 characters)	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1431	Please select a business first	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1432	Please select a payment gateway type	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1433	Please select problem urgency	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1434	Policies	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1435	Press	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1436	Price ($)	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1437	Price must be greater than 0	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1438	Pricing	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1439	Pricing plans coming soon	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1440	Primary Image URL	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1441	Problem Description *	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1442	Problem Urgency *	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1443	Process Payment	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1444	Products	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1445	Professional Barbershop Management	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1446	Provide complete, helpful answers. Include relevant details but keep it concise.	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1447	• Provide your account details or barbershop information	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1448	Published	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1449	Publishing:	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1450	Put the most important and frequently asked questions first (lower order numbers).	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1451	QR Code generated	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1452	QR code has been generated. Please scan it with your phone.	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1453	QR code has been generated. Please scan it with your phone to connect.	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1454	quarterly	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1455	Questions:	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1456	records	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1457	Recurring Transaction	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1458	Reference	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1459	Reference Number *	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1460	Remember me	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1461	Resolution Notes	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1462	Role is required	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1463	Salary must be greater than 0	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1464	Sales	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1465	Satisfaction Rate	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1466	Saturday: 9:00 AM - 5:00 PM EST	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1467	Save 30%	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1468	Scan this QR code with your WhatsApp to connect this instance.	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1469	{searchTerm ? "No services match your search criteria." : "Get started by creating your first service."}	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1470	Secondary Image URL	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1471	Selected	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1472	Service Catalog	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1473	Service Description (Optional)	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1474	{service.is_active ? "Active" : "Inactive"}	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1475	Service is active and available for booking	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1476	Service Name	2025-06-19 21:22:14.64036	2025-06-19 21:22:14.64036
1477	Service name is required	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1478	Service Request	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1479	Setting form data with staff member:	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1480	Sign In	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1481	Sign in to your account to continue	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1482	Since:	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1483	Smart Scheduling	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1484	Staff Information	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1485	Staff member created	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1486	Staff member deleted	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1487	Staff Members	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1488	Staff member updated	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1489	Start Your Free Trial Today	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1490	Status is required	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1491	Streamline your barbershop operations with our comprehensive appointment scheduling and management system	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1492	Subject must be at least 5 characters	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1493	Submit a Support Request	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1494	Submit Support Request	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1495	Submitting...	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1496	Successfully logged out of your account	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1497	Sunday: 10:00 AM - 4:00 PM EST	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1498	Super Admin	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1499	suporte@barberia.com.br	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1500	support@barberpro.com	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1501	Support Channels	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1502	Supported: PDF, DOC, DOCX, JPG, PNG, TXT	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1503	Support request submitted	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1504	Support Team	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1505	Support ticket management coming soon...	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1506	Table Data:	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1507	Table Selection	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1508	Tax ID *	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1509	Tax ID:	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1510	Tax ID is required	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1511	Technical help and assistance	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1512	The client has been successfully removed.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1513	The client has been successfully updated.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1514	The client you're trying to edit could not be found.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1515	The complete barbershop management solution trusted by thousands of professionals worldwide.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1516	The FAQ has been successfully created.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1517	The FAQ has been successfully deleted.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1518	The FAQ has been successfully updated.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1519	The new client has been successfully added.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1520	The new staff member has been successfully added.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1521	The staff member has been successfully removed.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1522	The staff member has been successfully updated.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1523	The support ticket has been successfully created.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1524	The support ticket has been successfully deleted.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1525	The support ticket has been successfully updated.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1526	The translation has been saved successfully.	2025-06-19 21:22:45.268238	2025-06-19 21:22:45.268238
1527	The WhatsApp instance has been successfully created.	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1528	The WhatsApp instance has been successfully deleted.	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1529	The WhatsApp instance has been successfully updated.	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1530	This action cannot be undone.	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1531	Ticket created	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1532	Ticket deleted	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1533	Ticket Details	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1534	Tickets Resolved	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1535	Ticket updated	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1536	Tips for Writing Good FAQs	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1537	Token:	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1538	Total FAQs	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1539	Update the payment gateway details	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1540	Update the service details	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1541	You must select a business to continue. Logging out...	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
1542	Your business settings have been saved successfully.	2025-06-19 21:22:54.223312	2025-06-19 21:22:54.223312
\.


--
-- Data for Name: translations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.translations (id, traduction_id, traduction, language, created_at, updated_at) FROM stdin;
2	38	404 Página não Encontradaa	pt	2025-06-19 18:03:51.06128	2025-06-19 18:06:04.557
87	1066	Gerencie as informações gerais do seu negócio	pt	2025-06-19 19:31:16.62071	2025-06-19 19:31:16.62071
3	30	12 meses	pt	2025-06-19 18:08:31.266826	2025-06-19 18:08:55.852
4	617	Painel de Controle	pt	2025-06-19 18:40:29.111067	2025-06-19 18:40:29.111067
6	494	Configurações de Moeda	pt	2025-06-19 18:48:56.112786	2025-06-19 18:48:56.112786
7	256	Colaboradores	pt	2025-06-19 18:50:00.553456	2025-06-19 18:50:00.553456
8	252	Serviços	pt	2025-06-19 18:50:32.857127	2025-06-19 18:50:32.857127
9	167	Usuário logado	pt	2025-06-19 18:50:58.79191	2025-06-19 18:50:58.79191
10	771	Clientes	pt	2025-06-19 18:59:50.320509	2025-06-19 18:59:50.320509
11	37	3 meses	pt	2025-06-19 19:01:14.873134	2025-06-19 19:01:14.873134
12	255	Sair	pt	2025-06-19 19:04:09.60515	2025-06-19 19:04:09.60515
13	254	Configurações	pt	2025-06-19 19:04:17.75918	2025-06-19 19:04:17.75918
14	260	Suporte	pt	2025-06-19 19:04:28.810425	2025-06-19 19:04:28.810425
15	340	Endereço da empresa	pt	2025-06-19 19:04:42.209953	2025-06-19 19:04:42.209953
16	263	Documento	pt	2025-06-19 19:04:56.903279	2025-06-19 19:04:56.903279
17	48	Adicionar empresa	pt	2025-06-19 19:09:22.843556	2025-06-19 19:09:22.843556
18	49	Adicionar cliente	pt	2025-06-19 19:09:27.874915	2025-06-19 19:09:27.874915
19	47	Adicionar benefícios	pt	2025-06-19 19:09:40.106683	2025-06-19 19:09:40.106683
20	45	Ações	pt	2025-06-19 19:09:47.221415	2025-06-19 19:09:47.221415
21	42	Sobre nós	pt	2025-06-19 19:09:54.976286	2025-06-19 19:09:54.976286
22	40	Sobre	pt	2025-06-19 19:10:01.16391	2025-06-19 19:10:01.16391
23	33	1 mês	pt	2025-06-19 19:10:11.134633	2025-06-19 19:10:11.134633
24	602	expressões	pt	2025-06-19 19:10:36.933441	2025-06-19 19:10:36.933441
25	603	Pressione a tecla Enter para salvar	pt	2025-06-19 19:14:45.33935	2025-06-19 19:14:45.33935
26	601	Traduções	pt	2025-06-19 19:14:56.322358	2025-06-19 19:14:56.322358
27	600	Traduzir para	pt	2025-06-19 19:15:03.857242	2025-06-19 19:15:03.857242
28	599	Selecione um idioma para traduzir	pt	2025-06-19 19:15:14.852387	2025-06-19 19:15:14.852387
29	598	Seleção de idioma	pt	2025-06-19 19:15:22.743214	2025-06-19 19:15:26.205
31	1056	para	pt	2025-06-19 19:16:54.500481	2025-06-19 19:16:54.500481
32	1034	Ver ticket	pt	2025-06-19 19:17:01.590432	2025-06-19 19:17:01.590432
33	1035	Ver demonstração	pt	2025-06-19 19:17:08.499171	2025-06-19 19:17:15.344
34	1028	Urgente - Sistema fora do ar	pt	2025-06-19 19:17:31.77678	2025-06-19 19:17:31.77678
35	1024	Atualizar dados do colaborador	pt	2025-06-19 19:17:44.798567	2025-06-19 19:17:44.798567
36	1022	Atualizar dados da instância	pt	2025-06-19 19:17:56.092806	2025-06-19 19:18:01.346
37	993	Termos e condições	pt	2025-06-19 19:18:14.885053	2025-06-19 19:18:14.885053
38	992	Termos	pt	2025-06-19 19:18:19.227239	2025-06-19 19:18:19.227239
39	988	Abrir um chamando	pt	2025-06-19 19:18:28.510948	2025-06-19 19:18:28.510948
41	985	Assunto *	pt	2025-06-19 19:18:44.915274	2025-06-19 19:18:44.915274
40	986	Assunto:	pt	2025-06-19 19:18:32.847078	2025-06-19 19:18:53.914
42	984	Assunto	pt	2025-06-19 19:19:00.148824	2025-06-19 19:19:00.148824
43	982	Status:	pt	2025-06-19 19:19:07.454379	2025-06-19 19:19:07.454379
44	979	Iniciado	pt	2025-06-19 19:19:16.123724	2025-06-19 19:19:16.123724
45	927	Privacidade	pt	2025-06-19 19:19:31.599863	2025-06-19 19:19:31.599863
46	928	Política de privacidade	pt	2025-06-19 19:19:39.671189	2025-06-19 19:19:39.671189
47	929	Produto	pt	2025-06-19 19:19:45.205294	2025-06-19 19:19:45.205294
48	930	QR Code	pt	2025-06-19 19:19:50.23498	2025-06-19 19:19:50.23498
49	931	Pergunta	pt	2025-06-19 19:19:55.60563	2025-06-19 19:19:55.60563
50	933	Pergunta:	pt	2025-06-19 19:19:59.46326	2025-06-19 19:19:59.46326
51	936	Transações recentes	pt	2025-06-19 19:20:14.50213	2025-06-19 19:20:14.50213
52	937	Recursos	pt	2025-06-19 19:20:25.842477	2025-06-19 19:20:25.842477
53	887	Novo chamado	pt	2025-06-19 19:20:33.382952	2025-06-19 19:20:33.382952
54	900	Nenhum chamado encontrado	pt	2025-06-19 19:20:45.7668	2025-06-19 19:20:45.7668
55	899	Nenhum colaborador encontrado	pt	2025-06-19 19:21:02.639421	2025-06-19 19:21:02.639421
56	897	Nenhum resultado encontrado	pt	2025-06-19 19:21:09.249315	2025-06-19 19:21:09.249315
57	896	Nenhum plano encontrado	pt	2025-06-19 19:21:14.523111	2025-06-19 19:21:14.523111
58	894	Nenhuma instância encontrado	pt	2025-06-19 19:21:23.854816	2025-06-19 19:21:23.854816
59	893	Nenhum gateway encontrado	pt	2025-06-19 19:21:31.924457	2025-06-19 19:21:31.924457
60	890	Nenhuma empresa encontrado	pt	2025-06-19 19:21:40.236951	2025-06-19 19:21:40.236951
61	888	Nova transação	pt	2025-06-19 19:21:46.854026	2025-06-19 19:21:46.854026
62	886	Novo colaborador	pt	2025-06-19 19:21:55.168702	2025-06-19 19:21:55.168702
63	884	Novo plano	pt	2025-06-19 19:21:59.749658	2025-06-19 19:21:59.749658
64	883	Nova instância	pt	2025-06-19 19:22:07.918449	2025-06-19 19:22:07.918449
65	882	Novo gateway	pt	2025-06-19 19:22:14.331074	2025-06-19 19:22:14.331074
66	881	Nova pergunta	pt	2025-06-19 19:22:23.396876	2025-06-19 19:22:28.395
67	880	Novo cliente	pt	2025-06-19 19:22:32.626308	2025-06-19 19:22:32.626308
68	879	Nova empresa	pt	2025-06-19 19:22:39.697723	2025-06-19 19:22:39.697723
69	877	Novo	pt	2025-06-19 19:22:44.426819	2025-06-19 19:22:44.426819
70	819	Arquivos	pt	2025-06-19 19:22:57.661598	2025-06-19 19:22:57.661598
73	822	Filtrar por cliente	pt	2025-06-19 19:23:20.96517	2025-06-19 19:23:23.776
72	821	Filtrar por categoria	pt	2025-06-19 19:23:15.078262	2025-06-19 19:23:24.938
71	820	Filtrar por empresa	pt	2025-06-19 19:23:08.438744	2025-06-19 19:23:26.946
74	823	Filtrar por prioridade	pt	2025-06-19 19:23:37.349537	2025-06-19 19:23:37.349537
75	824	Filtrar por serviço	pt	2025-06-19 19:23:44.400002	2025-06-19 19:23:44.400002
76	825	Filtrar por colaborador	pt	2025-06-19 19:23:53.076467	2025-06-19 19:23:53.076467
77	826	Filtrar por status	pt	2025-06-19 19:23:58.239115	2025-06-19 19:23:58.239115
78	827	Filtrar por tipo	pt	2025-06-19 19:24:02.506544	2025-06-19 19:24:02.506544
80	782	Apagar serviço	pt	2025-06-19 19:24:25.704462	2025-06-19 19:24:25.704462
81	781	Apagar plano	pt	2025-06-19 19:24:32.706006	2025-06-19 19:24:32.706006
82	433	E-mail de suporte	pt	2025-06-19 19:26:09.187101	2025-06-19 19:26:09.187101
83	434	Telefone de suporte	pt	2025-06-19 19:26:14.975543	2025-06-19 19:26:14.975543
84	539	Tente novamente	pt	2025-06-19 19:26:29.791815	2025-06-19 19:26:37.827
85	285	Bem-vindo de volta! Veja o que está acontecendo no seu negócio hoje.	pt	2025-06-19 19:29:53.104049	2025-06-19 19:29:53.104049
89	1067	Gerencie os colaboradores do seu negócio	pt	2025-06-19 19:32:26.407377	2025-06-19 19:32:26.407377
91	1068	Gerencie os clientes do seu negócio	pt	2025-06-19 19:33:13.180671	2025-06-19 19:33:13.180671
90	135	Clientes	pt	2025-06-19 19:32:43.481333	2025-06-19 19:33:26.9
88	351	Colaboradores	pt	2025-06-19 19:31:37.524255	2025-06-19 19:33:34.089
5	291	Empresas	pt	2025-06-19 18:45:39.751661	2025-06-19 19:33:37.168
86	715	Empresas	pt	2025-06-19 19:30:15.215091	2025-06-19 19:33:41.662
92	78	Agendamentos	pt	2025-06-19 19:33:53.576024	2025-06-19 19:33:53.576024
93	590	Gerencie os agendamentos do seu negócio	pt	2025-06-19 19:34:18.416572	2025-06-19 19:34:36.254
94	229	Nenhuma transação encontrada	pt	2025-06-19 19:38:39.178927	2025-06-19 19:38:39.178927
95	596	Traduções	pt	2025-06-19 19:39:31.471855	2025-06-19 19:39:31.471855
96	597	Gerencie seu software multi-idiomas	pt	2025-06-19 19:39:51.027756	2025-06-19 19:39:51.027756
97	944	Salvar configurações	pt	2025-06-19 19:47:53.200897	2025-06-19 19:47:53.200897
98	806	Modo de edição	pt	2025-06-19 19:48:32.467642	2025-06-19 19:48:32.467642
99	154	Clique para selecionar uma empresa	pt	2025-06-19 21:24:52.56961	2025-06-19 21:24:52.56961
103	610	A tradução foi salva com sucesso	pt	2025-06-19 21:26:52.339145	2025-06-19 21:26:52.339145
101	605	Tradução	pt	2025-06-19 21:26:32.674146	2025-06-19 21:26:32.674146
102	612	Falha ao salvar a tradução	pt	2025-06-19 21:26:38.912571	2025-06-19 21:26:38.912571
100	609	Tradução salva	pt	2025-06-19 21:25:25.215565	2025-06-19 21:26:49.738
104	613	Traduções	pt	2025-06-19 21:26:57.474962	2025-06-19 21:26:57.474962
105	614	Adicionar nova palavra em inglês	pt	2025-06-19 21:27:18.339001	2025-06-19 21:27:18.339001
113	773	Diário	pt	2025-06-19 21:28:43.206536	2025-06-19 21:28:43.206536
30	1061	Configurações	pt	2025-06-19 19:16:49.350373	2025-06-19 21:36:15.582
106	615	Digite uma nova palavra em inglês para adicionar a tradução. Pressione Enter para salvar.	pt	2025-06-19 21:27:49.320564	2025-06-19 21:27:49.320564
107	616	Adicionando...	pt	2025-06-19 21:27:54.82692	2025-06-19 21:27:54.82692
108	636	Contabilidade	pt	2025-06-19 21:27:58.697974	2025-06-19 21:27:58.697974
109	677	Tem certeza de que deseja excluir	pt	2025-06-19 21:28:08.263261	2025-06-19 21:28:08.263261
110	705	Faturado	pt	2025-06-19 21:28:24.927517	2025-06-19 21:28:24.927517
111	720	Cancelado	pt	2025-06-19 21:28:28.920112	2025-06-19 21:28:28.920112
112	770	Cliente	pt	2025-06-19 21:28:32.890254	2025-06-19 21:28:32.890254
114	774	Visualizador de banco de dados	pt	2025-06-19 21:28:52.607081	2025-06-19 21:28:52.607081
115	775	Data	pt	2025-06-19 21:28:56.579721	2025-06-19 21:28:56.579721
116	778	Excluir FAQ	pt	2025-06-19 21:29:05.153904	2025-06-19 21:29:05.153904
117	492	Configurações de idioma	pt	2025-06-19 21:35:29.315793	2025-06-19 21:35:29.315793
79	784	Excluir chamado	pt	2025-06-19 19:24:17.749293	2025-06-19 21:29:27.012
118	208	Sair	pt	2025-06-19 21:40:49.97285	2025-06-19 21:40:49.97285
119	527	Items por página	pt	2025-06-19 21:41:19.938116	2025-06-19 21:41:19.938116
120	528	Mostrar mais	pt	2025-06-19 21:41:25.150229	2025-06-19 21:41:25.150229
121	529	Mostrar menos	pt	2025-06-19 21:41:32.184656	2025-06-19 21:41:37.148
122	530	Expandir todos	pt	2025-06-19 21:41:48.861029	2025-06-19 21:41:48.861029
123	531	Recolher todos	pt	2025-06-19 21:41:56.851383	2025-06-19 21:41:56.851383
124	532	Selecionar todos	pt	2025-06-19 21:42:06.704237	2025-06-19 21:42:06.704237
125	534	Limpar seleção	pt	2025-06-19 21:42:30.242257	2025-06-19 21:42:30.242257
126	535	Aplicar	pt	2025-06-19 21:42:35.246946	2025-06-19 21:42:35.246946
127	536	Reiniciar	pt	2025-06-19 21:42:39.911798	2025-06-19 21:42:39.911798
128	537	Recarregar	pt	2025-06-19 21:42:45.231891	2025-06-19 21:42:45.231891
129	540	Desfazer	pt	2025-06-19 21:42:49.431276	2025-06-19 21:42:54.219
130	542	Copiar	pt	2025-06-19 21:43:07.400974	2025-06-19 21:43:07.400974
131	555	Enviar	pt	2025-06-19 21:44:07.065646	2025-06-19 21:44:07.065646
132	556	Receber	pt	2025-06-19 21:44:14.523957	2025-06-19 21:44:14.523957
133	562	Parar	pt	2025-06-19 21:44:38.138925	2025-06-19 21:44:38.138925
134	572	Colocar em produção	pt	2025-06-19 21:45:24.412261	2025-06-19 21:45:24.412261
135	573	Publicar	pt	2025-06-19 21:45:36.791023	2025-06-19 21:45:36.791023
136	574	Despublicar	pt	2025-06-19 21:45:43.430185	2025-06-19 21:45:43.430185
137	53	Adicionar colaborador	pt	2025-06-19 21:46:28.009703	2025-06-19 21:46:28.009703
138	1501	Canais de atendimento	pt	2025-06-19 21:53:06.31509	2025-06-19 21:53:06.31509
139	1500	suporte@barberia.com.br	pt	2025-06-19 21:53:39.252267	2025-06-19 21:53:39.252267
140	1499	suporte@barberia.com.br	pt	2025-06-19 21:53:41.341403	2025-06-19 21:53:41.341403
141	1498	Super Administrador	pt	2025-06-19 21:53:48.976464	2025-06-19 21:53:48.976464
142	55	Endereço	pt	2025-06-20 02:46:54.578049	2025-06-20 02:46:54.578049
143	30	12 mois	fr	2025-06-20 11:00:03.717169	2025-06-20 11:00:03.717169
144	596	Gestion des traductions	fr	2025-06-20 11:00:51.624774	2025-06-20 11:00:51.624774
145	291	Entreprises	fr	2025-06-20 11:26:40.607543	2025-06-20 11:26:40.607543
146	771	Clients	fr	2025-06-20 11:27:33.988043	2025-06-20 11:27:33.988043
147	256	Collaborateurs	fr	2025-06-20 11:28:21.625321	2025-06-20 11:28:21.625321
148	252	Services	fr	2025-06-20 11:28:26.950939	2025-06-20 11:28:34.045
149	636	Comptabilité	fr	2025-06-20 11:28:54.109143	2025-06-20 11:28:54.109143
150	254	Paramètres	fr	2025-06-20 11:29:04.252124	2025-06-20 11:29:04.252124
151	613	Traductions	fr	2025-06-20 11:29:15.122718	2025-06-20 11:29:17.839
152	617	Tableau de bord	fr	2025-06-20 11:31:07.27989	2025-06-20 11:31:29.243
153	78	Ordre du jour	fr	2025-06-20 11:31:38.267395	2025-06-20 11:31:53.459
154	219	Novo agendamento	pt	2025-06-20 11:33:16.662526	2025-06-20 11:33:16.662526
155	64	Montant	fr	2025-06-20 11:33:57.814399	2025-06-20 11:33:57.814399
156	43	Transações	pt	2025-06-20 11:35:38.13423	2025-06-20 11:35:38.13423
\.


--
-- Data for Name: users_business; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users_business (user_id, business_id) FROM stdin;
449	1
451	17
454	1
455	1
456	17
458	17
459	17
1	1
457	17
464	18
465	17
466	17
467	17
468	17
469	17
470	17
471	18
472	1
473	18
474	17
475	17
476	17
477	17
478	17
479	17
480	17
481	17
482	17
451	19
451	1
460	19
463	19
462	19
461	19
483	17
484	17
485	17
486	1
487	19
\.


--
-- Data for Name: users_roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users_roles (user_id, role_id) FROM stdin;
449	4
450	4
1	1
451	2
452	4
453	3
454	3
455	3
456	3
458	3
459	3
457	3
460	4
461	4
462	2
463	4
464	4
465	4
466	4
467	4
468	4
469	4
470	4
471	3
472	4
473	4
474	4
475	4
476	4
477	4
478	4
479	4
480	4
481	4
482	4
483	3
484	4
485	4
486	4
487	4
\.


--
-- Data for Name: whatsapp_instances; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.whatsapp_instances (id, name, phone_number, status, qr_code, session_id, last_seen, webhook_url, created_at, updated_at, business_id) FROM stdin;
\.


--
-- Name: accounting_transaction_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.accounting_transaction_categories_id_seq', 23, true);


--
-- Name: accounting_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.accounting_transactions_id_seq', 24, true);


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.appointments_id_seq', 308, true);


--
-- Name: barber_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.barber_plans_id_seq', 15, true);


--
-- Name: businesses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.businesses_id_seq', 19, true);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.faqs_id_seq', 15, true);


--
-- Name: payment_gateway_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.payment_gateway_types_id_seq', 6, true);


--
-- Name: payment_gateways_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.payment_gateways_id_seq', 1, true);


--
-- Name: persons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.persons_id_seq', 499, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.services_id_seq', 195, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.settings_id_seq', 4, true);


--
-- Name: support_ticket_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.support_ticket_categories_id_seq', 4, true);


--
-- Name: support_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.support_tickets_id_seq', 1, false);


--
-- Name: traductions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.traductions_id_seq', 1542, true);


--
-- Name: translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.translations_id_seq', 156, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 487, true);


--
-- Name: whatsapp_instances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.whatsapp_instances_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

