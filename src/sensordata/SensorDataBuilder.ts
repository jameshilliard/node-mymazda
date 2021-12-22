import { feistelCipher, parseSensorDataStr, randBetween } from "./SensorDataUtil";

import BackgroundEventList from "./BackgroundEventList";
import KeyEventList from "./KeyEventList";
import PerformanceTestResults from "./PerformanceTestResults";
import SensorDataEncryptor from "./SensorDataEncryptor";
import SystemInfo from "./SystemInfo";
import TouchEventList from "./TouchEventList";

const SDK_VERSION = "2.2.3";

// examples:
// 2.2.3-1,2,-94,-100,-1,uaend,-1,2167,1080,1,38,1,en,11,1,Pixel%205,r3-0.3-7051238,redfin,-1,com.interrait.mymazda,-1,-1,42c221bac94bbac6,-1,0,1,REL,7255357,30,Google,redfin,release-keys,user,android-build,RQ2A.210505.003,redfin,google,redfin,google/redfin/redfin:11/RQ2A.210505.003/7255357:user/release-keys,abfarm-01371,RQ2A.210505.003,23759,848575367,812026000152-1,2,-94,-101,do_unr,dm_en,t_en-1,2,-94,-102,-1,2,-94,-108,2,29555,517;2,152,517,1;2,13,518,1;-1,2,-94,-117,2,24077,0,0,1,1,1,-1;1,55,0,0,1,1,1,-1;1,8,0,0,1,1,1,-1;3,8,0,0,1,1,1,-1;2,6389,0,0,1,1,1,-1;1,17,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,8,0,0,1,1,1,-1;1,14,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,10,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,5,0,0,1,1,1,-1;3,6,0,0,1,1,1,-1;-1,2,-94,-111,1715,156.85,0.27,0.67,1;201,156.76,0.27,0.67,1;200,156.52,0.27,0.67,1;200,157.38,0.27,0.67,1;201,159.15,0.27,0.67,1;201,157.18,0.27,0.67,1;202,157.55,0.27,0.67,1;200,155.94,0.27,0.67,1;202,156.9,0.27,0.68,1;198,157.61,0.27,0.68,1;-1,2,-94,-109,301,0,0,-0,0.12,-0.05,-9.8,-0.02,0,0.02,1;200,0,-0,0,0.12,-0.05,-9.8,-0,0.02,0.02,1;200,-0,0,-0,0.11,-0.05,-9.81,0.02,0.02,0,1;201,-0,-0,-0,0.11,-0.05,-9.81,-0.02,0,0,1;200,-0,0,0,0.11,-0.05,-9.8,-0,-0.03,0,1;201,-0,0,0,0.11,-0.04,-9.8,-0.02,-0.02,0,1;200,0,0,-0,0.11,-0.04,-9.8,-0.02,-0,-0.02,1;206,-0,-0,-0,0.11,-0.05,-9.8,0.02,-0,0.02,1;201,-0,0,-0,0.11,-0.04,-9.81,0.02,0.02,-0.02,1;201,0,-0,0,0.11,-0.05,-9.8,-0.02,-0,-0,1;-1,2,-94,-144,2;197.00;1715.00;1833380425;}63A-1,2,-94,-142,2;155.81;161.29;1180081410;LKHReOSBLTE2P[IQUWPNMZRU2MHAL.ULFSX]}KXOBD2VbKTEbNLP[FWAPS[HbQUL:2;0.27;0.28;3615989574;RYXVSXOFKUTY^2cj2io}zsieaZX.WQI2AJZX]aj2k_2jhm^WYXWVYZ[_edknjcpt:1;-0.11;0.03;43.23;2687249552;thQAS}gpzu2vi|pkv3psmpet2prmlg8pt3ps2pj16p-1,2,-94,-145,2;199.00;301.00;4198652614;}2ABABAE2BABABC2AB2AB2A2BA2BACA2B3ABA2BAC2AB3AC3ABABABA2BAB2A-1,2,-94,-143,2;0.00;0.00;1733366792;haIYUYeUY`SbdUiAj].lHSbThg[AepPa^h.VTXTnoDVYE3f[P.QwHxYUNeP[Q}U:2;0.00;0.00;4284268649;gZpa2tg]vXc_Uf]igj^sAvlhUsVfachfa}_UsbldWZluld2.XZuhYpUa2t_b[hbp:2;0.00;0.00;393064142;LaKTkcXZNhUEkO.beSKgA.vnJgTKgAO}QILakOcRkHLae`WSdfZTRdErf`WLh[HY:2;0.11;0.12;1954799514;2oU[2Ub2U[N[bUhAb2[o2N[NbhbA[oU2bohb2[Uo}U2[A[bhbU[NvN}hbUhU[N}b:2;-0.05;-0.04;1810911465;.NaXjsoe}ejeXaX2ae.oA3eSjS.2X2.XsaSjajeXSa2oja.SNeaSeNSeo2aXa.j:2;-9.81;-9.80;1695751937;p}2j2}2wj}p_wejpwj_pS_w}ewj_p2Sw_SMXeS_SeMGS2XSMX_XSMXA3_XM_XGM:2;-0.05;0.03;1364810960;YeqYe2Y2qYeYqMY2qe3q5e}YeAe2Y2e4Yeq}Ye2qe2Yq3eMY4eq2e2q:2;-0.03;0.03;3740813915;_2n_AP2_n2_P2n_}2nPn_nPAn3_P2_3P2_An2P_n}P2_n_n_2n_2PA5_2nA:2;-0.03;0.03;306855191;2n4_PnP2_A_P}3_A_nP}n2_3}n_AnAP_Pn_P2_n_3P4_PnP_3n}_n2_n-1,2,-94,-115,31278,30664,7483356616,17284640616,24768059174,28218,3,15,64,64,4000,203000,1,1500718949387323254,1624052000304,0-1,2,-94,-106,-1,0-1,2,-94,-120,-1,2,-94,-112,16,504,59,1367,355800,3566,132200,1321,15787-1,2,-94,-103,3,1624051994772;2,1624051994832;3,1624051995132;2,1624051995660;3,1624051995859;2,1624052022374;3,1624052025476;
// 2.2.3-1,2,-94,-100,-1,uaend,-1,2167,1080,1,57,1,en,11,1,Pixel%205,r3-0.3-7051238,redfin,-1,com.interrait.mymazda,-1,-1,42c221bac94bbac6,-1,0,1,REL,7255357,30,Google,redfin,release-keys,user,android-build,RQ2A.210505.003,redfin,google,redfin,google/redfin/redfin:11/RQ2A.210505.003/7255357:user/release-keys,abfarm-01371,RQ2A.210505.003,23760,-1031577717,812029040602-1,2,-94,-101,do_unr,dm_en,t_en-1,2,-94,-102,-1,2,-94,-108,2,20016,517;2,366,518,1;2,27,517,1;-1,2,-94,-117,2,15032,0,0,1,1,1,-1;1,48,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,6,0,0,1,1,1,-1;1,19,0,0,1,1,1,-1;1,17,0,0,1,1,1,-1;3,5,0,0,1,1,1,-1;2,6663,0,0,1,1,1,-1;1,32,0,0,1,1,1,-1;1,25,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;3,5,0,0,1,1,1,-1;-1,2,-94,-111,1679,180.76,48.23,-30.04,1;202,181.49,47.86,-30.64,1;199,180.61,47.46,-30.54,1;200,179.35,46.47,-31.49,1;201,179.72,46.13,-30.81,1;200,179.81,45.99,-30.94,1;201,178.59,45.61,-31.22,1;200,178.57,45.77,-31.23,1;201,178.84,45.73,-31.1,1;200,179.38,46.12,-30.71,1;-1,2,-94,-109,289,-0.01,0.04,-0.06,-3.23,-7.59,-5.29,-4.35,3.86,2.44,1;199,-0.01,0.04,-0.05,-3.23,-7.54,-5.35,-2.31,1.8,3.15,1;200,-0.02,0.03,-0.06,-3.26,-7.51,-5.44,-0.52,-0.55,0.08,1;200,-0.02,0.02,-0.02,-3.28,-7.51,-5.41,-0.34,0.7,0.02,1;201,0.01,0.02,-0,-3.24,-7.48,-5.4,-2.31,0.78,2.15,1;201,-0.01,0.05,-0.04,-3.28,-7.4,-5.47,-20.22,-1.13,3.07,1;200,-0.05,0.22,-0.22,-3.37,-6.98,-5.9,-70.83,-2.63,-0.26,1;201,-0,0.46,-0.63,-3.32,-6.22,-7.01,-12.43,2.73,0.96,1;200,-0.04,0.26,-0.2,-3.41,-6.14,-6.81,-2.7,-3.53,2.23,1;200,-0.01,0.15,-0.13,-3.38,-6.07,-6.88,-3.34,-0.47,1.07,1;-1,2,-94,-144,2;132.00;5262.00;921281820;S53A}AC6AB-1,2,-94,-142,1;-129.67;123.09;11598.60;370870862;A{TZ}GmZ_YpQnZYe_XiY_c2_d6_c_._X4_c[20_b:2;32.02;52.86;1376398324;onmj2i3h2ieVX^.`2YSKOP2QSRQ2RQS2X[3^aYcicb`sp2o2np2qy2z{}{jXJA:2;-31.49;18.37;2607234128;3B9AC3DED6C6D2E2G3HIJIQ2WUYN2KJH2G4FEGJRdox}-1,2,-94,-145,2;179.00;3876.00;2848239573;B54AC4A}3A-1,2,-94,-143,2;-0.43;1.00;2415567981;4RSRQSQRNQR2QSRVRLW2TWRPOKVPS2T2SQWPTYTYVTSUQN}aR`.AJOJMRQaSNI:2;-0.79;0.46;3409767911;3h2giq}snlk2igfgegtwf2ceklulefe2d3gfh^e`a2cgdjZ`fnR_2cgf2dAVbi:2;-0.63;0.84;2930464263;3X2ZYQAR2U[WX[ZY[ZTM.Z.ZYWVU^2YZ]W[Y[X_V^.Z]W[YX_OfQg`^[2].}i`[:1;-21.87;16.83;-200.39;948948225;A}gXr.ebZj]eb[i5bf`e5be3b^e2bf^eb_h_2b`17b:2;-8.11;-4.42;2998539035;I3JKLS_abcde4fefowpnmnqt}|2yxwv4wxrtpnmlnlp2egm[2].^].[2ADH:2;-8.15;-5.15;3508989364;zy2wxvnW[ZX[2W2XW2XQGOMONMKGEK3HKGIHIFLF3KMILJIOARC2T2UXYZ}{zx:2;-70.83;65.18;4090040168;^_2`_WAZ_^[.2_2`b`XMfh[bXaZXdb2`b^3`_cacae]_eWah]ba}].`^_2a2][X:2;-23.90;59.92;3053623612;TSQ2RQPTOQFRNQRSURP2VXGYKSPSQSQ2TPS2R3TV2SIWUYWhe}|ACIGDILOB2KI:2;-76.45;61.05;3307198483;2c2b2c2bcb`2ac2bacgf_b[dfehd`b`3bca2b]^a_a.d`lA^rw}tc.`a`^ahe2h-1,2,-94,-115,21967,21916,4355669692,26663117458,31018831033,20229,3,14,64,64,3000,250000,1,1801978607533183473,1624058081204,0-1,2,-94,-106,-1,0-1,2,-94,-120,-1,2,-94,-112,16,454,59,563,43200,440,52800,527,15673-1,2,-94,-103,3,1624058075665;2,1624058075732;3,1624058076061;2,1624058076820;3,1624058076999;2,1624058093586;3,1624058097080;
// 2.2.3-1,2,-94,-100,-1,uaend,-1,2167,1080,1,58,1,en,11,1,Pixel%205,r3-0.3-7051238,redfin,-1,com.interrait.mymazda,-1,-1,42c221bac94bbac6,-1,0,1,REL,7255357,30,Google,redfin,release-keys,user,android-build,RQ2A.210505.003,redfin,google,redfin,google/redfin/redfin:11/RQ2A.210505.003/7255357:user/release-keys,abfarm-01371,RQ2A.210505.003,23761,-2024295075,812029102529-1,2,-94,-101,do_unr,dm_en,t_en-1,2,-94,-102,-1,2,-94,-108,2,18893,517,1;2,15,518,1;-1,2,-94,-117,2,17120,0,0,1,1,1,-1;1,47,0,0,1,1,1,-1;1,15,0,0,1,1,1,-1;1,5,0,0,1,1,1,-1;3,6,0,0,1,1,1,-1;2,2208,0,0,1,1,1,-1;1,17,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,23,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,5,0,0,1,1,1,-1;3,5,0,0,1,1,1,-1;2,1558,0,0,1,1,1,-1;1,9,0,0,1,1,1,-1;1,13,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;3,5,0,0,1,1,1,-1;-1,2,-94,-111,1712,48.52,87.36,90.33,1;201,63.53,87.79,75.3,1;201,92.75,87.58,46.85,1;199,117.82,86.55,22.45,1;202,125.36,84.87,15.33,1;202,123.36,83.65,17.03,1;203,117.73,82.36,20.25,1;200,116.52,80.13,18.74,1;203,117.69,79.33,13.71,1;201,124.16,79.06,3.42,1;-1,2,-94,-109,305,-0.05,-0,-0.07,0.39,-9.8,0.06,-0.61,-3.79,-0.73,1;201,0.02,-0.01,-0.06,0.47,-9.81,0,-1.83,-1.08,0,1;198,-0.02,0.02,-0,0.42,-9.75,0.06,-1.13,-0.76,0.98,1;201,-0.02,-0.04,-0.07,0.38,-9.87,-0.08,0.67,-3.18,-2.61,1;200,0.04,0.04,0.03,0.5,-9.75,0.04,-0.67,-0.99,-0.61,1;201,0.03,0.01,-0,0.52,-9.77,0.01,0.08,-0.92,-0.84,1;201,-0.01,-0.01,-0.02,0.47,-9.8,-0.02,-1.1,-0.6,1.08,1;202,-0,0,-0.02,0.47,-9.78,-0.05,-3.42,-0.08,1.24,1;198,-0.04,0.03,-0.03,0.39,-9.73,-0.09,-5.28,-1.54,4.25,1;201,-0.02,-0.04,-0.13,0.39,-9.84,-0.33,-9.62,-1.51,3.86,1;-1,2,-94,-144,2;143.00;1712.00;11141293;}55CDF2A4C-1,2,-94,-142,2;48.52;293.95;1570571140;ADKQ2S3QSWY[2Z^c3de5d2cfhji`[YZV2TSUnxz10|}9|:2;0.77;87.79;1829795522;|}2|2zy2wvts3rt2s9trmhjnqb[J2G2EDCB21A:2;-76.66;90.33;710515088;}wmd2b2ca]XVRTVN3J4I2JKLKDBAE^b_2.]26.-1,2,-94,-145,2;198.00;305.00;873412507;}BA4BCA2BCAFBCACABC7BC34BF-1,2,-94,-143,2;-1.27;2.03;2470317323;WX2W2X4WVUW2Z2X3QSYVOQZXTYXW2XZ]HAOWr}f[SUTXUW[XWX2W4XWY2WX:2;-0.22;2.37;1335296144;FEFEGFE2FE3F2GEF2GHGFDG3EGDFE2FEGJNMAEMY`}[SO2JKMJ8FE3F:2;-2.14;0.50;3610810281;2pqpr4qno2l2mjlnjlmrt}stvsosp2qoslsxqi.AKVfjnor2p13q:2;-5.04;1.60;119215440;4r2s4rpnoq2rslgdcfd[Y^]Z2].2]`dQACGc}yv2omnlmpo8nmo3n:2;-9.87;0.00;806053008;13A5BC3DC2D2CDB5CDEIKFGKT]ust2vwy|}12|:2;-9.90;0.06;2665711276;}8|zywvutq2plkjlmspq2sqs3rqsorusneOG2B3AB15A:2;-229.74;48.47;642425775;7r2qp2o2pnpqlp2rs}uqtsqs5rntomkiI`A3orpnons12r:2;-71.64;175.60;1975072667;Q2RQ6RSPMLKOROYC]c_3PQRQ3RUTVIFAY}THIRTOPRVQP13R:2;-157.90;87.99;2170968800;3gf4g3hg3ehknmihftmgdigfh2gefo}t_SAZhmfjghgfh9gihe2g-1,2,-94,-115,19947,21168,4110926220,15795853804,19906821139,19218,2,23,64,64,3000,237000,1,1779179780963853184,1624058205059,0-1,2,-94,-106,-1,0-1,2,-94,-120,-1,2,-94,-112,16,507,59,604,49500,503,105300,1052,15058-1,2,-94,-103,3,1624058199629;2,1624058199686;3,1624058199922;2,1624058200556;3,1624058200718;
// 2.2.3-1,2,-94,-100,-1,uaend,-1,2167,1080,1,60,1,en,11,1,Pixel%205,r3-0.3-7051238,redfin,-1,com.interrait.mymazda,-1,-1,42c221bac94bbac6,-1,0,1,REL,7255357,30,Google,redfin,release-keys,user,android-build,RQ2A.210505.003,redfin,google,redfin,google/redfin/redfin:11/RQ2A.210505.003/7255357:user/release-keys,abfarm-01371,RQ2A.210505.003,23754,1427845402,812029173147-1,2,-94,-101,do_unr,dm_en,t_en-1,2,-94,-102,-1,2,-94,-108,2,13298,517,1;2,14,518,1;-1,2,-94,-117,2,12046,0,0,1,1,1,-1;1,44,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,7,0,0,1,1,1,-1;3,9,0,0,1,1,1,-1;2,2998,0,0,1,1,1,-1;1,21,0,0,1,1,1,-1;1,13,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;3,5,0,0,1,1,1,-1;-1,2,-94,-111,1702,166.38,53.53,-25.03,1;201,165.95,53.47,-25.21,1;200,165.22,53.49,-25.11,1;201,164.94,53.65,-25.03,1;200,164.59,53.55,-25.14,1;202,165.58,53.71,-25.13,1;200,165.22,53.47,-25.13,1;199,166.07,53.66,-25.27,1;202,165.73,53.49,-25.04,1;199,164.69,53.53,-25.04,1;-1,2,-94,-109,305,0.04,-0.02,-0.01,-2.5,-7.87,-5.35,-0.76,1.44,0.93,1;200,0.05,-0.01,0.03,-2.44,-7.87,-5.28,0.17,0.15,-0.18,1;200,-0,-0.01,0,-2.49,-7.87,-5.3,-0.02,-0.2,-0.27,1;201,0.02,0,-0,-2.44,-7.86,-5.3,1.11,-0.32,-0.34,1;200,0,-0.01,0.03,-2.46,-7.88,-5.25,0.52,-1.25,0.09,1;201,-0.02,-0.01,-0.01,-2.51,-7.9,-5.3,-0.47,-0.44,-1.36,1;201,0.03,-0.01,0,-2.43,-7.9,-5.29,2.38,-1.74,-0.52,1;200,-0,-0,0.05,-2.46,-7.9,-5.17,-1.37,0.02,0.43,1;201,-0.02,-0.01,-0.03,-2.51,-7.91,-5.29,0.12,-0.79,0.87,1;200,-0.01,0,0.03,-2.51,-7.9,-5.2,-1.1,-0.5,-1.48,1;-1,2,-94,-144,2;199.00;1702.00;1505397280;}31A-1,2,-94,-142,2;164.59;187.06;3603071919;EDB2ACB2DADCABEDELQORSR4VXbu}|:2;53.30;54.47;3480116960;LIJSNVISJM2RT^Z^]e]ptuzvmcr}aA_o:2;-38.57;-25.03;2816004484;3|}3|{3|3{zyuqok3jihgfgfNBA-1,2,-94,-145,2;199.00;305.00;3872855939;}2ABA2BABABA2BAB2AB2AB2A3B3ABA-1,2,-94,-143,2;-0.14;0.05;2883974182;y}muofvmfiximpgskpljokosAfX_lgqk:2;-0.02;0.02;1921422129;CZYgXT]^.g_}Asc_o^ceSa`Wm]W2aSZd:2;-0.04;0.06;1372250965;NgYWfNXxDiArVOZU2RiMlMcZ}[xtkZ^Z:2;-2.84;-2.43;1230466192;r{t{yq}xrp|suwpytwururtxJWFBFAGC:2;-7.99;-7.86;532334502;x{w}s2kiejexVlfcld2eY.ZR.SLNMBAD:2;-5.35;-4.93;2382566561;AJHGOGJZIVFYRORPNMWN[QYXjcsz}y2|:2;-1.48;4.05;782503851;HRP]VKjBREeC]AaDLcS]YXeu}`{^WUPX:2;-1.74;3.97;496003840;bTQOFNASJMHPMYJgKZTYZSZ}cTNPQKYl:2;-1.48;7.57;284612012;PI2HKAGMPACOCQIOGMOPJTZ}ikSQNEQa-1,2,-94,-115,14351,15220,9899232945,11886132176,21785394692,13039,2,13,32,32,5000,189000,1,834469664186421056,1624058346295,0-1,2,-94,-106,-1,0-1,2,-94,-120,-1,2,-94,-112,16,537,59,1772,382900,3837,112600,1125,14665-1,2,-94,-103,3,1624058340818;2,1624058340887;3,1624058341141;2,1624058341713;3,1624058341893;

// with orientation data patched out:
// 2.2.3-1,2,-94,-100,-1,uaend,-1,2167,1080,1,58,1,en,11,1,Pixel%205,r3-0.3-7051238,redfin,-1,com.interrait.mymazda,-1,-1,42c221bac94bbac6,-1,0,1,REL,7255357,30,Google,redfin,release-keys,user,android-build,RQ2A.210505.003,redfin,google,redfin,google/redfin/redfin:11/RQ2A.210505.003/7255357:user/release-keys,abfarm-01371,RQ2A.210505.003,23761,988899360,812033863557-1,2,-94,-101,do_en,dm_en,t_en-1,2,-94,-102,-1,2,-94,-108,-1,2,-94,-117,2,35668,0,0,1,1,1,-1;1,24,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;3,5,0,0,1,1,1,-1;-1,2,-94,-111,-1,2,-94,-109,322,-0,-0,0,-0,-0.07,-9.8,0,0.02,-0,1;201,0,0,0,-0,-0.07,-9.8,0.02,0,0.03,1;201,0,-0,-0,0,-0.07,-9.81,0.03,0,0.02,1;199,-0,0,-0,-0,-0.06,-9.81,0.02,0.05,0.02,1;200,-0,-0,0,-0,-0.07,-9.8,0.03,0,-0.02,1;200,-0,-0,0,-0,-0.07,-9.8,0.02,-0.02,-0.02,1;201,-0,0,0,-0,-0.07,-9.8,0.02,0.03,0,1;200,-0,0,0,-0,-0.07,-9.8,0.02,-0.03,-0,1;201,0,0,-0,-0,-0.06,-9.81,-0.02,0.06,-0.02,1;200,-0,0,0,-0.01,-0.06,-9.8,0.02,-0.05,0,1;-1,2,-94,-144,-1,2,-94,-142,-1,2,-94,-145,2;198.00;322.00;3858887765;}2B3ABABABABABABA2BAB2A2BA2BABABACA2B2ABABA2BA2B2A2BABABABABA2B2ABA3B2ABABABABABABA2B2ABA2B2ABABABABABA2BA2B2A2B3ABABAB2A3BA-1,2,-94,-143,2;-0.09;0.16;893378409;2VW15VW26VW47VA}AeWQTU27V:1;-0.62;0.63;0.00;2732092013;31^V3^g25^V2^Sf^Tl2^lO2^Lp^StM^mFp^LyM^tCm^EzQTzChmAw^L}G^sAq^F{PVxDilBw^M{I:1;-0.03;0.03;0.00;1052225118;26_T21_Qs_poN2_Nm2_pR2_QnPI}M3_k_Ro3_Qi_A2_So2_oFk_IuH_nF_kUy_Mt2_xJo_TrSQmQ_oQm_TmR:2;-0.19;0.23;2160492544;2[.90[A}Kjc2.3[7.[.[15.:2;-0.46;0.38;3294349939;.].13].3]3.].2].2].6]6.2]5.6].3]4.]3.3].3].3]2.].]6.].]}AiXT]2.]3.].3].2].3]2.9]:1;-0.05;0.05;-1255.15;1712985031;p15_l10_k21_w_v_I2_Nr2_kN2_RoFR}G3_m_SoO2_Qk_Ak2_p2_mDn_KuF_lE_j_z_NuS_xIp2_rRQmQ_oPn2_mR:2;-0.76;0.41;391660090;ghihi3hghej5gh2gh5gf3gfh4gig2h2gi4gf6gh3g5hi3gh12gi2gjghgh2ghgeA}qgqigj2f3gf6gf3gh3g2i3ghg:2;-1.99;2.89;1214120000;3YZ4YZXYX3YX54YX6YZ9YZ4YZ}ATZUW4YZ2YZ21Y:2;-9.97;7.02;2234393785;93d}A`]b30d-1,2,-94,-115,0,35824,0,15685571178,15685607002,30793,0,13,0,128,4000,1000,0,1402305084830047634,1624067727114,0-1,2,-94,-106,-1,0-1,2,-94,-120,-1,2,-94,-112,16,550,59,94,121000,1218,152200,1521,17274-1,2,-94,-103,

// with orientation and motion data patched out:
// 2.2.3-1,2,-94,-100,-1,uaend,-1,2167,1080,1,66,1,en,11,1,Pixel%205,r3-0.3-7051238,redfin,-1,com.interrait.mymazda,-1,-1,42c221bac94bbac6,-1,0,1,REL,7255357,30,Google,redfin,release-keys,user,android-build,RQ2A.210505.003,redfin,google,redfin,google/redfin/redfin:11/RQ2A.210505.003/7255357:user/release-keys,abfarm-01371,RQ2A.210505.003,23760,-2136038857,812034136328-1,2,-94,-101,do_en,dm_en,t_en-1,2,-94,-102,-1,2,-94,-108,-1,2,-94,-117,2,40794,0,0,1,1,1,-1;1,18,0,0,1,1,1,-1;1,22,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,5,0,0,1,1,1,-1;3,6,0,0,1,1,1,-1;-1,2,-94,-111,-1,2,-94,-109,-1,2,-94,-144,-1,2,-94,-142,-1,2,-94,-145,-1,2,-94,-143,-1,2,-94,-115,0,40902,0,0,40902,40904,0,9,0,0,3000,1000,0,3621748667440304743,1624068272657,0-1,2,-94,-106,-1,0-1,2,-94,-120,-1,2,-94,-112,16,548,59,566,44600,454,105200,1051,15739-1,2,-94,-103,
// 2.2.3-1,2,-94,-100,-1,uaend,-1,2167,1080,1,68,1,en,11,1,Pixel%205,r3-0.3-7051238,redfin,-1,com.interrait.mymazda,-1,-1,42c221bac94bbac6,-1,0,1,REL,7255357,30,Google,redfin,release-keys,user,android-build,RQ2A.210505.003,redfin,google,redfin,google/redfin/redfin:11/RQ2A.210505.003/7255357:user/release-keys,abfarm-01371,RQ2A.210505.003,23762,-532226827,812034559950-1,2,-94,-101,do_en,dm_en,t_en-1,2,-94,-102,-1,2,-94,-108,-1,2,-94,-117,2,58531,0,0,1,1,1,-1;1,7,0,0,1,1,1,-1;1,7,0,0,1,1,1,-1;1,15,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,5,0,0,1,1,1,-1;3,6,0,0,1,1,1,-1;-1,2,-94,-111,-1,2,-94,-109,-1,2,-94,-144,-1,2,-94,-142,-1,2,-94,-145,-1,2,-94,-143,-1,2,-94,-115,0,58725,0,0,58725,31948,0,18,0,0,4000,0,0,1365758343308169835,1624069119901,0-1,2,-94,-106,-1,0-1,2,-94,-120,-1,2,-94,-112,16,523,59,601,46500,473,59700,596,15417-1,2,-94,-103,
// 2.2.3-1,2,-94,-100,-1,uaend,-1,2167,1080,1,73,1,en,11,1,Pixel%205,r3-0.3-7051238,redfin,-1,com.interrait.mymazda,-1,-1,42c221bac94bbac6,-1,0,1,REL,7255357,30,Google,redfin,release-keys,user,android-build,RQ2A.210505.003,redfin,google,redfin,google/redfin/redfin:11/RQ2A.210505.003/7255357:user/release-keys,abfarm-01371,RQ2A.210505.003,23758,296394084,812035743293-1,2,-94,-101,do_en,dm_en,t_en-1,2,-94,-102,-1,2,-94,-108,2,13840,517,1;2,19,518,1;-1,2,-94,-117,2,12217,0,0,1,1,1,-1;1,26,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;3,4,0,0,1,1,1,-1;2,2855,0,0,1,1,1,-1;1,9,0,0,1,1,1,-1;1,13,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,8,0,0,1,1,1,-1;1,25,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;3,5,0,0,1,1,1,-1;-1,2,-94,-111,-1,2,-94,-109,-1,2,-94,-144,-1,2,-94,-142,-1,2,-94,-145,-1,2,-94,-143,-1,2,-94,-115,14898,15253,0,0,30151,17005,2,15,0,0,3000,1000,0,1991296437358769287,1624071486586,0-1,2,-94,-106,-1,0-1,2,-94,-120,-1,2,-94,-112,16,499,59,771,354200,3550,130600,1305,15742-1,2,-94,-103,

export default class SensorDataBuilder {
    private sensorCollectionStartTimestamp: number;
    private deviceInfoTime: number;

    private systemInfo: SystemInfo;
    private touchEventList: TouchEventList;
    private keyEventList: KeyEventList;
    private backgroundEventList: BackgroundEventList;
    private performanceTestResults: PerformanceTestResults;

    private sensorDataEncryptor: SensorDataEncryptor;

    constructor () {
        this.sensorCollectionStartTimestamp = Date.now();
        this.deviceInfoTime = randBetween(3, 8) * 1000;

        this.systemInfo = new SystemInfo();
        this.systemInfo.randomize();

        this.touchEventList = new TouchEventList();
        this.keyEventList = new KeyEventList();
        this.backgroundEventList = new BackgroundEventList();

        this.performanceTestResults = new PerformanceTestResults();
        this.performanceTestResults.randomize();

        this.sensorDataEncryptor = new SensorDataEncryptor();
    }

    public generateSensorData() {
        this.touchEventList.randomize(this.sensorCollectionStartTimestamp);
        this.keyEventList.randomize(this.sensorCollectionStartTimestamp);
        this.backgroundEventList.randomize(this.sensorCollectionStartTimestamp);

        let randomNumber = Math.floor(Math.random() * (2 ** 31));
        if (Math.random() < 0.5) randomNumber = randomNumber * -1;

        let orientationEvent = this.generateOrientationDataAA();
        let orientationEventCount = (orientationEvent.match(/;/g)||[]).length;
        let motionEvent = this.generateMotionDataAA();
        let motionEventCount = (motionEvent.match(/;/g)||[]).length;

        let sensorData = "";
        sensorData += SDK_VERSION;
        sensorData += "-1,2,-94,-100,";
        sensorData += this.systemInfo.toString();
        sensorData += ",";
        sensorData += this.systemInfo.getCharCodeSum();
        sensorData += ",";
        sensorData += randomNumber;
        sensorData += ",";
        sensorData += Math.floor(this.sensorCollectionStartTimestamp / 2);
        sensorData += "-1,2,-94,-101,";
        sensorData += "do_en"; // orientationManagerStatus
        sensorData += ",";
        sensorData += "dm_en"; // motionManagerStatus
        sensorData += ",";
        sensorData += "t_en";
        sensorData += "-1,2,-94,-102,";
        sensorData += this.generateEditedText();
        sensorData += "-1,2,-94,-108,";
        sensorData += this.keyEventList.toString();
        sensorData += "-1,2,-94,-117,";
        sensorData += this.touchEventList.toString();
        sensorData += "-1,2,-94,-111,";
        sensorData += orientationEvent;
        sensorData += "-1,2,-94,-109,";
        sensorData += motionEvent;
        sensorData += "-1,2,-94,-144,";
        sensorData += this.generateOrientationDataAC();
        sensorData += "-1,2,-94,-142,";
        sensorData += this.generateOrientationDataAB();
        sensorData += "-1,2,-94,-145,";
        sensorData += this.generateMotionDataAC();
        sensorData += "-1,2,-94,-143,";
        sensorData += this.generateMotionEvent();
        sensorData += "-1,2,-94,-115,";
        sensorData += this.generateMiscStat(orientationEventCount, motionEventCount);
        sensorData += "-1,2,-94,-106,";
        sensorData += this.generateStoredValuesF();
        sensorData += ",";
        sensorData += this.generateStoredValuesG();
        sensorData += "-1,2,-94,-120,";
        sensorData += this.generateStoredStackTraces();
        sensorData += "-1,2,-94,-112,";
        sensorData += this.performanceTestResults.toString();
        sensorData += "-1,2,-94,-103,";
        sensorData += this.backgroundEventList.toString();

        this.sensorCollectionStartTimestamp = Date.now();

        let encryptedSensorData = this.sensorDataEncryptor.encryptSensorData(sensorData);

        return encryptedSensorData;
    }

    private generateEditedText(): string {
        return "";
    }

    /*
    examples:
    1719,196.33,0.26,0.21,1;201,197.58,0.26,0.21,1;201,196.99,0.26,0.21,1;200,196.75,0.26,0.21,1;201,197.87,0.25,0.21,1;200,198.79,0.26,0.21,1;200,197.14,0.25,0.2,1;202,196.33,0.25,0.21,1;200,197.89,0.25,0.21,1;201,198.06,0.25,0.21,1;
    */
    private generateOrientationDataAA(): string {
        return "";
    }

    /*
    examples:
    301,0,0,0,0.04,-0.04,-9.8,0.02,-0.02,-0,1;200,-0,0,0,0.03,-0.04,-9.8,-0.02,-0.05,-0.02,1;201,0,0,-0,0.04,-0.04,-9.8,-0.03,-0.12,-0.02,1;201,-0,0,0,0.04,-0.04,-9.8,-0.06,-0.18,-0.06,1;200,-0,-0,0,0.03,-0.05,-9.8,0.12,0.26,-0,1;200,0,-0,0,0.04,-0.04,-9.79,-0.11,-0.11,-0.02,1;201,-0,0,0,0.03,-0.04,-9.79,0.02,0.02,0.02,1;200,0,-0,-0,0.04,-0.05,-9.8,-0.02,0.02,-0.02,1;201,0,0,-0,0.04,-0.04,-9.8,0,0.03,0.02,1;201,0,0,-0,0.04,-0.04,-9.8,-0.02,0.02,-0.02,1;
    */
    private generateMotionDataAA(): string {
        return "";
    }

    /* examples:
    2;198.00;1719.00;969190507;}127A
    */
    private generateOrientationDataAC(): string {
        return "";
    }

    /* examples:
    1;-73.70;99.77;25292.40;3379149478;LhNH}ZAkgDZoTEi`DZpRJeZOciBKpZMijGKiZR2ZJZjZIhfM3ZP3ZaZR3ZRfZO4Z`ZRZa3ZP19ZR18Z`T9Z:2;0.22;0.34;1141159063;T2S3R4Q2ONM2NPNCHECA2O2K2JHIHIHIJIJ2IHIH2JLK2LI2KHIN2OPQPQPONL2MJHJHIFP}^3cf3g4f4ed3fge5fedfhghj2lnljkjh2f2ghjk2jhj:2;0.04;0.30;814521397;f3g4f2gf3gfgfeZ[VLG`a^`4_^_^4_^_2^_`_a`2_2^]2.3[3.3[2.2]`^_^o}uJB5ABAB3CBC2B3A2B4C2B13C6B2A4BA
    2;198.00;1719.00;969190507;}127A
    */
    private generateOrientationDataAB(): string {
        return "";
    }

    /* examples:
    2;198.00;301.00;2428178775;}40BC68BDA16B
    */
    private generateMotionDataAC(): string {
        return "";
    }

    /* examples:
    2;-0.08;0.04;1215967061;2gh2gh2gh2g2h2g3h5ghg5fhjhghgh5ghfh6g2h5gh4gfgh6g2hgh2g}Avh[jih4ghgh3gh2gh4gfh11gh5gh4g:2;-0.06;0.08;321414514;4[Z2[Z4[Z2[Z14[Z2[Z[Z[.5[Z8[Z3[.[Z3[Z[Z[.Z10[A}2XQ_2.Z3[Z2[Z4[Z17[Z2[Z8[:1;-0.02;0.03;0.00;1574102520;3YIrfYnY}KhfclK5YOMYNYb2YB4YIe3Ykh4YfYq6Yr4YL3Yj2YeYG3YmYA3YHnkF2YJqt3YAMYcIYL3YEkYH5YM2YG2YFNcsYM3Yh2Y:2;-0.08;0.13;2063860197;4baba5bc3b2c5bcb2a`_^_2ba8bcac6b2c5bcb2cb2a3ba2ba6b}AiaQ9.]6.]4.[10.[6.[.[3.:2;-0.18;0.05;1376112672;4dc2dc4dc2d4c8dede3dbcbcdcd2cdcdc4dcd4c2d2cd5cdb5cd4cA}dbWbab2ab8abab2ab9ab2abab10a:1;-0.11;0.21;-1254.56;1217309104;UXY]}AbY]UH`PXOMUOSR2Q3UYU2RP5UY3U[5UYUZS5UZR3US3UX4UQ3UZUP3UR[XQ3U2[3UP3URUR3URYUR8UR2UQ2U[5UY2U:2;-0.57;0.61;4105466238;^].ZdX^10][2].2^`[V`[.Zj^Y3].^]_2]^5]^]_2^3].^][_`4^4].]^]Z[_]Yyd}Aa.^`^8]^2]_4]^3]^.]_^]_`_]_].^]2.]^]:2;-1.39;0.96;4277331762;dca_ka2de2dc2de2dce4dcb[e_[^}ebe4dce3dec2dc2dedebcdc2dbdc4dcdcededefcectgXAhc3de3de5dc5d2e2dc2dedc15d:2;-71.68;87.17;976643001;78.WA[.}45.
    */
    private generateMotionEvent(): string {
        return "";
    }

    /*
    examples:
    867287,867467,5337361875,17128083124,22467179753,1279310,4,16,128,128,4000,413496000,1,6531066730275436471,1623902141630,0
    31278,30664,7483356616,17284640616,24768059174,28218,3,15,64,64,4000,203000,1,1500718949387323254,1624052000304,0
    21967,21916,4355669692,26663117458,31018831033,20229,3,14,64,64,3000,250000,1,1801978607533183473,1624058081204,0
    19947,21168,4110926220,15795853804,19906821139,19218,2,23,64,64,3000,237000,1,1779179780963853184,1624058205059,0
    14351,15220,9899232945,11886132176,21785394692,13039,2,13,32,32,5000,189000,1,834469664186421056,1624058346295,0

    with sensors disabled:
    14898,15253,0,0,30151,17005,2,15,0,0,3000,1000,0,1991296437358769287,1624071486586,0
    */
    private generateMiscStat(orientationDataCount: number, motionDataCount: number): string {
        let sumOfTextEventValues = this.keyEventList.getSum();
        let sumOfTouchEventTimestampsAndTypes = this.touchEventList.getSum();
        let orientationDataB = 0;
        let motionDataB = 0;
        let sum = sumOfTextEventValues + sumOfTouchEventTimestampsAndTypes + orientationDataB + motionDataB;

        let timeSinceSensorCollectionStart = Date.now() - this.sensorCollectionStartTimestamp;

        return [
            sumOfTextEventValues,
            sumOfTouchEventTimestampsAndTypes,
            orientationDataB,
            motionDataB,
            sum,
            timeSinceSensorCollectionStart,
            this.keyEventList.keyEvents.length,
            this.touchEventList.touchEvents.length,
            orientationDataCount, //orientationData.c
            motionDataCount, //motionData.c
            this.deviceInfoTime,
            randBetween(5, 15) * 1000, //time to build sensor data in microseconds, rounded to nearest 1000
            0, //StoredValues.hasGravitySensor - normally 1
            feistelCipher(sum, this.keyEventList.keyEvents.length + this.touchEventList.touchEvents.length + orientationDataCount + motionDataCount, timeSinceSensorCollectionStart),
            this.sensorCollectionStartTimestamp,
            0
        ].join(",");
    }

    private generateStoredValuesF(): string {
        return "-1";
    }

    private generateStoredValuesG(): string {
        return "0";
    }

    private generateStoredStackTraces(): string {
        return "";
    }
}
