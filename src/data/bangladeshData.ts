export interface DistrictData {
  district: string;
  thanas: string[];
}

export interface DivisionData {
  id: string;
  nameEn: string;
  nameBn: string;
  districts: string[];
}

export const BANGLADESH_DIVISIONS: DivisionData[] = [
  {
    id: "Dhaka",
    nameEn: "Dhaka",
    nameBn: "ঢাকা",
    districts: [
      "Dhaka", "Gazipur", "Narayanganj", "Tangail", "Narsingdi", "Faridpur",
      "Madaripur", "Manikganj", "Munshiganj", "Rajbari", "Shariatpur", "Gopalganj", "Kishoreganj"
    ]
  },
  {
    id: "Chattogram",
    nameEn: "Chattogram",
    nameBn: "চট্টগ্রাম",
    districts: [
      "Chattogram (Chittagong)", "Cox's Bazar", "Cumilla (Comilla)", "Feni",
      "Brahmanbaria", "Noakhali", "Chandpur", "Lakshmipur", "Khagrachhari", "Rangamati", "Bandarban"
    ]
  },
  {
    id: "Rajshahi",
    nameEn: "Rajshahi",
    nameBn: "রাজশাহী",
    districts: [
      "Rajshahi", "Bogura (Bogra)", "Pabna", "Natore", "Naogaon", "Sirajganj", "Joypurhat", "Chapainawabganj"
    ]
  },
  {
    id: "Khulna",
    nameEn: "Khulna",
    nameBn: "খুলনা",
    districts: [
      "Khulna", "Jashore (Jessore)", "Kushtia", "Satkhira", "Bagerhat", "Jhenaidah",
      "Chuadanga", "Meherpur", "Narail", "Magura"
    ]
  },
  {
    id: "Barishal",
    nameEn: "Barishal",
    nameBn: "বরিশাল",
    districts: [
      "Barishal (Barisal)", "Bhola", "Patuakhali", "Pirojpur", "Barguna", "Jhalokati"
    ]
  },
  {
    id: "Sylhet",
    nameEn: "Sylhet",
    nameBn: "সিলেট",
    districts: [
      "Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"
    ]
  },
  {
    id: "Rangpur",
    nameEn: "Rangpur",
    nameBn: "রংপুর",
    districts: [
      "Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Nilphamari", "Panchagarh", "Thakurgaon", "Lalmonirhat"
    ]
  },
  {
    id: "Mymensingh",
    nameEn: "Mymensingh",
    nameBn: "ময়মনসিংহ",
    districts: [
      "Mymensingh", "Jamalpur", "Sherpur", "Netrokona"
    ]
  }
];

export const DISTRICT_BANGLA_NAMES: Record<string, string> = {
  "Dhaka": "ঢাকা",
  "Gazipur": "গাজীপুর",
  "Narayanganj": "নারায়ণগঞ্জ",
  "Tangail": "টাঙ্গাইল",
  "Narsingdi": "নরসিংদী",
  "Faridpur": "ফরিদপুর",
  "Madaripur": "মাদারীপুর",
  "Manikganj": "মানিকগঞ্জ",
  "Munshiganj": "মুন্সীগঞ্জ",
  "Rajbari": "রাজবাড়ী",
  "Shariatpur": "শরীয়তপুর",
  "Gopalganj": "গোপালগঞ্জ",
  "Kishoreganj": "কিশোরগঞ্জ",

  "Chattogram (Chittagong)": "চট্টগ্রাম",
  "Cox's Bazar": "কক্সবাজার",
  "Cumilla (Comilla)": "কুমিল্লা",
  "Feni": "ফেনী",
  "Brahmanbaria": "ব্রাহ্মণবাড়িয়া",
  "Noakhali": "নোয়াখালী",
  "Chandpur": "চাঁদপুর",
  "Lakshmipur": "লক্ষ্মীপুর",
  "Khagrachhari": "খাগড়াছড়ি",
  "Rangamati": "রাঙ্গামাটি",
  "Bandarban": "বান্দরবান",

  "Rajshahi": "রাজশাহী",
  "Bogura (Bogra)": "বগুড়া",
  "Pabna": "পাবনা",
  "Natore": "নাটোর",
  "Naogaon": "নওগাঁ",
  "Sirajganj": "সিরাজগঞ্জ",
  "Joypurhat": "জয়পুরহাট",
  "Chapainawabganj": "চাঁপাইনবাবগঞ্জ",

  "Khulna": "খুলনা",
  "Jashore (Jessore)": "যশোর",
  "Kushtia": "কুষ্টিয়া",
  "Satkhira": "সাতক্ষীরা",
  "Bagerhat": "বাগেরহাট",
  "Jhenaidah": "ঝিনাইদহ",
  "Chuadanga": "চুয়াডাঙ্গা",
  "Meherpur": "মেহেরপুর",
  "Narail": "নড়াইল",
  "Magura": "মাগুরা",

  "Barishal (Barisal)": "বরিশাল",
  "Bhola": "ভোলা",
  "Patuakhali": "পটুয়াখালী",
  "Pirojpur": "পিরোজপুর",
  "Barguna": "বরগুনা",
  "Jhalokati": "ঝালকাঠি",

  "Sylhet": "সিলেট",
  "Moulvibazar": "মৌলভীবাজার",
  "Habiganj": "হবিগঞ্জ",
  "Sunamganj": "সুনামগঞ্জ",

  "Rangpur": "রংপুর",
  "Dinajpur": "দিনাজপুর",
  "Gaibandha": "গাইবান্ধা",
  "Kurigram": "কুড়িগ্রাম",
  "Nilphamari": "নীলফামারী",
  "Panchagarh": "পঞ্চগড়",
  "Thakurgaon": "ঠাকুরগাঁও",
  "Lalmonirhat": "লালমনিরহাট",

  "Mymensingh": "ময়মনসিংহ",
  "Jamalpur": "জামালপুর",
  "Sherpur": "শেরপুর",
  "Netrokona": "নেত্রকোণা"
};

export const getDistrictsByDivision = (divisionId: string): DistrictData[] => {
  const div = BANGLADESH_DIVISIONS.find(d => d.id === divisionId);
  if (!div) return BANGLADESH_DISTRICTS;
  return BANGLADESH_DISTRICTS.filter(d => div.districts.includes(d.district));
};

export const getDivisionForDistrict = (districtName: string): string => {
  const div = BANGLADESH_DIVISIONS.find(d => d.districts.includes(districtName));
  return div ? div.id : '';
};

export const BANGLADESH_DISTRICTS: DistrictData[] = [
  {
    district: "Dhaka",
    thanas: [
      "Adabor", "Badda", "Bangshal", "Biman Bandar", "Cantonment", "Chawkbazar",
      "Dakshinkhan", "Darus Salam", "Demra", "Dhanmondi", "Dhamrai", "Dohar",
      "Garia", "Gulshan", "Hazaribagh", "Jatrabari", "Kadamtali", "Kafrul",
      "Kalabagan", "Kamrangirchar", "Keraniganj", "Khilgaon", "Khilkhet",
      "Kotwali", "Lalbagh", "Mirpur", "Mohammadpur", "Motijheel", "Nawabganj",
      "New Market", "Pallabi", "Paltan", "Ramna", "Rampura", "Sabujbagh",
      "Savar", "Shah Ali", "Shahbagh", "Sher-e-Bangla Nagar", "Shyampur",
      "Sutrapur", "Tejgaon", "Tejgaon Industrial", "Turag", "Uttara", "Uttar Khan"
    ]
  },
  {
    district: "Gazipur",
    thanas: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur", "Tongi"]
  },
  {
    district: "Narayanganj",
    thanas: ["Narayanganj Sadar", "Araihazar", "Bandar", "Roopganj", "Sonargaon", "Siddhirganj"]
  },
  {
    district: "Chattogram (Chittagong)",
    thanas: [
      "Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari",
      "Karnafuli", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip",
      "Satkania", "Sitakunda", "Bandar", "Chandgaon", "Double Mooring", "Halishahar",
      "Kotwali", "Khulshi", "Pahartali", "Panchlaish", "Patenga"
    ]
  },
  {
    district: "Sylhet",
    thanas: [
      "Sylhet Sadar", "Balaganj", "Beanibazar", "Bishwanath", "Companiganj",
      "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat",
      "Osmani Nagar", "South Surma", "Zakiganj"
    ]
  },
  {
    district: "Cumilla (Comilla)",
    thanas: [
      "Cumilla Sadar", "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram",
      "Daudkandi", "Debidwar", "Homna", "Laksam", "Lalmai", "Meghna", "Monohargonj",
      "Muradnagar", "Nangalkot", "Titas"
    ]
  },
  {
    district: "Barishal (Barisal)",
    thanas: [
      "Barishal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara",
      "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"
    ]
  },
  {
    district: "Khulna",
    thanas: [
      "Khulna Sadar", "Batiaghata", "Dacope", "Dumuria", "Dighalia", "Koyra",
      "Paikgachha", "Phultala", "Rupsha", "Terokhada", "Daulatpur", "Khalishpur",
      "Khan Jahan Ali", "Sonadanga"
    ]
  },
  {
    district: "Rajshahi",
    thanas: [
      "Rajshahi Sadar", "Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari",
      "Mohanpur", "Paba", "Puthia", "Tanore"
    ]
  },
  {
    district: "Rangpur",
    thanas: [
      "Rangpur Sadar", "Badarganj", "Gangachhara", "Kaunia", "Mithapukur",
      "Pirgachha", "Pirganj", "Taraganj"
    ]
  },
  {
    district: "Mymensingh",
    thanas: [
      "Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gafargaon",
      "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur",
      "Trishal", "Tara Khanda"
    ]
  },
  {
    district: "Bogura (Bogra)",
    thanas: [
      "Bogura Sadar", "Adamdighi", "Dhunat", "Dupchanchia", "Gabtali", "Kahaloo",
      "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatola"
    ]
  },
  {
    district: "Brahmanbaria",
    thanas: [
      "Brahmanbaria Sadar", "Akhaura", "Bancharampur", "Bijoynagar", "Kasba",
      "Nabinagar", "Nasirnagar", "Sarail", "Ashuganj"
    ]
  },
  {
    district: "Cox's Bazar",
    thanas: [
      "Cox's Bazar Sadar", "Chakaria", "Eidgaon", "Kutubdia", "Maheshkhali",
      "Ramu", "Teknaf", "Ukhiya", "Pekua"
    ]
  },
  {
    district: "Feni",
    thanas: ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Sonagazi", "Fulgazi"]
  },
  {
    district: "Noakhali",
    thanas: [
      "Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya",
      "Kabirhat", "Senbagh", "Subarnachar", "Sonaimuri"
    ]
  },
  {
    district: "Tangail",
    thanas: [
      "Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Dhanbari", "Ghatail",
      "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur"
    ]
  },
  {
    district: "Narsingdi",
    thanas: ["Narsingdi Sadar", "Belabo", "Monohardi", "Palash", "Raipura", "Shibpur"]
  },
  {
    district: "Faridpur",
    thanas: [
      "Faridpur Sadar", "Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan",
      "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"
    ]
  },
  {
    district: "Madaripur",
    thanas: ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar"]
  },
  {
    district: "Manikganj",
    thanas: ["Manikganj Sadar", "Singair", "Shibalaya", "Saturia", "Harirampur", "Ghior", "Daulatpur"]
  },
  {
    district: "Munshiganj",
    thanas: ["Munshiganj Sadar", "Gazaria", "Louhajang", "Sirajdikhan", "Sreenagar", "Tongibari"]
  },
  {
    district: "Rajbari",
    thanas: ["Rajbari Sadar", "Baliakandi", "Goalandaghat", "Pangsha", "Kalukhali"]
  },
  {
    district: "Shariatpur",
    thanas: ["Shariatpur Sadar", "Bhedarganj", "Damudya", "Gosairhat", "Naria", "Zanjira"]
  },
  {
    district: "Gopalganj",
    thanas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"]
  },
  {
    district: "Kishoreganj",
    thanas: [
      "Kishoreganj Sadar", "Astagram", "Bajitpur", "Bhairab", "Hossainpur",
      "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"
    ]
  },
  {
    district: "Chandpur",
    thanas: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab North", "Matlab South", "Shahrasti"]
  },
  {
    district: "Lakshmipur",
    thanas: ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"]
  },
  {
    district: "Pabna",
    thanas: ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"]
  },
  {
    district: "Natore",
    thanas: ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Naldanga", "Singra"]
  },
  {
    district: "Naogaon",
    thanas: ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar", "Mohadevpur"]
  },
  {
    district: "Sirajganj",
    thanas: ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Rayganj", "Shahjadpur", "Tarash", "Ullahpara"]
  },
  {
    district: "Joypurhat",
    thanas: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"]
  },
  {
    district: "Chapainawabganj",
    thanas: ["Chapainawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"]
  },
  {
    district: "Jashore (Jessore)",
    thanas: ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"]
  },
  {
    district: "Kushtia",
    thanas: ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Mirpur"]
  },
  {
    district: "Satkhira",
    thanas: ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"]
  },
  {
    district: "Bagerhat",
    thanas: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"]
  },
  {
    district: "Jhenaidah",
    thanas: ["Jhenaidah Sadar", "Harinakunda", "Kaliganj", "Kotchandpur", "Maheshpur", "Sailkupa"]
  },
  {
    district: "Chuadanga",
    thanas: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"]
  },
  {
    district: "Meherpur",
    thanas: ["Meherpur Sadar", "Gangni", "Mujibnagar"]
  },
  {
    district: "Narail",
    thanas: ["Narail Sadar", "Kalia", "Lohagara"]
  },
  {
    district: "Magura",
    thanas: ["Magura Sadar", "Mohammadpur", "Shalakha", "Sreepur"]
  },
  {
    district: "Moulvibazar",
    thanas: ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"]
  },
  {
    district: "Habiganj",
    thanas: ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniyachong", "Chhatak", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Sayestaganj"]
  },
  {
    district: "Sunamganj",
    thanas: ["Sunamganj Sadar", "Bishwamambharpur", "Chhatak", "Derai", "Dharamapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Tahirpur", "Shantiganj"]
  },
  {
    district: "Bhola",
    thanas: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"]
  },
  {
    district: "Patuakhali",
    thanas: ["Patuakhali Sadar", "Bauphal", "Dashmina", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali", "Dumki"]
  },
  {
    district: "Pirojpur",
    thanas: ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Indurkani"]
  },
  {
    district: "Barguna",
    thanas: ["Barguna Sadar", "Amatali", "Bamna", "Betagi", "Patharghata", "Taltali"]
  },
  {
    district: "Jhalokati",
    thanas: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"]
  },
  {
    district: "Dinajpur",
    thanas: ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Phulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"]
  },
  {
    district: "Gaibandha",
    thanas: ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Sughatta", "Sundarganj"]
  },
  {
    district: "Kurigram",
    thanas: ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Nageshwari", "Phulbari", "Rajarhat", "Roumari", "Ulipur"]
  },
  {
    district: "Nilphamari",
    thanas: ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"]
  },
  {
    district: "Panchagarh",
    thanas: ["Panchagarh Sadar", "Atwari", "Boda", "Debi-ganj", "Tetulia"]
  },
  {
    district: "Thakurgaon",
    thanas: ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"]
  },
  {
    district: "Lalmonirhat",
    thanas: ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"]
  },
  {
    district: "Jamalpur",
    thanas: ["Jamalpur Sadar", "Baksiganj", "Dewanganj", "Islampur", "Jamalpur", "Madarganj", "Melandaha", "Sarishabari"]
  },
  {
    district: "Sherpur",
    thanas: ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"]
  },
  {
    district: "Netrokona",
    thanas: ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Purbadhala", "Khaliajuri"]
  },
  {
    district: "Khagrachhari",
    thanas: ["Khagrachhari Sadar", "Dighinala", "Lakhipur", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"]
  },
  {
    district: "Rangamati",
    thanas: ["Rangamati Sadar", "Belaichhari", "Barkal", "Baghaichhari", "Juraichhari", "Kaptai", "Kawkhali", "Langadu", "Naniarchar", "Rajasthali"]
  },
  {
    district: "Bandarban",
    thanas: ["Bandarban Sadar", "Alikadam", "Thanchi", "Naikhongchhari", "Rowangchhari", "Ruma", "Lama"]
  }
];
