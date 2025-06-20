-- Check if acme_ward_wise_electricity_source table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_electricity_source'
    ) THEN
        CREATE TABLE acme_ward_wise_electricity_source (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            electricity_source VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_electricity_source) THEN
        INSERT INTO acme_ward_wise_electricity_source (
            id, ward_number, electricity_source, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'ELECTRICITY', 654),
        (gen_random_uuid(), 1, 'SOLAR', 19),
        (gen_random_uuid(), 1, 'OTHER', 2),
        -- Ward 2
        (gen_random_uuid(), 2, 'ELECTRICITY', 1043),
        (gen_random_uuid(), 2, 'SOLAR', 49),
        (gen_random_uuid(), 2, 'KEROSENE', 2),
        (gen_random_uuid(), 2, 'OTHER', 2),
        -- Ward 3
        (gen_random_uuid(), 3, 'ELECTRICITY', 746),
        (gen_random_uuid(), 3, 'OTHER', 1),
        -- Ward 4
        (gen_random_uuid(), 4, 'ELECTRICITY', 872),
        (gen_random_uuid(), 4, 'SOLAR', 6),
        (gen_random_uuid(), 4, 'OTHER', 1),
        -- Ward 5
        (gen_random_uuid(), 5, 'ELECTRICITY', 782),
        (gen_random_uuid(), 5, 'SOLAR', 35),
        (gen_random_uuid(), 5, 'KEROSENE', 1),
        -- Ward 6
        (gen_random_uuid(), 6, 'ELECTRICITY', 424),
        (gen_random_uuid(), 6, 'SOLAR', 32),
        (gen_random_uuid(), 6, 'OTHER', 11);
    END IF;
END
$$;