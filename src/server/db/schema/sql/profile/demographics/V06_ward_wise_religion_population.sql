-- Generated SQL script for Religion Population
-- Date: 2025-06-13 12:59:46

-- Create religion type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'religion_type') THEN
        CREATE TYPE religion_type AS ENUM (
            'HINDU', 'BUDDHIST', 'KIRANT', 'CHRISTIAN', 'ISLAM', 'NATURE', 'BON', 'JAIN', 'BAHAI', 'SIKH', 'OTHER'
        );
    END IF;
END
$$;

-- Check if acme_religion_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_religion_population'
    ) THEN
        CREATE TABLE acme_religion_population (
            id VARCHAR(36) PRIMARY KEY,
            religion_type religion_type NOT NULL UNIQUE,
            male_population INTEGER NOT NULL DEFAULT 0,
            female_population INTEGER NOT NULL DEFAULT 0,
            total_population INTEGER NOT NULL DEFAULT 0,
            percentage INTEGER DEFAULT 0,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert data only if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_religion_population) THEN
        INSERT INTO acme_religion_population 
        (id, religion_type, male_population, female_population, total_population, percentage, updated_at, created_at)
        VALUES 
        -- Hindu
        (gen_random_uuid(), 'HINDU', 8049, 9326, 17375, 8018, NOW(), NOW()),
        
        -- Islam
        (gen_random_uuid(), 'ISLAM', 2, 4, 6, 3, NOW(), NOW()),
        
        -- Christian
        (gen_random_uuid(), 'CHRISTIAN', 286, 350, 636, 293, NOW(), NOW()),
        
        -- Buddhist
        (gen_random_uuid(), 'BUDDHIST', 140, 167, 307, 142, NOW(), NOW()),
        
        -- Nature/Kirant
        (gen_random_uuid(), 'NATURE', 1508, 1839, 3347, 1544, NOW(), NOW());
    END IF;
END
$$;

-- Create main schema table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'religion_population'
    ) THEN
        CREATE TABLE religion_population (
            id VARCHAR(36) PRIMARY KEY,
            religion_type religion_type NOT NULL UNIQUE,
            male_population INTEGER NOT NULL DEFAULT 0,
            female_population INTEGER NOT NULL DEFAULT 0,
            total_population INTEGER NOT NULL DEFAULT 0,
            percentage INTEGER DEFAULT 0,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;
