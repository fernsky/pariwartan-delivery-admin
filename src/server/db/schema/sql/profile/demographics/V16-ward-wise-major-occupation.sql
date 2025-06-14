-- Drop old table if it exists and create new family main occupation table
DO $$
BEGIN
    -- Drop old ward-wise table if it exists
    IF EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_major_occupation'
    ) THEN
        DROP TABLE acme_ward_wise_major_occupation;
    END IF;
    
    -- Drop existing family main occupation table if it exists to recreate with correct structure
    IF EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_family_main_occupation'
    ) THEN
        DROP TABLE acme_family_main_occupation;
    END IF;
END
$$;

-- Create the family main occupation table with correct structure
CREATE TABLE acme_family_main_occupation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    occupation TEXT NOT NULL UNIQUE,
    age_15_19 INTEGER NOT NULL DEFAULT 0 CHECK (age_15_19 >= 0),
    age_20_24 INTEGER NOT NULL DEFAULT 0 CHECK (age_20_24 >= 0),
    age_25_29 INTEGER NOT NULL DEFAULT 0 CHECK (age_25_29 >= 0),
    age_30_34 INTEGER NOT NULL DEFAULT 0 CHECK (age_30_34 >= 0),
    age_35_39 INTEGER NOT NULL DEFAULT 0 CHECK (age_35_39 >= 0),
    age_40_44 INTEGER NOT NULL DEFAULT 0 CHECK (age_40_44 >= 0),
    age_45_49 INTEGER NOT NULL DEFAULT 0 CHECK (age_45_49 >= 0),
    total_population INTEGER NOT NULL DEFAULT 0 CHECK (total_population >= 0),
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (percentage >= 0),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert seed data
INSERT INTO acme_family_main_occupation (
    occupation, age_15_19, age_20_24, age_25_29, age_30_34, age_35_39, age_40_44, age_45_49, total_population, percentage
)
VALUES
('MILITARY_OFFICERS', 0, 0, 0, 0, 0, 3, 0, 3, 0.03),
('MANAGERS', 1, 0, 26, 52, 26, 42, 11, 168, 1.62),
('PROFESSIONALS', 0, 11, 58, 54, 41, 14, 4, 182, 1.76),
('TECHNICIANS_AND_ASSOCIATE_PROFESSIONALS', 2, 3, 5, 10, 3, 5, 0, 28, 0.27),
('CLERICAL_SUPPORT_WORKERS', 0, 0, 0, 2, 4, 6, 0, 12, 0.12),
('SERVICE_AND_SALES_WORKERS', 0, 8, 40, 25, 26, 21, 13, 133, 1.28),
('SKILLED_AGRICULTURAL_WORKERS', 58, 644, 995, 1299, 1612, 1638, 1426, 7672, 74.03),
('CRAFT_AND_RELATED_TRADES_WORKERS', 3, 19, 22, 19, 19, 12, 0, 94, 0.91),
('PLANT_AND_MACHINE_OPERATORS', 0, 0, 0, 0, 5, 0, 0, 5, 0.05),
('ELEMENTARY_OCCUPATIONS', 14, 117, 139, 189, 170, 180, 208, 1017, 9.81),
('NOT_SPECIFIED', 0, 0, 0, 0, 0, 3, 0, 3, 0.03),
('ECONOMICALLY_INACTIVE', 30, 187, 156, 116, 146, 207, 204, 1046, 10.09);