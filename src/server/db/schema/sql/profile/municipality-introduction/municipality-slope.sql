-- Check if municipality_slope table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'municipality_slope'
    ) THEN
        CREATE TABLE acme_municipality_slope (
            id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
            municipality_id INTEGER NOT NULL,
            slope_range_nepali VARCHAR(100) NOT NULL,
            slope_range_english VARCHAR(100) NOT NULL,
            area_sq_km DECIMAL(8,2) NOT NULL,
            area_percentage DECIMAL(5,2) NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_municipality_slope) THEN
        INSERT INTO acme_municipality_slope (
            municipality_id, slope_range_nepali, slope_range_english, area_sq_km, area_percentage
        )
        VALUES
        -- Municipality slope data - assuming municipality_id = 1 for seed data
        (1, '० डिग्री देखि ५ डिग्री', '0 degrees to 5 degrees', 131.03, 75.66),
        (1, '५ डिग्री देखि १० डिग्री', '5 degrees to 10 degrees', 14.70, 8.49),
        (1, '१० डिग्री देखि २० डिग्री', '10 degrees to 20 degrees', 9.76, 5.64),
        (1, '२० डिग्री देखि ३० डिग्री', '20 degrees to 30 degrees', 13.27, 7.66),
        (1, '३० डिग्री देखि ६० डिग्री', '30 degrees to 60 degrees', 4.43, 2.56);
    END IF;
END
$$;
