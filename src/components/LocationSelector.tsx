import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { District, Town, PropertyLocation } from '../types/booking';

interface LocationSelectorProps {
  value: PropertyLocation;
  onChange: (location: PropertyLocation) => void;
  error?: string;
}

// Sri Lankan Districts Data
const DISTRICTS: District[] = [
  { id: 1, name: 'Colombo', nameEn: 'Colombo', nameSi: 'කොළඹ', nameTa: 'கொழும்பு' },
  { id: 2, name: 'Gampaha', nameEn: 'Gampaha', nameSi: 'ගම්පහ', nameTa: 'கம்பஹா' },
  { id: 3, name: 'Kalutara', nameEn: 'Kalutara', nameSi: 'කළුතර', nameTa: 'களுத்துறை' },
  { id: 4, name: 'Kandy', nameEn: 'Kandy', nameSi: 'මහනුවර', nameTa: 'கண்டி' },
  { id: 5, name: 'Matale', nameEn: 'Matale', nameSi: 'මාතලේ', nameTa: 'மாத்தளை' },
  { id: 6, name: 'Nuwara Eliya', nameEn: 'Nuwara Eliya', nameSi: 'නුවරඑළිය', nameTa: 'நுவரேலியா' },
  { id: 7, name: 'Galle', nameEn: 'Galle', nameSi: 'ගාල්ල', nameTa: 'காலி' },
  { id: 8, name: 'Matara', nameEn: 'Matara', nameSi: 'මාතර', nameTa: 'மாத்தறை' },
  { id: 9, name: 'Hambantota', nameEn: 'Hambantota', nameSi: 'හම්බන්තොට', nameTa: 'அம்பாந்தோட்டை' },
  { id: 10, name: 'Jaffna', nameEn: 'Jaffna', nameSi: 'යාපනය', nameTa: 'யாழ்ப்பாணம்' },
  { id: 11, name: 'Kilinochchi', nameEn: 'Kilinochchi', nameSi: 'කිලිනොච්චි', nameTa: 'கிளிநொச்சி' },
  { id: 12, name: 'Mannar', nameEn: 'Mannar', nameSi: 'මන්නාරම', nameTa: 'மன்னார்' },
  { id: 13, name: 'Mullaitivu', nameEn: 'Mullaitivu', nameSi: 'මුලතිව්', nameTa: 'முல்லைத்தீவு' },
  { id: 14, name: 'Vavuniya', nameEn: 'Vavuniya', nameSi: 'වවුනියාව', nameTa: 'வவுனியா' },
  { id: 15, name: 'Puttalam', nameEn: 'Puttalam', nameSi: 'පුත්තලම', nameTa: 'புத்தளம்' },
  { id: 16, name: 'Kurunegala', nameEn: 'Kurunegala', nameSi: 'කුරුණෑගල', nameTa: 'குருணாகல்' },
  { id: 17, name: 'Anuradhapura', nameEn: 'Anuradhapura', nameSi: 'අනුරාධපුරය', nameTa: 'அனுராதபுரம்' },
  { id: 18, name: 'Polonnaruwa', nameEn: 'Polonnaruwa', nameSi: 'පොළොන්නරුව', nameTa: 'பொலன்னறுவை' },
  { id: 19, name: 'Badulla', nameEn: 'Badulla', nameSi: 'බදුල්ල', nameTa: 'பதுளை' },
  { id: 20, name: 'Monaragala', nameEn: 'Monaragala', nameSi: 'මොණරාගල', nameTa: 'மொணராகலை' },
  { id: 21, name: 'Ratnapura', nameEn: 'Ratnapura', nameSi: 'රත්නපුර', nameTa: 'இரத்தினபுரி' },
  { id: 22, name: 'Kegalle', nameEn: 'Kegalle', nameSi: 'කෑගල්ල', nameTa: 'கேகாலை' },
  { id: 23, name: 'Ampara', nameEn: 'Ampara', nameSi: 'අම්පාර', nameTa: 'அம்பாறை' },
  { id: 24, name: 'Batticaloa', nameEn: 'Batticaloa', nameSi: 'මඩකලපුව', nameTa: 'மட்டக்களப்பு' },
  { id: 25, name: 'Trincomalee', nameEn: 'Trincomalee', nameSi: 'ත්‍රිකුණාමලය', nameTa: 'திருகோணமலை' },
];

// Towns by District (sample data - in real app, this would come from API)
const TOWNS_BY_DISTRICT: Record<number, Town[]> = {
  1: [ // Colombo
    { id: 101, districtId: 1, name: 'Colombo 1', nameEn: 'Colombo 1', nameSi: 'කොළඹ 1', nameTa: 'கொழும்பு 1' },
    { id: 102, districtId: 1, name: 'Colombo 2', nameEn: 'Colombo 2', nameSi: 'කොළඹ 2', nameTa: 'கொழும்பு 2' },
    { id: 103, districtId: 1, name: 'Colombo 3', nameEn: 'Colombo 3', nameSi: 'කොළඹ 3', nameTa: 'கொழும்பு 3' },
    { id: 104, districtId: 1, name: 'Colombo 4', nameEn: 'Colombo 4', nameSi: 'කොළඹ 4', nameTa: 'கொழும்பு 4' },
    { id: 105, districtId: 1, name: 'Colombo 5', nameEn: 'Colombo 5', nameSi: 'කොළඹ 5', nameTa: 'கொழும்பு 5' },
    { id: 106, districtId: 1, name: 'Colombo 6', nameEn: 'Colombo 6', nameSi: 'කොළඹ 6', nameTa: 'கொழும்பு 6' },
    { id: 107, districtId: 1, name: 'Colombo 7', nameEn: 'Colombo 7', nameSi: 'කොළඹ 7', nameTa: 'கொழும்பு 7' },
    { id: 108, districtId: 1, name: 'Dehiwala', nameEn: 'Dehiwala', nameSi: 'දෙහිවල', nameTa: 'தெஹிவளை' },
    { id: 109, districtId: 1, name: 'Mount Lavinia', nameEn: 'Mount Lavinia', nameSi: 'ගල්කිස්ස', nameTa: 'மவுண்ட் லவீனியா' },
    { id: 110, districtId: 1, name: 'Moratuwa', nameEn: 'Moratuwa', nameSi: 'මොරටුව', nameTa: 'மொறட்டுவை' },
  ],
  2: [ // Gampaha
    { id: 201, districtId: 2, name: 'Negombo', nameEn: 'Negombo', nameSi: 'මීගමුව', nameTa: 'நீர்கொழும்பு' },
    { id: 202, districtId: 2, name: 'Gampaha', nameEn: 'Gampaha', nameSi: 'ගම්පහ', nameTa: 'கம்பஹா' },
    { id: 203, districtId: 2, name: 'Kelaniya', nameEn: 'Kelaniya', nameSi: 'කැලණිය', nameTa: 'களனி' },
    { id: 204, districtId: 2, name: 'Kadawatha', nameEn: 'Kadawatha', nameSi: 'කඩවත', nameTa: 'கடவத' },
    { id: 205, districtId: 2, name: 'Ja-Ela', nameEn: 'Ja-Ela', nameSi: 'ජා-ඇල', nameTa: 'ஜா-எல' },
  ],
  4: [ // Kandy
    { id: 401, districtId: 4, name: 'Kandy', nameEn: 'Kandy', nameSi: 'මහනුවර', nameTa: 'கண்டி' },
    { id: 402, districtId: 4, name: 'Peradeniya', nameEn: 'Peradeniya', nameSi: 'පේරාදෙණිය', nameTa: 'பேராதெனியா' },
    { id: 403, districtId: 4, name: 'Gampola', nameEn: 'Gampola', nameSi: 'ගම්පොල', nameTa: 'கம்போளை' },
    { id: 404, districtId: 4, name: 'Nawalapitiya', nameEn: 'Nawalapitiya', nameSi: 'නවලපිටිය', nameTa: 'நவலப்பிட்டி' },
  ],
  7: [ // Galle
    { id: 701, districtId: 7, name: 'Galle', nameEn: 'Galle', nameSi: 'ගාල්ල', nameTa: 'காலி' },
    { id: 702, districtId: 7, name: 'Hikkaduwa', nameEn: 'Hikkaduwa', nameSi: 'හික්කඩුව', nameTa: 'ஹிக்கடுவ' },
    { id: 703, districtId: 7, name: 'Bentota', nameEn: 'Bentota', nameSi: 'බෙන්තොට', nameTa: 'பென்தோட்ட' },
    { id: 704, districtId: 7, name: 'Ambalangoda', nameEn: 'Ambalangoda', nameSi: 'අම්බලන්ගොඩ', nameTa: 'அம்பலங்கொட' },
  ],
};

const LocationSelector: React.FC<LocationSelectorProps> = ({ value, onChange, error }) => {
  const [availableTowns, setAvailableTowns] = useState<Town[]>([]);

  useEffect(() => {
    if (value.district) {
      const selectedDistrict = DISTRICTS.find(d => d.name === value.district);
      if (selectedDistrict) {
        setAvailableTowns(TOWNS_BY_DISTRICT[selectedDistrict.id] || []);
      }
    } else {
      setAvailableTowns([]);
    }
  }, [value.district]);

  const handleDistrictChange = (districtName: string) => {
    onChange({
      ...value,
      district: districtName,
      town: '', // Reset town when district changes
      area: '',
    });
  };

  const handleTownChange = (townName: string) => {
    onChange({
      ...value,
      town: townName,
    });
  };

  const handleAreaChange = (area: string) => {
    onChange({
      ...value,
      area,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* District Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={value.district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="input-field pl-10 pr-10 appearance-none"
              required
            >
              <option value="">Select District</option>
              {DISTRICTS.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Town Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Town/City *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={value.town}
              onChange={(e) => handleTownChange(e.target.value)}
              className="input-field pl-10 pr-10 appearance-none"
              disabled={!value.district}
              required
            >
              <option value="">Select Town/City</option>
              {availableTowns.map((town) => (
                <option key={town.id} value={town.name}>
                  {town.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Area/Neighborhood */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Area/Neighborhood (Optional)
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={value.area || ''}
            onChange={(e) => handleAreaChange(e.target.value)}
            className="input-field pl-10"
            placeholder="e.g., Wellawatte, Bambalapitiya, etc."
          />
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
};

export default LocationSelector;