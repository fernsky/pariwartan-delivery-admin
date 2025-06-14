-- Drop existing table if it exists and create new ward gender wise economically active population table
DO $$
BEGIN
    -- Drop existing table if it exists
    IF EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_gender_wise_economically_active_population'
    ) THEN
        DROP TABLE acme_ward_gender_wise_economically_active_population;
    END IF;
END
$$;

-- Create the ward gender wise economically active population table
CREATE TABLE acme_ward_gender_wise_economically_active_population (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number VARCHAR(10) NOT NULL, -- Using VARCHAR to handle "जम्मा" for totals
    gender VARCHAR(20) NOT NULL, -- पुरुष, महिला, जम्मा
    age_10_plus_total INTEGER NOT NULL DEFAULT 0 CHECK (age_10_plus_total >= 0),
    economically_active_employed INTEGER NOT NULL DEFAULT 0 CHECK (economically_active_employed >= 0),
    economically_active_unemployed INTEGER NOT NULL DEFAULT 0 CHECK (economically_active_unemployed >= 0),
    household_work INTEGER NOT NULL DEFAULT 0 CHECK (household_work >= 0),
    economically_active_total INTEGER NOT NULL DEFAULT 0 CHECK (economically_active_total >= 0),
    dependent_population INTEGER NOT NULL DEFAULT 0 CHECK (dependent_population >= 0),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(ward_number, gender)
);

-- Insert seed data
INSERT INTO acme_ward_gender_wise_economically_active_population (
    ward_number, gender, age_10_plus_total, economically_active_employed, 
    economically_active_unemployed, household_work, economically_active_total, dependent_population
)
VALUES
-- Ward 1 data
('1', 'पुरुष', 1050, 575, 13, 145, 317, 0),
('1', 'महिला', 1308, 731, 5, 247, 325, 0),
('1', 'जम्मा', 2358, 1306, 18, 392, 642, 0),

-- Ward 2 data
('2', 'पुरुष', 1711, 627, 45, 521, 516, 2),
('2', 'महिला', 2169, 788, 27, 704, 649, 1),
('2', 'जम्मा', 3880, 1415, 72, 1225, 1165, 3),

-- Ward 3 data
('3', 'पुरुष', 1123, 464, 24, 185, 450, 0),
('3', 'महिला', 1427, 540, 2, 316, 569, 0),
('3', 'जम्मा', 2550, 1004, 26, 501, 1019, 0),

-- Ward 4 data
('4', 'पुरुष', 1703, 545, 187, 573, 398, 0),
('4', 'महिला', 2048, 531, 133, 711, 672, 1),
('4', 'जम्मा', 3751, 1076, 320, 1284, 1070, 1),

-- Ward 5 data
('5', 'पुरुष', 1442, 817, 10, 187, 428, 0),
('5', 'महिला', 1724, 1018, 15, 200, 490, 1),
('5', 'जम्मा', 3166, 1835, 25, 387, 918, 1),

-- Ward 6 data
('6', 'पुरुष', 853, 433, 10, 120, 288, 2),
('6', 'महिला', 989, 483, 11, 178, 316, 1),
('6', 'जम्मा', 1842, 916, 21, 298, 604, 3),

-- Overall totals
('जम्मा', 'पुरुष', 7882, 3461, 289, 1731, 2397, 4),
('जम्मा', 'महिला', 9665, 4091, 193, 2356, 3021, 4),
('जम्मा', 'जम्मा', 17547, 7552, 482, 4087, 5418, 8);
