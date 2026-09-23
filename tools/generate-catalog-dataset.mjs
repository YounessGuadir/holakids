import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(here, '../backend/src/main/resources/datasets/products.json')

const colors = [
  ['Bleu océan', 'أزرق محيطي'], ['Rouge corail', 'أحمر مرجاني'],
  ['Vert menthe', 'أخضر نعناعي'], ['Jaune soleil', 'أصفر مشمس'],
  ['Rose poudré', 'وردي ناعم'], ['Violet', 'بنفسجي'],
  ['Orange', 'برتقالي'], ['Multicolore', 'متعدد الألوان'],
]

const collections = [
  ['Découverte', 'الاكتشاف'], ['Aventure', 'المغامرة'], ['Création', 'الإبداع'],
  ['Explorer', 'المستكشف'], ['Junior', 'الصغار'], ['Maxi', 'ماكسي'],
  ['Mini', 'ميني'], ['Premium', 'المميز'], ['Famille', 'العائلة'],
  ['Étoile', 'النجمة'], ['Arc-en-ciel', 'قوس قزح'], ['Champion', 'البطل'],
]

const categorySpecs = [
  {
    slug: 'lego-construction', count: 40, code: 'BLD', nameFr: 'LEGO & jeux de construction', nameAr: 'ليغو وألعاب التركيب',
    descriptionFr: 'Briques, blocs et constructions pour imaginer sans limite.', descriptionAr: 'مكعبات وألعاب تركيب لتنمية الخيال والإبداع.',
    imageUrl: '/images/products/wooden-blocks.png', color: '#fff5d9', brand: 'Buildy', basePrice: 89, step: 24,
    types: [['Coffret de briques', 'علبة مكعبات'], ['Ville à construire', 'مدينة للتركيب'], ['Robot à assembler', 'روبوت للتركيب'], ['Maison créative', 'منزل إبداعي']],
    subs: [['Briques classiques', 'مكعبات كلاسيكية'], ['Construction technique', 'تركيب تقني'], ['Univers urbain', 'عالم المدينة']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]],
  },
  {
    slug: 'vehicules', count: 34, code: 'VEH', nameFr: 'Voitures & véhicules', nameAr: 'السيارات والمركبات',
    descriptionFr: 'Voitures, camions et véhicules miniatures pour toutes les aventures.', descriptionAr: 'سيارات وشاحنات ومركبات مصغرة لمغامرات متنوعة.',
    imageUrl: '/images/products/racing-car.png', color: '#e8f4ff', brand: 'Roadster Kids', basePrice: 69, step: 18,
    types: [['Voiture de course', 'سيارة سباق'], ['Camion de chantier', 'شاحنة بناء'], ['Bus urbain', 'حافلة المدينة'], ['Véhicule de secours', 'مركبة إنقاذ']],
    subs: [['Mini véhicules', 'مركبات صغيرة'], ['Radiocommandés', 'مركبات بالتحكم'], ['Véhicules métal', 'مركبات معدنية']], ages: [['3-5', 3, 5], ['6-8', 6, 8]],
  },
  {
    slug: 'circuits', count: 22, code: 'TRK', nameFr: 'Circuits', nameAr: 'حلبات السباق',
    descriptionFr: 'Circuits modulaires, garages et pistes de course.', descriptionAr: 'حلبات قابلة للتركيب ومرائب ومسارات سباق.',
    imageUrl: '/images/products/toy-garage.png', color: '#eaf7ff', brand: 'LoopLab', basePrice: 179, step: 35,
    types: [['Circuit looping', 'حلبة حلقية'], ['Garage multiétage', 'مرآب متعدد الطوابق'], ['Piste turbo', 'مسار توربو']],
    subs: [['Pistes', 'مسارات'], ['Garages', 'مرائب'], ['Circuits électriques', 'حلبات كهربائية']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]],
  },
  {
    slug: 'poupees', count: 34, code: 'DOL', nameFr: 'Poupées', nameAr: 'الدمى',
    descriptionFr: 'Poupées, maisons et accessoires pour inventer des histoires.', descriptionAr: 'دمى وبيوت وإكسسوارات لابتكار القصص.',
    imageUrl: '/images/products/dollhouse.png', color: '#fff0f6', brand: 'Mila & Co', basePrice: 99, step: 29,
    types: [['Poupée aventure', 'دمية المغامرة'], ['Maison de poupées', 'بيت الدمى'], ['Famille miniature', 'عائلة مصغرة'], ['Coffret accessoires', 'علبة إكسسوارات']],
    subs: [['Poupées mode', 'دمى الأزياء'], ['Maisons', 'بيوت الدمى'], ['Accessoires', 'إكسسوارات']], ages: [['3-5', 3, 5], ['6-8', 6, 8]],
  },
  {
    slug: 'figurines', count: 28, code: 'FIG', nameFr: 'Figurines', nameAr: 'المجسمات',
    descriptionFr: 'Personnages, animaux et univers miniatures à collectionner.', descriptionAr: 'شخصيات وحيوانات وعوالم مصغرة للجمع واللعب.',
    imageUrl: '/images/products/fashion-doll.png', color: '#f0edff', brand: 'HeroBox', basePrice: 59, step: 16,
    types: [['Figurine explorateur', 'مجسم مستكشف'], ['Équipe de héros', 'فريق أبطال'], ['Animaux de la savane', 'حيوانات السافانا'], ['Monde fantastique', 'عالم خيالي']],
    subs: [['Personnages', 'شخصيات'], ['Animaux', 'حيوانات'], ['Coffrets', 'مجموعات']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]],
  },
  {
    slug: 'jeux-societe', count: 32, code: 'JDS', nameFr: 'Jeux de société', nameAr: 'ألعاب جماعية',
    descriptionFr: 'Jeux de plateau, cartes et défis à partager en famille.', descriptionAr: 'ألعاب لوحية وبطاقات وتحديات للعائلة والأصدقاء.',
    imageUrl: '/images/products/art-kit.png', color: '#fff6e6', brand: 'FamilyFun', basePrice: 79, step: 21,
    types: [['Jeu de stratégie', 'لعبة استراتيجية'], ['Défi famille', 'تحدي العائلة'], ['Jeu de cartes', 'لعبة بطاقات'], ['Course au trésor', 'سباق الكنز']],
    subs: [['Plateau', 'ألعاب لوحية'], ['Cartes', 'بطاقات'], ['Ambiance', 'ألعاب ترفيهية']], ages: [['6-8', 6, 8], ['9-11', 9, 11], ['12+', 12, 99]],
  },
  {
    slug: 'educatifs', count: 30, code: 'EDU', nameFr: 'Jeux éducatifs', nameAr: 'ألعاب تعليمية',
    descriptionFr: 'Apprendre les lettres, les nombres et le monde en jouant.', descriptionAr: 'تعلم الحروف والأرقام واكتشاف العالم عن طريق اللعب.',
    imageUrl: '/images/products/wooden-blocks.png', color: '#e9f9f1', brand: 'EduJoy', basePrice: 69, step: 19,
    types: [['Tableau d’apprentissage', 'لوحة تعليمية'], ['Alphabet ludique', 'حروف تعليمية'], ['Calcul malin', 'حساب ممتع'], ['Cartes découverte', 'بطاقات الاكتشاف']],
    subs: [['Préscolaire', 'ما قبل المدرسة'], ['Lecture', 'القراءة'], ['Mathématiques', 'الرياضيات']], ages: [['0-2', 1, 2], ['3-5', 3, 5], ['6-8', 6, 8]],
  },
  {
    slug: 'scientifiques', count: 22, code: 'SCI', nameFr: 'Jeux scientifiques', nameAr: 'ألعاب علمية',
    descriptionFr: 'Expériences, observation et robotique adaptées aux enfants.', descriptionAr: 'تجارب وملاحظة وروبوتيك مناسبة للأطفال.',
    imageUrl: '/images/products/science-kit.png', color: '#e9f6ff', brand: 'LabKidz', basePrice: 119, step: 31,
    types: [['Laboratoire junior', 'مختبر الصغار'], ['Microscope découverte', 'مجهر الاكتشاف'], ['Robot éducatif', 'روبوت تعليمي'], ['Coffret espace', 'علبة الفضاء']],
    subs: [['Expériences', 'تجارب'], ['Observation', 'ملاحظة'], ['Robotique', 'روبوتيك']], ages: [['6-8', 6, 8], ['9-11', 9, 11], ['12+', 12, 99]],
  },
  {
    slug: 'peluches', count: 24, code: 'PLU', nameFr: 'Peluches', nameAr: 'دمى محشوة',
    descriptionFr: 'Compagnons tout doux, animaux et peluches d’éveil.', descriptionAr: 'رفقاء ناعمون وحيوانات محشوة وألعاب حسية.',
    imageUrl: '/images/products/teddy-bear.png', color: '#fff1e9', brand: 'DouDou Maison', basePrice: 59, step: 17,
    types: [['Ours tout doux', 'دب ناعم'], ['Lapin câlin', 'أرنب لطيف'], ['Panda douceur', 'باندا ناعم'], ['Animal musical', 'حيوان موسيقي']],
    subs: [['Animaux', 'حيوانات'], ['Musicales', 'موسيقية'], ['Grand format', 'حجم كبير']], ages: [['0-2', 0, 2], ['3-5', 3, 5], ['6-8', 6, 8]],
  },
  {
    slug: 'bebe-eveil', count: 34, code: 'BBE', nameFr: 'Jouets bébé & éveil', nameAr: 'ألعاب الرضع وتنمية الحواس',
    descriptionFr: 'Tapis, hochets et jeux sensoriels pour les premiers mois.', descriptionAr: 'حصائر وخشخيشات وألعاب حسية للأشهر الأولى.',
    imageUrl: '/images/products/baby-playmat.png', color: '#fff2e8', brand: 'Petit Éveil', basePrice: 49, step: 27,
    types: [['Tapis d’éveil', 'حصيرة أنشطة'], ['Hochet sensoriel', 'خشخيشة حسية'], ['Arche musicale', 'قوس موسيقي'], ['Cube d’activités', 'مكعب أنشطة']],
    subs: [['Éveil sensoriel', 'تنمية الحواس'], ['Tapis', 'حصائر'], ['Jouets de bain', 'ألعاب الحمام']], ages: [['0-2', 0, 2]],
  },
  {
    slug: 'puzzles', count: 22, code: 'PUZ', nameFr: 'Puzzles', nameAr: 'ألعاب الألغاز',
    descriptionFr: 'Puzzles progressifs, cartes du monde et défis visuels.', descriptionAr: 'ألغاز تدريجية وخرائط وتحديات بصرية.',
    imageUrl: '/images/products/wooden-blocks.png', color: '#f0f8e8', brand: 'Puzzlea', basePrice: 49, step: 15,
    types: [['Puzzle animaux', 'لغز الحيوانات'], ['Carte du monde', 'خريطة العالم'], ['Puzzle château', 'لغز القلعة'], ['Défi logique', 'تحدي المنطق']],
    subs: [['Bois', 'خشبية'], ['Carton', 'كرتونية'], ['Logique', 'منطق']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]],
  },
  {
    slug: 'creatifs', count: 28, code: 'CRE', nameFr: 'Dessin & activités créatives', nameAr: 'الرسم والأنشطة الإبداعية',
    descriptionFr: 'Dessin, peinture, modelage et loisirs créatifs.', descriptionAr: 'الرسم والتلوين والتشكيل والأنشطة الفنية.',
    imageUrl: '/images/products/creative-kit.png', color: '#f4edff', brand: 'CréaMix', basePrice: 59, step: 20,
    types: [['Mallette de dessin', 'حقيبة رسم'], ['Atelier peinture', 'ورشة تلوين'], ['Pâte à modeler', 'صلصال'], ['Coffret bijoux', 'علبة صنع الحلي']],
    subs: [['Dessin', 'رسم'], ['Modelage', 'تشكيل'], ['DIY', 'أشغال يدوية']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]],
  },
  {
    slug: 'plein-air', count: 13, code: 'OUT', nameFr: 'Jeux d’extérieur', nameAr: 'ألعاب خارجية',
    descriptionFr: 'Jeux de jardin, eau, sable et activités en plein air.', descriptionAr: 'ألعاب الحديقة والماء والرمل والأنشطة الخارجية.',
    imageUrl: '/images/products/outdoor-set.png', color: '#e8f8ed', brand: 'GardenPlay', basePrice: 89, step: 42,
    types: [['Jeu de quilles', 'لعبة البولينغ'], ['Cible de jardin', 'هدف الحديقة'], ['Table sable et eau', 'طاولة الرمل والماء'], ['Tente de jeu', 'خيمة لعب']],
    subs: [['Jardin', 'الحديقة'], ['Sable et eau', 'الرمل والماء'], ['Adresse', 'الدقة']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]],
  },
  {
    slug: 'sport-ballons', count: 10, code: 'SPT', nameFr: 'Ballons & sport', nameAr: 'الكرات والرياضة',
    descriptionFr: 'Ballons, mini-buts et jeux sportifs pour bouger.', descriptionAr: 'كرات ومرامي صغيرة وألعاب رياضية للحركة.',
    imageUrl: '/images/products/outdoor-set.png', color: '#e9f5ff', brand: 'Sporti', basePrice: 59, step: 31,
    types: [['Ballon junior', 'كرة للصغار'], ['Mini-but pliable', 'مرمى صغير قابل للطي'], ['Panier de basket', 'سلة كرة السلة'], ['Set multisport', 'مجموعة رياضية']],
    subs: [['Football', 'كرة القدم'], ['Basket', 'كرة السلة'], ['Multisport', 'رياضات متعددة']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]],
  },
  {
    slug: 'velos-enfants', count: 16, code: 'BIK', nameFr: 'Vélos enfants', nameAr: 'دراجات الأطفال',
    descriptionFr: 'Vélos adaptés aux différentes tailles et étapes d’apprentissage.', descriptionAr: 'دراجات مناسبة لمختلف الأطوال ومراحل التعلم.',
    imageUrl: '/images/products/balance-bike.png', color: '#eaf4ff', brand: 'VéloKid', basePrice: 799, step: 145,
    types: [['Vélo enfant', 'دراجة أطفال'], ['Vélo aventure', 'دراجة المغامرة'], ['Vélo urbain', 'دراجة المدينة']],
    subs: [['12 pouces', '12 بوصة'], ['14 pouces', '14 بوصة'], ['16 pouces', '16 بوصة'], ['20 pouces', '20 بوصة']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]], ride: true,
  },
  {
    slug: 'trottinettes', count: 14, code: 'SCO', nameFr: 'Trottinettes', nameAr: 'السكوترات',
    descriptionFr: 'Trottinettes deux ou trois roues, réglables et pliables.', descriptionAr: 'سكوترات بعجلتين أو ثلاث عجلات، قابلة للتعديل والطي.',
    imageUrl: '/images/products/scooter.png', color: '#edf2ff', brand: 'ScootGo', basePrice: 349, step: 95,
    types: [['Trottinette pliable', 'سكوتر قابل للطي'], ['Trottinette lumineuse', 'سكوتر مضيء'], ['Trottinette junior', 'سكوتر للصغار']],
    subs: [['2 roues', 'عجلتان'], ['3 roues', 'ثلاث عجلات'], ['Pliable', 'قابل للطي']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]], ride: true,
  },
  {
    slug: 'draisiennes', count: 9, code: 'BAL', nameFr: 'Draisiennes', nameAr: 'دراجات التوازن',
    descriptionFr: 'Draisiennes légères pour apprendre l’équilibre en confiance.', descriptionAr: 'دراجات توازن خفيفة لتعلم التوازن بثقة.',
    imageUrl: '/images/products/balance-bike.png', color: '#eafaf4', brand: 'FirstRide', basePrice: 449, step: 83,
    types: [['Draisienne légère', 'دراجة توازن خفيفة'], ['Draisienne évolutive', 'دراجة توازن متطورة'], ['Draisienne confort', 'دراجة توازن مريحة']],
    subs: [['Métal', 'معدنية'], ['Bois', 'خشبية'], ['Évolutive', 'متطورة']], ages: [['0-2', 2, 3], ['3-5', 3, 5]], ride: true,
  },
  {
    slug: 'tricycles', count: 7, code: 'TRI', nameFr: 'Tricycles', nameAr: 'دراجات ثلاثية',
    descriptionFr: 'Tricycles stables et évolutifs pour les premières promenades.', descriptionAr: 'دراجات ثلاثية ثابتة ومتطورة للنزهات الأولى.',
    imageUrl: '/images/products/balance-bike.png', color: '#fff3e8', brand: 'TrioMove', basePrice: 599, step: 124,
    types: [['Tricycle évolutif', 'دراجة ثلاثية متطورة'], ['Tricycle avec poignée', 'دراجة ثلاثية بمقبض'], ['Tricycle compact', 'دراجة ثلاثية مدمجة']],
    subs: [['Avec poignée', 'بمقبض'], ['Évolutif', 'متطور'], ['Compact', 'مدمج']], ages: [['0-2', 1, 2], ['3-5', 3, 5]], ride: true,
  },
  {
    slug: 'voitures-electriques', count: 9, code: 'ELC', nameFr: 'Voitures électriques enfants', nameAr: 'سيارات كهربائية للأطفال',
    descriptionFr: 'Véhicules électriques avec vitesse limitée et télécommande parentale.', descriptionAr: 'مركبات كهربائية بسرعة محدودة وتحكم عن بعد للوالدين.',
    imageUrl: '/images/products/rc-truck.png', color: '#f1f3f7', brand: 'E-Drive Kids', basePrice: 1699, step: 310,
    types: [['Buggy électrique', 'باغي كهربائي'], ['Voiture électrique', 'سيارة كهربائية'], ['4x4 enfant', 'سيارة دفع رباعي للأطفال']],
    subs: [['6 V', '6 فولت'], ['12 V', '12 فولت'], ['Télécommandée', 'بتحكم عن بعد']], ages: [['3-5', 3, 5], ['6-8', 6, 8]], ride: true,
  },
  {
    slug: 'casques-protections', count: 6, code: 'SAF', nameFr: 'Casques & protections', nameAr: 'الخوذ ووسائل الحماية',
    descriptionFr: 'Casques et protections adaptés au vélo et à la trottinette.', descriptionAr: 'خوذ ووسائل حماية مناسبة للدراجة والسكوتر.',
    imageUrl: '/images/products/scooter.png', color: '#fff0ec', brand: 'SafeRide', basePrice: 129, step: 54,
    types: [['Casque réglable', 'خوذة قابلة للتعديل'], ['Set de protections', 'طقم حماية'], ['Casque ventilation', 'خوذة بتهوية']],
    subs: [['Casques', 'خوذ'], ['Genoux et coudes', 'حماية الركب والمرافق']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]], safety: true,
  },
  {
    slug: 'accessoires-mobilite', count: 6, code: 'ACC', nameFr: 'Accessoires vélos & trottinettes', nameAr: 'إكسسوارات الدراجات والسكوترات',
    descriptionFr: 'Sonnettes, paniers, éclairage et accessoires pratiques.', descriptionAr: 'أجراس وسلال وإضاءة وإكسسوارات عملية.',
    imageUrl: '/images/products/scooter.png', color: '#edf8ff', brand: 'RideKit', basePrice: 49, step: 33,
    types: [['Panier avant', 'سلة أمامية'], ['Sonnette colorée', 'جرس ملون'], ['Kit éclairage', 'طقم إضاءة'], ['Sac de guidon', 'حقيبة مقود']],
    subs: [['Sécurité', 'السلامة'], ['Rangement', 'التخزين'], ['Personnalisation', 'التخصيص']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]],
  },
  {
    slug: 'autres-jouets', count: 20, code: 'FUN', nameFr: 'Autres jouets populaires', nameAr: 'ألعاب شعبية أخرى',
    descriptionFr: 'Une sélection variée de jouets appréciés des enfants.', descriptionAr: 'تشكيلة متنوعة من الألعاب المحبوبة لدى الأطفال.',
    imageUrl: '/images/products/creative-kit.png', color: '#f7f0ff', brand: 'FunBox', basePrice: 69, step: 23,
    types: [['Jeu surprise', 'لعبة مفاجأة'], ['Coffret aventure', 'علبة مغامرة'], ['Jeu musical', 'لعبة موسيقية'], ['Mini univers', 'عالم مصغر']],
    subs: [['Tendance', 'رائجة'], ['Musical', 'موسيقية'], ['Imitation', 'تقليد']], ages: [['3-5', 3, 5], ['6-8', 6, 8], ['9-11', 9, 11]],
  },
]

function roundPrice(value) {
  return Math.round(value / 5) * 5
}

function attributesFor(spec, index, color) {
  const material = index % 3 === 0 ? ['Bois certifié et plastique', 'خشب معتمد وبلاستيك'] : ['Matériaux adaptés aux enfants', 'مواد مناسبة للأطفال']
  const common = [
    { name: 'color', valueFr: color[0], valueAr: color[1] },
    { name: 'material', valueFr: material[0], valueAr: material[1] },
  ]
  if (spec.ride) {
    const wheelSizes = ['10 pouces', '12 pouces', '14 pouces', '16 pouces', '20 pouces']
    const wheels = spec.slug === 'trottinettes' ? (index % 2 === 0 ? 2 : 3) : spec.slug === 'tricycles' ? 3 : 2
    return [
      ...common,
      { name: 'wheelSize', valueFr: wheelSizes[index % wheelSizes.length], valueAr: wheelSizes[index % wheelSizes.length].replace('pouces', 'بوصة') },
      { name: 'maxWeightKg', valueFr: `${30 + (index % 5) * 5} kg`, valueAr: `${30 + (index % 5) * 5} كلغ` },
      { name: 'foldable', valueFr: index % 2 === 0 ? 'Oui' : 'Non', valueAr: index % 2 === 0 ? 'نعم' : 'لا' },
      { name: 'recommendedHeight', valueFr: `${90 + (index % 5) * 10}–${120 + (index % 5) * 10} cm`, valueAr: `${90 + (index % 5) * 10}–${120 + (index % 5) * 10} سم` },
      { name: 'numberOfWheels', valueFr: String(wheels), valueAr: String(wheels) },
    ]
  }
  if (spec.slug === 'lego-construction') {
    return [...common,
      { name: 'pieces', valueFr: `${80 + (index % 12) * 45} pièces`, valueAr: `${80 + (index % 12) * 45} قطعة` },
      { name: 'theme', valueFr: spec.subs[index % spec.subs.length][0], valueAr: spec.subs[index % spec.subs.length][1] },
    ]
  }
  if (spec.safety) {
    return [...common,
      { name: 'size', valueFr: `${48 + (index % 4) * 2}–${52 + (index % 4) * 2} cm`, valueAr: `${48 + (index % 4) * 2}–${52 + (index % 4) * 2} سم` },
      { name: 'adjustable', valueFr: 'Oui', valueAr: 'نعم' },
    ]
  }
  return [...common,
    { name: 'skill', valueFr: index % 2 === 0 ? 'Imagination et motricité' : 'Logique et observation', valueAr: index % 2 === 0 ? 'الخيال والمهارات الحركية' : 'المنطق والملاحظة' },
    { name: 'players', valueFr: index % 3 === 0 ? '1 à 4 enfants' : '1 enfant et plus', valueAr: index % 3 === 0 ? 'من 1 إلى 4 أطفال' : 'طفل واحد أو أكثر' },
  ]
}

let sequence = 1
const products = []

for (const spec of categorySpecs) {
  for (let index = 0; index < spec.count; index += 1) {
    const type = spec.types[index % spec.types.length]
    const collection = collections[(index + spec.code.length) % collections.length]
    const color = colors[index % colors.length]
    const age = spec.ages[index % spec.ages.length]
    const sub = spec.subs[index % spec.subs.length]
    const model = String(index + 1).padStart(2, '0')
    const serial = String(sequence).padStart(4, '0')
    const nameFr = `${type[0]} ${collection[0]} ${model}`
    const nameAr = `${type[1]} ${collection[1]} ${model}`
    const price = roundPrice(spec.basePrice + (index % 7) * spec.step + Math.floor(index / 7) * 15)
    const promotion = index % 7 === 0
    const oldPrice = promotion ? roundPrice(price * 1.2) : null
    const stock = index % 17 === 0 ? 0 : 2 + ((index * 7 + spec.count) % 24)
    const mainImage = spec.imageUrl
    const secondaryImage = index % 3 === 0 ? '/images/products/wooden-blocks.png'
      : index % 3 === 1 ? '/images/products/art-kit.png' : spec.imageUrl

    products.push({
      externalId: `HKDS-2026-${serial}`,
      sku: `HK-${spec.code}-${serial}`,
      slug: `${spec.slug}-${model}-${serial}`,
      nameFr,
      nameAr,
      shortNameFr: nameFr,
      shortNameAr: nameAr,
      descriptionFr: `${nameFr} est une référence de la sélection HOLAKIDS pensée pour un usage familial. Elle favorise le jeu, l’autonomie et les moments partagés, avec des caractéristiques adaptées à l’âge recommandé.`,
      descriptionAr: `${nameAr} منتج من تشكيلة HOLAKIDS العائلية. يساعد على اللعب والاستقلالية وقضاء وقت ممتع، مع خصائص مناسبة للعمر الموصى به.`,
      brand: index % 5 === 0 ? 'HOLAKIDS Selection' : spec.brand,
      categorySlug: spec.slug,
      subCategoryFr: sub[0],
      subCategoryAr: sub[1],
      ageRange: age[0],
      ageMin: age[1],
      ageMax: age[2] === 99 ? null : age[2],
      genderTarget: 'UNISEX',
      price,
      oldPrice,
      stock,
      promotion,
      newProduct: index % 11 === 0,
      featured: index % 13 === 0,
      active: true,
      rating: Number((3.8 + ((index * 3 + spec.count) % 12) / 10).toFixed(1)),
      reviewCount: 4 + ((index * 17 + spec.count) % 240),
      mainImage,
      images: [
        { url: mainImage, altFr: nameFr, altAr: nameAr },
        { url: secondaryImage, altFr: `${nameFr} – vue complémentaire`, altAr: `${nameAr} – صورة إضافية` },
      ],
      featuresFr: [
        `Recommandé de ${age[1]}${age[2] === 99 ? ' ans et plus' : ` à ${age[2]} ans`}`,
        'Conçu pour un usage familial et un rangement facile',
        'Contrôle visuel du produit conseillé avant utilisation',
      ],
      featuresAr: [
        age[2] === 99 ? `موصى به ابتداء من ${age[1]} سنة` : `موصى به من ${age[1]} إلى ${age[2]} سنوات`,
        'مصمم للاستعمال العائلي وسهل التخزين',
        'ينصح بفحص المنتج بصريا قبل الاستعمال',
      ],
      attributes: attributesFor(spec, index, color),
    })
    sequence += 1
  }
}

const expectedCountsByCategory = Object.fromEntries(categorySpecs.map((category) => [category.slug, category.count]))
const dataset = {
  metadata: {
    name: 'HOLAKIDS Original Demo Catalogue',
    version: '2026.09',
    generatedAt: '2026-09-23',
    taxonomySource: 'Shopify Standard Product Taxonomy (classification inspiration only)',
    taxonomyLicense: 'MIT',
    expectedProductCount: products.length,
    expectedCountsByCategory,
  },
  categories: categorySpecs.map((category, index) => ({
    slug: category.slug,
    nameFr: category.nameFr,
    nameAr: category.nameAr,
    descriptionFr: category.descriptionFr,
    descriptionAr: category.descriptionAr,
    imageUrl: category.imageUrl,
    color: category.color,
    displayOrder: index + 1,
  })),
  products,
}

if (products.length !== 460) {
  throw new Error(`Le catalogue doit contenir 460 produits, reçu ${products.length}`)
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8')
console.log(`Dataset généré: ${products.length} produits dans ${outputPath}`)
