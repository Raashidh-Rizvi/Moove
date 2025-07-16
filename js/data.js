// Sri Lankan Districts and Towns Data
const sriLankanLocations = {
    "Colombo": [
        "Colombo 1", "Colombo 2", "Colombo 3", "Colombo 4", "Colombo 5", "Colombo 6", "Colombo 7", 
        "Colombo 8", "Colombo 9", "Colombo 10", "Colombo 11", "Colombo 12", "Colombo 13", "Colombo 14", "Colombo 15",
        "Dehiwala", "Mount Lavinia", "Moratuwa", "Kotte", "Maharagama", "Nugegoda", "Homagama", "Padukka", 
        "Hanwella", "Avissawella", "Seethawaka", "Kolonnawa", "Kaduwela", "Boralesgamuwa"
    ],
    "Gampaha": [
        "Gampaha", "Negombo", "Katunayake", "Seeduwa", "Ja-Ela", "Wattala", "Kelaniya", "Peliyagoda", 
        "Kiribathgoda", "Ragama", "Kandana", "Minuwangoda", "Veyangoda", "Mirigama", "Divulapitiya", 
        "Nittambuwa", "Ganemulla", "Yakkala", "Dompe", "Biyagama", "Mahara", "Kadawatha", "Hendala"
    ],
    "Kalutara": [
        "Kalutara", "Panadura", "Horana", "Beruwala", "Aluthgama", "Bentota", "Wadduwa", "Payagala", 
        "Maggona", "Ingiriya", "Bulathsinhala", "Palindanuwara", "Matugama", "Agalawatta", "Bandaragama", 
        "Millaniya", "Dodangoda"
    ],
    "Kandy": [
        "Kandy", "Peradeniya", "Gampola", "Nawalapitiya", "Wattegama", "Harispattuwa", "Pathadumbara", 
        "Akurana", "Kadugannawa", "Pilimatalawa", "Yatinuwara", "Udunuwara", "Gangawata Korale", 
        "Doluwa", "Medadumbara", "Minipe", "Kundasale", "Digana", "Teldeniya", "Panvila"
    ],
    "Matale": [
        "Matale", "Dambulla", "Sigiriya", "Nalanda", "Ukuwela", "Rattota", "Pallepola", "Yatawatta", 
        "Galewela", "Laggala", "Ambanganga Korale", "Korale Pataha", "Korale Gampaha"
    ],
    "Nuwara Eliya": [
        "Nuwara Eliya", "Hatton", "Talawakele", "Bogawantalawa", "Maskeliya", "Norton Bridge", 
        "Kotagala", "Lindula", "Ginigathena", "Walapane", "Hanguranketha", "Kotmale", "Ambagamuwa"
    ],
    "Galle": [
        "Galle", "Hikkaduwa", "Ambalangoda", "Elpitiya", "Bentota", "Kosgoda", "Balapitiya", 
        "Ahangama", "Unawatuna", "Habaraduwa", "Baddegama", "Neluwa", "Nagoda", "Imaduwa", 
        "Yakkalamulla", "Gonapinuwala"
    ],
    "Matara": [
        "Matara", "Weligama", "Mirissa", "Dikwella", "Tangalle", "Akuressa", "Hakmana", "Kamburupitiya", 
        "Devinuwara", "Pitabeddara", "Thihagoda", "Kotapola", "Malimbada", "Kirinda Puhulwella"
    ],
    "Hambantota": [
        "Hambantota", "Tissamaharama", "Kataragama", "Ambalantota", "Beliatta", "Weeraketiya", 
        "Suriyawewa", "Tangalle", "Okewela", "Sooriyawewa", "Lunugamvehera"
    ],
    "Jaffna": [
        "Jaffna", "Chavakachcheri", "Point Pedro", "Karainagar", "Velanai", "Delft", "Kayts", 
        "Nallur", "Kopay", "Sandilipay", "Tellippalai", "Uduvil", "Manipay", "Chunnakam"
    ],
    "Kilinochchi": [
        "Kilinochchi", "Pallai", "Poonakary", "Paranthan", "Akkarayankulam"
    ],
    "Mannar": [
        "Mannar", "Nanattan", "Madhu", "Pesalai", "Erukkalampiddy", "Murunkan"
    ],
    "Mullaitivu": [
        "Mullaitivu", "Oddusuddan", "Puthukudiyiruppu", "Weli Oya", "Manthai East", "Thunukkai"
    ],
    "Vavuniya": [
        "Vavuniya", "Nedunkeni", "Settikulam", "Venkalacheddikulam", "Omanthai", "Cheddikulam"
    ],
    "Puttalam": [
        "Puttalam", "Chilaw", "Nattandiya", "Wennappuwa", "Marawila", "Dankotuwa", "Anamaduwa", 
        "Norochcholai", "Kalpitiya", "Mundel", "Mahawewa", "Pallama", "Karuwalagaswewa"
    ],
    "Kurunegala": [
        "Kurunegala", "Kuliyapitiya", "Narammala", "Wariyapola", "Pannala", "Melsiripura", 
        "Bingiriya", "Nikaweratiya", "Galgamuwa", "Giribawa", "Ibbagamuwa", "Mawathagama", 
        "Polpithigama", "Rideegama", "Alawwa", "Polgahawela", "Hettipola"
    ],
    "Anuradhapura": [
        "Anuradhapura", "Kekirawa", "Thambuttegama", "Eppawala", "Galenbindunuwewa", "Mihintale", 
        "Medawachchiya", "Horowpothana", "Galnewa", "Nachchaduwa", "Palagala", "Rajanganaya", 
        "Talawa", "Thirappane", "Nochchiyagama"
    ],
    "Polonnaruwa": [
        "Polonnaruwa", "Kaduruwela", "Medirigiriya", "Hingurakgoda", "Dimbulagala", "Welikanda", 
        "Lankapura", "Elahera", "Thamankaduwa"
    ],
    "Badulla": [
        "Badulla", "Bandarawela", "Haputale", "Welimada", "Mahiyanganaya", "Passara", "Ella", 
        "Diyatalawa", "Hali-Ela", "Soranathota", "Kandaketiya", "Rideemaliyadda", "Uva Paranagama", 
        "Meegahakivula", "Lunugala"
    ],
    "Monaragala": [
        "Monaragala", "Wellawaya", "Buttala", "Kataragama", "Bibile", "Medagama", "Madulla", 
        "Thanamalwila", "Sevanagala", "Siyambalanduwa"
    ],
    "Ratnapura": [
        "Ratnapura", "Embilipitiya", "Balangoda", "Rakwana", "Pelmadulla", "Eheliyagoda", 
        "Kuruwita", "Godakawela", "Kalawana", "Kolonna", "Imbulpe", "Nivitigala", "Weligepola", 
        "Ayagama", "Elapatha"
    ],
    "Kegalle": [
        "Kegalle", "Mawanella", "Warakapola", "Rambukkana", "Galigamuwa", "Dehiowita", "Yatiyantota", 
        "Ruwanwella", "Deraniyagala", "Aranayaka", "Bulathkohupitiya"
    ],
    "Ampara": [
        "Ampara", "Akkaraipattu", "Kalmunai", "Sainthamaruthu", "Sammanthurai", "Pottuvil", 
        "Uhana", "Mahaoya", "Damana", "Navithanveli", "Thirukkovil", "Lahugala", "Padiyathalawa", 
        "Maha Oya", "Dehiattakandiya"
    ],
    "Batticaloa": [
        "Batticaloa", "Kattankudy", "Eravur", "Valaichchenai", "Chenkalady", "Oddamavadi", 
        "Kaluwanchikudy", "Valaichenai", "Manmunai North", "Manmunai South West", "Manmunai Pattu", 
        "Koralai Pattu North", "Porativu Pattu"
    ],
    "Trincomalee": [
        "Trincomalee", "Kinniya", "Mutur", "Kantale", "Nilaveli", "Uppuveli", "Kuchchaveli", 
        "Gomarankadawala", "Seruvila", "Padavi Siripura", "Thambalagamuwa"
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
let sampleProperties = [
    {
        propertyId: 1,
        propertyName: "Modern Apartment in Colombo 3",
        propertyDescription: "Beautiful modern apartment with city views, fully furnished with contemporary amenities. Perfect for professionals and small families.",
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
            username: "john_doe",
            userEmail: "john@example.com",
            userPhone: "+94771234567"
        }
    },
    {
        propertyId: 2,
        propertyName: "Luxury Villa in Kandy",
        propertyDescription: "Spacious luxury villa with mountain views, private garden, and modern amenities. Ideal for families seeking tranquility.",
        propertyPrice: 150000,
        propertyType: "VILLA",
        propertySize: 2500,
        bedroomsAvailable: 4,
        bathroomsAvailable: 3,
        propertyImageUrl: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600",
        district: "Kandy",
        town: "Kandy",
        user: {
            userId: "landlord2",
            username: "jane_smith",
            userEmail: "jane@example.com",
            userPhone: "+94772345678"
        }
    },
    {
        propertyId: 3,
        propertyName: "Cozy Room in Gampaha",
        propertyDescription: "Comfortable single room with shared facilities, perfect for students and young professionals. Close to public transport.",
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
            username: "mike_wilson",
            userEmail: "mike@example.com",
            userPhone: "+94773456789"
        }
    },
    {
        propertyId: 4,
        propertyName: "Beach House in Galle",
        propertyDescription: "Beautiful beach house with ocean views, private beach access, and tropical garden. Perfect for vacation rentals.",
        propertyPrice: 200000,
        propertyType: "HOUSE",
        propertySize: 1800,
        bedroomsAvailable: 3,
        bathroomsAvailable: 2,
        propertyImageUrl: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600",
        district: "Galle",
        town: "Galle",
        user: {
            userId: "landlord4",
            username: "sarah_brown",
            userEmail: "sarah@example.com",
            userPhone: "+94774567890"
        }
    },
    {
        propertyId: 5,
        propertyName: "Studio Apartment in Negombo",
        propertyDescription: "Modern studio apartment near the airport, fully furnished with kitchenette and modern amenities. Great for short-term stays.",
        propertyPrice: 45000,
        propertyType: "STUDIO",
        propertySize: 500,
        bedroomsAvailable: 1,
        bathroomsAvailable: 1,
        propertyImageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
        district: "Gampaha",
        town: "Negombo",
        user: {
            userId: "landlord5",
            username: "david_lee",
            userEmail: "david@example.com",
            userPhone: "+94775678901"
        }
    },
    {
        propertyId: 6,
        propertyName: "Family House in Kurunegala",
        propertyDescription: "Spacious family house with large garden, parking space, and quiet neighborhood. Perfect for families with children.",
        propertyPrice: 85000,
        propertyType: "HOUSE",
        propertySize: 2000,
        bedroomsAvailable: 3,
        bathroomsAvailable: 2,
        propertyImageUrl: "https://images.pexels.com/photos/1396196/pexels-photo-1396196.jpeg?auto=compress&cs=tinysrgb&w=600",
        district: "Kurunegala",
        town: "Kurunegala",
        user: {
            userId: "landlord6",
            username: "lisa_garcia",
            userEmail: "lisa@example.com",
            userPhone: "+94776789012"
        }
    }
];

// User data for demonstration
let users = [
    {
        userId: "user1",
        username: "tenant_user",
        userEmail: "tenant@example.com",
        userPhone: "+94771111111",
        userAddress: "123 Main Street, Colombo",
        userRole: "TENANT"
    },
    {
        userId: "landlord1",
        username: "john_doe",
        userEmail: "john@example.com",
        userPhone: "+94771234567",
        userAddress: "456 Oak Avenue, Colombo",
        userRole: "LANDLORD"
    },
    {
        userId: "landlord2",
        username: "jane_smith",
        userEmail: "jane@example.com",
        userPhone: "+94772345678",
        userAddress: "789 Pine Road, Kandy",
        userRole: "LANDLORD"
    }
];

// Booking data for demonstration
let bookings = [
    {
        bookingId: 1,
        user: users[0],
        property: sampleProperties[0],
        totalAmount: 150000,
        bookingDate: new Date('2025-01-15'),
        checkInDate: new Date('2025-02-01'),
        checkOutDate: new Date('2025-02-28'),
        checkInTime: '14:00',
        checkOutTime: '11:00',
        status: 'PENDING',
        message: 'Looking forward to staying at your property!'
    }
];

// Message data for demonstration
let messages = [
    {
        id: 1,
        sender: users[0],
        receiver: users[1],
        content: 'Hi, I\'m interested in your property in Colombo 3. Is it still available?',
        sentAt: new Date('2025-01-15T10:30:00')
    },
    {
        id: 2,
        sender: users[1],
        receiver: users[0],
        content: 'Yes, it\'s still available! Would you like to schedule a viewing?',
        sentAt: new Date('2025-01-15T11:00:00')
    }
];

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sriLankanLocations,
        propertyTypes,
        sampleProperties,
        users,
        bookings,
        messages
    };
}