const vatFormats = {
    "Albania": {
      "vatFormat": "A23456789B",
      "regex": "^[A-Za-z]{1}\\d{8}[A-Za-z]{1}$"
    },
    "Algeria":{
      "vatFormat": "123456789012345",
      "regex": "^\\d{15}$"
    },
    "Angola":{
      "vatFormat": "1234567890",
      "regex": "^\\d{10}$"
    },
    "Anguilla":{
      "vatFormat": "2123456789",
      "regex": "^\\d{10}$"
    },
    "Antigua And Barbuda":{
      "vatFormat": "123456-58",
      "regex": "^\\d{6}-\\d{2}$"
    },
    "Argentina":{
      "vatFormat": "12-34567890-1",
      "regex": "^\\d{2}-\\d{8}-\\d{1}$"
    },
    "Aruba":{
      "vatFormat": "1234567",
      "regex": "^\\d{7}$"
    },
    "Armenia": {
      "vatFormat": "12345678",
      "regex": "^\\d{8}$"
    },
    "Australia": {
      "vatFormat": ["12345678901","AU12345678901"],
      "regex": ["^\\d{11}$","^AU\\d{11}$"]
    },
    "Azerbaijan": {
      "vatFormat": "1234567890",
      "regex": "^\\d{10}$"
    },
    "The Bahamas": {
      "vatFormat": "123456789",
      "regex": "^\\d{9}$"
    },
    "Bahrain": {
      "vatFormat": "123456789012345",
      "regex": "^\\d{15}$"
    },
    "Bangladesh": {
      "vatFormat": "4407824036004",
      "regex":"^\\d{13}$"
    },
    "Barbados": {
      "vatFormat": "1234567890123",
      "regex":"^\\d{13}$"
    },
    "Belarus": {
      "vatFormat": "123456789",
      "regex": "^\\d{9}$"
    },
    "Bhutan": {
      "vatFormat": ["TAC00119","12345678"],
      "regex": ["^[A-Za-z]{3}\\d{5}$","^\\d{9}$"]
    },
    "Bolivia":{
      "vatFormat": "1234567890",
      "regex": "^\\d{10}$"
    },
    "Bonaire, Sint Eustatius and Saba":{
      "vatFormat": "312-345-678",
      "regex": "^\\d{3}-\\d{3}-\\d{3}$"
    },
    "Bosnia and Herzegovina":{
      "vatFormat":"123456789012",
      "regex":"^\\d{12}$"
    },
    "Botswana":{
      "vatFormat": "C01234567890",
      "regex":"^[A-Za-z]{1}\\d{11}$"
    },
    "Brazil":{
      "vatFormat": "12.345.678/9012-34",
      "regex": "^\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}$"
      // "regex": "^\\d{2}.\\d{3}.\\d{3}/\\d{4}-\\d{2}$"
    },
    "Cambodia":{
      "vatFormat":"X001-123456789",
      "regex":"^[A-Za-z]{1}\\d{3}-\\d{9}$"
    },
    "Cameroon":{
      "vatFormat": "MO85400001476E",
      "regex": "^[A-Za-z]{2}\\d{6}\\d{5}[A-Za-z]{1}$"
    },
    "Canada": {
      "vatFormat": [
        "1234567890 (Quebec)", 
        "1234567890TQ1234 (Quebec)",
        "NR12345678 (Quebec)",
        "NR12345678TQ0000 (Quebec)",
        "1234567 (Saskatchewan)",
        "PST-1234-5678 (British Columbia)",
        "123456-7 (Manitoba)",
        "Federal Tax"
      ],
      "regex": [
        "^\\d{10}$",
        "^\\d{10}[A-Za-z]{2}\\d{4}$",
        "^[A-Za-z]{2}\\d{8}$",
        "^[A-Za-z]{2}\\d{8}[A-Za-z]{2}\\d{4}$",
        "^\\d{7}$",
        "^[A-Za-z]{3}-\\d{4}-\\d{4}$",
        "^\\d{6}-\\d$",
        "^\\d{9}[A-Za-z]{2}\\d{4}$"
      ]
    },
    "Chad":{
      "vatFormat": "1234567Z",
      "regex": "^\\d{7}[A-Za-z]{1}$"
    },
    "Chile": {
      "vatFormat": ["12.123.123-1","12.345.678-K"],
      "regex": ["^\\d{2}\\.\\d{3}\\.\\d{3}-\\d{1}$","^\\d{2}\\.\\d{3}\\.\\d{3}-[A-Za-z]$"]
    },
    "China":{
      "vatFormat": "123456789012345678",
      "regex": "^\\d{18}$"
    },
    "Colombia": {
      "vatFormat": "1234567890",
      "regex": "^\\d{10}$"
    },
    "Congo":{
      "vatFormat" : "12345678901234567",
      "regex": "^\\d{17}$"
    },
    "Costa Rica": {
      "vatFormat": "3-102-123456",
      "regex": "^\\d{1}-\\d{3}-\\d{6}$"
    },
    "Cote D'Ivoire (Ivory Coast)":{
      "vatFormat": "1234567A",
      "regex": "^\\d{7}[A-Za-z]{1}$"
    },
    "Curaçao":{
      "vatFormat": "102697061",
      "regex": "^\\d{9}$"
    },
    "Democratic Republic of the Congo":{
      "vatFormat": "A1234567R",
      "regex":"^[A-Za-z]{1}\\d{7}[A-Za-z]{1}$"
    },
    "Dominican Republic":{
      "vatFormat": "123-4567890-1",
      "regex": "^\\d{3}-\\d{7}-\\d{1}$"
    },
    "Ecuador":{
      "vatFormat":"1234567890123",
      "regex":"^\\d{13}$"
    },
    "Egypt":{
      "vatFormat":"123456789",
      "regex":"^\\d{9}$"
    },
    "El Salvador":{
      "vatFormat":"1234567",
      "regex":"^\\d{7}$"
    },
    "Equatorial Guinea":{
      "vatFormat": ["1","123"],
      "regex": ["^\\d{1}$","^\\d{3}$"]
    },
    "Fiji Islands": {
      "vatFormat": "12-3456-7-8-9",
      "regex": "^\\d{2}-\\d{4}-\\d{1}-\\d{1}-\\d{1}$"
    },
    "Georgia": {
      "vatFormat": "123456789",
      "regex": "^\\d{9}$"
    },
    "Ghana": {
      "vatFormat": ["C0001234567","C000XXXXXXX","GHAC0001234567","GHAC000XXXXXXX"],
      "regex": ["^[A-Za-z]{1}\\d{10}$","^[A-Za-z]{1}\\d{3}[A-Za-z0-9]{7}$","^GHA[A-Za-z]{1}\\d{10}$","^GHA[A-Za-z]{1}\\d{3}[A-Za-z0-9]{7}$"]
    },
    "Guatemala": {
      "vatFormat": "1234567-8",
      "regex": "^\\d{7}-\\d{1}$"
    },
    "Guinea":{
      "vatFormat": "123456789-0V",
      "regex": "^\\d{9}-\\d{1}[A-Za-z]{1}$"
    },
    "Guyana":{
      "vatFormat":"123456789",
      "regex":"^\\d{9}$"
    },
    "Honduras":{
      "vatFormat": "12345678901234",
      "regex": "^\\d{14}$"
    },

    "Iceland": {
      "vatFormat": [
        "12345",
        "123456"
      ],
      "regex": [
        "^\\d{5}$",
        "^\\d{6}$"
      ]
    },
    "India": {
      "vatFormat": ["1234ABC56789DEF","12AAAAA0000A1ZX"],
      "regex": ["^\\d{4}[A-Za-z]{3}\\d{5}[A-Za-z]{3}$","^\\d{2}[A-Za-z]{5}\\d{4}[A-Za-z0-9]{1}\\d{1}[A-Za-z0-9]{2}$"]
    },
    "Indonesia": {
      "vatFormat": "123456789012345",
      "regex": "^\\d{15}$"
    },
    "Man (Isle of)": {
      "vatFormat": ["000 1234 56", "GB000 1234 56"],
      "regex": ["^\\d{3} \\d{4} \\d{2}$", "^[A-Za-z]{2}\\d{3} \\d{4} \\d{2}$"]
    },
    "Israel":{
      "vatFormat": "123456789",
      "regex": "^\\d{9}$"
    },
    "Jamaica":{
      "vatFormat": "123-456-789",
      "regex": "^\\d{3}-\\d{3}-\\d{3}$"
    },
    "Japan": {
      "vatFormat": "1234567890123",
      "regex": "^\\d{13}$"
    },
    "Jersey":{
      "vatFormat": "1234567",
      "regex": "^\\d{7}$"
    },
    "Jordan": {
      "vatFormat": "1234567",
      "regex": "^\\d{7}$"
    },
    "Kazakhstan": {
      "vatFormat": "123456789012",
      "regex": "^\\d{12}$"
    },
    "Kenya": {
      "vatFormat": "A123456789A",
      "regex": "^[A-Za-z]{1}\\d{9}[A-Za-z]{1}$"
    },
    "Kosovo": {
      "vatFormat": "1234567890",
      "regex": "^\\d{10}$"
    },
    "Kuwait": {
      "vatFormat": "123456",
      "regex": "^\\d{6}$"
    },
    "Kyrgyzstan" : {
      "vatFormat" : "12345678901234",
      "regex" : "^\\d{14}$"
    },
    "Lebanon" : {
      "vatFormat": "1234567-A",
      "regex": "^\\d{7}-[A-Za-z]{1}$"
    },
    "Lesotho": {
      "vatFormat": "50012345",
      "regex": "^\\d{8}$"
    },
    "Liechtenstein": {
      "vatFormat": "12345",
      "regex": "^\\d{5}$"
    },
    "Malawi": {
      "vatFormat": "12345678",
      "regex": "^\\d{8}$"
    },
    "Malaysia": {
      "vatFormat": "123456789012345",
      "regex": "^\\d{15}$"
    },
    "Maldives": {
      "vatFormat":"1234567GST501",
      "regex":"^\\d{7}[A-Za-z]{3}\\d{3}$"
    },
    "Mauritania": {
      "vatFormat": "12345678",
      "regex": "^\\d{8}$"
    },
    "Mauritius": {
      "vatFormat": "12345678",
      "regex": "^\\d{8}$"
    },
    "Mexico": {
      "vatFormat": [
        "XXX123456X78",
        "XXXX123456X78"
      ],
      "regex": [
        "^[A-Za-z]{3}\\d{6}[A-Za-z]\\d{2}$",
        "^[A-Za-z]{4}\\d{6}[A-Za-z]\\d{2}$"
      ]
    },
    "Moldova": {
      "vatFormat": [
        "1234567",
        "1234567890123"
      ],
      "regex": [
        "^\\d{7}$",
        "^\\d{13}$"
      ]
    },
    "Monaco": {
      "vatFormat":["12345678901","X1234567890","1X123456789","XX123456789"],
      "regex":["^\\d{11}$","^[A-Za-z0-9]{1}\\d{10}$","^\\d{1}[A-Za-z0-9]{1}\\d{9}$","^[A-Za-z0-9]{2}\\d{9}$"]
    },
    "Mongolia": {
      "vatFormat": "1234567",
      "regex": "^\\d{7}$"
    },
    "Montenegro" :{
      "vatFormat": "12/34-56789-0",
      "regex": "^\\d{2}/\\d{2}-\\d{5}-\\d{1}$"
    },
    "Morocco":{
      "vatFormat": "12345678",
      "regex": "^\\d{8}$"
    },
    "Mozambique": {
      "vatFormat": "123456789",
      "regex": "^\\d{9}$"
    },
    "Namibia": {
      "vatFormat": "0123 4567",
      "regex": "^\\d{4} \\d{4}$"
    },
    "Nepal":{
      "vatFormat": "123456789",
      "regex": "^\\d{9}$"
    },
    "New Zealand": {
      "vatFormat": ["123456789","12345678","1234567","NZ123456789","NZ12345678","NZ1234567"],
      "regex": ["^\\d{9}$","^\\d{8}$","^\\d{7}$","^NZ\\d{9}$","^NZ\\d{8}$","^NZ\\d{7}$"]
    },
    "Nicaragua": {
      "vatFormat": "12345678901234",
      "regex": "^\\d{14}$"
    },
    "Nigeria": {
      "vatFormat": "12345678-1234",
      "regex": "^\\d{8}-\\d{4}$"
    },
    "Macedonia": {
      "vatFormat": "MK1234567890123",
      "regex": "^[A-Za-z]{2}\\d{13}$"
    },
    "Norway": {
      "vatFormat": "123456789MVA",
      "regex": "^\\d{9}[A-Za-z]{3}$"
    },
    "Oman": {
      "vatFormat": "XX1234567890",
      "regex": "^[A-Za-z0-9]{2}\\d{10}$"
    },
    "Pakistan":{
      "vatFormat": "1234567-8",
      "regex": "^\\d{7}-\\d{1}$"
    },
    "Panama":{
      "vatFormat": "123456789-2-2024 DV: 12",
      "regex": "^\\d{9}-\\d{1}-\\d{4} DV: \\d{2}$"
    },
    "Papua new Guinea":{
      "vatFormat": "123456789",
      "regex": "^\\d{9}$"
    },
    "Paraguay": {
      "vatFormat": "123456-0",
      "regex": "^\\d{6}-\\d{1}$"
    },
    "Peru" : {
      "vatFormat": "12345678901",
      "regex": "^\\d{11}$"
    },
    "Philippines": {
      "vatFormat": "123-456-789-012",
      "regex": "^\\d{3}-\\d{3}-\\d{3}-\\d{3}$"
    },
    "Puerto Rico":{
      "vatFormat": "1497496-0017",
      "regex": "^\\d{7}-\\d{4}$"
    },
    "Qatar":{
      "vatFormat": "1234567890",
      "regex": "^\\d{10}$"
    },
    "Russia":{
      "vatFormat": ["123456789000","1234567890"],
      "regex": ["^\\d{12}$","^\\d{10}$"]
    },
    "Rwanda":{
      "vatFormat": "123456789",
      "regex": "^\\d{9}$"
    },
    "Saint Kitts And Nevis":{
      "vatFormat": "123456789",
      "regex": "^\\d{9}$"
    },
    "Saint Lucia":{
      "vatFormat": "123456-7",
      "regex": "^\\d{6}-\\d{1}$"
    },
    "Saint Vincent And The Grenadines":{
      "vatFormat": "123456-7",
      "regex": "^\\d{6}-\\d{1}$"
    },
    "Sao Tome and Principe":{
      "vatFormat": "12345678",
      "regex": "^\\d{8}$"
    },
    "Saudi Arabia": {
      "vatFormat": "123456789012345",
      "regex": "^\\d{15}$"
    },
    "Senegal":{
      "vatFormat": "123456789A",
      "regex": "^\\d{9}[A-Za-z]{1}$"
    },
    "Serbia": {
      "vatFormat": "123456789",
      "regex": "^\\d{9}$"
    },
    "Singapore": {
      "vatFormat": [
        "A12345678A",
        "12345678A",
        "123456789A",
        "12-1234567-1",
        "M2-1234567-8",
        "MR-1234567-8",
        "19-9012345-X",
        "F2-1234567-D"
      ],
      "regex": [
        "^[A-Za-z]{1}\\d{8}[A-Za-z]{1}$",
        "^\\d{8}[A-Za-z]{1}$",
        "^\\d{9}[A-Za-z]{1}$",
        "^\\d{2}-\\d{7}-\\d{1}$",
        "^[A-Za-z]{1}\\d{1}-\\d{7}-\\d{1}$",
        "^[A-Za-z]{2}-\\d{7}-\\d{1}$",
        "^\\d{2}-\\d{7}-[A-Za-z0-9]{1}$",
        "^[A-Za-z]{1}\\d{1}-\\d{7}-[A-Za-z]$"
      ]
    },
    "Sint Maarten (Dutch part)":{
      "vatFormat": "412.345.678",
      "regex": "^\\d{3}\\.\\d{3}\\.\\d{3}$"
    },
    "South Africa": {
      "vatFormat": ["1234567890","1234/567/890","ZA1234567890","ZA1234/567/890"],
      "regex": ["^\\d{10}$","^\\d{4}/\\d{3}/\\d{3}$","^ZA\\d{10}$","^ZA\\d{4}/\\d{3}/\\d{3}$"]
    },
    "South Korea": {
      "vatFormat": ["1234567890","123-45-67890","KR1234567890","KR123-45-67890"],
      "regex": ["^\\d{10}$","^\\d{3}-\\d{2}-\\d{5}$","^KR\\d{10}$","^KR\\d{3}-\\d{2}-\\d{5}$"]
    },
    "South Sudan":{
      "vatFormat": "123-345-678",
      "regex": "^\\d{3}-\\d{3}-\\d{3}$"
    },
    "Sri Lanka": {
      "vatFormat": "123456789-7000",
      "regex": "^\\d{9}-\\d{4}$"
    },
    "Suriname":{
      "vatFormat": "1234567890",
      "regex": "^\\d{10}$"
    },
    "Switzerland": {
      "vatFormat": [
        "123.456.789 MWST",
        "123.456.789 TVA",
        "123.456.789 IVA",
        "CHE123.456.789 MWST",
        "CHE123.456.789 TVA",
        "CHE123.456.789 IVA"
      ],
      "regex": [
        "^\\d{3}\\.\\d{3}\\.\\d{3} [A-Za-z]{4}$",
        "^\\d{3}\\.\\d{3}\\.\\d{3} [A-Za-z]{3}$",
        "^\\d{3}\\.\\d{3}\\.\\d{3} [A-Za-z]{3}$",
        "^CHE\\d{3}\\.\\d{3}\\.\\d{3} [A-Za-z]{4}$",
        "^CHE\\d{3}\\.\\d{3}\\.\\d{3} [A-Za-z]{3}$",
        "^CHE\\d{3}\\.\\d{3}\\.\\d{3} [A-Za-z]{3}$"
      ]
    },
    "Taiwan": {
      "vatFormat": "12345678",
      "regex": "^\\d{8}$"
    },
    "Tanzania": {
      "vatFormat": "99-999999-A",
      "regex": "^\\d{2}-\\d{6}-[A-Za-z]{1}$"
    },
    "Thailand": {
      "vatFormat": "1234567890123",
      "regex": "^\\d{13}$"
    },
    "Trinidad And Tobago":{
      "vatFormat": "123456",
      "regex": "^\\d{6}$"
    },
    "Tunisia":{
      "vatFormat": "1234567A/B/C/890",
      "regex": "^\\d{7}[A-Za-z]{1}/[A-Za-z]{1}/[A-Za-z]{1}/\\d{3}$"
    },
    "Turkey": {
      "vatFormat": "1234567890",
      "regex": "^\\d{10}$"
    },
    "Uganda": {
      "vatFormat": "9999999999",
      "regex": "^\\d{10}$"
    },
    "Ukraine":{
      "vatFormat": "01012345-0001",
      "regex": "^\\d{8}-\\d{4}$"
    },
    "United Arab Emirates": {
      "vatFormat": "123456789012345",
      "regex": "^\\d{15}$"
    },
    "United Kingdom": {
      "vatFormat": ["123456789","123456789000","GB123456789","GB123456789000"],
      "regex": ["^\\d{9}$","^\\d{12}$","^GB\\d{9}$","^GB\\d{12}$"]
    },
    "Uruguay":{
      "vatFormat": "123456789012",
      "regex": "^\\d{12}$"
    },
    "Uzbekistan": {
      "vatFormat": ["123456789","UZB123456789"],
      "regex": ["^\\d{9}$","^UZB\\d{9}$"]
    },
    "Venezuela": {
      "vatFormat": "J-12345678-9",
      "regex": "^[A-Za-z]{1}-\\d{8}-\\d{1}$"
    },
    "Vietnam": {
      "vatFormat": [
        "1234567890",
        "1234567890123"
      ],
      "regex": [
        "^\\d{10}$",
        "^\\d{13}$"
      ]
    },
    "Zambia": {
      "vatFormat": "1001234567",
      "regex": "^\\d{10}$"
    },
    "Zimbabwe": {
      "vatFormat": "1234567890",
      "regex": "^\\d{10}$"
    },
    "Austria": {
      "vatFormat": ["U12345678","ATU12345678"],
      "regex": ["^[A-Za-z]{1}\\d{8}$","^AT[A-Za-z]{1}\\d{8}$"]
    },
    "Belgium": {
      "vatFormat": [
        "123456789",
        "1234567890",
        "BE123456789",
        "BE1234567890"
      ],
      "regex": [
        "^\\d{9}$",
        "^\\d{10}$",
        "^BE\\d{9}$",
        "^BE\\d{10}$"
      ]
    },
    "Bulgaria": {
      "vatFormat": [
        "123456789",
        "1234567890",
        "BG123456789",
        "BG1234567890"
      ],
      "regex": [
        "^\\d{9}$",
        "^\\d{10}$",
        "^BG\\d{9}$",
        "^BG\\d{10}$"
      ]
    },
    "Croatia": {
      "vatFormat": ["12345678901","HR12345678901"],
      "regex": ["^\\d{11}$","^HR\\d{11}$"]
    },
    "Cyprus": {
      "vatFormat": ["12345678A","CY12345678A"],
      "regex": ["^\\d{8}[A-Za-z]{1}$", "^CY\\d{8}[A-Za-z]{1}$"]
    },
    "Czech Republic": {
      "vatFormat": [
        "12345678",
        "123456789",
        "1234567890",
        "CZ12345678",
        "CZ123456789",
        "CZ1234567890"
      ],
      "regex": [
        "^\\d{8}$",
        "^\\d{9}$",
        "^\\d{10}$",
        "^CZ\\d{8}$",
        "^CZ\\d{9}$",
        "^CZ\\d{10}$"
      ]
    },
    "Denmark": {
      "vatFormat": ["12345678", "DK12345678"],
      "regex": ["^\\d{8}$","^DK\\d{8}$"]
    },
    "Estonia": {
      "vatFormat": ["123456789","EE123456789"],
      "regex": ["^\\d{9}$","^EE\\d{9}$"]
    },
    "Finland": {
      "vatFormat": ["12345678","FI12345678"],
      "regex": ["^\\d{8}$","^FI\\d{8}$"]
    },
    "France": {
      "vatFormat": [
        "12345678901",
        "X1234567890",
        "1X123456789",
        "XX123456789",
        "FR12345678901",
        "FRX1234567890",
        "FR1X123456789",
        "FRXX123456789"
      ],
      "regex": [
        "^\\d{11}$",
        "^[A-Za-z]{1}\\d{10}$",
        "^\\d{1}[A-Za-z]{1}\\d{9}$",
        "^[A-Za-z]{2}\\d{9}$",
        "^FR\\d{11}$",
        "^FR[A-Za-z]{1}\\d{10}$",
        "^FR\\d{1}[A-Za-z]{1}\\d{9}$",
        "^FR[A-Za-z]{2}\\d{9}$"
      ]
    },
    "Germany": {
      "vatFormat": ["123456789", "DE123456789"],
      "regex": ["^\\d{9}$", "^DE\\d{9}$"]
    }, 
    "Greece": {
      "vatFormat": ["123456789", "EL123456789"],
      "regex": ["^\\d{9}$", "^EL\\d{9}$"]
    },
    "Hungary": {
      "vatFormat": ["12345678", "12345678-2-34","HU12345678", "HU12345678-2-34"],
      "regex": ["^\\d{8}$", "^\\d{8}-\\d{1}-\\d{2}$","^HU\\d{8}$", "^HU\\d{8}-\\d{1}-\\d{2}$"]
    },
    "Ireland": {
      "vatFormat": ["1234567X", "1X23456X", "1234567XX","IE1234567X", "IE1X23456X", "IE1234567XX"],
      "regex": ["^\\d{7}[A-Za-z0-9]{1}$", 
        "^\\d{1}[A-Za-z0-9]{1}\\d{5}[A-Za-z0-9]{1}$", 
        "^\\d{7}[A-Za-z0-9]{2}$", 
        "^[A-Za-z]{2}\\d{7}[A-Za-z0-9]{1}$", 
        "^[A-Za-z]{2}\\d{1}[A-Za-z0-9]{1}\\d{5}[A-Za-z0-9]{1}$", 
        "^[A-Za-z]{2}\\d{7}[A-Za-z0-9]{2}$"]
    },
    "Italy": {
      "vatFormat": ["12345678901", "IT12345678901"],
      "regex": ["^\\d{11}$", "^IT\\d{11}$"]
    },
    "Latvia": {
      "vatFormat": ["12345678901", "LV12345678901"],
      "regex": ["^\\d{11}$", "^LV\\d{11}$"]
    },
    "Lithuania": {
      "vatFormat": ["123456789", "123456789012","LT123456789", "LT123456789012"],
      "regex": ["^\\d{9}$", "^\\d{12}$", "^LT\\d{9}$", "^LT\\d{12}$"]
    },
    "Luxembourg": {
      "vatFormat": ["12345678", "LU12345678"],
      "regex": ["^\\d{8}$", "^LU\\d{8}$"]
    },
    "Malta": {
      "vatFormat": ["12345678", "MT12345678"],
      "regex": ["^\\d{8}$", "^MT\\d{8}$"]
    },
    "Netherlands": {
      "vatFormat": ["123456789B12", "NL123456789B12"],
      "regex": ["^\\d{9}[A-Za-z]{1}\\d{2}$", "^NL\\d{9}[A-Za-z]{1}\\d{2}$"]
    },
    "Poland": {
      "vatFormat": ["1234567890", "PL1234567890"],
      "regex": ["^\\d{10}$", "^PL\\d{10}$"]
    },
    "Portugal": {
      "vatFormat": ["123456789", "PT123456789"],
      "regex": ["^\\d{9}$", "^PT\\d{9}$"]
    },
    "Romania": {
      "vatFormat": ["12345678","1234567890","RO12345678","RO1234567890"],
      "regex": ["^\\d{8}$","^\\d{10}$","^RO\\d{8}$","^RO\\d{10}$"]
    },
    "Slovakia": {
      "vatFormat": ["1234567890", "SK1234567890"],
      "regex": ["^\\d{10}$", "^SK\\d{10}$"]
    },
    "Slovenia": {
      "vatFormat": ["12345678", "SI12345678"],
      "regex": ["^\\d{8}$", "^SI\\d{8}$"]
    },
    "Spain": {
      "vatFormat": ["A1234567A","X12345678","12345678X","X1234567X","ESA1234567A","ESX12345678","ES12345678X","ESX1234567X"],
      "regex": ["^[A-Za-z]\\d{7}[A-Za-z]$",
        "^[A-Za-z0-9]{1}\\d{8}$",
        "^\\d{8}[A-Za-z0-9]{1}$",
        "^[A-Za-z0-9]{1}\\d{7}[A-Za-z0-9]{1}$",
        "^ES[A-Za-z]\\d{7}[A-Za-z]$",
        "^ES[A-Za-z0-9]{1}\\d{8}$",
        "^ES\\d{8}[A-Za-z0-9]{1}$",
        "^ES[A-Za-z0-9]{1}\\d{7}[A-Za-z0-9]{1}$"
      
      ]
    },
    "Sweden": {
      "vatFormat": ["123456789012","SE123456789012"],
      "regex": ["^\\d{12}$","^SE\\d{12}$"]
    }
  }
  
  export default vatFormats;