-- Check if acme_mother_tongue_population table exists, if not create it
DO $$
BEGIN
    -- Drop the old ward-based table if it exists
    DROP TABLE IF EXISTS acme_ward_wise_mother_tongue_population;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_mother_tongue_population'
    ) THEN
        -- Create enum type for language types if not exists
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'language_type_enum'
        ) THEN
            CREATE TYPE language_type_enum AS ENUM (
                'NEPALI', 'BHOJPURI', 'मगर(ढुट)', 'DOTELI', 'मगर (खाम)', 'OTHER'
            );
        END IF;

        CREATE TABLE acme_mother_tongue_population (
            id VARCHAR(36) PRIMARY KEY,
            language_type language_type_enum NOT NULL UNIQUE,
            population INTEGER NOT NULL,
            percentage DECIMAL(5,2),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_mother_tongue_population) THEN
        INSERT INTO acme_mother_tongue_population (
            id, language_type, population, percentage
        )
        VALUES
        (gen_random_uuid(), 'NEPALI', 19003, 87.69),
        (gen_random_uuid(), 'BHOJPURI', 14, 0.06),
        (gen_random_uuid(), 'मगर(ढुट)', 166, 0.77),
        (gen_random_uuid(), 'DOTELI', 12, 0.06),
        (gen_random_uuid(), 'मगर (खाम)', 2451, 11.31),
        (gen_random_uuid(), 'OTHER', 25, 0.12);
    END IF;
END
$$;
