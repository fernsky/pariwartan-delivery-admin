-- Set UTF-8 encoding for this script
SET client_encoding = 'UTF8';

-- Drop existing table if it exists to avoid conflicts
DROP TABLE IF EXISTS acme_age_wise_population CASCADE;

-- Drop existing enum types if they exist
DROP TYPE IF EXISTS age_group CASCADE;
DROP TYPE IF EXISTS gender CASCADE;

-- Create age_group enum type with updated Nepali age ranges
CREATE TYPE age_group AS ENUM (
    'AGE_0_4',
    'AGE_5_9',
    'AGE_10_14',
    'AGE_15_19',
    'AGE_20_24',
    'AGE_25_29',
    'AGE_30_34',
    'AGE_35_39',
    'AGE_40_44',
    'AGE_45_49',
    'AGE_50_54',
    'AGE_55_59',
    'AGE_60_64',
    'AGE_65_69',
    'AGE_70_74',
    'AGE_75_79',
    'AGE_80_84',
    'AGE_85_89',
    'AGE_90_94',
    'AGE_95_ABOVE'
);

-- Create gender enum type
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- Create age_wise_population table (removed ward dependency)
CREATE TABLE acme_age_wise_population (
    id VARCHAR(36) PRIMARY KEY,
    age_group age_group NOT NULL,
    gender gender NOT NULL,
    population INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(age_group, gender)
);

-- Create indexes for faster lookups
CREATE INDEX idx_age_gender ON acme_age_wise_population(age_group, gender);

-- Insert age-wise population data
INSERT INTO acme_age_wise_population (id, age_group, gender, population)
VALUES
    -- Age 0-4
    (gen_random_uuid(), 'AGE_0_4', 'MALE', 1052),
    (gen_random_uuid(), 'AGE_0_4', 'FEMALE', 1039),
    
    -- Age 5-9
    (gen_random_uuid(), 'AGE_5_9', 'MALE', 1051),
    (gen_random_uuid(), 'AGE_5_9', 'FEMALE', 982),
    
    -- Age 10-14
    (gen_random_uuid(), 'AGE_10_14', 'MALE', 1182),
    (gen_random_uuid(), 'AGE_10_14', 'FEMALE', 1159),
    
    -- Age 15-19
    (gen_random_uuid(), 'AGE_15_19', 'MALE', 1123),
    (gen_random_uuid(), 'AGE_15_19', 'FEMALE', 1237),
    
    -- Age 20-24
    (gen_random_uuid(), 'AGE_20_24', 'MALE', 920),
    (gen_random_uuid(), 'AGE_20_24', 'FEMALE', 1345),
    
    -- Age 25-29
    (gen_random_uuid(), 'AGE_25_29', 'MALE', 688),
    (gen_random_uuid(), 'AGE_25_29', 'FEMALE', 937),
    
    -- Age 30-34
    (gen_random_uuid(), 'AGE_30_34', 'MALE', 591),
    (gen_random_uuid(), 'AGE_30_34', 'FEMALE', 813),
    
    -- Age 35-39
    (gen_random_uuid(), 'AGE_35_39', 'MALE', 571),
    (gen_random_uuid(), 'AGE_35_39', 'FEMALE', 744),
    
    -- Age 40-44
    (gen_random_uuid(), 'AGE_40_44', 'MALE', 469),
    (gen_random_uuid(), 'AGE_40_44', 'FEMALE', 663),
    
    -- Age 45-49
    (gen_random_uuid(), 'AGE_45_49', 'MALE', 440),
    (gen_random_uuid(), 'AGE_45_49', 'FEMALE', 538),
    
    -- Age 50-54
    (gen_random_uuid(), 'AGE_50_54', 'MALE', 479),
    (gen_random_uuid(), 'AGE_50_54', 'FEMALE', 541),
    
    -- Age 55-59
    (gen_random_uuid(), 'AGE_55_59', 'MALE', 384),
    (gen_random_uuid(), 'AGE_55_59', 'FEMALE', 432),
    
    -- Age 60-64
    (gen_random_uuid(), 'AGE_60_64', 'MALE', 321),
    (gen_random_uuid(), 'AGE_60_64', 'FEMALE', 403),
    
    -- Age 65-69
    (gen_random_uuid(), 'AGE_65_69', 'MALE', 281),
    (gen_random_uuid(), 'AGE_65_69', 'FEMALE', 271),
    
    -- Age 70-74
    (gen_random_uuid(), 'AGE_70_74', 'MALE', 216),
    (gen_random_uuid(), 'AGE_70_74', 'FEMALE', 300),
    
    -- Age 75-79
    (gen_random_uuid(), 'AGE_75_79', 'MALE', 135),
    (gen_random_uuid(), 'AGE_75_79', 'FEMALE', 163),
    
    -- Age 80-84
    (gen_random_uuid(), 'AGE_80_84', 'MALE', 59),
    (gen_random_uuid(), 'AGE_80_84', 'FEMALE', 80),
    
    -- Age 85-89
    (gen_random_uuid(), 'AGE_85_89', 'MALE', 16),
    (gen_random_uuid(), 'AGE_85_89', 'FEMALE', 27),
    
    -- Age 90-94
    (gen_random_uuid(), 'AGE_90_94', 'MALE', 6),
    (gen_random_uuid(), 'AGE_90_94', 'FEMALE', 8),
    
    -- Age 95 and above
    (gen_random_uuid(), 'AGE_95_ABOVE', 'MALE', 1),
    (gen_random_uuid(), 'AGE_95_ABOVE', 'FEMALE', 4);

-- Log success message
DO $$
BEGIN
    RAISE NOTICE 'Age-wise population schema and data created successfully';
END
$$;
