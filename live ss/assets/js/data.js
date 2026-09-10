/* LiveSight — البيانات التجريبية + الطبقة المنطقية */
const WILAYAS = [
  [1,'أدرار','Adrar',27.87,-0.29],[2,'الشلف','Chlef',36.16,1.33],[3,'الأغواط','Laghouat',33.80,2.87],
  [4,'أم البواقي','Oum El Bouaghi',35.88,7.11],[5,'باتنة','Batna',35.55,6.17],[6,'بجاية','Béjaïa',36.75,5.08],
  [7,'بسكرة','Biskra',34.85,5.73],[8,'بشار','Béchar',31.62,-2.22],[9,'البليدة','Blida',36.47,2.83],
  [10,'البويرة','Bouira',36.37,3.90],[11,'تمنراست','Tamanrasset',22.79,5.52],[12,'تبسة','Tébessa',35.40,8.12],
  [13,'تلمسان','Tlemcen',34.88,-1.31],[14,'تيارت','Tiaret',35.37,1.32],[15,'تيزي وزو','Tizi Ouzou',36.71,4.05],
  [16,'الجزائر','Alger',36.75,3.06],[17,'الجلفة','Djelfa',34.67,3.25],[18,'جيجل','Jijel',36.82,5.77],
  [19,'سطيف','Sétif',36.19,5.41],[20,'سعيدة','Saïda',34.83,0.15],[21,'سكيكدة','Skikda',36.88,6.90],
  [22,'سيدي بلعباس','Sidi Bel Abbès',35.19,-0.63],[23,'عنابة','Annaba',36.90,7.75],[24,'قالمة','Guelma',36.46,7.43],
  [25,'قسنطينة','Constantine',36.37,6.61],[26,'المدية','Médéa',36.27,2.75],[27,'مستغانم','Mostaganem',35.93,0.09],
  [28,'المسيلة','M\u2019Sila',35.70,4.54],[29,'معسكر','Mascara',35.40,0.14],[30,'ورقلة','Ouargla',31.95,5.32],
  [31,'وهران','Oran',35.70,-0.65],[32,'البيض','El Bayadh',33.68,1.01],[33,'إليزي','Illizi',26.48,8.46],
  [34,'برج بوعريريج','Bordj Bou Arréridj',36.07,4.76],[35,'بومرداس','Boumerdès',36.77,3.48],
  [36,'الطارف','El Tarf',36.77,8.31],[37,'تندوف','Tindouf',27.67,-8.13],[38,'تيسمسيلت','Tissemsilt',35.61,1.81],
  [39,'الوادي','El Oued',33.37,7.15],[40,'خنشلة','Khenchela',35.44,7.14],[41,'سوق أهراس','Souk Ahras',36.29,7.95],
  [42,'تيبازة','Tipaza',36.59,2.45],[43,'ميلة','Mila',36.45,6.26],[44,'عين الدفلى','Aïn Defla',36.26,1.97],
  [45,'النعامة','Naâma',33.27,-0.31],[46,'عين تموشنت','Aïn Témouchent',35.30,-1.14],
  [47,'غرداية','Ghardaïa',32.49,3.67],[48,'غليزان','Relizane',35.74,0.56],[49,'تيميمون','Timimoun',29.26,0.23],
  [50,'برج باجي مختار','Bordj Badji Mokhtar',21.32,0.95],[51,'أولاد جلال','Ouled Djellal',34.42,5.06],
  [52,'بني عباس','Béni Abbès',30.13,-2.16],[53,'عين صالح','In Salah',27.19,2.46],
  [54,'عين قزام','In Guezzam',19.57,5.77],[55,'تقرت','Touggourt',33.10,6.06],[56,'جانت','Djanet',24.55,9.48],
  [57,'المغير','El M\u2019Ghair',33.95,5.92],[58,'المنيعة','El Meniaa',30.58,2.88]
];

const CATEGORIES = [
  {id:'c1', ar:'توصيل سريع', fr:'Livraison express', ic:'van'},
  {id:'c2', ar:'توزيع الطرود', fr:'Distribution colis', ic:'box'},
  {id:'c3', ar:'تنظيف', fr:'Nettoyage', ic:'sparkle'},
  {id:'c4', ar:'صيانة منزلية', fr:'Maintenance à domicile', ic:'wrench'},
  {id:'c5', ar:'فني كهرباء', fr:'Électricien', ic:'bolt'},
  {id:'c6', ar:'سباكة', fr:'Plomberie', ic:'droplet'},
  {id:'c7', ar:'نقل وأثاث', fr:'Transport mobilier', ic:'truck'},
  {id:'c8', ar:'تسويق ميداني', fr:'Marketing terrain', ic:'megaphone'},
  {id:'c9', ar:'جرد وتعداد', fr:'Inventaire / comptage', ic:'clipboard'},
  {id:'c10', ar:'زيارة ميدانية', fr:'Visite terrain', ic:'pin'},
  {id:'c11', ar:'تصوير وإثبات', fr:'Photo & constat', ic:'camera'},
  {id:'c12', ar:'تجميع عينات', fr:'Collecte échantillons', ic:'flask'},
  {id:'c13', ar:'دهن وتبييض', fr:'Peinture', ic:'roller'},
  {id:'c14', ar:'بستنة', fr:'Jardinage', ic:'leaf'}
];

const STATUS = {
  open:'open', inProgress:'in_progress', awaitingProof:'awaiting_proof',
  done:'done', paid:'paid', cancelled:'cancelled', disputed:'disputed'
};

const USERS = [
  {id:'u_me', role:'user', name:'أمين بن عيسى', nameFr:'Amin Ben Aïssa', email:'user@livesight.dz', pass:'demo123',
   phone:'0550 11 22 33', wilaya:16, lat:36.7538, lng:3.0588, town:'حسين داي',
   online:true, verified:true, balance:18000, escrow:6000, points:320, rating:4.8, rates:24,
   level:'pro', badges:['star','ring','diamond'], skills:['c2','c5','c9'],
   bio:'متاح للمهام اليومية والتوصيل السريع بنظام الضمان الكامل',
   bioFr:'Disponible pour livraison rapide et tâches quotidiennes',
   memberSince:'2024-03-12', lockPin:'1234', twoFA:true, tfaTrusted:false},
  {id:'u_amina', role:'user', name:'أمينة زروقي', nameFr:'Amina Zerouki', email:'amina@mail.dz', pass:'demo123',
   phone:'0661 44 55 66', wilaya:16, lat:36.7158, lng:3.1397, town:'باب الزوار',
   online:false, verified:true, balance:24500, escrow:0, points:480, rating:4.9, rates:31,
   level:'pro', badges:['star','ring','diamond'], skills:['c1','c2','c11','c12'],
   bio:'توصيل وتوزيع محترف، التزام ومواعيد مضبوطة',
   bioFr:'Livraison professionnelle, ponctualité garantie', memberSince:'2023-11-03'},
  {id:'u_karim', role:'user', name:'كريم بوقرة', nameFr:'Karim Bouguerra', email:'karim@mail.dz', pass:'demo123',
   phone:'0770 88 99 00', wilaya:31, lat:35.7016, lng:-0.6468, town:'وهران',
   online:true, verified:true, balance:9800, escrow:3000, points:210, rating:4.6, rates:18,
   level:'trusted', badges:['star','ring'], skills:['c4','c6','c13'],
   bio:'صيانة وسباكة ودهن، خبرة 7 سنوات', bioFr:'Maintenance & plomberie, 7 ans d\u2019expérience',
   memberSince:'2024-06-20'},
  {id:'u_sara', role:'user', name:'سارة مزياني', nameFr:'Sara Meziani', email:'sara@mail.dz', pass:'demo123',
   phone:'0555 22 33 44', wilaya:19, lat:36.1911, lng:5.4100, town:'سطيف',
   online:true, verified:true, balance:15200, escrow:0, points:410, rating:4.9, rates:27,
   level:'pro', badges:['star','ring','diamond'], skills:['c8','c9','c10'],
   bio:'تسويق ميداني وجرد، تقارير موثقة بالصور',
   bioFr:'Marketing terrain & inventaire, rapports photo', memberSince:'2024-01-15'},
  {id:'u_moh', role:'user', name:'محمد رحماني', nameFr:'Mohamed Rahmani', email:'moh@mail.dz', pass:'demo123',
   phone:'0666 77 88 99', wilaya:25, lat:36.3650, lng:6.6147, town:'قسنطينة',
   online:false, verified:false, balance:3400, escrow:0, points:90, rating:4.4, rates:9,
   level:'junior', badges:[], skills:['c7'],
   bio:'نقل وتوصيل بسيارات للخدمات الميدانية',
   bioFr:'Transport et livraison', memberSince:'2024-10-02'},
  {id:'u_lina', role:'user', name:'لينة حاج', nameFr:'Lina Hadj', email:'lina@mail.dz', pass:'demo123',
   phone:'0551 33 44 55', wilaya:16, lat:36.7762, lng:3.0586, town:'الجزائر الوسطى',
   online:true, verified:true, balance:5600, escrow:0, points:0, rating:0, rates:0,
   level:'junior', badges:[], skills:['c10'],
   bio:'عميلة — أنشر مهامي وأراقب تنفيذها',
   bioFr:'Cliente — je publie et je suis mes tâches', memberSince:'2025-01-05'},
  {id:'u_admin', role:'admin', name:'إدارة LiveSight', nameFr:'Administration LiveSight', email:'admin@livesight.dz',
   pass:'admin123', phone:'0560 00 00 00', wilaya:16, lat:36.75, lng:3.06, online:true,
   verified:true, balance:0, escrow:0, points:0, rating:0, rates:0, level:'pro', badges:[],
   skills:[], bio:'', bioFr:'', memberSince:'2024-01-01', lockPin:'9876', twoFA:true}
];

const TASKS = [
  {id:'t1', client:'u_me', assignee:null, title:'توصيل طرد من باب الزوار إلى باب الوادي', titleFr:'Livrer un colis de Bab Ezzouar à Bab El Oued',
   desc:'طرد صغير وزنه 2 كلغ. الاستلام من المتجر في باب الزوار والتسليم لمكتب في باب الوادي.',
   descFr:'Petit colis 2kg. Prise en charge magasin Bab Ezzouar, livraison bureau Bab El Oued.',
   cat:'c1', wilaya:16, lat:36.7070, lng:3.1812, town:'باب الزوار', addr:'شارع التطور التقني',
   budget:1500, priceType:'fixed', public:true, schedule:null, steps:null, evidence:null,
   date:'2026-09-08T10:20:00', status:STATUS.open,
   applications:[{user:'u_amina', when:'2026-09-09T08:15:00', offer:1500, msg:'متاحة في نفس اليوم، خبرة في المنطقة'}]},
  {id:'t2', client:'u_lina', assignee:null, title:'حملة توزيع 200 منشور في حي فيلايني', titleFr:'Distribution 200 flyers à Didouche Mourad',
   desc:'توزيع 200 منشور إعلاني على محلات ومقاهي حي فيلايني مع التقاط صورة لكل نقطة تسليم.',
   descFr:'Distribution de 200 flyers + photo par point.',
   cat:'c8', wilaya:16, lat:36.7668, lng:3.0545, town:'الجزائر الوسطى', addr:'شارع ديدوش مراد',
   budget:3200, priceType:'fixed', public:true, schedule:'2026-09-12T09:00:00', steps:null, evidence:null,
   date:'2026-09-09T11:00:00', status:STATUS.open, applications:[]},
  {id:'t3', client:'u_me', assignee:'u_karim', title:'إصلاح تسرب ماء بالمطبخ', titleFr:'Réparer fuite d\u2019eau cuisine',
   desc:'تسرب بسيط تحت الحوض. أحضر القطع إن لزم والأجر يُدفع إضافيًا.',
   descFr:'Fuite légère sous l\u2019évier.',
   cat:'c6', wilaya:31, lat:35.7016, lng:-0.6468, town:'وهران', addr:'حي بوصفر الحامة',
   budget:2500, priceType:'fixed', public:true, schedule:'2026-09-10T14:00:00',
   steps:[{t:'إيقاف الماء وإخراج الخزانة',tFr:'Couper l\u2019eau et vider le placard',done:true},{t:'استبدال الخراطيم المتسربة',tFr:'Remplacer les tuyaux',done:false},{t:'اختبار الضغط والتأكد',tFr:'Tester la pression',done:false}],
   evidence:null, date:'2026-09-07T15:30:00', status:STATUS.inProgress,
   applications:[{user:'u_karim', when:'2026-09-08T09:00:00', offer:2500, msg:'أختص في السباكة'}],
   offerAmount:2500},
  {id:'t4', client:'u_me', assignee:'u_amina', title:'جرد بضاعة مخزن ملابس', titleFr:'Inventaire stock magasin vêtements',
   desc:'جرد 400 قطعة وتصنيف حسب المقاس وتعبئة التقرير في جدول مرفق.',
   descFr:'Inventaire 400 pièces, tri et rapport.',
   cat:'c9', wilaya:16, lat:36.7470, lng:3.0631, town:'أول ماي', addr:'مارشي أول ماي',
   budget:4000, priceType:'fixed', public:true, schedule:'2026-09-11T08:30:00',
   steps:[{t:'عدّ القطع بالتصنيف',tFr:'Compter par catégorie',done:true},{t:'تصنيف حسب المقاس',tFr:'Trier par taille',done:true},{t:'إعداد التقرير النهائي',tFr:'Préparer le rapport',done:true}],
   evidence:{photos:null, signature:'data:image/png;base64,PLACEHOLDER_SIGN', note:'تم الجرد بالكامل وإرسال التقرير'},
   date:'2026-09-05T09:00:00', status:STATUS.awaitingProof, offerAmount:4000},
  {id:'t5', client:'u_sara', assignee:'u_karim', title:'دهن غرفة نوم (12م²)', titleFr:'Peinture chambre 12m²',
   desc:'دهن غرفة كاملة لون فاتح، الضرورة والترميق.',
   descFr:'Peinture complète d\u2019une chambre.',
   cat:'c13', wilaya:31, lat:35.6925, lng:-0.6250, town:'المنزه', addr:'حي المنزه',
   budget:9000, priceType:'negotiable', public:true, schedule:'2026-08-25T09:00:00', steps:null, evidence:null,
   date:'2026-08-20T10:00:00', status:STATUS.paid, applications:[{user:'u_karim',when:'2026-08-21T09:00:00',offer:9000,msg:''}], offerAmount:9000, paidOn:'2026-08-28T18:00:00'},
  {id:'t6', client:'u_lina', assignee:'u_amina', title:'التقاط صور فوتوشوب لجرد متجر', titleFr:'Photos constat pour inventaire boutique',
   desc:'التقاط 40 صورة بجودة عالية للبضاعة مجمعة ومفردة.',
   descFr:'40 photos HD des articles.',
   cat:'c11', wilaya:16, lat:36.6900, lng:3.2150, town:'الدار البيضاء', addr:'حي الدار البيضاء',
   budget:6000, priceType:'fixed', public:false, schedule:'2026-07-15T10:00:00', steps:null, evidence:null,
   date:'2026-07-10T12:00:00', status:STATUS.disputed,
   dispute:{reason:'الصور وصلت متأخرة وبجودة أقل من المتفق عليه', openedBy:'u_lina', when:'2026-07-18T10:00:00', decision:null},
   applications:[{user:'u_amina',when:'2026-07-11T09:00:00',offer:6000,msg:''}], offerAmount:6000},
  {id:'t7', client:'u_sara', assignee:null, title:'جمع عينات تربة من الميدان (سيدي بلعباس)', titleFr:'Collecte échantillons de sol',
   desc:'جمع 10 عينات من نقاط محددة في 3 مواقع ووضعها في أكياس مرقمة مع تسجيل الإحداثيات.',
   descFr:'10 échantillons de sol + coordonnées.',
   cat:'c12', wilaya:22, lat:35.19, lng:-0.63, town:'سيدي بلعباس', addr:'المحيط الفلاحي',
   budget:7500, priceType:'fixed', public:true, schedule:'2026-09-18T08:00:00', steps:null, evidence:null,
   date:'2026-09-09T09:30:00', status:STATUS.open, applications:[]},
  {id:'t8', client:'u_me', assignee:null, title:'تركيب لمبة ولوحة مفتاح', titleFr:'Installer lampe + interrupteur',
   desc:'تركيب سبوتينغ ولوحة مفاتيح في الصالون، المادة متوفرة.',
   descFr:'Installation spots et interrupteur.',
   cat:'c5', wilaya:16, lat:36.7600, lng:3.0750, town:'بلوزداد', addr:'شارع محمد بلوزداد',
   budget:1800, priceType:'fixed', public:true, schedule:'2026-09-14T10:00:00', steps:null, evidence:null,
   date:'2026-09-10T08:00:00', status:STATUS.open,
   applications:[{user:'u_moh',when:'2026-09-10T10:00:00',offer:1600,msg:'أستطيع الإنجاز صباحًا'}]},
  {id:'t9', client:'u_lina', assignee:'u_sara', title:'تعداد زوار محل لمدة يوم كامل', titleFr:'Comptage visiteurs boutique',
   desc:'تعداد الزوار مدخل/مخرج مع تسجيل كل ساعة على ورقة.',
   descFr:'Comptage entrées/sorties horaire.',
   cat:'c10', wilaya:19, lat:36.1911, lng:5.4100, town:'سطيف', addr:'وسط المدينة',
   budget:3000, priceType:'fixed', public:true, schedule:'2026-06-20T09:00:00', steps:null, evidence:null,
   date:'2026-06-15T11:00:00', status:STATUS.paid, applications:[{user:'u_sara',when:'2026-06-16T09:00:00',offer:3000,msg:''}], offerAmount:3000, paidOn:'2026-06-22T16:00:00'},
  {id:'t10', client:'u_me', assignee:null, title:'نقل أريكة من باب الوادي إلى المحرة', titleFr:'Déménager canapé',
   desc:'نقل أريكة 3 مقاعد بين شقتين بالعاصمة، المسافة 6 كم، مع مساعد.',
   descFr:'Canapé 3 places, 6 km.',
   cat:'c7', wilaya:16, lat:36.79, lng:3.05, town:'باب الوادي', addr:'حي باب الوادي',
   budget:5000, priceType:'negotiable', public:true, schedule:null, steps:null, evidence:null,
   date:'2026-09-10T07:00:00', status:STATUS.open, applications:[]}
];

const CHATS = [
  {id:'ch1', participants:['u_me','u_amina'], taskId:'t1',
   messages:[
     {from:'u_amina', text:'سلام، أنا متاحة اليوم لتوصيل الطرد. متى يناسبك؟', when:'2026-09-09T08:16:00', read:true},
     {from:'u_me', text:'أهلا أخت أمينة، يناسبني العاشرة صباحًا', when:'2026-09-09T08:20:00', read:true},
     {from:'u_amina', text:'ممتاز، سأكون عند باب الزوار قبل العاشرة بنصف ساعة', when:'2026-09-09T08:22:00', read:false}
   ]},
  {id:'ch2', participants:['u_me','u_karim'], taskId:'t3',
   messages:[
     {from:'u_karim', text:'أهلا أستاذ أمين، وصولي غدًا الثانية زوالًا بالضبط', when:'2026-09-09T09:05:00', read:true},
     {from:'u_me', text:'تمام، المفتاح موجود عند الحارس', when:'2026-09-09T09:12:00', read:true}
   ]},
  {id:'ch3', participants:['u_me','u_sara'], taskId:null,
   messages:[
     {from:'u_sara', text:'مرحبًا، انضممت حديثًا وأقدّم خدمات الجرد الآن', when:'2026-09-08T14:00:00', read:true}
   ]}
];

const WALLET = [
  {id:'w1', user:'u_me', type:'txDeposit', amount:10000, date:'2026-09-01T10:00:00', ref:'TOP-88213', status:'done'},
  {id:'w2', user:'u_me', type:'txEscrow', amount:-2500, date:'2026-09-08T10:30:00', ref:'ESC-t3', taskId:'t3', status:'hold'},
  {id:'w3', user:'u_me', type:'txEscrow', amount:-4000, date:'2026-09-05T09:30:00', ref:'ESC-t4', taskId:'t4', status:'hold'},
  {id:'w4', user:'u_me', type:'txRelease', amount:1500, date:'2026-09-03T12:00:00', ref:'REL-t-t1', taskId:'t1', status:'done'},
  {id:'w5', user:'u_me', type:'txWithdraw', amount:-3000, date:'2026-08-27T11:00:00', ref:'WDR-4410', status:'done'}
];

const NOTIFICATIONS = [
  {id:'n1', user:'u_me', kind:'notifApplied', taskId:'t1', read:false, date:'2026-09-09T08:15:00'},
  {id:'n2', user:'u_me', kind:'notifProof', taskId:'t4', read:false, date:'2026-09-09T09:00:00'},
  {id:'n3', user:'u_me', kind:'notifGeo', taskId:'t8', read:true, date:'2026-09-10T07:10:00'},
  {id:'n4', user:'u_me', kind:'notifMsg', chatId:'ch1', read:false, date:'2026-09-09T08:22:00'}
];

const DISPUTES = [
  {id:'d1', taskId:'t6', openedBy:'u_lina', reason:'الصور وصلت متأخرة وبجودة أقل من المتفق عليه', reasonFr:'Photos en retard et qualité moindre', when:'2026-07-18T10:00:00', status:'open', decision:null}
];

const RATINGS = [
  {id:'r1', taskId:'t5', from:'u_karim', to:'u_sara', stars:5, comment:'التزام بالوقت ومحترف', when:'2026-08-28T18:10:00'},
  {id:'r2', taskId:'t5', from:'u_sara', to:'u_karim', stars:5, comment:'دهن نظيف وسريع', when:'2026-08-28T20:00:00'},
  {id:'r3', taskId:'t9', from:'u_lina', to:'u_sara', stars:5, comment:'تقرير دقيق', when:'2026-06-22T16:30:00'}
];

const WATCHLISTS = [
  {id:'wl1', user:'u_me', name:'توصيل في العاصمة', nameFr:'Livraison Alger', filters:{cat:'c1', wilaya:16, max:2000}},
  {id:'wl2', user:'u_me', name:'صيانة قريبة', nameFr:'Maintenance proche', filters:{cat:'c4', wilaya:16, max:5000}}
];

const AUDIT = [
  {id:'a1', actor:'admin', action:'LOGIN', detail:'دخول إداري', detailFr:'Connexion admin', when:'2026-09-10T09:00:00'},
  {id:'a2', actor:'admin', action:'TASK_STATUS', detail:'تحويل مهمة t5 إلى مدفوعة', detailFr:'Tâche t5 payée', when:'2026-08-28T19:00:00'},
  {id:'a3', actor:'u_me', action:'LOGIN', detail:'دخول المستخدم أمين', detailFr:'Connexion Amine', when:'2026-09-09T08:00:00'},
  {id:'a4', actor:'u_me', action:'TASK_CREATE', detail:'إنشاء مهمة t1', detailFr:'Création tâche t1', when:'2026-09-08T10:20:00'}
];

const PLATFORM_SETTINGS = {
  name:'LiveSight', nameFr:'LiveSight', supportPhone:'0560 12 34 56',
  feePercent:5, minWithdraw:500, radiusDefault:15
};

/* ===================== Store ===================== */
const Store = {
  k:'ls_livesight_',
  read(key, fallback){ try{ const v = localStorage.getItem(this.k+key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } },
  write(key, val){ localStorage.setItem(this.k+key, JSON.stringify(val)); },
  del(key){ localStorage.removeItem(this.k+key); },
  db(){ let d = this.read('db', null); if(!d || d.__v !== this.version()){ d = this.seed(); this.write('db', d); } return d; },
  save(db){ this.write('db', db); },
  uid(){ return 'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,7); },
  seed(){
    return { __v:this.version(), users:JSON.parse(JSON.stringify(USERS)), tasks:JSON.parse(JSON.stringify(TASKS)),
      chats:JSON.parse(JSON.stringify(CHATS)), wallet:JSON.parse(JSON.stringify(WALLET)),
      notifs:JSON.parse(JSON.stringify(NOTIFICATIONS)), disputes:JSON.parse(JSON.stringify(DISPUTES)),
      ratings:JSON.parse(JSON.stringify(RATINGS)), watchlist:JSON.parse(JSON.stringify(WATCHLISTS)),
      audit:JSON.parse(JSON.stringify(AUDIT)), cats:JSON.parse(JSON.stringify(CATEGORIES)),
      wilayas:JSON.parse(JSON.stringify(WILAYAS)), settings:JSON.parse(JSON.stringify(PLATFORM_SETTINGS)) };
  },
  reset(){ localStorage.removeItem(this.k+'db'); this.save(this.seed()); },
  version(){ return 4; }
};

/* ===================== Helpers ===================== */
const Helpers = {
  esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); },
  money(n){ const s = Math.round(n).toLocaleString(langState.lang==='ar' ? 'fr-DZ' : 'fr-FR'); return langState.lang==='ar' ? s+' دج' : s+' DA'; },
  date(iso){
    if(!iso) return '';
    const d = new Date(iso);
    try{ return d.toLocaleString(langState.lang==='ar' ? 'ar-DZ' : 'fr-FR', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); }
    catch(e){ return d.toLocaleString(); }
  },
  wilaya(id){ const w = WILAYAS.find(x=>x[0]==id); return w ? (langState.lang==='ar' ? w[1] : w[2]) : ''; },
  wilayaObj(id){ return WILAYAS.find(x=>x[0]==id); },
  cat(id){ const d = Store.db().cats.find(c=>c.id===id); return d ? (langState.lang==='ar' ? d.ar : d.fr) : ''; },
  catObj(id){ return Store.db().cats.find(c=>c.id===id); },
  user(id){ return Store.db().users.find(u=>u.id===id); },
  userName(u){ if(!u) return ''; return langState.lang==='ar' ? u.name : (u.nameFr||u.name); },
  initials(name){ return String(name||'؟').trim().charAt(0); },
  statusKey(s){ for(const k in STATUS) if(STATUS[k]===s) return k; return 'open'; },
  statusTxt(s){ return I18n.t(Helpers.statusKey(s)); },
  dist(a, b){
    const R=6371, dLat=(b[0]-a[0])*Math.PI/180, dLng=(b[1]-a[1])*Math.PI/180;
    const x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
    return Math.round(R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))*10)/10;
  },
  levelOf(points){ return points>=400?'pro':(points>=150?'trusted':'junior'); },
  levelKey(u){ return u.level || Helpers.levelOf(u.points); },
  stars(u){ return u.rating||0; },
  ratingStars(v){ let h=''; for(let i=1;i<=5;i++){ h += `<span class="${i<=Math.round(v||0)?'':'dim'}">★</span>`; } return `<span class="rating-stars">${h}</span>`; },
  badgeIcon(b){ const i=(typeof ICONS!=='undefined')?ICONS:{}; return {star:i.award, ring:i.shield, diamond:i.diamond}[b] || i.award || ''; },
  fmtNum(n){ return (n||0).toLocaleString(langState.lang==='ar'?'fr-DZ':'fr-FR'); },
  trunc(s,n){ s=String(s||''); return s.length>n? s.slice(0,n)+'…' : s; },
  groupBy(arr, fn){ return arr.reduce((a,x)=>{ const k=fn(x); (a[k]=a[k]||[]).push(x); return a; }, {}); }
};

const Toast = {
  show(msg, type='ok'){
    let box = document.getElementById('toasts');
    if(!box){ box=document.createElement('div'); box.id='toasts'; document.body.appendChild(box); }
    const el=document.createElement('div'); el.className='toast '+type; el.textContent=msg;
    box.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transition='.3s'; setTimeout(()=>el.remove(),300); }, 3200);
  }
};

const Audit = {
  log(db, actor, action, detail, detailFr){ db.audit.unshift({id:Store.uid(), actor, action, detail, detailFr, when:new Date().toISOString()}); }
};

const Dom = {
  el(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstChild; },
  onBody(type, sel, fn){ document.addEventListener(type, e=>{ const t=e.target.closest(sel); if(t) fn(e, t); }); },
  esc: Helpers.esc
};
window.Store=Store; window.Helpers=Helpers; window.Toast=Toast; window.Audit=Audit;
window.WILAYAS=WILAYAS; window.CATEGORIES=CATEGORIES; window.STATUS=STATUS;