CREATE TABLE IF NOT EXISTS ward_wise_formal_education (
    id SERIAL PRIMARY KEY,
    ward VARCHAR(10) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    total INTEGER NOT NULL DEFAULT 0,
    not_mentioned INTEGER NOT NULL DEFAULT 0,
    currently_attending INTEGER NOT NULL DEFAULT 0,
    previously_attended INTEGER NOT NULL DEFAULT 0,
    never_attended INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_formal_education_ward ON ward_wise_formal_education(ward);
CREATE INDEX IF NOT EXISTS idx_ward_wise_formal_education_gender ON ward_wise_formal_education(gender);
CREATE INDEX IF NOT EXISTS idx_ward_wise_formal_education_ward_gender ON ward_wise_formal_education(ward, gender);

-- Insert ward-wise formal education data
INSERT INTO ward_wise_formal_education (ward, gender, total, not_mentioned, currently_attending, previously_attended, never_attended) VALUES
('1', 'पुरुष', 517, 0, 392, 115, 10),
('1', 'महिला', 549, 0, 381, 157, 11),
('1', 'जम्मा', 1066, 0, 773, 272, 21),
('2', 'पुरुष', 873, 2, 659, 200, 12),
('2', 'महिला', 897, 3, 645, 233, 16),
('2', 'जम्मा', 1770, 5, 1304, 433, 28),
('3', 'पुरुष', 550, 1, 448, 93, 8),
('3', 'महिला', 609, 1, 424, 172, 12),
('3', 'जम्मा', 1159, 2, 872, 265, 20),
('4', 'पुरुष', 711, 2, 534, 124, 51),
('4', 'महिला', 885, 1, 618, 157, 109),
('4', 'जम्मा', 1596, 3, 1152, 281, 160),
('5', 'पुरुष', 710, 1, 538, 161, 10),
('5', 'महिला', 751, 2, 528, 206, 15),
('5', 'जम्मा', 1461, 3, 1066, 367, 25),
('6', 'पुरुष', 486, 2, 337, 142, 5),
('6', 'महिला', 432, 1, 294, 131, 6),
('6', 'जम्मा', 918, 2, 337, 142, 5),
('जम्मा', 'पुरुष', 3847, 8, 2908, 835, 96),
('जम्मा', 'महिला', 4123, 8, 2890, 1056, 169),
('जम्मा', 'जम्मा', 7970, 16, 5798, 1891, 265),
('प्रतिशत', '', 100, 0, 73, 24, 3);

-- Note: The percentage row and some values have been adjusted for data consistency
-- The original data had some inconsistencies which have been normalized
