// Sri Lankan Districts and Towns Data
const sriLankanLocations = {
    "Colombo": [
        "Colombo 1", "Colombo 2", "Colombo 3", "Colombo 4", "Colombo 5", "Colombo 6", "Colombo 7", 
        "Colombo 8", "Colombo 9", "Colombo 10", "Colombo 11", "Colombo 12", "Colombo 13", "Colombo 14", "Colombo 15",
        "Dehiwala", "Mount Lavinia", "Moratuwa", "Kotte", "Maharagama", "Nugegoda", "Homagama", "Padukka", "Hanwella", "Avissawella"
    ],
    "Gampaha": [
        "Gampaha", "Negombo", "Katunayake", "Ja-Ela", "Wattala", "Kelaniya", "Peliyagoda", "Kadawatha", 
        "Ragama", "Veyangoda", "Mirigama", "Minuwangoda", "Divulapitiya", "Nittambuwa", "Giriulla", "Kiribathgoda"
    ],
    "Kalutara": [
        "Kalutara", "Panadura", "Horana", "Beruwala", "Aluthgama", "Bentota", "Wadduwa", "Bandaragama", 
        "Ingiriya", "Bulathsinhala", "Mathugama", "Agalawatta", "Palindanuwara", "Millaniya"
    ],
    "Kandy": [
        "Kandy", "Peradeniya", "Gampola", "Nawalapitiya", "Wattegama", "Harispattuwa", "Pathadumbara", 
        "Akurana", "Kadugannawa", "Pilimatalawa", "Yatinuwara", "Udunuwara", "Gangawata Korale", "Doluwa"
    ],
    "Matale": [
        "Matale", "Dambulla", "Sigiriya", "Galewela", "Ukuwela", "Rattota", "Pallepola", "Yatawatta", 
        "Naula", "Raththota", "Laggala-Pallegama", "Wilgamuwa", "Ambanganga Korale"
    ],
    "Nuwara Eliya": [
        "Nuwara Eliya", "Hatton", "Talawakelle", "Ginigathena", "Kotagala", "Maskeliya", "Bogawantalawa", 
        "Ambagamuwa", "Kotmale", "Walapane", "Hanguranketha"
    ],
    "Galle": [
        "Galle", "Hikkaduwa", "Ambalangoda", "Elpitiya", "Bentota", "Baddegama", "Imaduwa", "Yakkalamulla", 
        "Neluwa", "Nagoda", "Habaraduwa", "Akmeemana", "Balapitiya", "Karapitiya"
    ],
    "Matara": [
        "Matara", "Weligama", "Mirissa", "Dikwella", "Tangalle", "Akuressa", "Hakmana", "Kamburupitiya", 
        "Devinuwara", "Pitabeddara", "Thihagoda", "Athuraliya", "Malimbada"
    ],
    "Hambantota": [
        "Hambantota", "Tissamaharama", "Ambalantota", "Beliatta", "Weeraketiya", "Kataragama", "Okewela", 
        "Sooriyawewa", "Lunugamvehera", "Tangalle"
    ],
    "Jaffna": [
        "Jaffna", "Chavakachcheri", "Point Pedro", "Karainagar", "Velanai", "Delft", "Kayts", "Nallur", 
        "Kopay", "Chunnakam", "Sandilipay", "Maruthankerny", "Pachchilaipalli", "Tellippalai"
    ],
    "Kilinochchi": [
        "Kilinochchi", "Pallai", "Poonakary", "Paranthan", "Akkarayankulam", "Mankulam"
    ],
    "Mannar": [
        "Mannar", "Nanattan", "Musali", "Madhu", "Nanaddan", "Manthai West"
    ],
    "Mullaitivu": [
        "Mullaitivu", "Oddusuddan", "Puthukudiyiruppu", "Thunukkai", "Weli Oya", "Maritimepattu"
    ],
    "Vavuniya": [
        "Vavuniya", "Nedunkeni", "Settikulam", "Vavuniya South", "Vengalacheddikulam"
    ],
    "Puttalam": [
        "Puttalam", "Chilaw", "Wennappuwa", "Anamaduwa", "Nattandiya", "Dankotuwa", "Marawila", 
        "Mundel", "Kalpitiya", "Mahawewa", "Arachchikattuwa", "Pallama", "Karuwalagaswewa"
    ],
    "Kurunegala": [
        "Kurunegala", "Kuliyapitiya", "Narammala", "Wariyapola", "Pannala", "Melsiripura", "Bingiriya", 
        "Nikaweratiya", "Galgamuwa", "Giribawa", "Ibbagamuwa", "Mawathagama", "Polpithigama", "Rideegama"
    ],
    "Anuradhapura": [
        "Anuradhapura", "Kekirawa", "Thambuttegama", "Eppawala", "Medawachchiya", "Horowpothana", 
        "Galenbindunuwewa", "Mihintale", "Nochchiyagama", "Galnewa", "Nachchaduwa", "Rambewa", "Thirappane"
    ],
    "Polonnaruwa": [
        "Polonnaruwa", "Kaduruwela", "Medirigiriya", "Hingurakgoda", "Dimbulagala", "Lankapura", 
        "Welikanda", "Thamankaduwa", "Elahera"
    ],
    "Badulla": [
        "Badulla", "Bandarawela", "Haputale", "Welimada", "Mahiyanganaya", "Passara", "Ella", "Hali-Ela", 
        "Uva-Paranagama", "Soranathota", "Rideemaliyadda", "Meegahakiula", "Kandaketiya", "Lunugala"
    ],
    "Monaragala": [
        "Monaragala", "Wellawaya", "Buttala", "Kataragama", "Bibila", "Medagama", "Madulla", 
        "Sevanagala", "Siyambalanduwa", "Thanamalwila", "Badalkumbura"
    ],
    "Ratnapura": [
        "Ratnapura", "Embilipitiya", "Balangoda", "Rakwana", "Pelmadulla", "Eheliyagoda", "Kuruwita", 
        "Godakawela", "Kalawana", "Kolonna", "Imbulpe", "Weligepola", "Ayagama", "Nivithigala"
    ],
    "Kegalle": [
        "Kegalle", "Mawanella", "Warakapola", "Rambukkana", "Galigamuwa", "Aranayaka", "Yatiyantota", 
        "Ruwanwella", "Deraniyagala", "Bulathkohupitiya", "Dehiowita"
    ],
    "Ampara": [
        "Ampara", "Akkaraipattu", "Kalmunai", "Sainthamaruthu", "Sammanthurai", "Pottuvil", "Uhana", 
        "Mahaoya", "Padiyathalawa", "Damana", "Navithanveli", "Lahugala", "Addalachchenai"
    ],
    "Batticaloa": [
        "Batticaloa", "Kattankudy", "Eravur", "Valachchenai", "Chenkalady", "Oddamavadi", "Kaluwanchikudy", 
        "Araipattai", "Manmunai North", "Manmunai South and Eruvil Pattu", "Manmunai West", "Koralai Pattu North"
    ],
    "Trincomalee": [
        "Trincomalee", "Kinniya", "Mutur", "Kuchchaveli", "Nilaveli", "Uppuveli", "Kantale", "Seruvila", 
        "Gomarankadawala", "Padavi Sri Pura", "Thambalagamuwa"
    ]
};

// Property types
const propertyTypes = [
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'HOUSE', label: 'House' },
    { value: 'ROOM', label: 'Room' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'CONDOMINIUM', label: 'Condominium' }
];

// Sample property data for demonstration
const sampleProperties = [
    {
        propertyId: 1,
        propertyName: "Modern Apartment in Colombo 3",
        propertyDescription: "Beautiful 2-bedroom apartment with city views, modern amenities, and excellent location near shopping centers and restaurants.",
        propertyPrice: 75000,
        propertyType: "APARTMENT",
        propertySize: 1200,
        bedroomsAvailable: 2,
        bathroomsAvailable: 2,
        propertyImageUrl: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
        district: "Colombo",
        town: "Colombo 3",
        user: {
            userId: "landlord1",
            username: "john_landlord",
            userEmail: "john@example.com",
            userPhone: "+94771234567"
        }
    },
    {
        propertyId: 2,
        propertyName: "Luxury Villa in Kandy",
        propertyDescription: "Spacious 4-bedroom villa with garden, mountain views, and traditional Sri Lankan architecture. Perfect for families.",
        propertyPrice: 120000,
        propertyType: "HOUSE",
        propertySize: 2500,
        bedroomsAvailable: 4,
        bathroomsAvailable: 3,
        propertyImageUrl: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600",
        district: "Kandy",
        town: "Kandy",
        user: {
            userId: "landlord2",
            username: "sarah_owner",
            userEmail: "sarah@example.com",
            userPhone: "+94772345678"
        }
    },
    {
        propertyId: 3,
        propertyName: "Cozy Room in Gampaha",
        propertyDescription: "Comfortable single room with shared facilities, ideal for students or young professionals. Close to public transport.",
        propertyPrice: 25000,
        propertyType: "ROOM",
        propertySize: 200,
        bedroomsAvailable: 1,
        bathroomsAvailable: 1,
        propertyImageUrl: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
        district: "Gampaha",
        town: "Gampaha",
        user: {
            userId: "landlord3",
            username: "mike_host",
            userEmail: "mike@example.com",
            userPhone: "+94773456789"
        }
    },
    {
        propertyId: 4,
        propertyName: "Beachfront Apartment in Galle",
        propertyDescription: "Stunning 3-bedroom apartment with ocean views, private balcony, and direct beach access. Perfect for vacation rentals.",
        propertyPrice: 95000,
        propertyType: "APARTMENT",
        propertySize: 1800,
        bedroomsAvailable: 3,
        bathroomsAvailable: 2,
        propertyImageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
        district: "Galle",
        town: "Galle",
        user: {
            userId: "landlord4",
            username: "anna_beach",
            userEmail: "anna@example.com",
            userPhone: "+94774567890"
        }
    },
    {
        propertyId: 5,
        propertyName: "Studio Apartment in Negombo",
        propertyDescription: "Modern studio apartment near the airport, fully furnished with kitchenette and high-speed internet. Great for business travelers.",
        propertyPrice: 45000,
        propertyType: "STUDIO",
        propertySize: 500,
        bedroomsAvailable: 1,
        bathroomsAvailable: 1,
        propertyImageUrl: "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=600",
        district: "Gampaha",
        town: "Negombo",
        user: {
            userId: "landlord5",
            username: "david_studio",
            userEmail: "david@example.com",
            userPhone: "+94775678901"
        }
    },
    {
        propertyId: 6,
        propertyName: "Family House in Matara",
        propertyDescription: "Traditional 3-bedroom house with large garden, fruit trees, and peaceful neighborhood. Ideal for families seeking tranquility.",
        propertyPrice: 65000,
        propertyType: "HOUSE",
        propertySize: 1600,
        bedroomsAvailable: 3,
        bathroomsAvailable: 2,
        propertyImageUrl: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600",
        district: "Matara",
        town: "Matara",
        user: {
            userId: "landlord6",
            username: "priya_home",
            userEmail: "priya@example.com",
            userPhone: "+94776789012"
        }
    }
];

// User roles
const userRoles = {
    TENANT: 'TENANT',
    LANDLORD: 'LANDLORD',
    ADMIN: 'ADMIN'
};

// Booking statuses
const bookingStatuses = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    DECLINED: 'DECLINED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED'
};

// Message types
const messageTypes = {
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    DOCUMENT: 'DOCUMENT'
};

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sriLankanLocations,
        propertyTypes,
        sampleProperties,
        userRoles,
        bookingStatuses,
        messageTypes
    };
}