-- Drop existing table if it exists to recreate with new structure
DROP TABLE IF EXISTS acme_birthplace_households;

-- Create new table structure for age-group-wise birth place data
CREATE TABLE acme_birthplace_households (
    id VARCHAR(36) PRIMARY KEY,
    age_group VARCHAR(50) NOT NULL,
    total_population INTEGER NOT NULL CHECK (total_population >= 0),
    nepal_born INTEGER NOT NULL CHECK (nepal_born >= 0),
    born_in_district_municipality INTEGER NOT NULL CHECK (born_in_district_municipality >= 0),
    born_in_district_other INTEGER NOT NULL CHECK (born_in_district_other >= 0),
    born_in_district_total INTEGER NOT NULL CHECK (born_in_district_total >= 0),
    born_other_district INTEGER NOT NULL CHECK (born_other_district >= 0),
    born_abroad INTEGER NOT NULL CHECK (born_abroad >= 0),
    birth_place_unknown INTEGER NOT NULL CHECK (birth_place_unknown >= 0),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert seed data for age-group-wise birthplace information
INSERT INTO acme_birthplace_households (
    id, age_group, total_population, nepal_born, 
    born_in_district_municipality, born_in_district_other, born_in_district_total,
    born_other_district, born_abroad, birth_place_unknown
)
VALUES
(gen_random_uuid(), '०-४ वर्ष', 2091, 2090, 2077, 7, 2084, 6, 1, 0),
(gen_random_uuid(), '५-९ वर्ष', 2033, 2031, 2005, 16, 2021, 10, 2, 0),
(gen_random_uuid(), '१०-१४ वर्ष', 2341, 2341, 2317, 14, 2331, 10, 0, 0),
(gen_random_uuid(), '१५-१९ वर्ष', 2360, 2358, 2291, 32, 2323, 35, 2, 0),
(gen_random_uuid(), '२०-२४ वर्ष', 2265, 2258, 2078, 68, 2146, 112, 5, 2),
(gen_random_uuid(), '२५-२९ वर्ष', 1625, 1624, 1458, 74, 1532, 92, 0, 1),
(gen_random_uuid(), '३०-३४ वर्ष', 1404, 1402, 1254, 63, 1317, 85, 1, 1),
(gen_random_uuid(), '३५-३९ वर्ष', 1315, 1312, 1205, 52, 1257, 55, 2, 1),
(gen_random_uuid(), '४०-४४ वर्ष', 1132, 1131, 1037, 41, 1078, 53, 1, 0),
(gen_random_uuid(), '४५-४९ वर्ष', 978, 976, 911, 23, 934, 42, 0, 2),
(gen_random_uuid(), '५०-५४ वर्ष', 1020, 1020, 961, 23, 984, 36, 0, 0),
(gen_random_uuid(), '५५-५९ वर्ष', 816, 816, 772, 13, 785, 31, 0, 0),
(gen_random_uuid(), '६०-६४ वर्ष', 724, 724, 685, 17, 702, 22, 0, 0),
(gen_random_uuid(), '६५-६९ वर्ष', 552, 552, 530, 13, 543, 9, 0, 0),
(gen_random_uuid(), '७०-७४ वर्ष', 516, 516, 481, 18, 499, 17, 0, 0),
(gen_random_uuid(), '७५- वर्षमाथि', 499, 499, 478, 16, 494, 5, 0, 0),
(gen_random_uuid(), 'जम्मा', 21671, 21650, 20540, 490, 21030, 620, 14, 7);

-- Add index for performance
CREATE INDEX idx_birthplace_households_age_group ON acme_birthplace_households(age_group);
