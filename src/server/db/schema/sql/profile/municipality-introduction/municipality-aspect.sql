CREATE TABLE acme_municipality_aspect (
    id VARCHAR(36) PRIMARY KEY,
    municipality_id INTEGER NOT NULL,
    direction_nepali VARCHAR(100) NOT NULL,
    direction_english VARCHAR(100) NOT NULL,
    area_sq_km DECIMAL(8, 2) NOT NULL,
    area_percentage DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_municipality_aspect_municipality_id ON acme_municipality_aspect(municipality_id);

-- Insert municipality aspect data (assuming municipality_id = 1)
INSERT INTO acme_municipality_aspect (id, municipality_id, direction_nepali, direction_english, area_sq_km, area_percentage) VALUES
(gen_random_uuid(), 1, 'समथर', 'Flat', 0.96, 0.55),
(gen_random_uuid(), 1, 'उत्तरी', 'North', 15.99, 9.23),
(gen_random_uuid(), 1, 'उत्तर-पूर्वी', 'Northeast', 18.73, 10.81),
(gen_random_uuid(), 1, 'पूर्वी', 'East', 23.57, 13.61),
(gen_random_uuid(), 1, 'दक्षिण-पूर्वी', 'Southeast', 25.82, 14.91),
(gen_random_uuid(), 1, 'दक्षिणी', 'South', 24.47, 14.13),
(gen_random_uuid(), 1, 'दक्षिण-पश्चिम', 'Southwest', 24.55, 14.17),
(gen_random_uuid(), 1, 'पश्चिमी', 'West', 22.67, 13.09),
(gen_random_uuid(), 1, 'उत्तर-पश्चिम', 'Northwest', 16.44, 9.49);
